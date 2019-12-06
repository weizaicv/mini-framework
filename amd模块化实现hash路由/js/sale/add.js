define(['jquery','service/serviceSale','require'],function($,serviceSale,require){
	return function(){
		let router = require("Router")
		let str = `
		<form>
		name:<input type="text" name="name"> 
		age:<input type="text" name="age">
		<button type="submit">add</button>
		</form>
		`;

		let $addstr = $(str)

		$("#main .content").html($addstr)

		$addstr.on('submit',function(e){
			e.preventDefault()
			let name = $("input[name=name]").val()
			let age = $("input[name=age]").val()
			serviceSale.add({name,age})
			console.log('add',router)
			router.push({path:'/sale/index'})
		})
	}
})