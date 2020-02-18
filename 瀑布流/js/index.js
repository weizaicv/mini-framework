/*
 * debounce:函数防抖
 *   @params
 *      func:要执行的函数
 *      wait:间隔等待时间
 *      immediate:在开始边界还是结束边界触发执行(TRUE=>在开始边界)
 *   @return
 *      可被调用的函数
 * by zhufengpeixun on 2019/08/21
 */
function debounce(func, wait, immediate) {
	let result = null,
		timeout = null;
	return function (...args) {
		let context = this,
			now = immediate && !timeout;
		clearTimeout(timeout); //=>重要：在设置新的定时器之前，我们要把之前设置的定时器都干掉，因为防抖的目的是等待时间内，只执行一次
		timeout = setTimeout(() => {
			timeout = null;
			if (!immediate) result = func.call(context, ...args);
		}, wait);
		if (now) result = func.call(context, ...args);
		return result;
	}
}

let flowModule = (function () {
	let $columns = $('.column'),
		_DATA = null;

	//=>queryData:基于AJAX从服务器获取数据
	let queryData = function () {
		$.ajax({
			url: 'json/data.json',
			method: 'GET',
			async: false,
			success: result => {
				_DATA = result;
			}
		});
	};

	//=>bindHTML:实现页面中的数据绑定
	let bindHTML = function () {
		//=>瀑布流实现的原理:每一次从_DATA中取出三条数据,按照三列由矮到高的顺序依次插入
		for (let i = 0; i < _DATA.length; i += 3) {
			//=>把数据按照图片由高到低排序
			let group = _DATA.slice(i, i + 3);
			if (i !== 0) {
				group.sort((A, B) => B.height - A.height);
			}

			//=>先按照高度排序（升序）
			$columns.sort((A, B) => {
				//=>A/B原生JS元素对象，想要使用JQ的方法，需要转换为JQ对象
				let $A = $(A),
					$B = $(B);
				return $A.outerHeight() - $B.outerHeight();
			}).each((index, column) => {
				//=>_DATA[i+index] 计算出要往每一列中插入的数据
				// let dataItem = _DATA[i + index];
				let dataItem = group[index];
				//=>没有数据，说明数据都已经处理完了，我们结束循环
				if (!dataItem) return false;
				let {
					pic,
					height,
					title,
					link
				} = dataItem;
				$(column).append(`<a class="item" href="${link}">
					<div class="imgBox" style="height:${height}px">
						<img src="" alt="" data-img="${pic}">
					</div>
					<p>${title}</p>
				</a>`);
			});
		}

		//=>实现图片延迟加载：数据绑定完，延迟1000MS加载真实的图片
		setTimeout(lazyImgs, 1000);
	};

	//=>lazyImgs:图片延迟加载
	let lazyImgs = function () {
		let $imgBoxs = $('.container .imgBox[isLoad!="true"]'),
			$window = $(window),
			B = $window.outerHeight() + $window.scrollTop();
		//=>循环每一个图片(图片盒子)，计算其底边距离BODY的偏移，从而验证出是否加载真实图片
		$imgBoxs.each((index, imgBox) => {
			let $imgBox = $(imgBox),
				$img = $imgBox.children('img'),
				A = $imgBox.outerHeight() + $imgBox.offset().top;
			// if ($imgBox.attr('isLoad') === "true") return;
			if (A <= B) {
				//=>加载真实图片
				$imgBox.attr('isLoad', 'true');
				$img.attr('src', $img.attr('data-img'));
				$img.on('load', () => {
					// $img.css('display', 'block');  //=>直接显示 
					$img.stop().fadeIn(); //=>基于JQ动画渐现显示
				});
			}
		});
	};

	//=>loadMore:加载更多数据
	let loadMore = function () {
		//=>滚动到底端（一屏幕高度+卷去的高度+500>=页面真实的高度），加载更多数据
		let $window = $(window),
			winH = $window.outerHeight(),
			scrollT = $window.scrollTop(),
			pageH = $(document).height();
		if (winH + scrollT + 500 >= pageH) {
			queryData();
			bindHTML();
		}
	};

	return {
		init: function () {
			queryData();
			bindHTML();

			//=>滚动条滚动处理一些事情
			window.onscroll = _.throttle(function () {
				//=>延迟加载图片
				lazyImgs();
				//=>加载更多数据
				loadMore();
			}, 50);
		}
	}
})();
flowModule.init();