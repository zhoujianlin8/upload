yp.use('ZeroClipboard.min', function (yp, ZeroClipboard) {
    yp.ready(function () {
        window.ZeroClipboard = ZeroClipboard;
        var ui = {
            $tab: $('[data-toggle=tab]'),
            $tabC: $('[data-content=tab]'),
            $modal: $('[data-content=modal]'),
            $receive: $('[data-receive]'),
            $linkUrl: $('#linkUrl')
        };
        var oPageSpread = {
            init:function () {
                this.view();
                this.bindEvent();
            },
            view:function () {
                this.fClip();
                $('.bshare-custom').each(function (i) {
                    if (i == 0) {
                        bShare.addEntry({
                            title:'推广链接',
                            url:ui.$linkUrl.val()
                        });
                    } else {
                        bShare.addEntry({
                        });
                    }
                })
            },
            bindEvent:function () {
                //tab切换
                ui.$tab.on('click', 'li', function () {
                    var i = $(this).index();
                    $(this).addClass('cur').siblings('li').removeClass('cur');
                    ui.$tabC.eq(i).addClass('cur').siblings().removeClass('cur');
                })
                //点击领取
                ui.$receive.on('click', function () {
                    var $this = $(this);
                    var url = '/?c=ucenter&a=getMyReward';
                    var param = {
                        pid:$this.attr('data-receive')
                    }
                    $.post(url, param, function (msg) {
                        if (msg.code == 0) {
                            ui.$modal.removeClass('hide').show();
                            $this.replaceWith('已领取')
                        } else {
                            alert(msg.message)
                        }
                    }, "json")
                })
                //modal 弹出层关闭
                ui.$modal.on('click', '[data-close=modal]', function (e) {
                    $(e.delegateTarget).hide().addClass('hide');
                })
            },
            fClip:function () {
                var clip = new ZeroClipboard($("#clip_button"), {
                    moviePath: window.STATICS_PATH +  "j/ZeroClipboard.swf"
                });
            }
        }
        oPageSpread.init();
    });
});

