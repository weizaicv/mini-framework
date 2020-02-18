let $loginBtn = $('#loginBtn'),
	$loginModal = $('#loginModal'),
	$loginCloseBtn = $('#loginCloseBtn'),
	$loginModalBack = $('#loginModalBack'),
	$window = $(window);
$loginBtn.click(function () {
	$loginModal.css("display", "block");
	$loginModalBack.css('display', 'block');
	$loginModal.css("opacity", 1);

	//=>实现居中
	$loginModal.css({
		left: ($window.outerWidth() - $loginModal.outerWidth()) / 2,
		top: ($window.outerHeight() - $loginModal.outerHeight()) / 2
	});
});
$loginCloseBtn.click(function () {
	$loginModal.css('opacity', 0).one('transitionend', function () {
		$loginModal.css('display', 'none');
		$loginModalBack.css('display', 'none');
	});
});

//=>实现拖拽
/* new Drag('#loginModal .modal-header', {
	element: $loginModal.get(0)
});
 */

/* let $modalHeade = $loginModal.find('.modal-header'),
	$document = $(document),
	$window = $(window);
//=>这样处理，当鼠标按下的时候，DOWN方法中的THIS是MODAL-HEAD，但是我们后期要操作整个盒子的样式，我们最好让THIS变为整个盒子（原生JS对象）
// $modalHeade.on('mousedown', down);
$modalHeade.on('mousedown', down.bind($loginModal.get(0)));

function down(ev) {
	let $this = $(this);
	this.startX = ev.pageX;
	this.startY = ev.pageY;
	this.startL = parseFloat($this.css('left'));
	this.startT = parseFloat($this.css('top'));
	this._move = move.bind(this);
	this._up = up.bind(this);
	$document.on('mousemove', this._move);
	$document.on('mouseup', this._up);
}

function move(ev) {
	let $this = $(this),
		curL = ev.pageX - this.startX + this.startL,
		curT = ev.pageY - this.startY + this.startT;
	let minL = 0,
		minT = 0,
		maxL = $window.outerWidth() - $this.outerWidth(),
		maxT = $window.outerHeight() - $this.outerHeight();
	curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
	curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
	$this.css({
		top: curT,
		left: curL
	});
}

function up(ev) {
	$document.off('mousemove', this._move);
	$document.off('mouseup', this._up);
} */

/* 
 * 给元素设置自定义属性
 *   1.给内存空间中设置一个属性
 *     box.myIndex=1;
 *     $box.myIndex=1;
 * 
 *   2.把自定义属性设置在元素的行内属性上（设置的属性值最后都要变为字符串）
 *     =>我们在案例中，数据绑定阶段，把一些值存储到元素的行内上，以后要获取的时候只能基于attr/getAttribute获取
 *     box.setAttribute('myIndex',1);
 *     $box.attr('myIndex',1);
 */