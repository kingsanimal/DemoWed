//第一版
// (function ($) {
// 	'use strict';

// 	var $search = $('.search'),
// 	$input = $search.find('.search-inputbox'),
// 	$layer = $search.find('.search-layer'),
// 	$form = $search.find('.search-form'),
// 	btn = $search.find('.search-btn');

	
//     $form.on('submit', function () {
//     	if ($.trim($input.val()) === '') {
// 		    return false;
// 	    }
//     })

//     $layer.on('foucs', function () {
//     	$layer.show()
//     	return false;
//     })
//     $(document).on('click', function () {
//     	$layer.hide()
//     })

// 	$input.on('input', function () {
// 		// var url ='https://suggest.taobao.com/sug?code=utf-8&_ksTS=1555684980517_1207&callback=jsonp1208&k=1&area=c2c&bucketid=18&q='+  + encodeURIComponent($.trim($input.val()));
// 		var url = 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1484204931352_18291&callback=jsonp18292&k=1&area=c2c&bucketid=6&q=' + encodeURIComponent($.trim($input.val()));
// 	    $.ajax({
// 	    	url: url,
// 	    	dataType: 'jsonp'
// 	    }).done(function(data) {
// 	    	var html = '',
// 	    	dataNum = data['result'].length;
// 	    	if (dataNum === 0) {
// 	    		$layer.hide().html('')
// 	    		return;
// 	    	}
// 	    	for (var i = 0; i < dataNum; i++) {
// 	            if (i > 10) {break;}
// 	            html += '<li class="search-layer-item text-ellipsis">' + data['result'][i][0] + '</li>';
// 	    	}
// 	    	//不能放在for循环里面，否则会一直有数据
// 	    	$layer.html(html).show();
// 	    }).fail(function () {
// 	    	$layer.hide().html('')
// 	    }).always(function () {
// 	    	console.log('为什么总是我')
// 	    })
// 	})

//     $layer.on('click', '.search-layer-item', function () {
//     	//获取下拉菜单中点击的值，讲输入框的内容改写点击的值
//     	$input.val(removeHtmlTags($(this).html()));
//     	$form.submit()
//     })
//     function removeHtmlTags(str) {
//     	return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g, '');
//     }
// })(jQuery)  

//第二版
(function ($) {
    'use strict'
    function Search($elem, options) {
        this.$elem = $elem;
        this.options = options; 

        this.$form = this.$elem.find('.search-form');
        this.$input = this.$elem.find('.search-inputbox');        
        this.$layer = this.$elem.find('.search-layer');  
        this.loaded = false;
        this.$elem.on('click','.search-btn', $.proxy(this.submit, this))
        //如果需要自动执行则调用此方法
        if(this.options.autocomplete) {
        	this.autocomplete();
        }
    }
    Search.DEFAULT = {
    	autocomplete: false,
    	 url: 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1484204931352_18291&callback=jsonp18292&k=1&area=c2c&bucketid=6&q=',
    	css3: false,
    	js: false,
    	animation: 'fade'
    }
    Search.prototype.submit = function() {
    	 if (this.getInputVal() === '') {
            return false;
        }
        this.$form.submit();
    }
    Search.prototype.autocomplete = function() {
        var timer = null;
        var self = this;
        this.$layer.showHide(this.options);

        this.$input.on('input', function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                self.getData();
            },200)
        })
                   .on('foucs', $.proxy(this.showLayer, this))
                   .on('click', function () {
                       return false;
                   });
        this.$layer.showHide(this.options);
        $(document).on('click', $.proxy(this.hideLayer, this))
    }
    Search.prototype.getData  = function() {
    	var self = this;
        var inputVal = this.getInputVal();
        if (inputVal === '') {return self.$elem.trigger('search-noData');}
        if (this.jqXHR) {this.jqXHR.abort()}
        this.jqXHR = $.ajax({
        	url: this.options.url + this.getInputVal(),
            dataType: 'jsonp'
        }).done(function (data) {
            self.$elem.trigger('search-getData', [data, self.$layer])
        }).fail(function () {
        	self.$elem.trigger('search-noData', [self.$layer])
        }).always(function() {
            self.jqXHR = null
        })
    }
    Search.prototype.showLayer = function() {
        if (!this.loaded) {return;}
        this.$layer.showHide('show')
    }
    Search.prototype.hideLayer = function() {
        this.$layer.showHide('hide')
    }
    Search.prototype.getInputVal = function() {
        return $.trim(this.$input.val())
    }
    Search.prototype.setInputVal = function(val) {
        this.$input.val(removeHtmlTags(val));

        function removeHtmlTags(val) {
            return val.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g, '');
        }
    }
    Search.prototype.appendLayer = function(html) {
        this.$layer.html(html)
        this.loaded = !!html
    }

    $.fn.extend({
        search: function(option, value) {
    		return this.each(function() {
    			var $this = $(this),
    			options = $.extend({}, Search.DEFAULT, typeof option === 'object' && option),
                mode = $this.data('search');
                //如果是第一次执行就调用否则禁止调用
                if (!mode) {
                	$this.data('search', mode = new Search($this, options))
                }
                console.log(mode);
                //判断是否有此方法
                 console.log(mode[option]);
                if (typeof mode[option] === 'function') {

                    console.log(option);
                	mode[option](value)
                }
    		})
    	}
    })

})(jQuery)



