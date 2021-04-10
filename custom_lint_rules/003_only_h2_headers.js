const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
  filterTokens,
} = require("markdownlint-rule-helpers");

const allowedHeaders = ["h2"];

const onlyH2Headers = (params, onError) => {
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
  function: onlyH2Headers,
};
