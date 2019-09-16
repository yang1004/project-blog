/*
* @Author: mac
* @Date:   2019-08-02 17:09:06
* @Last Modified by:   mac
* @Last Modified time: 2019-08-05 20:10:11
*/
const express = require('express');
const CategoryModel = require('../models/category.js');

const pagination = require('../util/pagination.js')

const router = express.Router();

//权限验证
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登录</h1>')
	}
})
//显示分类管理首页
router.get('/',(req,res)=>{
	const options = {
		page:req.query.page,
		model:CategoryModel,
		query:{},
		sort:{_id:-1},
		projection:"-password -__v",
	}
	pagination(options)
	.then(data=>{
		res.render('admin/category_list',{
			userInfo:req.userInfo,
            docs:data.docs,
            page:data.page,
            list:data.list,
            pages:data.pages,
            url:"/category"
		})
	})
})

//显示添加分类页面
router.get('/add',(req,res)=>{
	res.render("admin/category_add_edit",{
        userInfo:req.userInfo
    })
})

//处理添加分类
router.post('/add',(req,res)=>{
	let { name,order } = req.body;
	if(!order){
		order = 0;
	}
	CategoryModel.findOne({namne:name})
	.then(category=>{
		if(category){
			res.render("admin/err",{
				message:"分类已经存在",
				url:"/category"
			})
		}else{
			CategoryModel.insertMany({name:name,order:order})
			.then(categories=>{
				res.render("admin/success",{
					message:"分类添加成功"
				})
			})
			.catch(err=>{
				let message = "数据库操作失败";
				if(err.errors['name'].message){
					message = err.errors['name'].message;
				}
				res.render("admin/err",{
					message:message,
					url:"/category"
				})
			})
		}
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"数据库操作失败",
			url:"/category"
		})
	})
})

//显示编辑分类页面
router.get('/edit/:id',(req,res)=>{
	let id = req.params.id;
	CategoryModel.findById(id)
	.then(category=>{
		res.render("admin/category_add_edit",{
	        userInfo:req.userInfo,
	        category:category
	    })
	})
	.catch(err=>{
		console.log(err)
		res.json({
			status:404,
			message:"服务器出错了，请稍后再试"
		})
	})
})

//处理编辑分类
router.post('/edit',(req,res)=>{
	let { name,order,id } = req.body;
	if(!order){
		order = 0;
	}
	CategoryModel.findById(id)
	.then(category=>{
		if(category.name == name && category.order == order){
			res.render("admin/err",{
				message:"请更新后再提交"
			})
		}else{
			CategoryModel.findOne({name:name,_id:{$ne:id}})
			.then(category=>{
				if(category){
					res.render("admin/err",{
						message:"分类名称已经存在"
					})
				}else{
					CategoryModel.updateOne({_id:id},{name,order})
					.then(result=>{
						res.render("admin/success",{
							message:"分类编辑成功"
						})
					})
					.catch(err=>{
						res.render("admin/err",{
							message:"数据库操作失败"
						})
					})
				}
			})
		}
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"数据库操作失败",
			url:"/category"
		})
	})
})

//处理删除操作
router.get('/delete/:id',(req,res)=>{
	let id = req.params.id;
	CategoryModel.deleteOne({_id:id})
	.then(category=>{
		res.render("admin/success",{
			message:"分类删除成功",
			url:"/category"
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"数据库操作失败",
			url:"/category"
		})
	})
})


module.exports =  router;