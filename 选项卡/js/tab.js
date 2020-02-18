function Tab() {
    // 1. 属性
    this.lis = document.getElementById('tab-header').getElementsByTagName('li');
    this.contents =  document.getElementById('tab-content').getElementsByClassName('dom');
}

Tab.prototype = {
    constructor: Tab,
    init: function(){
        this.setIndex();
        this.bindEvent()
    },
    setIndex: function () {
        for(var i=0; i<this.lis.length; i++){
            this.lis[i].index = i;
        }
    },
    bindEvent: function () {
        var self = this;
        for(var i=0; i<this.lis.length; i++){
            this.lis[i].onmousemove = function () {
                // 让所有的li的class都清除
                for(var j=0; j<self.lis.length; j++){
                    self.lis[j].className = '';
                    self.contents[j].style.display = 'none';
                }

                // 设置当前li的class
                this.className = 'selected';
                // 从contents数组中取出对应的标签
                self.contents[this.index].style.display = 'block';
            }
        }
    }
};