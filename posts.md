---
layout: default
---
# Posts:

{% for post in site.posts | where: 'hidden',empty  | sort: 'date' | reverse %}
* [{{ post.title }}]({{ post.url | prepend: site.baseurl }}) ⦿ {{post.group}} ⦿ _last update on {{ post.date | date: "%b %-d, %Y" }}_
{% endfor %}