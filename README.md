# ionic-tab-template

[![Dependency Status](https://david-dm.org/snipking/angular1-onsen/status.svg)](https://david-dm.org/snipking/angular1-onsen#info=dependencies) [![devDependency Status](https://david-dm.org/snipking/angular1-onsen/dev-status.svg)](https://david-dm.org/snipking/angular1-onsen#info=devDependencies)

A seed template for angular1 & ionic project

This project is a starting point for building Angular 1.x applications with ionic. Also for further

1. ionic-tab
2. ionic-tab-webpack
3. ionic2-tab
4. ionic2-tab-webpack

learning course.

>Warning: Make sure you're using the latest version of Node.js and NPM

### Quick start

> Clone/Download the repo

```bash
# clone repo
$ git clone http://hpm.hand-china.com/diffusion/HRMSTWO/hrms.git

# change directory to app root
$ cd hrms

# install the dependencies with npm
$ npm install

# install the dependencies with bower
$ bower install

# run with dev mode
$ gulp run-dev

# rebuild the www env
$ gulp rebuild

# run the app
$ ionic serve
```

If everything goes right, chrome browser will open with url [http://localhost:8384/index.html](http://localhost:8384/index.html)
otherwise you should open it manually.

# Table of Contents

* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Running the app](#running-the-app)
    * [Developing](#developing)
    * [Testing](#testing)
* [License](#license)

# Getting Started

## Dependencies

What you need to run this app:
* `node` and `npm`

## Git Operation
```bash
st=>start: 开始
e=>end: 结束
clone=>operation: git clone url
pullA=>operation: git pull origin develop:develop
checkoutA=>operation: git checkout -b feature/A
code=>operation: 编写代码/修改代码
add=>operation: git add
commit=>operation: git commit
checkoutB=>operation: git checkout develop
pullB=>operation: git pull origin develop:develop
merge=>operation: git merge feature/A
conflict=>operation: 如果有冲突，解决冲突
push=>operation: git push origin develop:develop

st->clone->pullA->checkoutA->code->add->commit->checkoutB->pullB->merge->conflict->push->e

### IDE
WebStorm

## Testing

#### 1. Unit Tests

_TODO_

# License

[APACHE](/LICENSE)
