---
layout: post
title:  ""
date:   2021-11-14 2:33:51 -0800
permalink: /posts/:title
categories: [python]
---
No matter how good of a programmer you are, you will write code that breaks. Being able to read broken code is a valuable skill. Code fails more than it succeeds `[citation needed]`

In fact, a real and valid way to write code, Test Driven Development (TDD) relies on writing code that breaks and then reading the error and fixing it.

When I'm working with people who are learning to code, one of the most important lessons I try and impart on them is the value of being able to read an error message with a stack trace and get to the root of the problem.

Sometimes I have a hard time in the moment explaining what I'm seeing, and so in this post I want to give some examples.

There are many ways to break down different types of stack traces, but I'm going to go with 4 classes today.

## Class 1: Errors that Tell You Pretty Much Exactly what was Wrong

This is a prototypical example. I've got here a simple function that takes a user details dict and returns the username.

```python
def get_username(user):
    return user['useranme']

user = {
    "username": "alec",
    "email": "sendspamhere@hotmail.com",
    "linkedin_url": "https://www.linkedin.com/in/ayyjohn/"
}

print(get_username(user))
```

but when I run this, I get

```python
Traceback (most recent call last):
  File "ayyjohn.github.io/code_examples/python/stack_traces.py", line 10, in <module>
    print(get_username(user))
  File "ayyjohn.github.io/code_examples/python/stack_traces.py", line 2, in get_username
    return user['useranme']
KeyError: 'useranme'
```

Bummer, but simple enough.
The way I read this is "There's a `KeyError`, the key that wasn't present in the dict was `"useranme"`, and that happened on line 2 of `stack_traces.py` when I called `get_username`, which happened because on line 10 I called `print(get_username(user))`

