var newTipsCollapse = function ( element ) {
  this.$element = $(element);
  this.init();
}

newTipsCollapse.prototype = {
  constructor: newTipsCollapse,
  ui: {},

  init: function(){
    var self = this;

    self.ui.$ul = self.$element.find('[data-scrolling="content"]');
    self.ui.$next = self.$element.find('[data-scrolling="next"]');
    self.ui.$prev = self.$element.find('[data-scrolling="prev"]');

    var len = self.ui.$ul.find('>li').length
      , liWidth = self.ui.$ul.find('>li').width()
      , timer = null
      , ulLeft = 0;

    timer = setInterval(function(){
      self.ui.$next.trigger('click');
    },6000);
    self.$element.on('mouseenter',function(){
      clearInterval(timer);
    });
    self.$element.on('mouseleave',function(){
      timer = setInterval(function(){
        self.ui.$next.trigger('click');
      },6000);
    });
    self.ui.$prev.on('click',function(){
      if(self.ui.$ul.is(":animated")){
        return false;
      };
      if(ulLeft >= 0){
        self.ui.$ul.find('>li').eq(len-1).css('left',-liWidth*len).css('position', 'relative');
        ulLeft = ulLeft + liWidth;
        fAnimate(function(){
          self.ui.$ul.css("left",-liWidth*(len-1));
          ulLeft = -liWidth * (len - 1);
          self.ui.$ul.find('>li').eq(len - 1).css("left",0).css('position', '');
        });
        return false
      }else{
        ulLeft = ulLeft + liWidth;
        fAnimate();
      }
      return false;
    });
    self.ui.$next.on('click',function(){
      if(self.ui.$ul.is(":animated")){
        return false
      };
      if(-ulLeft >= liWidth * (len - 1)){
        self.ui.$ul.find('>li').eq(0).css("left",liWidth*len).css('position', 'relative');
        ulLeft = ulLeft - liWidth;
        fAnimate(function(){
          self.ui.$ul.css("left", 0);
          ulLeft=0;
          self.ui.$ul.find('>li').eq(0).css("left",0).css('position', '');
        });
        return false
      }else{
        ulLeft = ulLeft-liWidth;
        fAnimate();
      }
      return false;
    });
    function fAnimate(callback){
      self.ui.$ul.animate({
        left: ulLeft
      },300,function(){
        callback && callback();
      })
    }
  }
}

$.fn.newTipsCollapse = function () {
  return this.each(function () {
  var $this = $(this)
    , data = $this.data('newTipsCollapse');

  if (!data) $this.data('newTipsCollapse', (data = new newTipsCollapse(this)));
  });
};

$.fn.newTipsCollapse.Constructor = newTipsCollapse;