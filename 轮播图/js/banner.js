function throttle(func, wait) {
	let timer = null,
		result = null,
		previous = 0;
	return function anonymous(...args) {
		let context = this,
			now = new Date,
			spanTime = wait - (now - previous);
		if (spanTime <= 0) {
			result = func.call(context, ...args);
			clearTimeout(timer);
			timer = null;
			previous = now;
		} else if (!timer) {
			timer = setTimeout(() => {
				result = func.call(context, ...args);
				timer = null;
				previous = new Date;
			}, spanTime);
		}
		return result;
	}
}

function debounce(func, wait, immediate) {
	let timer = null,
		result = null;
	return function anonymous(...args) {
		let context = this,
			now = immediate && !timer;
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			!immediate ? result = func.call(context, ...args) : null;
		}, wait);
		now ? result = func.call(context, ...args) : null;
		return result;
	}
}

let bannerModule = (function () {
	let $container = $('.container'),
		$wrapper = $container.find('.wrapper'),
		$pagination = $container.find('.pagination'),
		$slideList = null;

	let autoTimer = null,
		interval = 1000,
		speed = 300,
		activeIndex = 0,
		count = 0;

	//=>queryData：获取数据
	let queryData = function (callBack) {
		$.ajax({
			url: 'json/bannerData1.json',
			method: 'get',
			async: true,
			success: result => {
				callBack && callBack(result);
			}
		});
	};

	//=>bindHTML：数据绑定
	let bindHTML = function (data) {
		let str1 = ``,
			str2 = ``;
		data.forEach((item, index) => {
			str1 += `<div class="slide">
				<img src="${item.pic}" alt="">
			</div>`;

			str2 += `<span class="${index===0?'active':''}"></span>`;
		});
		$wrapper.html(str1);
		$pagination.html(str2);
		//=>获取结构内容
		$slideList = $wrapper.children('.slide');
	};

	//=>autoMove：自动轮播
	let change = function () {
		let $active = $slideList.eq(activeIndex),
			$siblings = $active.siblings();
		$active.css('transition', `opacity ${speed}ms`);
		$siblings.css('transition', `opacity 0ms`);
		$active.css('z-index', 1);
		$siblings.css('z-index', 0);
		$active.css('opacity', 1).on('transitionend', function () {
			$siblings.css('opacity', 0);
		});

		$pagination.children('span').each((index, item) => {
			let $item = $(item);
			if (index === activeIndex) {
				$item.addClass('active');
				return;
			}
			$item.removeClass('active');
		});
	};
	let autoMove = function () {
		activeIndex++;
		activeIndex >= count ? activeIndex = 0 : null;
		change();
	};

	return {
		init() {
			queryData(function anonymous(data) {
				bindHTML(data);
				count = data.length;
				autoTimer = setInterval(autoMove, interval);
			});
			$container.mouseenter(function () {
				clearInterval(autoTimer);
			}).mouseleave(function () {
				autoTimer = setInterval(autoMove, interval);
			}).click(function (ev) {
				//=>基于事件委托实现焦点和左右按钮点击
				let target = ev.target,
					$target = $(target);
				//=>事件源：焦点
				if (target.tagName === "SPAN" && $target.parent().hasClass('pagination')) {
					activeIndex = $target.index();
					change();
					return;
				}
				//=>事件源：前进后退按钮
				if (target.tagName === 'A') {
					if ($target.hasClass('button-prev')) {
						activeIndex--;
						activeIndex < 0 ? activeIndex = count - 1 : null;
						change();
						return;
					}
					if ($target.hasClass('button-next')) {
						autoMove();
						return;
					}
				}
			});
			//=>在真实项目中，如果要操作的元素是基于JS动态绑定的，那么“相关事件行为触发做些事情”的处理操作，我们尽可能基于事件委托来处理（事件委托可以给动态绑定的元素绑定事件）
		}
	}
})();
bannerModule.init();