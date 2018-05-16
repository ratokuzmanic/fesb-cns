'use strict'

import React, { Component, Children } from 'react'
import classnames from 'classnames'
class CSSTransition extends Component {

    constructor(props) {
        super(props)
        console.log('CONSTRUCTOR:', props)        
        this.children = []
    }
    
    componentDidMount = () => {
        console.log('CDM')
        Children.forEach(this.props.children, (child, index) => {
            if (child) {
                this.children.push(React.cloneElement(child, {key: index}))                
            }
        })

        console.log('Children:', this.children)
        this.forceUpdate()
    }
    
    componentWillReceiveProps(nextProps) {
        console.log('CWRP', this.props, nextProps)
        // const startTransition = false

        // const {
        //     className, 
        //     classNameStart,
        //     classNameEnd
        // } = this.props        
        
        // const classNames = classnames({
        //     [className]: className ? true : false,
        //     [classNameStart]: classNameStart && !startTransition ? true : false,
        //     [classNameEnd]: classNameEnd && startTransition ? true : false           
        // }) || undefined


        // const child = nextProps.children ? Children.only(nextProps.children) : null
        // if (child) {
        //     this.child = React.createElement('div', {
        //         className: classNames,
        //         onTransitionEnd: this.onTransitionEnd                
        //     }, [React.cloneElement(child, {key: '1'})])
        // }

        // console.log(this.props, nextProps, this.child)
        // this.timeout = setTimeout(this.startTransition, 10)
    }

    componentWillUnmount() {
        console.log('CWU')
        // if (this.timeout) {
        //     clearTimeout(this.timeout)
        // }
    }

    startTransition = () => {
        // this.setState({startTransition: true})
        // const startTransition = true

        // const {
        //     className, 
        //     classNameStart,
        //     classNameEnd
        // } = this.props        
        
        // const classNames = classnames({
        //     [className]: className ? true : false,
        //     [classNameStart]: classNameStart && !startTransition ? true : false,
        //     [classNameEnd]: classNameEnd && startTransition ? true : false           
        // }) || undefined
        
        // this.child = React.cloneElement(this.child, {
        //     className: classNames
        // })
        // console.log(this.child)
        // this.forceUpdate()
    }

    onTransitionEnd = () => {
        console.log('TRANSITION END')
    }

    render() {
        console.log(this.children.length)
        return (
            this.children
        )
    }
}

export default CSSTransition