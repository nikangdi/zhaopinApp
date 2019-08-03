**本项目需要本地安装MongoDB**
**招聘app**
**技术栈React+Redux+React-Router+Antd-mobile+axios+express+socket.io+mongoDB**
**项目依赖**
**后端**
Yarn add mongoose
Yarn add express
Yarn add nodemon
Yarn add body-parser
Yarn add cookie-parser
yarn add morgan //后台日志生成相关
Yarn add utility
Yarn add svg-captcha   //验证码
Yarn add express-session
Yarn add socket.io
**前端**
Yarn add axios
Yarn add cross-env
yarn add antd-mobile@next  //安装最新版本  
// eject后只需正常package中配置babel>plugins babel-plugin-import ,关闭终端并重新启动项目
yarn add  babel-plugin-import
yarn add redux  redux-thunk  react-router-dom react-redux
Yarn add redux-devtools-extension   //版本问题,可能会存在问题
//修饰器相关
cnpm i --save-dev babel-plugin-transform-decorators-legacy
npm install --save-dev   @babel/plugin-proposal-decorators
npm install --save-dev   @babel/plugin-proposal-class-properties   // 修饰器 放在其他的前面f

Npm i --save-dev prop-types
Npm u browser-cookies --save-dev
Yarn add socket.io-client 


**笔记：**
1 后端：nodejs（express）
1.1 mongoDB 
官网安装后，找到安装目录下的bin文件中，终端输入：
输入.\mongod -dpath
输入 .\mongo
获取到如下信息：
MongoDB shell version v4.0.10
connecting to: mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("42dba419-b8d6-418a-addd-73563ab24175") }
MongoDB server version: 4.0.10
至于数据库中表的名字只需要连接时给定，便可以自动创建集合
const DB_URL = 'mongodb://localhost:27017/imooc-chat'
// 链接mongo 并且使用kangdi这个集合
const DB_URL = 'mongodb://127.0.0.1:27017/kangdi-chat'
mongoose.connect(DB_URL)
.then(()=>{
    console.log('MongoDB connected!')
})
.catch((err)=>{
    console.log(err)
})

根路径下创建  models文件夹，下面是各个具体的 文档等
比如：models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//create Schema
//数据库结构
const UserSchema = new Schema({
    name: { type:String, required:true},  //name
    password:{ type:String,required:true}  //password
})
module.exports = User = mongoose.model('users',UserSchema);
MongoDB数据库查找即更新等
1)数据库操作findOne等中的第二个参数可进行返回的数据过滤，
const _filter = {'psw':0,'__v':0}   //过滤掉每条信息的 psw 及  __v
User.findOne(  {user,psw:md5Pwd(psw)},  _filter,  function(err,doc){ 
 if (!doc) {
			return res.json({code:1,msg:'用户名或者密码错误'})
	}
        res.cookie('userid', doc._id)
        // console.log('login success')
		return res.json({code:0,data:doc})    }
const {user,psw,type} = req.body;
User.findOne({user},function(err,userItem){
            if(userItem){
                return res.json({code:1,msg:'用户名重复！'})
            }
            const userModel = new User({user,type,psw:md5Pwd(psw)})
            userModel.save(function(err,d){
                if(err){
                    return res.json({code:1,msg:'后端出错了'})
                }
                const { user,type,_id} = d;
                // console.log('register success')
                res.cookie('userid',_id)
                return res.json({code:0,data:{user, type, _id}})
            })
        }
)
2)User.findByIdAndUpdate(userid,body,function(err,doc){
        const data = Object.assign({},{
            user:doc.user,
			type:doc.type 
        },body)
        return res.json({code:0,data})
})
3)User.find({type},function(err,doc){
		return res.json({code:0,data:doc})
})
//{'$or':[{from:user},{to:user}]}  //多条件查找
        Chat.find({'$or':[{from:user},{to:user}] },function(err,doc){
            if(!err){
                // console.log({code:0,msgs:doc,users:users})
                return res.json({code:0,msgs:doc,users:users})
            }
        })
