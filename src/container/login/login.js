import React from 'react'
import Logo from '../../component/logo/logo'
import {List, InputItem, WingBlank, WhiteSpace, Button} from 'antd-mobile'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import {login,captchaReq} from '../../redux/user.redux'
import  ChangeForm from '../../component/changeForm'

// function hello(){
// 	console.log('hello imooc I love React')
// }

// function WrapperHello(fn){
// 	return function(){
// 		console.log('before say hello')
// 		fn()
// 		console.log('after say hello')
// 	}
// }
// hello = WrapperHello(hello)
// hello()

// 属性代理
// function WrapperHello(Comp){

// 	class WrapComp extends Comp{
// 			componentDidMount(){
// 				console.log('高阶组件新增的生命周期，加载完成')
// 			}
// 			render(){
// 				return <Comp></Comp>
// 			}
// 	}
	// class WrapComp extends React.Component{

	// 	render(){
	// 		return (<div>
	// 			<p>这是HOC高阶组件特有的元素</p>
	// 			<Comp name='text' {...this.props}></Comp>
	// 		</div>)
	// 	}
	// }
// 	return WrapComp
// }




// @WrapperHello
// class Hello extends React.Component{
// 	render(){
// 		return <h2>hello imooc I love React&Rdux</h2>
// 	}
// }

@connect(
    state=>state.user,  //用户名
    {login,captchaReq}
)

//加了高阶组件后  使用的都是  高阶组件传过来的state与方法
//注意元组件优化时   将this.state改为this.props.state
// this.handleChange改为this.props.handleChange
@ChangeForm
class Login extends React.Component{
    constructor(props){
        super(props);
        // this.state = {
        //         user:'',//用户名
        //         psw:'',//密码
        //         captchaInput:""  //输入的验证码
        // }
    }
    handleLogin=()=>{
        //登录按钮点击事件
        this.props.login(this.props.state)
    }
    register=()=>{
        //注册按钮点击事件
        this.props.history.push('/register')
    }
    // handleChange=(key,val)=>{
    //         this.setState({
    //             [key]:val
    //         })
    //         // console.log(this.state)
    // }
    componentDidMount(){
        this.onCaptchaClick()
    }
    onCaptchaClick = ()=>{
        this.props.captchaReq()
    }
    render(){
        return(
            <div>
                {(this.props.redirectTo&&this.props.redirectTo!='/login')? <Redirect to={this.props.redirectTo} />: null}
                <Logo />
                <WingBlank>
                    <List>
                        {this.props.msg?<p className='error-msg'>{this.props.msg}</p>:null}
                        <WhiteSpace />
                        <InputItem onChange={val=>this.props.handleChange('user',val)}>用户</InputItem>
                        <WhiteSpace />   
                        <InputItem onChange={val=>this.props.handleChange('psw',val)} type="password">密码</InputItem>


                        {/* 事件等调用时注意只有两种方式，一种直接如下传函数名，
                                    二种  外面加一个 箭头函数包裹一下 
                            若onClick={this.props.captchaReq()}  将造成连续不断的点击事件效果，不断触发
                                    */}
                        <div style={{width:'100%',textAlign:'right'}}>
                            <span dangerouslySetInnerHTML={{ __html: this.props.captchaData}}  onClick={this.onCaptchaClick}></span>
                        </div>
                        {/* react强制将  字符串 转为 html 标签 */}
                        {/* 显示验证码 */}


                        <InputItem onChange={val=>this.props.handleChange('captchaInput',val)} >验证码</InputItem>
                    </List>
                    <WhiteSpace />
                    <Button onClick={this.handleLogin} type='primary'>登录</Button>
					<WhiteSpace />
					<Button onClick={this.register} type='primary'>注册</Button>
                </WingBlank>
            </div>
        )
    }
}

export default Login