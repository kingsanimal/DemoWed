(function($) {

        'use strict';
        //menu
        var dropdown={};
        $('.menu')
            .on('dropdown-show', function(e) {
                dropdown.loadOnce($(this), dropdown.buildMenuItem);
            })
            .dropdown({
                css3: true,
                js: false
            });

        dropdown.buildMenuItem=function($elem, data) {

            var html = "";
            if (data.length === 0) return;
            for (var i = 0; i < data.length; i++) {
                html += '<li><a href="' + data[i].url + '" target="_blank" class="menu-item">' + data[i].name + '</a></li>'
            }
            $elem.find('.dropdown-layer').html(html);

        };

        //cart
        // $('#cart').on('dropdown-show', function() {
        //     dropdown.loadOnce($(this), function($elem, data) {
        //         dropdown.buildCartItem($elem, data);
        //         dropdown.updateCart($elem, data);
        //     });
        // }).dropdown({

        //     css3: true,
        //     js: false
        // });


        // dropdown.buildCartItem=function($elem, data) {

        //     var html = "";
        //     if (data.length === 0) { // no goods
        //         html += '<div class="cart-nogoods"><i class="icon cart-nogoods-icon fl">&#xe600;</i><div class="cart-nogoods-text fl">购物车里还没有商品<br />赶紧去选购吧！</div></div>';
        //         $elem.find('.dropdown-layer').html(html);
        //         return;
        //     }

        //     html += '<h4 class="cart-title">最新加入的商品</h4><ul class="cart-list">';

        //     for (var i = 0; i < data.length; i++) {
        //         html += '<li class="cart-item"><a href="###" target="_blank" class="cart-item-pic fl"><img src="' + data[i].pic + '" alt="" /></a><div class="fl"><p class="cart-item-name text-ellipsis"><a href="###" target="_blank" class="link">' + data[i].name + '</a></p><p class="cart-item-price"><strong>￥' + data[i].price + ' x ' + data[i].num + '</strong></p></div><a href="javascript:;" title="删除" class="cart-item-delete link fr">X</a></li>';
        //     }

        //     html += '</ul><div class="cart-info"><span class="fl">共 <strong class="cart-total-num">0</strong> 件商品　共计<strong class="cart-total-price">￥ 0.00</strong></span><a href="###" target="_blank" class="cart-info-btn btn fr">去购物车</a></div>';

        //     // setTimeout(function(){
        //     $elem.find('.dropdown-layer').html(html);
        //     // },1000);
        // }; 

        // function updateCart($elem, data) {
        //     var $cartNum = $elem.find('.cart-num'),
        //         $cartTotalNum = $elem.find('.cart-total-num'),
        //         $cartTotalPrice = $elem.find('.cart-total-price'),
        //         dataNum = data.length,
        //         totalNum = 0,
        //         totalPrice = 0;

        //     if (dataNum === 0) { // no goods
        //         return;
        //     }

        //     for (var i = 0; i < dataNum; i++) {
        //         totalNum += +data[i].num;
        //         totalPrice += +data[i].num * +data[i].price;
        //     }

        //     $cartNum.html(totalNum);
        //     $cartTotalNum.html(totalNum);
        //     $cartTotalPrice.html('￥' + totalPrice);
        // };


        //header search
        var search={};
        search.$headerSearch = $('#header-search');
        search.$headerSearch.html = '';
        search.$headerSearch.maxNum = 10;

        // 获得数据处理
        search.$headerSearch.on('search-getData', function(e, data) {
            var $this = $(this);
            search.$headerSearch.html = search.$headerSearch.createHeaderSearchLayer(data, search.$headerSearch.maxNum);
            $this.search('appendLayer', search.$headerSearch.html);
            // 将生成的html呈现在页面中        
            if (search.$headerSearch.html) {
                $this.search('showLayer');
            } else {
                $this.search('hideLayer');

            }
        }).on('search-noData', function(e) {
            // 没获得数据处理
            $(this).search('hideLayer').search('appendLayer', '');

        }).on('click', '.search-layer-item', function() {
            // 点击每项时，提交
            search.$headerSearch.search('setInputVal', $(this).html());
            search.$headerSearch.search('submit');
        });

        search.$headerSearch.search({
             autocomplete: true,
            css3: false,
            js: false,
            animation: 'fade',
            getDataInterval: 0
        });

        // 获取数据，生成html

        search.$headerSearch.createHeaderSearchLayer= function (data, maxNum) {
           console.log(data)
            var html = '',
                dataNum = data['result'].length;

            if (dataNum === 0) {
                return '';
            }
            for (var i = 0; i < dataNum; i++) {
                if (i >= maxNum) break;
                html += '<li class="search-layer-item text-ellipsis">' + data['result'][i][0] + '</li>';

            }
            return html;

        };

        // focus-category

        $('#focus-category').find('.dropdown')
            .on('dropdown-show', function() {
                dropdown.loadOnce($(this), dropdown.createCategoryDetails);
            })
            .dropdown({
                css3: false,
                js: false
            });

        dropdown.createCategoryDetails= function ($elem, data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += '<dl class="category-details cf"><dt class="category-details-title fl"><a href="###" target="_blank" class="category-details-title-link">' + data[i].title + '</a></dt><dd class="category-details-item fl">';

                for (var j = 0; j < data[i].items.length; j++) {
                    html += '<a href="###" target="_blank" class="link">' + data[i].items[j] + '</a>';
                }
                html += '</dd></dl>';
            }
            // setTimeout(function () {
            $elem.find('.dropdown-layer').html(html);
            // },1000);

        };

        dropdown.loadOnce= function($elem, success) {
            var dataLoad = $elem.data('load');
            if (!dataLoad) return;
            if (!$elem.data('loaded')) {
                $elem.data('loaded', true);
                $.getJSON(dataLoad).done(function(data) {
                    if (typeof success === 'function') success($elem, data);
                }).fail(function() {
                    $elem.data('loaded', false);
                });
            }
        };


        // foucs-slider
        var slider={};
        slider.$focusSlider=$('#focus-slider');
        slider.loadImg=function(url, imgLoaded, imgFailed) {
                //这是一个图片对象底下都是它的属性
                var image = new Image();
                image.onerror = function() {
                    if (typeof imgFailed === 'function') imgFailed(url);
                }
                image.onload = function() {
                    if (typeof imgLoaded === 'function') imgLoaded(url);
                };
                //为什么会写在最后面尼：因为不写在后面ie会报错
                image.src=url;     
                // setTimeout(function() {
                //     image.src = url;
                // }, 1000);
            };

        slider.lazyLoad = function($elem) {
             $elem.items = {};
             $elem.loadedItemNum = 0;
             $elem.totalItemNum = $elem.find('.slider-img').length;
             $elem.on('slider-show', $elem.loadItem = function(e, index, elem) {
                 console.log(1);
                 if ($elem.items[index] !== 'loaded') {
                     $elem.trigger('slider-loadItem', [index, elem]);
                 }
             });
             $elem.on('slider-loadItem', function(e, index, elem) {
                 // 按需加载
                 var $imgs = $(elem).find('.slider-img');
                 $imgs.each(function(_, el) { // _ 相当占位，不使用该参数。 
                     var $img = $(el);
                     slider.loadImg($img.data('src'), function(url) {
                         $img.attr('src', url);
                         $elem.items[index] = 'loaded';
                         $elem.loadedItemNum++;
                         console.log(index + ': loaded');
                         if ($elem.loadedItemNum === $elem.totalItemNum) {
                             // 全部加载完毕
                             $elem.trigger('slider-itemsLoaded');
                         }
                     }, function(url) {
                         console.log('从' + url + '加载图片失败');
                         // 多加载一次
                         // 显示备用图片
                         $img.attr('src', '../img/focus-slider/placeholder.png');
                     });
                 });

             });

             $elem.on('slider-itemsLoaded', function(e) {
                 console.log('itemsLoaded');
                 // 清除事件，为什么清除事件
                 $elem.off('slider-show', $elem.loadItem);
             });

        }


          slider.lazyLoad(slider.$focusSlider);
          slider.$focusSlider.slider({
                css3: true,
                js: false,
                animation: 'fade', // fade  slide
                activeIndex: 0,
                interval: 0
            });


        // todays-slider   
          slider.$todaysSlider = $('#todays-slider'); 
          slider.lazyLoad(slider.$todaysSlider);
            slider.$todaysSlider.slider({
                css3: true,
                js: false,
                animation: 'fade', // fade  slide
                activeIndex: 0,
                interval: 0
            });

         //floor
        // var $floor=$('.floor');
   
           function lazyLoadFloorImgs($elem) {
                   var items = {},
                   loadedItemNum = 0,
                   totalItemNum = $elem.find('.floor-img').length,
                   loadItemFn=null;             
                   
                   $elem.on('tab-show', loadItemFn = function(e, index, elem) {
                       // console.log(1);
                       if (items[index] !== 'loaded') {
                           $elem.trigger('tab-loadItem', [index, elem]);
                       }
                    });
                    $elem.on('tab-loadItem', function(e, index, elem) {
                        // 按需加载
                        var $imgs = $(elem).find('.floor-img');
                        $imgs.each(function(_, el) { // _ 相当占位，不使用该参数。
                            var $img = $(el);
                            slider.loadImg($img.data('src'), function(url) {
                                $img.attr('src', url);
                                items[index] = 'loaded';
                                // console.log(items[index]);
                                loadedItemNum++;
                                // console.log(index + ': loaded');
                             if (loadedItemNum === totalItemNum) {
                              // 全部加载完毕
                              $elem.trigger('tab-itemsLoaded');
                          }
                        }, function(url) {
                            console.log('从' + url + '加载图片失败');
                            // 多加载一次
                            // 显示备用图片
                            $img.attr('src', '..img/floor/placeholder.png');
                        });
                    });
 
                });
                }
 
        //         $elem.on('tab-itemsLoaded', function(e) {
        //             console.log('tab-itemsLoaded');
        //             // 清除事件
        //             $elem.off('tab-show', loadItemFn);
        //         });

        //     }

        
        //？
        // $floor.each(function (_,elem) {
        //     lazyLoadFloorImgs($(elem));
        // });



     // $floor.on('tab-show tab-shown tab-hide tab-hidden',function (e,index,elem) {
     //     // console.log(e.type);
     //     // console.log(index);
     //     // console.log(elem);

     // });

       var floor = {};
          floor.$floor = $('.floor');

        floor.floorData = [
        {
            num: '1',
            text: '服装鞋包',
            tabs: ['大牌', '男装', '女装'],
            items: [
                [
                    {
                        name: '匡威男棒球开衫外套2015',
                        price: 479
                    }, {
                        name: 'adidas 阿迪达斯 训练 男子',
                        price: 335
                    }, {
                        name: '必迈BMAI一体织跑步短袖T恤',
                        price: 159
                    }, {
                        name: 'NBA袜子半毛圈运动高邦棉袜',
                        price: 65
                    }, {
                        name: '特步官方运动帽男女帽子2016',
                        price: 69
                    }, {
                        name: 'KELME足球训练防寒防风手套',
                        price: 4999
                    }, {
                        name: '战地吉普三合一冲锋衣',
                        price: 289
                    }, {
                        name: '探路者户外男士徒步鞋',
                        price: 369
                    }, {
                        name: '羽绒服2015秋冬新款轻薄男士',
                        price: 399
                    }, {
                        name: '溯溪鞋涉水鞋户外鞋',
                        price: 689
                    }, {
                        name: '旅行背包多功能双肩背包',
                        price: 269
                    }, {
                        name: '户外旅行双肩背包OS0099',
                        price: 99
                    }
                ], [
                    {
                        name: '匡威男棒球开衫外套2015',
                        price: 479
                    }, {
                        name: 'adidas 阿迪达斯 训练 男子',
                        price: 335
                    }, {
                        name: '必迈BMAI一体织跑步短袖T恤',
                        price: 159
                    }, {
                        name: 'NBA袜子半毛圈运动高邦棉袜',
                        price: 65
                    }, {
                        name: '特步官方运动帽男女帽子2016',
                        price: 69
                    }, {
                        name: 'KELME足球训练防寒防风手套',
                        price: 4999
                    }, {
                        name: '战地吉普三合一冲锋衣',
                        price: 289
                    }, {
                        name: '探路者户外男士徒步鞋',
                        price: 369
                    }, {
                        name: '羽绒服2015秋冬新款轻薄男士',
                        price: 399
                    }, {
                        name: '溯溪鞋涉水鞋户外鞋',
                        price: 689
                    }, {
                        name: '旅行背包多功能双肩背包',
                        price: 269
                    }, {
                        name: '户外旅行双肩背包OS0099',
                        price: 99
                    }
                ], [
                    {
                        name: '匡威男棒球开衫外套2015',
                        price: 479
                    }, {
                        name: 'adidas 阿迪达斯 训练 男子',
                        price: 335
                    }, {
                        name: '必迈BMAI一体织跑步短袖T恤',
                        price: 159
                    }, {
                        name: 'NBA袜子半毛圈运动高邦棉袜',
                        price: 65
                    }, {
                        name: '特步官方运动帽男女帽子2016',
                        price: 69
                    }, {
                        name: 'KELME足球训练防寒防风手套',
                        price: 4999
                    }, {
                        name: '战地吉普三合一冲锋衣',
                        price: 289
                    }, {
                        name: '探路者户外男士徒步鞋',
                        price: 369
                    }, {
                        name: '羽绒服2015秋冬新款轻薄男士',
                        price: 399
                    }, {
                        name: '溯溪鞋涉水鞋户外鞋',
                        price: 689
                    }, {
                        name: '旅行背包多功能双肩背包',
                        price: 269
                    }, {
                        name: '户外旅行双肩背包OS0099',
                        price: 99
                    }
                ]
            ]
        }, {
            num: '2',
            text: '个护美妆',
            tabs: ['热门', '国际大牌', '国际名品'],
            items: [
                [
                    {
                        name: '韩束红石榴鲜活水盈七件套装',
                        price: 169
                    }, {
                        name: '温碧泉八杯水亲亲水润五件套装',
                        price: 198
                    }, {
                        name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                        price: 79.9
                    }, {
                        name: '吉列手动剃须刀锋隐致护',
                        price: 228
                    }, {
                        name: 'Mediheal水润保湿面膜',
                        price: 119
                    }, {
                        name: '纳益其尔芦荟舒缓保湿凝胶',
                        price: 39
                    }, {
                        name: '宝拉珍选基础护肤旅行四件套',
                        price: 299
                    }, {
                        name: '温碧泉透芯润五件套装',
                        price: 257
                    }, {
                        name: '玉兰油多效修护三部曲套装',
                        price: 199
                    }, {
                        name: 'LOREAL火山岩控油清痘洁面膏',
                        price: 36
                    }, {
                        name: '百雀羚水嫩倍现盈透精华水',
                        price: 139
                    }, {
                        name: '珀莱雅新柔皙莹润三件套',
                        price: 99
                    }
                ], [
                    {
                        name: '韩束红石榴鲜活水盈七件套装',
                        price: 169
                    }, {
                        name: '温碧泉八杯水亲亲水润五件套装',
                        price: 198
                    }, {
                        name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                        price: 79.9
                    }, {
                        name: '吉列手动剃须刀锋隐致护',
                        price: 228
                    }, {
                        name: 'Mediheal水润保湿面膜',
                        price: 119
                    }, {
                        name: '纳益其尔芦荟舒缓保湿凝胶',
                        price: 39
                    }, {
                        name: '宝拉珍选基础护肤旅行四件套',
                        price: 299
                    }, {
                        name: '温碧泉透芯润五件套装',
                        price: 257
                    }, {
                        name: '玉兰油多效修护三部曲套装',
                        price: 199
                    }, {
                        name: 'LOREAL火山岩控油清痘洁面膏',
                        price: 36
                    }, {
                        name: '百雀羚水嫩倍现盈透精华水',
                        price: 139
                    }, {
                        name: '珀莱雅新柔皙莹润三件套',
                        price: 99
                    }
                ], [
                    {
                        name: '韩束红石榴鲜活水盈七件套装',
                        price: 169
                    }, {
                        name: '温碧泉八杯水亲亲水润五件套装',
                        price: 198
                    }, {
                        name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                        price: 79.9
                    }, {
                        name: '吉列手动剃须刀锋隐致护',
                        price: 228
                    }, {
                        name: 'Mediheal水润保湿面膜',
                        price: 119
                    }, {
                        name: '纳益其尔芦荟舒缓保湿凝胶',
                        price: 39
                    }, {
                        name: '宝拉珍选基础护肤旅行四件套',
                        price: 299
                    }, {
                        name: '温碧泉透芯润五件套装',
                        price: 257
                    }, {
                        name: '玉兰油多效修护三部曲套装',
                        price: 199
                    }, {
                        name: 'LOREAL火山岩控油清痘洁面膏',
                        price: 36
                    }, {
                        name: '百雀羚水嫩倍现盈透精华水',
                        price: 139
                    }, {
                        name: '珀莱雅新柔皙莹润三件套',
                        price: 99
                    }
                ]
            ]
        }, {
            num: '3',
            text: '手机通讯',
            tabs: ['热门', '品质优选', '新机尝鲜'],
            items: [
                [
                    {
                        name: '摩托罗拉 Moto Z Play',
                        price: 3999
                    }, {
                        name: 'Apple iPhone 7 (A1660)',
                        price: 6188
                    }, {
                        name: '小米 Note 全网通 白色',
                        price: 999
                    }, {
                        name: '小米5 全网通 标准版 3GB内存',
                        price: 1999
                    }, {
                        name: '荣耀7i 海岛蓝 移动联通4G手机',
                        price: 1099
                    }, {
                        name: '乐视（Le）乐2（X620）32GB',
                        price: 1099
                    }, {
                        name: 'OPPO R9 4GB+64GB内存版',
                        price: 2499
                    }, {
                        name: '魅蓝note3 全网通公开版',
                        price: 899
                    }, {
                        name: '飞利浦 X818 香槟金 全网通4G',
                        price: 1998
                    }, {
                        name: '三星 Galaxy S7（G9300）',
                        price: 4088
                    }, {
                        name: '华为 荣耀7 双卡双待双通',
                        price: 1128
                    }, {
                        name: '努比亚(nubia)Z7Max(NX505J)',
                        price: 728
                    }
                ], [
                    {
                        name: '摩托罗拉 Moto Z Play',
                        price: 3999
                    }, {
                        name: 'Apple iPhone 7 (A1660)',
                        price: 6188
                    }, {
                        name: '小米 Note 全网通 白色',
                        price: 999
                    }, {
                        name: '小米5 全网通 标准版 3GB内存',
                        price: 1999
                    }, {
                        name: '荣耀7i 海岛蓝 移动联通4G手机',
                        price: 1099
                    }, {
                        name: '乐视（Le）乐2（X620）32GB',
                        price: 1099
                    }, {
                        name: 'OPPO R9 4GB+64GB内存版',
                        price: 2499
                    }, {
                        name: '魅蓝note3 全网通公开版',
                        price: 899
                    }, {
                        name: '飞利浦 X818 香槟金 全网通4G',
                        price: 1998
                    }, {
                        name: '三星 Galaxy S7（G9300）',
                        price: 4088
                    }, {
                        name: '华为 荣耀7 双卡双待双通',
                        price: 1128
                    }, {
                        name: '努比亚(nubia)Z7Max(NX505J)',
                        price: 728
                    }
                ], [
                    {
                        name: '摩托罗拉 Moto Z Play',
                        price: 3999
                    }, {
                        name: 'Apple iPhone 7 (A1660)',
                        price: 6188
                    }, {
                        name: '小米 Note 全网通 白色',
                        price: 999
                    }, {
                        name: '小米5 全网通 标准版 3GB内存',
                        price: 1999
                    }, {
                        name: '荣耀7i 海岛蓝 移动联通4G手机',
                        price: 1099
                    }, {
                        name: '乐视（Le）乐2（X620）32GB',
                        price: 1099
                    }, {
                        name: 'OPPO R9 4GB+64GB内存版',
                        price: 2499
                    }, {
                        name: '魅蓝note3 全网通公开版',
                        price: 899
                    }, {
                        name: '飞利浦 X818 香槟金 全网通4G',
                        price: 1998
                    }, {
                        name: '三星 Galaxy S7（G9300）',
                        price: 4088
                    }, {
                        name: '华为 荣耀7 双卡双待双通',
                        price: 1128
                    }, {
                        name: '努比亚(nubia)Z7Max(NX505J)',
                        price: 728
                    }
                ]
            ]
        }, {
            num: '4',
            text: '家用电器',
            tabs: ['热门', '大家电', '生活电器'],
            items: [
                [
                    {
                        name: '暴风TV 超体电视 40X 40英寸',
                        price: 1299
                    }, {
                        name: '小米（MI）L55M5-AA 55英寸',
                        price: 3699
                    }, {
                        name: '飞利浦HTD5580/93 音响',
                        price: 2999
                    }, {
                        name: '金门子H108 5.1套装音响组合',
                        price: 1198
                    }, {
                        name: '方太ENJOY云魔方抽油烟机',
                        price: 4390
                    }, {
                        name: '美的60升预约洗浴电热水器',
                        price: 1099
                    }, {
                        name: '九阳电饭煲多功能智能电饭锅',
                        price: 159
                    }, {
                        name: '美的电烤箱家用大容量',
                        price: 329
                    }, {
                        name: '奥克斯(AUX)936破壁料理机',
                        price: 1599
                    }, {
                        name: '飞利浦面条机 HR2356/31',
                        price: 665
                    }, {
                        name: '松下NU-JA100W 家用蒸烤箱',
                        price: 1799
                    }, {
                        name: '飞利浦咖啡机 HD7751/00',
                        price: 1299
                    }
                ], [
                    {
                        name: '暴风TV 超体电视 40X 40英寸',
                        price: 1299
                    }, {
                        name: '小米（MI）L55M5-AA 55英寸',
                        price: 3699
                    }, {
                        name: '飞利浦HTD5580/93 音响',
                        price: 2999
                    }, {
                        name: '金门子H108 5.1套装音响组合',
                        price: 1198
                    }, {
                        name: '方太ENJOY云魔方抽油烟机',
                        price: 4390
                    }, {
                        name: '美的60升预约洗浴电热水器',
                        price: 1099
                    }, {
                        name: '九阳电饭煲多功能智能电饭锅',
                        price: 159
                    }, {
                        name: '美的电烤箱家用大容量',
                        price: 329
                    }, {
                        name: '奥克斯(AUX)936破壁料理机',
                        price: 1599
                    }, {
                        name: '飞利浦面条机 HR2356/31',
                        price: 665
                    }, {
                        name: '松下NU-JA100W 家用蒸烤箱',
                        price: 1799
                    }, {
                        name: '飞利浦咖啡机 HD7751/00',
                        price: 1299
                    }
                ], [
                    {
                        name: '暴风TV 超体电视 40X 40英寸',
                        price: 1299
                    }, {
                        name: '小米（MI）L55M5-AA 55英寸',
                        price: 3699
                    }, {
                        name: '飞利浦HTD5580/93 音响',
                        price: 2999
                    }, {
                        name: '金门子H108 5.1套装音响组合',
                        price: 1198
                    }, {
                        name: '方太ENJOY云魔方抽油烟机',
                        price: 4390
                    }, {
                        name: '美的60升预约洗浴电热水器',
                        price: 1099
                    }, {
                        name: '九阳电饭煲多功能智能电饭锅',
                        price: 159
                    }, {
                        name: '美的电烤箱家用大容量',
                        price: 329
                    }, {
                        name: '奥克斯(AUX)936破壁料理机',
                        price: 1599
                    }, {
                        name: '飞利浦面条机 HR2356/31',
                        price: 665
                    }, {
                        name: '松下NU-JA100W 家用蒸烤箱',
                        price: 1799
                    }, {
                        name: '飞利浦咖啡机 HD7751/00',
                        price: 1299
                    }
                ]
            ]
        }, {
            num: '5',
            text: '电脑数码',
            tabs: ['热门', '电脑/平板', '潮流影音'],
            items: [
                [
                    {
                        name: '戴尔成就Vostro 3800-R6308',
                        price: 2999
                    }, {
                        name: '联想IdeaCentre C560',
                        price: 5399
                    }, {
                        name: '惠普260-p039cn台式电脑',
                        price: 3099
                    }, {
                        name: '华硕飞行堡垒旗舰版FX-PRO',
                        price: 6599
                    }, {
                        name: '惠普(HP)暗影精灵II代PLUS',
                        price: 12999
                    }, {
                        name: '联想(Lenovo)小新700电竞版',
                        price: 5999
                    }, {
                        name: '游戏背光牧马人机械手感键盘',
                        price: 499
                    }, {
                        name: '罗技iK1200背光键盘保护套',
                        price: 799
                    }, {
                        name: '西部数据2.5英寸移动硬盘1TB',
                        price: 419
                    }, {
                        name: '新睿翼3TB 2.5英寸 移动硬盘',
                        price: 849
                    }, {
                        name: 'Rii mini i28无线迷你键盘鼠标',
                        price: 349
                    }, {
                        name: '罗技G29 力反馈游戏方向盘',
                        price: 2999
                    }
                ], [
                    {
                        name: '戴尔成就Vostro 3800-R6308',
                        price: 2999
                    }, {
                        name: '联想IdeaCentre C560',
                        price: 5399
                    }, {
                        name: '惠普260-p039cn台式电脑',
                        price: 3099
                    }, {
                        name: '华硕飞行堡垒旗舰版FX-PRO',
                        price: 6599
                    }, {
                        name: '惠普(HP)暗影精灵II代PLUS',
                        price: 12999
                    }, {
                        name: '联想(Lenovo)小新700电竞版',
                        price: 5999
                    }, {
                        name: '游戏背光牧马人机械手感键盘',
                        price: 499
                    }, {
                        name: '罗技iK1200背光键盘保护套',
                        price: 799
                    }, {
                        name: '西部数据2.5英寸移动硬盘1TB',
                        price: 419
                    }, {
                        name: '新睿翼3TB 2.5英寸 移动硬盘',
                        price: 849
                    }, {
                        name: 'Rii mini i28无线迷你键盘鼠标',
                        price: 349
                    }, {
                        name: '罗技G29 力反馈游戏方向盘',
                        price: 2999
                    }
                ], [
                    {
                        name: '戴尔成就Vostro 3800-R6308',
                        price: 2999
                    }, {
                        name: '联想IdeaCentre C560',
                        price: 5399
                    }, {
                        name: '惠普260-p039cn台式电脑',
                        price: 3099
                    }, {
                        name: '华硕飞行堡垒旗舰版FX-PRO',
                        price: 6599
                    }, {
                        name: '惠普(HP)暗影精灵II代PLUS',
                        price: 12999
                    }, {
                        name: '联想(Lenovo)小新700电竞版',
                        price: 5999
                    }, {
                        name: '游戏背光牧马人机械手感键盘',
                        price: 499
                    }, {
                        name: '罗技iK1200背光键盘保护套',
                        price: 799
                    }, {
                        name: '西部数据2.5英寸移动硬盘1TB',
                        price: 419
                    }, {
                        name: '新睿翼3TB 2.5英寸 移动硬盘',
                        price: 849
                    }, {
                        name: 'Rii mini i28无线迷你键盘鼠标',
                        price: 349
                    }, {
                        name: '罗技G29 力反馈游戏方向盘',
                        price: 2999
                    }
                ]
            ]
        }
    ];

        //floor
        var $floor=$('.floor');
        function lazyLoadFloor() {
             var items = {},
             loadedItemNum = 0,
             totalItemNum =floor.$floor.length,
             loadItemFn=null;             
             
             $doc.on('floor-show', loadItemFn = function(e, index, elem) {
                 // console.log(1);
                 if (items[index] !== 'loaded') {
                     $doc.trigger('floors-loadItem', [index, elem]);
                 }
             });
             $doc.on('floors-loadItem', function(e, index, elem) {
                 var html=buildFloor(floor.floorData[index]),
                     $elem=$(elem);                
                        
                         items[index] = 'loaded';
                         console.log(items[index]);
                         loadedItemNum++;
                         console.log(index + ': loaded');
                         if (loadedItemNum === totalItemNum) {
                             // 全部加载完毕
                             $doc.trigger('floors-itemsLoaded');
                         }
                         setTimeout(function () {
                             $elem.html(html); 
                             lazyLoadFloorImgs($elem)
                             $elem.tab({
                                event:'mouseenter',// mouseenter或click
                                css3:false,
                                js:false,
                                animation:'fade',
                                activeIndex:0,
                                interval:0,
                                delay:0
                            });


                         },1000);  

                                     

             });

             $doc.on('floors-itemsLoaded', function(e) {
                 console.log('floors-itemsLoaded');

                 // 清除事件
                 $doc.off('floors-show', loadItemFn);
                 $doc.off('scroll resize', floor.showFloor);
                 $doc.off('scroll resize', floor.timeToShow);
             });

        } 

        


        function buildFloor(floorData) {
            var html = '';

            html += '<div class="container">';
            html += buildFloorHead(floorData);
            html += buildFloorBody(floorData);
            html += '</div>';

            return html;
        };

        function buildFloorHead(floorData) {
            var html = '';
            html += '<div class="floor-head">';
            html += '<h2 class="floor-title fl"><span class="floor-title-num">' + floorData.num + 'F</span><span class="floor-title-text">' + floorData.text + '</span></h2>';
            html += '<ul class="tab-item-wrap fr">';
            for (var i = 0; i < floorData.tabs.length; i++) {
                html += '<li class="fl"><a href="javascript:;" class="tab-item">' + floorData.tabs[i] + '</a></li>';
                if (i !== floorData.tabs.length - 1) {
                    html += '<li class="floor-divider fl text-hidden">分隔线</li>';
                }
            }
            html += '</ul>';
            html += '</div>';
            return html;
        }; 

        function buildFloorBody(floorData) {
            var html = '';
            html += '<div class="floor-body">';
            for (var i = 0; i < floorData.items.length; i++) {
                html += '<ul class="tab-panel">';
                for (var j = 0; j < floorData.items[i].length; j++) {
                    html += '<li class="floor-item fl">';
                    html += '<p class="floor-item-pic"><a href="###" target="_blank"><img src="img/floor/loading.gif" class="floor-img" data-src="img/floor/' + floorData.num + '/' + (i + 1) + '/' + (j + 1) + '.png" alt="" /></a></p>';
                    html += '<p class="floor-item-name"><a href="###" target="_blank" class="link">' + floorData.items[i][j].name + '</a></p>';
                    html += '<p class="floor-item-price">' + floorData.items[i][j].price + '</p>';
                    html += '</li>';
                }

                html += '</ul>';
            }

            html += '</div>';

            return html;
        }; 

        var $win=$(window);
        var $doc=$(document);
        function isVisible($elem) {
            return ($win.height()/2 + $win.scrollTop() > $elem.offset().top) && ($win.scrollTop() < $elem.offset().top + $elem.height())
        }
        floor.timeToShow = function() {
            floor.$floor.each(function(index, elem){
                // console.log(24);
                // console.log(elem);
                if (isVisible($(elem))) {
                    console.log('the'+(index+1)+'floor is visible');
                    $doc.trigger('floor-show',[index,elem])
                }
            })
        }
        // $doc.on('scroll resize',floor.timeToShow);
        //为了方便消除滚动反复调用事件
        $doc.on('scroll resize', floor.showFloor=function () {
            clearTimeout(floor.floorTimer);
            floor.floorTimer=setTimeout(floor.timeToShow,250);
        });
        lazyLoadFloor();
        floor.timeToShow();

        floor.whichFloor = function () {
            var num = -1;

            floor.$floor.each(function(index, elem) {
                // console.log(25);
                // console.log(elem);
                var floorData = floor.floorData[index];
                num = index;
                if ($win.height()/2 + $win.scrollTop() < $(elem).offset().top) {
                    num = index - 1;
                    return false
                }
            })
            return num;
        }
        console.log(floor.whichFloor());

        floor.elevator = $('#elevator');
        floor.elevator.items = floor.elevator.find('.elevator-item');

        floor.setElevator = function() {
            var num = floor.whichFloor();

            if (num === -1) {
                floor.elevator.fadeOut();
            } else {
                console.log(-2);
                floor.elevator.fadeIn();
                floor.elevator.items.removeClass('elevator-active');
                floor.elevator.items.eq(num).addClass('elevator-active');
            }
        }

        $doc.on("scroll resize", floor.showElevator = function() {
            clearTimeout(floor.elevatorTimer);
            floor.elevatorTimer = setTimeout(floor.setElevator,50)
        });
        floor.setElevator();

        // floor.elevator.on('click','.elevator-item', function(index) {
        //     $('html, body').animate({
        //         scrollTop: floor.$floor.eq($(this).index()).offset().top
        //     });
        // })
        floor.elevator.items.on('click',function(e) {
            console.log(e.target.id)
            $('html, body').animate({
                scrollTop: floor.$floor.eq(e.target.id).offset().top
            });
        })
       

        // var $focusSlider = $('#focus-slider');
        // $focusSlider.items = {};
        // $focusSlider.loadedItemNum = 0;
        // $focusSlider.totalItemNum = $focusSlider.find('.slider-img').length;
        // $focusSlider.on('slider-show', $focusSlider.loadItem = function(e, index, elem) {
        //     console.log(1);
        //     if ($focusSlider.items[index] !== 'loaded') {
        //         $focusSlider.trigger('slider-loadItem', [index, elem]);
        //     }
        // });
        // $focusSlider.on('slider-loadItem', function(e, index, elem) {
        //         // 按需加载
        //         var $imgs = $(elem).find('.slider-img');
        //         $imgs.each(function(_, el) { // _ 相当占位，不使用该参数。
        //                 var $img = $(el);
        //                 loadImg($img.data('src'), function(url) {
        //                     $img.attr('src', url);
        //                     $focusSlider.items[index] = 'loaded';
        //                     $focusSlider.loadedItemNum++;
        //                     console.log(index + ': loaded');
        //                     if ($focusSlider.loadedItemNum === $focusSlider.totalItemNum) {
        //                         // 全部加载完毕
        //                         $focusSlider.trigger('slider-itemsLoaded');
        //                     }
        //                 }, function(url) {
        //                     console.log('从' + url + '加载图片失败');
        //                     // 多加载一次
        //                     // 显示备用图片
        //                     $img.attr('src', '../img/focus-slider/placeholder.png');
        //                 });

        //             }


        //         });

        //     $focusSlider.on('slider-itemsLoaded', function(e) {
        //         console.log('itemsLoaded');
        //         // 清除事件
        //         $focusSlider.off('slider-show', $focusSlider.loadItem);
        //     });


        //     function loadImg(url, imgLoaded, imgFailed) {
        //         var image = new Image();
        //         image.onerror = function() {
        //             if (typeof imgFailed === 'function') imgFailed(url);
        //         }
        //         image.onload = function() {
        //             if (typeof imgLoaded === 'function') imgLoaded(url);
        //         };
        //         // image.src=url;     
        //         setTimeout(function() {
        //             image.src = url;
        //         }, 1000);

        //     }


        //     $focusSlider.slider({
        //         css3: true,
        //         js: false,
        //         animation: 'fade', // fade  slide
        //         activeIndex: 0,
        //         interval: 0
        //     });



    //todays-slider
            // var $todaysSlider = $('#todays-slider'); 
            // $todaysSlider.items = {}; 
            // $todaysSlider.loadedItemNum = 0; 
            // $todaysSlider.totalItemNum = $todaysSlider.find('.slider-img').length; 
            // $todaysSlider.on('slider-show', $todaysSlider.loadItem = function(e, index, elem) {
            //     console.log(1);
            //     if ($todaysSlider.items[index] !== 'loaded') {
            //         $todaysSlider.trigger('slider-loadItem', [index, elem]);
            //     }
            // }); 
            // $todaysSlider.on('slider-loadItem', function(e, index, elem) {
            //     // 按需加载
            //     var $imgs = $(elem).find('.slider-img');
            //     $imgs.each(function(_, el) { // _ 相当占位，不使用该参数。
            //         var $img = $(el);
            //         loadImg($img.data('src'), function(url) {
            //             $img.attr('src', url);
            //             $todaysSlider.items[index] = 'loaded';
            //             $todaysSlider.loadedItemNum++;
            //             console.log(index + ': loaded');
            //             if ($todaysSlider.loadedItemNum === $todaysSlider.totalItemNum) {
            //                 // 全部加载完毕
            //                 $todaysSlider.trigger('slider-itemsLoaded');
            //             }
            //         }, function(url) {
            //             console.log('从' + url + '加载图片失败');
            //             // 多加载一次
            //             // 显示备用图片
            //             $img.attr('src', '../img/focus-slider/placeholder.png');
            //         });
            //     });

            // });

            // $todaysSlider.on('slider-itemsLoaded', function(e) {
            //     console.log('itemsLoaded');
            //     // 清除事件
            //     $todaysSlider.off('slider-show', $todaysSlider.loadItem);
            // });


            // function loadImg(url, imgLoaded, imgFailed) {
            //     var image = new Image();
            //     image.onerror = function() {
            //         if (typeof imgFailed === 'function') imgFailed(url);
            //     }
            //     image.onload = function() {
            //         if (typeof imgLoaded === 'function') imgLoaded(url);
            //     };
            //     // image.src=url;     
            //     setTimeout(function() {
            //         image.src = url;
            //     }, 1000);

            // }


            // $todaysSlider.slider({
            //     css3: true,
            //     js: false,
            //     animation: 'fade', // fade  slide
            //     activeIndex: 0,
            //     interval: 0
            // });

        })(jQuery);