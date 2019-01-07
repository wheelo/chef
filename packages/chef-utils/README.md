# chef-utils
删除immutable相关代码，部分与SSR相关的逻辑(如SyncComponent)去掉了
原先的Utils拆分成Model/Is/Helper三个模块


### Table of contents

* [安装](#安装)
* [使用](#使用)
* [API](#api)
  * [App](#app)
* [Examples](#examples)

---

### 安装

```sh
yarn add @chef/chef-utils
```
需要注册全局的npm @chef命名空间：`npm set registry https://www.npmjs.com --scope=@chef`

---

### 使用
原先的Utils拆分成: Model, Is, Helper三个模块

```js
/* Helper:
  camelCaseKeys,
  createAPI,
  EventEmitter,
  getDisplayName,
  getLocale,
  getTimestamp,
  processHeaders,
  toQueryString
*/
import { Helper } from '@chef/chef-utils';

/* Is:
  isFunction,
  isArray,
  isEmpty,
  isObject,
  isBrowserSide,
  isPromise,
  isReactNative,
  isServerSide
*/
import { Is } from '@chef/chef-utils';

/* Model:
  createModule,
  createReducer,
  customActionUtil,
  customReducerUtil,
  customStatusUtil,
  moduleUI
*/
import { Model } from '@chef/chef-utils'

/* Action:
  systemReportError,
  systemCleanError,
  systemShowLoading,
  systemHideLoading
*/
import { Action } from '@chef/chef-utils';

/* Reducer:
  systemError,
  systemLoading
*/
import { Reducer } from '@chef/chef-utils';

/* Middleware:
  promiseMiddleware,
  thunkMiddleware,
  errorMiddleware,
  middlewares
*/
import { Middleware } from '@chef/chef-utils';

/* FetchHelper:
  Consts,
  FetchRequest,
  FetchResponse,
  FetchException,
*/
import { FetchHelper } from '@chef/chef-utils';

/* React:
  BaseComponent,
  getDisplayName,
  withServerRender
*/
import { React } from '@chef/chef-utils';

// 单独导出BaseComponent和EventEmitter
import { BaseComponent } from '@chef/chef-utils';
import { EventEmitter } from '@chef/chef-utils';
```
