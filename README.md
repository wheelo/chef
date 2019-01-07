![new banner](https://raw.githubusercontent.com/wheelo/chef/master/Banner.jpg)

# chef
🚀🚀 `chef` is a react based tool kit which enables agile plugin development. All in this one cooker.

## Features
* **Out of box**, with built-in support range from react, i18n to SSR.
* **Complete plugin system**, which could easily integrate with user land plugin and built-in i18n, redux, router system, SSR, etc.
* **Next.js like routing conventions**, which also supports configured routing && dynamic routing generator
* **High performance**, with support for PWA, route-level code splitting, etc. via plugins
* **command line**, support command line to generate boilerplate && boot dev server && uglify/babelfy codes
* **Support TypeScript**, all codes are writteen in Typescript, including d.ts definition(TODO)
* **[dva] model supportive(https://dvajs.com/)**, support duck directory, automatic loading of model, code splitting, etc


## Usage
```javascript
	// index.js
	import chef from '@chef/chef-react';
	// Redux
	import Redux from '@chef/chef-redux';
	// React-router
	import Router from '@chef/chef-router';
	// I18n
	import I18n from '@chef/chef-i18n';

	// config
	import root from './root';
	import reducer from './reducers';
	import translations from './translations';

	chef(root, 'root')
    		// Pugin/config
		.use(Redux, { reducer })
		// cookie > localStorage > navigator.language
		// i18n code: https://www.science.co.il/language/Codes.php		
		.use(I18n, {
		  translations,
		  lng: 'en'
		});
		// need init()
		.init();
	
	// other.js
	import { withT, Trans, i18n } from "@chef/chef-i18n";
	// withT to register HOC
	i18.changeLanguage('fr');
	i18n.language;
```

## Dependencies
- Typescript
- Lerna
- yarn
- jest

## TODO
- [ ] Typescript
- [ ] UMI or Next.js to route automatically and code generation
- [ ] Create Command Line / babel7 and put them in one folder
- [ ] SSR && Docker


### [中文文档](https://github.com/wheelo/chef/blob/master/README_ZH.md)

