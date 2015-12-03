var requestAnimationFrame = window.requestAnimationFrame||
  window.mozRequestAnimationFrame||
  window.webkitRequestAnimationFrame||
  window.msRequestAnimationFrame;
var cancelAniamtionFrame = window.cancelAniamtionFrame||  window.mozCancelAnimationFrame;
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


/******************************************************
  start intro
  2015-5-16 中国足球队 基本宣告 告别2018 世界杯
 ******************************************************/
;(function(){
  var technology = document.querySelector('#technology');
  if(technology){
    var container = document.querySelector('.container');
    var allSmallBall = technology.querySelectorAll('.small-ball');
    var allBigBall = container.querySelectorAll('.big-ball');
    var introBox = container.querySelector('.intro-box');
    var backBtn = introBox.querySelector('.back');
    var allBigBallArr = Array.prototype.slice.call(allBigBall);

    var myReq; // 当前动画值
    var toggleTouchTech; // 是否点击了技术部
    /*
    展示部门详情页  有一个转场效果
     */
     var showIntro = function(){
       replaceClass(introBox,'down-out','down-in');
     };
     var hideIntro = function(){
       replaceClass(introBox,'down-in','down-out');
     };

    /*
    stop all big move
     */
    var stopBallMove = function(){
      allBigBallArr.forEach(function(){
        //停止所有动画
        window.cancelAnimationFrame(myReq--);
      });
    };

    /*
    @p item object开始运动的对象
     */
    var ballMove = function(allBigBallArr){
      var WIDTH = container.offsetWidth;
      var HEIGHT = container.offsetHeight;
      allBigBallArr.forEach(function(item,index){
        var random = Math.floor(Math.random());
        var baseSpeed = (index+1)*dpr/2;
        var speedX = random>=.5? baseSpeed : -baseSpeed,
            speedY = random>=.5? baseSpeed : -baseSpeed;
        function startMove(){
          var rect = item.getBoundingClientRect();
          var left = rect.left,
              top = rect.top,
              right = rect.right,
              bottom = rect.bottom,
              width = rect.width,
              height = rect.height;
          if(top<=0){
            speedY = -speedY;
          }
          if(bottom>=HEIGHT){
            speedY = speedY>=0 ? -speedY : speedY;
          }
          if(left<=0||right>=WIDTH){
            speedX = -speedX;
          }
          item.style.left = item.offsetLeft+speedX+'px';
          item.style.top = item.offsetTop+speedY+'px';
          myReq = requestAnimationFrame(startMove);
        }
        myReq = requestAnimationFrame(startMove);
      });
    };

    /*
    * item 开始运动
     */
    ballMove(allBigBallArr);

    allBigBallArr.forEach(function(item){
      //  每一个大气球增加监听事件
      item.addEventListener('touchend',function(e){
        e.preventDefault();
        // stop all big ball move
        // 停止或者启动所有的大圈滚动
        stopBallMove();
        if(item && !item.id){
          //除技术部之外的部门 显示其详情
          var value = item.innerHTML;
          console.log(value);
          showIntro();
        }
      },false);
    });

    technology.addEventListener('touchend',function(e){
      e.preventDefault();
      // small ball add className 'show-small'
      // 显示小气泡的详情信息
      var target = e.target;
      if(target.tagName.toLowerCase()=='p'){
        // showIntro
        var value = target.innerHTML;
        // console.log(value);
        showIntro();
      }else{
        // 再次点击技术部 大气泡 继续动阿动
        if(toggleTouchTech){
          toggleTouchTech = false;
        }else{
          toggleTouchTech = true;
        }
        ballMove(allBigBallArr);
      }
      [].slice.call(allSmallBall).forEach(function(item){
        var itemClass = item.classList;
        if(item.classList.toString().indexOf('show-small')!==-1){
          itemClass.remove('show-small');
        }else{
          stopBallMove();
          itemClass.add('show-small');
        }
      });
    },false)
    backBtn.addEventListener('touchend',function(e){
      e.preventDefault();
      // 隐藏intro面板
      hideIntro();
      // 继续播放动画
      ballMove(allBigBallArr);
    },false)
  }
})();

/*
news
 */
;(function(){
  var newsBox = document.querySelector('.news-box');
  if(newsBox){
    var newsTimeLine = newsBox.querySelector('.new-time-line');
    var ulTimeLine = newsTimeLine.querySelector('ul');
    var newItme = ulTimeLine.querySelectorAll('li');
    var newItemA = ulTimeLine.querySelectorAll('a');
    var timeLineWidth = newsTimeLine.offsetWidth-4;  // 时间线的div宽度 减去border
    var itemLiWidth = newItme[0].offsetWidth; // 每一个li的长度
    var itemLen = newItme.length; //Li的个数
    var startX,moveX; //touch 初始值 和 移动值
    // 动态设置ul长度
    var ulWidth = itemLen*itemLiWidth;
    ulTimeLine.style.width = ulWidth+'px';
    //默认展示最后一个item 对应的数据
    newItemA[newItemA.length-1].classList.add('active');
    /*
    * checkActive检测active的item
    * @param{Number} 结束时的left值
     */
    var checkActive = function(endLeft){
      // 确定中间的选项被激活 添加 active class
      if(itemLen<3&&endLeft>0){
        newItemA[0].classList.add('active');
      }else if(itemLen>=3&&endLeft<=0){
        var index = Math.round(Math.abs(endLeft)/itemLiWidth+1);
        newItemA[index].classList.add('active');
      }
    }
    newsTimeLine.addEventListener('touchstart',function(e){
      startX = e.touches[0].clientX;
      // 清空所有active class
      Array.prototype.slice.call(newItemA).forEach(function(item){
        if(item.classList.toString().indexOf('active')!==-1){
          item.classList.remove('active');
        }
      })
    },false);

    newsTimeLine.addEventListener('touchmove',function(e){
      moveX = e.touches[0].clientX - startX;
    },false);


    newsTimeLine.addEventListener('touchend',function(e){
      e.stopPropagation(); // 禁止呼出侧边栏
      var moveValue=0; // 已经move的值 初始为0
      var startLeft = startLeft?startLeft:0;  // 初始的left值
      var endLeft = 0;  //检测结束时的 left值
      var speedX = moveX/50;
      var startMove = function(){
        speedX?speedX =speedX*1.1 :  moveX/50// 初始速度
        startLeft= ulTimeLine.offsetLeft;
        moveValue +=Math.abs(speedX);
        if(moveX>0&&startLeft>=0){
          ulTimeLine.style.left=0;
          endLeft = ulTimeLine.offsetLeft;
          checkActive(endLeft);
          return cancelAnimationFrame(myAnimation);
        }
        if(moveX<0&& -startLeft>=ulWidth-timeLineWidth){
          ulTimeLine.style.right = 0;
          endLeft = ulTimeLine.offsetLeft;
          checkActive(endLeft);
          return cancelAnimationFrame(myAnimation);
        }
        // 移动一定距离停止
        if(moveValue>=Math.abs(moveX)*1.4){
          speedX = speedX/10;
          endLeft = -ulTimeLine.offsetLeft;
          var index = Math.round(endLeft/itemLiWidth);
          endLeft = -itemLiWidth*index;
          ulTimeLine.style.left = endLeft+'px';
          checkActive(endLeft);
          console.log('========================');
          return cancelAnimationFrame(myAnimation)
        }
        ulTimeLine.style.left = startLeft+speedX+'px';
        myAnimation = requestAnimationFrame(startMove);
      }
      myAnimation = requestAnimationFrame(startMove)
    },false);

  }
})();
