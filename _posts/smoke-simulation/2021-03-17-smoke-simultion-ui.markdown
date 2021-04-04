---
layout: post
title:  "Physical Smoke Simulation - for UI implementation - Part 1"
date:   2021-03-16T09:54:01.313Z
update: 2021-03-24T09:15:30.621Z
categories: smoke simulation big calculations
group: smoke-simulation 
---

# Why?
I’ve wanted to play with some weird concepts, and have a playground with some edge cases. Like most people, I like some WOW effect, like the ink effect in [MATERIAL-UI](https://material-ui.com/).
And one of the things people and I find very hypnotic is smoke, especially if it is interactive.

# How?
The smoke simulation is a complex problem because of the abstract way smokes behave and react. The general approach is to start with a simple synchronic javascript code and continue from there. After the code base will be tested I’ll start to run asynchronously and as distributed as possible. and maybe enter some web-assembly and web workers for faster processing.

# Fhe first step - building a solid strong data model.
I based the code on Jos Stam's article [Visual Simulation of Smoke](http://graphics.ucsd.edu/~henrik/papers/smoke/smoke.pdf).
The main difference from Stam’s solution of all the other approaches is the main point of interest, Instead of calculating every smoke cell of collision detection and response (, clustered or not) which leads to a *Log(**N^2**)* for every smoke particle, the calculation model is based on the static air space which is a constant *Log(**N**)* for every “chuck” of air space.
* [live demo]({{ site.baseurl }}/examples/smoke-simulation/0-synchronic-smoke-simulation)

## Adding some minor tweaks
After checking the calculation in real-time env, I inserted a dynamic time-delta and variable of the dimension of the buffer. 
```javascript
    let last = 0;
    const loop = () => {
        const now = performance.now();
        dt = (now - last) / 6000;
        /* loop */
        last = now;
    };
```
* [dynamic time delta calculation live demo]({{ site.baseurl }}/examples/smoke-simulation/0beta-synchronic-smoke-simulation-faster-dt)

# Second step - improve performance - web workers and array buffers.
Due to JavaScript’s blocking one thread method of work, Changing the code to a simple asynchronous one won’t solve it because a lot of calculations use the same references. So for the first step creating a trolly asynchronous execution using a web worker.   
* [live demo]({{ site.baseurl }}/examples/smoke-simulation/1-asynchronous-smoke-simulation)

## GLSL - dynamic shader calculator
Currently, the maximum size for the GLSL shader buffer is 4096 bytes. although GLSL uses less memory, a more abstract effect can be created via a fragment shader. Using the time changes I’ve added a plasma effect using a dynamic red value in the RGBA vector.
```
float z = 0.5+ 0.5 * smoothstep(-1.0, 1.0, cos(time * 0.005));
density = smoothstep(0.0, 1.0, density);
gl_FragColor = vec4(z*(1.0-density), p.x * (1.0-density), p.y*(1.0-density), density);
```
because of GLSL constant integer indexing problem i've force the for loop to break when the most relevant density cell is calculated like so:
```
         for (int y = 0;  y < DY -1 ; ++y) {
            if(y * DX > int(pos.y)) break;
            for (int x = 0;  x < DX-1 ; ++x) {
                if(x > int(pos.x)) break;
                /* stuff */
            }
         }
```
* [live demo]({{ site.baseurl }}/examples/smoke-simulation/1-asynchronous-smoke-simulation-glsl)
