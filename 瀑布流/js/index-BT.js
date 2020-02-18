let flowModule = (function () {
	let _DATA = null,
		$columns = $('.card-columns'),
		$window = $(window),
		$imgBoxs = null;

	//=>queryData:从服务器获取数据
	function queryData() {
		$.ajax({
			url: 'json/data.json',
			method: 'GET',
			async: false,
			success: result => _DATA = result
		});
	}

	//=>bindHTML：实现数据绑定
	function bindHTML() {
		let str = ``;
		_DATA.forEach(item => {
			let {
				pic,
				title,
				width,
				height
			} = item;
			str += `<div class="card">
				<div class="myImgBox" imgW="${width}" imgH="${height}">
					<img class="card-img-top" src="" alt="" data-img="${pic}">
				</div>
				<div class="card-body">
					<p class="card-text">${title}</p>
				</div>
			</div>`;
		});
		//=>不是$columns.html(str),因为此方法会把之前的内容也覆盖掉
		$columns.append(str);
		//=>计算每一个IMG-BOX的高度：IMG-BOX的宽度/图片真实宽度*图片的高度
		$imgBoxs = $columns.find('.myImgBox');
		$imgBoxs.each((index, item) => {
			let $item = $(item);
			$item.css({
				height: $item.innerWidth() / $item.attr('imgW') * $item.attr('imgH')
			});
		});
	}

	//=>lazyImgs：实现图片延迟加载
	function lazyImgs() {
		let B = $window.outerHeight() + $window.scrollTop();
		$imgBoxs.filter("[isLoad!='TRUE']").each((index, item) => {
			let $item = $(item),
				$img = $item.children('img'),
				A = $item.offset().top + $item.outerHeight() / 2;
			if (A <= B) {
				//=>加载真实图片
				$item.attr('isLoad', 'TRUE');
				$img.attr('src', $img.attr('data-img')).on('load', () => {
					$img.stop().fadeIn(300);
				});
			}
		});
	}

	//=>loadMore：实现加载更多数据
	function loadMore() {
		//=>真实页面的高度 <= 一屏幕高度+卷去的高度+300
		//$(document).height() <=> document.documentElement.scrollHeight
		let pageH = $(document).height(),
			winH = $window.outerHeight(),
			scrollT = $window.scrollTop();
		if (pageH <= winH + scrollT + 300) {
			//=>加载更多数据
			queryData();
			bindHTML();
			setTimeout(lazyImgs, 500);
		}
	}

	return {
		init() {
			//=>首次加载页面
			queryData();
			bindHTML();
			setTimeout(lazyImgs, 500);
			//=>页面滚动期间，加载真实的图片和加载更多的数据
			window.onscroll = function () {
				lazyImgs();
				loadMore();
			}
		}
	}
})();
flowModule.init();