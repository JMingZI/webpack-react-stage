import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import App from './App/Index'
import List from './Component/List/List'
import Create from './Component/Create/Create'
import AddCreate from './Component/AddCreateDetail/AddCreateDetail'
import Detail from './Component/Detail/Detail'
import BxListDetail from './Component/BxListDetail/BxListDetail'

import './_App.scss'
import "config.js"

render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
        <Route path="/list/:urlType/:listType" component={List}/>
        <Route path="/create" component={Create}/>
        <Route path="/create/:applyId" component={Create}/>
        <Route path="/create/:applyId/:isWaitSubmit" component={Create}/>
        
        <Route path="/add" component={AddCreate}/>
        <Route path="/add/:id" component={AddCreate}/>
            
        <Route path="/detail/:pageType/:applyId" component={Detail}/>
        {/*<Route path="/detail/:pageType/:applyId/:orgId" component={Detail}/>*/}
        <Route path="/bxListDetail" component={BxListDetail}/>
        {/*<Route path="/detail/:type/:title/:id/:pageType" component={Detail}/>*/}
        {/*<Route path="/extrame" component={ExtraMe}/>*/}
    </Router>
), document.getElementById('app'));