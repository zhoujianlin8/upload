yp.use('formValid, jquery.form',function(){
    yp.ready(function(){
        var ui = {
            $toggle: $('[data-toggle=toggle]'),
            $bind: $('[data-bind]'),
            $toggleLayout: $('[data-toggle=layout]'),
            $send: $('[data-send]'),
            $valid: $('[data-valid]'),
            $btn_auth_realname: $('#btn_auth_realname'),
            $dialog_realname: $('#dialog_realname'),
            $btn_dialogRealname_close: $('#btn_dialogRealname_close'),
            $btn_dialogRealname_submit: $('#btn_dialogRealname_submit'),
            $txt_email: $('#txt_email'),
            $txt_phone: $('#txt_phone'),
            $phonePassword: $('#phonePassword'),
            $emailPassword: $('#emailPassword')
        };
        var oPageSecurity = {
            init:function () {
                this.view();
                this.bindEvent();
            },
            view:function () {
                if(!g_realname) {
                    this.fDialogRealnameShowHide(true);
                    ui.$dialog_realname.on('blur','[data-valid]',function(){
                        fInputValid($(this));
                        return false;
                    })
                }
            },
            bindEvent:function () {
                var self=this;
                //格式验证
                ui.$valid.on('blur',function(){
                    self.fValidInput($(this));
                })
                //点击绑定操作
                ui.$bind.on('click',function(){
                    var $this = $(this);
                    var $form= $this.closest('form');
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        if(self.fFormValid($form)){
                            $form .ajaxSubmit({
                                success:function(msg){
                                    if(msg.code == 0){
                                        alert(msg.message);
                                    }else{
                                        alert(msg.message);
                                    }
                                    $this.data('ing', false);
                                }
                            });
                        }else{
                            alert('请修改错误后提交');
                            $this.data('ing', false);
                        }
                    }
                });
                //展开收起toggle
                ui.$toggle.on('click',function(){
                    var $this=$(this);
                    var target=$this.attr('data-target');
                    var $target=$(target);
                    $target.slideToggle(600,function(){
                        $this.addClass('hide').siblings('[data-toggle]').removeClass('hide');
                    });
                });
                //信息提示
                ui.$toggleLayout.on('mouseenter',function(){
                    var $this=$(this);
                    var target=$this.attr('data-target');
                    $(target).removeClass('hide');
                });
                ui.$toggleLayout.on('mouseleave',function(){
                    var $this=$(this);
                    var target=$this.attr('data-target');
                    $(target).addClass('hide');
                })
                //邮箱手机获得验证码
                $('body').on('click','[data-send]:not(.disabled)',function(){
                    var $this=$(this);
                    var type=$this.attr('data-send');
                    var url='?c=ucenter&a=sendCaptcha';
                    var param=null;
                    if(type == 'phone'){
                        ui.$txt_phone.trigger('blur');
                        ui.$phonePassword.trigger('blur');
                        if(ui.$txt_phone.closest('.formRow').find('.error:not(.hide)').length || ui.$phonePassword.closest('.formRow').find('.error:not(.hide)').length){
                            return false;
                        }
                        param={
                            type:1,
                            to:ui.$txt_phone.val(),
                            cardid: ui.$phonePassword.val()
                        };
                    }else{
                        ui.$txt_email.trigger('blur');
                        ui.$emailPassword.trigger('blur');
                        if(ui.$txt_email.closest('.formRow').find('.error:not(.hide)').length || ui.$emailPassword.closest('.formRow').find('.error:not(.hide)').length){
                            return false;
                        }
                        param={
                            type:2,
                            to:ui.$txt_email.val(),
                            cardid: ui.$emailPassword.val()
                        };
                    }
                    $.post(url,param,function(msg){
                        if(msg.code==0){
                            self.fSetTime($this);
                        }else{
                            alert(msg.message)
                        }
                    },"json")

                })
                // 实名认证关闭
                ui.$btn_dialogRealname_close.on('click', function() {
                    self.fDialogRealnameShowHide(false);
                });
                // 实名认证提交
                ui.$btn_dialogRealname_submit.on('click', function() {
                    var $this = $(this);
                    var $form=$this.closest('form');
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        if(self.fFormValid($form)) {
                            $form .ajaxSubmit({
                                success:function(msg){
                                    if(msg.code == 0){
                                        ui.$btn_dialogRealname_close.trigger('click');
                                    }else{
                                        alert(msg.message)
                                    }
                                    $this.data('ing', false);
                                }
                            })
                        }else{
                            $this.data('ing', false);
                            alert("请修改错误信息后提交");
                        }
                    }
                });

            },
            fValidInput: function($this){
                var self=this;
                var reg=/^[0-9a-z@#!%^&*()$]{6,40}$/i;
                var error=["不能为空","格式不对"];
                var sType=$this.attr('data-valid')
                if(sType=='email'){
                    error=[" 呦！还没有输入邮箱账号呀"," 呦！邮箱账号格式不对哦"];
                    reg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                    fValid();
                }else if(sType == 'cardId'){
                    reg=/(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
                    error=['身份证不能为空','身份证格式不对'];
                    fValid();

                }else if(sType == 'phone'){
                    error=["还没有输入手机号码呀","手机号码格式不对哦"];
                    reg=/^(13[0-9]|14[1357]|15[0123456789]|18[012356789])[0-9]{8}$/;
                    fValid();
                }else if(sType == 'checkNumber'){
                    error=["验证码不能为空","验证码格式不对"];
                    reg=/^[0-9a-z]{6}$/i;
                    fValid();
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
            // 表单校验
            fFormValid: function($form) {
                var self = this;
                var flag = true;
                $form.find('[data-valid]').each(function() {
                    if( $(this).siblings('.error').not('.hide').length){
                        flag=false;
                    }else{
                        $(this).trigger('blur');
                    }
                });
                if($form.find('.error').not('.hide').length){
                    flag=false;
                }
                return flag;
            },
            // 计时1分钟, 可再次点击发送验证码
            fSetTime: function($btn) {
                var self = this;
                var time = 60, strShowText = '';
                var timing = function() {
                    self.timeout = setTimeout(function() {
                        if(time > 0) {
                            time--;
                            strShowText = '再次发送'+time+'秒';
                            $btn.text(strShowText);
                            $btn.addClass('disabled');
                            timing();
                        } else {
                            strShowText = '重新获取验证码';
                            $btn.removeClass('disabled');
                            $btn.text(strShowText);
                        }
                    }, 1000);
                };

                if(this.timeout) {
                    clearTimeout(this.timeout);
                }
                timing();
            },
            // 实名认证弹框-显隐
            fDialogRealnameShowHide: function(flag) {
                if(flag) {
                    ui.$dialog_realname.show().prev().show();
                } else {
                    ui.$dialog_realname.hide().prev().hide();
                }
                g_realname=true;
            },
            fValidSuccess: function($obj) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo real dv"><i class="ico_16 i34"></i></span>');
            },
            fValidError: function($obj, content) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo error dv"><i class="ico_16 i33"></i>'+content+'</span>');
            }

        }
        oPageSecurity.init();
    })
})
/*
$(function () {
    var ui = {
        $toggle: $('[data-toggle=toggle]'),
        $bind: $('[data-bind]'),
        $toggleLayout: $('[data-toggle=layout]'),
        $send: $('[data-send]'),
        $valid: $('[data-valid]'),
        $btn_auth_realname: $('#btn_auth_realname'),
        $dialog_realname: $('#dialog_realname'),
        $btn_dialogRealname_close: $('#btn_dialogRealname_close'),
        $btn_dialogRealname_submit: $('#btn_dialogRealname_submit'),
        $txt_email: $('#txt_email'),
        $txt_phone: $('#txt_phone'),
        $phonePassword: $('#phonePassword'),
        $emailPassword: $('#emailPassword')
    };
    var oPageSecurity = {
        init:function () {
            this.view();
            this.bindEvent();
        },
        view:function () {
            if(!g_realname) {
                this.fDialogRealnameShowHide(true);
                ui.$dialog_realname.on('blur','[data-valid]',function(){
                    fInputValid($(this));
                    return false;
                })
            }
        },
        bindEvent:function () {
            var self=this;
            //格式验证
            ui.$valid.on('blur',function(){
                self.fValidInput($(this));
            })
            //点击绑定操作
            ui.$bind.on('click',function(){
                var $this = $(this);
                var $form= $this.closest('form');
                if(!$this.data('ing')) {
                    $this.data('ing', true);
                    if(self.fFormValid($form)){
                        $form .ajaxSubmit({
                            success:function(msg){
                                if(msg.code == 0){
                                    alert(msg.message);
                                }else{
                                    alert(msg.message);
                                }
                                $this.data('ing', false);
                            }
                        });
                    }else{
                        alert('请修改错误后提交');
                        $this.data('ing', false);
                    }
                }
            });
            //展开收起toggle
            ui.$toggle.on('click',function(){
                var $this=$(this);
                var target=$this.attr('data-target');
                var $target=$(target);
                $target.slideToggle(600,function(){
                    $this.addClass('hide').siblings('[data-toggle]').removeClass('hide');
                });
            });
            //信息提示
            ui.$toggleLayout.on('mouseenter',function(){
                var $this=$(this);
                var target=$this.attr('data-target');
                $(target).removeClass('hide');
            });
            ui.$toggleLayout.on('mouseleave',function(){
                var $this=$(this);
                var target=$this.attr('data-target');
                $(target).addClass('hide');
            })
            //邮箱手机获得验证码
            $('body').on('click','[data-send]:not(.disabled)',function(){
                var $this=$(this);
                var type=$this.attr('data-send');
                var url='?c=ucenter&a=sendCaptcha';
                var param=null;
                if(type == 'phone'){
                    ui.$txt_phone.trigger('blur');
                    ui.$phonePassword.trigger('blur');
                    if(ui.$txt_phone.closest('.formRow').find('.error:not(.hide)').length || ui.$phonePassword.closest('.formRow').find('.error:not(.hide)').length){
                        return false;
                    }
                    param={
                        type:1,
                        to:ui.$txt_phone.val(),
                        cardid: ui.$phonePassword.val()
                    };
                }else{
                    ui.$txt_email.trigger('blur');
                    ui.$emailPassword.trigger('blur');
                    if(ui.$txt_email.closest('.formRow').find('.error:not(.hide)').length || ui.$emailPassword.closest('.formRow').find('.error:not(.hide)').length){
                        return false;
                    }
                    param={
                        type:2,
                        to:ui.$txt_email.val(),
                        cardid: ui.$emailPassword.val()
                    };
                }
                $.post(url,param,function(msg){
                    if(msg.code==0){
                        self.fSetTime($this);
                    }else{
                        alert(msg.message)
                    }
                },"json")

            })
            // 实名认证关闭
            ui.$btn_dialogRealname_close.on('click', function() {
                self.fDialogRealnameShowHide(false);
            });
            // 实名认证提交
            ui.$btn_dialogRealname_submit.on('click', function() {
                var $this = $(this);
                var $form=$this.closest('form');
                if(!$this.data('ing')) {
                    $this.data('ing', true);
                    if(self.fFormValid($form)) {
                        $form .ajaxSubmit({
                            success:function(msg){
                                if(msg.code == 0){
                                    ui.$btn_dialogRealname_close.trigger('click');
                                }else{
                                    alert(msg.message)
                                }
                                $this.data('ing', false);
                            }
                        })
                    }else{
                        $this.data('ing', false);
                        alert("请修改错误信息后提交");
                    }
                }
            });

        },
        fValidInput: function($this){
            var self=this;
            var reg=/^[0-9a-z@#!%^&*()$]{6,40}$/i;
            var error=["不能为空","格式不对"];
            var sType=$this.attr('data-valid')
            if(sType=='email'){
                error=[" 呦！还没有输入邮箱账号呀"," 呦！邮箱账号格式不对哦"];
                reg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                fValid();
            }else if(sType == 'cardId'){
                reg=/(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
                error=['身份证不能为空','身份证格式不对'];
                fValid();

            }else if(sType == 'phone'){
                error=["还没有输入手机号码呀","手机号码格式不对哦"];
                reg=/^(13[0-9]|14[1357]|15[0123456789]|18[012356789])[0-9]{8}$/;
                fValid();
            }else if(sType == 'checkNumber'){
                error=["验证码不能为空","验证码格式不对"];
                reg=/^[0-9a-z]{6}$/i;
                fValid();
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
        // 表单校验
        fFormValid: function($form) {
            var self = this;
            var flag = true;
            $form.find('[data-valid]').each(function() {
                if( $(this).siblings('.error').not('.hide').length){
                    flag=false;
                }else{
                    $(this).trigger('blur');
                }
            });
            if($form.find('.error').not('.hide').length){
                flag=false;
            }
            return flag;
        },
        // 计时1分钟, 可再次点击发送验证码
        fSetTime: function($btn) {
            var self = this;
            var time = 60, strShowText = '';
            var timing = function() {
                self.timeout = setTimeout(function() {
                    if(time > 0) {
                        time--;
                        strShowText = '再次发送'+time+'秒';
                        $btn.text(strShowText);
                        $btn.addClass('disabled');
                        timing();
                    } else {
                        strShowText = '重新获取验证码';
                        $btn.removeClass('disabled');
                        $btn.text(strShowText);
                    }
                }, 1000);
            };

            if(this.timeout) {
                clearTimeout(this.timeout);
            }
            timing();
        },
        // 实名认证弹框-显隐
        fDialogRealnameShowHide: function(flag) {
            if(flag) {
                ui.$dialog_realname.show().prev().show();
            } else {
                ui.$dialog_realname.hide().prev().hide();
            }
            g_realname=true;
        },
        fValidSuccess: function($obj) {
            $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo real dv"><i class="ico_16 i34"></i></span>');
        },
        fValidError: function($obj, content) {
            $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo error dv"><i class="ico_16 i33"></i>'+content+'</span>');
        }

    }
    oPageSecurity.init();
})*/
