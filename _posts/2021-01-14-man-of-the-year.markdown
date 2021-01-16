---
layout: post
title:  "Isaac Rochelle for WPMOY"
date:   2021-01-16 10:15:10 -0800
permalink: /posts/:title
categories: [twitter, football, chargers, bots, python]
---
[Earlier this week I wrote a post about a script I wrote to vote for Justin Herbert for Rookie of the Year](/posts/herbie-for-roty)

[Someone in the Chargers subreddit suggested](https://www.reddit.com/r/Chargers/comments/kx8scb/i_wrote_a_script_that_votes_for_justin_herbert/gj8vzj4/) I write a bot to vote for Isaac Rochell for Walter Payton Man of the Year.

<p align="center">
<img src='/assets/rochelle_moty/good_idea.gif' width="350px" height="350px"/>
</p>

# Getting Started

The difference between this post and the former is the vote method.

Last post was about clicking. This was about tweeting.

Python's got a [Twitter bot API](https://docs.tweepy.org/en/latest/index.html) and this time I'm prepped to use it. Fuck javascript. This is Python territory.

There are some minor API restrictions. I'll do my best not to break those and get banned.

[Rochelle's currently in second place to Travis Kelce, and within striking difference](https://www.nfl.com/honors/man-of-the-year/).

As I write this, he's down by 336,397 votes and the vote closes in 36 hours. 

That's about 156 votes per minute. That's more than enough to get my account blocked from twitter so I won't do that.

But what I will do is outline the steps I took so that if you're interested, you can make your own bot to do the same.

### Step 1
Go sign up for a twitter dev account [here](https://developer.twitter.com/en). Grab your API keys for the next step.

### Step 2
Get basic authentication working. Make sure to give your bot read and write access to your account in your twitter settings.

*Also make sure not to commit your credentials in git. Use environment variables or a git-ignored creds file*

{% highlight python %}
import json

import tweepy

with open("credentials.json") as key_file:
    keys = json.loads(key_file.read())

API_KEY = keys["API_KEY"]
API_SECRET = keys["API_SECRET"]
ACCESS_TOKEN = keys["ACCESS_TOKEN"]
ACCESS_SECRET = keys["ACCESS_SECRET"]

auth = tweepy.OAuthHandler(API_KEY, API_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
api = tweepy.API(auth)

try:
    api.verify_credentials()
    print("Authentication OK")
except Exception as e:
    print("Could not authenticate" + str(e))
{% endhighlight %}

### Step 3
do a quick cmd-f through [the official rules](https://static.www.nfl.com/league/content/2020-WPMOY-Charity-Challenge-Rules_at4dlj.pdf) to make sure you're not about to get him disqualified or anything.

### Step 4
do a basic test to confirm you're up and running

{% highlight python %}
api.update_status (status='testing update status')
{% endhighlight %}

![first_tweet](/assets/rochelle_moty/first_test_tweet.png)

looks like that works. Now how about more than one tweet? There are a couple of options. One is to set my script to run on a CRON job and let my computer do the automation. The other, much simpler way, is to just use a loop in Python and have my script sleep in between tweeting. That will also let me have finer grained control over the content of the tweet because I'll have access to iteration variables. 

To start, I tried re-running the script exactly how it was and it threw the following exception

```
python man_of_the_year.py
Authentication OK
Traceback (most recent call last):
  File "man_of_the_year.py", line 26, in <module>
    api.update_status(status="testing update status")
  File "/Users/ayyjohn/.pyenv/versions/3.8.1/lib/python3.8/site-packages/tweepy/api.py", line 205, in update_status
    return bind_api(
  File "/Users/ayyjohn/.pyenv/versions/3.8.1/lib/python3.8/site-packages/tweepy/binder.py", line 253, in _call
    return method.execute()
  File "/Users/ayyjohn/.pyenv/versions/3.8.1/lib/python3.8/site-packages/tweepy/binder.py", line 234, in execute
    raise TweepError(error_msg, resp, api_code=api_error_code)
tweepy.error.TweepError: [{'code': 187, 'message': 'Status is a duplicate.'}]
```

It looks like you can't tweet the exact same thing twice.

No big deal
{% highlight python %}
for i in range(5):
    api.update_status(status=f"testing update status in loop iteration {i}")
    print("tweeted")
    time.sleep(10)
{% endhighlight %}

Now the tweets aren't the same.
Looks like that works too.

![unique_tweets](/assets/rochelle_moty/testing_unique_tweets.png)

### Let's bring her home, boys. 
I added a list of as many chargers roster players as I could think of, as well as some phrases such as "ASAP!" and "#Jackboyz" that could be used to make the tweets unique. Then I made it so it would use multiple in each tweet so that the total was increased to `35 * 35 * 7 * 6 * 6` possible tweets.
{% highlight python %}
for i in range(1000):
    name_one = random.choice(names)
    name_two = random.choice(names)
    prefix = random.choice(prefixes)
    postfix_one = random.choice(postfixes)
    postfix_two = random.choice(postfixes)
    vote = "#WPMOYChallenge + Rochelle"
    status = f"{prefix} {name_one} and {name_two}. {postfix_one} {postfix_two}\n{vote}"
    try:
        api.update_status(status=status)
        print(f"tweeted for rochelle {i} times")
    except Exception as e:
        print(status)
        print("failed to tweet because" + str(e))
    time.sleep(5)
{% endhighlight %}

Even with `308700` possible unique tweets, I still need to make sure my script doesn't stop if there's a transient error or I get unlucky and the status is a duplicate. That's what the error handling is for.

[Here's the link to the account](https://twitter.com/Walter58528553)

# Bolt Up
