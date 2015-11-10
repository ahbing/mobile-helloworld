
;(function(){
	//  呼出 隐藏 侧边栏
	var wrapper = document.querySelector('.wrapper');
	var leftNav = document.querySelector('.main-nav');
	var startX,startTime,moveX,isLeft,showNav;
	var touchStart = function(e){
		//e.preventDefault();
		var touch = e.touches[0];
		startX = touch.pageX;
	};
	var touchMove = function(e){
		//e.preventDefault();
		var touch = e.touches[0];
		moveX = touch.pageX - startX;
		// 滑动 距离过短  认为是 点击 直接return掉
		if(Math.abs(moveX)<200){ return ;}
		// 是否向左滑动
		isLeft = moveX > 0 ? false : true;
	}

	var touchEnd = function(e){
		//e.preventDefault();
		var isShowNav = leftNav.getAttribute('data-show');
		var oldClassName,newClassName;

		if(isLeft!== undefined && !isLeft && isShowNav){
			// 不是左划 且 nav 不显示  呼出
			oldClassName = 'left-out';
			newClassName = 'left-in';
			leftNav.setAttribute('data-show','true');
		}else if(isLeft && isShowNav){
		 //  左划 且 nav 已经显示  就隐藏
			// 隐藏
			oldClassName = 'left-in';
			newClassName = 'left-out';
			leftNav.setAttribute('data-show','fasle');
		}
		if(e.target.className == 'more'){
			oldClassName = 'left-out';
			newClassName = 'left-in';
			leftNav.setAttribute('data-show','true');
		}
		replaceClass(leftNav,oldClassName,newClassName);
	}
	// wrapper 上增加监听
	wrapper.addEventListener('touchstart',touchStart,false);
	wrapper.addEventListener('touchmove',touchMove,false);
	wrapper.addEventListener('touchend',touchEnd,false);
})();

//视频
;(function(){
	var videoPage = document.querySelector('.video-page');
	if(videoPage){
		var videoBtn = document.querySelector('.see-video');
		var closeBtn = document.querySelector('.close-video-btn');
		var video = videoPage.querySelector('video');
		var hasViode = !!(document.createElement('video').canPlayType)
		if(!hasViode) return;
		var src = video.getAttribute('data-src');
		var showVideo = function(e){
			// 检测浏览器是否支持video
			e.preventDefault();
			//  显示播放页面
			video.style.display = 'block';
			video.setAttribute('src',src);
			console.log("show");
			replaceClass(videoPage,'hide-video-page','show-video-page');

		}
		var hideVideo = function(e){
			e.preventDefault();
			console.log("hide");
			replaceClass(videoPage,'show-video-page','hide-video-page');
			video.setAttribute('src','');
			video.style.display = 'none';
		}
		videoBtn.addEventListener('touchend',showVideo,false);
		closeBtn.addEventListener('touchend',hideVideo,false);
	}
})();

//监听软键盘
;(function(){
	var oBody = document.querySelector('body');
	var formBox = document.querySelector('.form-box');
	var oglHeight = oBody.offsetHeight;
	var windowSizeChange = function(){
		var tempHeight = document.querySelector('body').offsetHeight;
		console.log(oglHeight);
		console.log(tempHeight);
		if(tempHeight == oglHeight) {
        console.info("屏幕键盘隐藏");
				formBox.classList.remove('show-keyboard');
    } else {
        console.info("键盘显示");
				formBox.classList.add('show-keyboard');
    }
	}
	// oBody.addEventListener('resize',windowSizeChange,false);
	oBody.onresize = windowSizeChange;
})();
