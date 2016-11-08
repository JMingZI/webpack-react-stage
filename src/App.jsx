import React, { Component, PropTypes  } from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, Link } from 'react-router'
import { createStore } from "redux"
import { Provider } from "react-redux"
import Index from "App/Index"
import todoapp from "Component/Reducer"

let store = createStore(todoapp);
let rootElement = document.getElementById("app");
render(
    <Provider store = {store}>
        <Router history={hashHistory}>
            <Route path="/" component={Index} />
        </Router>
    </Provider>,
    rootElement
);

// Inbox/Message
// class Message extends React.Component{
//     constructor(props) {
//         super(props)
//     }
//     componentWillMount(){
//         console.log(this.context);
//         this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
//     }
//     routerWillLeave(nextLocation) {
//         console.log(nextLocation);
//         return '确认要离开？';
//     }
//     render (){
//         return <h3>Message {this.props.params.id}</h3>
//     }
// }
// 备注：
// 任何想访问context里面的属性的组件都必须显式的指定一个contextTypes 的属性。如果没有指定改属性，那么组件通过 this.context 访问属性将会出错。

// react-router 传递了router到子组件中，但是router对象 可能 并没有在contextTypes 对象中声明
// 而React 对 context 的态度是，只要没有在 contextTypes 中声明的属性一律不准加入 context

// context 另一个作用是 跨组件 传递数据
// Message.contextTypes = {
//     router: PropTypes.object.isRequired,
//     color: React.PropTypes.string.isRequired
// };

