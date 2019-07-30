import axios from 'axios'

const type = {
    USER_LIST:'USER_LIST',
}

const initState = {
	userlist:[]
}

export function chatuser(state=initState,action){
    switch(action.type){
        case type.USER_LIST:
            return{...state,userlist:action.payload};
        default:
            return state;
    }

}
//获取用户列表的 action
function userList(data){
    return {type:type.USER_LIST,payload:data}
}
export function getUserList(type){
    return dispatch =>{
        axios.get('/user/list?type='+type).then(res=>{
            if(res.data.code==0){
                dispatch(userList(res.data.data))
            }
        })
    }
}