4)Chat.update(  
        {from,to:userid},
        {'$set':{read:true}},
        {'multi':true},  // update默认只修改查到的第一条数据，加这个参数，则修改全局  
        function(err,doc){
        // console.log(doc)  //{ n: 6, nModified: 6, ok: 1 }
        if(!err){
            return res.json({code:0,num:doc.nModified})
        }
        return res.json({code:1,msg:'修改失败'})
})
1.2 密码加密utility
1）utility

//加密const utils = require('utility');
function md5Pwd(pwd){
    //加盐加密
	const salt = 'imooc_is_good_3957x8yza6!@#IUHJh~~'
	return utils.md5(utils.md5(pwd+salt))   //双层MD5加密
}
1.3 验证码svg-captcha
//验证码 var svgCaptcha = require('svg-captcha');
Router.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create({
      ignoreChars: '0o1l',
      noise: 2,
      color: true
    });
    // console.log(captcha.text.toLowerCase()) //成功
    //需要先在express服务器上加载  session   server.js中引入express-session 以及 cookie-parser
    //否则 req 上没有session
    req.session.captcha = captcha.text.toLowerCase();  //生成的captcha置于session中
    // console.log(req.session.captcha) 
    res.type('svg');
    //返回一个svg标签
res.send(captcha.data) //res返回svg格式验证码    是字符串 
//react 中 利用<div dangerouclySetInnerHTML={ __html:this.props.captchaData }
  });
