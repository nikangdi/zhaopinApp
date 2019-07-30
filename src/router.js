import React from 'react'
import { BrowserRouter, Route, Redirect,Switch} from 'react-router-dom'
 
//导入组件
import App from './App'

import Login from './container/login/login'
import Register from './container/register/register'
import AuthRoute from './component/authroute/authroute'
import BossInfo from './container/bossinfo/bossinfo'
import GeniusInfo from './container/geniusinfo/geniusinfo'
import DashBoard from './component/dashboard/dashboard'
import NotFound from './container/notfound/index'

export default class ERouter extends React.Component{//这是一个router组件
    render(){
        return(
            <BrowserRouter>
                <AuthRoute></AuthRoute>
                <App>
                    <Switch>
                        <Route path='/bossinfo' component={BossInfo}></Route>
                        <Route path='/geniusinfo' component={GeniusInfo}></Route>
				        <Route path='/login' component={Login}></Route>
				        <Route  path='/register' component={Register}></Route>
                        <Route path='/user' component={DashBoard}></Route>
                        <Route component={NotFound}></Route>
                    </Switch>          
                </App>
            </BrowserRouter>
        )
    }
}