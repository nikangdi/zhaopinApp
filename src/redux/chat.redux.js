import axios from 'axios'
//前端部分socket.io
import io from 'socket.io-client'

const socket = io('ws://localhost:9093')//此时链接是跨域的,所以需要手动连接一下

const type = {
    MSG_LIST:'MSG_LIST',//刚进界面时获取聊天列表
    MSG_RECV:'MSG_RECV',//用户发送一条，读取信息
    MSG_READ:'MSG_READ',//标识已读
}


const initState = {
    chatMsg:[], //消息列表
    unread:0,//未读的条数

}

export  function chat(state=initState,action){
    switch(action.type){
        case type.MSG_LIST:
            return{...state,chatMsg:action.payload,unread:action.payload.filter(v=>!v.read).length}; //如果用大括号就要在其中return
        // case type.MSG_RECV:
        //     return{};
        // case type.MSG_READ:
        //     return {};
        default:
            return state;
    }
}



function msgList(msgs){
    return {type:type.MSG_LIST,payload:msgs}
}
//刚进入界面时
export function getMsgList(){
    return dispatch =>{
        axios.get('/user/getmsglist')
        .then(res=>{
            if(res.state==200&&res.data.code==0){
                // console.log(res.data)
                dispatch(msgList(res.data.msgs))
            }
        })
    }
}