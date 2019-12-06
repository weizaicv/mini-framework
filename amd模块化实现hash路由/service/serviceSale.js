define([],function(){
	//数据
	let list = [
		{name:'w1',age:20},
		{name:'w2',age:21},
		{name:'w3',age:22}
	]
	//数据的操作
	return {
		list(){
			return list;
		},
		add({name,age}){
			let data = {
				name:name,
				age:age
			}
			list.push(data)
		}
	}
})