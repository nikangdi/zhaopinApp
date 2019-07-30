import React from 'react'
import {List,InputItem} from 'antd-mobile'
import {connect} from 'react-redux'
//前端部分socket.io
import io from 'socket.io-client'
import {getMsgList} from '../../redux/chat.redux'
const socket = io('ws://localhost:9093')//此时链接是跨域的,所以需要手动连接一下


@connect(
    state=>state,
    {getMsgList}
)
class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state={
                text:'',//要发送的信息
                msg:[],//存储消息列表
        }
    }
    handlerSubmit = ()=>{
        socket.emit('sendmsg',{text:this.state.text})
            // console.log(this.state)
            this.setState({text:''})
            
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
        this.props.getMsgList()
    }

    render(){
        return( 
            // <h2>chat with user:{this.props.match.params.user}</h2>  
            // //从 url中 获得  to的user
            <div>
                {/* 简单进行msg聊天数据列表的展示 */}
           {this.state.msg.map(v=>{  
               return<p key={v}>{v}</p>
           })}

            <div className="stick-footer">
                <List>
                    <InputItem 
                    placeholder="请输入"
                    value={this.state.text}
                    onChange={v=>{
                        this.setState({text:v})
                    }}
                    extra={<span onClick={()=>this.handlerSubmit()}>发送</span>}
                    ></InputItem>
                </List>
            </div>
            </div>
        )
    }
}

export default Chat;