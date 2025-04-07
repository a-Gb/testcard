/**
 * Testcard - Customizable test patterns for video production and OBS
 * Original work by makigas testcard - www.github.com/makigas/testcard
 * Copyright (C) 2016-2017 Dani Rodríguez <danirod@outlook.com>
 * 
 * Modified for OBS streaming use with enhanced patterns and frame styles
 * Last updated: April 7, 2025
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * USAGE:
 * - Add to OBS as a browser source
 * - Configure URL parameters for customization:
 *   - pattern=smpte|rgb|pal|pretty (test pattern type)
 *   - frame=default|minimal|crt|none (frame style)
 *   - banner=Your%20Text%20Here (custom banner text)
 */

(function(window, document) {
  /**
   * Safely decode HTML entities
   * @param {string} t - The string to decode
   * @returns {string} The decoded string
   */
  var decode = function(t) {
    var ta = document.createElement("textarea");
    ta.innerHTML = t;
    return ta.value;
  };
  
  /**
   * Parse the query string into an object of parameters
   * @returns {Object} Object containing query parameters
   */
  var queryString = function() {
    var qs = window.location.search.substring(1).split('&');
    var params = { };
    qs.forEach(function(q) {
      if (q.includes('=')) {
        var parts = q.split('=');
        params[parts[0]] = parts[1];
      }
    });
    return params;
  };

  /**
   * Update the clock display
   */
  var updateClock = function() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getYear() % 100;

    var hh = (hours < 10) ? '0' + hours : hours;
    var mm = (minutes < 10) ? '0' + minutes : minutes;
    var ss = (seconds < 10) ? '0' + seconds : seconds;
    var ms = ('00' + milliseconds).slice(-3);
    var dd = (day < 10) ? '0' + day : day;
    var ii = (month < 10) ? '0' + month : month;
    var yy = (year < 10) ? '0' + year : year;

    var day = dd + '/' + ii + '/' + yy;
    var hour = hh + ':' + mm + ':' + ss + '.' + ms;
    document.getElementById('time').innerHTML = hour;
    document.getElementById('date').innerHTML = day;
  };

  /**
   * Toggle the testcard visibility
   */
  var toggleTestcard = function() {
    var testcard = document.querySelector('.testcard');
    if (testcard.style.display === 'none') {
      testcard.style.display = 'block';
    } else {
      testcard.style.display = 'none';
    }
  };

  // Register keyboard event handler for toggling testcard with 't'
  document.addEventListener('keydown', function(event) {
    if (event.key === 't') {
      toggleTestcard();
    }
  });

  // Get URL parameters
  var params = queryString();
  var testcard = document.querySelector('.testcard');

  // Apply frame style based on URL parameters
  var frameParam = params.frame;
  
  // Handle different frame style options
  if (frameParam) {
    // Remove any existing frame classes
    testcard.classList.remove('fluid', 'with-frame', 'minimal-frame', 'crt-frame');
    
    if (frameParam === 'true' || frameParam === 'yes' || frameParam === '1' || frameParam === 'default') {
      testcard.classList.add('with-frame');
    } else if (frameParam === 'minimal') {
      testcard.classList.add('minimal-frame');
    } else if (frameParam === 'crt') {
      testcard.classList.add('crt-frame');
    } else if (frameParam === 'none' || frameParam === 'false' || frameParam === '0') {
      testcard.classList.add('fluid');
    } else {
      // Default to fluid if unrecognized value
      testcard.classList.add('fluid');
    }
  } else {
    // Default to fluid if no frame parameter
    testcard.classList.add('fluid');
  }

  // Apply pattern if specified in URL
  if (params.pattern) {
    // Remove any existing pattern classes
    testcard.classList.remove('pattern-smpte', 'pattern-pal', 'pattern-rgb', 'pattern-pretty');
    
    // Add the requested pattern class
    testcard.classList.add('pattern-' + params.pattern);
    
    // If it's the pretty pattern, show the pretty container and hide regular color bars
    if (params.pattern === 'pretty') {
      var prettyContainer = document.querySelector('.pretty-container');
      var colorBars = document.querySelector('.color-bars');
      
      if (prettyContainer && colorBars) {
        prettyContainer.style.display = 'flex';
        colorBars.style.display = 'none';
      }
    }
    
    // Update banner text with pattern name if no banner specified
    if (!params.banner) {
      var patternName = params.pattern.toUpperCase();
      var bannerEl = document.getElementById('banner');
      if (bannerEl) {
        bannerEl.innerHTML = patternName + ' TEST PATTERN';
      }
    }
  } else {
    // Default to SMPTE pattern
    testcard.classList.add('pattern-smpte');
  }

  // Handle banner parameter
  if (params.banner) {
    var bannerEl = document.getElementById('banner');
    if (bannerEl) {
      bannerEl.innerHTML = decodeURI(params.banner);
    }
  } else if (!params.pattern) {
    // Remove banner if neither banner nor pattern is specified
    var bannerEl = document.getElementById('banner');
    if (bannerEl) {
      bannerEl.remove();
    }
  }

  // Initialize the clock
  updateClock();
  
  // Update every 50ms for subsecond precision
  window.setInterval(updateClock, 50);
})(window, document);