import * as React from 'react';
import ReactDOM from 'react-dom';

function clientRender(el, id = 'app-root') {
  // 使用app-root作为默认的根元素
  const domElement = document.getElementById(id);

  if (!domElement) {
    throw new Error("Could not find root element");
  }

  ReactDOM.render(el, domElement);
  return domElement;
}

export default clientRender;
