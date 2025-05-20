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
  // Immediately Invoked Function Expression (IIFE) to encapsulate the script
  // and avoid polluting the global scope.
  // `window` and `document` are passed as arguments for potentially faster access
  // and to make dependencies explicit.

  /**
   * Safely decodes HTML entities from a string.
   * This is useful for parsing text from URL parameters or other sources
   * that might contain encoded characters (e.g., %20 for space).
   * @param {string} t - The string to decode.
   * @returns {string} The decoded string.
   */
  var decode = function(t) {
    // Create a temporary textarea element.
    var ta = document.createElement("textarea");
    // Set its innerHTML to the encoded string. The browser handles decoding.
    ta.innerHTML = t;
    // Return the decoded text content.
    return ta.value;
  };
  
  /**
   * Parses the URL query string (e.g., "?pattern=smpte&frame=crt")
   * and returns an object of key-value pairs.
   * @returns {Object} An object where keys are parameter names and values are their corresponding values.
   */
  var queryString = function() {
    // Get the query string part of the URL, removing the leading '?'.
    var qs = window.location.search.substring(1).split('&');
    var params = { }; // Initialize an empty object to store parameters.
    // Iterate over each key-value pair string (e.g., "pattern=smpte").
    qs.forEach(function(q) {
      // Ensure the part contains an '=' to avoid issues with valueless parameters.
      if (q.includes('=')) {
        var parts = q.split('='); // Split into key and value.
        // Assign to the params object. `decodeURIComponent` could be used here if needed,
        // but the `decode` function handles general HTML entities later for the banner.
        params[parts[0]] = parts[1];
      }
    });
    return params;
  };

  /**
   * Updates the date and time display elements on the page.
   * Formats the current date and time, including milliseconds.
   */
  var updateClock = function() {
    var date = new Date(); // Get current date and time.
    // Extract date and time components.
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    var day = date.getDate();
    var month = date.getMonth() + 1; // getMonth() is 0-indexed.
    var year = date.getYear() % 100; // Get last two digits of the year.

    // Format components to ensure two digits (e.g., '05' instead of '5').
    var hh = (hours < 10) ? '0' + hours : hours;
    var mm = (minutes < 10) ? '0' + minutes : minutes;
    var ss = (seconds < 10) ? '0' + seconds : seconds;
    var ms = ('00' + milliseconds).slice(-3); // Ensure three digits for milliseconds.
    var dd = (day < 10) ? '0' + day : day;
    var ii = (month < 10) ? '0' + month : month; // 'ii' for month to avoid 'mm' conflict.
    var yy = (year < 10) ? '0' + year : year;

    // Construct date and time strings.
    var dayStr = dd + '/' + ii + '/' + yy;
    var hourStr = hh + ':' + mm + ':' + ss + '.' + ms;
    // Update the content of the respective HTML elements.
    document.getElementById('time').innerHTML = hourStr;
    document.getElementById('date').innerHTML = dayStr;
  };

  /**
   * Toggles the visibility of the entire testcard display.
   * If the testcard is hidden, it's shown, and vice-versa.
   */
  var toggleTestcard = function() {
    var testcard = document.querySelector('.testcard'); // Get the main testcard element.
    // Check current display style and toggle.
    if (testcard.style.display === 'none') {
      testcard.style.display = 'block'; // Or 'flex'/'grid' if that's the default display type.
                                        // For this specific structure, 'block' is fine.
    } else {
      testcard.style.display = 'none';
    }
  };

  // Initial setup and event listeners an IIFE runs once the DOM is potentially ready,
  // but for full safety, this could be wrapped in a DOMContentLoaded listener.

  // Parse URL parameters once at the start.
  var params = queryString();
  // Get main DOM elements used throughout the script.
  var testcard = document.querySelector('.testcard');
  var bannerEl = document.getElementById('banner');

  // --- Frame Style Handling ---
  // Apply frame style based on the 'frame' URL parameter.
  var frameParam = params.frame; // Get the 'frame' parameter value.
  
  if (frameParam) {
    // Remove any existing frame style classes to ensure a clean state.
    testcard.classList.remove('fluid', 'with-frame', 'minimal-frame', 'crt-frame');
    
    // Apply the appropriate class based on the parameter value.
    if (frameParam === 'true' || frameParam === 'yes' || frameParam === '1' || frameParam === 'default') {
      testcard.classList.add('with-frame');
    } else if (frameParam === 'minimal') {
      testcard.classList.add('minimal-frame');
    } else if (frameParam === 'crt') {
      testcard.classList.add('crt-frame');
    } else if (frameParam === 'none' || frameParam === 'false' || frameParam === '0') {
      testcard.classList.add('fluid'); // 'fluid' is the style with no explicit frame.
    } else {
      // If the value is unrecognized, default to 'fluid'.
      testcard.classList.add('fluid');
    }
  } else {
    // If no 'frame' parameter is provided, default to 'fluid'.
    testcard.classList.add('fluid');
  }

  // --- Pattern Elements and Generation ---
  // Get references to the HTML containers for each test pattern.
  var colorBars = document.querySelector('.color-bars');
  var prettyContainer = document.querySelector('.pretty-container');
  var checkerboardPattern = document.querySelector('.checkerboard-pattern');

  /**
   * Generates the cells for the checkerboard pattern.
   * Clears any existing cells and creates an 8x8 grid of black and white cells.
   */
  var generateCheckerboard = function() {
    if (!checkerboardPattern) return; // Do nothing if the container doesn't exist.
    checkerboardPattern.innerHTML = ''; // Clear any previously generated cells.

    // Loop to create an 8x8 grid.
    for (let i = 0; i < 8; i++) { // Rows
      for (let j = 0; j < 8; j++) { // Columns
        const cell = document.createElement('div');
        cell.classList.add('cell');
        // Alternate black and white cells based on row and column index.
        if ((i + j) % 2 === 0) {
          cell.classList.add('white');
        } else {
          cell.classList.add('black');
        }
        checkerboardPattern.appendChild(cell); // Add the new cell to the container.
      }
    }
  };

  /**
   * Sets the active test pattern displayed on the testcard.
   * This function handles:
   * - Updating CSS classes on the main testcard element.
   * - Showing the selected pattern's container and hiding others.
   * - Generating dynamic content for patterns like the checkerboard.
   * - Updating the banner text if no custom banner is set.
   * @param {string} patternName - The name of the pattern to display (e.g., 'smpte', 'checkerboard').
   */
  var setPattern = function(patternName) {
    // Remove all pattern-specific classes from the testcard element.
    testcard.classList.remove('pattern-smpte', 'pattern-pal', 'pattern-rgb', 'pattern-pretty', 'pattern-checkerboard');
    
    // Hide all pattern containers before showing the selected one.
    if (colorBars) colorBars.style.display = 'none';
    if (prettyContainer) prettyContainer.style.display = 'none';
    if (checkerboardPattern) checkerboardPattern.style.display = 'none';

    // Add the CSS class for the new pattern. This class might control
    // static aspects of the pattern not handled by JS display toggling.
    testcard.classList.add('pattern-' + patternName);
    
    // Show the correct HTML container for the selected pattern.
    if (patternName === 'pretty') {
      if (prettyContainer) prettyContainer.style.display = 'flex'; // 'pretty' uses flex display.
    } else if (patternName === 'checkerboard') {
      if (checkerboardPattern) {
        generateCheckerboard(); // Dynamically create the checkerboard cells.
        checkerboardPattern.style.display = 'grid'; // 'checkerboard' uses grid display.
      }
    } else {
      // Default to showing the 'colorBars' container for SMPTE, RGB, PAL,
      // or any other unrecognized pattern names.
      if (colorBars) colorBars.style.display = 'flex'; // 'color-bars' uses flex display.
    }
    
    // Update the banner text to reflect the current pattern,
    // but only if no custom banner text was provided via URL parameters.
    if (!params.banner && bannerEl) {
      bannerEl.innerHTML = patternName.toUpperCase() + ' TEST PATTERN';
      // If the banner was previously removed (e.g., no pattern and no banner params), add it back.
      if (!bannerEl.parentNode && (patternName || params.banner)) { 
         document.querySelector('.inner').appendChild(bannerEl);
      }
    }
  };

  // --- Initial Pattern and Banner Setup ---
  // Set the initial pattern based on the 'pattern' URL parameter.
  if (params.pattern) {
    setPattern(params.pattern);
  } else {
    // If no 'pattern' parameter is found, default to 'smpte'.
    setPattern('smpte');
  }

  // Handle the 'banner' URL parameter. This overrides any pattern-derived banner text.
  if (params.banner && bannerEl) {
    bannerEl.innerHTML = decodeURI(params.banner); // Decode URL-encoded characters.
    // If the banner was removed, ensure it's added back when a custom banner is specified.
    if (!bannerEl.parentNode) { 
        document.querySelector('.inner').appendChild(bannerEl);
    }
  } else if (!params.pattern && !params.banner && bannerEl) {
    // If there's no pattern and no custom banner specified, remove the banner element.
     if (bannerEl.parentNode) bannerEl.remove();
  }
  
  // --- Keyboard Controls ---
  // Register a global event listener for keydown events.
  document.addEventListener('keydown', function(event) {
    // 't' key toggles the visibility of the entire testcard.
    if (event.key === 't') {
      toggleTestcard();
      return; // Exit early, as no pattern change is needed.
    }

    // Determine if a pattern change key was pressed.
    let newPattern = null;
    switch (event.key) {
      case 's': // 's' for SMPTE
        newPattern = 'smpte';
        break;
      case 'p': // 'p' for Pretty
        newPattern = 'pretty';
        break;
      case 'c': // 'c' for Checkerboard
        newPattern = 'checkerboard';
        break;
      case 'r': // 'r' for RGB
        newPattern = 'rgb';
        break;
      case 'l': // 'l' for PAL (could also use 'a' for PAL)
        newPattern = 'pal';
        break;
    }

    // If a valid pattern key was pressed, set the new pattern.
    if (newPattern) {
      setPattern(newPattern);
    }
  });

  // --- Clock Initialization and Updates ---
  // Display the clock immediately on load.
  updateClock();
  // Set an interval to update the clock every 50 milliseconds for sub-second precision.
  window.setInterval(updateClock, 50);

})(window, document);