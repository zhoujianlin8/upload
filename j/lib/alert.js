$(function () {
  var ui = {};
  ui.$wrapModal = $('#wrapModal');
  var oAlert = {
    init:function () {
      this.fAlert();
    },
    fAlert: function(){
      $.alert=function(opt){
        if(!$.alert.arguments.length){alert("请设置alert参数"); return false}
        var title=opt.title || "温馨提示";
        var content=opt.content || opt;
        var event=opt.event || "click tip";
        var callback=opt.callback;
        var width=opt.width || '300px';
        var nScropTop=$(window).scrollTop()+200;
        var tmpl='<div class="mask"></div>\
            <div class="pop" data-toggle="alert" style="z-index:10001; position:absolute; width: '+width+'; top:'+nScropTop+'px;left:40%">\
            <div class="popHd" style="cursor:move;">\
            <div class="popTopLeft png"></div>\
            <div class="popTopRight png">\
            <b class="icon"><img src="' + window.STATICS_PATH + 'i/icon.png" alt=""></b>\
            <span class="dv">'+title+'</span>\
            <a href="javascript:void(0)" class="close" data-close="alert"></a>\
            </div>\
            </div>\
            <div class="popLeftBg png">\
            <div class="popRightBg png">\
            <div class="popCont">\
            <div class="info">\
            <b><img class="png" src="' + window.STATICS_PATH + 'i/404error.png" alt=""></b>\
            <span>'+content+'</span>\
            </div>\
            <div class="popBtnWrap textC">\
            <a href="javascript:void(0)" class="popBtn61x25 png" data-sure="alert">确 定</a>\
            </div>\
            </div>\
            </div>\
            </div>\
            <div class="popBottom png">\
            <div class="popBottomLeft png"></div>\
            <div class="popBottomRight png"></div>\
            </div>\
            </div>';
        ui.$wrapModal.append(tmpl);
        $('body').on(event,'[data-close=alert]',function(){
          ui.$wrapModal.empty();
        })
        $('body').on(event,'[data-sure=alert]',function(){
          callback && callback($(this));
          ui.$wrapModal.empty();
        })
        $('[data-toggle=alert]').draggable({handle: '.popHd'});
        return false;
      }
      window.alert= $.alert;
    }
  };
  oAlert.init();
});