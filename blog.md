---
layout: default
title: Blog
permalink: /blog/
---

<section class="space-y-8">
  <h1 class="font-orbitron text-3xl font-extrabold text-cyber-cyan uppercase tracking-wider">{{ page.title }}</h1>
  <ul class="space-y-6">
    {% for post in site.posts %}
      <li class="bg-cyber-card border border-cyber-cyan/30 p-6 cyber-clip">
        <h2 class="font-orbitron text-xl font-bold">
          <a href="{{ post.url | relative_url }}" data-text="{{ post.title }}" class="glitch-link text-cyber-pink">
            {{ post.title }}
          </a>
        </h2>
        <p class="text-xs text-gray-400 font-mono mt-2">
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
        </p>
        <div class="text-gray-300 mt-3">{{ post.excerpt }}</div>
      </li>
    {% endfor %}
  </ul>
</section>
