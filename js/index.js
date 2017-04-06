window.onload = function() {
		var $list = $('#list');
		var $ali = $('#list').children('li');
		var $main = $('#main');
		var desW = 640;
		var desY = 960;
		var index = 0;
		var isHuaDong = false;
		$(document).on('touchmove',function(ev){
					//阻止默认事件---》滚动事件
					ev.preventDefault();
			})
		
		//获取可视区的高度
		var viewH = $(window).height();
		//设置内容的高度
		//	$list.css('height',viewH);
		$ali.css('height', viewH);
		$main.css('height', viewH);
		//计算放大后的宽度
		var nowWidth = desW / desY * viewH;
		//调整背景图片位置
		$ali.css('background-position', (desW - nowWidth) / 2 + 'px 0px');

		$(document).on('touchmove', function(ev) {
			ev.preventDefault();
		})
slideList();
function loading() {
					var oLoading = $('.loading');
					var imgArr = ['a.png', 'b.png', 'c.png', 'd.png', 'e.png', 'ad1.png', 'ad2.png', 'c1.png', 'c2.png', 'c3.png', 'c4.png', 'c5.png', 'c6.png', 'd1.png'];
					var iNum = 0;
					//图片加载
					for(var i = 0; i < imgArr.length; i++) {

						var oimg = new Image();
						oimg.src = 'img/' + imgArr[i];

						oimg.onload = function() {
							iNum++;
							if(iNum == imgArr.length) {
								oLoading.animate({ opacity: 0 }, 2000, function() {
									oLoading.remove();
								})
							}

						};

						oimg.onerror = function() {
							oLoading.animate({ opacity: 0 }, 2000, function() {
								oLoading.remove();
							})
						}

					}

				}

loading();
		//画布 刮刮效果
		var huabu = $('#huabu')[0];

		//获取上下文对象
		var ctx = huabu.getContext('2d');
		var oImage = new Image();
		oImage.src = "img/a.png";
		//图片加载完绘制
		oImage.onload = function() {
			//绘制图片
			//参数1：绘制的图片对象
			//参数2：绘制的位置
			//参数3：绘制的尺寸
			ctx.drawImage(oImage, 0, 0, 640, viewH);

			//后画上去的图像会以抠像的形式存在
			ctx.globalCompositeOperation = 'destination-out';
			ctx.lineWidth = 40;
			ctx.lineCap = 'round';
			$('#huabu').on('touchstart', function(ev) {
				var ev = ev || window.event;
				ev.stopPropagation();
				//			ev.preventDefault();s

				var touch = ev.originalEvent.changedTouches[0];
				ctx.beginPath();
				ctx.moveTo(touch.pageX, touch.pageY);
				$('#huabu').on('touchmove.abc', function(ev) {
					var ev = ev || window.event;
					ev.stopPropagation();
					var touch = ev.originalEvent.changedTouches[0];
					ctx.lineTo(touch.pageX, touch.pageY);

					ctx.stroke();
					var data = ctx.getImageData(0, 0, 640, viewH).data;
					for(var i = 0, j = 0; i < data.length; i += 4) {
						if(data[i] && data[i + 1] && data[i + 2] && data[i + 3]) {
							j++;
						}
					}
					if(j <= 640 * viewH * 0.8) {
						$('#huabu').animate({ 'opacity': '0' }, 2000, function() {
							$('#huabu').remove();
							$('.desc').css('display', 'block');
							isHuaDong = true;
						});

					}

				})
				$('#huabu').on('touchend.abc', function() {
					
					ev.stopPropagation();
					$('#huabu').off('.abc');
					showMusic();
				})

			})
		}

		//音乐播放
		function showMusic(){
			var oMusic = $('#music');
			var oA = $('audio');
			var obtn = false;
			oMusic.on('click',function(){
				if(!obtn){
					oA.get(0).play();
					oMusic.addClass('rotate');
				}else{
					oA.get(0).pause();
					oMusic.removeClass('rotate');
				}
				obtn=!obtn;
			})
			//主动触发
			oMusic.trigger('click');
		}
	

		
			//滑屏效果
			//对比Y值决定方向
			function slideList(){
				//初始化变量
				var touchY = 0;//开始触碰的y坐标
				var nowIndex = 0;//当前屏的下标
				var nextIndex = 0;//下一屏显示的下标
				
				//触碰事件
				$ali.on('touchstart',function(ev){
					var touch = ev.originalEvent.changedTouches[0];
					touchY = touch.pageY;//记录y
					nowIndex = $(this).index();//记录当前屏下标
					
					$ali.on('touchmove',function(ev){
						var touch = ev.originalEvent.changedTouches[0];
						//判断是上翻还是下翻
						if(touch.pageY<touchY){
							//上翻
							nextIndex = (nowIndex==$ali.length-1)?0:nowIndex+1;
							//让下屏动作--位移
							$ali.eq(nextIndex).css('transform','translate(0,'+(viewH+touch.pageY-touchY)+'px)');
						}else if(touch.pageY>touchY){
							
							nextIndex = (nowIndex==0)?$ali.length-1:nowIndex-1;
							$ali.eq(nextIndex).css('transform','translate(0,'+(-viewH+touch.pageY-touchY)+'px)');
							
						}
						//当前屏
						$ali.eq(nowIndex).css('transform','translate(0,'+(touch.pageY-touchY)*0.25+'px) scale(0.9)');
						//修改层级
						$ali.eq(nextIndex).css('z-index',6).show();
						
					})
					
					$ali.on('touchend',function(){
						
						$(this).css('transition','.2s');
						//手松开下屏完成动作
						$ali.eq(nextIndex).css('transform','translate(0,0)');
						$ali.eq(nextIndex).css('transition','.2s');
						
					})
					
					//过渡完成事件：效果重置
					$ali.on('webkitTransitionEnd transitionend',function(){
						
						$ali.eq(nextIndex).siblings('li').hide();
						$ali.eq(nextIndex).css('z-index',5);											
						$ali.css('transition','');
					})
					
					
				})
				
				
			}
}		