import React, { Component, PropTypes  } from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, Link } from 'react-router'

import Ajax from "Component/Ajax";
import {a, C} from "Component/Test";

/**
 * redux
 */
import { combineReducers, createStore } from 'redux';
import * as actions from "Component/actionTypes";
const initialState = {
    visibilityFilter: actions.SHOW_ALL,
    todos: []
};
// Object.assign() 是 ES6的特性
function todos(state = [], action) {
    switch (action.type) {
        case actions.VisibilityFilters.ADD_TODO:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false
                }
            ];
        case actions.VisibilityFilters.TOGGLE_TODO:
            return state.map((todo, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    })
                }
                return todo;
            });
        default:
            return state;
    }
}
function visibilityFilter(state = actions.VisibilityFilters.SHOW_ALL, action) {
    switch (action.type) {
        case actions.VisibilityFilters.SET_VISIBILITY_FILTER:
            return action.filter;
        default: return state
    }
}
// function toDoApp(state = initialState, action) {
//     return {
//         visibilityFilter: visibilityFilter(state.visibilityFilter, action),
//         todos: todos(state.todos, action)
//     }
// }
const todoapp = combineReducers({
    visibilityFilter, todos
});
// export default todoapp
let store = createStore(todoapp);
//------------------------------------------ End

// 入口App
class App extends Component {
    //一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。
    constructor(props) {
        super(props);
        // 测试 理解 export default
        C();
        console.log(a);
        
        // 自定义 promise ajax
        const ajax = new Ajax("/version.json");
        ajax.ajax("/version.json", (data)=>{
            console.log(data);
        });
    
    }
    getChildContext(){
        return {color: "purple"};
    }
    render() {
        return (
            <div>
                <h1>App</h1>
                <ul>
                    <li><Link to="/about">About{this.toString()}</Link></li>
                    <li><Link to="/inbox">Inbox</Link></li>
                </ul>
                {this.props.children}
            </div>
        )
    }
    a;
}

//由于类的方法都定义在prototype对象上面，所以类的新方法可以添加在prototype对象上面。Object.assign方法可以很方便地一次向类添加多个方法
Object.assign(App.prototype, {
    toString(){
        return ("tostring");
    },
    toValue(){}
});
App.childContextTypes = {
    color: React.PropTypes.string.isRequired
};

// About
const About = React.createClass({
    render() {
        return <h3>About</h3>
    }
});

// Inbox
const Inbox = React.createClass({
    handle(e){
        // console.log(e.target);
        location.href= '#/messages/5';
    },
    render() {
        return (
            <div>
                <h2>Inbox</h2>
                {this.props.children || "Welcome to your Inbox"}
                <p onClick={this.handle}>跳转</p>
            </div>
        )
    }
});

// Inbox/Message
class Message extends React.Component{
    constructor(props) {
        super(props)
    }
    componentWillMount(){
        console.log(this.context);
        this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    }
    routerWillLeave(nextLocation) {
        console.log(nextLocation);
        return '确认要离开？';
    }
    render (){
        return <h3>Message {this.props.params.id}</h3>
    }
}
// 备注：
// 任何想访问context里面的属性的组件都必须显式的指定一个contextTypes 的属性。如果没有指定改属性，那么组件通过 this.context 访问属性将会出错。

// react-router 传递了router到子组件中，但是router对象 可能 并没有在contextTypes 对象中声明
// 而React 对 context 的态度是，只要没有在 contextTypes 中声明的属性一律不准加入 context

// context 另一个作用是 跨组件 传递数据
Message.contextTypes = {
    router: PropTypes.object.isRequired,
    color: React.PropTypes.string.isRequired
};

render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="about" component={About} />
            <Route path="inbox" component={Inbox}>
                <Route path="/messages/:id" component={Message}/>
            </Route>
        </Route>
    </Router>
), document.getElementById('app'));

