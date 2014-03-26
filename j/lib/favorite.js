$(function () {

  var ui = {};
  ui.$addFavorite = $('#addFavorite');

  var oFavorite = {
    init:function () {
      this.bindEvent();
    },
    bindEvent:function () {
      var self=this;
      //加入收藏夹
      ui.$addFavorite.on('click',function(){
        var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
        if (document.all) {
          window.external.addFavorite(document.URL, document.title)
        } else if (window.sidebar) {
          window.sidebar.addPanel(document.title, document.URL, "")
        } else {//添加收藏的快捷键
          alert('添加失败\n您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹') //chrome
        }
      })
    }
  };

  oFavorite.init();
});