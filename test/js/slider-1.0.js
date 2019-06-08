(function ($) {
	'use strict'
    //学习一下扩展方法
    function Slider($elem,options){
        this.$elem = $elem;
        this.options = options;
        this.$indicators = this.$elem.find('.slider-indicator');
        this.$items = this.$elem.find('.slider-item');
        this.itemNum = this.$items.length;
        this.curIndex = this._getCorrectIndex(this.options.activeIndex); 
        this.$controls = this.$elem.find('.slider-control');
        
        this._init();
    }

    Slider.DEFAULTS = {
        css3: false,
        js: false,
        animation: 'fade', // slide
        activeIndex: 0,
        interval: 0
    };
    //删除所有的样式，判断是滑入滑出还是淡入淡出，对showHide进行初始化，绑定事件、设置自动运行，发送消息
    Slider.prototype._init=function(){
        //初始状态
    	this.$indicators.removeClass('slider-indicator-active')
        this.$indicators.eq(this.curIndex).addClass('slider-indicator-active')
        this.$elem.trigger('slider-show', [this.curIndex, this.$items[this.curIndex]])
        var self = this
        if (this.options.animation === 'slide') {
            this.$elem.addClass('slider-slide');
            //将默认的那张设置在可视区域非
            this.$items.eq(this.curIndex).css('left', 0)

            //slide的发送消息
            this.$items.on('move moved',function (e) {
                //获取将要运动的那个图片元素
                var index = self.$items.index(this)
                if (e.type === 'move') {
                    if (index === self.curIndex) {
                        self.$elem.trigger('slider-hide', [index, this])
                    } else {
                        self.$elem.trigger('slider-show', [index, this])
                    }
                }
               
                if (e.type === 'moved') {
                    if (index === self.curIndex) {
                        self.$elem.trigger('slider-shown', [index, this])
                    }else {
                        self.$elem.trigger('slider-hidden', [index, this])
                    }
                }
                
            })
            //init move
            this.$items.move(this.options)
            this.itemWidth = this.$items.eq(0).width();
            this.transitionClass = this.$items.eq(0).hasClass('transition') ? 'transition' : '';
            this.to = this._slide
        } else {
        	//呀记住添加fade的类
        	this.$elem.addClass('slider-fade');  
            //显示当前图片
        	this.$items.eq(this.curIndex).show()

            this.$items.on('show shown hide hidden',function (e) {
                self.$elem.trigger('slider-'+e.type,[self.$items.index(this), this]);
                // 发送消息，同时传参当前显示的第几个及该DOM
            });   
        
             //init shoHide
            this.$items.showHide(this.options)
        	this.to = this._fade
        }
       
        //bind event

        this.$elem.hover(function() {
            //显示隐藏左右按钮
            self.$controls.show()
        },function() {
            self.$controls.hide()
        }).on('click','.slider-control-left',function(){
        	    var num = self.curIndex-1;
                self.to(self._getCorrectIndex(num), 1); 
        }).on('click','.slider-control-right',function(){
            	var num = self.curIndex+1;
                self.to(self._getCorrectIndex(num), -1); 

        }).on('click', '.slider-indicator', function() {
        	    console.log(45)
                //用index函数获取点击原点的序号，将它传入进行判断
        	    self.to(self._getCorrectIndex(self.$indicators.index(this)));
        });
        //auto判断interval是否有值和是否是数字,然后执行鼠标划入停止
        
        if (this.options.interval && !isNaN(Number(this.options.interval))) {
                this.$elem.hover($.proxy(this.pause, this),$.proxy(this.auto, this))
                this.auto()
        }

       
    };
    //实现循环
    Slider.prototype._getCorrectIndex = function(index) {
        if (isNaN(Number(index))) {return}
        if (index > this.itemNum - 1) {return 0;}
        if (index < 0) {return this.itemNum - 1}
        return index;
    };
    //实现淡入淡出动作   
    Slider.prototype._fade=function(index){
    	//隐藏当前的显示指定的
    	if (this.curIndex === index) {return}
    //需要发送
    	this.$items.eq(this.curIndex).showHide('hide');
        this.$items.eq(index).showHide('show');
        //将当前的css的class删掉，为指定的图片添加class
        this.$indicators.eq(this.curIndex).removeClass('slider-indicator-active')
        this.$indicators.eq(index).addClass('slider-indicator-active')
        this.curIndex = index
    }; 
    Slider.prototype._slide=function(index, deriction){
        if (this.curIndex === index) {return}
        var self = this
        //判断点击按钮的方向
        if (!deriction) {
            if (this.curIndex < index) {
                deriction = -1;
            } else {
                deriction = 1;
            }
        }
        //设置初始位置
            this.$items.eq(index).removeClass(this.transitionClass).css('left', -1 * deriction * this.itemWidth)
        //将当前图片移出可视区域，指定图片移入可视区域。
         setTimeout(function () {
            self.$items.eq(self.curIndex).move('x', deriction * self.itemWidth);
            self.$items.eq(index).addClass(self.transitionClass).move('x', 0);
            self.curIndex = index;
        },20)
         // 激活indicator
        this.$indicators.eq(this.curIndex).removeClass('slider-indicator-active');
        this.$indicators.eq(index).addClass('slider-indicator-active');
    };
    Slider.prototype.auto=function(){
    	var self = this;
        this.intervalId = setInterval(function() {
            self.to(self._getCorrectIndex(self.curIndex+1));
        },this.options.interval)
    };
    //清除计时器
    Slider.prototype.pause=function(){
        clearInterval(this.intervalId);
    };

    $.fn.extend({
    	slider: function(option) {
    		return this.each(function() {
    			//jq的data用法
                console.log($(this))
                var $this = $(this),
                mode = $this.data('slider'),
                //将所有的数据赋值给options，这里为什么使用了$(this)
                options = $.extend({}, Slider.DEFAULT, $(this).data(), typeof option === 'object' && option);
                //判断是否第一次执行
                if (!mode) {
                	$this.data('slider', mode = new Slider($this, options));
                }
                 if (typeof mode[option] === 'function') {
                 	 mode[option]();
                 }
    		})
    	}
    })
})(jQuery)