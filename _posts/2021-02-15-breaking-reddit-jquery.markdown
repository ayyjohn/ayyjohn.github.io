---
layout: post
title:  "Debugging a Broken Reddit"
date:   2021-02-15 18:21:07 -0800
permalink: /posts/:title
categories: [tampermonkey, javascript, jquery]
---
While working on my [last post](/posts/tampering-with-reddit) about running Tampermonkey on Reddit I came across a bug that I though was worth posting about.

I mentioned in that post `I started by trying to do it in jQuery`. It's not hard to do, you just need to add the following to your UserScript.

```
// @require http://code.jquery.com/jquery-3.5.1.min.js
```

But what happened was that I included jQuery and forgot to remove it after I stopped trying to use it. 
So, after finishing my script, I was happily browsing r/all with my new `/top` links, and I tried to upvote a post, and it didn't work. 
RES recognized that I'd upvoted it, adding a count to the poster's username, and for a second I thought that I'd found a loophole where I could upvote infinitely. 
I opened up the console and tried clicking the arrow again and saw the following.

{% highlight javascript %}
reddit-init.en.n4ENBRfG0Fs.js:6 Uncaught TypeError: u.thing is not a function
    at HTMLDivElement.<anonymous> (reddit-init.en.n4ENBRfG0Fs.js:6)
    at HTMLBodyElement.dispatch (reddit-init.en.n4ENBRfG0Fs.js:2)
    at HTMLBodyElement.m.handle (reddit-init.en.n4ENBRfG0Fs.js:2)
{% endhighlight %}

If you're unfamiliar with this, `reddit-init.en.blahblah.js` is a [minified](https://www.cloudflare.com/learning/performance/why-minify-javascript-code/) Javascript file and the error is telling us the exception is happening on line 6, though that's less than useful since minified JS files have hundreds of lines of code mashed onto each line and split by semicolons.

{% highlight javascript %}
var a=u.thing(),f=a.thing_id(),l=a.data("subreddit"),c=u.hasClass(t)?1:u.hasClass(n)?-1:0,h,p=$.param({dir:c,id:f,sr:l||""});!o||!o.originalEvent?h=!1:i instanceof Function&&"isTrusted"in i.prototype?h=o.originalEvent.isTrusted:i instanceof Function?h=o.originalEvent instanceof i&&o.originalEvent!==r:h=o.originalEvent!==r;var d={id:f,dir:c,vh:e.config.vote_hash,isTrusted:h};e.config.event_target&&(d.vote_event_data=JSON.stringify({page_type:e.config.event_target.target_type,sort:e.config.event_target.target_sort,sort_filter_time:e.config.event_target.target_filter_time}));var v=a.data("rank");v&&(d.rank=parseInt(v)),$.request("vote?"+p,d)
{% endhighlight %}

Can you find the bug? 
Yeah, me neither. 

When stack traces don't help, you can always try and figure out what broke the page by removing things from the script and seeing what fails. I started by first disabling the script entirely and making sure that upvotes still worked.
Then I removed each of the functions one by one, and upvotes were still broken. 
Finally, I stopped executing _any_ code from my UserScript and it still broke which ultimately lead me to try removing headers from the file.

One kind of cool outcome of this is realizing that I can add jQuery to any site that I feel like by adding a UserScript that triggers on that domain!