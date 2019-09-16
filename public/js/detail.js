/*
* @Author: TomChen
* @Date:   2019-03-13 18:10:45
* @Last Modified by:   mac
* @Last Modified time: 2019-08-08 10:56:42
*/
;(function($){
	$('.btn-sub-comment').on('click',function(){
		var val = $('#comment-content').val().trim();
		var $err = $('.err');
		if(!val){
			$err.html("评论内容不能为空");
			return false;
		}else if(val.length > 100){
			$err.html("评论内容最大长度为100个字符");
			return false;
		}else{
			$err.html("");
		}
		var id = $(this).data('id');
		$.ajax({
			url:"/comment/add",
			type:"post",
			dataType:"json",
			data:{
				content:val,
				article:id
			}
		})
		.done(function(result){
			$('#comment-content').val('')
			// console.log(result)
			if(status == 0){
				window.location.reload()
				$('#comment-page').trigger('get-data')
			}
		})
		.fail(function(err){
			alert('评论失败，请稍后再试')
		})
	})
})(jQuery);