As you can see, I start at the bottom and work my way up. In general, this is how to start.
It doesn't always work, but it should be where you look first.
Stack traces will start with the error and the line it was caused on (that's why it says `Traceback: most recent call last`), and then go "upward" over and over through each function that called a function that called a function to get to the error.
In the best case scenario, the typo or problem was caused by that last line and the error is self explanatory.
In this case, I meant `"username"` not `"useranme"`.

Other common versions of this are situations where you have a typo in a variable name and you get a `NameError` because that variable doesn't exist, or a `SyntaxError` and Python points you directly to where you made an oopsy.
A fun plug for Python 3.10 is how much better its errors have gotten! [Check out the improvements here](https://www.python.org/downloads/release/python-3100/).

## Class 2: Errors that Tell You Where to Go but are Kind of Vague

```python
def get_first_users_username(users):
    return users[0]['username']()

user1 = {
    "username": "alec",
    "email": "sendspamhere@hotmail.com",
    "linkedin_url": "https://www.linkedin.com/in/ayyjohn/"
}

user2 = {
    "username": "ayyjohn",
    "email": "sendspamhere@yahoo.com",
    "linkedin_url": "https://www.linkedin.com/in/alec/"
}

users = [user1, user2]

print(get_username(users))
```

uh oh

```python
Traceback (most recent call last):
  File "ayyjohn.github.io/code_examples/python/stack_traces.py", line 18, in <module>
    print(get_username(users))
  File "ayyjohn.github.io/code_examples/python/stack_traces.py", line 2, in get_first_users_username
    return users[0]['username']()
TypeError: 'str' object is not callable
```

Okay so again, I see that there's a `TypeError` caused on line 2 when I called `get_first_users_username` but the first time I saw this I wasn't positive what I did wrong.
`'str' object is not callable`? What that means?

Luckily, StackOverflow has my back. I simply google that last line of the stack trace, and I notice [this post](https://stackoverflow.com/questions/36634449/python-str-object-is-not-callable) which helpfully explains to me that I accidentally added an extra set of parentheses at the end of my function which means I'm trying to call a string like it's a function.
Deleting those parentheses fixes the error.

<!-- markdownlint-disable MD036 -->
**Protip: if you're not familiar with an error, try looking for it on stackoverflow**
<!-- markdownlint-enable MD036 -->

If nothing turns up, try removing as much of the details specific to your code as possible. The number of times where I've had an issue in code that nobody else has is _very_ small.

A sibling of this error is the `AttributeError: 'ClassName' object has no attribute 'something'` error, which comes from adding a `.something` to a variable that's an instance of class `ClassName` which apparently doesn't have a `self.something` or a `something()` method defined.
When you see `NoneType` instead of `ClassName` in that error it means you have a variable that's equal to `None` (which is of the class `NoneType`) and you've tried to call a method on it. This is Python's version of the infamous "NullPointerException."

## Class 3: Errors that are Hidden Deeper in the Stack Trace

Once you're done writing your first programs, you're going to start using libraries.
Libraries are great because millions of other people have written code to do things so that you don't have to. But one major downside of them is they make debugging more complicated.

You can use their code wrong and cause it to throw an exception that you don't recognize or even worse, the errors can be buried under layers of indirection because your code called their code which probably called some other library's code and finally something broke. Let's take a look at an example like that.

What could be simpler? I just want the HTML code from Google's homepage.

```python
import requests

def ping_google():
    print(requests.get("htts://google.com"))

ping_google()
```

Cool let's run it.

```python
Traceback (most recent call last):
  File "ayyjohn.github.io/code_examples/python/stack_traces.py", line 6, in <module>
    ping_google()
  File "ayyjohn.github.io/code_examples/python/stack_traces.py", line 4, in ping_google
    print(requests.get("htts://google.com"))
  File "ayyjohn.github.io/code_examples/python/venv/lib/python3.7/site-packages/requests/api.py", line 75, in get
    return request('get', url, params=params, **kwargs)
  File "ayyjohn.github.io/code_examples/python/venv/lib/python3.7/site-packages/requests/api.py", line 61, in request
    return session.request(method=method, url=url, **kwargs)
  File "ayyjohn.github.io/code_examples/python/venv/lib/python3.7/site-packages/requests/sessions.py", line 542, in request
    resp = self.send(prep, **send_kwargs)
  File "ayyjohn.github.io/code_examples/python/venv/lib/python3.7/site-packages/requests/sessions.py", line 649, in send
    adapter = self.get_adapter(url=request.url)
  File "ayyjohn.github.io/code_examples/python/venv/lib/python3.7/site-packages/requests/sessions.py", line 742, in get_adapter
    raise InvalidSchema("No connection adapters were found for {!r}".format(url))
requests.exceptions.InvalidSchema: No connection adapters were found for 'htts://google.com'
```

Yo, what the fuck, Python? I thought we were friends.

This is the shortest program I've written so far, why is the error so ugly?
No connection adapters were found? `InvalidSchema`? I didn't write sessions.py. What is `site-packages`?
Guess I'll just give up on being a software engineer.

Ok no, that's dramatic, but this is a big step away from the two prior examples.
The reason is that Python starts the stack trace where the error was first caused, and it's not uncommon for an argument not to be validated or break anything for a while before it eventually does.
It's really easy to get intimidated by all of this mess dumping into your terminal, but you can fall back to those same steps from before.

When you find yourself in this type of situation, the first thing I recommend is finding the first place in the stack trace that's actually in code that you wrote. In that case, it's `line 4, in ping_google` where i wrote `print(requests.get("htts://google.com))`.

At least that will tell you, hopefully, what you wrote that caused the error (though not always as we'll see below).

In this case, with a keen eye you'll notice that `htts` should be `https`

Let's move to an example where the error isn't easy to spot, and the stack trace is largely unhelpful.

## Class 4: Errors that are Disconnected from the Actual Problem Entirely

That last one was bad, but not that bad.

But now, let's take a look at an example that was actually the reason I wrote this post.

This week at [Ada](https://adadevelopersacademy.org) students were working on a CRUD flask app. Here's the necessary context.

There's three models, a `Customer`, a `Video`, and a `Rental` model representing a user checking out a video from a video store ('member video stores?)

```python
from app import db
from datetime import datetime

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    release_date = db.Column(db.DateTime, nullable=False)
    total_inventory = db.Column(db.Integer, nullable=False)


class Rental(db.Model):
    __tablename__ = "video_rentals"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    due_date = db.Column(db.DateTime)
    customer_id = db.Column(db.Integer, db.ForeignKey("customer.id"), nullable=False)
    video_id = db.Column(db.Integer, db.ForeignKey("video.id"), nullable=False)
    customer = db.relationship("Customer", backref="rentals")
    video = db.relationship("Video", backref="rentals")
```

And here's the test in question, which hits their app's `/customers/<id>` route to delete a customer that has some rentals

```python
def test_can_delete_customer_with_rental(client, one_checked_out_video):
    response = client.delete("/customers/1")
    assert response.status_code == 200
```

Finally, here's the route being hit

```python
from flask import current_app, Blueprint, jsonify
from app.models.customer import Customer
from app.models.rental import Rental
from app import db

CustomerBlueprint = Blueprint("customers", __name__, url_prefix="/customers")


@CustomerBlueprint.route("/<id>", methods=["DELETE"])
def delete_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return {"message": f"Customer {id} was not found"}

    rentals = Rental.query.filter_by(customer_id=id)
    db.session.delete(rentals)
    db.session.delete(customer)
```

Running the test causes the following.

```python
./tests/test_wave_02.py::test_can_delete_customer_with_rental Failed: [undefined]sqlalchemy.orm.exc.UnmappedInstanceError: Class 'flask_sqlalchemy.BaseQuery' is not mapped
self = <sqlalchemy.orm.session.SignallingSession object at 0x1033a0610>
instance = <flask_sqlalchemy.BaseQuery object at 0x1033c7070>

    def delete(self, instance):
        """Mark an instance as deleted.

        The database delete operation occurs upon ``flush()``.

        """
        if self._warn_on_events:
            self._flush_warning("Session.delete()")

        try:
>           state = attributes.instance_state(instance)
E           AttributeError: 'BaseQuery' object has no attribute '_sa_instance_state'

venv/lib/python3.8/site-packages/sqlalchemy/orm/session.py:2054: AttributeError

The above exception was the direct cause of the following exception:

client = <FlaskClient <Flask 'app'>>, one_checked_out_video = None

    def test_can_delete_customer_with_rental(client, one_checked_out_video):
        # Act
>       response = client.delete("/customers/1")

tests/test_wave_02.py:184:
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
venv/lib/python3.8/site-packages/werkzeug/test.py:1031: in delete
    return self.open(*args, **kw)
venv/lib/python3.8/site-packages/flask/testing.py:222: in open
    return Client.open(
venv/lib/python3.8/site-packages/werkzeug/test.py:970: in open
    response = self.run_wsgi_app(environ.copy(), buffered=buffered)
venv/lib/python3.8/site-packages/werkzeug/test.py:861: in run_wsgi_app
    rv = run_wsgi_app(self.application, environ, buffered=buffered)
venv/lib/python3.8/site-packages/werkzeug/test.py:1096: in run_wsgi_app
    app_rv = app(environ, start_response)
venv/lib/python3.8/site-packages/flask/app.py:2464: in __call__
    return self.wsgi_app(environ, start_response)
venv/lib/python3.8/site-packages/flask/app.py:2450: in wsgi_app
    response = self.handle_exception(e)
venv/lib/python3.8/site-packages/flask/app.py:1867: in handle_exception
    reraise(exc_type, exc_value, tb)
venv/lib/python3.8/site-packages/flask/_compat.py:39: in reraise
    raise value
venv/lib/python3.8/site-packages/flask/app.py:2447: in wsgi_app
    response = self.full_dispatch_request()
venv/lib/python3.8/site-packages/flask/app.py:1952: in full_dispatch_request
    rv = self.handle_user_exception(e)
venv/lib/python3.8/site-packages/flask/app.py:1821: in handle_user_exception
    reraise(exc_type, exc_value, tb)
venv/lib/python3.8/site-packages/flask/_compat.py:39: in reraise
    raise value
venv/lib/python3.8/site-packages/flask/app.py:1950: in full_dispatch_request
    rv = self.dispatch_request()
venv/lib/python3.8/site-packages/flask/app.py:1936: in dispatch_request
    return self.view_functions[rule.endpoint](**req.view_args)
app/customer_routes.py:16: in delete_customer
    db.session.delete(rentals)
venv/lib/python3.8/site-packages/sqlalchemy/orm/scoping.py:163: in do
    return getattr(self.registry(), name)(*args, **kwargs)
venv/lib/python3.8/site-packages/sqlalchemy/orm/session.py:2056: in delete
    util.raise_(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

    def raise_(
        exception, with_traceback=None, replace_context=None, from_=False
    ):
        r"""implement "raise" with cause support.

        :param exception: exception to raise
        :param with_traceback: will call exception.with_traceback()
        :param replace_context: an as-yet-unsupported feature.  This is
         an exception object which we are "replacing", e.g., it's our
         "cause" but we don't want it printed.    Basically just what
         ``__suppress_context__`` does but we don't want to suppress
         the enclosing context, if any.  So for now we make it the
         cause.
        :param from\_: the cause.  this actually sets the cause and doesn't
         hope to hide it someday.

        """
        if with_traceback is not None:
            exception = exception.with_traceback(with_traceback)

        if from_ is not False:
            exception.__cause__ = from_
        elif replace_context is not None:
            # no good solution here, we would like to have the exception
            # have only the context of replace_context.__context__ so that the
            # intermediary exception does not change, but we can't figure
            # that out.
            exception.__cause__ = replace_context

        try:
>           raise exception
E           sqlalchemy.orm.exc.UnmappedInstanceError: Class 'flask_sqlalchemy.BaseQuery' is not mapped

venv/lib/python3.8/site-packages/sqlalchemy/util/compat.py:182: UnmappedInstanceError
```

Be honest, can you spot the problem?

I couldn't!

Going through the same steps as before

* looking at the error itself wasn't helpful.
* looking at the rest of the bottom of the stack trace wasn't helpful
* finding the first place where the stack trace mentioned our code with `db.session.delete(rentals)` didn't immediately make me suspicious.
* scrolling up to the top of the stacktrace, nothing immediately jumped out.

My first thought was that since `BaseQuery` wasn't mapped that there was some definition issue in the models. I figured it was coming from `Rental.query` throwing an error because the `Rental` model didn't have a `.query` method.

So I checked the imports to make sure the models were what I thought they were, and I had some other students post their models to make sure nothing was noticeably different.

**Protip: debugging in teams is way better than debugging by yourself!**

Then I googled the error and came up with exactly nothing helpful.

I mentioned before that as a last resort, it never helps to read the source code of the library you're using.

Looking at a stack trace like this can definitely be intimidating, but one of the awesomest things about code is that there's nothing technically magic about it.
It's really just the same thing we're doing in the first few examples, except the difference now is that we didn't write the code at the bottom of the stack trace.
Code is code is code, and we can go read the source code for the libraries we use! In this case, what I'm seeing first is that the error came from `venv/lib/python3.8/site-packages/sqlalchemy/util/compat.py:182`.

A quick google turns up the [source code](https://github.com/sqlalchemy/sqlalchemy/) for `sqlalchemy` which isn't even one of our direct dependencies in the project!
It's a dependency of [flask-sqlalchemy](sqlalchemy.palletsprojects.com/). We're going deep.
The `compat.py` file is a red herring. It's a wrapper for handling exceptions, which means if there's an exception thrown in sqlalchemy it's likely going to go through here first.
But above that is our first real clue: `sqlalchemy/orm/session.py:2056 in delete`. Now we can start to think about why there might be some issue in our code when we did `db.session.delete(rentals)` or `db.session.delete(customer)`

Luckily, the student had written other code that had the same syntax as the delete customer call, so we felt more confident looking into the rentals one.
But unluckily, I'm not a Flask expert. I use [Django](https://www.djangoproject.com), where unfortunately `db.session.delete(rentals)` looks totally legal and valid, so I overlooked that that could be the problem.

What ended up working was comparing the types of the two calls. One succeeded, the other didn't. `type(customer)` revealed that it was a `db.Model` instance, but `type(rentals)` said that it was a `flask_sqlalchemy.BaseQuery` instance! Hey look, it's that thing that apparently doesn't have a `delete` method!

Filtersets are iterable, and so a fix was changing `db.session.delete(rentals)` to the following

```python
for rental in rentals:
    db.session.delete(rental)
```

What a journey!

Here are some other things I often try when I see a new error message

* Search the error in slack! Often times the error is specific to the company or project you're working on, and somebody has run into it before.
* Read some documentation! Often when you google something the answer won't be spelled out exactly. The error might be a product of some logical inconsistency in your app, and it's only after understanding that you've violated the API of the library in some way that you'll figure it out.
* Change the code slightly to see if I can get a new error message that's more familiar.
* Talk through it with somebody else, or type out what I'm thinking as if I was going to send it to someone. Usually I'll have a hard time explaining something that I did, and more often than not the error is related to that thing I don't understand as well as I thought

Until next time!
