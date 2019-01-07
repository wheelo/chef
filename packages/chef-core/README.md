# @chef/chef-core

用于注册插件，生成token，React组件需要继承它来生成插件。

---

### Table of contents

* [安装](#安装)
* [使用](#使用)
* [API](#api)
  * [App](#app)
* [Examples](#examples)

---

### 安装

```sh
yarn add @chef/chef-core
```
**注意** 需要注册全局的npm @chef命名空间：`npm set registry https://www.npmjs.com --scope=@chef`

---

### 使用

```js
// ./src/main.js
import chef from '@chef/chef-core';

chef.use()
```

---

### API

#### App

```js
import chef from '@chef/chef-core';

```

**app.use**

```
chef.use(plugin: Plugin, config: any);
```

注册插件

* `plugin: Plugin` - a Plugin created via [`createPlugin`](#createplugin)
* `config: any` - a configuration value
* returns app

**app.middleware**

TODO

---


#### Plugin

注册API或者middleware, 需要通过`createPlugin`创建

```js
Plugin {
  deps: Object<string, Token>,
  provides: (deps: Object) => any,
  middleware: (deps: Object, service: any) => Middleware
}
```

##### createPlugin

```js
import { createPlugin } from '@chef/chef-core';
```

创建插件的方法，生成完插件后插件可以被`app.use()`使用

```js
const plugin: Plugin = createPlugin({
  token: TokenImp,
  deps: ?Object,
  provides: (deps: Object) => any,
  middleware: (deps: Object, service: any) => Middleware
});
```
**注意** 需要注册唯一的Token

---

#### Token

一个Token就是一个插件的key，用于管理依赖，生成的Token需要全局唯一

```js
Token {
  name: string,
  ref: mixed,
  type: number,
  optional: ?Token,
}
```

##### createToken

```js
const Token = createToken(name);
```

* `name: string` - 可以比较有辩识行的字符串
* returns `token: Token`

---

#### Middleware

TODO

##### Context

React相关的Context，需要使用中间件来注册


---

### Examples

#### 动态注入

`app.use()`

```js
// ./src/main.js
import chef from '@chef/chef-react';
import root from './components/root';

// 初始化
chef(root)
  .init();

// ./src/components/root.js
import React from 'react';
import { L } from '@chef/chef-react';

const LoadingComponent = () => <div>正在加载中...</div>;
const ErrorComponent = () => <div>加载组件失败</div>;
const BundleSplit = L({
  load: /* webpackChunkName: ./components/hello' */ () => import('./components/hello');
  LoadingComponent,
  ErrorComponent
});

const root = (
  <div>
    <div>初始化</div>
    <BundleSplit />
  </div>
)

export default root;

// ./src/components/hello.js
export default () => (
  <div>
    异步加载的模块
  </div>
)
```