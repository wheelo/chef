# @chef/chef-helmet
[react-helmet-async](https://github.com/staylor/react-helmet-async)封装的插件

### Table of contents

* [安装](#安装)
* [注册](#注册)
* [使用](#使用)
* [API](#api)
  * [App](#app)
* [Examples](#examples)

---

### 安装

```sh
yarn add @chef/chef-helmet
```
需要注册全局的npm @chef命名空间：`npm set registry https://www.npmjs.com --scope=@chef`

---


### 注册

```js
import chef from '@chef/chef-react';
import Helmet from '@chef/chef-helmet';

chef(<div />).use(Helmet);
```

---


### 使用
直接导出Helmet React组件

```
import { Helmet } from '@chef/chef-helmet';
```


