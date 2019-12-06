define(['jquery','service/serviceSale',"sale/add","require"],function($,serviceSale,saleAdd,require){
	return function(){
		let router = require("Router")
		let str = `<div>
				<p><button class="add">add</button></p>
				${serviceSale.list().map(item=>{
					return `<p><span>${item.name}|${item.age}</span></p>`
				}).join("")}
		</div>`;
		//这样确保生成的dom可以被绑定事件
		let $index = $(str);
		$index.on("click",".add",function(){
			//跳转页面
			console.log('clickindex',router)
			router.push({path:'/sale/add'})
		})
		$("#main .content").html($index);
	}
})