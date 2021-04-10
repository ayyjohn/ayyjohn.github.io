const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
  filterTokens,
} = require("markdownlint-rule-helpers");

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
      if (!allowedHeaders.includes(tag)) {
        onError({
          lineNumber: lineNumber,
          detail: "only use H2s in posts",
        });
      }
    }
  });
};

module.exports = {
  names: ["CMD003", "only-h2-headers"],
  description: "Headers should be H2s",
  tags: ["headers"],
  function: formattedHeaders,
};
