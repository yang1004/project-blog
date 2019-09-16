/*
* @Author: TomChen
* @Date:   2019-03-13 18:10:45
* @Last Modified by:   mac
* @Last Modified time: 2019-08-05 10:45:20
*/
;(function($){
	$('.del').on('click',function(){
		if(!window.confirm("您确认要删除吗？")){
			return false;
		}
	})
})(jQuery);