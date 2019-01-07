# chef-react
支持异步与代码分割的基础React库，用作成Chef React应用项目的入口

---

# Table of contents

- [安装](#安装)
- [使用](#使用)
- [API](#api)
  - [App](#app)
  - [ProviderPlugin](#providerplugin)
  - [L](#L)
- [Examples](#examples)

---

### 安装

```sh
yarn add @chef/chef-react
```
需要注册全局的npm @chef命名空间：`npm set registry https://www.npmjs.com --scope=@chef`

---

### 使用

```js
// ./src/main.js
import react from '@chef/chef-react';

export default function() {
  return react(<div>Entry</div>)
            .init();
}

```

---

### API

#### App

```js
import chef from '@chef/chef-react';
```
导出可以生成Chef React应用的函数，这个应用可以集成chef中的相关插件

**Basic**

```js
const app: App = chef(
  (el: ReactElement),
  (id: ?string)
);
```

- `el: ReactElement` - React入口模板，可以是通过`React.createElement`创建的React元素也可以是JSX表达式。
- `id: ?string` - Optional. 用户传输自定义的html元素id，控制React渲染的入口。默认是id='app-root'的元素

**app.use**

```js
app.use((plugin: Plugin), (configure: object));
```

调用这个方法来注册相关组件，其中configure为具体使用的插件所需要的参数

**app.init**

```js
app.init();
```

注册完组件后，必须要调用`init`方法，组件才能正确初始化

**app.cleanup**

```js
app.cleanup();
```

调用`cleanup`方法，可以卸载组件。可以在热更新模块里面使用


#### ProviderPlugin

```js
import {ProviderPlugin} from '@chef/chef-react';
```

用context provider来包装生成插件

#### L

```js
import { L } from '@chef/chef-react';

const Component = L({load, LoadingComponent, ErrorComponent});
```

- `load: () => Promise` - Required. 异步加载一个组件。 需要配合dynamic import与webpack chunk注释使用
- `LoadingComponent` - Optional. 异步组件还没有加载成功钱显示的组件
- `ErrorComponent` - Optional. 如果组件没有加载成功显示的组件


### Examples

#### Bundle splitting

```js
// ./src/main.js
import react from '@chef/chef-react';
import root from './components/root';

export default () => {
  return react(root);
}

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