var gameBannerCollapse = function ( element ) {
  this.init( element );
}

gameBannerCollapse.prototype = {
  constructor: gameBannerCollapse
, nTimer: 0
, ui: {}

, init: function( element ){
    var self = this;
    self.$element = $(element);
    self.ui.$numList = self.$element.find('.num');
    self.ui.$picList = self.$element.find('.bannerPic');

    self.bindEvenr();
    self.timer = setInterval(function(){
      self.fNext();
    }, 6000);
  }
, bindEvenr: function(){
    var self = this;

    self.$element.on('mouseenter', function () {
      clearInterval(self.timer);
    });
    self.$element.on('mouseleave', function () {
      self.timer = setInterval(function(){
        self.fNext();
      }, 6000);
    });
    self.ui.$numList.on('click', 'li:not(.cur)', function () {
      var i = $(this).index();
      self.fAnimate(i);
      return false;
    });
  }
, fNext: function(){
    var self = this
      , len = self.ui.$picList.find('li').length;

    var i = self.ui.$numList.find('.cur').index();
    if (i == len - 1) {
        self.fAnimate(0)
    } else {
        self.fAnimate(i + 1)
    }
    return false;
  }
, fAnimate: function(i){
    var self = this
      , picWidth = self.ui.$picList.width();

    if(self.ui.$picList.find('.cur').is(":animated")) {
      return false;     //如果正在进行动画点击操作无效
    }
    self.ui.$numList.find('li').removeClass('cur').eq(i).addClass('cur');
    self.ui.$picList.find('.cur').animate({
      left:-picWidth
    }, 400, function () {
      $(this).removeClass('cur');
      $(this).css('left', picWidth);
    });
    self.ui.$picList.find('li').eq(i).animate({
      left:0
    }, 400, function () {
      $(this).addClass('cur');
    });
  }
}

$.fn.gameBannerCollapse = function () {
  return this.each(function () {
    var $this = $(this)
      , data = $this.data('gameBannerCollapse');

    if (!data) $this.data('gameBannerCollapse', (data = new gameBannerCollapse(this)));
  });
};

$.fn.gameBannerCollapse.Constructor = gameBannerCollapse;