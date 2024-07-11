const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "sample.txt");

function getWordCount(text) {
  return text.split(/\s+/).length;
}

function getCharacterCount(text) {
  return text.replace(/\s/g, "").length;
}

function getSentenceCount(text) {
  return text.split(/[.!?]+/).length - 1;
}

function getParagraphCount(text) {
  return text.split(/\n\s*\n/).length;
}

function getLongestWords(text) {
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.map((paragraph) => {
    const words = paragraph.split(/\s+/);
    const longestWordLength = words.reduce((longestLength, current) => {
      return current.length > longestLength ? current.length : longestLength;
    }, 0);
    return words.filter((word) => word.length === longestWordLength);
  });
}

module.exports = {
  getWordCount,
  getCharacterCount,
  getSentenceCount,
  getParagraphCount,
  getLongestWords,
};
