/*
 * 简易的拖拽插件
 *    new Drag([selector],[options]); 
 * SELECTOR
 *    按住谁来实现拖拽
 * OPTIONS = {}
 *    element：拖拽中要移动的元素（默认值：当前按住的元素）
 *    boundary：是否进行边界校验 （默认值：true，不能超过要移动元素所在容器的范围，需要开发者保证：当前移动的元素是相对于它所在容器定位的）   
 * 
 *    声明周期函数（钩子函数）
 *    dragstart：拖拽开始
 *    dragmove：拖拽中
 *    dragend：拖拽结束
 */
~ function () {
	/*
	 * 拖拽插件封装 
	 */
	class Drag {
		constructor(selector, options) {
			this.initParams(selector, options);
			this._selector.addEventListener('mousedown', this.down.bind(this));
		}
		//=>参数初始化（尽可能把一切信息都挂载到实例上，这样在其它方法中，只要能获取到实例，这些信息都可以调用 =>我们尽可能保证每个方法中的THIS都是实例）
		initParams(selector, options = {}) {
			this._selector = document.querySelector(selector);

			//=>配置项的默认值信息
			let defaultParams = {
				element: this._selector,
				boundary: true,
				dragstart: null,
				dragmove: null,
				dragend: null
			};
			defaultParams = Object.assign(defaultParams, options);

			//=>把配置项信息都挂载到实例上
			Drag.each(defaultParams, (value, key) => {
				this['_' + key] = value;
			});
		}
		//=>实现拖拽的效果
		down(ev) {
			let {
				_element
			} = this;
			this.startX = ev.pageX;
			this.startY = ev.pageY;
			this.startL = Drag.queryCss(_element, 'left');
			this.startT = Drag.queryCss(_element, 'top');
			this._move = this.move.bind(this);
			this._up = this.up.bind(this);
			document.addEventListener('mousemove', this._move);
			document.addEventListener('mouseup', this._up);
			//=>钩子函数处理
			this._dragstart && this._dragstart(this, ev);
		}
		move(ev) {
			let {
				_element,
				_boundary,
				startX,
				startY,
				startL,
				startT
			} = this;
			let curL = ev.pageX - startX + startL,
				curT = ev.pageY - startY + startT;
			if (_boundary) {
				//=>处理边界
				let parent = _element.parentNode,
					minL = 0,
					minT = 0,
					maxL = parent.offsetWidth - _element.offsetWidth,
					maxT = parent.offsetHeight - _element.offsetHeight;
				curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
				curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
			}
			_element.style.left = curL + 'px';
			_element.style.top = curT + 'px';

			//=>钩子函数处理
			this._dragmove && this._dragmove(this, curL, curT, ev);
		}
		up(ev) {
			console.log('up....')
			console.log(this._move)
			document.removeEventListener('mousemove', this._move);
			document.removeEventListener('mouseup', this._up);
			
			//=>钩子函数处理
			this._dragend && this._dragend(this, ev);
		}
		//=>设置工具类的方法（把它当做类[普通对象]的私有属性）
		static each(arr, callback) {
			if ('length' in arr) {
				//=>数组||类数组
				for (let i = 0; i < arr.length; i++) {
					callback && callback(arr[i], i);
				}
				return;
			}
			//=>普通对象
			for (let key in arr) {
				if (!arr.hasOwnProperty(key)) break;
				callback && callback(arr[key], key);
			}
		}
		static queryCss(curEle, attr) {
			return parseFloat(window.getComputedStyle(curEle)[attr]);
		}
	}
	window.Drag = Drag;
}();