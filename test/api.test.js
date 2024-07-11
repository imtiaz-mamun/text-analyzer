const fs = require("fs");
const path = require("path");
const assert = require("./assert");
const {
  getWordCount,
  getCharacterCount,
  getSentenceCount,
  getParagraphCount,
  getLongestWords,
} = require("../testing_module");

const sampleText =
  "The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.";

fs.writeFileSync(path.join(__dirname, "../sample.txt"), sampleText);

const text = fs.readFileSync(path.join(__dirname, "../sample.txt"), "utf8");

assert.equal(getWordCount(text), 16, "Word count should be 16");
assert.equal(getCharacterCount(text), 60, "Character count should be 60");
assert.equal(getSentenceCount(text), 2, "Sentence count should be 2");
assert.equal(getParagraphCount(text), 1, "Paragraph count should be 1");
assert.equal(
  JSON.stringify(getLongestWords(text)),
  JSON.stringify([["quick", "brown", "jumps", "slept"]]),
  'Longest words should be [["quick","brown","jumps","slept"]]'
);

// fs.unlinkSync(path.join(__dirname, "../sample.txt"));
