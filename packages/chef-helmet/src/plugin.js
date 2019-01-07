import React from 'react';
import { createPlugin } from '@chef/chef-core';
import { HelmetProvider } from 'react-helmet-async';

// 服务端渲染用于获取props.helmet
const helmetContext = {};

const HelmetPlugin = createPlugin({
  middleware: () => {
    return (ctx, next) => {
      // context
      ctx.element = (
        <HelmetProvider context={helmetContext}>{ctx.element}</HelmetProvider>
      );
      return next();
    };
  }
});

export default HelmetPlugin;