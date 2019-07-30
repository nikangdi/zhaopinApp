import React from 'react'
import PropTypes from 'prop-types'
import {Card, WhiteSpace,WingBlank} from 'antd-mobile'
import {withRouter} from 'react-router-dom'


//本组件并非路由组件
@withRouter
class UserCard extends React.Component{
	static propTypes = {
		userlist: PropTypes.array.isRequired
	}
	handlerClick = (v)=>{
			this.props.history.push(`/chat/${v._id}`)
	}
	
	render(){
		const Header = Card.Header
		const Body = Card.Body
		return (
			<WingBlank>
			<WhiteSpace></WhiteSpace>
				{this.props.userlist.map(v=>(

					v.avatar?(<Card 
					key={v._id} 
					onClick={()=>this.handlerClick(v)}>  
					{/* 点击跳转到具体的chat页面,穿进去为每个用户的具体的信息 */}
						<Header
							title={v.user}
							thumb={require(`../img/${v.avatar}.png`)}
							extra={<span>{v.title}</span>}
						></Header>
						<Body>
							{v.type=='boss'? <div>公司:{v.company}</div> :null}

							{v.desc.split('\n').map(d=>(
								<div key={d}>{d}</div>
							))}
							{v.type=='boss'? <div>薪资:{v.money}</div> :null}
						</Body>
					</Card>):null

				))}
			</WingBlank>
		)


	}
}
export default UserCard

