# @chef/chef-utils.is
Is


### Table of contents

* [安装](#安装)
* [使用](#使用)
* [API](#api)
  * [App](#app)
* [Examples](#examples)

---

### 安装

```sh
yarn add @chef/chef-utils.is
```
需要注册全局的npm @chef命名空间：`npm set registry https://www.npmjs.com --scope=@chef`

---

### 使用
Is

```js
import {
  isFunction,
  isArray,
  isEmpty,
  isObject,
  isBrowserSide,
  isPromise,
  isReactNative,
  isServerSide
} from '@chef/chef-utils.is';

```
