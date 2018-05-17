import React, {Component} from 'react'
import ReactDOM, { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from 'app/containers/App.jsx'
import store from 'app/redux/store.js'
import styles from './scss/main.scss'

ReactDOM.render(    
    <Provider store={store}>
        <App/>
    </Provider>, 
    document.getElementById('main')
)