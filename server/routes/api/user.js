const express = require('express');
//加密
const utils = require('utility');
//验证码
var svgCaptcha = require('svg-captcha');

const User = require('../../models/User.js')
const Chat = require('../../models/Chat.js')
const Router = express.Router();
const _filter = {'psw':0,'__v':0}

// Chat.remove({},function(e,d){})
/**
 * 聊天新界面相关
 */
//$route GET  user/getmsglist
//@desc 返回数据库中的数据
//@access public
Router.get('/getmsglist',function(req, res){
    const user = req.cookies.userid;
    // console.log(user)
    User.find({},function(err,userdoc){

        //查找全部用户信息，并且重新整合用户信息到一个对象中
        //  users = { _id: {name,avatar} }
        let users={};
        userdoc.forEach(item=>{
            users[item._id]={name:item.user,avatar:item.avatar}
        })
        //{'$or':[{from:user},{to:user}]}  //多条件查找
        Chat.find({'$or':[{from:user},{to:user}]},function(err,doc){
            if(!err){
                // console.log({code:0,msgs:doc,users:users})
                return res.json({code:0,msgs:doc,users:users})
            }
        })
    })
    
})


//$route POST  user/getmsglist
//@desc 返回数据库中的数据
//@access public
Router.post('/readmsg',function(req, res){
    /**
     * 前后端获取userid
     */
    //前端获取用户信息  从redux store中获取 this.props.user._id
    //后端获取用户信息  从cookie中获取req.cookies.userid
    const userid = req.cookies.userid;
    const from = req.body.from;
    console.log(from)

    Chat.update(  
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
})









//$route GET  user/list?type=boss     genius
//@desc 返回数据库中的数据
//@access public
Router.get('/list',function(req, res){
    // User.remove({},function(e,d){})
    const { type } = req.query;   //     req.query！！！！！！
    
	User.find({type},function(err,doc){
		return res.json({code:0,data:doc})
	})
})

//$route GET user/captcha
//@desc 返回请求的json数据
//@access public
Router.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create({
      ignoreChars: '0o1l',
      noise: 2,
      color: true
    });
    // console.log(captcha.text.toLowerCase()) //成功
    //************ */需要先在express服务器上加载  session   server.js中引入express-session 以及 cookie-parser
    //否则 req 上没有session
    req.session.captcha = captcha.text.toLowerCase();
    // console.log(req.session.captcha)
    // console.log(req.session); 
    res.type('svg');
    // console.log()
    //返回一个svg标签
    // console.log(res)
    res.send(captcha.data) //res返回svg格式验证码
  });

//$route GET  user/test
//@desc 返回请求的json数据
//@access public
Router.get("/test",(req,res)=>{
    res.json({msg:"login works"})
})

//$route POST user/update
//@desc 返回请求的json数据
//@access public
Router.post('/update',(req,res)=>{
    const userid = req.cookies.userid;  //从cookie中获取id
    if (!userid) {
		return json.dumps({code:1})
    }
    const body = req.body;
    User.findByIdAndUpdate(userid,body,function(err,doc){
        const data = Object.assign({},{
            user:doc.user,
			type:doc.type 
        },body)
        return res.json({code:0,data})
    })

})

//$route POST user/login
//@desc 返回请求的json数据
//@access public
Router.post("/login",(req,res)=>{
    const {user, psw } = req.body
    // console.log(user,psw)
    const captcha = req.body.captchaInput.toString().toLowerCase(); //获取表单输入的验证码 ,加一步tostring解决全时数字输入时报错的问题
    console.log(`验证码表单：${captcha},验证码session:${req.session.captcha}`)
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

//$route POST user/register
//@desc 返回请求的json数据
//@access public
Router.post("/register",(req,res)=>{
    // res.json({msg:"register works"})    
    const {user,psw,type} = req.body;//从req.body中解构出来
    // console.log(user,psw,type)
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

})

//$route GET  user/info
//@desc 返回请求的json数据
//@access public
Router.get("/info",(req,res)=>{
    // 用户有没有cookie
    const {userid} = req.cookies
	if (!userid) {
		return res.json({code:1})
    }
    User.findOne({_id:userid} ,_filter , function(err,userItem){
		if (err) {
			return res.json({code:1, msg:'后端出错了'})
		}
		if (userItem) {
			return res.json({code:0,data:userItem})
		}
	})
    
})

function md5Pwd(pwd){
    //加盐加密
	const salt = 'imooc_is_good_3957x8yza6!@#IUHJh~~'
	return utils.md5(utils.md5(pwd+salt))
}

module.exports = Router