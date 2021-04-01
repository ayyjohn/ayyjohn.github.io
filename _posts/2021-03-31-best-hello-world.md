---
layout: post
title:  "The Best Hello World Program"
alternate-title: "Why I Recommend Python to Beginners"
date:   2021-03-31 6:21:07 -0800
permalink: /posts/:title
categories: [python]
---
What makes a good "Hello, World!" program?

I've been volunteering as a 1:1 mentor at Ada Academy for over a year now, but this month, for the first time, I volunteered for [Ada Build](https://adadevelopersacademy.org/ada-build-prepare/), their prep course to help incoming students get ready to apply to the program.

As opposed to the students I've mentored 1:1, these students are often at the very beginning of their programming journey and need help with things from basic terminology and syntax to their first loop.

It's not so often, once you've been programming for a few years, that you get to go back and put yourself in the shoes of someone who looks at something like

{% highlight python %}
print("Hello, World")
{% endhighlight %}

and goes "I don't get it," but it really is a pivotal moment in any coder's journey. The resistance they feel in that moment can impact whether or not they decide to continue on with programming at all.
That got me thinking about what the best possible introduction to programming is.

## The Original

Ever since [the original C programming language demo](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program) programmers have been taking their first steps by writing this program, in some form, in whatever language they're first introduced to.

<!-- markdownlint-disable MD025 -->
{% highlight c %}

# include <stdio.h>

int main() {
   printf("Hello, World!");
   return 0;
}
{% endhighlight %}
<!-- markdownlint-enable MD025 -->

Not ideal. Even if you get the gist of this, you're likely to wonder what the heck a bunch of it means.

## The Best

I still think Python 2.7's Hello World is the cleanest I've ever seen.

{% highlight python %}
print "Hello, World!"
{% endhighlight %}

Part of it is that `print` wasn't a normal function in Python2 and so it's missing parentheses, which often confuse people who don't have a math background. Part of it is just the sheer simplicity of it.

No `\n`, no `;`. The choice of `print` as the function name doesn't require understanding what "the console" is, or what objects are, like JavaScript's does, and is more clear than Ruby's `puts` (though, points to Ruby for cuteness)

{% highlight ruby %}
puts "Hello, World!"
{% endhighlight %}

{% highlight javascript %}
console.log("Hello, World!");
{% endhighlight %}

or Java for that matter, which not only requires a call to `System.out`, but needs to be wrapped in all this boilerplate and compiled before a user can run their first program.

## The Worst

{% highlight java %}
import java.io.*;

class HelloWorld {
    public static void main(String[] args)
    {
        System.out.println("Hello, World!");
    }
}
{% endhighlight %}

Languages like Go and Rust have intimidating syntax, and it's often not possible to explain to new programmers why they're great, which is why they're rarely recommended to users as a first language.

Given that most people's first programming language nowadays is likely to be one of `[Python, Java, Ruby, JavaScript]` it's probably good to over-index a bit on what the first programming experience will be like to newcomers.

We want to teach new programmers that anything is possible and that programming is delightful, and that starts with their first program.

{% highlight python %}
import __hello__
{% endhighlight %}

wait, no
