---
layout: post
title:  "Writing Custom Lint Rules"
date:   2021-04-09 11:14:07 -0800
permalink: /posts/:title
categories: [javascript, linting, meta]
---
Back in March I wrote [a post about introducing linting to this blog](/posts/linting) and at the end I said I'd follow up when I started adding custom lint rules. That time is now!

## Why Write Your Own Lint Rules?

The [default rules that come with markdownlint](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md) are awesome, don't get me wrong. But as I mentioned in the previous post, linters are great for enforcing quality control, and what quality looks like differs depending on the author.

For example, not everyone who's using markdown is using [Jekyll](https://jekyllrb.com/), and not everyone who's using Jekyll is leveraging the [categories](https://jekyllrb.com/docs/posts/#categories) to make a page like [the one I have](https://ayyjohn.com/categories). So it wouldn't make sense for either [markdownlint](https://github.com/DavidAnson/markdownlint/) or Jekyll to have their own lint rules for it.

But in this blog I've already encountered bugs in how I use categories, and so it makes sense for me to lint my `categories` section on each post.

## Your Own Regression Testing Suite

As I mentioned in [my post about categories](/posts/adding-categories) I made [Liquid](https://shopify.github.io/liquid/) iterate over all unique categories to generate my posts grouped by categories page.
And since, to Jekyll, `Linting` is a different tag than `linting`, it'll make a new section on the categories page above all the others because capitals sort higher than lowercase letters.

![extra_category](/assets/custom_lint_rules/extra_category.png)

Needless to say, I didn't want this to happen again, so there's sort of two options.

1. Create a checklist of "things to review before publishing a new post" and add `all categories are lowercase` to it.

2. Write a custom lint rule to check for this automatically.

The first option might make [Atul Gawande](http://atulgawande.com/book/the-checklist-manifesto/) proud, but it doesn't scale. Eventually I'd have more things on that list than I want to bother to check for, and once I stop checking it, it's worthless.

I'd much rather have a concise checklist where linting for all of these things is one step. The list of things I'm checking for can then grow organically as I discover bugs in new posts. I can also proactively write rules even if I'm not sure they've happened before and then use the linter to discover if I've made that error in the past and fix it.

## My First Custom Rules

In addition to the check mentioned above about categories, there was one other bug that I wanted to cover immediately.
When you add markdownlint-disable comments to your code to say that you explicitly want to ignore a broken lint rule, if these blocks are inside a highlight block, they'll actually get rendered in the text of the post.

Here's an example from my [tuple unpacking post](/posts/tuple-unpacking) that my friend Kyle caught (thanks Kyle!)

<!-- markdownlint-disable CMD001 MD031 -->
{% raw %}
```python
{% highlight python %}
<!-- markdownlint-disable MD037 -->
>>> l = (10, 11)
>>> x, _ = l
>>> x
10
>>> _
11
{% endhighlight %}
<!-- markdownlint-enable MD037 -->
```
{% endraw %}
<!-- markdownlint-enable CMD001 MD031 -->

This code produces the following rendered text

![rendered_comment](/assets/custom_lint_rules/rendered_comment.png)

This can be fixed simply by enforcing that there are none of those comments inside those highlight blocks.

## Coding It Out

Now that I've got my two rules formalized in words, it's time to translate them into code.
[markdownlint has a section on authoring custom rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/CustomRules.md) that's pretty comprehensive, and by combining that with [the code for all of the built in rules](https://github.com/DavidAnson/markdownlint/tree/main/lib) and the [helpers code](https://github.com/DavidAnson/markdownlint/blob/main/helpers/helpers.js) I was able to write my first rule

{% highlight javascript %}
// no_rendered_comments.js
const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
} = require("markdownlint-rule-helpers");
{% raw %}
const start_highlight = /{% highlight \w+ %}/;
const end_highlight = "{% endhighlight %}";
{% endraw %}
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
  names: ["CMD001", "no-rendered-comments"],
  description: "No markdown comments should be inside code blocks",
  tags: ["test"],
  function: noRenderedComments,
};
{% endhighlight %}

All this really does is toggle "am I inside a code block?" on and off when it sees {% raw %}`{% highlight * %}` and `{% endhighlight %}` {% endraw %}, and then raise an error if it sees an inline comment block while `insideHighlightBlock` is `true`.

I haven't figured out how to get [mega-linter](https://github.com/nvuillam/mega-linter/)'s version of markdownlint to find custom rules yet, but I've got [a question open on the repo](https://github.com/nvuillam/mega-linter/issues/396) for it.

For now, I installed markdownlint and markdownlint-rule-helpers via npm, and was able to test this new rule by creating a test file

<!-- markdown-link-check-disable -->
<!-- markdownlint-disable CMD001 MD031 -->
{% raw %}
```python
{% highlight python %}
<!-- markdownlint-disable MD022 MD025 -->
import webbrowser
import hashlib

webbrowser.open("https://xkcd.com/353/")

def geohash(latitude, longitude, datedow):
    ...
{% endhighlight %}
<!-- markdownlint-enable MD022 MD025 -->
```
{% endraw %}
<!-- markdown-link-check-enable -->
<!-- markdownlint-enable CMD001 MD031 -->

and running the following

```bash
markdownlint -r custom_lint_rules/no_rendered_comments.js ./test_posts/test_post.md -c .markdown-lint.json
```

which produced the following

```bash
test_posts/test-post.md:8 CMD001/no-rendered-comments No markdown comments should be inside code blocks
```

Success! Although funnily enough I had to disable my own linter in a bunch of places in this post to show these.

For the second rule I had to do a bit of digging because one thing I noticed while writing the first rule is that the [frontmatter](https://jekyllrb.com/docs/front-matter/) from the test post wasn't counted in `forEachLine`.
By searching the markdownlint source code for `frontmatter` I found that there's a function in [`markdownlint.js`](https://github.com/DavidAnson/markdownlint/blob/main/lib/markdownlint.js) called `removeFrontMatter` which is used to store the `frontMatterLines` in `params`.
Once I had that, though, the rest was pretty simple

{% highlight javascript %}
// lowercase_categories.js
const {
  forEachLine,
  getLineMetadata,
  inlineCommentRe,
} = require("markdownlint-rule-helpers");

const isLowerCase = (string) => {
  return string != string.toUpperCase() && string == string.toLowerCase();
};

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
  tags: ["test"],
  function: lowercaseCategories,
};
{% endhighlight %}

This one is pretty easy to follow. All posts should have exactly one `categories` section, and all the strings inside that section should be lowercase. I'm not particularly adept at JavaScript so there's probably a cleaner way to do it, relying less on indexes, for example.

But one of the takeaways here is that neither of these custom lint rules are what I'd call "production ready." They're tested rather anecdotally by running them manually against one test case I know they should fail and one that I know they should pass, but there's not exactly complete coverage, and it's not automated. I might do that as a follow-up.

But for now the point is that they're only as good as I need them to be! I'm the only one using them, and they prevent my site from regressions so they're doing their job.

## Future Developments

This second rule is a good candidate for automated fixing. Right now, it'll just tell me if it finds a post where the categories aren't all lowercase, but by providing it some more information I could have it automatically downcase all of them too. But that's a story for another time.

If you want to check out any of the custom rules I've written, you can see the source code [here](https://github.com/ayyjohn/ayyjohn.github.io/tree/master/custom_lint_rules)
