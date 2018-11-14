# chef
`chef`is a react based tool kit which enables agile plugin development.

## Usage
```javascript
	// index.js
	import react from '@chef/chef-react';
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

	react(root, 'root')
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
- jest

## Epilogue
  Finally, it updates!



### [中文文档](https://github.com/wheelo/chef/blob/master/README_ZH.md)

