import axios from 'axios'
//前端部分socket.io
import io from 'socket.io-client'

const socket = io('ws://localhost:9093')//此时链接是跨域的,所以需要手动连接一下

const type = {
    MSG_LIST:'MSG_LIST',//刚进界面时获取聊天列表
    MSG_RECV:'MSG_RECV',//用户发送一条，读取全局广播回来的信息，即当条信息
    MSG_READ:'MSG_READ',//标识已读
}


const initState = {
    chatMsg:[], //消息列表,每条数据不只是内容，还有其他信息  from 为userid的和 to 为 userid的
    users:{},//所有的 用户信息
    unread:0,//未读的条数

}

export  function chat(state=initState,action){
    switch(action.type){
        case type.MSG_LIST:
            return{...state,
                chatMsg:action.payload.msgs,
                users:action.payload.users,

                //过滤  v.to == userid，就是to=我，就是别人发给我
                //统计别人发给我的这部分未读信息数
                //userid  需从action中 传过来，而不能直接从state中获取，否则会增加不确定性，违背reducer原则
                //下面action中利用了 getState（）来获取
                unread:action.payload.msgs.filter(v=>!v.read&&v.to==action.payload.userid).length}; //********* */如果用大括号就要在其中return
        case type.MSG_RECV:
            return{...state,
                chatMsg:[...state.chatMsg,action.payload],
                //这条信息中  userid即我   作为to时，才会增加未读信息数
                unread:action.payload.to==action.userid?state.unread+1:state.unread};//每次操作维护未读信息


        case type.MSG_READ:
            const {from,num} = action.payload;
            return {...state,chatMsg:state.chatMsg.map(v=>({...v,read:from==v.from?true:v.read})),unread:state.unread-num};
        default:
            return state;
    }
}




function msgList(msgs,users,userid){
    return {type:type.MSG_LIST,payload:{msgs,users,userid}}
}
//刚进入界面时获取聊天信息列表
export function getMsgList(){
    return (dispatch,getState) =>{    //*** */新知识点，getState参数用于获取redux中的全部state  //getState获取的整个state中的，不仅限于当前chat store
        axios.get('/user/getmsglist')
        .then(res=>{
            if(res.status==200&&res.data.code==0){
                // console.log(res.data)
                const userid = getState().user._id
                dispatch(msgList(res.data.msgs,res.data.users,userid))
                //msgs为 from=userid 或者 to=userid 的情况
            }
        })
    }
}




//这样会报错   返回不是一个异步action，没法处理异步
// export  function sendMsg({from,to,msg}){
//     socket.emit('sendmsg',{from,to,msg})
// }
//修正
export  function sendMsg({from,to,msg}){
    return dispatch =>{
        socket.emit('sendmsg',{from,to,msg})
    }
    
}

//用户发送一条，读取全局广播回来的信息，即当条信息
export function recvMsg(){
    return (dispatch,getState) =>{
        
        socket.on('recvmsg',function(data){
            // console.log('recvmsg' ,data)
            //{read: false, content: "123", create_time: 1564581273646, _id: "5d419db0036d302d142d44d2", chatid: "5d3d863549c7c936a0679f70_5d3d863549c7c936a0679f70"
            const userid = getState().user._id
            dispatch(msgRecv(data,userid))
        })
    }
}
 function msgRecv(data,userid){
     return {userid,type:type.MSG_RECV,payload:data}
 }



 export function readMsg( from ) { //用 from  此处是要查找处理的是   谁给我发的消息
    return (dispatch ,getState)=>{  //getState  来获取已经登录的信息
            axios.post('/user/readmsg',{from})
            .then(res=>{
                const userid = getState().user._id;//getState获取的整个state中的，不仅限于当前chat store
                if(res.status==200&&res.data.code==0){
                    dispatch(msgRead({from,userid,num:res.data.num}))
                }
            })
    }
 }
 function msgRead ({from,userid,num}){  //num 后端修改了几条数据的状态，redux中的 unread 数据 需要进行减处理
    return{type:type.MSG_READ,payload:{from,userid,num}};
 }