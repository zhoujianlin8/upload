yp.use('formValid',function(){
    yp.ready(function(){
        var ui = {
            $nav_step: $('#nav_step'),
            $txt_step1_account: $('#txt_step1_account'),
            $txt_valids: $('[data-valid]'),
            $form_step1: $('#form_step1'),
            $btn_submit_step1: $('#btn_submit_step1'),
            $div_step2: $('#div_step2'),
            $div_by_style: $('#div_by_style'),
            $form_step3_email: $('#form_step3_email'),
            $txt_step3_email_checkcode: $('#txt_step3_email_checkcode'),
            $btn_submit_step3_email: $('#btn_submit_step3_email'),
            $btn_cancel_step3_email: $('#btn_cancel_step3_email'),
            $btn_step3_email_reget: $('#btn_step3_email_reget'),
            $form_step3_mobile: $('#form_step3_mobile'),
            $txt_step3_mobile_checkcode: $('#txt_step3_mobile_checkcode'),
            $btn_submit_step3_mobile: $('#btn_submit_step3_mobile'),
            $btn_cancel_step3_mobile: $('#btn_cancel_step3_mobile'),
            $btn_step3_mobile_reget: $('#btn_step3_mobile_reget'),
            $dialog_handService: $('#dialog_handService'),
            $btn_dialog_handService_close: $('#btn_dialog_handService_close'),
            $btn_common: $('[data-common]'),
            $tip_noGet_email: $('#tip_noGet_email'),
            $tip_noGet_mobile: $('#tip_noGet_mobile'),
            $form_step4_reset: $('#form_step4_reset'),
            $btn_submit_step4: $('#btn_submit_step4'),
            $div_success: $('#div_success'),
            $userId: $('#userId'),
            $txt_phone: $('#txt_phone'),
            $txt_email: $('#txt_email'),
            $phoneNum: $('[data-phone=number]'),
            $send: $('[data-send]'),
            $changeCheckNum: $('#btn_step1_checkcode'),
            $captcha: $('#captcha'),
            $modalHandBd: $('#modalHandBd'),
            $txt_step1_checkcode: $('#txt_step1_checkcode')
        };
        var userId=null;
        var oPage = {
            init: function() {
                this.view();
                this.bindEvent();
            },
            view: function() {
                this.fShowStepContent(1);
            },
            bindEvent: function() {
                var self = this;
                //游戏账号验证
                ui.$txt_step1_account.on('blur',function(){
                    var url='/?c=findpwd&a=check_userid';
                    fInputValid($(this),true);
                    if($(this).closest('.formTr').find('.error').length){
                        return false;
                    }
                    var data=$(this).val();
                    var param={userid:data}
                    $.post(url,param,function(msg){
                        if(msg.code ==0){
                            window.boor=false;
                            showValidResult('txt_step1_account','success','')
                        }else{
                            showValidResult('txt_step1_account','error',msg.message);
                        }
                    },"json");
                    return false;
                });
                //验证验证码
                ui.$txt_step1_checkcode.on('blur',function(){
                    var url='/index.php?c=index&a=checkVerify';
                    fInputValid($(this),true);
                    if($(this).closest('.formTr').find('.error').length){
                        return false;
                    }
                    var data=$(this).val();
                    var param={captcha:data}
                    $.ajax({
                        url: url,
                        data: param,
                        type: 'POST',
                        async: false,
                        dataType: 'json',
                        success: function(msg){
                            if(msg.code ==0){
                                window.boor=false;
                                showValidResult('txt_step1_checkcode','success','');
                                ui.$btn_submit_step1.data('ing',false);
                            }else{
                                showValidResult('txt_step1_checkcode','error',msg.message);
                                ui.$btn_submit_step1.data('ing',true);
                            }
                        }
                    });
                   /* $.post(url,param,function(msg){
                        if(msg.code ==0){
                            window.boor=false;
                            showValidResult('txt_step1_checkcode','success','');
                            ui.$btn_submit_step1.data('ing',false);
                        }else{
                            showValidResult('txt_step1_checkcode','error',msg.message);
                            ui.$btn_submit_step1.data('ing',true);
                        }
                    },"json");*/
                    return false;
                })
                //点击更换一张验证码
                ui.$changeCheckNum.on('click',function(){
                    var url=ui.$captcha.attr('src');
                    var arr=url.split('_t=');
                    var len=arr.length;
                    arr[len-1]=arr[len-1]*2;
                    var sUrl=arr.join('_t=');
                    ui.$captcha.attr('src',sUrl);
                    return false;
                });
                //第一步验证码验证
                /*   //手机号码验证
                ui.$txt_phone.on('blur',function(){
                    var url='/?c=findpwd&a=tel_pwd&userid='+userId;
                    var data=$(this).val();
                    fInputValid($(this),true);
                    if($(this).closest('.formTr').find('.error').length){
                        return false;
                    }
                    var param={tel:data};
                    $.post(url,param,function(msg){
                        if(msg.code ==0){
                            window.boor=false;
                            showValidResult('txt_phone','success','')
                        }else{
                            showValidResult('txt_phone','error',msg.message);
                        }
                    },"json");
                    return false;
                });
                //邮箱验证
               ui.$txt_email.on('blur',function(e){
                    var url='/?c=findpwd&a=mail_pwd&userid='+userId;
                    var data=$(this).val();
                    fInputValid($(this),true);
                    if($(this).closest('.formTr').find('.error').length){
                        return false;
                    }
                    var param={mail:data};
                    $.post(url,param,function(msg){
                        if(msg.code ==0){
                            window.boor=false;
                            showValidResult('txt_email','success','')
                        }else{
                            showValidResult('txt_email','error',msg.message);
                        }
                    },"json");
                    return false;
                });*/
                // 表单校验
                $('body').on('blur','[data-valid]',function(){
                    fInputValid($(this));
                });
                // 第一步表单提交
                ui.$btn_submit_step1.on('click', function() {
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        if(self.fFormValid(ui.$form_step1)) {
                            var url='index.php?c=findpwd&a=index';
                            var data=$this.closest('form').serialize();
                            $.post(url,data,function(msg){
                                if(msg.code == 0){
                                    if(msg.data.tel == 1){
                                        $('[data-type=mobile]').addClass('disabled');
                                    }else{
                                        $('[data-type=mobile]').removeClass('disabled');
                                    }
                                    if(msg.data.mail ==1){
                                        $('[data-type=email]').addClass('disabled');
                                    }else{
                                        $('[data-type=email]').removeClass('disabled');
                                    }
                                    userId=ui.$txt_step1_account.val();
                                    ui.$userId.text(userId);
                                    self.fShowStepContent(2);
                                }else{
                                    alert(msg.message);
                                }
                                $this.data('ing', false);
                            },"json")

                        }else{
                            $this.data('ing', false);
                        }
                    }
                });
                // 第二步找回方式
                ui.$div_by_style.on('click', '[data-type]', function() {
                    var $this = $(this);
                    var type = $this.data('type');
                    if($this.hasClass('disabled')) {
                        return false;
                    }
                    if(type == 'mobile') {
                        //self.fShowStepContent(3, type);
                        self.fPhoneFind();
                    }else if(type == 'email'){
                        self.fEmailFind();
                    }else if(type == 'person'){
                        self.fHandService();
                    }
                });
                // 第三步-邮箱
                ui.$btn_submit_step3_email.on('click', function() {
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        if(self.fFormValid(ui.$form_step3_email)) {
                            if(ui.$txt_email.text() == ''){
                                return false;
                            }
                            var url='/?c=findpwd&a=mail_pwd&m=2&userid='+userId;
                            var data=$this.closest('form').serialize();
                            $.post(url,data,function(msg){
                                if(msg.code == 0){
                                    self.fShowStepContent(4);
                                }else{
                                    alert(msg.message)
                                }

                                $this.data('ing', false);
                            })
                        }else{
                            $this.data('ing', false);
                        }
                    }
                });
                ui.$btn_cancel_step3_email.on('click', function() {
                    self.fShowStepContent(2);
                });
                // 第三步-手机
                ui.$btn_submit_step3_mobile.on('click', function() {
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        if(self.fFormValid(ui.$form_step3_mobile)) {
                            if(ui.$txt_phone.text() == ''){
                                return false;
                            }
                            var url='/?c=findpwd&a=tel_pwd&t=2&userid='+userId;
                            var data=$this.closest('form').serialize();
                            $.post(url,data,function(msg){
                                if(msg.code== 0){
                                    self.fShowStepContent(4);
                                }else{
                                    alert(msg.message)
                                }

                                $this.data('ing', false);
                            })
                        }else{
                            $this.data('ing', false);
                        }
                    }
                });
                ui.$btn_cancel_step3_mobile.on('click', function() {
                    self.fShowStepContent(2);
                });
                // 第三步-人工找回关闭
                ui.$btn_dialog_handService_close.on('click', function() {
                    ui.$dialog_handService.addClass('hide');
                });
                // 第四步-重置密码
                ui.$btn_submit_step4.on('click', function() {
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        if(self.fFormValid(ui.$form_step4_reset)) {
                            var url='/?c=findpwd&a=reset_pwd&userid='+userId;
                            var data=$this.closest('form').serialize();
                            $.post(url,data,function(msg){
                                if(msg.code== 0){
                                    self.fShowStepContent(5);
                                }else{
                                    alert(msg.message);
                                }

                                $this.data('ing', false);
                            })
                        }else{
                            $this.data('ing', false);
                        }
                    }
                });
                // 提示没有收到
                $('body').on('mouseenter','[data-common=notGet]',function(){
                    var $this = $(this);
                    var sTarget=$this.attr('data-target');
                    var $Target=$(sTarget);
                    $Target.removeClass('hide');
                });
                $('body').on('mouseleave','[data-common=notGet]',function(){
                    var $this = $(this);
                    var sTarget=$this.attr('data-target');
                    var $Target=$(sTarget);
                    $Target.addClass('hide');
                });
                //邮箱手机获得验证码
                $('body').on('click','[data-send]:not(.disabled)',function(){
                    var $this=$(this);
                    var type=$this.attr('data-send');
                    var url=null;
                    var param=null;
                    if(type == 'phone'){
                        url='/?c=findpwd&a=tel_pwd&t=1&userid='+userId;
                        if(ui.$txt_phone.text() == ''){
                            return false;
                        }
                       /* ui.$txt_phone.trigger('blur');
                        if(ui.$txt_phone.closest('.formTr').find('.error:not(.hide)').length){
                            return false;
                        }*/
                        param={tel:ui.$txt_phone.text()};
                    }else{
                        url='/?c=findpwd&a=mail_pwd&m=1&userid='+userId;
                        /*ui.$txt_email.trigger('blur');
                        if(ui.$txt_email.closest('.formTr').find('.error:not(.hide)').length){
                            return false;
                        }*/
                        if(ui.$txt_email.text() == ''){
                            return false;
                        }
                        param={mail:ui.$txt_email.text()};
                    }
                    $.post(url,param,function(msg){
                        if(msg.code ==0){
                            self.fSetTime($this);
                        }else{
                            alert(msg.message);
                        }
                    },"json")

                })
            },
            // 表单校验
            fFormValid: function($form) {
                var self = this;
                var flag = true;
                $form.find('[data-valid]').each(function() {
                    if( $(this).siblings('.error').not('.hide').length){
                        flag=false;
                    }else{
                        fInputValid($(this));
                    }
                });
                if($form.find('.error').not('.hide').length){
                    flag=false;
                }
                return flag;
            },
            // 显示对应步骤的内容
            fShowStepContent: function(step, type) {
                // 导航
                if(step == 5) {//找回密码成功，结束
                    ui.$nav_step.hide();
                } else {
                    ui.$nav_step.show().find('li').removeClass('cur').eq(step - 1).addClass('cur');
                }
                // 内容
                ui.$form_step1.addClass('hide');
                ui.$div_step2.addClass('hide');
                ui.$form_step3_email.addClass('hide');
                ui.$form_step3_mobile.addClass('hide');
                ui.$form_step4_reset.addClass('hide');
                ui.$div_success.addClass('hide');
                if(step == 1) {
                    ui.$form_step1.removeClass('hide');
                } else if(step == 2) {
                    ui.$div_step2.removeClass('hide');
                } else if(step == 3) {
                    if(type == 'email') {
                        ui.$tip_noGet_email.addClass('hide');
                        ui.$form_step3_email.removeClass('hide');
                        ui.$btn_step3_email_reget.prop('disabled', true);
                        // self.fSetTime(ui.$btn_step3_email_reget);
                    } else if(type == 'mobile') {
                        ui.$tip_noGet_mobile.addClass('hide');
                        ui.$form_step3_mobile.removeClass('hide');

                    } else if(type == 'person') {
                        this.fHandService();
                    }
                } else if(step == 4) {
                    ui.$form_step4_reset.removeClass('hide');
                } else if(step == 5) {
                    ui.$div_success.removeClass('hide');
                }
            },
            fPhoneFind: function(){
                var self = this;
                var url='/index.php?c=findpwd&a=infos&t=tel';
                var param = {userid: userId};
                $.post(url, param,function(msg){
                    if(msg.data){
                        if(msg.data.tel && msg.data.tel != ''){
                            self.fShowStepContent(3, 'mobile');
                            ui.$txt_phone.text(msg.data.tel);
                            ui.$txt_phone.next('input').val(msg.data.tel);
                        }

                    }else{}
                })
            },
            fEmailFind: function(){
                var self = this;
                var url='/index.php?c=findpwd&a=infos&t=mail';
                var param = {userid: userId};
                $.post(url, param,function(msg){
                    if(msg.code == 0){
                        if(msg.data){
                            if(msg.data.mail && msg.data.mail != ''){
                                self.fShowStepContent(3, 'email');
                                ui.$txt_email.text(msg.data.mail);
                                ui.$txt_email.next('input').val(msg.data.mail);
                            }

                        }else{}

                    }else{
                        alert(msg.message);
                    }
                })
            },
            fHandService: function(){
                var url='/?c=findpwd&a=person_pwd&userid='+userId;
                $.post(url,function(msg){
                    var phone=msg.data.tel;
                    if(msg.code == 0){
                        if(phone ==1){
                            var sHTML='<div class="modalBd">'+
                                '<h3>人工找回密码的方式如下：</h3>'+
                                '<p>请用拨打热线：<i class="orange bold">400-087-8578</i>与客服联系找回密码</p>'+
                                '</div>';
                            ui.$modalHandBd.html(sHTML);
                        }else{
                            ui.$phoneNum.text(phone);
                        }
                        ui.$dialog_handService.removeClass('hide');
                    }else{
                        alert(msg.message);
                    }
                })
                this.fShowStepContent(2, 'person');
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
            }
        }

        oPage.init();
    })
})

