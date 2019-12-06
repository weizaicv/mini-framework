# 路由实现 AMD模块化

## 定义目录
/js		 一些类库	
/service 服务层：增删查改

## 入口
app.js
入口处定义全局依赖 jquery service
```js
require.config({
	//文件路径的前缀
    baseUrl:"js",
    paths:{
        //文件
        jquery:"lib/jquery-3.3.1",
        //文件夹
        service:"../service",
    }
})

```

## 路由
router.js 定义路由的实现
> 监听hashchange事件，通过location.hash获取路由数据
> location.hash截取合适的数据substring(1) 格式为/a/b这种 将#截取掉
> push函数实现路由的切换 从路由定义表route.js获取路由路径，路由执行

route.js 定义路由参数，类似vue-router的router.js
> 需要定义路由对象实例，并且传入配置 有path和component
> 这里component就是一个函数（里面可以实现对页面的渲染）

## 层层嵌套问题
场景：
add.js中调用router.js
router.js中调用add.js
产生了层层嵌套关系
解决：add.js中 调用require模块 手动调用require.js模块