/*
* @Author: mac
* @Date:   2019-07-31 09:25:53
* @Last Modified by:   mac
* @Last Modified time: 2019-08-08 15:03:03
*/
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:{
  	type:String,
  	required:[true,"姓名必须输入"],
  	minlength:[3,"用户名最小长度为3位"],
  	maxlength:[10,"用户名最大长度为5位"]
  },
  password:{
  	type:String,
  },
  isAdmin:{
  	type:Boolean,
    default:false
  }
});



//2.根据Schema定义数据模型
//2.1model方法第一个参数指定集合名称,mongoose会默认转换为复数
//2.2model方法第二个参数指定Schema
const UserModel = mongoose.model('user', UserSchema);



module.exports = UserModel;