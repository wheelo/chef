/**
 * 动态加载redux与动态加载i18n
 **/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Trans, withT, i18n } from '@chef/chef-i18n';
import { Helmet } from '@chef/chef-helmet';
import { withReducer, connect } from '@chef/chef-redux';
import { compose } from '@chef/chef-react';

import withTheme from '../plugins/withTheme';

// 动态注入外部的reducer
import test from '../reducers/test';

import { testAction } from "../actions";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  dynamicAdd = e => {
    const { testAction } = this.props;

    i18n.addAsync('zh', () => import('../../public/lang/zh/test.json'))
      .then(lang => {
        testAction(lang['app_title']);
        this.context.theme.changeColor('purple');
        // console.log('加载中文语言包成功，现在的语言包是: ', i18n.getLan());
      });
  }

  static contextTypes = {
    theme: PropTypes.object.isRequired
  };

  render() {
    const { t, testCapital } = this.props;
    // this.context.theme.color

    return (
      <section className="test">
        <Helmet>
          <title>动态加载语言与Reducer测试</title>
        </Helmet>

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
  ({ test }) => ({
    testCapital: test ? (test.hello ? test.hello.toUpperCase() : 'hello') : ''
  }),
  { testAction }
);

export default compose(
  withReducer({
    test
  }),
  withConnect,
  withT,
  withTheme
)(Test);
