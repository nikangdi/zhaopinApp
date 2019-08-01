import React from 'react'
import {TabBar} from 'antd-mobile'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'


//必须用withrouter 修饰符包裹，因为此组件并非路由组件，不能直接访问router信息，但其父组件是路由组件，所以不用withrouter
@withRouter
@connect(
	state=>state.chat
)
class NavLinkBar extends React.Component{
	static propTypes = {
		data: PropTypes.array.isRequired
	}
	render(){
		
		const navList = this.props.data.filter(v=>!v.hide)
		const {pathname} = this.props.location
		return (
			<TabBar>
				{navList.map(v=>(
					<TabBar.Item
						badge={v.path=='/user/msg'? this.props.unread>=0?this.props.unread:0 :0}   //徽标   ,考虑负值
						key={v.path}
						title={v.text}
						icon={{uri: require(`./img/${v.icon}.png`)}}
						selectedIcon={{uri: require(`./img/${v.icon}-active.png`)}}
						selected={pathname===v.path}
						onPress={()=>{
							this.props.history.push(v.path)
						}}
					>
					
					</TabBar.Item>
				))}
			</TabBar>
		)
	}
}

export default NavLinkBar