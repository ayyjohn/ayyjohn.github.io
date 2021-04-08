const { forEachLine, getLineMetadata, filterTokens } = require('markdownlint-rule-helpers');


const rule = (params, onError) => {
  onError({
    "lineNumber": 1
  });
}

module.exports = {
  "names": [ "CMD-001", "no-rendered-comments" ],
  "description": "No markdown comments should be inside code blocks",
  "tags": ["test"],
  "function": rule,
};