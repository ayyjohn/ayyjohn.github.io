const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
  filterTokens,
} = require("markdownlint-rule-helpers");

const { isLowerCase } = require("../js/utils");

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
  "are",
  "what",
  "was",
  "from",
  "that",
]);

const capitalizeHeaders = (params, onError) => {
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
  names: ["CMD004", "header-casing"],
  description: "headers should be in title-case",
  tags: ["headers"],
  function: capitalizeHeaders,
};
