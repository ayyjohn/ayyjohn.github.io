---
layout: post
title:  "Tampering with Reddit"
date:   2021-02-06 9:23:00 -0800
permalink: /posts/:title
categories: [tampermonkey, scripting, javascript]
---
Using TamperMonkey for [my recent post about messing with the Pepsi ROTY vote](/posts/herbie-for-roty) had me kind of on the lookout for other scripts to write.

## JavaScript for Beginners
I often recommend new potential programmers who aren't sure coding is for them try JavaScript (over Python) specifically because it allows you to immediately jump in, either via the Chrome Devtools console, or things like UserScripts, and mess with web pages for real. Silly things like removing elements of a page or changing how a button behaves can really give you that HackerMan&trade; feel, even if you've been coding for a while.

## Automating Things for the Sake of Automating
Today I got around to thinking about a minor improvement to my life that 100% conforms to the "why do something mildly inconvenient in six seconds when I could spend 30 minutes automating" mindset.

I'm a fogie, by which I mean I still use old.reddit.com. I hate the new design for a lot of reasons, especially visually, but I specifically love the old design because it works with [https://redditenhancementsuite.com/](Reddit Enhancement Suite). One thing I really love about RES is its keyboard shortcuts. I'm a big fan of [Vimium] but RES works way better, so I disable Vimium on Reddit. One of the best keyboard shortcuts is the one that lets you jump to a subreddit from r/all. However, 99.9% of the time when I use that keyboard shortcut it's to go to a sub I just found and the first thing I have to do is use my mouse to the top of the page to select `top of all time`. Can't have that.

## Back to UserScripts
So I decided to write a little script in Tampermonkey that makes it so that all the subreddit links link in a new page to the top of all time in a subreddit.

I started by trying to do it in jQuery. Or rather, thinking of trying to do it in jQuery. I remember almost 0% of the jQuery I learned 3 years ago when I was using JS and React regularly. `$.ajax()` is still a thing, right?

Whatever. Vanilla JS is fine, honestly. I don't get enough chances to write fat arrow functions (which are honestly one of my favorite. I way prefer them over Python's Lambdas)

The first thing I tried was to add another link next to the subreddit links so I'd have the option to go to either top all time OR just the regular sub.

![right there](/assets/tampering_with_reddit/example_1.png)

but I immediately encountered a goofy problem.
See, when you use `document.getElementsByClass('subreddit');` to get all the subreddit links, that list doesn't actually return a normal JavaScript `Array`, it returns an *`HTMLCollection`*. Which I assumed would behave close enough, but first of all `forEach` is not defined on it so I have to use a `for of` loop, and second, when I do loop over it for my first trip it hangs... and by adding a cap on the number of iterations I can see why.

{% highlight javascript %}
(function() {
    function addTopLink(element) {
        let copy = element.cloneNode();
        copy.href += "top";
        copy.textContent += "/top";
        element.after(copy);
    }
    function addTopLinks() {
        var subreddits = document.getElementsByClassName("subreddit")
        let i = 0;
        for (var subreddit of subreddits) {
            addTopLink(subreddit);
            i += 1
            if (i > 20) {
                break;
            }
        }
    }
    addTopLinks();
})();
{% endhighlight %}

![god_damnit](/assets/tampering_with_reddit/stupid_loop.png)

See, it turns out that `HTMLCollection` is live updated. So when I add a new anchor tag with the class `subreddit`, it gets inserted into the `HTMLCollection` and comes up on the next iteration, gets a new anchor tag added after it, and so on, infinitely.

The lazy workaround is to modify my goal and just change the links to point to the subreddit's top all time, rather than adding an additional link.

{% highlight javascript %}
function addTopLink(element) {
    element.target = "_blank"; // makes link open in new tab
    element.href += "top";
    element.textContent += "/top";
}
{% endhighlight %}

and this does work

![lazy_v1](/assets/tampering_with_reddit/working_v1.png)

but it leaves something to be desired. Now if I actually just want to go to the subreddit, that's a pain.

## Back to Basics with querySelectors
With a quick search I was able to find other people encountering the same problem as I did with `HTMLCollection` being dynamic. [This blog post](https://medium.com/@layne_celeste/htmlcollection-vs-nodelist-4b83e3a4fb4b) has a great explanation of a workaround, which is to use `document.querySelectorAll` which returns a `NodeList` instead, and `NodeList`s are static.

{% highlight javascript %}
(function() {
    function addTopLink(element) {
        let copy = element.cloneNode();
        copy.href += "top";
        copy.textContent += "/top";
        element.after(copy);
    }
    function addTopLinks() {
        var subreddits = document.querySelectorAll("a.subreddit")
        for (var subreddit of subreddits) {
            addTopLink(subreddit);
        }
    }
    addTopLinks();
})();
{% endhighlight %}

![almost_v2](/assets/tampering_with_reddit/almost_v2.png)

It looks like nothing changed, but actually, it has! There's two links there, smushed right next to each other. And by clicking on either of them, I can tell that one does indeed go to `r/gaming` and the second goes to `r/gaming/top` which is great.

## Cleaning Up
By adding a 3px `marginRight` to the `style` of the original element I can split the two apart so that it looks a little nicer.
The one thing that's missing is that on line 16 I added `"/top"` to the end of the `textContent` of the original element for the new element. So I expected it to be `r/gaming/top`, not just `/top`.
It turns out that `HTMLElement.cloneNode()` has a parameter, `deep` that defaults to `true`, which means the textContent isn't getting copied. So with one final change, here's the final script

{% highlight javascript %}
// ==UserScript==
// @name         Reddit All Links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ayyjohn
// @match        https://www.reddit.com/*
// @grant        none
// ==/UserScript==

(function() {
    function addTopLink(element) {
        let copy = element.cloneNode(true);
        element.style.marginRight = '3px';
        copy.href += "top";
        copy.textContent += "/top";
        element.after(copy);
    }
    function addTopLinks() {
        var subreddits = document.querySelectorAll("a.subreddit")
        subreddits.forEach(subreddit => addTopLink(subreddit));
    }
    addTopLinks();
})();
{% endhighlight %}

![working_v2](/assets/tampering_with_reddit/working_v2.png)

Cool! And as a final bonus, now that I'm working with a `NodeList` I get `NodeList.forEach()`.