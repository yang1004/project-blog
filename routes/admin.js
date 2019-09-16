/*
* @Author: mac
* @Date:   2019-08-02 17:09:06
* @Last Modified by:   mac
* @Last Modified time: 2019-08-08 14:55:37
*/
const express = require('express');
const UserModel = require('../models/user.js');
const CommentModel = require('../models/comment.js');
const pagination = require('../util/pagination.js');
const hmac = require('../util/hmac.js');

const router = express.Router();

//权限验证
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登录</h1>')
	}
})

router.get('/',(req,res)=>{
	res.render('admin/index',{
		userInfo:req.userInfo
	})
})

//显示用户列表
router.get('/users',(req,res)=>{
	const options = {
		page:req.query.page,
		model:UserModel,
		query:{},
		sort:{_id:-1},
		projection:"-password -__v",
	}
	pagination(options)
	.then(data=>{
		res.render('admin/user_list',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:"/admin/users"
		})
	})
})

//显示后台评论列表
router.get('/comments',(req,res)=>{
	CommentModel.getPaginationCommentsData(req)
	.then(data=>{
		res.render('admin/comment_list',{
			userInfo:req.userInfo,
            comments:data.docs,
            page:data.page,
            list:data.list,
            pages:data.pages,
            url:"/admin/comments"
		})
	})
	.catch(err=>{
		console.log("err:::",err)
	})
})

//显示修改密码页面
router.get('/password',(req,res)=>{
	res.render('admin/password',{
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
		res.render("admin/success",{
			userInfo:req.userInfo,
			message:"修改密码成功，请重新登录",
			url:"/"
		})
	})
	.catch(err=>{
		res.render("admin/err",{
            userInfo:req.userInfo,
            message:"修改密码失败",
            url:'/admin/password'
        })
	})
})
module.exports =  router;