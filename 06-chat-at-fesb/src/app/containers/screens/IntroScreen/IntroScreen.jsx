import React, { Component } from 'react'
import ReactDOM, { render } from 'react-dom'
import { connect } from 'react-redux'
import { serverConnect } from 'app/redux/actions/serverActions.js'
import ServerForm from 'app/components/ServerForm/ServerForm.jsx'
import './IntroScreen.scss'

class IntroScreen extends Component {
    render() {
        const {
            connecting,
            serverConnect
        } = this.props
        
        return (
            <div className={'IntroScreen'}>
                <div className={'IntroScreen__title'}> Chat@FESB </div>
                <ServerForm
                    connecting={connecting}
                    hostText={'Server address'}
                    portText={'Port'}
                    nickText={'Nickname'}
                    buttonText={'Join'}
                    onConnect={serverConnect}
                    defaults={{host: 'localhost', port: 6968}}
                />
            </div>
        )
    }
}

const mapStateToProps = ({ server }) => ({
    connecting: server.connecting
})
const IntroScreenContainer = connect(
    mapStateToProps,
    { serverConnect }
)(IntroScreen)

export default IntroScreenContainer