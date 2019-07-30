import React from 'react'
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'
import {Redirect,Switch, Route} from 'react-router-dom'
import NavLinkBar from '../navlink/navlink'
import Boss from '../../component/boss/boss'
import Genius from '../../component/genius/genius'

import User from '../../component/user/index'

function Msg(){
	return <h2>消息列表页面</h2>
}
// function User(){
// 	return <h2>个人中心页面</h2>
// }
@connect(
	state=>state
)
class Dashboard extends React.Component{

	render(){
		const {pathname} = this.props.location
		const user = this.props.user
		const navList = [
			{
				path:'/user/boss',
				text:'牛人',
				icon:'boss',
				title:'牛人列表',
				component:Boss,//Boss组件展示的是牛人列表
				hide:user.type=='genius'  //取非再展示
			},
			{
				path:'/user/genius',
				text:'boss',
				icon:'job',
				title:'BOSS列表',
				component:Genius,
				hide:user.type=='boss'
			},
			{
				path:'/user/msg',
				text:'消息',
				icon:'msg',
				title:'消息列表',
				component:Msg
			},
			{
				path:'/user/me',
				text:'我',
				icon:'user',
				title:'个人中心',
				component:User
			}
			
		]


		// return navList.find(v=>v.path==pathname)?
		// return(
		// 	//加一个判断，pathname是这四个里面的在进行查找
		// 	<div>	
		// 		<NavBar className='fixd-header' mode='dard'>{navList.find(v=>v.path==pathname).title}</NavBar>
		// 		<div style={{marginTop:45}}>
		// 				<Switch>

		// 					{navList.map(v=>(
		// 						<Route key={v.path} path={v.path} component={v.component}></Route>
		// 					))}
		// 				</Switch>
		// 		</div>
		// 		<NavLinkBar data={navList}></NavLinkBar>
				
		// 	</div>
		// )
		// :
		// //若不在上述四个中  直接显示404
		// // <Redirect to={navList[3].path}></Redirect>
		// <Route component={NotFound}></Route>
		return (<div>
		<NavBar className='fixd-header' mode='dard'>{navList.find(v=>v.path==pathname).title}</NavBar>
		<div style={{marginTop:45}}>
				<Switch>
					{navList.map(v=>(
						<Route key={v.path} path={v.path} component={v.component}></Route>
					))}
				</Switch>
		</div>

		<NavLinkBar data={navList}></NavLinkBar>
		
	</div>)
		
	}

}

export default Dashboard