;(function(){
    function device(ua) {
        var os = this.os = {},browser = this.browser = {},
        webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        osx = !!ua.match(/\(Macintosh\; Intel /),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        touchpad = webos && ua.match(/TouchPad/),
        kindle = ua.match(/Kindle\/([\d.]+)/),
        silk = ua.match(/Silk\/([\d._]+)/),
        blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
        bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
        rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
        playbook = ua.match(/PlayBook/),
        uc = ua.match(/UCBrowser\/([\w.\s]+)/),
        chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        firefox = ua.match(/Firefox\/([\d.]+)/),
        ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
        orientation = Math.abs(window.orientation)

        if (browser.webkit = !!webkit) browser.version = webkit[1]

        if (android) os.android = true, os.version = android[2]
        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
        if (webos) os.webos = true, os.version = webos[2]
        if (touchpad) os.touchpad = true
        if (blackberry) os.blackberry = true, os.version = blackberry[2]
        if (bb10) os.bb10 = true, os.version = bb10[2]
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
        if (playbook) browser.playbook = true
        if (uc) os.uc = true, os.ucversion = uc[1]
        if (kindle) os.kindle = true, os.version = kindle[1]
        if (silk) browser.silk = true, browser.version = silk[1]
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
        if (orientation !== 90) os.protrait = true
        if (orientation === 90) os.landscape = true

        if (chrome) browser.chrome = true, browser.version = chrome[1]
        if (firefox) browser.firefox = true, browser.version = firefox[1]
        if (ie) browser.ie = true, browser.version = ie[1]
        if (safari && (osx || os.ios)) {browser.safari = true; if (osx) browser.version = safari[1]}
        if (webview) browser.webview = true

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
        (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
        os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
        (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
        (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
    }

    window.Device = new device(navigator.userAgent)

})();
;(function(){
	//  呼出 隐藏 侧边栏
	var wrapper = document.querySelector('.wrapper');
	var leftNav = document.querySelector('.main-nav');
	var moreBtn = document.querySelector('.more');
	var startX,startTime,moveX,isLeft,showNav;
	var oldClassName,newClassName;
	var touchStart = function(e){
	//	e.preventDefault();
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
		var isShowNav = leftNav.getAttribute('data-show');
		//var oldClassName,newClassName;
		if(isLeft!== undefined && !isLeft  && isShowNav === 'false'){
			// 不是左划 且 nav 不显示  呼出
			oldClassName = 'left-out';
			newClassName = 'left-in';
			leftNav.setAttribute('data-show','true');
		}else if(isLeft && isShowNav === 'true'){
		 //  左划 且 nav 已经显示  就隐藏
			// 隐藏
			oldClassName = 'left-in';
			newClassName = 'left-out';
			leftNav.setAttribute('data-show','false');
		}else if(e.target.className == 'more'){
			var isShowNav = leftNav.getAttribute('data-show');
			if(isShowNav==='true'){
				oldClassName = 'left-in';
				newClassName = 'left-out';
				leftNav.setAttribute('data-show','false');
			}else if(isShowNav==='false'){
				oldClassName = 'left-out';
				newClassName = 'left-in';
				leftNav.setAttribute('data-show','true');
			}else{
				return;
			}
		}else{
			return;
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
			replaceClass(videoPage,'hide-fade','show-fade');

		}
		var hideVideo = function(e){
			e.preventDefault();
			console.log("hide");
			replaceClass(videoPage,'show-fade','hide-fade');
			video.setAttribute('src','');
			video.style.display = 'none';
		}
		videoBtn.addEventListener('touchstart',showVideo,false);
		closeBtn.addEventListener('touchend',hideVideo,false);
	}
})();

//监听软键盘
;(function(){
	var oBody = document.querySelector('body');
	var formBox = document.querySelector('.form-box');
	if(formBox){
		var oglHeight = oBody.offsetHeight;
		var windowSizeChange = function(){
			var tempHeight = oBody.offsetHeight;
			if(tempHeight == oglHeight) {
	        //console.info("屏幕键盘隐藏");
					formBox.classList.remove('show-keyboard');
					// formBox.style.height = px2rem(oglHeight);
	    } else {
	        //console.info("键盘显示");
					formBox.classList.add('show-keyboard');
					// formBox.style.height = px2rem(tempHeight);
	    }
		};
		oBody.onresize = windowSizeChange;
	}
})();
// 表单验证
;(function(){
	//  所有元素不为空
	var formBox = document.querySelector('.form-box');
	if(formBox){
		var allInput = formBox.querySelectorAll('input');
		var textArea = formBox.querySelector('textarea');
		var errorInfo = document.querySelector('.error-info');
		var remainInfo = document.querySelector('.remain-info');
		var oBtn = formBox.querySelector('.button');
		var hasAllInput = false;  // 假设所有值并没有全部填写
		allInput = Array.prototype.slice.call(allInput);
		/*
			@p type dom元素对应的显示信息类型 errorInfo/remainInfo
			@p value string 显示的内容
			@p time number 多久之后消失
		 */

		var showInfo = function(type,value,time){
			if(timer) clearTimeout(timer);
			replaceClass(type,'hide-fade','show-fade');
			type.innerHTML = value;
			var timer = setTimeout(function(){
				replaceClass(type,'show-fade','hide-fade');
			},time);
		};

		var check= function(e){
		//	e.preventDefault();
			var target = e.target;
			switch (target.name) {
				case 'number':
						if(target.value.trim().length!==8){
							target.focus();
							showInfo(errorInfo,target.placeholder+'长度为8位，请检查是否有误。',2000);
						}
				break;
				case 'tel':
						if(target.value.trim().length!==11){
							target.focus();
							showInfo(errorInfo,target.placeholder+'长度为11位，请检查是否有误。',2000);
						}
				break;
			}
			var value = target.value.trim();
			target.style.backgroundColor = '#fbfbfb';
			if(value === ''){
				target.focus();
				var placeholder = target.placeholder;
				showInfo(errorInfo,'请填写'+placeholder,2000);
			}
		};

		// 检查值是否全部填写  改变btn样式
		var checkAllVal = function(){
			if(checkTimer) clearInterval(checkTimer);
			var checkTimer = setInterval(function(){
				for(var i = 0; i<allInput.length;i++){
					if(allInput[i].value.trim() == '' || textArea.value.trim()==''){
						hasAllInput = false;
						break;
					}else{
						hasAllInput = true;
					}
				}
				if(hasAllInput){
					oBtn.classList.add('checkok');
				}else if(oBtn.classList.toString().indexOf('checkok')>=0){
					oBtn.classList.remove('checkok');
				}
			},100)
		};
		// 当自我介绍被锁定的时候  开启检查所有值的定时器  不过早开
		textArea.addEventListener('focus',function(){
			checkAllVal();
		},false);

		// 轻除提交btn前 清除定时器
		oBtn.addEventListener('touchstart',function(e){
			if(!hasAllInput){
				console.log('无法提交');
				e.preventDefault();
				return showInfo(errorInfo,'信息填写不全',2000);
			}
			clearInterval(checkTimer);
		},false);

		//  解决 safari浏览器不支持 dataList
		var simInput = document.querySelectorAll('.sim-input');
		var remainDetail = function(e){
			e.preventDefault();
			var target = e.target;
			target.style.backgroundColor = '#fcf3e4';
			console.log('hello world');
			/*
				***********************************************
				*第三套方案  放弃input data-list
				***********************************************
			 */
			var oUlList = target.nextElementSibling;
			if(oUlList && oUlList.children.length){
				replaceClass(oUlList,'hide-fade','show-fade');
				var oInput = oUlList.nextElementSibling;
				oUlList.addEventListener('touchend',function(e){
					e.preventDefault();
					var value =  e.target.innerHTML;
					target.innerHTML = oInput.value = value;
					replaceClass(oUlList,'show-fade','hide-fade');
					return target.style.backgroundColor = '#fbfbfb';
				},false)
			}

			//if(Device.os.ios && Device.browser.safari) {
			// 	//console.log('我是ios safari')
			// 	/*
			// 		***********************************************
			// 			       我本将心向明月，奈何明月照沟渠。
			// 		***********************************************
			// 	 */
			// 	/*
			// 	***********************************************
			// 	*   方案一 使用ul模拟的data-list真机上显示不靠谱
			// 	***********************************************
			// 	 */
			// 	////ios safari 浏览器下 处理不兼容dataList
			// 	if(target.list){
			// 		var id = target.list.id;
			// 		var targetList = document.querySelector('#'+id);
			// 		var oUlList = targetList.nextElementSibling;
			// 		if(oUlList.children && oUlList.children.length){
			// 			//如果已经存在这个ul list
			// 			//隐藏 list
			// 			return replaceClass(oUlList,'hide-fade','show-fade');
			// 		}
			// 		var options = targetList.children;
			// 		var optionsArr = [].slice.call(options).map(function(item){
			// 			return item.value
			// 		});
			// 		replaceClass(oUlList,'hide-fade','show-fade');
			// 		// oUl.className = 'date-list show-fade';
			// 		var docFragment = document.createDocumentFragment();
			// 		for(var i = 0; i< optionsArr.length;i++){
			// 			var oLi = document.createElement('li');
			// 			// console.log(optionsArr[i])
			// 			oLi.innerHTML = optionsArr[i];
			// 			docFragment.appendChild(oLi);
			// 		}
			// 		// //添加到dom元素中去
			// 	  oUlList.appendChild(docFragment);
			// 		 /*********************************************************
			// 				 第一套方案	拼接字符串作为提示 不过太丑 设计应该不会接受
			// 		 **********************************************************/
			// 		// var optionsArr = [].slice.call(options).map(function(item){
			// 		// 	return item.value
			// 		// });
			// 		// var optionsHtml = optionsArr.reduce(function(x,y){
			// 		// 	return x+'<br/>'+y;
			// 		// });
			// 		// optionsHtml = '<br/>'+optionsHtml+'<br/>'
			// 		// console.log(optionsHtml);
			// 		// var infoValue = '请从'+optionsHtml+'这'+optionsArr.length+'个选项中选择';
			// 		// showInfo(remainInfo,infoValue,8000);
			// 		/**********************************************************/
			// }
			// }else{
			// 	console.log('其他')
			// 	return;
			// }

		};
		// 给所有的input 添加检查值的监听
		allInput.forEach(function(item,index){
			//  检查监听
			item.addEventListener('blur',check,false);
			item.addEventListener('focus',remainDetail,false);
		});
		[].slice.call(simInput).forEach(function(item){
			item.addEventListener('touchstart',remainDetail,false);
		})
  }
})();
