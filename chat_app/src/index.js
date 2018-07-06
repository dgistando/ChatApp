import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import ReduxPromise from 'redux-promise';

const storeFromMiddleWare = applyMiddleware(ReduxPromise)(createStore)

const store = storeFromMiddleWare(reducers)

// store.subscribe(() =>
//   console.log(store.getState())
// )

ReactDOM.render(
                <Provider store={store}>
                <App />
                </Provider>, document.getElementById('root'));
registerServiceWorker();
