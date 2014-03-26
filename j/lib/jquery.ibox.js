(function($){
	var _top = self != top ? window.top : self; //取得顶级操作对象
	_$ = self != top ? window.top.$ : $; //把ibox要用到的操作对像指针指为 window.top.$
	$.fn.ibox = function(opts){
		opts = opts || {};
		$(this).click(function(){
			var o = {};
			o.url = $(this).attr('href');
			if(this.title) o.title = this.title;
			var rel = {};
			if(this.rel) rel = eval("("+this.rel+")");
			$.extend(o, opts, rel);
			$(this).blur();
			ibox.show(o);
			return false;
		});
	};
	ibox = {
		indexID : 0, //自增ID, 给弹层赋ID
		iNum : 0, //储存弹出层数,
		id : '',
		nextShow : [],
		cacheCfg : {},
		config : {
			title : '标题',
			titleIco : 'ico i1',
			overlay : true,
			width : 640,
			btn: [['确定'], ['取消']]
		},
		init : {
			iboxShowAlert : true, //是否用 ibox的方式展示alert
			iboxShowConfirm : true
		},
		loading : function(t, w) {
			t = t || 'Loading...';
			_$('body').append('<div class="iboxLD" id="iBoxLD"><i></i><em>'+t+'</em></div>');
			var el = _$('#iBoxLD');
			if (w) el.width(w);
			el.css('margin-left', '-'+(parseInt(el.outerWidth()/2))+'px')
				.css('margin-top', '-'+(parseInt(el.outerHeight()/2))+'px')
				.css('z-index', ibox.z(3))
				.show();
		},
		removeLoading : function(){
			_$('#iBoxLD').remove();
		},
		overlay : function(){//调用遮照
			var overlayDom = _$('#iBoxOL');
			if (!overlayDom.length) {
				_$('body').append('<div class="iboxOLS iboxOL" id="iBoxOL"></div>');
				overlayDom = _$('#iBoxOL');
				if ($.browser.msie && ($.browser.version == "6.0")) {
					overlayDom.append('<iframe frameBorder="0"></iframe>');
					overlayDom.css("opacity",0.4);
				}else{
					overlayDom.animate({opacity: 0.4}, 250);
				}
			}
			overlayDom.css('z-index', ibox.z(2));
		},
		removeOverlay : function(){
			var overlayDom = _$('#iBoxOL');
			overlayDom.stop();
			if (ibox.iNum > 0) {
				var indexID = ibox.getLastId('indexID');
				overlayDom.css('z-index', ibox.z(2, indexID));
			} else {
				overlayDom.detach();
			}
		},
		show : function(opts) {
			opts = opts || {};
			opts = $.extend({},ibox.config, opts);//初始化配置
			//alert(opts.title, true);
			ibox.id = opts.id ? opts.id : 'iBox'+ibox.indexID;//设置窗口ID
			if(opts.closeTop){
				ibox.nextShow[ibox.getLastId()] = true; 
				ibox.close();
				//弹开前关闭前一层
			}
			if (opts.overlay) ibox.overlay();
			if (opts.url) {
				ibox.loading(opts.loadingText);
				if (!opts.iframe) {
					$.ajax({
						type    : (opts.ajaxType || 'GET'),
						data    : (opts.data || ''),
						url : opts.url,
						success : function(data){
							opts.content = data;
							ibox.window(opts);
						}
					});
					return '#'+ibox.id;
				}
				opts.content = '<iframe frameborder="0" hspace="0" src="'+opts.url+'" class="iBoxIF" name="iBoxIF'+Math.round(Math.random()*1000)+'" onload="ibox.showWindow()"></iframe>';
				ibox.window(opts);
				return ibox.id;
			}
			ibox.window(opts);
			return _$('#'+ibox.id);
		},
		window : function(opts) {
			if(ibox.autoClose.par) clearInterval(ibox.autoClose.par);
			bodyRevise = 0;
			var btnFun = [];
			var btnNum = 0;
			var html = '<div class="iboxWD" id="'+ibox.id+'" indexId="'+ibox.indexID+'">';
			if ((!opts.hideTitle && opts.title) || !opts.hideClose) {
				html += '<div class="iboxHd">';
				html += !opts.hideClose ? '<a href="###" class="close iboxClose"></a>' : '';
				btnFun[btnNum] = ibox.close;btnNum++;
				html += opts.titleIco ? '<i class="'+opts.titleIco+'"></i>' : '';
				html += (!opts.hideTitle && opts.title) ? '<strong class="vm">'+opts.title+'</strong>' : '';
				html += '</div>';
				// 计算 主体区域 高度修正值
				bodyRevise += 30;
			}
			if (!opts.iframe) {//加载不是iframe时的内容
				if (opts.icon) opts.content = '<div class="center"><i class="icon '+opts.icon+' mr10"></i><em class="vm">'+opts.content+'</em></div>';
				html += '<div class="iboxBd">'+opts.content+'</div>';
			} else {
				html += opts.content;
			}
			if (opts.btn) {
				html += '<div class="iboxFt">';
				if ($.isArray(opts.btn)){
					if (!$.isArray(opts.btn[0])) {
						opts.btn = [opts.btn];
					}
					for (i = 0; i < opts.btn.length; i++) {
						html += '<a href="###" class="btn btn1 iboxClose"><b>'+opts.btn[i][0]+'</b></a>';
						btnFun[btnNum] = opts.btn[i][1] ? opts.btn[i][1] : ibox.close;
						btnNum++;
					}
				}
				html += '</div>';
				bodyRevise += 35;
			}
			html += '</div>';
			ibox.cacheCfg.width = opts.width;
			ibox.cacheCfg.height = opts.height;
			ibox.cacheCfg.bodyRevise = bodyRevise;
			ibox.cacheCfg.iframe = opts.iframe;
			ibox.cacheCfg.time = opts.time;
			_$('body').append(html);
			ibox.nextShow[ibox.id] = null;
			if (opts.nextShow) ibox.nextShow[ibox.id] = true;
			if (!opts.iframe && $.isFunction(opts.appended)) {
				opts.appended(_$('#'+ibox.id));
			}
			_$('#'+ibox.id+' .iboxClose').each(function(i){
				$(this).click(function() {
					btnFun[i](_$);
				});
			});
			if (!opts.iframe) ibox.showWindow();
			return true;
		},
		showWindow : function(){
			opts = ibox.cacheCfg;
			ibox.cacheCfg = {};
			var el = _$('#'+ibox.id);
			if (opts.width) el.width(opts.width);
			var windowH = _$(window).height();
			var elH = el.height();
			if (!opts.iframe){
				if (elH > windowH) {
					el.children('.iboxBd').height(windowH - bodyRevise - 80);
				} else if(opts.height) {
					el.children('.iboxBd').height((opts.height > windowH ? windowH : opts.height) - bodyRevise - 80);
				}
			} else {
				el.children('.iBoxIF').width(opts.width).height((opts.height ? opts.height : el.height())- bodyRevise);
			}
			el.css('z-index', ibox.z(4));
			ibox.resize();
			ibox.removeLoading();
			if (opts.time) {
				ibox.autoClose.time = opts.time;
				ibox.autoClose.par = setInterval("ibox.autoClose.fun("+opts.id+")", 1000);
				_$('#'+ibox.id+' .iBoxCloseTime').text(opts.time);
			}
			el.show();
			//el.index().focus();
			ibox.indexID ++;
			ibox.iNum ++;
		},
		resize : function(w, h) {
			var el = _$('#'+ibox.id);
			if (w) el.width(w);
			if (h) el.height(h);
			var windowH = _$(window).height()-80;
			var elH = el.height();
			if (elH > windowH) {
				var bodyRevise = 0;
				if (el.children('.iboxHd').length) bodyRevise += 30;
				if (el.children('.iboxFt').length) bodyRevise += 35;
				el.children('.iboxBd').height(windowH - bodyRevise);
			}
			el.css('margin-left', '-'+(parseInt(el.outerWidth()/2))+'px')
			.css('margin-top', '-'+(parseInt(el.outerHeight()/2))+'px');
		},
		close : function(dom, id) {
			if (id == undefined) {
				id = ibox.getLastId();
			}
			if(ibox.autoClose.par) clearInterval(ibox.autoClose.par);
			_$('#'+id).remove();
			ibox.iNum --;
			if (ibox.iNum == 0) ibox.indexID = 0;
			if (!ibox.nextShow[id]) ibox.removeOverlay();
		},
		autoClose : {time:0, par:null, fun:function(id){
			//自动关闭
			ibox.autoClose.time --;
			_$('#'+ibox.id+' .iBoxCloseTime').text(ibox.autoClose.time);
			if(ibox.autoClose.time == 0) {
				ibox.close();
			}
		}},
		z : function(i, indexID) {
			indexID = indexID != undefined ? indexID : this.indexID;
			return 100 + indexID * 10 + i;
		},
		getLastId : function(attr){
			attr = attr || 'id';
			return _$('.iboxWD:last').attr(attr);
		}
	};
	iAlert = function(msg, icon, opts) {
		if (icon === true) return _alert(msg);
		var config = {
			width : 260,
			title : '提示',
			btn : ['确定']
		};
		config.content = msg;
		config.icon = icon;
		$.extend(config, opts);
		ibox.show(config);
	}
	iShow = function(opts) {
		ibox.show(opts);
	}
	if (self != top) {
		ibox = window.top.ibox; //框加时 移交到顶层iboc去执行
	}
	//表单ajax提交
	
	$.fn.ajaxSubmit = function(opts){
		if (opts === false) return $(this).submit();
		opts = opts || {};
		var info = $(this).getFormData(opts);
		var successFun = $.isFunction(opts) ? opts : (opts.success ? opts.success : function(data){
				if(!data){
					iAlert('没有返回数据!', 'i13');
				} else if (data == 1) {
					iAlert('操作成功!', 'i11', {closeTop:true});
				} else if (data == 0) {
					iAlert('操作失败!', 'i12');
				} else {
					iAlert(data);
				};
			});
		if (!info.url) return false;
		$.ajax({
			type    : info.type || 'POST',
			data    : info.data || '',
			url     : info.url,
			success : successFun,
			error : function(obj){
				if(obj.status == 404){
					iAlert(info.url + '不存在!', 'i12');
				}
			}
		});
	}
	$.fn.getFormData = function(opts) {
		opts = opts || {};
		var info = {};
		info.url = opts.url || $(this).attr('action');
		info.type = opts.type || $(this).attr('method');
		info.data = opts.data ? opts.data : '';
		$.each($(this).find('input,select,textarea'), function(i){
			if(this.disabled == true) return;
			var tagName = $(this).attr("tagName");
			var name = $(this).attr('name');
			var val = $(this).val();
			if(val === '') return;
			val = encodeURIComponent(val);
			if(tagName == 'INPUT'){
				var type = $(this).attr('type');
				switch(type){
					case 'text': case 'password': case 'file': case 'hidden':
						info.data += (info.data ? '&' : '')+ name+'='+val+'';
					break;
					case 'checkbox':
						if(this.checked) info.data += (info.data ? '&' : '')+ name+'\[\]='+val+'';
					break;
					case 'radio':
						if(this.checked) info.data += (info.data ? '&' : '')+ name+'='+val+'';
					break;
				}
			} else if(tagName == "SELECT" || tagName == "TEXTAREA") {
				info.data += '&'+ name+'='+val+'';
			}
		});
		return info;
	}
	//用ibox 展示alert ,储存_alert 为原生方法
	if (ibox.init.iboxShowAlert) _alert = window.alert; window.alert = iAlert;
})(jQuery);
$(document).keydown(function(e){
	if(e.which == 27){ 
		ibox.close();
	} 
});