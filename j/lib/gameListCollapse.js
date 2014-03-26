var gameListCollapse = function ( element ) {
  this.init( element );
}

gameListCollapse.prototype = {
  constructor: gameListCollapse

, init: function( element ){
    var self = this;

    self.$element = $(element);
    self.ui = {};
    self.ui.$numList = self.$element.find('.numList');
    self.ui.$picList = self.$element.find('.gallery');

    self.ui.$numList.on('click','a:not(.cur)', function(){
      var i = $(this).index();
      self.fAnimate(i);
    });
  }
, fAnimate: function(nIndex){
    var self = this
      , picWidth = self.ui.$picList.width();

    if(self.ui.$picList.find('.cur').is(":animated")){
      return false;     //如果正在进行动画点击操作无效
    }
    self.ui.$numList.find('a').removeClass('cur').eq(nIndex).addClass('cur');
    self.ui.$picList.find('.cur').animate({
      left: -picWidth
    },400,function(){
      $(this).removeClass('cur');
      $(this).css('left', picWidth);
    });
    self.ui.$picList.children().eq(nIndex).animate({
      left: 0
    },400,function(){
      $(this).addClass('cur');
    });
  }
}

$.fn.gameListCollapse = function () {
  return this.each(function () {
    var $this = $(this)
      , data = $this.data('gameListCollapse');

    if (!data) $this.data('gameListCollapse', (data = new gameListCollapse(this)));
  });
};

$.fn.gameListCollapse.Constructor = gameListCollapse;