#include <pebble.h>
// Global constants
#define MAX_ACTORS 250

char * pokemon_names[] = {
  "Unknown",
  "Bulbasaur",
  "Ivysaur",
  "Venusaur",
  "Charmander",
  "Charmeleon",
  "Charizard",
  "Squirtle",
  "Wartortle",
  "Blastoise",
  "Caterpie",
  "Metapod",
  "Butterfree",
  "Weedle",
  "Kakuna",
  "Beedrill",
  "Pidgey",
  "Pidgeotto",
  "Pidgeot",
  "Rattata",
  "Raticate",
  "Spearow",
  "Fearow",
  "Ekans",
  "Arbok",
  "Pikachu",
  "Raichu",
  "Sandshrew",
  "Sandslash",
  "Nidoran♀",
  "Nidorina",
  "Nidoqueen",
  "Nidoran♂",
  "Nidorino",
  "Nidoking",
  "Clefairy",
  "Clefable",
  "Vulpix",
  "Ninetales",
  "Jigglypuff",
  "Wigglytuff",
  "Zubat",
  "Golbat",
  "Oddish",
  "Gloom",
  "Vileplume",
  "Paras",
  "Parasect",
  "Venonat",
  "Venomoth",
  "Diglett",
  "Dugtrio",
  "Meowth",
  "Persian",
  "Psyduck",
  "Golduck",
  "Mankey",
  "Primeape",
  "Growlithe",
  "Arcanine",
  "Poliwag",
  "Poliwhirl",
  "Poliwrath",
  "Abra",
  "Kadabra",
  "Alakazam",
  "Machop",
  "Machoke",
  "Machamp",
  "Bellsprout",
  "Weepinbell",
  "Victreebel",
  "Tentacool",
  "Tentacruel",
  "Geodude",
  "Graveler",
  "Golem",
  "Ponyta",
  "Rapidash",
  "Slowpoke",
  "Slowbro",
  "Magnemite",
  "Magneton",
  "Farfetch'd",
  "Doduo",
  "Dodrio",
  "Seel",
  "Dewgong",
  "Grimer",
  "Muk",
  "Shellder",
  "Cloyster",
  "Gastly",
  "Haunter",
  "Gengar",
  "Onix",
  "Drowzee",
  "Hypno",
  "Krabby",
  "Kingler",
  "Voltorb",
  "Electrode",
  "Exeggcute",
  "Exeggutor",
  "Cubone",
  "Marowak",
  "Hitmonlee",
  "Hitmonchan",
  "Lickitung",
  "Koffing",
  "Weezing",
  "Rhyhorn",
  "Rhydon",
  "Chansey",
  "Tangela",
  "Kangaskhan",
  "Horsea",
  "Seadra",
  "Goldeen",
  "Seaking",
  "Staryu",
  "Starmie",
  "Mr. Mime",
  "Scyther",
  "Jynx",
  "Electabuzz",
  "Magmar",
  "Pinsir",
  "Tauros",
  "Magikarp",
  "Gyarados",
  "Lapras",
  "Ditto",
  "Eevee",
  "Vaporeon",
  "Jolteon",
  "Flareon",
  "Porygon",
  "Omanyte",
  "Omastar",
  "Kabuto",
  "Kabutops",
  "Aerodactyl",
  "Snorlax",
  "Articuno",
  "Zapdos",
  "Moltres",
  "Dratini",
  "Dragonair",
  "Dragonite",
  "Mewtwo",
  "Mew"
};
  
typedef struct ActorStruct {
  int32_t lat;
  int32_t lon;
  int32_t px;
  int32_t py;
  uint8_t type;
  time_t expire_time;
  bool enabled;
} ActorStruct;
ActorStruct actor[MAX_ACTORS];  // actor 0 = player

// Map Center
int32_t map_lat = 0;
int32_t map_lon = 0;
uint8_t map_zoom = 16;
//int32_t map_zoom = 16;

// Screen size
GSize screen;// = (GSize){.w = 144, .h=168};

bool js_ready = false;
char *message_text;  // Display textbox on screen
char text_buffer[100] = "";
uint8_t command = 0;

static Window *window;

static BitmapLayer  *image_layer;
static GBitmap      *image = NULL;
static uint8_t      *data_image = NULL;
static uint32_t     data_size;

