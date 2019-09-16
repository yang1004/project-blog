/*
* @Author: mac
* @Date:   2019-08-02 17:09:06
* @Last Modified by:   mac
* @Last Modified time: 2019-08-08 14:24:57
*/
const express = require('express');
const CommentModel = require('../models/comment.js');

const router = express.Router();

//权限验证
router.use((req,res,next)=>{
	if(req.userInfo._id){
		next()
	}else{
		res.send('<h1>请先登录账号</h1>')
	}
})

router.post('/add',(req,res)=>{
	const {content,article} = req.body;
	CommentModel.insertMany({
		content,
		article,
		user:req.userInfo._id
	})
	.then(comments=>{
		CommentModel.getPaginationCommentsData(req,{article:article})
		.then(data=>{
			res.json({
				status:0,
				message:"评论成功",
				data:data
			})
		})
		.catch(err=>{
			res.json({
				status:10,
				message:"评论失败，请稍后再试"
			})
		})
	})
	.catch(err=>{
		console.log(err)
		res.json({
			status:11,
			message:"评论失败，请稍后再试"
		})
	})
})

//处理评论的ajax
router.get('/list',(req,res)=>{
	const id = req.query.id
	const query = {}
    if(id){
        query.article = id
    }
	CommentModel.getPaginationCommentsData(req,query)
	.then(data=>{
		res.json({
			status:0,
			message:"获取评论数据成功",
			data:data
		})
	})
	.catch(err=>{
		res.json({
			status:1,
			message:"获取评论数据失败",
			err:err
		})
	})
})

//处理删除评论
router.get('/delete/:id',(req,res)=>{
	let id = req.params.id;
	CommentModel.deleteOne({_id:id})
	.then(article=>{
		res.render("admin/success",{
			message:"评论删除成功",
			url:"/admin/comments"
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"数据库操作失败",
			url:"/admin/comments"
		})
	})
})
module.exports =  router;