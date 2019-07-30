import React from 'react';
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import {update} from '../../redux/user.redux'

@connect(
    state=>state.user,
    {update}  //必须是对象
)
class BossInfo extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            title:'',
            company:'',
            money:'',
            desc:'',
            avatar:''
        }
    }
    onChange(key,val){
        this.setState({
            [key]:val
        })
    }
    render(){
        const path = this.props.location.pathname
		const redirect = this.props.redirectTo
        return(
            <div>

                {/* 因为这个redirect跳转本身即为两个改变与为改变之间的跳转，
                所以跳转到一个新的页面还会有redirect判断，bossinfo页面不断地进行 向自己跳转 */}
                {/* 所以，要加一个redirect是否等于本身的path的一个判定再进行跳转 ，已经在当前页面了就不行进行跳转了*/}

                {redirect&&redirect!==path? <Redirect to={this.props.redirectTo}></Redirect> :null}
                <NavBar mode="dark" >BOSS完善信息页</NavBar>
                <AvatarSelector 
					selectAvatar={(imgname)=>{ //向子组件传 方法，使得子组件向父组件传值
						this.setState({
							avatar:imgname
						})
					}}
				></AvatarSelector>
                <InputItem onChange={(v)=>this.onChange('title',v)}>
					招聘职位
				</InputItem>
				<InputItem onChange={(v)=>this.onChange('company',v)}>
					公司名称
				</InputItem>
				<InputItem onChange={(v)=>this.onChange('money',v)}>
					职位薪资
				</InputItem>
                <TextareaItem
					onChange={(v)=>this.onChange('desc',v)}
					rows={3}
					autoHeight
					title='职位要求'
				></TextareaItem>
                <Button onClick={()=>{
						this.props.update(this.state)
                    }} 
                    type='primary'>提交</Button>

            </div>
        )
    }
}

export default BossInfo;