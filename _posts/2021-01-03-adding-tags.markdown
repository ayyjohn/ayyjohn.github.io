---
layout: post
title:  "How to Add Tags to a Jekyll Blog"
date:   2021-01-03 14:19:00 -0800
permalink: /posts/:title
categories: [meta, python, jekyll]
---
Having created a blog from scratch a number of times, I'm fairly confident that for the immediate future I want to do very little customizing of this blog. I've learned from my previous attempts.

I've definitely gotten bored before even writing my second or third post before when the blog was made with React.js because the startup cost was way to high.
Not being able to write using Markdown the last time I tried basically killed the effort, and it definitely didn't help that I was running everything on AWS which meant I was managing stuff that I probably didn't need to, given that my goal was to be writing.
That doesn't mean I have no interest in the software side of this blog, I'm an engineer after all. But ultimately it came down to why I was trying to make a blog in the first place, and so this time I opted for something where a lot of the boilerplate was taken care of for me.
That said, I want to have some options for customization and that involves getting at least a little familiar with the [Liquid](https://shopify.github.io/liquid/) templating language.
I figured an easy place to start would be making tags on my posts. It's light weight, simple, and doesn't require a lot of forethought.
It also gives me a change to write a `how I did this` style post and experiment a little bit with inserting code and photos of code into my blog. 
So, without further ado:
# goals:
* I want to have tags displayed after each post in the main post list
* I want to have tags displayed on the post page of each post
* I want have a page where each tag is displayed along with each post that has that tag (and links to each post)
* I want the tags to link to the page where all the tags are listed, and if they can link to specifically where on the page that tag is, that'd be ideal

first, we'll need to add some test tags to our posts so that we can tell how we're doing
{% highlight markdown %}
---
layout: post
title:  "Hello World"
date:   2021-01-02 15:13:18 -0800
permalink: /posts/:title
categories: [python, meta]
---
{% endhighlight %}

I'm using categories over tags because according to the documentation they're largely the same, except categories can be used in paths, while tags cannot.
I don't want to use them in paths yet, but I might want to someday, and this will make it easier.

Next, before I add any other functionality, I can sanity check some basics by putting the visuals into play by adding the following snippet to `_layouts/post.html`. I'm new to Liquid, but it looks like page.categories is made available globally and is iterable. The syntax for passing arguments to functions looks like pretty simple piping.

{% highlight markdown %}
{% raw %}
{%- if page.categories.size > 0 -%}
    {%- for tag in page.categories -%}
    <span class="post-tag">{{ tag | capitalize }}</span>
    {%- endfor -%}
    {%- endif -%}
{% endraw %}
{% endhighlight %}
![Perfection](/assets/adding_tags/unstyled_tags.png)

## Et Voila!

The style leaves something to be desired, so I'll add some minimal SCSS and adjust some of the existing HTML to get it to sit right

{% highlight css %}
.post-tag::before {
  content: "#";
}

.post-tag {
  @include relative-font-size(.75);
  border: 1px solid $grey-color;
  border-radius: 5px;
  display: inline-block;
  padding: 0px 3px;
  margin-right: 4px;
}
{% endhighlight %}

![Glorious](/assets/adding_tags/styled_tags.png)

## Glorious!

I'm not sure if these are the final groups I'll be using, but I'm not making any decisions I can't walk back easily since tags are so easy to change.

Next, I want there to be a page where users can go to see all posts by tag. 
I'll worry about alphabetizing and stuff later, but for now, I'll need a new page which it looks like I can create by simply adding a new top level file called `categories.html`. The basic logic is simple enough, we'll need a main div, and then one div for each category, which again appears to be made available globally via site.categories. 
There's a small gotcha with site.categories in that it's actually a list of lists where each sub-list is a category name followed by the posts that have that category, but we can use `{% capture tag_name %}{{ category | first }}{% endcapture %}` to assign the variable `tag_name` to the first element.
Ultimately, here's what I came up with. It's not glorious, but I'll take it.

{% highlight markdown %}
{% raw %}
---
layout: page
permalink: /tags/
title: Categories
---

<div class="posts-by-tag">
    <ul class="tag-post-list">
        {% for category in site.categories %}
        {% capture tag_name %}{{ category | first }}{% endcapture %}
        <li>
            <h3 class="tag-header">{{ tag_name | capitalize }}</h3>
            {% for post in site.categories[tag_name] %}
            <div class="tag-post-title">
                <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
            </div>
            {% endfor %}
        </li>
        {% endfor %}
    </ul>
</div>
{% endraw %}
{% endhighlight %}

![bam](/assets/adding_tags/categories_page.png)

And it magically appears on my homepage!

The final piece of the puzzle I wanted to have was that each of these little tags would link to the categories page, and ideally scroll to the location on the page so that once there's a longer list of tags, you'd be able to see all similar tags easily.

To do this, I've got to add a bunch of dummy tags to one of my posts so that I can see if it's working, otherwise the categories page won't actually scroll anywhere.

Then, I need to give each of the headers on the categories page their own `id`

`<h3 class="tag-header" id="{{ tag_name }}">{{ tag_name | capitalize }}</h3>`

and finally, the tag spans I made above need to contain a link to this `id`

`<span class="post-tag"><a href={{ '/tags#' | append: tag }}>{{ tag | capitalize }}</a></span>`

And it works!
Thanks for coming to my TED talk.