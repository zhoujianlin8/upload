/* ===========================================================
 * 标签切换 v1.0.2.5
 * xiewu 2013.3.16
 * ========================================================== */

;!function($) {

  "use strict"; // jshint ;_;

var
  // 简单对象扩展函数
  _$ = _$ || $

, Tabs = function(element, options) {
    this.init('tabs', element, options);
  }

  Tabs.prototype = {
    constructor: Tabs
    // 初始化
  , init: function (type, element, options) {
      this.type = type;
      this.$element = $(element);
      this.options = this.getOptions(options);

      var opts = this.options
        , $e = this.$element
        , type = this.type
      
      if (opts.triggerPanel) this.$triggerPanel = $(opts.triggerPanel, $e);///
      if (opts.targetPanel) this.$targetPanel = $(opts.targetPanel, $e);///
      this.$tabActive = $(null);///
      this.refresh(opts.active);

      $e.on(opts.eventType + '.' + type, opts.trigger, $.proxy(this.enter, this));
      $e.on('click' + '.' + type, opts.close, $.proxy(this.destroy, this));
    }
    // 设置选项
  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data());

      options.trigger = options.trigger || options.tab;
      options.target = options.target || options.tabc;

      return options;
    }
    // 刷新缓存
  , refresh: function(index) {
      var opts = this.options
        , $e = this.$element
      this.$eTriggers = $(opts.trigger, $e);///
      this.$eTargets = $(opts.target, $e);///

      if (index != null) this.active(index);
    }
    // 触发激活事件
  , enter: function (e) {
      var self = this///
        , $trigger = $(e.currentTarget)
        , opts = self.options
        , index = self.$eTriggers.index($trigger)
      self.active(index, $trigger);
    }
    // 激活标签
  , active: function(index, $trigger) {
      var $trigger = $trigger || this.$eTriggers.eq(index)
        , $target = this.$eTargets.eq(index)
        , cur = this.options.cur

      this.$tabActive.removeClass(cur);
      this.$tabActive = $trigger.add($target).addClass(cur);

      this.$element.trigger('tabsactive', {index:index});///
    }
    // 触发关闭事件
  , destroy: function(e) {
      var self = this///
        , opts = self.options
        , trigger = opts.trigger
        , $trigger = $(e.currentTarget).closest(trigger)
        , index = self.$eTriggers.index($trigger)

      self.$element.trigger('tabsclose', {index:index});///
      self.close(index, $trigger);

      return false;///
    }
    // 关闭标签
  , close: function(index, $trigger) {
      var $trigger = $trigger || this.$eTriggers.eq(index)///
        , $target = this.$eTargets.eq(index)
        , indexNext

      if ($trigger.hasClass(this.options.cur) && this.$eTriggers.length - 1 > 0) {
        indexNext = index < this.$eTriggers.length - 1 ? index : index - 1;
      }
      $trigger.add($target).remove();
      this.refresh(indexNext);///
    }
    // 添加标签
  , addTab: function(title, content, index) {
      var self = this///
        , $triggerPanel = self.$triggerPanel || this.$eTriggers.parent()
        , $targetPanel = self.$targetPanel || this.$eTargets.parent()

      $triggerPanel.append(title);
      $targetPanel.append(content);
      index = self.$eTriggers.length;///
      self.refresh(index);///

      self.$element.trigger('tabsadd', {index:index});/////
    }
  }

  $.fn.tabs = function ( option ) {
    var args = 2 <= arguments.length ? [].slice.call(arguments, 1) : []
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tabs')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tabs', (data = new Tabs(this, options)));
      if (typeof option === 'string') data[option].apply(data, args);
    });
  };
  $.fn.tabs.Constructor = Tabs;

  $.fn.tabs.defaults = {
    tab: '.tab'
  , tabc: '.tabc'
  , close: '.close'
  , closeTo: '-1'
  , trigger: ''
  , target: ''
  , triggerPanel: ''
  , targetPanel: ''
  , cur: 'cur'
  , active: '0'
  , eventType: 'click'
  };
}(jQuery);