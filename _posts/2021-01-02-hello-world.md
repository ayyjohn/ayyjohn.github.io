---
layout: post
title:  "Hello World"
date:   2021-01-02 15:13:18 -0800
permalink: /posts/:title
categories: [meta, python]
---
First!
Or something like that.

I'm still coming up with good things to write for my first post, so check back soon for actual content.

Meanwhile, did you know tuple unpacking in Python (and other languages) supports nesting?
{% highlight python %}
>>> t = (0, (1, 2))
>>> a, b, c = t
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: not enough values to unpack (expected 3, got 2)
>>> a, (b, c) = t
>>> a
0
>>> b
1
>>> c
2
{% endhighlight %}

This came up in an interview the other day and I thought it was nifty.
Also, if you find yourself doing this in an interview, maybe think twice about your solution.