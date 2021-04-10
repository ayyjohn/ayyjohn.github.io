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
  "vs",
  "for",
  "but",
  "so",
  "with",
]);

const capitalizeTitles = (params, onError) => {
  const titles_lines = params.frontMatterLines.filter((line) =>
    line.startsWith("title:")
  );
  if (titles_lines.length < 1) {
    onError({
      lineNumber: 1,
      detail: "all posts should have a title",
    });
  } else if (titles_lines.length > 1) {
    onError({
      lineNumber: 1,
      detail: "posts are not allowed to specify multiple top level titles",
    });
  } else {
    const title_start = titles_lines[0].indexOf('"');
    const title_end = titles_lines[0].length - 1;
    const title_string = titles_lines[0].substring(title_start, title_end);
    const words = title_string.split(" ");
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
    let detail = "";
    if (shouldUppercaseWords.length > 0) {
      detail += `the words [${shouldUppercaseWords.join(
        ", "
      )}] need to be capitalized. `;
    }
    if (shouldLowercaseWords.length > 0) {
      detail += `the words [${shouldLowercaseWords.join(
        ", "
      )}] shouldn't be capitalized but are.`;
    }
    if (detail != "") {
      onError({
        lineNumber: 1,
        detail: detail,
      });
    }
  }
};

module.exports = {
  names: ["CMD006", "title-case"],
  description: "titles should be title-cased",
  tags: ["headers"],
  function: capitalizeTitles,
};
