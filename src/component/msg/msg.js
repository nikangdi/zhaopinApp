import React from 'react'
import {List,Badge} from 'antd-mobile'
import {connect} from 'react-redux'
import { get } from 'browser-cookies';




@connect(
    state=>state
)
class Msg extends React.Component{
    getLastOfArray(arr){
        return arr[arr.length-1]
    }
    render(){
        const Item = List.Item;
        const Brief = Item.Brief;
        // console.log(this.props)
        const userid = this.props.user._id;
        const usersInfo = this.props.chat.users;
        // console.log(usersInfo)

        

        //按照聊天用户    分组，根据chatid
        //跟所有用户的聊天
        const msgGroup = {};   //数据结构 { userid_user2 : [{每条信息},23,4];  userid_user3 : []}
        this.props.chat.chatMsg.forEach(item => {
            msgGroup[item.chatid] = msgGroup[item.chatid] || [];
            msgGroup[item.chatid].push(item)
        });
        // console.log(msgGroup)
        // const chatList = Object.values(msgGroup);
        //得到一个二维数组[[{每条信息},23,4],   []]，即之前的msgGroup对象中每项的值


        //最新消息排序，最新消息的那个对象  放在最上面。
        const chatList = Object.values(msgGroup).sort((a,b)=>{   //排跟谁说话，即第一层数组
            const a_last = this.getLastOfArray(a).create_time;
            const b_last = this.getLastOfArray(b).create_time;
            return b_last-a_last;
        })

        return(
            <div>
              
                   {chatList.map(v=>{
                       const lastItem = this.getLastOfArray(v);//获取最后一条记录对象,
                       //******* */不一定是你发给我的,还是我发给你的 
                       //所以，需要拿到  登录用户的id  与记录对象中 from to两个id进行比较， 从而得出另一方是谁
                       const targetId = lastItem.from==userid ? lastItem.to : lastItem.from;
                       const name = usersInfo[targetId] && usersInfo[targetId].name;
                       const avatar = usersInfo[targetId] && usersInfo[targetId].avatar;
                       const unreadNum = v.filter(item=>!item.read && item.to==userid ).length;// 通过数组过滤出未读的信息数，！！！！同时过滤to为当前userid的信息记录对象
                       return(
                      <List key={lastItem._id}>
                       <Item 
                            extra={<Badge text={unreadNum}></Badge>}
                            thumb={require(`../img/${avatar}.png`)}
                            arrow="horizontal"
                            onClick={()=>{
                                this.props.history.push(`/chat/${targetId}`)
                            }}
                       > 
                           {lastItem.content}
                           <Brief>{name}</Brief>
                       </Item>
                       </List>
                   )})}
                   
               
            </div>
        )
    }
}

export default Msg;