import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './app/App.jsx';
import { store } from './app/store';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';

import makeServer from './api/server';

import {fetchPosts} from './components/Posts/postsSlice';

if(typeof makeServer ==='function'){
  makeServer();
}

store.dispatch(fetchPosts({from:0, to:5}));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


