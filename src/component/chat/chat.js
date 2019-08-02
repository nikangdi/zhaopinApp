import React from 'react'
import {List,InputItem,NavBar,Icon,Grid} from 'antd-mobile'
import {connect} from 'react-redux'
import {getChatId} from '.././../util'
import {getMsgList,sendMsg,recvMsg,readMsg} from '../../redux/chat.redux'

@connect(
    state=>state,
    {sendMsg,getMsgList,recvMsg,readMsg}
)
class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state={
                text:'',//要发送的信息
                msg:[],//存储消息列表
                showEmoji:false,
        }
    }
    handlerSubmit = ()=>{
        // socket.emit('sendmsg',{text:this.state.text})
            // console.log(this.state)
            //this.setState({text:''})
            const from  =  this.props.user._id;
            const to = this.props.match.params.user;
            // console.log(from,to)
            const msg  = this.state.text//?????
            this.props.sendMsg({from,to,msg})//发送的信息

            this.setState({
                text:'', 
            })
            // 

            
    }
    componentDidMount(){
        // const socket = io('ws://localhost:9093')
        // //此时链接是跨域的,所以需要手动连接一下
        // socket.on('recvmsg',(data)=>{  //接收从express广播到全局的信息

        //     //很重要
        //     //此处 若不用箭头函数，会找不到this.state.msg
        //     //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        //     console.log(data)
        //     this.setState({
        //         text:data.text,
        //         msg:[...this.state.msg,data.text]
        //     })
        // })

        //更加的获取时机是在  dashboard 组件中,但此组件中也要有，否则刷新就没有信息显示了
        if(!this.props.chat.chatMsg.length){  //判断条件，来降低压力，避免重复请求
        this.props.getMsgList() //获取聊天信息列表
        this.props.recvMsg();
        }
               
    }

    //手动派发一个resize事件解决表情包第一次只显示一行的问题
    fixCarousel(){
        setTimeout(function(){
            window.dispatchEvent(new Event('resize'))
        },0)
    }
    componentWillUnmount(){ //在unmount中处理的好处在于，如果mount时候就触发函数，当在页面中时有信息发来，并不能处理
        const to = this.props.match.params.user;//目标用户，即对方的id   此处用to的原因是，从当前页面考虑，我跟他聊天，
        this.props.readMsg(to)  //告诉后台与该用户的  消息 已读
        //  把他 发给我的消息  标记为已读  to=我
        // 我发给他的 不能标记 
    }

    render(){
        // console.log(this.props.chat.chatMsg)
        const userid = this.props.match.params.user;
        const Item = List.Item;
        const users = this.props.chat.users;

        const chatid = getChatId( this.props.user._id, userid )
        const chatMsgs = this.props.chat.chatMsg.filter(v=>v.chatid&&v.chatid==chatid); //从全部的聊天记录中  进行过滤  根据chatid
        // console.log(userid,users)

        //https://emojipedia.org 表情管理
        const emoji = '❤️ 😂 😍 😊 ❤️ 😂 😍 😊 ❤️ 😂 😍 😊 ❤️ 😂 😍 😊 ❤️ 😂 😍 😊 ❤️ 😂 😍 😊 ❤️ 😂 😍 😊 ❤️ 😂 😍 😊 ❤️ 😂 😍 😊 ❤️ 😂 😍 ❤️ 😂 😍 ❤️ 😂 😍 ❤️ 😂 😍 ❤️ 😂 😍 ❤️ 😂 😍 ❤️ 😂 😍 ❤️ 😂 😍 ❤️ 😂 😍 😊 ❤️ 😂 😍 😊 ❤️ 😂 😍 😊  '
                        .split(' ').filter(v=>v)//清除掉空的元素
                        .map(v=>({text:v}))

        //根据是否显示表情选择部分，动态设置底部的样式，防止阻挡部分信息
        const paddingBottomPx = this.state.showEmoji?204:44
        if(!users[userid]){
            return null;
        }
        return( 
            // <h2>chat with user:{this.props.match.params.user}</h2>  
            // //从 url中 获得  to的user
            
            <div 
            id='chat-page'
            style={{paddingBottom:paddingBottomPx,paddingTop:45}}//知识点   style中用变量来设置  样式
            >
                <NavBar 
                className='fixd-header1'
                mode='dark'
                icon={<Icon type="left"></Icon>}
                onLeftClick={()=>{
                    this.props.history.goBack()
                }}
                >{users[userid].name}</NavBar>

                {/* 简单进行msg聊天数据列表的展示 */}
           {chatMsgs.map(v=>{ 
               const avatar = require(`../img/${users[v.from].avatar}.png`) 
               return v.from==userid?(
                   <List key={v._id}>
                       <Item
                       thumb={avatar}
                       >{v.content}</Item>
                   </List>
                    
               ):(
                <List key={v._id} className='chat-me'>
                    <Item
                    extra={<img src={avatar} alt="头像"/>}
                    >{v.content}</Item>
                </List>
               )
           })}

            <div className="stick-footer">
                <List>
                    <InputItem 
                    placeholder="请输入"
                    value={this.state.text}
                    onChange={v=>{
                        this.setState({text:v})
                    }}
                    extra={
                        <div>
                            <span
                            style={{marginRight:15}}
                            onClick = {()=>{
                                //onClick中  有两个事件处理方法
                                this.setState({showEmoji:!this.state.showEmoji})
                                this.fixCarousel();
                            }}
                            >😊</span>
                            <span onClick={()=>this.handlerSubmit()}>发送</span>
                        </div>
                    }
                    ></InputItem>
                </List>

                { this.state.showEmoji?<Grid 
                columnNum={9}
                carouselMaxRow={4}
                data={emoji}
                isCarousel={true}
                onClick={el=>{
                    this.setState({
                        text:this.state.text  + el.text
                    })
                    // console.log(el)//输出点击的grid元素的data数据对象  {text: "😍"}
                }}
                />
                :null}
                
                {/* 有一些样式的bug，需要手动写样式修复 */}
            </div>
        </div>
        )
    }
}

export default Chat;