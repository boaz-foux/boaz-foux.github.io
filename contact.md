---
layout: default
title: Contact
---

<div class="text-center">
    <h1 class="text-4xl font-bold text-cyan-400 mb-4">Contact Me</h1>
    <p class="text-lg text-gray-300">You can reach me via email or find me on social media.</p>
</div>

<div class="mt-8 text-center">
    <a href="mailto:{{ site.email }}" class="text-2xl text-pink-400 hover:text-pink-600 underline">{{ site.email }}</a>
    <div class="flex justify-center space-x-4 mt-4">
        <a href="https://twitter.com/{{ site.twitter_username }}" class="text-cyan-400 hover:text-cyan-600">Twitter</a>
        <a href="https://github.com/{{ site.github_username }}" class="text-cyan-400 hover:text-cyan-600">GitHub</a>
    </div>
</div>