//static TextLayer    *text_layer;
static Layer        *graphics_layer;
static Layer        *root_layer;
static GRect         root_frame;

#define KEY_PNG_CHUNK   0
#define KEY_PNG_INDEX   1
#define KEY_PNG_SIZE    2

#define KEY_GPS_TYPE    3
#define KEY_GPS_LAT     4
#define KEY_GPS_LON     5
#define KEY_GPS_ZOOM    6

#define KEY_MESSAGE     7
#define KEY_COMMAND     8

#define COMMAND_POPULATE_DOTS 10

// PNG_CHUNK_SIZE has to match same value in javascript
//#define PNG_CHUNK_SIZE 1000
#define PNG_CHUNK_SIZE 8000

// ------------------------------------------------------------------------ //
//  Popup Functions
// ------------------------------------------------------------------------ //
static void remove_popup(void *data) {
  printf("MESSAGE CLEAR");
  message_text = "";
  layer_mark_dirty(root_layer);
}

#define POPUP_MESSAGE_DURATION 3000
static void popup_message(char *message) {
  static AppTimer *timer = NULL;
  if (!timer || !app_timer_reschedule(timer, POPUP_MESSAGE_DURATION))
    timer = app_timer_register(POPUP_MESSAGE_DURATION, remove_popup, NULL);
  layer_mark_dirty(root_layer);
  message_text = message;
  if(message_text[0]) return;
//   app_timer_cancel(timer);
//   timer = NULL;
}

// ------------------------------------------------------------------------ //
//  GPS Functions
// ------------------------------------------------------------------------ //
// GPS Constants
// I convert all floating point GPS coordinates to 32bit integers

#define EARTH_RADIUS_IN_METERS 6378137
#define EARTH_CIRCUMFERENCE_IN_METERS 40075016
#define MAX_GPS_ANGLE 8388608    // Equivalent to 360 degrees

// 64bit GPS constants
#define EARTH_RADIUS_IN_METERS_64BIT 6378137LL
#define EARTH_CIRCUMFERENCE_IN_METERS_64BIT 40075016LL
#define MAX_GPS_ANGLE_64BIT 8388608LL
#define TRIG_MAX_RATIO_64BIT 65536LL  // I know it's 65535, but this is close enough



// adapted from: https://msdn.microsoft.com/en-us/library/bb259689.aspx
int32_t convert_distance_to_pixels(int32_t zoom, int32_t lat, int32_t dist_in_meters) {
  int32_t distance_in_pixels = (int32_t) (
    (
      (int64_t) dist_in_meters *
      (TRIG_MAX_RATIO_64BIT * 256LL << zoom) 
    ) / (
      (int64_t) cos_lookup(lat/128) *      // distance changes per latitude
      EARTH_CIRCUMFERENCE_IN_METERS_64BIT
    )
  );
  return (distance_in_pixels);
}



// Returns vertical distance (in meters) between two latitudes
static int32_t gps_lat_distance(int32_t lat1, int32_t lat2) {
  //int32_t lat_distance = EARTH_CIRCUMFERENCE_IN_METERS * (lat2 - lat1) / MAX_GPS_ANGLE;
  int32_t lat_distance = (
    (
      EARTH_CIRCUMFERENCE_IN_METERS_64BIT *
      (int64_t) (lat2 - lat1)
    ) / (
      MAX_GPS_ANGLE_64BIT
    )
  );
  return lat_distance;
}



// Returns horizontal distance (in meters) between two longitudinal points at a specific latitude
static int32_t gps_lon_distance(int32_t lat, int32_t lon1, int32_t lon2) {
  //return cos_lookup((map_lat/128)) * EARTH_CIRCUMFERENCE_IN_METERS * (pos_lon - map_lon) / (MAX_GPS_ANGLE * TRIG_MAX_RATIO);
  int32_t lon_distance = (
    (
      (int64_t) cos_lookup(lat/128) *
      EARTH_CIRCUMFERENCE_IN_METERS_64BIT *
      (int64_t) (lon2 - lon1)
    ) / (
      MAX_GPS_ANGLE_64BIT *
      TRIG_MAX_RATIO_64BIT
    )
  );
  return lon_distance;
}



