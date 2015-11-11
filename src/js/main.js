
;(function(){
	//  呼出 隐藏 侧边栏
	var wrapper = document.querySelector('.wrapper');
	var leftNav = document.querySelector('.main-nav');
	var moreBtn = document.querySelector('.more');
	var startX,startTime,moveX,isLeft,showNav;
	var touchStart = function(e){
		//e.preventDefault();
		if(e.target.className == 'more'){
			var isShowNav = leftNav.getAttribute('data-show');
			var oldClassName,newClassName;
			if(isShowNav=='true'){
				oldClassName = 'left-out';
				newClassName = 'left-in';
				leftNav.setAttribute('data-show','false');
			}else if(isShowNav=='false'){
				oldClassName = 'left-in';
				newClassName = 'left-out';
				leftNav.setAttribute('data-show','true');
			}
			replaceClass(leftNav,oldClassName,newClassName);
			replaceClass(wrapper,oldClassName,newClassName);
		}
		var touch = e.touches[0];
		startX = touch.pageX;
	};
	var touchMove = function(e){
		//e.preventDefault();
		var touch = e.touches[0];
		moveX = touch.pageX - startX;
		// 滑动 距离过短  认为是 点击 直接return掉
		if(Math.abs(moveX)<200){
			return
		}
		// 是否向左滑动
		isLeft = moveX > 0 ? false : true;
	}
	var touchEnd = function(e){
		//e.preventDefault();
		var isShowNav = Boolean(leftNav.getAttribute('data-show'));
		var oldClassName,newClassName;
		if(isLeft!== undefined && !isLeft  && isShowNav){
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
		}else {
			return
		}
		replaceClass(leftNav,oldClassName,newClassName);
		replaceClass(wrapper,oldClassName,newClassName);
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
		videoBtn.addEventListener('touchstart',showVideo,false);
		closeBtn.addEventListener('touchend',hideVideo,false);
	}
})();

//监听软键盘
;(function(){
	if(formBox){
		var oBody = document.querySelector('body');
		var formBox = document.querySelector('.form-box');
		var oglHeight = oBody.offsetHeight;
		var windowSizeChange = function(){
			var tempHeight = oBody.offsetHeight;
			if(tempHeight == oglHeight) {
	        // console.info("屏幕键盘隐藏");
					formBox.classList.remove('show-keyboard');
					// formBox.style.height = px2rem(oglHeight);
	    } else {
	        // console.info("键盘显示");
					formBox.classList.add('show-keyboard');
					// formBox.style.height = px2rem(tempHeight);
	    }
		}
		oBody.onresize = windowSizeChange;
	}
})();
