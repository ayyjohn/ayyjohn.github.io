---
layout: post
title:  "Being Able to Answer Stupid Questions"
alternate_title:  "Justice for Max Dell"
date:   2021-03-08 10:21:07 -0800
permalink: /posts/:title
categories: [python]
---
One of my favorite things about knowing how to program is the ability it gives me to do really stupid things. Not like, hacking the government or stealing money or anything, just satisfy my brain's silly curiosity.

Randal Munroe, creator of [XKCD](https://xkcd.com/), wrote a book called [What If](https://www.amazon.com/What-Scientific-Hypothetical-Questions-International/dp/0544456866) that captures this idea pretty perfectly.
His knowledge of physics, math, and chemistry allow him to do reasonable calculations to answer questions like "[If all digital data were stored on punch cards how big would Google's data warehouse be?](https://www.youtube.com/watch?v=I64CQp6z0Pk)" by looking at their power consumption, data center size, and expenditures on drives.

It's like a whimsical version of dimensional analysis, that process in high school chem class where you convert units by multiplying them out.
(*It's also how you should approach obnoxious interview questions like "how many elevator repairmen work in New York City?*")

## Brains are Weird

Earlier this week I was rewatching Breaking Bad with my girlfriend. One of the fun gimmicks of the show is that during the opening credits they take all the names and insert a chemical element's symbol.
So for example, Aaron Paul becomes A**Ar**on Paul because they inserted `Ar` for Argon, and Bryan Cranston becomes **Br**yan Cranston because they inserted the `Br` for Bromium.

And that got me wondering whether there are reasonable names that you can't put elemental symbols in.

## The Question

What would happen if somebody had auditioned for a part in Breaking Bad but they were denied the role because their name couldn't be "elementified"?

![periodic table](/assets/max_dell/periodic_table.png)

Just the first three rows cause a lot of problems by themselves. They knock off any names containing `H, B, C, N, O F, P, or S`, and then Iodine, Uranium, and Yttrium take care of  `I`, `U`, and `Y` too.

This means the only vowels available are `A` and `E`, and even then a lot of common uses for them are eliminated by elements like Argon, Astatine, Neon, and Beryllium.

Then there are rude elements like Thorium and Arsenic that take away a whole bunch of names by themselves by removing `Th` and `As` which are super common combinations.

All this is to say that it didn't feel easy to come up with any off the top of my head, so I decided to use programming to answer the question.

## Switching to Code

This question can be reduced to the combination of three other questions

1. What are all possible first and last names,
2. Which of them do not contain an elemental symbol
3. Are there any actors with those names?

One thing I love about the internet is that if you have a question, probably somebody has already had it before.
However, a few quick Google searches reveal that this hasn't been asked on Quora or Reddit before. Someone _has_ created [a Python module for elements](https://pypi.org/project/PeriodicElements/), though, and someone _has_ created [a database of common first and last names](https://github.com/smashew/NameDatabases), and IMDb will let us look for actors given a name, too. So now all I needed to do was aggregate those three together.

Here's what I came up with
{% highlight python %}
from elements import elements

all_element_symbols = [symbol.lower() for symbol in elements.AllSymbols]
print(all_element_symbols)

first_name_count = 0
with open("first_names.txt", "r") as first_names:
    for first_name in first_names.readlines():
        if not any(symbol in first_name for symbol in all_element_symbols):
            first_name_count += 1
            print(first_name, end="")

last_name_count = 0
with open("last_names.txt", "r") as last_names:
    for last_name in last_names.readlines():
        if not any(symbol in last_name for symbol in all_element_symbols):
            last_name_count += 1
            print(last_name, end="")
{% endhighlight %}

I'm always amazed how little code it takes for things like this. So many things reduce to simple things like `is x in any of y` or `does there exist one item in x for which some_condition`

This ended up finding just over 30 reasonable first names and over 100 last names (though some of them were kinda ehhh)

A lot of these aren't common enough to search for, so rather than try randomly with all possible combinations of first and last names from this list, there are a few of each we can filter down to and search for. Names like `Max`, `Adele`, `Emma`, and `Jade`.

## The Outcome

From this escapade I was able to find [Max Dell](https://www.imdb.com/name/nm2938935/), a stunt actor who I guarantee would have been hired if it were not for this shameful discrimination by the show's creators. I don't have proof or anything, just this research.

Justice for Max Dell.
