---
layout: post
title:  "Adding Pagination to a Jekyll Blog"
date:   2021-02-27 10:00:00 -0800
permalink: /posts/:title
categories: [meta, jekyll]
---
Jekyll's documentation is overall pretty solid, but each time I do something I always feel like there's one or two things I wish I'd known. So each time I modify this blog, I'll probably write a post that's essentially "what I wish I'd had when I set out to do x"

In this case, I finally have enough posts that it feels worthwhile to have pagination. [Jekyll has a page on "how to page"](https://jekyllrb.com/docs/pagination/) and at first glance it seems if you just add

```yaml
paginate: 5
```

to your `_config.yml` it'll just work like magic. It's not _that_ easy, but it's still pretty easy.

To break it down into steps, it's

<!-- markdownlint-disable CMD003 -->
## 1. Add pagination configs to your config
<!-- markdownlint-enable CMD003 -->

Technically all you need to add in your `_config.yml` is the `paginate` keyword which controls how many posts per page, but unless you add a custom `paginate_path:` it'll default to `paginate_path: "/page:num/"` which will render `page2`, `page3`, `...`.
I went with the following

```yaml
paginate: 5
paginate_path: "/page_:num/"
```

probably because I'm a Python guy. I like my underscores.

<!-- markdownlint-disable CMD003 -->
## 2. Make sure you have an index.html
<!-- markdownlint-enable CMD003 -->

By default, Jekyll projects come with an `index.md` which will cause you to get the following warning in your logs

```bash
Pagination: Pagination is enabled, but I couldn't find an index.html page to use as the pagination template. Skipping pagination.
```

Luckily, you can just change the name of `index.md` to `index.html` and unless you've heavily modified it, it should get rid of the error immediately. My `index.html` is literally just

```yaml
---
layout: home
---
```

<!-- markdownlint-disable CMD003 -->
## 3. Change the way you render posts
<!-- markdownlint-enable CMD003 -->

On your home page you likely have something that looks like
{% highlight liquid %}
{% raw %}
{%- for post in site.posts -%}
  // render posts
{%- endfor -%}
{% endraw %}
{% endhighlight %}

By replacing site with `paginator` our site will start automatically rendering `n` posts per page where `n` is the value you set in your `_config.yml`

{% highlight liquid %}
{% raw %}
  {%- for post in paginator.posts -%}
  // render posts
  {%- endfor -%}
{% endraw %}
{% endhighlight %}

<!-- markdownlint-disable CMD003 -->
## 4. Add Navigation Links
<!-- markdownlint-enable CMD003 -->

This one you can take directly from the Jekyll documentation linked above. It creates links to newer and older posts if there are newer or older posts available
{% highlight liquid %}
{% raw %}
<!-- Pagination links -->
<div class="pagination">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path }}" class="previous">
      Previous
    </a>
  {% else %}
    <span class="previous">Previous</span>
  {% endif %}
  <span class="page_number ">
    Page: {{ paginator.page }} of {{ paginator.total_pages }}
  </span>
  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path }}" class="next">Next</a>
  {% else %}
    <span class="next ">Next</span>
  {% endif %}
</div>
{% endraw %}
{% endhighlight %}

If there aren't older posts, it'll just add the text `Next` but it won't be clickable. That's something you can choose to fix in CSS if you like. You can also change what the link text is, I went with `Older -->` and `<-- Newer`.

<!-- markdownlint-disable CMD003 -->
## 5. Style the Navigation Links (Optional)
<!-- markdownlint-enable CMD003 -->

Personally, it bothers me that the Newer text is there on the first page, and that the Older text is there on the last page. I'd rather not see them at all. Unfortunately, if you just choose not to render anything, the links will move around because of spacing. There's plenty of ways around this, but I personally like this one.

The code already knows whether or not there is a page to go to, so the conditional is already taken care of.
All we need to do is add a custom class to the ones we want to hide

```html
<span class="next next-hidden">Older --&#62;</span>
```

And then by updating the CSS to the following
{% highlight CSS %}
.pagination {
  display: flex;
  justify-content: center;
}

.previous {
  margin-right: 5em;
}

.previous-hidden {
  visibility: hidden;
}

.next {
  margin-left: 5em;
}

.next-hidden {
  visibility: hidden;
}
{% endhighlight %}

we can use the `visibility: hidden` to keep the spacing that the link provides without seeing anything. The result is that the buttons remain in the same place. Now we don't see a link to Newer posts on the first page or a link to Older posts in the last page.

I'd upload screenshots, but since you're on the blog you can just navigate around to see how it works!
