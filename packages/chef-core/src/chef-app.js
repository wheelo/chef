import { compose } from './utils/compose.js';
import BaseApp from './base-app';
import createClientHydrate from './plugins/client-hydrate';
import createClientRenderer from './plugins/client-renderer';
import { RenderToken, ElementToken } from './tokens';

export default function () {
  return class ChefApp extends BaseApp {
    constructor(el, render) {
      super(el, render);
      this.middleware({ element: ElementToken }, createClientHydrate);
    }
    resolve() {
      this.middleware({ render: RenderToken }, createClientRenderer);
      return super.resolve();
    }
    // 应用的入口，必须调用init()应用才能启动
    init(opts) {
      this.resolve();

      const ctx = {
        url: window.location.path + window.location.search,
        element: null,
        body: null,
      };

      return compose(this.plugins)(ctx, () => Promise.resolve()).then(() => ctx);
    }

  };
}
