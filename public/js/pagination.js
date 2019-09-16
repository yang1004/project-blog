/*
* @Author: TomChen
* @Date:   2019-03-13 18:10:45
* @Last Modified by:   mac
* @Last Modified time: 2019-08-08 10:44:14
*/
;(function($){
	$.fn.extend({
		pagination:function(options){
			var $elem = $(this);
			$elem.on('click','a',function(){
				var $this = $(this)
				//获取当前页，计算当前页码
				//1.获取当前页
				var currenPage = $elem.find('.active a').html();
				//2.根据当前页计算请求页码
				var page = 1;
				var labelText = $this.attr('aria-label');
				if(labelText == "Previous"){
					page = currenPage - 1;
				}else if(labelText == "Next"){
					page = currenPage*1 + 1;
				}else{
					page = $this.html();
				}
				//如果点击当前页则阻止
				if(page == currenPage){
					return false;
				}
				var url = options.url+"?page="+page;
				var id = $elem.data('id')
				if(id){
					url = url+"&id="+id
				}
				$.ajax({
					url:url,
					dataType:"json"
				})
				.done(function(result){
					if(result.status == 0){
						console.log(result.data)
						$elem.trigger('get-data',result.data)
					}else{
						alert("请求失败，请稍后再试!")
					}
				})
				.fail(function(err){
					alert("请求失败，请稍后再试")
				})
			})
		}
	})
})(jQuery);