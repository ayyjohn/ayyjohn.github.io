---
layout: post
title:  "Comically Valid Syntax in Python"
date:   2021-03-26 13:21:07 -0800
permalink: /posts/:title
categories: [python]
---
Sometimes you run across something in Python that looks like it should generate a syntax error but doesn't.
Here's a monstrosity I ran into this morning.

## Tuples in Python
I've always found tuples and tuple unpacking in Python to behave more than a little strangely.

For example, it's a pretty common accident to include an extra comma and find out that rather than

{% highlight python %}
>>> x = 10
>>> x
10
{% endhighlight %}

you've got

{% highlight python %}
>>> x = 10,
>>> x
(10,)
{% endhighlight %}

and as it turns out, this is a perfectly reasonable way to create tuples! parentheses are optional.

{% highlight python %}
>>> l = 10, 11, 12, 13
>>> l
(10, 11, 12, 13)
{% endhighlight %}

but then of course when you explicitly try to create a tuple with one element

{% highlight python %}
>>> x = (10)
>>> x
10
{% endhighlight %}
Urgh.

I guess that's what you should expect, because the point of parentheses in Python is just order of operations and grouping multiline statements. So, technically, the _correct_ way to make a tuple is the first one, and the fact that the parentheses are there in the `__str__` representation is just for our fragile eyes.

## Unpacking Tuples

Unpacking tuples is another syntax lots of people might have seen but not have explored.

For those who aren't familiar, tuple unpacking basically allows you to do multiple assignments in one expression as long as the number of variables matches the number of items, and it actually works for all iterables.

The most basic example:

{% highlight python %}
>>> l = (10, 11, 12)
>>> x, y, z = l
>>> x
10
>>> y
11
>>> z
12
{% endhighlight %}

but there's also the convention of using `_` to drop items if you only want one

{% highlight python %}
>>> l = (10, 11)
>>> x, _ = l
>>> x
10
>>> _
11
{% endhighlight %}

and that underscore is actually a variable, it's just convention for "not needed." You do need _something_ there though, cause if you do

{% highlight python %}
>>> l = (10, 11)
>>> x, = l
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: too many values to unpack (expected 1)
{% endhighlight %}

wait. it doesn't complain that it's a syntax error?

oh lord.

{% highlight python %}
>>> l = 10,
>>> x, = l
>>> x
10
{% endhighlight %}

and as you may know, whitespace in some cases in Python can be ignored:

`[10, 11, 12] == [10,11,12]`

which leads us to this monstrosity
<!-- markdownlint-disable MD037 -->
{% highlight python %}
>>> l = 10,
>>> x ,= l
>>> l
(10,)
>>> x
10
{% endhighlight %}
<!-- markdownlint-enable MD037 -->

_sigh_