static void display_32bit_gps_distance(int32_t pos_lat, int32_t pos_lon, int32_t map_lat, int32_t map_lon, int32_t zoom) {
  printf("display_32bit_gps_distance(%ld, %ld, %ld, %ld, %ld)", pos_lat, pos_lon, map_lat, map_lon, zoom);
  int32_t lat_distance = gps_lat_distance(map_lat, pos_lat);
  int32_t lon_distance = gps_lon_distance(map_lat, map_lon, pos_lon);
  printf("distance: (%ld, %ld) meters", lat_distance, lon_distance);
  
  int32_t lat_dist_px = convert_distance_to_pixels(zoom, map_lat, lat_distance);
  int32_t lon_dist_px = convert_distance_to_pixels(zoom, map_lat, lon_distance);
  printf("distance: (%ld, %ld) pixels", lat_dist_px, lon_dist_px);
}



static void display_32bit_gps_coords(int32_t lat, int32_t lon) {
  int lat_i_part = (lat * 360) / MAX_GPS_ANGLE;  // whole degree part
  int lat_f_part = (lat * 360) % MAX_GPS_ANGLE;  // f_part = [0 to MAX_GPS_ANGLE-1] for [0.000000 to 0.999999]
  lat_f_part = (((int64_t)(lat_f_part<0 ? -lat_f_part : lat_f_part) * 100000LL) / MAX_GPS_ANGLE_64BIT);
  
  int lon_i_part = (lon * 360) / MAX_GPS_ANGLE;  // whole degree part
  int lon_f_part = (lon * 360) % MAX_GPS_ANGLE;  // f_part = [0 to MAX_GPS_ANGLE-1] for [0.000000 to 0.999999]
  lon_f_part = (((int64_t)(lon_f_part < 0 ? -lon_f_part : lon_f_part) * 100000LL) / MAX_GPS_ANGLE_64BIT);
  
  //printf("32bit GPS (%ld, %ld) to Degrees: (%d.%05d, %d.%05d)", lat, lon, lat_i_part, lat_f_part, lon_i_part, lon_f_part);
  printf("GPS coordinates: (%d.%05d, %d.%05d)", lat_i_part, lat_f_part, lon_i_part, lon_f_part);
}


static void update_actor_pixel_positions() {
  for(uint8_t i = 0; i < MAX_ACTORS; i++) {
    if(actor[i].enabled) {
      int32_t lat_distance = gps_lat_distance(map_lat, actor[i].lat);
      int32_t lon_distance = gps_lon_distance(map_lat, map_lon, actor[i].lon);
      //printf("Actor %d (type %d) distance: (%ld, %ld) meters from map center", i, type, lat_distance, lon_distance);

      int32_t lat_dist_px = convert_distance_to_pixels(map_zoom, map_lat, lat_distance);
      int32_t lon_dist_px = convert_distance_to_pixels(map_zoom, map_lat, lon_distance);

      actor[i].px = lon_dist_px;
      actor[i].py = lat_dist_px;
    }
  }
}





// ------------------------------------------------------------------------ //
//  AppMessage Functions
// ------------------------------------------------------------------------ //
static void request_map(void *data) {
  printf("Requesting New Map from Javascript");
  if(!js_ready) {printf("Javascript not ready"); return;}
  popup_message("Requesting map...");
  DictionaryIterator *iter;
  if (app_message_outbox_begin(&iter)) {printf("Cannot request map: Error Preparing Outbox"); return;}
  if (dict_write_uint8(iter, KEY_GPS_ZOOM, map_zoom)) {printf("Cannot request map: Failed to write uint8"); return;}
  dict_write_end(iter);
  app_message_outbox_send();
}

// Request new map immediately
//   unless already requested within MAP_REQUEST_DELAY milliseconds
//     then just silently fail
static void schedule_map_request(void *data) {
  #define MAP_REQUEST_DELAY 5000     // shortest delay between multiple map requests
  static AppTimer *map_timer = NULL;
   if (!map_timer || !app_timer_reschedule(map_timer, MAP_REQUEST_DELAY)) {
     request_map(NULL);
     map_timer = app_timer_register(MAP_REQUEST_DELAY, NULL, NULL);
   } 
}


