// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- //
//  Includes
// ------------------------------
//var MessageQueue = require('message-queue-pebble');  // For switching to Common-JS-Style
//var Zlib = require('zlibjs');  // <-- I need to make this a pebble package

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- //
//  Global Variables
// ------------------------------
//var pebble_supports_color = false;
var watch_info = {"bw" : true, "supports_color" : false, "platform" : "unknown", "width" : 144, "height" : 168, "emulator" : false}; // defaults
var paused = false;
var loading_map = false;
var pokevision_running = false;

// PNG_CHUNK_SIZE has to match same variable in c
// Bigger chunk = faster transfer, but takes more memory
//var PNG_CHUNK_SIZE = 1000;
const PNG_CHUNK_SIZE = 8000;
const PLAYER_TYPE = 255;

const COMMAND_POPULATE_DOTS = 10;

var my_lat = 0,
    my_lon = 0,
    map_lat = 0,
    map_lon = 0,
    zoom = 16;


// ------------------------------------------------------------------------------------------------------------------------------------------------ //
//  Pebble Functions
// ------------------------------
Pebble.addEventListener("ready", function(e) {
  console.log("PebbleKit JS Has Started!");
  //MessageQueue.sendAppMessage({"message":"JavaScript Connected!"}, null, null);  // let watch know JS is ready
  
  watch_info = get_pebble_info();
  if(watch_info.emulator)
    console.log("Emulator Detected: " + watch_info.model + " (" + watch_info.platform + ")");
  else
    console.log("Detected Pebble: " + watch_info.model + " (" + watch_info.platform + ")");

  // Make palette to be able to make PNG images to send to watch later
  make_pebble_png_palette(watch_info.supports_color);
  
  MessageQueue.sendAppMessage({"message" : "Getting GPS Position..."}, null, null);
  start_gps();
});


Pebble.addEventListener("appmessage", function(e) {
  console.log("App Message Received");
  if (typeof e.payload.gps_zoom !== 'undefined') {
    MessageQueue.sendAppMessage({"message":"Downloading Map..."}, null, null);  // Send message to watch
    console.log("Received GPS ZOOM: " + e.payload.gps_zoom);
    var tempzoom = parseInt(e.payload.gps_zoom, 10);
    
    if(tempzoom<=0 || tempzoom > 20) {
      MessageQueue.sendAppMessage({"message":"Invalid Zoom!"}, null, null);
      return;
    }
      
    
    zoom = tempzoom;
    map_lat = my_lat;
    map_lon = my_lon;
    if(map_lat===0 && map_lon===0) {
      console.log("No GPS signal (LAT & LON = 0).  Not sending map.");
      MessageQueue.sendAppMessage({"message":"No GPS Signal"}, null, null);
      return;
    }

    send_google_map_to_pebble(map_lat, map_lon, zoom);
  }
  
  if (typeof e.payload.command !== 'undefined') {
    var command = parseInt(e.payload.command, 10);
    console.log("Command Received: " + command);
    
    //if (command == COMMAND_POPULATE_DOTS)
    send_some_dots_to_pebble();
  }
  
//     // Received Status/Command from Pebble
//     if (typeof e.payload.command !== 'undefined') {
//       if(e.payload.status === COMMAND_OPEN_CONNECTION) {
//         console.log("Task: Create connection...");
//         connect_to_server();
//       } else if(e.payload.status === COMMAND_CLOSE_CONNECTION) {
//         console.log("Task: Close connection...");
//         close_connection();
//       } else {
//         console.log("Received Unknown Status from Pebble C: " + e.payload.status);
//       }
//     }
  
});


