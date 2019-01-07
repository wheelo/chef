### Chef

#### 注册插件
```js
import chef from '@chef/chef-react';
import Plugin from '@chef/XXPlugin';

chef(<div>Entry</div>)
    .use(Plugin)
    .init();
}
```

#### 内置插件
1. 代码分割(动态加载React组件)

```js
import { L } from '@chef/chef-react';

const LoadingComponent = () => <div>正在加载中...</div>;
const ErrorComponent = () => <div>加载组件失败</div>;
const BundleSplit = L({
  load: /* webpackChunkName: ./components/hello' */ () => import('./components/hello');
  LoadingComponent,
  ErrorComponent
});
```

2.redux

可以使用react-redux与redux中的所有方法, `withReducer`高阶函数用于React封装高阶组件

```js
// src/main.js
import React from 'react';
import chef from '@chef/chef-react';
import Redux from '@chef/chef-redux';

// roor reducer
import reducer from './reducers/todo';

// 注册
chef(<div>Entry</div>)
  .use(Redux, reducer: reducer);

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


// src/reducers/todo.js
export default {
  todo: (state = [], action) {
      switch (action.type) {
        case ACTION_TYPES.ADD_TODO:
          return [
            ...state,
            {
              id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
              completed: false,
              text: action.text
            }
          ];
        }
    }
};


// src/reducers/test.js, 动态加载
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
```


3.国际化i18n
国际化模块做成了插件，可以进行语言切换，动态的国际化语言加载

```js
// src/main.js
import React from 'react';
import chef from '@chef/chef-react';
import I18n from '@chef/chef-i18n';

chef(<div></div>)
  .use(I18n, {
    // 初始化的翻译数据
    translations: { zh: { test: 'hello' } },
    lng: 'en',
    // 如果detect为true, 页面初始化后将会按cookie/localStorage/navigator.language最后lng的顺序寻找默认语言
    // 并且changeLan后会自动把当前语言更新到缓存中
    detect: true
  });

// public/lang/zh/test.json
{
  "app_title": "待办 [zh]",
  "input_placeholder": "需要做什么?",
  "clear_completed_button": "清除completed",
  "show_all_button": "所有的",
  "show_active_button": "活跃的",
  "show_completed_button": "完成的",
  "items_left": "${num_items} 项",
  "no_items_left": "暂时没有数据"
}

// src/Test.js
import React, { Component } from 'react';
// i18n模块可以直接在外部引入也可以通过props.i18n获取到
import { Trans, withT, i18n } from '@chef/chef-i18n';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  dynamicAdd = e => {
    i18n.addAsync('zh', () => import('../../public/lang/zh/test.json'))
      .then(lang => {
        console.log('加载中文语言包成功，现在的语言包是: ', i18n.getLan());
      });
  }

  render() {
    const { t } = this.props;
    console.log(t("no_items_left"));

    return (
      <section className="test">
        <input
          className="test-button"
          type="button"
          value="加载中文语言包"
          onClick={this.dynamicAdd}
        />
        {/* id用于标识需要翻译的字段，data用于插值到"${num_items} 项"中 */}
        <Trans id="items_left" data={{ num_items: 200 }} />
      </section>
    );
  }
}

export default withT(Test);
```

4. 其他模块

路由 / Helmet / core / new / script / create-plugin

#### 如何编写自定义的插件
```js

class Provider extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.theme = props.theme;
  }

  getChildContext() {
    return { theme: this.theme };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

Provider.childContextTypes = {
  theme: PropTypes.object.isRequired
};

import { creatPlugin } from '@chef/chef-core';

/* 创建插件 */
const plugin = createPlugin({
  token: createToken('themeToken'),
  // deps: {logger: LoggerToken},

  // services. 参数为依赖的插件或普通对象
  provides(/* {logger} */) {
    let color = 'red';

    const theme = {
      color, 
      changeColor(newColor) {
        theme.color = newColor;
      }
    };
    return {
      from: () => {
        return { theme };
      }
    };
  },
  // 动态注入方法到context中
  middleware: (_, services) => {
    const { theme } = services.from();

    return (ctx, next) => {
      ctx.element = <Provider theme={theme}>{ctx.element}</Provider>;
      return next();
    };
  }

});

```

