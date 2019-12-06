//用户编写的部分
define(["Route","sale/index","sale/add"],function(Route,saleIndex,saleAdd){
    var router=new Route({
        routes:[
            { path:"/sale/index",component: saleIndex },
            { path:"/sale/add",component: saleAdd },
        ],
    });

    return router;

})