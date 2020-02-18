;(function(doc){
    var t = null,
    dt = null,
    pt = null;
    var MswVideo = function (dom, opt) {
        this.videoBox = doc.getElementById(dom);
        this.vid = this.videoBox.getElementsByClassName('video-tag')[0];
        this.oPlayBtn = this.videoBox.getElementsByClassName('play-img')[0];
        this.oCurrentTime = this.videoBox.getElementsByClassName('current-time')[0];
        this.oDuration = this.videoBox.getElementsByClassName('duration')[0];
        this.oRateArea = this.videoBox.getElementsByClassName('playrate-area')[0];
        this.oRateBtn = this.oRateArea.getElementsByClassName('playrate')[0];
        this.oRateList = this.oRateArea.getElementsByClassName('playrate-list')[0];
        this.oRateBtns = this.oRateList.getElementsByClassName('item');
        this.oVolumeArea = this.videoBox.getElementsByClassName('volume-area')[0];
        this.oVolumeBtn = this.oVolumeArea.getElementsByClassName('volume-img')[0];
        this.oVolumeBar = this.oVolumeArea.getElementsByClassName('volume-bar')[0];
        this.oVolumeSlideBar = this.oVolumeBar.getElementsByClassName('slide-bar')[0];
        this.oVolumeSlider = this.oVolumeBar.getElementsByClassName('volume-slide')[0];
        this.oVolumeRound = this.oVolumeSlider.getElementsByClassName('round')[0];
        this.oFullscreenBtn = this.videoBox.getElementsByClassName('fullscreen-img')[0];
        this.oVidHeader = this.videoBox.getElementsByClassName('vid-hd')[0];
        this.oControlBar = this.videoBox.getElementsByClassName('control-bar')[0];
        this.oProgressBar = this.videoBox.getElementsByClassName('progress-bar')[0];
        this.oPlayProgress = this.oProgressBar.getElementsByClassName('play-progress')[0];
        this.oPreloadProgress = this.oProgressBar.getElementsByClassName('preload-progress')[0];
        this.oPlayRound = this.oPlayProgress.getElementsByClassName('round')[0]; 
    
        this.oRateBtnsLen = this.oRateBtns.length;

        this.src = opt.src;
        this.autoplay = opt.autoplay || false;
        this.preload = this.autoplay ? false : (opt.preload || false);
        this.volume = opt.volume / 100 || 1;
        this.loop = opt.loop || false;
    
        this.muted = false;
        this.volumeBarShow = false;
        this.isFullScreen = false;


        this.init()
    } 

    MswVideo.prototype = {
        init:function(){
            this.setOptions()
            this.bindEvent()
            this.autoplay && addVideoTip(this.videoBox,'loading');
            //过5s隐藏
            var _self = this
            dt = setTimeout(function(){
                _self.setControlBar(true)
            },5000)
        },
        setOptions:function(){
            this.vid.src = this.src;
            this.vid.autoplay = this.autoplay;
            this.vid.preload = this.preload;
            this.vid.loop = this.loop;
        },
        bindEvent:function(){
            //video自带事件
            //结束|正在播放
            this.vid.addEventListener('canplay', this._canplay.bind(this), false);
            this.vid.addEventListener('playing', this._playing.bind(this), false);
            this.vid.addEventListener('waiting', this._waiting.bind(this), false);
            this.vid.addEventListener('error', this._error.bind(this), false);
            this.vid.addEventListener('ended', this._ended.bind(this), false);
            this.vid.addEventListener('loadstart', this._loadstart.bind(this), false);

            this.oPlayBtn.addEventListener('click', this.playVideo.bind(this), false);
            this.oRateBtn.addEventListener('click', this.showRateList.bind(this, true), false);
            this.oRateArea.addEventListener('mouseleave', this.showRateList.bind(this, false), false);
            //委托
            this.oRateList.addEventListener('click', this.setPlayRate.bind(this), false);
            this.oVolumeBtn.addEventListener('click', this.btnSetVolume.bind(this), false);
            this.oVolumeArea.addEventListener('mouseleave', this.showVolumeBar.bind(this,false), false);
            this.oVolumeRound.addEventListener('mousedown', this.slideVolumeBar.bind(this), false);
            this.oFullscreenBtn.addEventListener('click', this.setFullScreen.bind(this), false);
            this.videoBox.addEventListener('mousemove', this.showControlBar.bind(this), false);
            this.oProgressBar.addEventListener('click', this.progressClick.bind(this), false);
            this.oPlayRound.addEventListener('mousedown', this.progressChange.bind(this), false);
        },
        progressChange:function(e){
            var _mousemove = _mouseMove.bind(this),
                _mouseup = _mouseUp.bind(this);
            doc.addEventListener('mousemove',_mousemove,false);
            doc.addEventListener('mouseup',_mouseup,false);
            function _mouseMove(e){
                var e = e || window.event;
                this.setPlayProgress(e.pageX)
            }
            function _mouseUp(){
                doc.removeEventListener('mousemove',_mousemove,false);
                doc.removeEventListener('mouseup',_mouseup,false);
            }
        },
        progressClick:function(e){
            var e = e || window.event;
            this.setPlayProgress(e.pageX)
        },
        //设置进度条封装
        setPlayProgress:function(pageX){
            var duration = this.vid.duration,
                curProgressBarWidth = pageX - this.videoBox.offsetLeft,
                ratio = 0;
            if(curProgressBarWidth <= 0){
                ratio = 0
            }else if(curProgressBarWidth >= this.oProgressBar.offsetWidth){
                ratio = 1
            }else{
                ratio = curProgressBarWidth/this.oProgressBar.offsetWidth
            }
            this.vid.currentTime = ratio * duration;
            setTime(this.oCurrentTime,this.vid.currentTime)
            this.setVideoState(true)
            this.vid.play()
            this.oPlayProgress.style.width = ratio * 100 + '%'
        },
        showControlBar:function(){
            //鼠标移入过一会隐藏 防抖
            //先显示
            clearTimeout(dt)
            dt = null;
            this.setControlBar(false)
            var _self = this;

            dt = setTimeout(function () {
                _self.setControlBar(true);
              }, 5000);
        },
  	    setControlBar: function (hide) {
            if (hide) {
                this.oVidHeader.className += ' hide';
                this.oControlBar.className += ' hide';
            } else {
                this.oVidHeader.className = 'vid-hd';
                this.oControlBar.className = 'control-bar';
            }
        },
        setFullScreen:function(){
            //兼容不同浏览器
            if(!this.isFullScreen){
            	if (this.videoBox.requestFullscreen) {
                    this.videoBox.requestFullscreen();
                } else if (this.videoBox.mozRequestFullscreen) {
                    this.videoBox.mozRequestFullscreen();
                } else if (this.videoBox.msRequestFullscreen) {
                    this.videoBox.msRequestFullscreen();
                } else if (this.videoBox.oRequestFullscreen) {
                    this.videoBox.oRequestFullscreen();
                } else if (this.videoBox.webkitRequestFullscreen) {
                    this.videoBox.webkitRequestFullscreen();
                }
                this.isFullScreen = true
                this.oFullscreenBtn.src = 'img/fullscreen-exit.png';
            }else {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.mozExitFullscreen) {
                    doc.mozExitFullscreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                } else if (doc.oExitFullscreen) {
                    doc.oExitFullscreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                }
      
                this.isFullScreen = false;
                this.oFullscreenBtn.src = 'img/fullscreen.png';
            }
        },
        slideVolumeBar:function(e){
            //点击拖拽滑动
            var e = e || window.event,
                dy = e.pageY,
                my = 0,
                disY = 0,
                sHeight = 0,
                slideHeight = this.oVolumeSlider.offsetHeight,
                volumeBarHeight = this.oVolumeSlideBar.offsetHeight,
                _mousemove = _mouseMove.bind(this)
                _mouseup = _mouseUp.bind(this);
            
                doc.addEventListener('mousemove',_mousemove,false)
                doc.addEventListener('mouseup',_mouseup,false)

                function _mouseMove(e){
                    //移动的时候得出最新移动距离
                    //=之前的距离差 + 现在的距离
                    var  e = e || window.event;
                    my = e.pageY;
                    //鼠标第一次 - 第二次 距离
                    disY = dy - my;
                    sHeight = slideHeight +  disY
                    if(sHeight < volumeBarHeight && sHeight > 0){
                        this.oVolumeSlider.style.height = sHeight + 'px'
                    }else if(sHeight >= volumeBarHeight){
                        this.oVolumeSlider.style.height = volumeBarHeight + 'px'
                        sHeight = volumeBarHeight;
                    }else if(sHeight <= 0){
                        this.oVolumeSlider.style.height = '0';
                        sHeight = 0
                    }
                    this.volume = (sHeight/volumeBarHeight).toFixed(1);
                    //true的话会卡顿
                    this.setVolume(this.volume, false); 
                    //滑动底变0.5 this.volume
                    //这样记录了值
                    this.volume = Number(this.volume) == 0 ? 0.5 : this.volume;
                }
                function _mouseUp(){
                    doc.removeEventListener('mousemove',_mousemove,false)
                    doc.removeEventListener('mouseup',_mouseup,false)
                }

        },
        setVolume(volume, isChangeBar){
            this.vid.volume = volume;
            //再点击音量滑块的时候不要再次去
            //改变style.height不然会卡顿
            isChangeBar && (this.oVolumeSlider.style.height = (volume * 100) + '%');
        },
        playVideo:function(){
            if(this.vid.paused){
                this.oPlayBtn.src = 'img/pause.png';
                this.vid.play()
            }else{
                this.oPlayBtn.src = 'img/play.png';
                this.vid.pause()
            }
        },
        btnSetVolume:function(){
            //使用锁
            //1.显示音量框 没有禁音
            //2.显示音量框 有禁音  ->
            //3.没有音量框 没有禁音->显示音量框
            //3.没有音量框 有禁音  ->音量恢复0.5
            if(!this.muted && !this.volumeBarShow){
                this.showVolumeBar(true)
            }else if(!this.muted && this.volumeBarShow){
                this.setMuted(true)
                //设置true表示 slider跟着变化
                //但是slider move事件的是不不需要
                this.setVolume(0, true);
            }else{
                //设置静音后 音量滑块显示.5
                this.setMuted(false);
                this.setVolume(this.volume, true); 
            }
        },
        setMuted: function (muted) {
            if (muted) {
                this.vid.muted = true;
                this.muted = true;
                this.oVolumeBtn.src = 'img/volume-off.png';
            } else {
                this.vid.muted = false;
                this.muted = false;
                this.oVolumeBtn.src = 'img/volume.png';
            }
        },
        showVolumeBar:function(show){
            if(show){
                this.oVolumeBar.className += ' show';
                this.volumeBarShow = true;
            }else{
                this.oVolumeBar.className = ' volume-bar';
                this.volumeBarShow = false;
            }
        },
        setPlayRate:function(e){
            //点击的时候事件委托
            var e = e || window.event,
                tar = e.target || e.srcElement,
                className = tar.className,
                rateBtn;
            if(className === 'rate-btn'){
                //先初始化所有
                for(let i=0;i<this.oRateBtnsLen;i++){
                    //oRateBtns是class item
                    rateBtn = this.oRateBtns[i].getElementsByClassName('rate-btn')[0];
                    rateBtn.className = 'rate-btn';
                }
                this.vid.playbackRate = tar.getAttribute('data-rate');
                tar.className += ' current';
                this.showRateList(false);
            }
        },
        showRateList:function(show){
            console.log('show',show)
            if(show){
                this.oRateList.className += ' show'
            }else{
                this.oRateList.className = 'playrate-list'
            }
        },
        setVideoState:function(isPlaying){
            this.oPlayBtn.src = isPlaying ? 'img/pause.png' : 'img/play.png';
        },
        //播放结束
        _ended:function(){
            //加载完毕
            removeVideoTip(this.videoBox)
            addVideoTip(this.videoBox,'ended')
        },
        //当浏览器能够开始播放指定的音频/视频时
        //发生 canplay 事件。
        _canplay:function(){
            setTime(this.oDuration, this.vid.duration);
            removeVideoTip(this.videoBox);
            //设置preload bar
            var _self = this,
                duration = this.vid.duration,
                preloadProgress = 0,
                progressBarWidth = this.oProgressBar.offsetWidth;
            pt = setInterval(function () {
                preloadProgress = _self.vid.buffered.end(0);
            
                _self.oPreloadProgress.style.width = (_self.vid.buffered.end(0) / duration) * 100 + '%';
        
                if (_self.oPreloadProgress.offsetWidth >= progressBarWidth) {
                    clearInterval(pt);
                    pt = null;
                }
            }, 1000);
        },
        //视频加载等待。
        //当视频由于需要缓冲下一帧而停止，等待时触发
        _waiting:function(){
            addVideoTip(this.videoBox, 'loading');
        },
        //播放错误
        _error:function(){
            removeVideoTip(this.videoBox)
            addVideoTip(this.videoBox,'error')
            clearInterval(t);
            clearInterval(pt);
            t = null;
            pt = null;
        },
        // loadstart：视频查找。当浏览器开始寻找指定的
        // 音频/视频时触发，也就是当加载过程开始时
        _loadstart:function(){
            removeVideoTip(this.videoBox);
            addVideoTip(this.videoBox, 'loading');
        },
        _playing:function(){
            console.log('playing')
            //播放的时候手动要按钮切换
            this.setVideoState(true)
            removeVideoTip(this.videoBox);
            
            var _self = this,
                duration = this.vid.duration, //视频时间
                currentTime = 0,
                progressBarWidth = this.oProgressBar.offsetWidth;
            //定时器记录bar变化
            t = setInterval(function(){
                currentTime = _self.vid.currentTime
                setTime(_self.oCurrentTime, currentTime);
                _self.oPlayProgress.style.width = (currentTime / duration)*100 + '%'
                if(_self.oPlayProgress.offsetWidth >= progressBarWidth){
                    clearInterval(t);
                    t = null;
                }
            },1000)
        }
    }
    
    function setTime(dom, time){
        dom.innerText = timeFormat(time)
    }

    function timeFormat (second) {
        var h = parseInt(second / 3600),
            m = parseInt(parseInt(second % 3600) / 60),
            s = parseInt(parseInt(second % 3600) % 60),
            time = '';
    
        if (h == 0) {
            if (m >= 10) {
                if (s >= 10) {
                    time = '00:' + m + ':' + s;
                } else {
                    time = '00:' + m + ':0' + s;
                }
            } else {
                if (s >= 10) {
                    time = '00:0' + m + ':' + s;
                } else {
                    time = '00:0' + m + ':0' + s;
                }
            }
        } else {
            if (h < 10) {
                if (m >= 10) {
                    if (s >= 10) {
                        time = '0' + h + ':' + m + ':' + s;
                    } else {
                        time = '0' + h + ':' + m + ':0' + s;
                    }
                } else {
                    if (s >= 10) {
                        time = '0' + h + ':0' + m + ':' + s;
                    } else {
                        time = '0' + h + ':0' + m + ':0' + s;
                    }
                }
            } else {
                if (m >= 10) {
                    if(s >= 10) {
                time =  h + ':' + m + ':' + s;
                    } else {
                time =  h + ':' + m + ':0' + s;
                    }
                } else {
                    if(s >= 10) {
                time =  h + ':0' + m + ':' + s;
                    } else {
                time =  h + ':0' + m + ':0' + s;
                    }
                }
            }
        }
    
        return time;
      } 

    function removeVideoTip(dom){
        var oTip = doc.getElementsByClassName('video-tip')[0];
        oTip && dom.removeChild(oTip)
    }

    function addVideoTip(dom, type){
        var icon = '',
            text = '';
        switch (type) {
            case 'loading':
                icon = 'img/loading.gif';
                text = '加载中';
                break;
            case 'error':
                icon = 'img/error.png';
                text = '播放错误';
                break;
            case 'ended':
                icon = 'img/ended.png';
                text = '播放完成';
                break;
            default:
                break;
        }
        var oTip = doc.createElement('div')
        oTip.className = 'video-tip'
        oTip.innerHTML = '<img src ="' + icon + '" /><p>' + text + '</p>';
        dom.appendChild(oTip);
    } 

    window.MswVideo = MswVideo;

})(document)