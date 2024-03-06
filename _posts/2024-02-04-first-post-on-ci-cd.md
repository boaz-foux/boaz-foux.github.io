---
layout: post
title:  "Adding a CI/CD"
date:   2024-02-04T18:28:13.117Z
update: 2024-03-05T11:09:59.000Z
categories: general stuff ci-cd
group: ci-cd 
---
# Why?
The main reason is for more complex stuff like web assembly or typescript code that needs to be transpile or/and compiled.

# How?
Because the main branch (main) is the only one that gets rendered then I'll need to add a new main development branch (named dev),
and add an auto-commit on every push to dev.
by using 2 steps in github action

## Step 1: simple uploader
```yml
name: Build and Deploy

on:
  push:
    branches:
      - dev

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          node-version: 16.19.0
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 16.19.0
      - name: Install dependencies and build
        run: |
          npm install

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          node-version: 16.19.0
          clean: true
      - name: Force push "dev" branch to "main"
        run: |
          git push origin HEAD:main --force
```

## Step 2: all branch availability
 *  `branches` --> `branches-ignore:`
 *  `if: github.ref == 'refs/heads/dev'`

```yml
name: Build and Deploy

on:
  push:
    branches-ignore:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          node-version: 16.19.0
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 16.19.0
      - name: Install dependencies and build
        run: |
          npm install

  deploy:
    if: github.ref == 'refs/heads/dev'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          node-version: 16.19.0
          clean: true
      - name: Force push "dev" branch to "main"
        run: |
          git push origin HEAD:main --force
```

### Step 3: adding cache
  * bug fix `master` ->  `main`
  *  adding cache
```yml
name: Build and Deploy

on:
  push:
    branches-ignore:
      - main

jobs:
  build:
    steps:
      - name: Checkout code
      - name: restore node_modules
        uses: actions/cache/restore@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 16.19.0
      - name: Install dependencies and build
      - name: save node_modules
        uses: actions/cache/save@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }} 
```