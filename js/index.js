(function($) {

    //menu
    $(".dropdown").dropdown({

        css3: true,
        js: false

    });

    $('.dropdown').on('dropdown-show', function(e) {
        var $this = $(this),
            dataLoad = $this.data('load');

        if (!dataLoad) return;

        if (!$this.data('loaded')) {
            var $layer = $this.find('.dropdown-layer'),
                html = '';

            $.getJSON(dataLoad, function(data) {
                // console.log(1);
                // setTimeout(function () {
                for (var i = 0; i < data.length; i++) {
                    html += '<li><a href="' + data[i].url + '" target="_blank" class="menu-item">' + data[i].name + '</a></li>'
                }
                $layer.html(html);
                $this.data('loaded', true);
                // }, 1000);
            });
        }
    });

    //header search
    var $headerSearch = $('#header-search');
    var html = '',
        maxNum = 10;
    $headerSearch.search({
        autocomplete: true,
        css3: false,
        js: false,
        animation: 'fade'
    });
       
    $headerSearch.on('search-getData', function (e,data, $layer) {
        var $this = $(this);
        html = createHeaderSearchLayer(data, maxNum);
        console.log(html)
        $this.search('appendLayer', html)
        //如果有值则显示
        if (html) {
           $this.search('showLayer')
        } else {
           $this.search('hideLayer')
        }
    }).on('search-noData', function(e,$layer) {
        $(this).search('hideLayer')
        $(this).search('appendLayer', '')
    }).on('click', '.search-layer-item', function () {
      //获取下拉菜单中点击的值，讲输入框的内容改写点击的值
        $headerSearch.search('setInputVal', $(this).html())
        $headerSearch.search('submit')
     })

    function createHeaderSearchLayer(data, maxNum) {
       
        var html = '',
        dataNum = data['result'].length;
        if (dataNum === 0) {
            return''
        }
        for (var i = 0; i < dataNum; i++) {
            if (dataNum > maxNum) {break;}
            html +=  '<li class="search-layer-item text-ellipsis">' + data['result'][i][0] + '</li>';
        }
        return html;
    }



})(jQuery);