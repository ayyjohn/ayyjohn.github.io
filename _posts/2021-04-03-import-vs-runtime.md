---
layout: post
title:  "Import Time vs Run Time in Python"
date:   2021-04-03 21:21:07 -0800
permalink: /posts/:title
categories: [python]
---
Earlier today I was working with my student at [Ada Academy](https://adadevelopersacademy.org/) about `import`s in Python.
The root of their question was essentially "what happens when I import something" which lead to me doing a poor job of trying to explain the difference between "import time" and "run time."

In compiled languages, compile time and run time are distinct. Compilation is its own step, and imports are checked during compile time to make sure they exist and that there are no cycles. Compiled code is then run, hence "run time."

But in Python, an interpreted language, code is just run.
And so the reason that I was failing was that I was trying to describe a distinction between "importing code" and "running code" which, in Python, [doesn't actually exist](https://www.benkuhn.net/importtime/).

## So What Happens?

When Python modules are imported, they're executed (aka run), and it just so happens that **most Python code, when executed, doesn't do anything but declare something**, like a class. When you write a function in the Python REPL, all that happens is that function is available for later use.

But if you write something like `print("hello")`, it runs, and if you include bare, executable code in a Python file and import that file, it'll get run too. That's actually what's happening when you type

{% highlight python %}
import antigravity
{% endhighlight %}

because the body of that file looks like

<!-- markdown-link-check-disable -->
<!-- markdownlint-disable MD022 MD025 CMD003 CMD004 -->
{% highlight python %}
# antigravity.py
import webbrowser
import hashlib

webbrowser.open("https://xkcd.com/353/")

def geohash(latitude, longitude, datedow):
    ...
{% endhighlight %}
<!-- markdownlint-enable MD022 MD025 CMD003 CMD004 -->
<!-- markdown-link-check-enable -->

and so that `webbrowser.open("https://xkcd.com/353/")` call is immediately invoked. Don't do this.

## There's a Better Way

This behavior is why you tend to see a script that could be written as

{% highlight python %}
x = 10
print(x)
{% endhighlight %}

written as

{% highlight python %}
def main():
    x = 10
    print(x)

if __name__ == "__main__":
    main()
{% endhighlight %}

If you don't do this, your code _will_ be executed when it's imported, which is usually bad, or at least unexpected by the user.
But no matter which way you do it, you can execute the code via `python filename.py`, except now you can also do `from filename import main`.

And it's pretty cheap, as the code's author, to add this extra boilerplate just in case you want to reuse your function by importing it later.

This is why, unless you're explicitly trying to make something happen when your library is imported, you should pretty much never have any code that actually executes at import time. You don't want users of your code to unknowingly run code that they didn't ask for.

## Why Does This Matter?

So, back to the original point of "what happens when I import something?" the answer is: it's executed.

Still, I think it's useful to draw a distinction between import time and run time in Python, even if a functional one doesn't exist.

To me, it makes sense to define "import time" as basically what happens between the first and last import statement in the file you're executing and "run time" as everything that happens after the interpreter starts up once you try and execute a script. So import time is a subset of run time.

<!-- markdownlint-disable MD022 MD025 CMD003 CMD004 -->
{% highlight python %}
# run time starts
# import time starts
import time
import space
import the_human_race
# import time ends

def f():
    pass

if __name__ == "__main__":
    f()

# run time ends
{% endhighlight %}
<!-- markdownlint-enable MD022 MD025 CMD003 CMD004 -->

During import time Python is effectively [searching everywhere it knows it should](https://chrisyeh96.github.io/2017/08/08/definitive-guide-python-imports.html#basics-of-the-python-import-and-syspath) for the module you told it to look for, and then recursively importing (aka running) everything that file needs until eventually it hits a file that requires no new dependencies. (This creates what's called a "Dependency Tree" which you can actually inspect using a tool called [pipdeptree](https://pypi.org/project/pipdeptree/).

And the goal should be to have as few things as possible that you don't expect happen during that process.
