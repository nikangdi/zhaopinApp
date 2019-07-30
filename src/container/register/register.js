import React from 'react'
import Logo from '../../component/logo/logo'
import {List, InputItem, WingBlank, WhiteSpace, Button,Radio} from 'antd-mobile'
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom'
import { register } from '../../redux/user.redux'
import ChangeForm from '../../component/changeForm/index'

const RadioItem = Radio.RadioItem

@ChangeForm
@connect(
    state=>state.user,
    {register}
)
 class Register extends React.Component{
    constructor(props){
        super(props);
        // this.state={
        //     user:'',//用户名
        //     psw:'',//密码
        //     repeatpsw:'',//确认密码
        //     type:'genius',//选择身份
        // }
    }
    handleRegister=()=>{
        //注册事件
        this.props.register(this.props.state)

    }
    componentDidMount(){
        //给一个type初始值
        this.props.handleChange('type','genius')
    }
    login = ()=>{
        //跳转登录界面
        this.props.history.push('/login')
    }
    // handleChange=(key,val)=>{
    //     this.setState({
    //         [key]:val
    //     })
    //     // console.log(this.state)
    // }
    render(){
        return(
            <div>
                {this.props.redirectTo? <Redirect to={this.props.redirectTo} />:null}
                <Logo />
                <WingBlank>
                    <List>
                        {this.props.msg?<p className='error-msg'>{this.props.msg}</p>:<WhiteSpace />}
                        {/* 根据后端返回的msg  和 前端正则等判定的 msg 结果来  判断并提示   redux中 */}
                        {/* 从后端获取的变量在redux中，跟后端进行交互的操作在redux中   前端页面的交互（获取表单等）在页面组件中  页面中的变量在页面组件中*/}
                        {/* 分为两部分数据：从页面中获取的数据；要显示在页面上的数据 */}
                        {/* 要显示在页面上的数据在redux中，相关的操作同在 */}
                        {/* 从页面中获取的数据 在 页面组件中 ，相关的操作同在*/}
                        <InputItem onChange={val=>this.props.handleChange('user',val)}>用户</InputItem>
                        <WhiteSpace />
                        <InputItem onChange={val=>this.props.handleChange('psw',val)} type='password'>密码</InputItem>
                        <WhiteSpace />
                        <InputItem onChange={val=>this.props.handleChange('repeatpsw',val)} type='password'>确认密码</InputItem>
                        <WhiteSpace />
                        <RadioItem onChange={()=>this.props.handleChange('type','genius')} checked={this.props.state.type=='genius'}>牛人</RadioItem>
                        <RadioItem onChange={()=>this.props.handleChange('type','boss')} checked={this.props.state.type=='boss'}>BOSS</RadioItem>
                        
                    </List>
                    <WhiteSpace />
                    <div style={{textAlign:'center'}}>
					<Button inline  onClick={this.login} style={{ marginRight: '40px' }} >登录</Button>
					<Button  inline   type='primary' onClick={this.handleRegister} type='primary'>注册</Button>
                    </div>
                </WingBlank>
            </div>
        )
    }
}

export default Register