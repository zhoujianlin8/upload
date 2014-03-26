$(function () {
    var ui = {
        $login: $('#login'),
        $loginModal: $('#loginModal'),
        $loginClose: $('#btn_close_modal'),
        $loginSubmit: $('#btn_login_submit'),
        $errorText: $('.userLogin .errorText'),
        $change: $('#changeOne'),
        $checkpic: $('#checkNumPic'),
        $addFavorite: $('#addFavorite'),
        $wrapModal: $('#wrapModal')
    };
    var oPagelogin = {
        init:function () {
            this.view();
            this.bindEvent();
        },
        view:function () {
            this.fAlert();
        },
        bindEvent:function () {
            var self=this;
            //打开登录框
            ui.$login.on('click',function(){
               ui.$loginModal.removeClass('hide').show();
                return false;
            })
            //关闭登录框
            ui.$loginClose.on('click',function(){
                ui.$loginModal.addClass('hide').hide();
                return false;
            })
            //验证
            ui.$loginModal.on('blur','[data-valid]',function(){
                self.fValidInput($(this));
            })
            //登录表单提交
            ui.$loginSubmit.on('click',function(){
                var $this = $(this);
                var $form=$this.closest('form');
                if(!$this.data('ing')) {
                    $this.data('ing', true);
                    if(!self.fFormValid($form)){
                        $this.data('ing', false);
                        return false;
                    }
                    var url="/?c=index&a=login";
                    var data=$form.serialize();
                    $.post(url,data,function(msg){
                        if(msg.code == 0){
                            ui.$loginClose.trigger('click');
                            if(window.fLoginSuccess ) {
                                fLoginSuccess(msg);
                            }
                        }else{
                            self.fValidError('',msg.message);
                            if(msg.data){
                                if(msg.data.ecount>2){
                                    if(!$('#changeOne').length){
                                        $('.errorText').before('<div class="formTr" style="margin-top:20px;">\
                        <b>验证码：</b>\
                <input type="text" class="inputMin"  name="captcha" data-valid="checkNum">\
                        <div class="checkedNumber inlineB" style="width:72px; height: 32px;"><img src="?c=index&a=verify&_t=1" id="checkNumPic"/></div>\
                        <button class="greenIt" id="changeOne">换一张</button><span class="tipInfo"></span>\
                </div>')
                                    }
                            }
                            }
                        }
                        $this.data('ing', false);
                    })
                }

            })
            //点击更换一张验证码
            $('body').on('click','#changeOne',function(){
                ui.$checkpic=$('#checkNumPic');
                var url=ui.$checkpic.attr('src');
                var arr=url.split('_t=');
                var len=arr.length;
                arr[len-1]=arr[len-1]*2;
                var sUrl=arr.join('_t=');
                ui.$checkpic.attr('src',sUrl);
                return false;
            });
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
        },
        fValidSuccess: function($obj) {
            $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo dv"></i></span>');
            if($obj.closest('form').find('.error:not(hide)').length == 0){
                ui.$errorText.addClass('hide');
            }
        },
        fValidError: function($obj, content) {
            $obj && $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo error dv"></span>');
            ui.$errorText.removeClass('hide').text(content);
        },
        fFormValid: function($form) {
            var self = this;
            var flag = true;
            $form.find('[data-valid]').trigger('blur');
            if($form.find('.error').not('.hide').length){
                flag=false;
            }
            return flag;
        },
        fValidInput: function($this){
            var self=this;
            var reg=/^[0-9a-z\u4E00-\u9FA5]{1,20}$/i;
            var error=["不能为空","格式不对"];
            var sType=$this.attr('data-valid')
            if(sType=='userid'){
                error=["游戏账号不能为空","游戏账号格式不对"];
                fValid();
            }else if(sType == 'password'){
                reg=/^[0-9a-z#$@&*]{6,20}$/i;
                error=["密码不能为空","密码格式不对"];
                fValid();
            }else if(sType == 'checkNum'){
                reg=/^[0-9a-z]{4}$/i;
                error=["验证码不能为空","验证码格式不对"];
                fValid();
                if($this.closest('.formRow,.formTr').find('.error:not(.hide)').length){
                    return false;
                }
                var url='/index.php?c=index&a=checkVerify';
                var data=$this.val();
                var param={captcha:data}
                $.post(url,param,function(msg){
                    if(msg.code ==0){
                        self.fValidSuccess($this);
                    }else{
                        self.fValidError($this,msg.message);
                    }
                },"json");
                return false;
            }
            function fValid(){
                var val=$this.val();
                if(val==''){
                    self.fValidError($this,error[0]);
                }else{
                    if(reg.test(val)){
                        self.fValidSuccess($this);
                    }else{
                        self.fValidError($this,error[1]);
                    }
                }
            }
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
    }
    oPagelogin.init();
})