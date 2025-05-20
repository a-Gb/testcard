// Testcard Client-Side Tests

// Helper function for assertions
function assert(condition, message) {
  if (!condition) {
    console.error("Assertion Failed:", message);
    return false;
  }
  console.log("Assertion Passed:", message);
  return true;
}

// Test suite for Testcard functionality
console.log("Testcard Tests Loaded. Call runAllTests() to start.");

function testGenerateCheckerboard() {
  console.log("--- Running testGenerateCheckerboard ---");
  let allPassed = true;
  const checkerboardContainer = document.querySelector('.checkerboard-pattern');
  
  if (!checkerboardContainer) {
    console.error("Test Setup Failed: .checkerboard-pattern container not found.");
    return false;
  }

  // Ensure generateCheckerboard is accessible - it's defined in testcard.js
  if (typeof generateCheckerboard !== 'function') {
    console.error("Test Setup Failed: generateCheckerboard() function is not accessible.");
    return false;
  }
  
  generateCheckerboard();
  
  // 1. Test cell count
  const cells = checkerboardContainer.children;
  allPassed = assert(cells.length === 64, "Checkerboard should have 64 cells.") && allPassed;
  
  // 2. Test alternating classes
  let correctClasses = true;
  for (let i = 0; i < 8; i++) { // Rows
    for (let j = 0; j < 8; j++) { // Columns
      const cellIndex = i * 8 + j;
      const cell = cells[cellIndex];
      if (!cell) {
        correctClasses = false;
        console.error(`Cell at index ${cellIndex} not found.`);
        break;
      }
      const expectedClass = (i + j) % 2 === 0 ? 'white' : 'black';
      if (!cell.classList.contains(expectedClass)) {
        correctClasses = false;
        console.error(`Cell at [${i},${j}] expected ${expectedClass}, got ${cell.className}`);
      }
    }
    if (!correctClasses) break;
  }
  allPassed = assert(correctClasses, "Checkerboard cells should have correct alternating black/white classes.") && allPassed;

  console.log(`--- testGenerateCheckerboard ${allPassed ? "PASSED" : "FAILED"} ---`);
  return allPassed;
}

function testSetPattern() {
  console.log("--- Running testSetPattern ---");
  let allPassed = true;
  const testcardElement = document.querySelector('.testcard');
  const colorBars = document.querySelector('.color-bars');
  const prettyContainer = document.querySelector('.pretty-container');
  const checkerboardContainer = document.querySelector('.checkerboard-pattern');

  if (!testcardElement || !colorBars || !prettyContainer || !checkerboardContainer) {
    console.error("Test Setup Failed: One or more essential DOM elements not found.");
    return false;
  }
  if (typeof setPattern !== 'function') {
    console.error("Test Setup Failed: setPattern() function is not accessible.");
    return false;
  }

  // Helper to check visibility
  const isVisible = el => el.style.display !== 'none';

  // Test Case 1: Set pattern to "smpte"
  console.log("Testing setPattern('smpte')...");
  setPattern('smpte');
  allPassed = assert(isVisible(colorBars), "SMPTE: .color-bars should be visible.") && allPassed;
  allPassed = assert(!isVisible(prettyContainer), "SMPTE: .pretty-container should be hidden.") && allPassed;
  allPassed = assert(!isVisible(checkerboardContainer), "SMPTE: .checkerboard-pattern should be hidden.") && allPassed;
  allPassed = assert(testcardElement.classList.contains('pattern-smpte'), "SMPTE: testcard should have 'pattern-smpte' class.") && allPassed;
  allPassed = assert(!testcardElement.classList.contains('pattern-pretty'), "SMPTE: testcard should not have 'pattern-pretty' class.") && allPassed;
  allPassed = assert(!testcardElement.classList.contains('pattern-checkerboard'), "SMPTE: testcard should not have 'pattern-checkerboard' class.") && allPassed;
  
  // Test Case 2: Set pattern to "pretty"
  console.log("Testing setPattern('pretty')...");
  setPattern('pretty');
  allPassed = assert(!isVisible(colorBars), "Pretty: .color-bars should be hidden.") && allPassed;
  allPassed = assert(isVisible(prettyContainer), "Pretty: .pretty-container should be visible.") && allPassed;
  allPassed = assert(!isVisible(checkerboardContainer), "Pretty: .checkerboard-pattern should be hidden.") && allPassed;
  allPassed = assert(testcardElement.classList.contains('pattern-pretty'), "Pretty: testcard should have 'pattern-pretty' class.") && allPassed;

  // Test Case 3: Set pattern to "checkerboard"
  console.log("Testing setPattern('checkerboard')...");
  setPattern('checkerboard');
  allPassed = assert(!isVisible(colorBars), "Checkerboard: .color-bars should be hidden.") && allPassed;
  allPassed = assert(!isVisible(prettyContainer), "Checkerboard: .pretty-container should be hidden.") && allPassed;
  allPassed = assert(isVisible(checkerboardContainer), "Checkerboard: .checkerboard-pattern should be visible.") && allPassed;
  allPassed = assert(testcardElement.classList.contains('pattern-checkerboard'), "Checkerboard: testcard should have 'pattern-checkerboard' class.") && allPassed;
  // Check if generateCheckerboard was called by setPattern (indirectly, by checking cell count)
  allPassed = assert(checkerboardContainer.children.length === 64, "Checkerboard: generateCheckerboard should have been called (64 cells).") && allPassed;

  // Test Case 4: Set pattern to "rgb" (similar to smpte)
  console.log("Testing setPattern('rgb')...");
  setPattern('rgb');
  allPassed = assert(isVisible(colorBars), "RGB: .color-bars should be visible.") && allPassed;
  allPassed = assert(!isVisible(prettyContainer), "RGB: .pretty-container should be hidden.") && allPassed;
  allPassed = assert(!isVisible(checkerboardContainer), "RGB: .checkerboard-pattern should be hidden.") && allPassed;
  allPassed = assert(testcardElement.classList.contains('pattern-rgb'), "RGB: testcard should have 'pattern-rgb' class.") && allPassed;

  // Test Case 5: Set pattern to "pal" (similar to smpte)
  console.log("Testing setPattern('pal')...");
  setPattern('pal');
  allPassed = assert(isVisible(colorBars), "PAL: .color-bars should be visible.") && allPassed;
  allPassed = assert(!isVisible(prettyContainer), "PAL: .pretty-container should be hidden.") && allPassed;
  allPassed = assert(!isVisible(checkerboardContainer), "PAL: .checkerboard-pattern should be hidden.") && allPassed;
  allPassed = assert(testcardElement.classList.contains('pattern-pal'), "PAL: testcard should have 'pattern-pal' class.") && allPassed;

  console.log(`--- testSetPattern ${allPassed ? "PASSED" : "FAILED"} ---`);
  return allPassed;
}

function runAllTests() {
  console.log("===== Starting All Testcard Tests =====");
  let overallResult = true;
  
  // It's good practice to reset or ensure a known state before tests if needed.
  // For now, these tests are fairly independent.
  
  overallResult = testGenerateCheckerboard() && overallResult;
  overallResult = testSetPattern() && overallResult;
  
  if (overallResult) {
    console.log("===== All Testcard Tests PASSED! =====");
  } else {
    console.error("===== Some Testcard Tests FAILED. Please review logs. =====");
  }
}

// Expose runAllTests to the global scope to be callable from the console
window.runAllTests = runAllTests;
