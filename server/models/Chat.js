const mongoose = require('mongoose');
const Schema = mongoose.Schema

//create Schema
//数据库结构
const ChatSchema = new Schema({
    'chatid':{'type':String,required:true},  //聊天双方的id
    'from':{'type':String,required:true},  //发送者
    'to':{'type':String,required:true},   //接受者
    'read':{'type':Boolean,default:false}, //是否已读
    'content':{'type':String,required:true,default:''}, //聊天内容
    'create_time':{'type':Number,default:new Date().getTime()}  //时间戳
})
module.exports =  Chat = mongoose.model('chats',ChatSchema);