// Wait [delay] milliseconds before requesting map.
// if called again before [delay] milliseconds, reset timer to wait [delay] milliseconds
static void schedule_map_request_delay(uint32_t delay) {
  static AppTimer *map_timer = NULL;
   if (!map_timer || !app_timer_reschedule(map_timer, delay))
     //map_timer = app_timer_register(delay, schedule_map_request, NULL);
     map_timer = app_timer_register(delay, request_map, NULL);
}


static void send_command(uint8_t command) {
  printf("Sending Command: %d", command);
  if (!js_ready) {printf("Cannot send command: Javascript not ready"); return;}
  DictionaryIterator *iter;
  if (app_message_outbox_begin(&iter)) {printf("Cannot send command: Error Preparing Outbox"); return;}
  if (dict_write_uint8(iter, KEY_COMMAND, command)) {printf("Cannot send command: Failed to write uint8"); return;}
  dict_write_end(iter);
  app_message_outbox_send();
}


static void appmessage_in_received_handler(DictionaryIterator *iter, void *context) {
  js_ready = true;
  
  // If update GPS 32bit coords
  Tuple *lat_tuple  = dict_find(iter, KEY_GPS_LAT);
  Tuple *lon_tuple  = dict_find(iter, KEY_GPS_LON);
  if(lat_tuple && lon_tuple) {
    int32_t lat = lat_tuple->value->int32;
    int32_t lon = lon_tuple->value->int32;
    
    // if ZOOM is there, this is a MAP GPS update
    Tuple *zoom_tuple  = dict_find(iter, KEY_GPS_ZOOM);
    if(zoom_tuple) {
      map_zoom = zoom_tuple->value->uint8;
      map_lat = lat;
      map_lon = lon;
      printf("Received new map coords: (%ld, %ld) zoom %d", lat, lon, map_zoom);
    } else {
      // Else, is an actor update
      // If TYPE doesn't exist (or =255), it's the Player (Type 255)
      uint8_t type = 255, i = 0;
      Tuple *type_tuple  = dict_find(iter, KEY_GPS_TYPE);
      if(type_tuple) type = type_tuple->value->uint8;

      // type 255 is "player"
      if(type != 255) {
        printf("Found %d (%s) at (%ld, %ld)", type, pokemon_names[type], lat, lon);
        do {i++;} while ( (i < MAX_ACTORS) && (actor[i].enabled) );    // find next free actor spot (not i=0)
        snprintf(text_buffer, sizeof(text_buffer), "%d: Found %s", i, pokemon_names[type]);
        popup_message(text_buffer);
      }
      // printf("Actor %d (type %d) at:", i, type); display_32bit_gps_coords(lat, lon);
      // int32_t lat_distance = gps_lat_distance(map_lat, lat);
      // int32_t lon_distance = gps_lon_distance(map_lat, map_lon, lon);
      // printf("Actor %d (type %d) distance: (%ld, %ld) meters from map center", i, type, lat_distance, lon_distance);
      // int32_t lat_dist_px = convert_distance_to_pixels(map_zoom, map_lat, lat_distance);
      // int32_t lon_dist_px = convert_distance_to_pixels(map_zoom, map_lat, lon_distance);
      // printf("Actor %d (type %d) distance: (%ld, %ld) pixels from map center", i, type, lat_dist_px, lon_dist_px);
      if (i < MAX_ACTORS) {
        actor[i].lat = lat;
        actor[i].lon = lon;
        actor[i].enabled = true;
        actor[i].type = type;
        printf("Saving actor into position %d", i);
      } else {
        printf("No actor spots left!  Cannot load type: %d.", type);
      }
      layer_mark_dirty(root_layer);
    }
  }

  // If there's a message, display it on the screen
  Tuple *message_tuple = dict_find(iter, KEY_MESSAGE);
  if (message_tuple) {
    snprintf(text_buffer, sizeof(text_buffer), "%s", message_tuple->value->cstring);
    popup_message(text_buffer);
  }

  // If there's a PNG_SIZE, starting a new PNG
  Tuple *size_tuple  = dict_find(iter, KEY_PNG_SIZE);
  if (size_tuple) {
    if (data_image)
      free(data_image);
    data_size = size_tuple->value->uint32;
    data_image = malloc(data_size);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "New image starting: size = %d bytes", (int)data_size);
  }

  // Get bitmap chunk
  Tuple *chunk_tuple = dict_find(iter, KEY_PNG_CHUNK);
  Tuple *index_tuple = dict_find(iter, KEY_PNG_INDEX);
  if (index_tuple && chunk_tuple) {
    uint32_t index = index_tuple->value->uint32;

    printf("Chunk received: index=%d/%d chunk size=%d", (int)index, (int)data_size, (int)chunk_tuple->length);
    memcpy(data_image + index, &chunk_tuple->value->uint8, chunk_tuple->length);

    // Add chunk_tuple->length cause it's done downloading that part
    snprintf(text_buffer, sizeof(text_buffer), "%d/%d bytes (%d%%)", (int)(index+chunk_tuple->length), (int)data_size, (int)((index+chunk_tuple->length)*100/data_size));
    popup_message(text_buffer);
    
    if(chunk_tuple->length < PNG_CHUNK_SIZE || index + PNG_CHUNK_SIZE == data_size) {
      if (image) {
        gbitmap_destroy(image);
        image = NULL;
      }
      image = gbitmap_create_from_png_data(data_image, data_size);
      free(data_image); data_image = NULL;
      layer_mark_dirty(root_layer);

      GRect gbsize = gbitmap_get_bounds(image);
      printf("Bitmap GRect = (%d, %d, %d, %d)", gbsize.origin.x, gbsize.origin.y, gbsize.size.w, gbsize.size.h);
      popup_message("");
    }
  }
  
  layer_mark_dirty(root_layer);
}



