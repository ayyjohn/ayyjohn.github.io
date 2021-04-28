---
layout: post
title:  "Baby's Intro to the CPython Source Code"
alternate_title:  "Fun in Programming Languages"
date:   2021-02-02 11:00:17 -0800
permalink: /posts/:title
categories: [python]
---
Most people are familiar with the most famous Python standard lib easter eggs.
Things like The Zen of Python being available by typing `import this`.
Or the [XKCD comic](https://xkcd.com/353/) you can open by typing `import antigravity`.
I had both of these told to me pretty early in my Python career.

Some are kind of hard to discover without actually inspecting the source though.

At the start of COVID I was working on a SQLAlchemy project and realized I knew precious little about how SQL databases work, so I decided to go about building my own mini SQLite. ([Code if you're interested](https://github.com/ayyjohn/ayysql))

## Cloning and Modifying Source Code

While I was looking into how SQL stores things in pages I came across Julia Evans' [blog post about SQLite](https://jvns.ca/blog/2014/09/27/how-does-sqlite-work-part-1-pages/) where she clones the source code, manually re-builds it, and runs it so that she can observe some internal behavior. I couldn't believe I'd never thought to do this type of thing myself.

I cloned the [cPython source](https://github.com/python/cpython) and went about inserting some print statements to watch the code execute. This really helped me grasp some of the concepts I'd heard about in tours of the CPython virtual machine.

Then I realized that since I was looking at the entire CPython source code, everything in the standard lib must be in here.
Here's a other couple things I found.

## My Own Easter Egg Hunt

The first thing I thought to go looking for was the code for The Zen of Python. Since it's part of the standard library, the code for `import this` must be there somewhere so I went looking for it.
I searched the first line of the poem: "Beautiful is better than ugly", but all that turned up was some test files and a docstring for `difflib`.
Then I realized, because of Python's import mechanism, it would have to be in a file called `this.py` so I searched for that and there it was! It's almost like they were deliberately trying to avoid people doing what I had done on my first try.

<!-- cSpell:disable */  -->
{% highlight python %}
s = """Gur Mra bs Clguba, ol Gvz Crgref

Ornhgvshy vf orggre guna htyl.
Rkcyvpvg vf orggre guna vzcyvpvg.
Fvzcyr vf orggre guna pbzcyrk.
Pbzcyrk vf orggre guna pbzcyvpngrq.
Syng vf orggre guna arfgrq.
Fcnefr vf orggre guna qrafr.
Ernqnovyvgl pbhagf.
Fcrpvny pnfrf nera'g fcrpvny rabhtu gb oernx gur ehyrf.
Nygubhtu cenpgvpnyvgl orngf chevgl.
Reebef fubhyq arire cnff fvyragyl.
Hayrff rkcyvpvgyl fvyraprq.
Va gur snpr bs nzovthvgl, ershfr gur grzcgngvba gb thrff.
Gurer fubhyq or bar-- naq cersrenoyl bayl bar --boivbhf jnl gb qb vg.
Nygubhtu gung jnl znl abg or boivbhf ng svefg hayrff lbh'er Qhgpu.
Abj vf orggre guna arire.
Nygubhtu arire vf bsgra orggre guna *evtug* abj.
Vs gur vzcyrzragngvba vf uneq gb rkcynva, vg'f n onq vqrn.
Vs gur vzcyrzragngvba vf rnfl gb rkcynva, vg znl or n tbbq vqrn.
Anzrfcnprf ner bar ubaxvat terng vqrn -- yrg'f qb zber bs gubfr!"""

d = {}
for c in (65, 97):
    for i in range(26):
        d[chr(i+c)] = chr((i+13) % 26 + c)

print("".join([d.get(c, c) for c in s]))
{% endhighlight %}
<!-- cSpell:enable */  -->

The goobers decided to use a [rot13 cypher](https://en.wikipedia.org/wiki/ROT13). Rude.

## Antigravity

After finding the code for the above, my second thought was to go look at the Antigravity module. Since just importing it opens your default web browser I figured it must be just a script that uses `webbrowser.open()` and that is indeed part of what it does, but there's one more thing that you'd probably never know was there unless you either looked at the source or imported it and did

{% highlight python %}
>>> dir(antigravity)
['__builtins__', '__cached__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__spec__', 'geohash', 'hashlib', 'webbrowser']
{% endhighlight %}

which, if you look carefully, shows that antigravity imports webbrowser (for opening the comic) and also hashlib and geohash.

Except...

{% highlight python %}
>>> import geohash
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ModuleNotFoundError: No module named 'geohash'
{% endhighlight %}

Either way you'd end up looking at `antigravity.py` and realize that the module contains one function: `geohash` which implements the geohash algorithm contained in [xkcd.com/426/](https://xkcd.com/426/).
I kind of love the mutual love between Randall Munroe and the Python community.
Having fun things like this in Python's standard lib is one of my favorite reasons to recommend it to newcomers to programming.
I like using a language for my job that people have spent time making enjoyable.
