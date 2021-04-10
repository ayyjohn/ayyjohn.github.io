const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
} = require("markdownlint-rule-helpers");

const { isLowerCase } = require("../js/utils");

const lowercaseCategories = (params, onError) => {
  const categories_lines = params.frontMatterLines.filter((line) =>
    line.startsWith("categories: ")
  );
  if (categories_lines.length < 1) {
    onError({
      lineNumber: 1,
      detail: "all posts should have categories specified",
    });
  } else if (categories_lines.length > 1) {
    onError({
      lineNumber: 1,
      detail: "posts are not allowed to specify multiple lists of categories",
    });
  } else {
    let array_start = categories_lines[0].indexOf("[") + 1;
    let array_end = categories_lines[0].length - 1;
    let categories_string = categories_lines[0].substring(
      array_start,
      array_end
    );
    let categories = categories_string.split(", ");
    categories.forEach((category) => {
      if (!isLowerCase(category)) {
        onError({
          lineNumber: 1,
        });
      }
    });
  }
};

module.exports = {
  names: ["CMD002", "all-categories-lowercase"],
  description: "all categories in frontmatter should be lowercase",
  tags: ["categories"],
  function: lowercaseCategories,
};