static char *translate_appmessageresult(AppMessageResult result) {
  switch (result) {
    case APP_MSG_OK: return "APP_MSG_OK";
    case APP_MSG_SEND_TIMEOUT: return "APP_MSG_SEND_TIMEOUT";
    case APP_MSG_SEND_REJECTED: return "APP_MSG_SEND_REJECTED";
    case APP_MSG_NOT_CONNECTED: return "APP_MSG_NOT_CONNECTED";
    case APP_MSG_APP_NOT_RUNNING: return "APP_MSG_APP_NOT_RUNNING";
    case APP_MSG_INVALID_ARGS: return "APP_MSG_INVALID_ARGS";
    case APP_MSG_BUSY: return "APP_MSG_BUSY";
    case APP_MSG_BUFFER_OVERFLOW: return "APP_MSG_BUFFER_OVERFLOW";
    case APP_MSG_ALREADY_RELEASED: return "APP_MSG_ALREADY_RELEASED";
    case APP_MSG_CALLBACK_ALREADY_REGISTERED: return "APP_MSG_CALLBACK_ALREADY_REGISTERED";
    case APP_MSG_CALLBACK_NOT_REGISTERED: return "APP_MSG_CALLBACK_NOT_REGISTERED";
    case APP_MSG_OUT_OF_MEMORY: return "APP_MSG_OUT_OF_MEMORY";
    case APP_MSG_CLOSED: return "APP_MSG_CLOSED";
    case APP_MSG_INTERNAL_ERROR: return "APP_MSG_INTERNAL_ERROR";
    default: return "UNKNOWN ERROR";
  }
}


static void appmessage_out_failed_handler(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
  js_ready = false;
  printf("App Message Failed: %s", translate_appmessageresult(reason));
}


static void appmessage_in_dropped_handler(AppMessageResult reason, void *context) {
  js_ready = false;
  printf("App Message Failed: %s", translate_appmessageresult(reason));
}


static void app_message_init() {
  // Register message handlers
  app_message_register_inbox_received(appmessage_in_received_handler); 
  app_message_register_inbox_dropped(appmessage_in_dropped_handler); 
  app_message_register_outbox_failed(appmessage_out_failed_handler);
  // Init buffers
  // Size = 1 + 7 * N + size0 + size1 + .... + sizeN
  //app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());  // <-- bad idea. lotsa ram eaten
  app_message_open(1 + 7 * 2 + sizeof(int32_t) + PNG_CHUNK_SIZE, APP_MESSAGE_OUTBOX_SIZE_MINIMUM);
}





// ------------------------------------------------------------------------ //
//  Drawing Functions
// ------------------------------------------------------------------------ //

