require.config({
    baseUrl:"js",
    paths:{
        //文件
        jquery:"lib/jquery-3.3.1",
        //文件夹
        service:"../service",
    }
})

require(["jquery","Router","sale/index"],function($,router,saleIndex){
   	//策略模式
   	let actions = {
   		"aside-saleman":function(){
   			console.log('aside-sale')
   			router.push({ path:"/sale/index"} )
   		},
   		"aside-car":function(){
   			alert('aside-car')
   			console.log('aside-car')
   		},
   		"aside-shop":function(){
   			alert('aside-shop')
   		}
   	}
   	//默认
    saleIndex()
   	router.push({ path:"/sale/index"} )

	//事件委托 绑定父即可
    $(".aside").click(function(e){
    	let className = e.target.className;
    	if(["aside-saleman","aside-car","aside-shop"].includes(className)){
    		actions[className]()
    	}
    })
        
    //默认展示第一个菜单栏的内容
    $(".aside .aside-item:eq(0)").trigger("click");
})