
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store';


import { Buffer } from 'buffer';
window.Buffer = Buffer;


import process from 'process';
if (!window.process) window.process = process;

import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n/config.js';

import EventEmitter from 'events';
if (typeof EventEmitter !== 'undefined' && !EventEmitter.prototype.off) {
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
}


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
<I18nextProvider i18n={i18n}>
  <App />
</I18nextProvider>
  </Provider>
)