// void draw_image(GContext *ctx, GBitmap *image, int16_t start_x, int16_t start_y) {
// only works on Aplite and Basalt (probably Diorite too)
//   GBitmap *framebuffer = graphics_capture_frame_buffer(ctx);  // Get framebuffer
//   if(framebuffer) {                                           // If successfully captured the framebuffer
//     uint8_t        *screen = gbitmap_get_data(framebuffer);   // Get pointer to framebuffer data
    
//     uint8_t          *data = (uint8_t*)gbitmap_get_data(image);
//     int16_t          width = gbitmap_get_bounds(image).size.w;
//     int16_t         height = gbitmap_get_bounds(image).size.h;
//     uint16_t bytes_per_row = gbitmap_get_bytes_per_row(image);
//     #ifdef PBL_COLOR
//     GBitmapFormat   format = gbitmap_get_format(image);
//     uint8_t       *palette = (uint8_t*)gbitmap_get_palette(image);
//     #endif
    
//     // Bounds Checking -- feel free to remove this section if you know you won't go out of bounds
//     int16_t           top = (start_y < 0) ? 0 - start_y : 0;
//     int16_t          left = (start_x < 0) ? 0 - start_x : 0;
//     int16_t        bottom = (height + start_y) > 168 ? 168 - start_y : height;
//     int16_t         right = (width  + start_x) > 144 ? 144 - start_x : width;
//     // End Bounds Checking

//     uint16_t addr;
//     for(int16_t y=top; y<bottom; ++y) {
//       for(int16_t x=left; x<right; ++x) {
//         #ifdef PBL_COLOR
//         uint8_t pixel = 0;
//         switch(format) {
//           case GBitmapFormat1Bit:        pixel =        ((data[y*bytes_per_row + (x>>3)] >> ((7-(x&7))   )) &  1) ? GColorWhiteARGB8 : GColorBlackARGB8; break;
//           case GBitmapFormat8Bit:        pixel =          data[y*bytes_per_row +  x    ];                          break;
//           case GBitmapFormat1BitPalette: pixel = palette[(data[y*bytes_per_row + (x>>3)] >> ((7-(x&7))   )) &  1]; break;
//           case GBitmapFormat2BitPalette: pixel = palette[(data[y*bytes_per_row + (x>>2)] >> ((3-(x&3))<<1)) &  3]; break;
//           case GBitmapFormat4BitPalette: pixel = palette[(data[y*bytes_per_row + (x>>1)] >> ((1-(x&1))<<2)) & 15]; break;
//           default: break;
//         }
//         // 1x
//         //addr = (y + start_y) * 144 + x + start_x;  // memory address of the pixel on the screen currently being colored
//         //screen[addr] = combine_colors(screen[addr], pixel);
        
//         // 2x
//         //addr = (((y+start_y)*2)+0)*144 + ((x+start_x)*2)+0; screen[addr] = combine_colors(screen[addr], pixel);
//         //addr = (((y+start_y)*2)+0)*144 + ((x+start_x)*2)+1; screen[addr] = combine_colors(screen[addr], pixel);
//         //addr = (((y+start_y)*2)+1)*144 + ((x+start_x)*2)+0; screen[addr] = combine_colors(screen[addr], pixel);
//         //addr = (((y+start_y)*2)+1)*144 + ((x+start_x)*2)+1; screen[addr] = combine_colors(screen[addr], pixel);
        
//         // 1x 2x 4x 8x 16x etc.
//         //#define zoom 1
//         int zoom = (144/width < 168/height) ? 144/width : 168/height;
//         for(int16_t j=0; j<zoom; ++j) {
//           for(int16_t k=0; k<zoom; ++k) {
//             addr = (((y+start_y)*zoom)+j)*144 + ((x+start_x)*zoom)+k;
//             screen[addr] = pixel;
//           }
//         }
//         #endif
        
//         #ifdef PBL_BW
//                    addr = ((y + start_y) * 20) + ((x + start_x) >> 3);             // the screen memory address of the 8bit byte where the pixel is
//           uint8_t  xbit = (x + start_x) & 7;                                       // which bit is the pixel inside of 8bit byte
//           screen[addr] &= ~(1<<xbit);                                              // assume pixel to be black
//           screen[addr] |= ((data[(y*bytes_per_row) + (x>>3)] >> (x&7))&1) << xbit; // draw white pixel if image has a white pixel
//         #endif
//       }
//     }
//     graphics_release_frame_buffer(ctx, framebuffer);
//   }
// }


