/*
* @Author: mac
* @Date:   2019-07-31 09:25:53
* @Last Modified by:   mac
* @Last Modified time: 2019-08-08 09:01:16
*/
const mongoose = require('mongoose');
const moment = require('moment');

const pagination = require('../util/pagination.js');

const CommentSchema = new mongoose.Schema({
  content:{
  	type:String,
  	required:[true,"评论内容必须输入"]
  },
  user:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'user'
  },
  article:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'article'
  },
  createdAt:{
  	type:Date,
  	default:Date.now()
  }
});

CommentSchema.virtual('createdTime').get(function(){
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
})

CommentSchema.statics.getPaginationCommentsData = function(req,query={}){
    let page = req.query.page;
    const options = {
        page:req.query.page,
        model:this,
        query:query,
        sort:{_id:-1},
        projection:"-__v",
        populates:[{path: 'user', select: 'username' },{path: 'article', select: 'title'}]
    }
    return pagination(options)
}

//2.根据Schema定义数据模型
//2.1model方法第一个参数指定集合名称,mongoose会默认转换为复数
//2.2model方法第二个参数指定Schema
const CommentModel = mongoose.model('comment', CommentSchema);



module.exports = CommentModel;