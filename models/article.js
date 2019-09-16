/*
* @Author: mac
* @Date:   2019-07-31 09:25:53
* @Last Modified by:   mac
* @Last Modified time: 2019-08-07 14:26:17
*/
const mongoose = require('mongoose');
const moment = require('moment');

const pagination = require('../util/pagination.js');

const ArticleSchema = new mongoose.Schema({
  title:{
  	type:String,
  	required:[true,"文章标题必须输入"]
  },
  intro:{
  	type:String
  },
  content:{
  	type:String
  },
  user:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'user'
  },
  category:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'category'
  },
  createdAt:{
  	type:Date,
  	default:Date.now()
  },
  click:{
  	type:Number,
  	default:0
  }
});

ArticleSchema.virtual('createdTime').get(function(){
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
})

ArticleSchema.statics.getPaginationArticlesData = function(req,query={}){
    const options = {
        page:req.query.page,
        model:this,
        query:query,
        sort:{_id:-1},
        projection:"-__v",
        populates:[{path: 'user', select: 'username' },{path: 'category', select: 'name'}]
    }
    return pagination(options)
}

//2.根据Schema定义数据模型
//2.1model方法第一个参数指定集合名称,mongoose会默认转换为复数
//2.2model方法第二个参数指定Schema
const ArticleModel = mongoose.model('article', ArticleSchema);



module.exports = ArticleModel;