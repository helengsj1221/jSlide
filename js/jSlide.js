;(function() {
	//实现切换动画的构造函数
	//跟容器id、滚动内容的class、滚动条目的class关联
	function SlideAlbums(param, context) {
		var param = param || {};
		this.ctn = context;
		this.contentCtn = this.ctn.find(".slide-content");
		this.itemsCtn = this.ctn.find(".slide-items");
		this.slideTime = param.slideTime || 800;
		this.stayTime = param.stayTime || 3000;
		this.init();
	}
	$.extend(SlideAlbums.prototype, {
		initData: function() {
			//内容容器
			this.content = this.contentCtn.children();
			//条目容器
			this.items = this.itemsCtn.children();
			//滚动数量
			this.itemsNumber = this.content.size();
			//单个内容条目的宽度
			this.itemWidth = this.content.eq(0).innerWidth();
			//设置滚动容器的宽度
			this.contentCtn.css("width", this.itemWidth*this.itemsNumber);
			
			this.index = 0;
		},
		initEvent: function() {
			var self = this;
			this.items.each(function(index, ele) {
				$(ele).click(function() {
					if ( !self.isSliding ) {
						clearTimeout(self.count || null);
						self.switchTo(index, self.slideEnd);
					}
				});
			});
		},
		//初始化入口
		init: function() {
			this.initData();
			this.countTime();
			this.initEvent();
		},
		countTime: function() {
			var self = this;
			this.count = setTimeout(function() {
				self.go(1);
			}, this.stayTime);
		},
		slideEnd: function(index) {
			this.index = index;
			this.setCurrentItem(this.index);
			this.countTime();
		},
		//执行动画的方法
		switchTo: function(index, callback) {
			var self = this;
			this.isSliding = true;
			this.contentCtn.animate({
				left: "-"+this.itemWidth*index
			}, this.slideTime, function() {
				self.isSliding = false;
				callback.call(self, index);
			});
		},
		setCurrentItem: function(index) {
			this.items.removeClass("current-slide-item");
			this.items.eq(index).addClass("current-slide-item");
		},
		//自动控制前进或后退
		go: function(dir) {
			if ( this.isSliding ) return;
			if ( dir > 0 ) {
				if ( this.index == this.itemsNumber-1 ) {
					this.content.eq(0).css({
						position: "relative",
						left: this.itemsNumber*this.itemWidth
					});
					this.switchTo(++this.index, function() {
						this.index = 0;
						this.content.eq(0).removeAttr("style");
						this.contentCtn.css("left", "0");
						this.setCurrentItem(0);
						this.isSliding = false;
						this.countTime();
					});
					return;
				}
				this.switchTo(++this.index, this.slideEnd);
			}
		}
	});
	
	$.fn.extend({
		jSlide: function(param) {
			/*
			 * param说明：{
			 *	slideTime: 800,	图片滑动效果的执行时间
			 *	stayTime: 3000	当前图片停留的展示时间
			 * }
			*/
			$.each($(this), function() {
				new SlideAlbums(param, $(this));
			});
		}
	});
})()