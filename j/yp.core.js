!function($, yp) {
var
  win = this
, exports = yp
, loader = exports.loader

, api = {
    plugNames: {},
    init: function() {
      ///
    },
    getElements: function(selector, container) {
      return $(selector, container).not('[disinit]');
    },
    addPlug: function(plugs) {
      plugs = $.makeArray(plugs);
      $.each(plugs, function(i, v) {
        if (!api.plugNames[v]) {
          var k = (v === 'form' ? '0' : v)
          if (moduleList[v].register) api.plugNames[k] = v;
          $.pub('mod-ready-' + v);
          $.pub('mod-init-' + v);///
        }
      });
      return this;
    },
    register: function(plugs, container) {
      $.each(plugs, function(i, v) {
        moduleList[v].register(container);
      });
      return this;
    },
    update: function(container, plugs) {
      if (!plugs) plugs = this.plugNames;///
      this.register(plugs, container);
      return this;
    }
  }
, moduleList = {}

  moduleList.tabs = {
    selector:'.tabs',
    register: function(container) {
      api.getElements(this.selector, container).each(function(){
        $(this).tabs();
      });
    }
  };

  api.init();

  // 监听组件初始化
  $.sub('loader-ready.mod', function(e, mod) {
    /*mod = $.grep(mod, function(v) {
      return moduleList[v];
    });*/
    moduleList[mod] && api.addPlug(mod);///
  });

  // 监听页面更新，初始化插件模块
  $.sub('loader-ready-page.mod', function() {
    api.update('body');
  });
  $.sub('ui-update.mod', function(e, target) {
    api.update(target);
  });

  api.moduleList = moduleList;
  exports.modules = api;
  define( 'yp.mods', ['form'], function() { return api; } );
}(jQuery, yp);