function get_pebble_info() {
  var ActiveWatchInfo = {"platform" : "unknown", "model" : "unknown", "emulator" : false};
  if(Pebble.getActiveWatchInfo)
    ActiveWatchInfo = Pebble.getActiveWatchInfo() || {"platform" : "unknown", "model" : "unknown", "emulator" : false};
  
  if(ActiveWatchInfo.model.length>=4 && ActiveWatchInfo.model.toLowerCase().slice(0, 4) == "qemu")
    ActiveWatchInfo.emulator = true;
  
  switch(ActiveWatchInfo.platform.toLowerCase()) {
    case "aplite":  return {"bw" : true,  "supports_color" : false, "platform" : "aplite",  "width" : 144, "height" : 168, "model" : ActiveWatchInfo.model, "emulator" : ActiveWatchInfo.emulator};
    case "basalt":  return {"bw" : false, "supports_color" : true,  "platform" : "basalt",  "width" : 144, "height" : 168, "model" : ActiveWatchInfo.model, "emulator" : ActiveWatchInfo.emulator};
    case "chalk":   return {"bw" : false, "supports_color" : true,  "platform" : "chalk",   "width" : 180, "height" : 180, "model" : ActiveWatchInfo.model, "emulator" : ActiveWatchInfo.emulator};
    case "diorite": return {"bw" : true,  "supports_color" : false, "platform" : "diorite", "width" : 144, "height" : 168, "model" : ActiveWatchInfo.model, "emulator" : ActiveWatchInfo.emulator};
    case "emery":   return {"bw" : false, "supports_color" : true,  "platform" : "emery",   "width" : 200, "height" : 228, "model" : ActiveWatchInfo.model, "emulator" : ActiveWatchInfo.emulator};
    default:        return {"bw" : true,  "supports_color" : false, "platform" : "unknown", "width" : 144, "height" : 168, "model" : ActiveWatchInfo.model, "emulator" : ActiveWatchInfo.emulator};
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //
//  Helper Functions
// ------------------------------------------------------------------------------------------------------------------------ //
var XHR_DOWNLOAD_TIMEOUT = 20000;

var XHR_LOG_NONE     = 0,   // No Logging
    XHR_LOG_ERRORS   = 1,   // Log errors
    XHR_LOG_SUCCESS  = 2,   // Log successes
    XHR_LOG_MESSAGES = 4,   // Log messages
    XHR_LOG_VERBOSE  = 255; // Log everything

// Note: Add to log multiple things, e.g.: success + error to log both successes and errors

var xhrRequest = function (url, responseType, get_or_post, params, header, xhr_log_level, success, error) {
  if(xhr_log_level & XHR_LOG_MESSAGES) console.log('[XHR] Requesting URL: "' + url + '"');
  
  var request = new XMLHttpRequest();
  
 request.xhrTimeout = setTimeout(function() {
    if(xhr_log_level & XHR_LOG_ERRORS) console.log("[XHR] Timeout Getting URL: " + url);
    request.onload = null;  // Stopping a "fail then success" scenario
    error("[XHR] Timeout Getting URL: " + url);
  }, XHR_DOWNLOAD_TIMEOUT);  
  
  request.onload = function() {
    // got response, no more need for a timeout, so clear it
    clearTimeout(request.xhrTimeout); // jshint ignore:line
    
    if (this.readyState == 4 && this.status == 200) {
      if(!responseType || responseType==="" || responseType.toLowerCase()==="text") {
        if(xhr_log_level & XHR_LOG_SUCCESS) console.log("[XHR] Success: " + this.responseText);
        success(this.responseText);
      } else {
        if(xhr_log_level & XHR_LOG_SUCCESS) console.log("[XHR] Success: [" + responseType + " data]");
        success(this.response);
      }
    } else {
      if(xhr_log_level & XHR_LOG_ERRORS) console.log("[XHR] Error: " + this.responseText);
      error(this.responseText);
    }
  };
  
  request.onerror = function() {
    if(xhr_log_level & XHR_LOG_ERRORS) console.log("[XHR] Error: Unknown failure");
    error("[XHR] Error: Unknown failure");
  };

  var paramsString = "";
  if (params !== null) {
    for (var i = 0; i < params.length; i++) {
      paramsString += params[i];
      if (i < params.length - 1) {
        paramsString += "&";
      }
    }
  }

  if (get_or_post.toUpperCase() == 'GET' && paramsString !== "") {
    url += "?" + paramsString;
  }

  request.open(get_or_post.toUpperCase(), url, true);
  
  if (responseType)
    request.responseType = responseType;
  
  if (header !== null) {
    if(xhr_log_level & XHR_LOG_MESSAGES) console.log("[XHR] Header Found: "+ header[0] + " : "+ header[1]);
    request.setRequestHeader(header[0], header[1]);
  }

  if (get_or_post.toUpperCase() == 'POST') {
    request.send(paramsString);
  } else {
    request.send();
  }
};


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Send MAP to watch
// ------------------------------
function send_map_center_to_pebble(center_latitude, center_longitude, zoom) {
  var lat_int = Math.round((center_latitude  / 360) * 8388608);
  var lon_int = Math.round((center_longitude / 360) * 8388608);
  console.log("Sending map center to pebble: (" + center_latitude + ", " + center_longitude + ") = (" + lat_int + ", " + lon_int + ") with zoom = " + zoom);
  MessageQueue.sendAppMessage({"gps_lat" : lat_int, "gps_lon" : lon_int, "gps_zoom" : zoom},
                              function(){console.log("Successfully sent map center to pebble");},
                              function(){console.log("Failed sending position to pebble");}
                             );
}


function send_google_map_to_pebble(center_latitude, center_longitude, zoom) {
  if(loading_map) {
    MessageQueue.sendAppMessage({"message":""}, null, null);
    console.log("Already downloading a map. Aborting."); return;
  }
  send_map_center_to_pebble(center_latitude, center_longitude, zoom);

  var url = "https://maps.googleapis.com/maps/api/staticmap?maptype=map&center=" + center_latitude + "," + center_longitude + "&zoom=" + zoom + "&size=" + watch_info.width + "x" + watch_info.height;
  
  paused = true;  // Stop updating our position until map is sent to pebble
  loading_map = true;
  download_PNG(url, function(png_file) {
    console.log("Successfully downloaded PNG.  Converting...");
    var image_data = extract_PNG_image_data(png_file);
    image_data = rob_brightness_contrast(image_data, -80, 40);
    image_data = rob_atkinson_dither(image_data, watch_info.supports_color);
    var png = generate_PNG_for_Pebble(image_data);
    send_PNG_to_Pebble(png, function() {
      // After successfully sending google map image, send our position
      paused = false;
      loading_map = false;
      send_position_to_pebble(PLAYER_TYPE, my_lat, my_lon);
      
      // If this is the first time map has been sent, now download and send pokemon positions
      if(!pokevision_running) {
        get_pokevision(my_lat, my_lon);
      }
      
    }, function(data, error) {
      paused = false;
      loading_map = false;
      console.log("Failed to send image to watch.  Error: " + error);
      MessageQueue.sendAppMessage({"message":"Map Failed"}, null, null);
    });
  }, function(e) {
    paused = false;
    loading_map = false;
    console.log("Failed to download google map.  Error: " + e);
    MessageQueue.sendAppMessage({"message":"Download Failed"}, null, null);
  });
}


function send_PNG_to_Pebble(png, success_callback, error_callback) {
  var bytes = 0;
  var send_chunk = function() {
    if(bytes >= png.length) {success_callback(); return;}
    var nextSize = png.length-bytes > PNG_CHUNK_SIZE ? PNG_CHUNK_SIZE : png.length - bytes;
    var sliced = png.slice(bytes, bytes + nextSize);
    // Send chunk and if successful, call this function again to send next chunk
    MessageQueue.sendAppMessage({"png_index":bytes, "png_chunk":sliced}, send_chunk, error_callback);
    console.log("Sending " + bytes + "/" + png.length);
    bytes += nextSize;
  };
  MessageQueue.sendAppMessage({"png_size": png.length}, send_chunk, error_callback); // Send size, then send first chunk
}



function download_PNG(url, success, error) {
  xhrRequest(url, "arraybuffer", "GET", null, null, XHR_LOG_VERBOSE, success, error);
}


function extract_PNG_image_data(png_file) {
  var png_data = new Uint8Array(png_file);
  var png      = new PNG(png_data);  // jshint ignore:line
  var pixels   = png.decodePixels();
  //console.log("PNG: " + png.width + "w x " + png.height + "h");

  if(png.palette.length > 0) {
    console.log("theres a palette");
    //var palette  = png.decodePalette();                                // TODO: this adds transparency support to palette
    var pixels_rgba = new Uint8ClampedArray(png.width * png.height * 3);
    for(var i=0; i<pixels.length; i++) {
      pixels_rgba[i*3+0] = png.palette[3*pixels[i]+0] & 0xFF;
      pixels_rgba[i*3+1] = png.palette[3*pixels[i]+1] & 0xFF;
      pixels_rgba[i*3+2] = png.palette[3*pixels[i]+2] & 0xFF;
      //pixels_rgba[i*4+3] = palette[4*pixels[i]+3] & 0xFF;
    }
    pixels = pixels_rgba;
  }
  return {"height":png.height, "width":png.width, "data":pixels};
}

// ----------------------------------------------------------------------------------------------------------------------------------
//  Image Manipulation Functions
// ------------------------------
// image_data: an object representing an image (sorta like canvas's ImageData object):
//    .width:  The image width
//    .height: The image height
//    .data:   A Uint8ClampedArray of rgb or rgba pixels
// output_width / output_height: The desired size for the new image
// fit image: if image doesn't scale to exactly fill screen
//   TRUE  = zoom to fit the image to screen, shows whole image but has whitespace
//   FALSE = zoom to fill the screen with image, but loses part of image
// returns:
//   The new resized image_data object (leaves input image untouched)
function resize_image_data(image_data, output_width, output_height, fit_image) {
  var new_width, new_height;
  console.log("Starting resize image = " + image_data.width + "w x " + image_data.height + "h");
  
  var bytes_per_pixel =  Math.round(image_data.data.length / (image_data.width * image_data.height));  // 3 for rgb, 4 for rgba.  Shouldn't need to round, but just being safe
	var ratio = ((output_width / image_data.width) < (output_height / image_data.height));
  
	if(fit_image)
		ratio = !ratio;
  
	if(ratio) {
		new_width = Math.round(image_data.width * (output_height / image_data.height));
		new_height = output_height;
	} else {
		new_width = output_width;
		new_height = Math.round(image_data.height * (output_width / image_data.width));
	}
	console.log("output dimensions = " + new_width + "w x " + new_height + "h");
  if(new_width==image_data.width && new_height==image_data.height) {
    console.log ("No scaling necessary.");
    return image_data;
  }
    
  console.log("gonna scale image");
  var output_pixel_buffer = new ArrayBuffer(w*h*bytes_per_pixel);  // jshint ignore:line
  var output_array = new Uint8ClampedArray(output_pixel_buffer);
  ScaleRect(output_array, image_data.data, image_data.width, image_data.height, new_width, new_height, bytes_per_pixel);
  return {"height":new_height, "width":new_width, "data":output_array};
}


// Scaline & ScaleRect algorithms from : http://www.compuphase.com/graphic/scale.htm 
function ScaleLine(Target, Source, SrcWidth, TgtWidth, offset_target, offset_source, bytes_per_pixel) {
  var NumPixels = TgtWidth;
  var IntPart = Math.floor(SrcWidth / TgtWidth);
  var FractPart = SrcWidth % TgtWidth;
  var E = 0;

  var i_target = offset_target;
  var i_source = offset_source;

  while (NumPixels-- > 0) {
    for(var i=0; i<bytes_per_pixel; i++)
      Target[bytes_per_pixel*i_target + i] = Source[bytes_per_pixel*i_source + i];
    i_target++;
    i_source += IntPart;
    E += FractPart;
    if (E >= TgtWidth) {
      E -= TgtWidth;
      i_source ++;
    } // if
  } // while
}

function ScaleRect(Target, Source, SrcWidth, SrcHeight, TgtWidth, TgtHeight, bytes_per_pixel) {
  var NumPixels = TgtHeight;
  var IntPart = Math.floor(SrcHeight / TgtHeight) * SrcWidth;
  var FractPart = SrcHeight % TgtHeight;
  var E = 0;

  var i_target = 0;
  var i_source = 0;

  while (NumPixels-- > 0) {
    ScaleLine(Target, Source, SrcWidth, TgtWidth, i_target, i_source, bytes_per_pixel);
    //PrevSource = Source;  // rob: commented this out cause it doesn't seem to do anything? 20160710

    i_target += TgtWidth;
    i_source += IntPart;
    E += FractPart;
    if (E >= TgtHeight) {
      E -= TgtHeight;
      i_source += SrcWidth;
    } // if
  } // while
}


function rob_brightness_contrast(image_data, brightness, contrast) {
// Brightness = [-256 to 256] and Contrast = [-100 to 100]
  var bytes_per_pixel = Math.round(image_data.data.length / (image_data.width * image_data.height));  // 3 for rgb, 4 for rgba.  Shouldn't need to round, but just being safe
  var pixels = new Uint8ClampedArray(image_data.data);
	var bAdjust = Math.floor(brightness);
	var cAdjust = (contrast + 100) / 100;
	    cAdjust = cAdjust * cAdjust;

	for (var i = 0; i < pixels.length; i += bytes_per_pixel) {
    for (var rgb = 0; rgb < 3; rgb++) {
      pixels[i + rgb] += bAdjust;                                 // Brightness
      pixels[i + rgb]  = (pixels[i + rgb] - 128) * cAdjust + 128; // Contrast
    }
	}
  //image_data.data = pixels;                                                    // modifies image_data object, doesn't return anything
  return {"height":image_data.height, "width":image_data.width, "data":pixels};  // return new image object, doesn't modify image_data object
}



function rob_atkinson_dither(image_data, is_color) {
	var r, g, b, approx_r, approx_g, approx_b, affected_pixel;
  const r_part = 0, g_part = 1, b_part = 2;  // jshint ignore:line
  
  var pixels = new Uint8ClampedArray(image_data.data);
  var bytes_per_pixel =  Math.round(pixels.length / (image_data.width * image_data.height));
  var image_data_width = bytes_per_pixel * image_data.width;
  
  for (var source_pixel = 0; source_pixel < pixels.length; source_pixel +=bytes_per_pixel) {
    if(is_color) {
      approx_r = (pixels[source_pixel + r_part] >>> 6) * 85;
      approx_g = (pixels[source_pixel + g_part] >>> 6) * 85;
      approx_b = (pixels[source_pixel + b_part] >>> 6) * 85;
    } else {
      approx_r = approx_g = approx_b =
        ((pixels[source_pixel + r_part] * 3 +
          pixels[source_pixel + g_part] * 4 +
          pixels[source_pixel + b_part]) >>> 10) * 255;
    }
    
    r = (pixels[source_pixel + r_part] - approx_r) >> 3;
    g = (pixels[source_pixel + g_part] - approx_g) >> 3;
    b = (pixels[source_pixel + b_part] - approx_b) >> 3;
    
    // diffuse the error for three colors
    affected_pixel = source_pixel + bytes_per_pixel;     // 1 pixel right of our pixel
    pixels[affected_pixel + r_part] += r;
    pixels[affected_pixel + g_part] += g;
    pixels[affected_pixel + b_part] += b;

    affected_pixel += bytes_per_pixel;                 // 1 more pixel right
    pixels[affected_pixel + r_part] += r;
    pixels[affected_pixel + g_part] += g;
    pixels[affected_pixel + b_part] += b;

    affected_pixel = source_pixel + image_data_width;  // 1 pixel down from our pixel
    pixels[affected_pixel + r_part] += r;
    pixels[affected_pixel + g_part] += g;
    pixels[affected_pixel + b_part] += b;

    affected_pixel += bytes_per_pixel;                 // 1 down, 1 right
    pixels[affected_pixel + r_part] += r;
    pixels[affected_pixel + g_part] += g;
    pixels[affected_pixel + b_part] += b;

    affected_pixel += bytes_per_pixel;                 // 1 down 2 right
    pixels[affected_pixel + r_part] += r;
    pixels[affected_pixel + g_part] += g;
    pixels[affected_pixel + b_part] += b;

    affected_pixel = source_pixel + image_data_width + image_data_width +
      bytes_per_pixel + bytes_per_pixel;               // 2 down, 2 right
    pixels[affected_pixel + r_part] += r;
    pixels[affected_pixel + g_part] += g;
    pixels[affected_pixel + b_part] += b;

    // draw pixel
    pixels[source_pixel + r_part] = approx_r;
    pixels[source_pixel + g_part] = approx_g;
    pixels[source_pixel + b_part] = approx_b;
  }
  return {"height":image_data.height, "width":image_data.width, "data":pixels};
}














// ----------------------------------------------------------------------------------------------------------------------------------
//  PokeVision Functions
// ------------------------------
function pokevision_success(response_text) {
  console.log("Data URL Response: " + response_text);
  try {
    var json = JSON.parse(response_text);
    
    // TODO: status check!
    console.log('status is "' + json.status + '"');

    // TODO: much better error checking???
    if (json.pokemon.length > 0) {
      MessageQueue.sendAppMessage({"message":"Found Pokemans!"}, null, null);
      // Actually transfer all da pokee mans, man oh man
      for (var i = 0; i < json.pokemon.length - 1; i++) {
        // TODO: should still actually verify vs. using blindly!
        // PokeVision is string for some reason
        var pokemonId = Number(json.pokemon[i].pokemonId);
        var pokemonExpirationTime = json.pokemon[i].expiration_time;
        var pokemonLatitude = json.pokemon[i].latitude;
        var pokemonLongitude = json.pokemon[i].longitude;
        console.log(i + ". Pokemon " + pokemonId + ": (" + pokemonLatitude + ", " + pokemonLongitude + ") Expires " + pokemonExpirationTime);
        if(pokemonId!=255)
          send_position_to_pebble(pokemonId, pokemonLatitude, pokemonLongitude);
        // TODO: pokemonExpirationTime
      }
      MessageQueue.sendAppMessage({"message":"Done"}, null, null);
    } else {
      MessageQueue.sendAppMessage({"message":"No Pokemon found!"}, null, null);
    }
  } catch (e) {
    MessageQueue.sendAppMessage({"message":"PokeVision Error"}, null, null);
  }
}


function pokevision_error(e) {
  console.log("Failed to access pokevision.  Error: " + e);
  MessageQueue.sendAppMessage({"message":"PokeVision Error"}, null, null);
}



function get_pokevision(lat, lon) {
  MessageQueue.sendAppMessage({"message":"Requesting Pokemans"}, null, null);
  
  pokevision_running = true;
  setTimeout(function(){ get_pokevision(lat, lon);}, 60000);
  
  // live PokeVision data
  var scanUrl = 'https://pokevision.com/map/scan/' + lat + '/' + lon;
  var dataUrl = 'https://pokevision.com/map/data/' + lat + '/' + lon;

  // static (stable!) example of PokeVision data
  //var scanUrl = 'https://mathewreiss.github.io/PoGO/data.json';
  //var dataUrl = 'https://mathewreiss.github.io/PoGO/data.json';

  // TODO: is this OK?
  xhrRequest(scanUrl, "text", "GET", null, null, XHR_LOG_VERBOSE, 
             function () {
               xhrRequest(dataUrl, "text", "GET", null, null, XHR_LOG_VERBOSE, pokevision_success, pokevision_error);
             }, pokevision_error);
}



// ----------------------------------------------------------------------------------------------------------------------------------
//  GPS Functions
// ------------------------------
function send_some_dots_to_pebble() {
  MessageQueue.sendAppMessage({"message":"Select Disabled"}, null, null);
  //get_pokevision(my_lat, my_lon);  // Manually request new pokemans
}


// Type = 255 means Player
function send_position_to_pebble(type, the_lat, the_lon) {
  if(paused) return;  // don't send if paused
  var lat_int = Math.round((the_lat / 360) * 8388608);
  var lon_int = Math.round((the_lon / 360) * 8388608);
  console.log("Sending player position to pebble: (" + the_lat + ", " + the_lon + ") = (" + lat_int + ", " + lon_int + ")");
  MessageQueue.sendAppMessage({"gps_type" : type, "gps_lat" : lat_int, "gps_lon" : lon_int},
                              function(){console.log("Successfully sent position to pebble: (" + lat_int + ", " + lon_int + ")");},
                              function(){console.log("Failed sending position to pebble");}
                             );
}


function location_success(pos) {
  // If the position DIDN'T change (why was this function called??)
  if(pos.coords.latitude===my_lat && pos.coords.longitude===my_lon) return;
  
  my_lat = pos.coords.latitude; my_lon = pos.coords.longitude;
  console.log('GPS location changed!  (' + my_lat + ', ' + my_lon + ")");
  send_position_to_pebble(PLAYER_TYPE, my_lat, my_lon); // Send player position
}


function location_error(err) {
  if(err.code == err.PERMISSION_DENIED) {
    console.log('Location access was denied by the user.');  
  } else {
    console.log('location error (' + err.code + '): ' + err.message);
  }
}
  
  
function start_gps() {
  // Subscribe to GPS updates
  var location_options = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
  };
  //var watchId =   // An ID to store to later clear the GPS watchPosition subscription
      navigator.geolocation.watchPosition(location_success, location_error, location_options);
}