---
layout: post
title:  "Evaluation vs Execution in Python"
date:   2021-04-25 12:30:51 -0800
permalink: /posts/:title
categories: [python]
---
Most people, when they're introduced to Python, are told it's run top to bottom.

That is to say, if you write

```python
def f():
    print("hello")
    print("world")

f()
```

it'll execute the top statement first, and the second statement second.

```python
hello
world
```

This helps us as teachers to explain to new programmers how to read code, and it's a contrast to languages
like Javascript.
Javascript is asynchronous by default and so you can't depend on something that is invoked above happening before something that is invoked below.

```javascript
const first = () => {
    console.log("first!");
}
const second = () => {
    console.log("second!");
}
const third = () => {
    console.log("third!");
}
first();
setTimeout(second);
third();
```

Because we technically schedule the execution of `second` with `setTimeout`, even though we tell it to happen as soon as it can, we get the following

```javascript
first!
third!
second!
```

node has moved on.

For more on this behavior, I recommend [this video on Javascript's execution model and the event loop](https://www.youtube.com/watch?v=8aGhZQkoFbQ).

The "equivalent" python code would look something like this

```python
import time

def first():
    print("first!")

def second():
    print("second!")

def first():
    print("third!")

first()
time.sleep(0)
second()
third()
```

but this isn't really the same as saying "enqueue an invocation of `second`." What it's really saying is "pause momentarily before executing `second` and then proceed, which it does

```text
first!
second!
third!
```

without you even knowing the `sleep` call was there.

Without involving an async framework like [asyncio](https://docs.python.org/3/library/asyncio.html) we can't really replicate the same behavior in Python, which only reinforces what we were told in the beginning: Python executes top to bottom.

<!-- markdownlint-disable CMD004 -->
## You Were (sort of) Lied To
<!-- markdownlint-enable CMD004 -->

Recently, though, I was introduced to a youtube channel [mCoding](https://www.youtube.com/channel/UCaiL2GDNpLYH6Wokkk1VNcg) and he put up a video [Variable Lookup Weirdness in Python](https://www.youtube.com/watch?v=9v8eu4MOet8) that broke my mental model of Python's execution.

This gets back to my [import vs runtime](/posts/import-vs-runtime) post, and only reinforces my point that there _is_ a difference, even if it's not as clearly cut as in a compiled language.

In his video, mCoding distinguishes between the following two functions

```python
def f():
    print(x)
```

```python
def g():
    print(x)
    x = 1
```

My inclination when watching this was that both functions would have the same result, but they don't.

```python
>>> f()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 2, in f
NameError: name 'x' is not defined
```

```python
>>> g()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 2, in g
UnboundLocalError: local variable 'x' referenced before assignment
```

This is only possible because Python doesn't just evaluate code top to bottom on the fly. Code _is_ executed top to bottom (as long as it's spaghetti code), but it's interpreted first and that interpretation allows for what looks, to us at runtime, like look-ahead.

This is to say nothing of a language like Rust which can tell that this type of thing will happen _at compile time_, instead of letting us define the function and only complaining when it's executed, but that's a story for another time.
