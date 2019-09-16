/*
* @Author: mac
* @Date:   2019-08-04 17:22:35
* @Last Modified by:   mac
* @Last Modified time: 2019-08-07 16:12:01
*/
/*
options:
page:当前页码
module:要处理的数据模型
query:查询条件
sort:排序
projection:投影
populates[]
 */
async function pagination(options){
	/*
	分页分析:
	前提条件:得知道获取第几页,前端发送参数 page
	约定:每一页显示多少条数据,约定每页显示10条,limit = 10

	第一页 显示 第1,2,3,4,5,6,7,8,9,10		skip(0) 取10条 limit(10)
	第二页 显示 第11,12,13,14,15,16,17,18,19,20,跳过前面的  skip(10) 取10条 limit(10)
	第三页 显示 第21,22,23,24,25,26,27,28,29,30		skip(20) 取10条 limit(10)

	第page页 跳过 (page-1)*limit 条
	*/
	let {page,model,query,sort,projection,populates} = options;
	page = parseInt(page)
	const limit = 2;
	if(isNaN(page)){
		page = 1
	}
	//上一页边界值控制
	if(page == 0){
		page = 1;
	}
	const count = await model.countDocuments(query);
	//下一页边界值控制
	//总页数
	const pages = Math.ceil(count/limit)
	//下一页边界值控制
	if(page>pages){
		page = pages
	}
	let list = [];
	for(let i=0;i<pages;i++){
		list.push(i+1)
	}
 	let skip = (page-1)*limit;
 	if(skip < 0){
 		skip = 0
 	}

 	let result = model.find(query,projection)

 	//关联处理
 	if(populates){
 		populates.forEach(populate=>{
 			result = result.populate(populate);
 		})
 	}

 	const docs = await result.sort(sort).skip(skip).limit(limit)

	return {
		docs:docs,
		page:page,
		list:list,
		limit:limit,
		pages:pages
	}
}



module.exports = pagination;