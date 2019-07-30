import axios from 'axios';
import { Toast } from 'antd-mobile'
import {getRedirectPath} from '../util'
export const type = {
    // REGISTER_SUCCESS:'REGISTER_SUCCESS',
    // LOGIN_SUCCESS:'LOGIN_SUCCESS',
    ERROR_MSG:'ERROR_MSG',
    LOAD_DATA:'LOAD_DATA',
    CAPTCHA_SUC:'CAPTCHA_SUC',
    AUTH_SUCCESS:'AUTH_SUCCESS',
    LOGOUT:'LOGOUT'
}
const initState = {
    
    msg:'',
    user:'',
    type:'',
    redirectTo:'',
    captchaData:''

}
export function user(state=initState,action){
    switch(action.type){
        case type.AUTH_SUCCESS:
			return {...state, msg:'',redirectTo:getRedirectPath(action.payload),...action.payload}
        // case type.REGISTER_SUCCESS:
        //     return{...state,msg:'',redirectTo:getRedirectPath(action.payload),...action.payload};
        // case type.LOGIN_SUCCESS:
        //     return{...state,msg:'',redirectTo:getRedirectPath(action.payload),...action.payload};
        case type.ERROR_MSG:
            return{...state,msg:action.msg};
        case type.LOAD_DATA:
            return{...state,...action.payload}
        case type.CAPTCHA_SUC:
            return{...state,...action.payload}
        case type.LOGOUT:
            return{...initState,redirectTo:'/login'}   //!!!!!退出时清除redux
        default:
            return state;
    }
}

//action
// function registerSuccess(data){
//     return {
//         type:type.REGISTER_SUCCESS,payload:data
//     }
// }
// function loginSuccess(data){
//     return{
//         type:type.LOGIN_SUCCESS,
//         payload:data  //登录成功后返回到来的数据
//     }
// }
//由  下面的 authSuccess统一 代替
function authSuccess (data){
    return{
        type:type.AUTH_SUCCESS,
        payload:data
    }
}
function errorMsg(msg){
    return{
        msg,type:type.ERROR_MSG
    }
}
function captchaReqSuccess(data){
    return {
        type:type.CAPTCHA_SUC,
        payload:data
    }
}


export function captchaReq(){
    return dispatch=>{
        axios.get('/user/captcha').then(
            res=>{
                if(res.status==200){
                    // console.log(res)
                    // res结构
                    //data 是一个字符串  
                    //{data: "<svg xmlns="http://www.w3.org/2000/svg" width="150…L111.26 25.50Q122.78 38.35 131.38 45.20Z"/></svg>", status: 200, statusText: "OK", headers: {…}, config: {…}, …}
                    dispatch(captchaReqSuccess({captchaData:res.data}))
                }
            }
        )
    }
    
}
export function update(data){  
    return dispatch =>{
        axios.post('/user/update',data)
            .then(res=>{
                if (res.status==200&&res.data.code===0) {
					dispatch(authSuccess(res.data.data))   //更新完信息后进行跳转
				}else{
					dispatch(errorMsg(res.data.msg))
				}
            })
    }
}
export function login({user,psw,captchaInput}){
    if(!user||!psw){
        return errorMsg('用户密码必须输入！')
    }else{
        if(!captchaInput){
            return errorMsg('请输入验证码！')
        }
        return dispatch =>{
            axios.post('/user/login',{user,psw,captchaInput}).then(
                res=>{
                    if(res.status==200&&res.data.code===0){
                        // console.log(res.data.data)
                        Toast.success("登陆成功！",1.5)
                        dispatch(authSuccess(res.data.data))
                    }
                    else{
                        dispatch(errorMsg(res.data.msg))
                    }
                }
            )
        }
    }
}
export function logoutSubmit(){
    return{type:type.LOGOUT}
}
export function register({user,psw,repeatpsw,type}){
    if (!user||!psw||!type) {
		return errorMsg('用户名密码必须输入')
    }
    if (psw!==repeatpsw) {
		return errorMsg('密码和确认密码不同')
    }
    return dispatch=>{
        axios.post('/user/register',{user,psw,type})
        .then(res=>{
            if (res.status==200&&res.data.code===0) {
                // console.log({user,psw,type})
                Toast.success("注册成功！",1.5)
                dispatch(authSuccess({user,psw,type}))
            }else{
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}
export function loadData(userinfo){
    // console.log(loadData)
    return {type:type.LOAD_DATA,payload:userinfo}
}


