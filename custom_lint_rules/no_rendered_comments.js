const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
} = require("markdownlint-rule-helpers");

const start_highlight_text = "{% highlight ";
const end_highlight_text = "{% endhighlight %}";

const noRenderedComments = (params, onError) => {
  let insideHighlightBlock = false;
  forEachLine(getLineMetadata(params), (line, lineIndex) => {
    if (line && line.includes(start_highlight_text)) {
      insideHighlightBlock = true;
    }
    if (line && line == end_highlight_text) {
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