void draw_character(Layer *layer, GContext *ctx, int32_t x, int32_t y, GColor color) {
  GRect layer_frame = layer_get_frame(layer);
  graphics_context_set_fill_color(ctx, color);
  graphics_context_set_stroke_color(ctx, GColorBlack);
  graphics_fill_circle(ctx, GPoint(x + layer_frame.size.w/2, layer_frame.size.h/2 - y), 4);
  graphics_draw_circle(ctx, GPoint(x + layer_frame.size.w/2, layer_frame.size.h/2 - y), 4);
}


// Colored Circles based on type [1-151], plus player [255]
// Probably better to use an array for [1-151]
GColor type_to_color(uint8_t type) {
  #if defined(PBL_COLOR)
  switch(type) {
    //case 1: return PBL_IF_COLOR_ELSE(GColorRed, GColorBlack);  // Type 1
    //case 2: return PBL_IF_COLOR_ELSE(GColorGreen, GColorWhite);  // Type 2
    //case 3: return PBL_IF_COLOR_ELSE(GColorPurple, GColorWhite);  // Type 2
    case 255: return GColorYellow;  // Player
    default: return GColorRed;
    
      
  }
  #else
  switch(type) {
    case 255: return GColorLightGray;  // Player
    default: return GColorBlack;  // Other
  }
  #endif
}


void display_message_text(Layer *layer, GContext *ctx) {
  if (!message_text[0]) return;
  GColor background_color = GColorWhite;
  GColor text_color = GColorBlack;
  GColor border_color = GColorBlack;
  GFont font = fonts_get_system_font(FONT_KEY_GOTHIC_14);
  GSize margin = GSize(3, 2);
  GRect layer_frame = layer_get_frame(layer);
  
  GSize text_size = GSize(100, 30);
  
  //text_size.w = 100; text_size.h = 30;
  GRect rect = GRect((layer_frame.size.w - text_size.w) / 2 - margin.w,
                     (layer_frame.size.h - text_size.h) / 2 - margin.h,
                     text_size.w + margin.w + margin.w,
                     text_size.h + margin.h + margin.h);
  
  graphics_context_set_text_color(ctx, text_color);
  graphics_context_set_stroke_color(ctx, border_color);
  graphics_context_set_fill_color(ctx, background_color);
  graphics_fill_rect(ctx, rect, 0, GCornerNone);  // fill background
  graphics_draw_rect(ctx, rect);
  
  rect = GRect(0, 0, text_size.w, text_size.h);
  text_size = graphics_text_layout_get_content_size(message_text, font, rect, GTextOverflowModeTrailingEllipsis, GTextAlignmentCenter);
  rect = GRect((layer_frame.size.w - text_size.w) / 2,
               (layer_frame.size.h - text_size.h) / 2,
               text_size.w,
               text_size.h);

  rect.origin.y -= 3;
  graphics_draw_text(ctx, message_text, font, rect, GTextOverflowModeTrailingEllipsis, GTextAlignmentCenter, NULL);

//   GRect layer_frame = layer_get_frame(layer);
  
//   GSize text_size = graphics_text_layout_get_content_size(message_text, font, layer_frame, GTextOverflowModeTrailingEllipsis, GTextAlignmentCenter);
//   if (text_size.h == 0) return;
  
//   text_size.w = 100; text_size.h = 30;
//   GRect rect = GRect((layer_frame.size.w - text_size.w) / 2 - margin.w,
//                      (layer_frame.size.h - text_size.h) / 2 - margin.h,
//                      text_size.w + margin.w + margin.w,
//                      text_size.h + margin.h + margin.h);
  
//   graphics_context_set_text_color(ctx, text_color);
//   graphics_context_set_stroke_color(ctx, border_color);
//   graphics_context_set_fill_color(ctx, background_color);
//   graphics_fill_rect(ctx, rect, 0, GCornerNone);  // fill background
//   graphics_draw_rect(ctx, rect);
  
//   text_size = graphics_text_layout_get_content_size(message_text, font, layer_frame, GTextOverflowModeTrailingEllipsis, GTextAlignmentCenter);
//   rect = GRect((layer_frame.size.w - text_size.w) / 2 - margin.w,
//                (layer_frame.size.h - text_size.h) / 2 - margin.h,
//                text_size.w + margin.w + margin.w,
//                text_size.h + margin.h + margin.h);

//   rect.origin.y -= 3;
//   graphics_draw_text(ctx, message_text, font, rect, GTextOverflowModeTrailingEllipsis, GTextAlignmentCenter, NULL);
}


