import React, { Component } from "react";

import { connect } from '@chef/chef-redux';
import { Helmet } from '@chef/chef-helmet';
import { withT } from '@chef/chef-i18n';

import TextInput from "../components/TextInput";
import { addTodo } from "../actions";

class Header extends Component {
  state = {
    text: ''
  };

  render() {
    const { t, addTodo } = this.props;
    const { text } = this.state;
    return (
      <header className="header">
        <Helmet>
          <title>TODO</title>
        </Helmet>
        <h1>{t("app_title")}</h1>
        <TextInput
          newTodo
          onSave={text => {
            if (text.length !== 0) {
              addTodo(text);
            }
          }}
          placeholder={t("input_placeholder")}
        />
      </header>
    );
  }
}

export default connect(
  null,
  { addTodo }
)(withT(Header));