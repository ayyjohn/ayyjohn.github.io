const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
  filterTokens,
} = require("markdownlint-rule-helpers");

const { isLowerCase } = require("../js/utils");

const allowedHeaders = ["h2"];
const doNotCapitalizeWords = new Set([
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
]);

const formattedHeaders = (params, onError) => {
  filterTokens(params, "heading_open", (token) => {
    const { lineNumber, line, tag } = token;
    if (line.startsWith("#")) {
      const textStart = line.indexOf(" ");
      const words = line.slice(textStart + 1).split(" ");
      const shouldUppercaseWords = [];
      const shouldLowercaseWords = [];
      words.forEach((word, index) => {
        const shouldCapitalize = !doNotCapitalizeWords.has(word.toLowerCase());
        if (shouldCapitalize && isLowerCase(word)) {
          shouldUppercaseWords.push(word);
        } else if (!shouldCapitalize && !isLowerCase(word) && index != 0) {
          shouldLowercaseWords.push(word);
        }
      });
      if (shouldUppercaseWords.length > 0) {
        onError({
          lineNumber: lineNumber,
          detail: `the words [${shouldUppercaseWords.join(
            ", "
          )}] need to be capitalized`,
        });
      }
      if (shouldLowercaseWords.length > 0) {
        onError({
          lineNumber: lineNumber,
          detail: `the words [${shouldLowercaseWords.join(
            ", "
          )}] shouldn't be capitalized but are`,
        });
      }
    }
  });
};

module.exports = {
  names: ["CMD004", "headers-formatted"],
  description: "headers should have title-style capitalization",
  tags: ["headers"],
  function: formattedHeaders,
};
