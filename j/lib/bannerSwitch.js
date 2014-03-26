var bannerSwitch = function ( element, options ) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.bannerSwitch.defaults, options);
    this.init();
}

bannerSwitch.prototype = {
    constructor: bannerSwitch,
    ui: {},
    aTempImg: [],

    init: function(){
        var self = this;

        self.ui.$banner = $(self.$element.data('target'));
        self.ui.$jumplink = $(self.$element.data('jumplink'));
        self.ui.$switch = self.$element.find('.switch');

        self.bindEvent();
        self.ui.$switch.eq(0).trigger('click');
    },

    bindEvent: function(){
        var self = this;

        self.ui.$switch.on('click', function() {
            var $this = $(this);
            self.ui.$switch.removeClass('cur');
            $this.addClass('cur');
            self.fSwitchBanner($this.data('src'), $this.data('link'));
        });
    },

    // 切换banner
    fSwitchBanner: function(sSrc, sLink){
        var self = this;
        if(-1 < $.inArray(sSrc, self.aTempImg)){
            // 图片已经载入，直接切换banner
            self.fDoSwitchBanner(sSrc, sLink);
        } else {
            // 先载入图片，再切换banner
            self.ui.$banner.find('.loading').show();
            self.fLoadImg(sSrc, function(sSrc){
                self.ui.$banner.find('.loading').hide();
                self.aTempImg.push(sSrc);   // 标示图片已载入
                self.fDoSwitchBanner(sSrc, sLink);
            });
        }
    },

    // 载入图片
    fLoadImg: function(sSrc, callback){
        var self = this;
        var oBgImg = new Image();
        oBgImg.onload = function() {
            callback(sSrc);
        }
        oBgImg.src = sSrc;
    },

    // 进行banner切换
    fDoSwitchBanner: function(sSrc, sLink){
        var self = this;

        self.$element.find('.banner:gt(0)').remove();
        var $bgOld = self.ui.$banner,
            $bgNew = self.ui.$banner = $('<div class="banner png"><div class="loading"></div></div>');

        $bgNew.css('background-image', 'url('+ sSrc +')');
        $bgOld.before($bgNew);
        $bgNew.fadeIn(1000);
        $bgOld.fadeOut(1000, function() {
            $bgOld.remove();
        });

        self.ui.$jumplink.attr('href', sLink);
    }
}

$.fn.bannerSwitch = function ( option ) {
  var arg = arguments;
  arg = [].slice.call(arg, 1);

  return this.each(function () {
    var $this = $(this)
      , data = $this.data('bannerSwitch')
      , options = typeof option == 'object' && option;
    if (!data) $this.data('bannerSwitch', (data = new bannerSwitch(this, options)));
  });
};

$.fn.bannerSwitch.defaults = {};

$.fn.bannerSwitch.Constructor = bannerSwitch;