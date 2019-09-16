/*
* @Author: mac
* @Date:   2019-08-02 17:09:06
* @Last Modified by:   mac
* @Last Modified time: 2019-08-07 09:42:44
*/
const express = require('express');

const multer = require('multer');
const upload = multer({dest:'public/uploads/'});
const ArticleModel = require('../models/article.js');
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
//显示文章管理首页
router.get('/', (req, res) => {
	/*
    let page = req.query.page
    const options = {
        page:req.query.page,
        model:ArticleModel,
        query:{},
        sort:{_id:-1},
        projection:"-__v",
        populates:[{path: 'user', select: 'username' },{path: 'category', select: 'name'}]
    }
    pagination(options)
    .then(data=>{
        res.render("admin/article_list",{
            userInfo:req.userInfo,
            articles:data.docs,
            page:data.page,
            list:data.list,
            pages:data.pages,
            url:"/article"
        })       
    })
    .catch(err=>{
       console.log('get articles err:',err) 
    })
    */
    ArticleModel.getPaginationArticlesData(req)
    .then(data=>{
        res.render("admin/article_list",{
            userInfo:req.userInfo,
            articles:data.docs,
            page:data.page,
            list:data.list,
            pages:data.pages,
            url:"/article"
        })       
    })
    .catch(err=>{
       console.log('get articles err:',err) 
    })
})

//显示添加文章页面
router.get('/add',(req,res)=>{
	CategoryModel.find({},"name")
	.sort({order:-1})
	.then(categories=>{
		res.render("admin/article_add_edit",{
	        userInfo:req.userInfo,
	        categories:categories
	    })
	})
})

//处理添加文章
router.post('/add',(req,res)=>{
	let { title,category,intro,content } = req.body;
	ArticleModel.insertMany({
		title,
		category,
		intro,
		content,
		user:req.userInfo._id
	})
	.then(categories=>{
		res.render("admin/success",{
			message:"文章添加成功",
			url:"/article"
		})
	})
	.catch(err=>{
		let message = "数据库操作失败";
		if(err.errors['name'].message){
			message = err.errors['name'].message;
		}
		res.render("admin/err",{
			message:message,
			url:"/article"
		})
	})
})

//处理文章上传图片
router.post('/uploadImage',upload.single('upload'),(req,res)=>{
	const uploadedFilePath = "/uploads/"+req.file.filename;
	res.json({
		uploaded:true,
		url:uploadedFilePath
	})


})

//显示编辑文章页面
router.get('/edit/:id',(req,res)=>{
	let id = req.params.id;
	CategoryModel.find({},"name")
	.sort({order:-1})
	.then(categories=>{
		ArticleModel.findById(id)
		.then(article=>{
			res.render("admin/article_add_edit",{
		        userInfo:req.userInfo,
		        article:article,
		        categories:categories
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
	let { id,title,category,intro,content } = req.body;
	ArticleModel.updateOne({_id:id},{title,category,intro,content})
	.then(result=>{
		res.render("admin/success",{
			message:"分类编辑成功"
		})
	})
	.catch(err=>{
		console.log(err)
		res.render("admin/err",{
			message:"数据库操作失败"
		})
	})
})

//处理删除操作
router.get('/delete/:id',(req,res)=>{
	let id = req.params.id;
	ArticleModel.deleteOne({_id:id})
	.then(article=>{
		res.render("admin/success",{
			message:"分类删除成功",
			url:"/article"
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"数据库操作失败",
			url:"/article"
		})
	})
})


module.exports =  router;