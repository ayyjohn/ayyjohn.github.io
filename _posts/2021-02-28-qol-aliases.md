---
layout: post
title:  "Quality of Life Aliases"
date:   2021-02-27 17:21:07 -0800
permalink: /posts/:title
categories: [zsh, python]
---
One of the things that I miss most about working in an office with coworkers is knowledge sharing.

There's plenty of technical documentation for when you need to know about a system you work with, and we literally have Knowledge Share&trade; sessions designed to knock down work silos and increase distribution of critical system information.

And yet I've felt a surprising lack of growth the past year. I feel like this has to do in a lot of ways with the feeling that, despite having been at Dropbox a year longer, I'm still working with the same engineering toolkit that I had a year ago.

One of my favorite periods during work is when a new person is onboarding to the team. In part because it's an exciting opportunity to make a new friend, in part because they bring new ideas and perspectives to the team, and in part because while they're new it's perfectly legitimate to pair with them extensively and there's a high volume of things that are new to me or them flowing back and forth.

My favorites are when I'm showing them how to do something and they notice a shortcut or alias that I use and either they haven't seen it or they know a better way. In the spirit of things like that, I'm going to post some of my favorite "Quality of Life Aliases" that help my productivity when I'm coding or just generally using my computer.

## 1. Better CD

{% highlight BASH %}
c () {
  cd "$@" && ls;
}
{% endhighlight %}

This one works on `BASH` and `ZSH` both. It comes from the thought process of "how often do I `cd` and not immediately `ls` afterward?". It's got the added benefit of saving a character, and there are plenty of similar aliases you could do just to turn a longer command into a shorter one. This one combines two of the most common commands I'd use on a daily basis, and sometimes the biggest wins come from a smaller optimization of a common thing than a big time gain on something less used.

## 2. Startup Scripts

Sometimes when you're working on a project there's some setup that you have to do every time you work on it. This could include things like opening your editor, activating a virtual environment, starting a server, sourcing an `ENV` file, and more.
These can easily be combined into one alias that you can just call to get to work. You can do one better by having that command take you to the directory you need or activating whenever you enter that directory using tools or some fancy scripting.

Here are some examples from this blog itself
{% highlight BASH %}
alias blog="c ~/ayyjohn.github.io && code ."
alias start="bundle exec jekyll serve --livereload"
{% endhighlight %}

## 3. Path Update

{% highlight BASH %}
alias path="export PATH=$PATH:$(pwd)"
{% endhighlight %}

This one's pretty self explanatory but I like it a lot. It adds the current directory to the current path. The reason I like it is because it's less about reducing typing and more that it's the type of operation that I don't do quite often enough not to have to Google it whenever I need it. This helps me just need to remember "something ... path" and I'm there.

## 4. SSHing

{% highlight BASH %}
alias website="ssh -i ~/.ssh/whatever.pem ayyjohn@some-ip.us-west-2.compute.amazonaws.com"
{% endhighlight %}

If you have a remote server somewhere, even if you have a custom domain and so don't need to remember the IP, this one comes in handy a lot anyway. Having one for each of the servers I SSH onto for personal use and one for each of the prod shells at work makes a real difference.

## 5. Python Scripts

This one took me way too long to figure out. I recognized the SheBang at the top of `BASH` files, you know

```bash
#!/bin/bash
```

but I hadn't spent enough time considering the implications of putting other things there. In my mind it was just "how you start a shell script" rather than "how you start ANY script."

It really opened stuff up for me when I realized that you could do

```bash
#!/bin/python3
```

and then write scripts and have them be executable just by `chmod +x`ing the file. The thing that really makes this useful, though, is creating a directory for these and adding it to your path. That essentially means the scripts are in scope at all times.
Somewhere like

```bash
~/scripts_bin/
```

An example of this type of thing: At work we use [Bazel](https://bazel.build/) to control build dependencies which means when you want to run a test, instead of using `pytest` you use `bzl test {target}`. In _almost_ every case the target is the path to the file, minus `.py` and with a `:` instead of a `/` before the last file. So to run the tests in

```bash
src/cash/invoices/invoice_tests.py
```

I would do

```bash
bazel test src/cash/invoices:invoice_tests
```

This gets cumbersome, so I'd rather do

```bash
t src/cash/invoices/invoice_tests.py`
```

and have the computer handle the parsing for me, especially because then I get to leverage auto-completion.

## Feedback

What do you think? Were any of these inspirations for you to make your own? Were they helpful? Email me some of your favorites, I'm always looking for new ones.
