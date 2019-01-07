import React from 'react';
import PropTypes from 'prop-types';

import i18n from './i18n';

function Translate(props, context) {
  return (
    <span>
      {(context.i18n && context.i18n.translate(props.id, props.data)) ||
        props.id}
    </span>
  );
}

Translate.contextTypes = {
  i18n: PropTypes.object
};

const Trans = Translate;

export { Translate, Trans };
