const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
} = require("markdownlint-rule-helpers");

const start_highlight = /{% highlight \w+ %}/;
const end_highlight = "{% endhighlight %}";

const noRenderedComments = (params, onError) => {
  let insideHighlightBlock = false;
  forEachLine(getLineMetadata(params), (line, lineIndex) => {
    if (line && start_highlight.test(line)) {
      insideHighlightBlock = true;
    }
    if (line && line == end_highlight) {
      insideHighlightBlock = false;
    }
    const isComment = inlineCommentRe.test(line);
    if (insideHighlightBlock && isComment) {
      onError({
        lineNumber: lineIndex,
      });
    }
  });
};

module.exports = {
  names: ["CMD-001", "no-rendered-comments"],
  description: "No markdown comments should be inside code blocks",
  tags: ["test"],
  function: noRenderedComments,
};
