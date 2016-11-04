import React from 'react';
import Helmet from "react-helmet";

export default class App extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            
        };
    }
    componentWillMount(){
        
    }
    componentDidMount(){
        
    }
    test(){
        console.log("test");
    }
    handle(){
        // const location = this.props.location;
        // if (location.state && location.state.nextPathname) {
        //     this.props.history.replaceState(null, location.state.nextPathname);
        // } else {
        //     // 这里使用 replaceState 方法做了跳转，但在浏览器历史中不会多一条记录，因为是替换了当前的记录
        //     this.props.history.replaceState(null, '/create');
        // }
        location.href = "#/inbox"
    }
    render(){
        return (
            <div className="container">
                <Helmet title="test"/>
                
                <div onClick={this.handle.bind(this)}>跳转</div>
            </div>
        )
    }
}
