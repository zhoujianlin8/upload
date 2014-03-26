yp.ready(function () {
    var ui = {
        $payType_nav:$('#payType_nav'),
        $blocks:$('div[data-type=block]')
    };
    var oPage = {
        init:function () {
            this.view();
            this.bindEvent();
        },
        view:function () {

        },
        bindEvent:function () {
            var self = this;
            ui.$payType_nav.on('click', 'li', function () {
                var $this = $(this);
                var index = $this.index();
                $this.addClass('cur').siblings().removeClass('cur');
                self.fShowPayContent(index);
            });
        },
        fShowPayContent:function (index) {
            ui.$blocks.each(function (i) {
                if (index == i) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            })
        }
    };

    oPage.init();
})

