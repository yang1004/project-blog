/*
* @Author: mac
* @Date:   2019-07-31 09:25:53
* @Last Modified by:   mac
* @Last Modified time: 2019-08-04 17:06:04
*/
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name:{
  	type:String,
  	required:[true,"分类必须输入"]
  },
  order:{
  	type:Number,
    default:0
  }
});



//2.根据Schema定义数据模型
//2.1model方法第一个参数指定集合名称,mongoose会默认转换为复数
//2.2model方法第二个参数指定Schema
const CategoryModel = mongoose.model('category', CategorySchema);



module.exports = CategoryModel;