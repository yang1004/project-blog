/*
* @Author: mac
* @Date:   2019-08-01 16:29:41
* @Last Modified by:   mac
* @Last Modified time: 2019-08-08 15:00:44
*/
(function($){
	var $register = $('#register');
	var $login = $('#login');

	//1.1从登陆面板到注册面板
	$('#go-register').on('click',function(){
		$login.hide();
		$register.show();
	})
	//1.2从注册面板到登录面板
	$('#go-login').on('click',function(){
		$register.hide();
		$login.show();
	})

	//用户名3-10位以字母开头,包含数字和下划线
	var usernameReg = /^[a-z][a-z0-9_]{2,9}$/i;
	//密码为3-6位任意字符
	var passwordReg = /^\w{3,6}$/;

	//2.注册
	$('#sub-register').on('click',function(){
		//2.1获取表单数据
		var username = $register.find('[name=username]').val();
		var password = $register.find('[name=password]').val();
		var repassword = $register.find('[name=repassword]').val();
		//2.2验证
		var errMsg = '';
		var $err = $register.find('.err');
		if(!usernameReg.test(username)){
			errMsg = '用户名3-10位以字母开头,包含数字和下划线'
		}
		else if(!passwordReg.test(password)){
			errMsg = '密码为3-6位任意字符'
		}
		else if(password !== repassword){
			errMsg = '两次密码不一致'
		}
		//验证不通过
		if(errMsg){
			$err.html(errMsg);
			return
		}
		//验证通过
		else{
			$err.html('');
			//2.3发送ajax请求
			$.ajax({
				url:"/user/register",
				type:"post",
				dateType:"json",
				data:{
					username:username,
					password:password
				}
			})
			.done(function(result){
				// console.log(result)
				if(result.status == 200){//成功
					$('#go-login').trigger('click');
				}else{//失败
					$err.html(errMsg);
				}
			})
			.fail(function(err){
				$err.html("请求失败，请稍后再试");
			})
		}
	})

	//3.登录
	$('#sub-login').on('click',function(){
		//2.1获取表单数据
		var username = $login.find('[name=username]').val();
		var password = $login.find('[name=password]').val();
		//2.2验证
		var errMsg = '';
		var $err = $login.find('.err');
		if(!usernameReg.test(username)){
			errMsg = '用户名3-10位以字母开头,包含数字和下划线'
		}
		else if(!passwordReg.test(password)){
			errMsg = '密码为3-6位任意字符'
		}
		//验证不通过
		if(errMsg){
			$err.html(errMsg);
			return
		}
		//验证通过
		else{
			$err.html('');
			//2.3发送ajax请求
			$.ajax({
				url:"/user/login",
				type:"post",
				dateType:"json",
				data:{
					username:username,
					password:password
				}
			})
			.done(function(result){
				// console.log(result)
				if(result.status == 200){//成功
					/*
					$login.hide();
					$('#user-info span').html(result.data.username);
					$('#user-info').show()
					*/
					window.location.reload()
				}else{//失败
					$err.html(result.message);
				}
			})
			.fail(function(err){
				$err.html("请求失败，请稍后再试");
			})
		}
	})

	//4.处理文章列表分页功能
	var $articlePage = $('#article-page');
	function buildArticleHtml(article){
		var html = '';
		article.forEach(function(value,index){
			var createdTime = moment(value.createdAt).format('YYYY-MM-DD HH:mm:ss')
			html += `
			  <div class="panel panel-default content-item">
			    <div class="panel-heading">
			      <h3 class="panel-title">
			        <a href="/detail/${value._id.toString()}" class="link" target="_blank">${value.title}</a>
			      </h3>
			    </div>
			    <div class="panel-body">
			      ${value.intro}
			    </div>
			    <div class="panel-footer">
			      <span class="glyphicon glyphicon-user"></span>
			      <span class="panel-footer-text text-muted">${value.user.username}</span>
			      <span class="glyphicon glyphicon-th-list"></span>
			      <span class="panel-footer-text text-muted">${value.category.name}</span>
			      <span class="glyphicon glyphicon-time"></span>
			      <span class="panel-footer-text text-muted">${createdTime}</span>
			      <span class="glyphicon glyphicon-eye-open"></span>
			      <span class="panel-footer-text text-muted"><em>${value.click}</em>已阅读</span>
			    </div>
			  </div>
			  `
		})
		

		return html;
	}
	function buildPaginationHtml(page,pages,list){
		var html = '';
		if(page == 1){
			html += '<li class="disabled">'
		}else{
			html += '<li>'
		}
		html += `
			<a href="javascript:;" aria-label="Previous">
		       <span aria-hidden="true">&laquo;</span>
		    </a>
		</li>`
		list.forEach(function(i){
			if(page == i){
				html += '<li class="active">'
			}else{
				html += '<li>'
			}
			html += `<a href="javascript:;">`+i+`</a></li>`
		})
		if(page == list.length){
			html += '<li class="disabled">'
		}else{
			html += '<li>'
		}
		html += `
			<a href="javascript:;" aria-label="Next">
		       <span aria-hidden="true">&raquo;</span>
		    </a>
		</li>`
		return html;
	}
	$articlePage.on('get-data',function(ev,data){
		$('#article-wrap').html(buildArticleHtml(data.docs));
		//构建分页器html
		$pagination = $articlePage.find('.pagination')
		if(data.pages > 1){
			$pagination.html(buildPaginationHtml(data.page,data.pages,data.list))
		}else{
			$pagination.html('')
		}
	})
	$articlePage.pagination({
		url:"/articles/"
	})

	//5.处理评论的分页功能
	var $commentPage = $('#comment-page');
	function buildCommentHtml(comments){
		var html = '';
		comments.forEach(function(comment){
			var createdTime = moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')
			html += `<div class="panel panel-default">
				        <div class="panel-heading">${comment.user.username} 发表于 ${comment.createdTime}</div>
				        <div class="panel-body">
				          ${comment.content}
				        </div>
				      </div>`
		})
		return html
	}
	$commentPage.on('get-data',function(ev,data){
		$('#comment-wrap').html(buildCommentHtml(data.docs));
		//构建分页器html
		$pagination = $commentPage.find('.pagination')
		if(data.pages > 1){
			$pagination.html(buildPaginationHtml(data.page,data.pages,data.list))
		}else{
			$pagination.html('')
		}
	})
	$commentPage.pagination({
		url:"/comment/list"
	})
})($)