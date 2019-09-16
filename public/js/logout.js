/*
* @Author: mac
* @Date:   2019-08-01 16:29:41
* @Last Modified by:   mac
* @Last Modified time: 2019-08-07 15:47:15
*/
(function($){
	//退出
	$('#logout').on('click',function(){
		$.ajax({
			url:"/user/logout"
		})
		.done(function(result){
			window.location.href = '/';
		})
		.fail(function(err){
			$('#user-info .err').html("服务器出错了，请稍后再试")
		})
	})
})($)