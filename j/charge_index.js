yp.use('jquery.form,jquery.tmpl.min,jquery.placeholder.min',function(){
    yp.ready(function(){
        var ui = {
            $main: $('#main'),
            $div_charge_content: $('#div_charge_content'),
            $leftSideNav: $('#leftSideNav'),
            $rightSideNav: $('#rightSideNav'),
            $btn_top: $('#btn_top'),
            $mask: $('#mask'),
            $dialog_demo: $('#dialog_demo'),
            $dialog_order_search: $('#dialog_order_search'),
            $dialog_balance_search: $('#dialog_balance_search'),
            $dialog_ask: $('#dialog_ask'),
            modalClose: '[data-close=modal]',
            $placeholder: $('[placeholder]')
        }

        var oPage = {
            init: function() {
                this.view();
                this.bindEvent();
            },
            view: function() {
                this.fSetChargeContent();
                ui.$placeholder.placeholder();
            },
            bindEvent: function() {
                var self = this;
                var timeout=false;
                // 左侧导航
                ui.$leftSideNav.on('click', 'li', function() {
                    var type = $(this).data('type'),
                        index = $(this).index();
                    self.fSetLeftSideCur(index);
                    self.fLoadContent(type)
                });
                // 右侧滑到导航
                $(window).on('scroll.charge', function() {
                    if (timeout){
                        clearTimeout(timeout);
                    }
                    var top = self.fRightNavMaxTop(),
                        nScrollTop = $(this).scrollTop();
                    if(top > nScrollTop) {
                        top = nScrollTop;
                    }
                    timeout = setTimeout(function(){
                        ui.$rightSideNav.animate({
                            top:top
                        },50);
                    },80);
                })

                ui.$rightSideNav.on('click', 'a', function() {
                    var id = this.id;
                    if(id == 'btn_kefu') {

                    } else if(id == 'btn_top') {
                        $(window).scrollTop(0);
                    } else if(id == 'btn_ask') {

                    } else {
                        var $dialog,$this,url;
                        ui.$mask.removeClass('hide');
                        if(id == 'btn_demo') {
                            $dialog = ui.$dialog_demo;
                            ui.$dialog_demo.removeClass('hide');
                        } else if(id == 'btn_order_search') {
                            //订单查询
                            $this = $dialog = ui.$dialog_order_search;
                            if(!$this.data('ing')) {
                                $this.data('ing', true);
                                url="/index.php?c=charge&a=selectOrder";
                                $.post(url,function(msg){
                                    if(msg.code == 0){
                                        self.fPayOrder(msg.data);
                                        $this.removeClass('hide');
                                    }else if(msg.code == 11012 || msg.code == -1){
                                        location.href='/index.php?c=index&a=login';
                                    }else{
                                        alert(msg.message);
                                        ui.$mask.addClass('hide');
                                    }
                                },'json');
                                $this.data('ing',false)
                            }

                        } else if(id == 'btn_balance_search') {
                            //余额查询
                            $this = $dialog = ui.$dialog_balance_search;
                            if(!$this.data('ing')) {
                                $this.data('ing', true);
                                url="/index.php?c=ucenter&a=getBalance";
                                $.post(url,function(msg){
                                    if(msg.code == 0){
                                        if(msg.data){
                                            if(msg.data.info){
                                                var data=$this.tmpl(msg.data.info);
                                                $this.html(data);
                                            }
                                        }
                                        $this.removeClass('hide');
                                    }else if(msg.code == 11012 || msg.code == -1){
                                        location.href='/index.php?c=index&a=login';
                                    }else{
                                        alert(msg.message);
                                        ui.$mask.addClass('hide');
                                    }
                                },'json');
                                $this.data('ing',false)
                            }
                        } /*else if(id == 'btn_ask') {
                         $dialog = ui.$dialog_ask;
                         ui.$dialog_ask.removeClass('hide');
                         }*/
                        self.fAddDialogCloseEvent($dialog);
                    }
                });
            },
            fPayOrder:function(data){
                var sHtml='';
                if(data){
                    var str='';
                    var order=data.order;
                    if(order){
                        for(var i= 0,len=order.length; i<len; i++){
                            str +='<tr>\
                                <td>'+order[i].orderid+'</td>\
                                <td>'+order[i].fee+'</td>\
                                <td>'+order[i].dateline+'</td>'+this.fStatus(order[i].status, order[i].msg, order[i].payname)+'</tr>';
                        }
                    }
                    sHtml='<div class="modalContent">\
                        <div class="modalHd clearFix png"><h3 class="fl"><i class="search png"></i>订单查询</h3><a class="close fr png" href="###" title="关闭" data-close="modal"></a></div>\
                <div class="modalBd">\
                        <div class="clearFix">\
                        <div class="userInfo fl">\
                        <div class="username">\
                        <b>昵称：</b><span>'+data.userinfo.nickname+'</span>\
                        </div>\
                <div class="account">\
                        <b>账号：</b><span>'+data.userinfo.numid+'</span>\
                        </div>\
                        </div>\
                <a class="searchOther fr" href="#"><i class="searchWhite png"></i>查询其他帐号</a>\
                        </div>\
                <div class="nearOrder">\
                        <div class="hd clearFix"><h3 class="fl"><i class="orderIcon"></i>最近<small class="red">3</small>天的订单</h3><a href="#" class="more fr">更多订单&gt;&gt;</a></div>\
                <div class="table">\
                        <table>\
                        <thead>\
                        <tr>\
                        <th style="width:130px">订单号</th>\
                        <th style="width:70px">金额</th>\
                        <th style="width:100px">提交时间</th>\
                        <th style="width:160px">状态</th>\
                        <th style="width:100px">操作</th>\
                        </tr>\
                        </thead>\
                        <tbody>'+str+'</tbody>\
                        </table>\
                        </div>\
                        </div>\
                        </div>\
                <div class="modalFt png"></div>\
                        </div>';
                    ui.$dialog_order_search.html(sHtml);
                }else{}
            },
            fStatus: function(status,msg,payname){
                var str='';
                if(status == 1){
                    str='<td>'+msg+'</td><td><a href="#" class="bgRed btn ">再充一笔</a></td>';
                }else if(status == 2){
                    str='<td>已提交订单，但尚未在弹出的<span class="red">'+(payname || '')+'</span>页面完成支付。</td><td><a href="#" class="bgGray btn ">联系客服</a></td>';
                }else{
                    str='<td>'+msg+'</td><td><a href="#" class="bgGray btn ">联系客服</a></td>';
                }
                return str;
            },
            // 隐藏右侧导航弹出的层
            fHideRightNav_dialog: function() {
                ui.$dialog_demo.addClass('hide');
                ui.$dialog_order_search.addClass('hide');
                ui.$dialog_balance_search.addClass('hide');
                ui.$dialog_ask.addClass('hide');
            },
            // 弹出弹层时绑定关闭事件，和esc关闭
            fAddDialogCloseEvent: function($dialog) {
                var $close = $dialog.find('.close');
                var KEYS = {
                    ESC: 27
                };
                $dialog.on('click',ui.modalClose,function() {
                    $dialog.addClass('hide');
                    ui.$mask.addClass('hide');
                    $dialog.off('click');
                });
                $(document).on('keydown.dialog', function(e) {
                    if(e.which == KEYS.ESC) {
                        $close.trigger('click');
                    }
                });
            },
            fRightNavMaxTop: function() {
                return Math.max(ui.$main.height() - ui.$rightSideNav.height(),0);
            },
            // 左侧导航焦点
            fSetLeftSideCur: function(index) {
                if(index == 0) {
                    ui.$leftSideNav.find('li').eq(index).addClass('firstCur')
                        .siblings().removeClass('cur');
                } else {
                    ui.$leftSideNav.find('li').eq(index).addClass('cur')
                        .siblings().removeClass('cur firstCur');
                }
            },
            fLoadContent: function(type) {
                var url;
                if(type == 'card') {
                    url = '?c=charge&a=card';
                } else if(type == 'hand') {
                    url = '?c=charge&a=hand';
                } else if(type == 'sell') {
                    url = '?c=charge&a=sell';
                } else {
                    url = '?c=charge&a=pay';
                }
                if(url) {
                    ui.$div_charge_content.load(url);
                }
            },
            fGetRequest: function() {
                /* var url = location.search; //获取url中"?"符后的字串
                 var theRequest = new Object();
                 if (url.indexOf("?") != -1) {
                 var str = url.substr(1);
                 strs = str.split("&");
                 for(var i = 0; i < strs.length; i ++) {
                 theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
                 }
                 }
                 return theRequest;*/
                var url=location.href; //获取url的字串
                var arr=url.split('#');
                var len=arr.length;
                return arr[len-1];
            },
            fSetChargeContent: function() {
                var type = this.fGetRequest();
                var index = 0;
                if(!type) {
                    type = 'card';
                }
                ui.$leftSideNav.find('li').each(function(i) {
                    if(type == $(this).data('type')) {
                        index = i;
                        return false;
                    }
                })
                this.fSetLeftSideCur(index);
                this.fLoadContent(type);
            }
        }

        oPage.init();
    })
})