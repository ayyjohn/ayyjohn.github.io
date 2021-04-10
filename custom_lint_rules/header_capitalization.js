const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
  filterTokens,
} = require("markdownlint-rule-helpers");

const { isLowerCase } = require("../js/utils");

const allowedHeaders = ["h2"];
const doNotCapitalizeWords = [
  "and",
  "the",
  "of",
  "a",
  "an",
  "is",
  "in",
  "to",
  "at",
  "for",
  "but",
  "so",
  "with",
];

const formattedHeaders = (params, onError) => {
  filterTokens(params, "heading_open", (token) => {
    const { lineNumber, line, tag } = token;
    if (line.startsWith("#")) {
      const textStart = line.indexOf(" ");
      const words = line.slice(textStart + 1).split(" ");
      words.forEach((word, index) => {
        const shouldCapitalize = !doNotCapitalizeWords.includes(
          word.toLowerCase()
        );
        if (shouldCapitalize && isLowerCase(word)) {
          onError({
            lineNumber: lineNumber,
            detail: `The word "${word}" at index ${index} needs to be capitalized`,
          });
        } else if (!shouldCapitalize && !isLowerCase(word) && index != 0) {
          onError({
            lineNumber: lineNumber,
            detail: `The word "${word}" at index ${index} shouldn't be capitalized but is`,
          });
        }
      });
    }
  });
};

module.exports = {
  names: ["CMD004", "headers-formatted"],
  description: "headers should have title-style capitalization",
  tags: ["headers"],
  function: formattedHeaders,
};
