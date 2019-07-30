const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
//数据库结构
const UserSchema = new Schema({
    'user':{'type':String, 'require':true},
    'psw':{'type':String, 'require':true},
    'type':{'type':String, 'require':true},
    //头像
    'avatar':{'type':String},
    // 个人简介或者职位简介
    'desc':{'type':String},
    // 职位名
    'title':{'type':String},
    // 如果你是boss 还有两个字段
    'company':{'type':String},
    'money':{'type':String}
}  //password
)

module.exports = User = mongoose.model('users',UserSchema);