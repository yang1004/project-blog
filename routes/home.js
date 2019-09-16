/*
* @Author: mac
* @Date:   2019-08-02 17:09:06
* @Last Modified by:   mac
* @Last Modified time: 2019-08-08 15:52:24
*/
const express = require('express');
const UserModel = require('../models/user.js');
const CommentModel = require('../models/comment.js');
const pagination = require('../util/pagination.js');
const hmac = require('../util/hmac.js');

const router = express.Router();

//权限验证
router.use((req,res,next)=>{
	if(req.userInfo._id){
		next()
	}else{
		res.send('<h1>请先登录账号</h1>')
	}
})

router.get('/',(req,res)=>{
	res.render('home/index',{
		userInfo:req.userInfo
	})
})

//显示后台评论列表
router.get('/comments',(req,res)=>{
	CommentModel.getPaginationCommentsData(req,{user:req.userInfo._id})
	.then(data=>{
		res.render('home/comment_list',{
			userInfo:req.userInfo,
            comments:data.docs,
            page:data.page,
            list:data.list,
            pages:data.pages,
            url:"/home/comments"
		})
	})
	.catch(err=>{
		console.log("err:::",err)
	})
})

//处理删除评论
router.get('/delete/:id',(req,res)=>{
	let id = req.params.id;
	CommentModel.deleteOne({_id:id})
	.then(article=>{
		res.render("home/success",{
			message:"评论删除成功",
			url:"/home/comments"
		})
	})
	.catch(err=>{
		res.render("home/err",{
			message:"数据库操作失败",
			url:"/home/comments"
		})
	})
})

//显示修改密码页面
router.get('/password',(req,res)=>{
	res.render('home/password',{
		userInfo:req.userInfo
	})
})

//处理修改密码
router.post('/password',(req,res)=>{
	let { password } = req.body;
	UserModel.updateOne({_id:req.userInfo._id},{password:hmac(password)})
	.then(result=>{
		//删除cookie
		req.session.destroy();
		res.render("home/success",{
			userInfo:req.userInfo,
			message:"修改密码成功，请重新登录",
			url:"/"
		})
	})
	.catch(err=>{
		res.render("home/err",{
            userInfo:req.userInfo,
            message:"修改密码失败",
            url:'/home/password'
        })
	})
})
module.exports =  router;