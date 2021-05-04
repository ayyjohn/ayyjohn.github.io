const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
} = require("markdownlint-rule-helpers");

const noTodos = (params, onError) => {
  forEachLine(getLineMetadata(params), (line, lineIndex) => {
    if (line && line.includes("@todo")) {
      onError({
        lineNumber: lineIndex
      });
    }
  });
};

module.exports = {
  names: ["CMD007", "no-todos"],
  description: "no todos should be left in the post when it gets published",
  tags: ["comments"],
  function: noTodos,
};
