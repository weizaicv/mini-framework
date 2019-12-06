//Route作者编写的部分
define([],function(){
    function Route(option){
        this.routes=option.routes;
        this.init();
    }
    Route.prototype={
        constructor:Route,
        //初始化
        init(){
            window.addEventListener("hashchange",()=>{
                var hash=location.hash.substring(1);
                console.log('hash',hash)
                this.push({path:hash})
            })
        },

        push({path}){
            console.log('diaoyong push')
            var route=this.routes.find(item=>{
                return item.path === path
            });
            console.log('push',route)
            if(route){
                route.component();
            }
        }
    }

    return Route;

})