Router.post("/login",(req,res)=>{
    const {user, psw } = req.body
    // console.log(user,psw)
const captcha = req.body.captchaInput.toString().toLowerCase(); 
//获取表单输入的验证码 ,加一步tostring解决全时数字输入时报错的问题
    // console.log(`验证码表单：${captcha},验证码session:${req.session.captcha}`)
    if(captcha !== req.session.captcha){ //验证码验证
        return res.status(400).send({code:1,msg:"验证码不正确！"})
      }
      //验证正确后从session中 删除 保存的验证码
    delete req.session.captcha;
	User.findOne({user,psw:md5Pwd(psw)},_filter,function(err,doc){
		if (!doc) {
			return res.json({code:1,msg:'用户名或者密码错误'})
		}
        res.cookie('userid', doc._id)
        // console.log('login success')
		return res.json({code:0,data:doc})
	})
})
1.4 express-session
//session
const session = require("express-session")
//cookie-parser --- 利用 -parser读取cookie
//cookie parser中间件  
// 从1.5.0版开始， 不再需要使用cookie-parser中间件来使该模块工作。
//配置session
app.use( session({
    secret: '12345',
    cookie: {maxAge: 1000*60*60*24 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}))
//cookie的设置对象。默认值为 { path: '/', httpOnly: true, secure: false, maxAge: null }
//secret 这是用于签署会话ID cookie的秘密。这可以是单个秘密的字符串，也可以是多个秘密的数组。如果提供了一个秘密数组，则只有第一个元素用于签署会话ID cookie，而在验证请求中的签名时将考虑所有元素。
1.5 cookie-parser 中间件
const cookieParser = require('cookie-parser'); //只需要引入即可使用
app.use(cookieParser())

res.cookie('userid', doc._id)  //userid置于cookie中，写
//后端获取用户信息  从cookie中获取req.cookies.userid
const userid = req.cookies.userid;               读
1.6 后端运行的日志morgan
const logger = require("morgan");
//后台日志生成相关
//dev状态码带有色彩的日志输出
app.use(logger('dev'));
1.7 socket.io 
const app = express();
//socket.io work with express
const server = require('http').Server(app)
const io = require('socket.io')(server);
    io.on('connection',function(socket){
        //io是一个全局的连接， socket形参为 但前连接的连接
        console.log( 'user is connected')
        socket.on('sendmsg',function(data){
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
并改为
server.listen(9093,function(){
    console.log('Node app start at port 9093')
})
2 前端
2.1 Babel-plugin-import配置
 "babel": {
    "presets": [
      "react-app"
    ],
    "plugins": [
      [
        "import",
        {
          "libraryName": "antd-mobile",
          "style": "css"
        }
      ],
     ]  },
2.2 Proxy跨域配置（两种）
"proxy":{    //报错，react-create-app 只支持 string，不支持object
    "/api": {  
        "target": "http://localhost:9093/api/",
        "ws": true,
        "changOrigin": true,
        "pathRewrite": {
            "^/api": ""
        }
}
"proxy": "http://localhost:9093"
搭配的axios 
axios.post('/user/login',{user,pwd})
最近（2019.6）create-react-app在"package.json"的"proxy"中不再支持写object只支持字符串了(可以简单写成 "proxy": "http://localhost:3001",)
2.3修饰器@ 配置
安装插件
cnpm i --save-dev babel-plugin-transform-decorators-legacy
npm install --save-dev   @babel/plugin-proposal-decorators
npm install --save-dev   @babel/plugin-proposal-class-properties

配置package.json
+++
"babel": {
    "presets": [
      "react-app"
    ],
    "plugins": [
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ],
      [
        "@babel/plugin-proposal-class-properties",
        {
          "loose": true
        }
      ]
    ]
  },
使用：
修饰器模式：我的理解----就是在函数外边套一层，包装一下这个函数，就是一个语法糖，本质就是一个函数。。。。
即 React HOC


@decorator   ，
class A {}
// 等同于
class A {}
A = decorator(A) || A;

顺序
@withRouter
@connect(
	null,
	{loadData}
)

2.3  withRouter方法是干嘛的，什么时候要用到？
高阶组件中的withRouter, 
作用是将一个组件包裹进Route里面, 然后react-router的三个对象history, location, match就会被放进这个组件的props属性中.

// withRouter实现原理: 
// 将组件包裹进 Route, 然后返回
// const withRouter = (Nav) => {
//     return () => {
//         return <Route component={Nav}  />
//     }
// }
// 这里是简化版
const withRouter = ( Component ) => () => <Route component={ Component }/>

首先withRouter可以用来给组件注入router相关的一些参数，比如：
```
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'// A simple component that shows the pathname of the current location
class ShowTheLocation extends React.Component { 
static propTypes = { 
   match: PropTypes.object.isRequired, 
   location: PropTypes.object.isRequired, 
   history: PropTypes.object.isRequired
 }
  render() {
    const { match, location, history } = this.props

   return (
     <div>You are now at {location.pathname}</div>
   )
 }
}
// Create a new component that is "connected" (to borrow redux// terminology) to the router.
const ShowTheLocationWithRouter = withRouter(ShowTheLocation)
```
其次withRouter是专门用来处理数据更新问题的。在使用一些redux的的`connect()`或者mobx的`inject()`的组件中，如果依赖于路由的更新要重新渲染，会出现路由更新了但是组件没有重新渲染的情况。这是因为redux和mobx的这些连接方法会修改组件的`shouldComponentUpdate`。
座椅在使用withRouter解决更新问题的时候，一定要保证withRouter在最外层，比如`withRouter(connect(Component))`
2.4在 某个组件（特定区域）展示 路由 Route中
文件一  index.js
ReactDOM.render(
        <Router />
, document.getElementById('root'));
文件二     router.js
render(){
        return(
            <BrowserRouter>
                <AuthRoute></AuthRoute>
                <App>
                    <Switch>
                        <Route path='/bossinfo' component={BossInfo}></Route>
                        <Route component={NotFound}></Route>
                    </Switch>          
                </App>
            </BrowserRouter>
        )
}
文件三 app.js
render(){
    return (
      <div>
          {this.props.children}
      </div>
    );
  }
这是一种常用的 架构控制的方案   ，比如：每个页面都有相同的侧边栏，则，需要在有半个区域进行显示路由，将路由加至  右侧区域组建中即可<Body><Route ...  /></Body>只要在Body组件中 进行样式控制，即可将组建显示到特定区域。
2.5 实现 vue路由卫士的功能，  登陆注册 之前的跳转
即上述代码中的<AuthRoute></AuthRoute>组件。
@withRouter
@connect(
 null,
 {loadData}
)
class AuthRoute extends React.Component{
   componentDidMount(){
        const publicList = ['/login','/register']
        const pathname = this.props.location.pathname
		if (publicList.indexOf(pathname)>-1) {
			return null
        }
        //如果是上述两个url中的任意一个，便不请求用户信息
        //如果不是上述两个，便可以请求获取用户信息
        axios.get('/user/info')
        .then(res=>{
                if(res.status == 200){
                    if(res.data.code == 0){
                        //有登录信息,加载用户信息
                        this.props.loadData(res.data.data) //将用户信息加载到redux store中
                    }else{
                        this.props.history.push('/login')
                    }
                }
            }
        )
        // 是否登录
		// 现在的url地址  login是不需要跳转的
		// 用户的type 身份是boss还是牛人
		// 用户是否完善信息（选择头像 个人简介）
        
    }
    render(){
        return null
    }
}
export default AuthRoute
2.6 登录注册 之后的跳转
确定  要跳转的 路径
export function getRedirectPath({type, avatar}){
	// 根据用户信息 返回跳转地址
	// user.type /boss /genius
	// user.avatar /bossinfo /geniusinfo 
	let url = (type==='boss')?'/boss': '/genius'
	if (!avatar) { //根据是否有avatar来判定是否有录入详细信息，没有则跳转到bossinfo等 相应的页面填写详细信息
		url += 'info'
    }else{
		url = '/user'+url
	}
    // console.log(url)
	return url
}
此方法来决定  要跳转的地址。
跳转的时候   通过Redirect 组件 来跳转，上述方法只是决定 要跳转的 路径
跳转  之前 要进行判断  是否 跳转向  当前页面。
{(this.props.redirectTo&&this.props.redirectTo != '/login')? <Redirect to={this.props.redirectTo} />: null}

2.7 HOC
//加了高阶组件后  使用的都是  高阶组件传过来的state与方法
//注意元组件优化时   将this.state改为this.props.state
// this.handleChange改为this.props.handleChange
export default function ChangeForm(Comp){
    return class WrapperComp extends React.Component{
        constructor(props){
            super(props);
            this.state={};
        }
        handleChange = (key,val) => {
            // console.log(key,val)
			this.setState({
				[key]:val
			})
        }
        render(){
            return<Comp handleChange={this.handleChange} state={this.state} {...this.props}></Comp>
        }
    }
}

2.8 三元运算符，短路运算符
{this.props.msg?<p className='error-msg'>{this.props.msg}</p>:<WhiteSpace />}
          {/* 根据后端返回的msg  和 前端正则等判定的 msg 结果来  判断并提示   redux中 */}
          {/* 从后端获取的变量在redux中，跟后端进行交互的操作在redux中   前端页面的交互（获取表单等）在页面组件中  页面中的变量在页面组件中*/}
         {/* 分为两部分数据：从页面中获取的数据；要显示在页面上的数据 */}
         {/* 要显示在页面上的数据在redux中，相关的操作同在 */}
         {/* 从页面中获取的数据 在 页面组件中 ，相关的操作同在*/}
2.9 属性 表达式
多个表单可以共用一个 handleChange
 handleChange=(key,val)=>{
             this.setState({
                 [key]:val
             })
             // console.log(this.state)
 }
2.10 react强制将  字符串 转为 html 标签
<span dangerouslySetInnerHTML={{ __html: this.props.captchaData }}  onClick={this.onCaptchaClick}></span>
2.11 事件处理函数相关

2.12  退出登录时，清空用户信息
1）browser-cookies前端获得cookie
退出登录时，清除掉cookie
browserCookie.erase('userid') //手动清除掉cookie
2）然后可以window.location.url = window.location.url 强制刷新页面
3）或者  手动清空 redux 中store 为 初始值，initstate 展开给其赋值
2.13 前端 socket.io-client
因为跨域，所以先io连接通，用ws协议；
后端接收到后 ‘connection’ 全局的连接 就连接通了。
import io from 'socket.io-client'
const socket = io( 'ws://localhost:9093' )//此时链接是跨域的,所以需要手动连接一下
后面就可以在 这个全局连接下 ，传递信息  socket.emit('sendmsg',{from,to,msg}) 向后端发送信息，后端接收到该条信息后，会向全局进行广播处理后的结果，便可以达到实时通信聊天
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
2.14 前后端  怎么获取 当前登录用户的信息
前端获取用户信息  从redux store中获取 this.props.user._id
后端获取用户信息  从cookie中获取req.cookies.userid
后端 cookie中存变量     res.cookie('userid', doc._id) 
后端cookie中取变量    req.cookies.userid
2.15表情
https://emojipedia.org/

2.16项目优化：
1）eslint代码规范校验
2）React16特有的错误处理机制
3）React性能优化







This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
