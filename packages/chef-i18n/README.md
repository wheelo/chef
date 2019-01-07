# @chef/chef-i18n
chef应用中内置的国际化i18n插件.

### Table of contents

* [安装](#安装)
* [使用](#使用)
  * [React组件](#React组件)
  * [HOC](#hoc)
* [注册](#注册)
* [API](#api)
  * [注册API](#注册API)
  * [React组件](#React组件)
  * [HOC](#hoc-api)
* [完整例子](#完整例子)

---

### 安装

```sh
yarn add @chef/chef-i18n
```
需要注册全局的npm @chef命名空间：`npm set registry https://www.npmjs.com --scope=@chef`

---

### 注册
```js
import I18n from '@chef/chef-i18n';

app.use(I18n, {
  // 初始化的翻译数据
  translations: { zh: { test: 'hello' } },
  lng: 'en',
  detect: true
});
```

* translations为初始化的翻译数据
* lng为设置在当前语言没法获取情况下默认的语言code
* detect设置为true, 页面初始化后将会按cookie/localStorage/navigator.language最后lng的顺序寻找默认语言，并且changeLan后会自动把当前语言更新到缓存中

**注意：** i18n的code码最好使用的标准命名规则: https://www.science.co.il/language/Codes.php

---

### 使用

#### React组件

项目中可直接使用`Trans`的React组件，这是最简单的引入方式

```js
import React from 'react';
import { Trans } from '@chef/chef-i18n';

export default () => {
  return <Trans id="test" data={{name: 'world'}} />);
});
```

#### HOC

高阶组件用于包装React组件，通过`withT`包装后的组件props中可以获取到`i18n`, `t`等属性

```js
import React from 'react';
import { withT } from '@chef/chef-i18n';

export default withT(({ t }) => {
  return <input placeholder={t('test', {name: 'world'})} />;
});
```

---

### API

#### 注册API

##### `I18n`

```js
import I18n from '@chef/chef-i18n';
```

I18n插件是通过`@chef/chef-core`中createPlugin创建的，如果要使用I18n的插件必须要注册该插件

#### i18n对象上的API

i18n对象可以动态改变语言，获取当前的语言，动态添加语言

```js
import { i18n } from '@chef/chef-i18n';
i18n.add('en', {});   // 添加新的语言数据
i18n.changeLan('en', ?callback);  // 改变语言数据(或者changeLanguage)

// 其他
// 异步添加新的语言数据
i18n.addAsync('zh', () => import('./lan/zh-cn/gallery.json')).then(loaded => loaded);
i18n.remove('fr');    // 删除语言
i18n.getLan('en');    // 获取语言
```

* add与addAsync方法用于动态添加语言数据，addAsync内部使用dynamic import动态加载数据。而add方法为直接添加语言数据
* i18n中的changeLan方法可在全局context中动态切换当前的语言，非常实用
* 当React组件已经被`withT`装饰生成高阶组件后，组件内部可直接通过props获取i18n对象，通过外部引入的i18n与这个对象是同一个
* **此i18n对象不是I18n插件本身，但它是插件中一个非常重要的对象，首字母是小写的**

#### React组件

直接导出的`Trans`的React组件，直接生成纯文本

```js
import { Trans } from '@chef/chef-i18n';

<Trans id="key" data={interpolations} />;
```

* `key: string` - Required. 这个key用于在语言包中查找指定的语言条目
* `interpolations: Object` - Optional. 这个对象`{key: value}`用于进行字符串插值，插值的方式需要指定字段key与语言条目value，相应的语言数据中需要把转义的字符串用`${key}`标出来

#### HOC

高阶组件用于包装React组件，通过`withT`包装后的组件可以拥有`i18n`, `t`, `translate`等属性

```js
import { withT } from '@chef/chef-i18n';

const TranslatedComponent = withT(Component);
```

装饰后的组件现在可以直接在props里面使用`i18n`, `t`等属性.

---

### 完整例子

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
