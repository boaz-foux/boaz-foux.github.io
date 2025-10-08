---
layout: default
title: Blog
permalink: /blog/
---

<div class="prose prose-invert lg:prose-xl max-w-none">
  <h1>{{ page.title }}</h1>
  <ul>
    {% for post in site.posts %}
      <li>
        <h2>
          <a href="{{ post.url | relative_url }}">
            {{ post.title }}
          </a>
        </h2>
        <p class="text-gray-400">
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
        </p>
        {{ post.excerpt }}
      </li>
    {% endfor %}
  </ul>
</div>
