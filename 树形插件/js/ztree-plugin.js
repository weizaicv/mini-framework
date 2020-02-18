~ function ($) {
	function ztree(data) {
		let count = 0,
			$this = $(this);

		//=>数据绑定
		let bindHTML = function (result) {
			let str = ``;
			result.forEach(item => {
				count++;
				let {
					name,
					open,
					children
				} = item;
				str += `<li>
					<a href="" class="title">${name}</a>
					${children?`<em class="icon ${open?'open':''}"></em>
					<ul class="level level${count}" 
						style="display:${open?'block':'none'}">
						${bindHTML(children)}
					</ul>`:``}
				</li>`;
				count--;
			});
			return str;
		};
		$this.html(bindHTML(data));

		//=>基于事件委托实现点击操作
		$this.click(function (ev) {
			let target = ev.target,
				$target = $(target),
				$next = $target.next('ul');
			if (target.tagName === 'EM') {
				$target.toggleClass('open');
				$next.stop().slideToggle(100);
			}
		});
	}

	$.fn.extend({
		ztree: ztree
	});
}(jQuery);