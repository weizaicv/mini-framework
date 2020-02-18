/*window.onload =function () {
    // 1.1 获取需要的标签
    var lis = document.getElementById('tab-header').getElementsByTagName('li');
    var contents =  document.getElementById('tab-content').getElementsByClassName('dom');

    // 1.2 遍历
    for(var i=0; i<lis.length; i++){
        // 1.2.1 取出单个对象
        var li = lis[i];
        li.id = i;

        // 1.2.2 监听鼠标的移动事件
        li.onmousemove = function () {
            // 让所有的li的class都清除
            for(var j=0; j<lis.length; j++){
                lis[j].className = '';
                contents[j].style.display = 'none';
            }

            // 设置当前li的class
            this.className = 'selected';
            // 从contents数组中取出对应的标签
            contents[this.id].style.display = 'block';
        }

    }
};*/

var tab = new Tab();
tab.init();

