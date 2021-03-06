const express = require('express');
const mongoose = require('mongoose');
const logger = require("morgan");
//引入数据库schema Chat
const Chat =require('./models/Chat') 
const app = express();


//socket.io work with express
const server = require('http').Server(app)
const io = require('socket.io')(server);
    io.on('connection',function(socket){
        //io是一个全局的连接， socket形参为 但前连接的连接
        console.log( 'user is connected')
        socket.on('sendmsg',function(data){
            // console.log(data)
            const {from,to,msg} = data; 
            //将 前端传过来的聊天信息处理一下存到数据库中
            const chatid = [from,to].sort().join('_');
            Chat.create({chatid,from,to,content:msg},function(err,doc){//存储成功后
                if(!err)
               {//接收到data并广播到全局
                // console.log(doc._doc)
                io.emit('recvmsg',Object.assign({},doc._doc))}
            })
            
        })
    })



//session
const session = require("express-session")
//cookie-parser --- 利用 -parser读取cookie
//cookie parser中间件  
// 从1.5.0版开始， 不再需要使用cookie-parser中间件来使该模块工作。


//中间件引入
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


//配置session
app.use(session({
    secret: '12345',
    cookie: {maxAge: 1000*60*60*24 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}))
//cookie的设置对象。默认值为 { path: '/', httpOnly: true, secure: false, maxAge: null }
//secret 这是用于签署会话ID cookie的秘密。这可以是单个秘密的字符串，也可以是多个秘密的数组。如果提供了一个秘密数组，则只有第一个元素用于签署会话ID cookie，而在验证请求中的签名时将考虑所有元素。


//routes路由文件导入
const user = require('./routes/api/user')


// 链接mongo 并且使用kangdi这个集合
const DB_URL = 'mongodb://127.0.0.1:27017/kangdi-chat'
mongoose.connect(DB_URL)
.then(()=>{
    console.log('MongoDB connected!')
})
.catch((err)=>{
    console.log(err)
})


//后台日志生成相关
//dev状态码带有色彩的日志输出
app.use(logger('dev'));


//中间件配置
// bodyParser配置
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//cookieParser配置
app.use(cookieParser())


//路由配置
// app.get('/api/test',(req,res)=>{
//     res.send('this is express server api test')
// })
app.use('/user',user)


//express 与 socket.io关联后  监听server
// app.listen(9093,function(){
//     console.log('Node app start at port 9093')
// })
server.listen(9093,function(){
    console.log('Node app start at port 9093')
})

