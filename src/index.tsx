/**
 * Migrating from create-react-app-typescript to Create React App
 * https://vincenttunru.com/migrate-create-react-app-typescript-to-create-react-app/
 * */

import React from 'react';
import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import 'core-js';
import ReactDOM from 'react-dom';
import './i18n/i18n';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import ruRu from 'antd/lib/locale/ru_RU';
import kkKZ from 'antd/lib/locale/kk_KZ';
import App from './App';
import i18n from './i18n/i18n';
import 'antd/dist/antd.css';

const getCurrentLocale = () => {
  switch (i18n.language) {
    case "en":
      return enUS;
    case "ru":
      return ruRu;
    case "kz":
      return kkKZ;
  };

  return enUS;
};



const app = <ConfigProvider locale={getCurrentLocale()}>
  <App />
</ConfigProvider>
ReactDOM.render(app, document.getElementById('root'));
