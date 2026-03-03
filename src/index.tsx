import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './interceptors/axios';
import {store} from './redux/store';
import {Provider} from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="199802088131-b9iu2effba5u7bitm0aitma54noj9g86.apps.googleusercontent.com">
            <Provider store={store}>
                <App/>
            </Provider>
        </GoogleOAuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
