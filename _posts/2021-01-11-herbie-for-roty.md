---
layout: post
title:  "Winning ROTY for Justin Herbert"
date:   2021-01-11 12:20:10 -0800
permalink: /posts/:title
categories: [javascript, football, chargers]
---
*tl;dr: I wrote a script to vote for Justin Herbert for Rookie of the year.*

<p align="center">
<img src='/assets/herbie_roty/vote_for_herbie.gif' class="herbie-vote-gif" width="350px" height="350px"/>
</p>

## Football + Programming
I'm not actually sure what the overlap is between football fans and software engineers. There must be some, at least with how aggressively the NFL is advertising AWS.
You've got some crowd out there using some form of SQL to do data analysis to come up with stats like [these](https://twitter.com/JarrettTSutton/status/1333599792858099713).
And teams have analytics departments as well. [Or at least they fucking should](https://www.boltsfromtheblue.com/2018/7/19/17593186/the-los-angeles-chargers-dont-have-a-single-analytics-employee-nfl). ([@chargers](https://twitter.com/Chargers) you hiring?)

Anyway, I'm a Chargers fan. This year we took Justin Herbert at #6 and at the time I was bummed we didn't get Tua but for now it looks we're doing [just fine](https://www.youtube.com/watch?v=q9NlShd6Xoc). Nothing against the Dolphins, but one of the two is the favorite for Rookie of the Year and the other isn't.
Also, [how can you not love this](https://youtu.be/BjJh7HfZHIo?t=10)

Herbert balled out pretty much every week (except vs the Pats) and each week Chargers fans did their part: Herbert won rookie of the week 9 times this year out of a possible 15 (week 1 he didn't play).

I would like to do my part too.

## The Idea
I started by looking into whether I could write a click bot to vote for Justin while I was busy with work. I mostly write in Python for my job, so I figured I'd use it to control the page.
The voting is just click, wait, click, wait, refresh, repeat. Seemed easy enough.
Unfortunately the most common tool, [pyautogui](https://pyautogui.readthedocs.io/en/latest/), doesn't seem to be ready to support Macos big sur yet.

So next option, can I write a script in my browser's console that'll do the same thing?
The answer is... almost.

## Switching to Javascript

By inspecting the page source

![page source](/assets/herbie_roty/inspect_page.png)

I was able to come up with the following and paste it into the devtools repl
<!-- markdownlint-disable MD011 -->
{% highlight javascript %}
let voteForHerbie = () => {
    // herbert is first in the list of candidates
    document.getElementsByClassName("list-item")[0].click();

    // wait a little bit because the vote button doesn't pop up until after you pick
    setTimeout(() => document.getElementsByClassName("poll2020-btn")[0].click(), 500);

    // 500 extra ms to make sure it submits correctly
    setTimeout(() => location.reload(), 500);
};
setInterval(voteForHerbie, 1000);
{% endhighlight%}
<!-- markdownlint-enable MD011 -->

Which seems to work for one iteration but has some issues running after reload.

![error](/assets/herbie_roty/error_cant_click.png)

After some searching, it turned out to be an iframe issue.
Basically, when I was using the devtools to select the page element to find the classes for `getElementsByClassName()` I was inadvertently setting the scope to the iframe, but when I refreshed the page and pasted it again, it wouldn't work.

I was able to at least get it to run once by selecting this scope manually before pasting it, but there was a second problem:
You can't set an interval to do something with refreshing involved because the refresh resets the repl's scope even if you set it not to clear while changing pages.

## Running Through Refreshes

So there's two options I can think of:

1. fake refresh by requesting the content again and injecting it into the page using JS
2. use something that doesn't get reset on refresh to run the script on the page when I'm there


The second seemed less involved. I've had [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) installed once or twice and never made much use of it.
But this actually seems like a perfect use case. Using the `@match` keyword you can set a script run when your browser is on a specific URL, e.g. [the rookie of the year voting page](https://www.nfl.com/voting/rookies/rookie-of-the-year).

I was able to get the script to run, but it wasn't working. It wasn't able to find the elements I told it to look for that it had been able to prior.

I suspected this was the scope issue again, so instead of telling it to fire on the NFL's vote page URL, I gave it [https://www.riddle.com/a/290378](https://www.riddle.com/a/290378), which is the href from the iframe on the voting page.

![iframe](/assets/herbie_roty/iframe.png)

And it worked! Or, at least, it tried to run and immediately threw a ton of syntax errors. Turns out Tampermonkey only supports ES5.

After migrating to ES5 and using more helper functions to help with scoping (because now I don't have fat arrow functions) I came up with the following.

<!-- markdownlint-disable MD011 MD034 -->
{% highlight javascript %}
// ==UserScript==
// @name         Herbie For ROTY
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get the boy his victory brisket
// @author       @ayyjohn
// @match        https://www.riddle.com/a/290378
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function voteForHerbie() {
        document.getElementsByClassName("list-item")[0].click();
    };
    function submitVote() {
        var vote = document.getElementsByClassName("poll2020-btn")[0];
        vote.click();
    };
    function refresh() {
        window.location.reload();
    };
    function winJustinHerbertROY() {
        setTimeout(voteForHerbie, 1000);
        setTimeout(submitVote, 2000);
        setTimeout(refresh, 4000);
    }
    window.onload = winJustinHerbertROY;
})();
{% endhighlight%}
<!-- markdownlint-enable MD011 MD034 -->

I hope this isn't against the rules.
I set it to vote every 4 seconds which seemed about what a human could do if they really put their heart into it.
Feel free to copy it and run it yourself in the background.

## Go bolts

<p align="center">
<img src='/assets/herbie_roty/vote_for_herbie.gif' class="herbie-vote-gif" width="450px" height="450px"/>
</p>