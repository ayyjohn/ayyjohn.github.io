---
layout: post
title: "APIs: What's in a Name?"
date: 2024-10-20:59:51 -0800
permalink: /posts/:title
categories: [apis]
---

Having tutored at Ada Academy for 8+ cohorts now, I'm kind of surprised that it never occurred to me to write a post explaining APIs.
Not only has every student I've worked with at Ada asked me for help understanding them when they come up in the curriculum, but I'm also _really bad_ at explaining them off the cuff because I usually ramble and go way too deep.
So this is going to serve as a distillation of the conversation I usually have with my students.

There's a lot of things that make APIs confusing, and a lot of things about my verbal explanation that aren't helping.
For starters: "Application Programming Interface" is a pretty useless combination of three words without any followup.
In addition, depending on the context, what you're referring to when you talk about an API can mean wildly different things.
So I'd like to start there, let's unpack that name.

An interface is a point where two systems interact.
When iPhones first came out, the "touch screen interface" was all new and sexy.
It's just a fancy way of saying "you can touch your phone's screen to do things rather than pushing physical buttons." Unstated in all of this is that there's a ton of things going on behind the scenes when you touch your phone in order to make the phone register that it's being touched and then even more stuff going on between the phone saying "ok someone touched me here" and that touch being relayed to whichever app you're using at the time and having it respond how it's supposed to.
So, if interfaces are how two things interact, what does the "application programming" modifier change? It reduces "two things" down to "applications/programs," meaning that an API is how two programs, or applications interact.
You've already used tons of APIs without knowing it.
If you've ever imported a third party package in Python, you've used the API of that package.
There's tons of code in that package that you can't interact with directly, instead the package **exports** certain functions and classes that allow you as a programmer to gain some functionality.
As an example: The python `requests` library allows programmers to make HTTP requests, and if you look at its codebase, there's a lot of code that's probably unfamiliar.
Realistically, if you're using the requests package, you're likely using something from `https://github.com/psf/requests/blob/main/requests/api.py`

Frustratingly, when most people talk about APIs they're not talking about anything as abstract as the above.
They're probably talking about web APIs. Web APIs are just that, programs that are interacted with via the web.
Realistically there's no point making a program that doesn't do anything, so most web APIs take one of a few forms.

1. Data Access APIs: eg: pokeAPI, weather APIs, geo->IP APIs.
   These are APIs that are usually read-only, meaning you can only request data from them, you can't change anything.
   This makes sense when you consider that it wouldn't really make sense for you to be able to create new Pokemon, there's a definitive data source, and pokeAPI is just making the data available to you in a nice way.
   What pokemon is number 493? Well, it's Arceus, but if you don't know that, you can send a GET request to pokeAPI and it'll tell you.
   Want all Pokemon where Ghost is their secondary type? Sure thing.
   Some other features of APIs like these is that they're often un-authenticated, or at most rate-limited, since the worst thing you can really do to them would be make a lot of requests.
2. Read/Write APIs.
   These are really interesting and you'll likely end up using one at some point.
   Have you ever wondered how Twitter bots work? The answer is that they're interacting with Twitter via Twitter's public web API.
   Twitter makes some functionality available programmatically over the web, so in the same way that you can log in to your account and make a tweet, you can also write a program on your computer that authenticates to Twitter and posts a tweet.
   You can write a program that listens for new tweets from a certain person, or a list of people, or all people in a certain area, or just... all tweets.
   Why would you do this? Maybe you want to archive tweets from politicians before they get deleted. Maybe you want to collect tweets about a sports team and analyze them to prove once and for all that Chiefs fans are the worst.
   Who knows!? The point is, you can do this because most tech companies at this point have some form of API allowing developers to write programs that interact with their data. Spotify lets you use their API to search for music and get album artwork.
   Reddit lets you both create and fetch posts by subreddit.
   Without this you'd essentially need to write a web scraper to accomplish the same task, and web scrapers kinda suck to be honest.
   They're very brittle, and if the structure of the HTML of the website you're scraping changes, your program might stop working.
   So fully featured APIs let you read and write data.
   This is why they're almost exclusively authenticated, meaning you either need to log in as yourself, or create a developer application and use OAauth in order to interface with them.
   This also functions to manage permissions, which is why if you try and tweet from your own account it works, but if you try and tweet as someone else it will fail.

Under the hood what we really mean when we say web API is that there's a server out there that, when sent specifically formatted requests, will respond by either sending back data, or changing some data on its own database.
These servers are normally accesssed via HTTP, though other options are available (websockets, semaphore, f\*\*\* it you name it).
Most HTTP APIs are "Restful" which just means that there's a set of conventions about how they'll respond to certain types of HTTP request.
Simple CRUD APIs are often implemented as REST APIs because it means you don't have to read as much documentation to use them.
You have a reasonable chance of guessing that if you hit `https://pokeapi.com/v1/pokemon/1` with a GET request you're going to get back some info about either Bulbasaur or Rhydon (or maybe Mew/Arceus).
This is useful, but maybe your API is more complex than just "create read update destroy" in which case you could implement a SOAP or RPC based API.
These conventions just serve to make it easier for developers to consume your API.

So, to summarize:

- An API just defines the touch point between two programs. That can be as broad as the functions made available in a module or variables exposed on an object.
- Often when people refer to "APIs" they're referring to web APIs which are services set up by someone to allow you as a programmer to easily access some resource, either as a consumer or a publisher.
- It's APIs all the way down. You might use Python's standard library to import a Twitter library which has public methods for authenticating and posting tweets, and under the hood it uses Python's Requests library which has public methods for making GET and POST requests. That Twitter library you used will then use Requests to interact with Twitter via Twitter's web API, and behind the scenes, once you send a request to Twitter, many services interact behind the scenes via each others' internal private APIs (IE you as a non-Twitter engineer have no direct access to them) to publish that tweet, then other Twitter services interact with public APIs of other companies to serve ads on that tweet.