void graphics_layer_update(Layer *layer, GContext *ctx) {
  GRect layer_frame = layer_get_frame(layer);
  screen = layer_frame.size;  // update screen size.  Only need to do this once, but meh.

  
  if(image) {
    GRect image_rect = gbitmap_get_bounds(image);
    image_rect.origin.x = (layer_frame.size.w - image_rect.size.w) / 2;
    image_rect.origin.y = (layer_frame.size.h - image_rect.size.h) / 2;
    graphics_draw_bitmap_in_rect(ctx, image, image_rect);
    //draw_image(ctx, image, image_rect.origin.x+layer_frame.origin.x, image_rect.origin.y+layer_frame.origin.y);  // Draw image to screen buffer
  }

  update_actor_pixel_positions();
  // If player moved beyond screen boundaries
  if(actor[0].py > layer_frame.size.h/2 || actor[0].py < layer_frame.size.h/-2 || actor[0].px > layer_frame.size.w/2 || actor[0].px < layer_frame.size.w/-2) {
    printf("Player beyond screen bounds!  Requesting new map");
    schedule_map_request(NULL);
  }

  for(uint8_t i = 0; i < MAX_ACTORS; i++) {
    if(actor[i].enabled) {
      //printf("Drawing Actor %d at (%ld, %ld) type %d", i, actor[i].px, actor[i].py, actor[i].type);
      draw_character(layer, ctx, actor[i].px, actor[i].py, type_to_color(actor[i].type));
    }
  }
  
  
  display_message_text(layer, ctx);
}















// ------------------------------------------------------------------------ //
//  Button Functions
// ------------------------------------------------------------------------ //
static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
  if(!js_ready) return;  // if already requesting a new map, don't change zoom
  map_zoom--; if(map_zoom<1) map_zoom=1;
  
  snprintf(text_buffer, sizeof(text_buffer), "Zoom Out: %d", map_zoom);
  popup_message(text_buffer);
  
  schedule_map_request_delay(1000);
  layer_mark_dirty(root_layer);
}

static void dn_click_handler(ClickRecognizerRef recognizer, void *context) {
  if(!js_ready) return;  // if already requesting a new map, don't change zoom
  map_zoom++; if(map_zoom>20) map_zoom=20;
  
  snprintf(text_buffer, sizeof(text_buffer), "Zoom In: %d", map_zoom);
  popup_message(text_buffer);
  
  schedule_map_request_delay(1000);
  layer_mark_dirty(root_layer);
}

static void sl_click_handler(ClickRecognizerRef recognizer, void *context) {
  //schedule_map_request(NULL);
  //create_menu();
  send_command(COMMAND_POPULATE_DOTS);
}

static void click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_UP,     up_click_handler);
  window_single_click_subscribe(BUTTON_ID_SELECT, sl_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN,   dn_click_handler);
}

// ------------------------------------------------------------------------ //
//  Main Functions
// ------------------------------------------------------------------------ //
static void window_load(Window *window) {
  root_layer = window_get_root_layer(window);
  root_frame = layer_get_frame(root_layer);

  // METHOD 1: Map on separate layer
//   graphics_layer = layer_create(root_frame);
//   layer_set_update_proc(graphics_layer, graphics_layer_update);
//   layer_add_child(root_layer, graphics_layer);
  // METHOD 2: Map as root layer (doesn't go away when updating)
  layer_set_update_proc(root_layer, graphics_layer_update);

  popup_message("Waiting for Javascript...");
}

static void window_unload(Window *window) {
  //text_layer_destroy(text_layer);
  if (image) {gbitmap_destroy(image);}
  if(data_image) {free(data_image);}
}

static void init(void) {
  for(uint8_t i = 0; i < MAX_ACTORS; i++) actor[i].enabled = false;
  actor[0].type = 255;
  
  app_message_init();
  window = window_create();
  window_set_click_config_provider(window, click_config_provider);
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  window_stack_push(window, true);
}

static void deinit(void) {
  window_destroy(window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
