# @chef/chef-redux
chef应用中内置的redux与react-redux插件.

### Table of contents

* [安装](#安装)
* [使用](#使用)
  * [redux与react-redux官方模块](#redux与react-redux官方模块)
  * [HOC](#hoc)
* [注册](#注册)
* [API](#api)
  * [注册API](#注册API)
  * [HOC](#hoc-api)
* [完整例子](#完整例子)

---

### 安装

```sh
yarn add @chef/chef-redux
```
需要注册全局的npm @chef命名空间：`npm set registry https://www.npmjs.com --scope=@chef`
---

### 注册

Redux插件是通过`@chef/chef-core`中createPlugin创建的，如果要使用Redux的插件必须要在营业中先注册插件

```js
import Redux from '@chef/chef-redux';

app.use(Redux, { reducer: reducers});
```

* 第二个参数需要传输一个对象，对象的键为reducer，值为初始化的reducers，reducers可以是由combineReducer生成的函数也可以是普通对象

---

### 使用

#### redux与react-redux官方模块

项目中可直接使用redux与react-redux官方提供的库

```js
import { connect } from "@chef/chef-redux";
// 直接导出redux中的模块
import { createStore, combineReducers, bindActionCreators } from '@chef/chef-redux';
```

* **注意**: redux中的`compose`方法需要在`@chef/chef-react`导入，保证通用性


#### HOC

用于动态注入reducer，通过`withReducer`包装后的组件，`context.store`中的reducer可以得到更新

```js
import React from 'react';
import { withReducer } from "@chef/chef-redux";

export default withReducer(test)(() => {
  return <input placeholder="test" />;
});
```
* withReducer的别名是injectReducer

---

### API

#### 注册API

##### `Redux`

```js
import Redux from '@chef/chef-redux';

app.use(Redux, {
  reducer,
  state,
  enhancer
});
```

* [reducer] [reducer函数](https://redux.js.org/glossary#reducer)或者可以传输到[combineReducers](https://redux.js.org/api/combinereducers)中的原始对象
* [state] (optical): 初始化状态。初始化状态可以是SSR中的初始化状态，可以是localstorage离线cookie等，也可以用户指定初始化状态
* [enhancer] (Function): store enhancer. 增强store的中间件如: middleware, time travel, persistence, redux中的applyMiddleware()等

#### HOC

用于动态注入reducer，通过`withReducer`包装后的组件，`context.store`中的reducer可以得到更新

```js
import React from 'react';
import { withReducer } from "@chef/chef-redux";

// reducer
const test = {
  test: (state = { hello: '' }, action) => {
      switch (action.type) {
        case ACTION_TYPES.TEST:
          return {
            hello: action.test + Math.floor(Math.random()*10)
          };
        default:
          return state;
      }
  }
};

export default withReducer(test)(() => {
  return <input placeholder="test" />;
});
```

* `withReducer`返回的是一个高阶函数，接受的参数为新注入的单个或者多个reducer
* 未来可能会有一个支持dynamic import的动态注入语法，但是目前还不支持直接传输函数

---

### 完整例子

```js
// src/main.js
import React from 'react';
import chef from '@chef/chef-react';
import Redux from '@chef/chef-redux';
import reducers from './reducers';

chef(<div></div>)
  .use(Redux, reducer: reducers);

// src/reducers/index.js
import todos from "./todos";
import visibilityFilter from "./visibilityFilter";

// reducer可以是对象或者是由combineReducer生成的reducer函数
export default {
  todos,
  visibilityFilter
};

// src/reducers.test.js
export default function test(state = { hello: '' }, action) {
  switch (action.type) {
    case ACTION_TYPES.TEST:
      return {
        hello: action.test + Math.floor(Math.random()*10)
      };
    default:
      return state;
  }
}

// src/Test.js
import React, { Component } from 'react';
import { withReducer, connect } from '@chef/chef-redux';
import { compose } from '@chef/chef-react';

// 动态注入外部的reducer
import test from '../reducers/test';

import { testAction } from "../actions";

class Test extends Component {
  dynamicAdd = e => {
    const { testAction } = this.props;

    testAction('app_title');
  }

  render() {
    const { testCapital } = this.props;

    return (
      <section className="test">
        <input
          className="test-button"
          type="button"
          value={"加载中文语言包" + testCapital}
          onClick={this.dynamicAdd}
        />
      </section>
    );
  }
}

const withConnect = connect(
  // mapStateToProps
  ({ test }) => ({
    testCapital: test.hello.toUpperCase()
  }),
  // mapDispatchToProps
  { testAction }
);

export default compose(
  withReducer({
    test
  }),
  withConnect
)(Test);

```
