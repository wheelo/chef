import React, { Component } from "react";
import { withRouter } from "@chef/chef-router";
import { withT } from '@chef/chef-i18n';

class LanguagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // i18n对象(不是Plugin)可以从外部或者属性中导入
    const { i18n } = this.props;

    if (i18n.language === 'zh') {
      this.loadChineseLanguage();
    }
  }

  loadChineseLanguage() {
    const { i18n } = this.props;

    i18n.addAsync('zh', () => import('../../public/lang/zh/test.json'))
      .then(() => {
        i18n.changeLan('zh');
      });
  }

  render() {
    const { location, history, t, i18n } = this.props;
    const languages = {
      en: t("language_en"),
      zh: t("language_zh"),
      fr: t("language_fr"),
      de: t("language_de"),
      ja: t("language_ja")
    };

    return (
      <div>
        <label htmlFor="language-picker">{t("current_language")}: </label>
        <select
          id="language-picker"
          onChange={e => {
            const currentLan = e.target.value;
            if (currentLan === 'zh') {
              this.loadChineseLanguage();
            }
            else {
              i18n.changeLan(currentLan);
            }
          }}
          value={i18n.language}
        >
          <option value="" disabled hidden>
            {t("choose_language")}
          </option>
          {Object.keys(languages).map(languageKey => (
            <option value={languageKey} key={languageKey}>
              {languages[languageKey]}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default withT(withRouter(LanguagePicker));
