/*
* @Author: mac
* @Date:   2019-08-01 15:30:59
* @Last Modified by:   mac
* @Last Modified time: 2019-08-02 19:25:12
*/
const express = require('express');
const UserModel = require('../models/user.js');

const hmac = require('../util/hmac.js')

const router = express.Router();

//注册
router.post('/register',(req,res)=>{
	//1.获取参数
	const { username,password } = req.body;
	//2.同名验证
	// console.log(username)
	UserModel.findOne({username:username})
	.then(user=>{
		//如果用户名存在
		if(user){
			res.json({
				status:10,
				message:"用户名已存在，请换一个"
			})
		}
		//如果用户名不存在
		else{
			//3.插入数据
			UserModel.insertMany({
				username:username,
				password:hmac(password),
			})
			.then(user=>{
				console.log(user);
				res.json({
					status:200,
					message:"注册成功",
					data:user
				})
			})
			.catch(err=>{
				res.json({
					status:400,
					message:"服务器出错了，请稍后再试"
				})
			})
		}
	})
	.catch(err=>{
		res.json({
			status:404,
			message:"服务器出错了，请稍后再试"
		})
	})
})

//登录
router.post('/login',(req,res)=>{
	// console.log(req.cookies)
	//1.获取参数
	const { username,password } = req.body;
	//2.同名验证
	// console.log(username)
	UserModel.findOne({username:username})
	.then(user=>{
		//如果用户名存在
		if(user){
			if(user.password == hmac(password)){
				//生成cookie并且返回前端
				// req.cookies.set('userInfo',JSON.stringify(user))
				//生成session
				req.session.userInfo = user
				res.json({
					status:200,
					message:"登录成功",
					data:user
				})
			}else{
				res.json({
					status:400,
					message:"密码错误请重新输入"
				})
			}
			
		}
		//如果用户名不存在
		else{
			res.json({
				status:10,
				message:"用户名不存在，请重新输入"
			})
		}
	})
	.catch(err=>{
		res.json({
			status:404,
			message:"服务器出错了，请稍后再试"
		})
	})
})

//退出
router.get('/logout',(req,res)=>{
	// req.cookies.set('userInfo',null);
	req.session.destroy()
	res.send({
		message:"退出登录成功"
	})
})


module.exports =  router;