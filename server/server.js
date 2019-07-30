const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require("morgan");
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

app.listen(9093,function(){
    console.log('Node app start at port 9093')
})

