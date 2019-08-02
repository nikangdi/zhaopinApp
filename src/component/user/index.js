import React from 'react'
import {Result, List,WhiteSpace,Modal,Button} from 'antd-mobile'
import browserCookie from 'browser-cookies'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'
import {logoutSubmit} from '../../redux/user.redux'

//！！！！存在一个问题，一刷新redux中存的值  重置为初始值
@connect(
    state=>state.user,
    {logoutSubmit}
)
class User extends React.Component{
    // constructor(props){
    //     super(props)
    // }  
    logout = ()=>{
        // console.log('logout')
        const alert = Modal.alert ;
        alert('注销', '确认退出登录吗?', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => {
                browserCookie.erase('userid') //手动清除掉cookie
                this.props.logoutSubmit()  //手动清除掉redux，即给其赋初值
            }}
        ])    
    }
    render(){
        const props = this.props
        // console.log(props.user)
		const Item = List.Item
		const Brief = Item.Brief
        return props.user?(   //！！！这个user指的是redux srore中存的user用户名变量，而非user reducer store
            <div>
                
				<Result
					img={<img src={require(`../img/${props.avatar}.png`)} style={{width:50}} alt="" />}
					title={props.user}
					message={props.type=='boss'?props.company:null}
				/>
				
				<List renderHeader={()=>'简介'}>
					<Item
						multipleLine
					>
						{props.title}
						{props.desc.split('\n').map(v=><Brief key={v}>{v}</Brief>)}
						{props.money?<Brief>薪资:{props.money}</Brief>:null}
					</Item>
					
				</List>
				<WhiteSpace></WhiteSpace>
				
					<Button onClick={this.logout}>退出登录</Button>
				
			</div>
        ):<Redirect to={props.redirectTo} />
        
    }
}
export default User;