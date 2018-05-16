import React, { Component } from 'react'
import ReactDOM, { render } from 'react-dom'
import { connect } from 'react-redux'
import IntroScreen from 'app/containers/screens/IntroScreen/IntroScreen.jsx'
import MainScreen from 'app/containers/screens/MainScreen/MainScreen.jsx'

const App = ({ connected }) => {
    return connected ? (
        <MainScreen/>
    ) : (
        <IntroScreen/>
    )
}

const mapStateToProps = ({state, server: { connected } }) => ({ connected })
const AppContainer = connect(mapStateToProps)(App)

export default AppContainer
