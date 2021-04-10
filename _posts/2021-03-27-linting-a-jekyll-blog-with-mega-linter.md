---
layout: post
title:  "Linting a Jekyll Blog with Mega-Linter"
date:   2021-03-27 15:21:07 -0800
permalink: /posts/:title
categories: [meta, jekyll, linting]
---
A friend of mine introduced me to [Gwern's blog](https://www.gwern.net/About#) a while back. Some of the posts are interesting, and they're definitely well written.
And even though I didn't become a regular reader, one thing that caught my eye was the meta section of the About page where they talk about various technical aspects of the blog, including custom linters.

## Why Lint Your Blog?

There's a lot of good reasons to lint your blog. Basics start at spellchecking and syntax, where you might catch a typo or two per post. But there's a lot more available.
Once a blog gets large enough, you start having degradation of quality because it's not easy to manually check for consistency between posts. You may not use the same formatting, and so posts might look different. You might forget if you normally use `##` or `###` for sub headers, or if you always use punctuation.
Links may expire, and so older posts will have dead links that don't point anywhere anymore.
Long story short, just like having an auto linter on a production codebase is a great idea, so is having an auto linter on your blog! So that's what I added this morning to this site.

## What I Chose to Use

Gwern wrote a custom linter, and working at Dropbox we had a combination of [Black](https://github.com/psf/black) and custom lint rules. The custom rules are really useful for projects like deprecations where you can say, via code, "hey, if you see someone writing new code invoking {deprecated function} put a note on their pull request directing them to a doc with info about the deprecation."

I definitely want some custom lint rules for myself, though they're not quite as useful when you're the only person working on a project. But to get started, I wanted to leverage a pretty strong base layer, because I know almost nothing about ASTs and the kind of stuff necessary to write my own linter from scratch. I'd much rather add custom rules to an existing framework.
By default, I mostly care about linting the actual posts, so that's just markdown. [markdownlint](https://github.com/DavidAnson/markdownlint) exists, and would probably do fine, but it also comes as part of [mega-linter](https://github.com/nvuillam/mega-linter) which extends to a bunch of other languages.
This means I can start by limiting linting to my posts, and over time expand to other folders and file types, just how you would if you were introducing a linter or typing system into a production codebase that had been around a while.

## Starting Out

After installing mega-linter using `npm` I tried running it in default mode on my whole repo, and there were thousands of errors. So many that I didn't even know where to start.
So the first thing I did is majorly decrease scope.

mega-linter uses a `.mega-linter.yml` as a config file, and so I made one and put in the following

<!-- markdownlint-disable MD003 MD022 MD025 MD032 CMD003 CMD004 -->
{% highlight yaml %}
---
# only check for markdown errors and spelling
ENABLE:
- MARKDOWN
- SPELL
# only look in the _posts/ directory
FILTER_REGEX_INCLUDE: (_posts/)
# reduce startup time by telling the linter that this is a ruby project
FLAVOR: ruby
# suppress fun output cause I'm boring
PRINT_ALPACA: false
# tell me how long linting is taking
SHOW_ELAPSED_TIME: true
---
{% endhighlight %}
<!-- markdownlint-enable MD003 MD022 MD025 MD032 CMD003 CMD004 -->

This produced a much more manageable report where I can actually parse the logs and understand what to change. The first output had a lot of things I don't care about, and this one still does, but not nearly as many.

## Spelling

The first thing the report tells me is that I have a _lot_ of misspelled words. My [Python Easter Eggs post](/posts/python-easter-eggs) by itself gave me hundreds because of the ROT13 cyphertext inside it. Luckily, each of the individual linters that mega-linter uses can be more tightly configured, including straight up ignoring files or disabling certain rules in a block.

The spelling checker it uses by default is called [cSpell](https://www.npmjs.com/package/cspell), and you can create a `.cspell.json` with keys like `words` and `flagWords` where `words` is a list of overrides where you can basically tell it "yes, this is a word." and `flagWords` is the opposite, so you can include words you tend to mis-type, or words you always want to type a certain way. So for example, if you can't remember whether you want to always use "nonbinary" or "non-binary" or "non binary", you can add the two versions you don't want to `flagWords`.
Also, in order to generate the report of invalid words, cSpell will create a sorted array of words it didn't recognize so that you can just copy all of them into your `words` list and remove any you didn't mean to add, rather than adding them one by one.

Here's mine (heavily truncated) as an example
{% highlight json %}
{
    "version": "0.1",
    "language": "en",
    "words": [
        "bazel",
        "xkcd"
    ],
    "flagWords": [
        "yeet"
    ]
}
{% endhighlight %}

## Links

Next, my linter told me my blog had a lot of broken links. This is terrible! It sucks to be reading a post you find really interesting and clicking a link to take your research deeper only to find that it's a dead end.
The only thing was that a lot of my links _weren't_ dead, they're just local. Luckily, just like cSpell had its own local config, [markdown-link-checker](https://github.com/tcort/markdown-link-check) has its own `.markdown-link-check.json`

<!-- markdown-link-check-disable -->
{% highlight json %}
{
    "replacementPatterns": [
        {
            "pattern": "^/posts/",
            "replacement": "https://ayyjohn.com/posts/"
        },
        {
            "pattern": "^/assets/",
            "replacement": "https://ayyjohn.com/assets/"
        }
    ]
}
{% endhighlight %}
<!-- markdown-link-check-enable -->

What this does is ensure that any time I include a local link it substitutes my domain before checking validity. This worked for all my internal links, however the report was still telling me I had some further dead links. I went in to fix them, but when I noticed that when I tried them in Chrome, they were still active.
It turns out that some websites actively prevent DDoS attacks and/or crawling by rejecting requests from non-browsers.

```markdown
[markdown-link-check] _posts/2021-02-15-broken-reddit.md - ERROR - 1 error(s)
--Error detail:

FILE: /tmp/lint/_posts/2021-02-15-broken-reddit.md
[✓] <https://ayyjohn.com/posts/tampering-with-reddit>
[✖] <https://www.cloudflare.com/learning/performance/why-minify-javascript-code/>

2 links checked.

ERROR: 1 dead links found!
[✖] <https://www.cloudflare.com/learning/performance/why-minify-javascript-code/> → Status: 403
```

For now, this can be silenced by adding
{% highlight json %}
{
    "aliveStatusCodes": [
        200,
        403
    ]
}
{% endhighlight %}

to my `.markdown-link-check.json` which tells the linter that if it gets a `403` from the website to consider it okay. And with that, my lint output looks like the following

```markdown
+----SUMMARY--+--------------------------+-------+-------+--------+--------------+
| Descriptor  | Linter                   | Files | Fixed | Errors | Elapsed time |
+-------------+--------------------------+-------+-------+--------+--------------+
| ❌ MARKDOWN | markdownlint             |    13 |     0 |    801 |        2.16s |
| ✅ MARKDOWN | markdown-link-check      |    13 |       |      0 |       31.15s |
| ✅ MARKDOWN | markdown-table-formatter |    13 |     0 |      0 |        1.09s |
| ✅ SPELL    | cspell                   |    13 |       |      0 |        5.66s |
| ✅ SPELL    | misspell                 |    13 |     0 |      0 |        1.63s |
+-------------+--------------------------+-------+-------+--------+--------------+
```

Great! Now only `markdownlint` errors remaining.

<!-- markdownlint-disable CMD003 CMD004 -->
## markdownlint
<!-- markdownlint-enable CMD003 CMD004 -->

While the other two linters were looking for particular things (dead links and spelling errors), [markdownlint](https://github.com/DavidAnson/markdownlint) is a multi-purpose, highly configurable tool for finding pretty much _anything_ wrong with your markdown.
There's an exhaustive list of them with an explanation of each in the `README`, and the report it generates will tell you the file and line where you violated each rule. Also, by adding

```yaml
APPLY_FIXES: all
```

to your `.mega-linter.yml` you can have it automatically fix any that it knows how to. This is great for bulk fixing things like newlines and spacing.

With so many failures, the first step was to figure out which rules I actually care about. By creating a `.markdown-lint.json` and adding the following to it

{% highlight json %}
{
    "default": true,
    "MD003": {
        "style": "atx"
    },
    "MD013": false,
    "MD033": false
}
{% endhighlight %}

I can silence a _lot_ of the errors from `MD103` (long lines) and `MD033` (no-inline-html) because frankly I don't care about either of those things.

With a lot less noise, the output was much nicer. My goal at this point became to add inline ignores for the exceptions that I wanted to remain, and then turn on the `APPLY_FIXES` flag for the remaining ones.

For example, in my last post about tuple unpacking I had the following snippet

{% highlight markdown %}
{% raw %}
{% highlight python %}
>>> l = (10, 11)
>>> x, _= l
>>> x
10
>>>_
11
{% endhighlight %}
{% endraw %}
{% endhighlight %}

which rule `MD037` flagged as a "space in emphasis" because it recognized the `_` as me trying to italicize text.
If you wrap that code in the following tags, it silences the error, similar to something like `type: ignore` in MyPy.

```markdown
<!-- markdownlint-disable MD037 -->
<!-- markdownlint-enable MD037 -->
```

After a series of those, the remaining lint warnings were all for fixable errors like `MD047` (files should end with a single newline character), so I turned on `APPLY_FIXES: all` and let the linter fix the remaining issues.

```markdown
+----SUMMARY--+--------------------------+-------+-------+--------+--------------+
| Descriptor  | Linter                   | Files | Fixed | Errors | Elapsed time |
+-------------+--------------------------+-------+-------+--------+--------------+
| ✅ MARKDOWN | markdownlint             |    13 |   104 |    104 |        2.73s |
| ✅ MARKDOWN | markdown-link-check      |    13 |       |      0 |       22.69s |
| ✅ MARKDOWN | markdown-table-formatter |    13 |     0 |      0 |        0.49s |
| ✅ SPELL    | cspell                   |    13 |       |      0 |        5.87s |
| ✅ SPELL    | misspell                 |    13 |     0 |      0 |         1.4s |
+-------------+--------------------------+-------+-------+--------+--------------+
```

Awesome!

With this solid base, I can follow up by slowly expanding the scope to new directories and new linters.
In addition, mega-linter has some really awesome features that let you do things like only lint new changes, or disable certain linters by default. For example, I added

{% highlight yaml %}
DISABLE_LINTERS:

- MARKDOWN_MARKDOWN_LINK_CHECK
{% endhighlight %}

to my `.mega-linter.yml` so that it won't automatically check for broken links. I can always run that manually every so often, but as you can see from the `Elapsed time` part of the table above, link checking takes 22 seconds, while the next slowest part of linting is spelling at about six seconds.

In a follow-up post I'll go into more detail about adding custom lint rules. Look out for it!
