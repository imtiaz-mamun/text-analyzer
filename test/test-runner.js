const fs = require("fs");
const path = require("path");

const testDir = path.join(__dirname);
const testFiles = fs
  .readdirSync(testDir)
  .filter((file) => file.endsWith(".test.js"));

let passed = 0;
let failed = 0;

testFiles.forEach((file) => {
  const filePath = path.join(testDir, file);
  console.log(`Running ${file}...`);

  try {
    require(filePath);
    passed++;
  } catch (error) {
    console.error(error);
    failed++;
  }
});

console.log(`\nPassed: ${passed}, Failed: ${failed}`);
