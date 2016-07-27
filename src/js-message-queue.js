// Source:
//   https://github.com/smallstoneapps/js-message-queue

// The MIT License (MIT)

// Copyright (c) 2014 Matthew Tole

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var MessageQueue = (function () {

  var RETRY_MAX = 5;

  var queue = [];
  var sending = false;
  var timer = null;

  return {
    reset: reset,
    sendAppMessage: sendAppMessage,
    size: size
  };

  function reset() {
    queue = [];
    sending = false;
  }

  function sendAppMessage(message, ack, nack) {

    if (! isValidMessage(message)) {
      return false;
    }

    queue.push({
      message: message,
      ack: ack || null,
      nack: nack || null,
      attempts: 0
    });

    setTimeout(function () {
      sendNextMessage();
    }, 1);

    return true;
  }

  function size() {
    return queue.length;
  }

  function isValidMessage(message) {
    // A message must be an object.
    if (message !== Object(message)) {
      return false;
    }
    var keys = Object.keys(message);
    // A message must have at least one key.
    if (! keys.length) {
      return false;
    }
    for (var k = 0; k < keys.length; k += 1) {
      var validKey = /^[0-9a-zA-Z-_]*$/.test(keys[k]);
      if (! validKey) {
        return false;
      }
      var value = message[keys[k]];
      if (! validValue(value)) {
        return false;
      }
    }

    return true;

    function validValue(value) {
      switch (typeof(value)) {
        case 'string':
          return true;
        case 'number':
          return true;
        case 'object':
          if (toString.call(value) == '[object Array]') {
            return true;
          }
      }
      return false;
    }
  }

  function sendNextMessage() {

    if (sending) { return; }
    var message = queue.shift();
    if (! message) { return; }

    message.attempts += 1;
    sending = true;
    Pebble.sendAppMessage(message.message, ack, nack);

    timer = setTimeout(function () {
      timeout();
    }, 1000);

    function ack() {
      clearTimeout(timer);
      setTimeout(function () {
        sending = false;
        sendNextMessage();
      }, 200);
      if (message.ack) {
        message.ack.apply(null, arguments);
      }
    }

    function nack() {
      clearTimeout(timer);
      if (message.attempts < RETRY_MAX) {
        queue.unshift(message);
        setTimeout(function () {
          sending = false;
          sendNextMessage();
        }, 200 * message.attempts);
      }
      else {
        if (message.nack) {
          message.nack.apply(null, arguments);
        }
      }
    }

    function timeout() {
      setTimeout(function () {
        sending = false;
        sendNextMessage();
      }, 1000);
      if (message.ack) {
        message.ack.apply(null, arguments);
      }
    }

  }

}());