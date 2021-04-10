const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
} = require("markdownlint-rule-helpers");

const existingCategories = new Set([
  "bash",
  "bots",
  "chargers",
  "football",
  "javascript",
  "jekyll",
  "jquery",
  "linting",
  "meta",
  "python",
  "random",
  "scripting",
  "twitter",
  "zsh",
]);

const noNewCategories = (params, onError) => {
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
    const array_start = categories_lines[0].indexOf("[") + 1;
    const array_end = categories_lines[0].length - 1;
    const categories_string = categories_lines[0].substring(
      array_start,
      array_end
    );
    const categories = categories_string.split(", ");
    const newCategories = categories.filter(
      (category) => !existingCategories.has(category)
    );
    if (newCategories.length > 0) {
      onError({
        lineNumber: 1,
        detail: `the following categories are new: [${newCategories.join(
          ", "
        )}], are you sure you want to add them?`,
      });
    }
  }
};

module.exports = {
  names: ["CMD005", "no-new-categories"],
  description:
    "when adding a new category on a post new categories should be added purposefully",
  tags: ["categories"],
  function: noNewCategories,
};
