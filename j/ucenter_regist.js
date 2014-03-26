yp.use('jquery.form, formValid',function(){
    yp.ready(function(){
        var ui = {
            $mask: $('#mask'),
            $btn_to_login: $('#btn_to_login'),
            $nav_regist_type: $('#nav_regist_type'),
            $nav_regist_step: $('#nav_regist_step'),
            $form_mobile_step1: $('#form_mobile_step1'),
            $btn_mobile_submit_step1: $('#btn_mobile_submit_step1'),
            $form_mobile_step2: $('#form_mobile_step2'),
            $btn_mobile_submit_step2: $('#btn_mobile_submit_step2'),
            $div_mobile_step3: $('#div_mobile_step3'),
            $form_ordinary_regist: $('#form_ordinary_regist'),
            $btn_ordinary_submit: $('#btn_ordinary_submit'),
            $div_ordinary_success: $('#div_ordinary_success'),
            $txt_valids: $('.enroll [data-valid]'),
            $span_error: $('#span_error'),
            $txt_dialogLogin_account: $('#txt_dialogLogin_account'),
            $txt_dialogLogin_pwd: $('#txt_dialogLogin_pwd'),
            $txt_dialogLogin_checkcode: $('#txt_dialogLogin_checkcode'),
            $dialog_acccept: $('#dialog_acccept'),
            $btn_common: $('[data-common]'),
            $row_join: $('#row_join'),
            $row_qq: $('#row_qq'),
            $chb_ordinaryReg_accept: $('#chb_ordinaryReg_accept'),
            $txt_ordinaryReg_account: $('#txt_ordinaryReg_account'),
            $txt_mobileReg_mobile: $('#txt_mobileReg_mobile'),
            $mobileSuccessAccount: $('#mobileSuccessAccount'),
            $ordinarySuccessAccount: $('#ordinarySuccessAccount'),
            $ordinarySuccessNickname: $('#ordinarySuccessNickname'),
            $txt_ordinaryReg_nickname: $('#txt_ordinaryReg_nickname'),
            $send: $('[data-send]'),
            $txt_mobileReg_nickname: $('#txt_mobileReg_nickname')
        }
        var oPage = {
            init: function() {
                this.view();
                this.bindEvent();
            },
            view: function() {
                var request = this.fGetRequest();
                var type = request['type'];
                this.fShowRegist(type);
            },
            bindEvent: function() {
                var self = this;
                // 弹出登录框按钮
                ui.$btn_to_login.on('click', function() {
                    $('#login').trigger('click');
                });
                // 注册方式
                ui.$nav_regist_type.on('click', 'li:not(.cur)', function() {
                    var $ul=$(this).closest('ul');
                    var type = $(this).data('type');
                    var nLeft1=$(this).offset().left;
                    var nLeft0=ui.$nav_regist_type.find('li').eq(0).offset().left;
                    var n=nLeft1-nLeft0;
                    $ul.animate({
                        backgroundPosition: nLeft1-nLeft0
                    },200)
                    self.fShowRegist(type);
                });
                //手机号码验证
                ui.$txt_mobileReg_mobile.on('blur',function(){
                    var url='/?c=register&a=phone_check';
                    var data=$(this).val();
                    fInputValid($(this),true);
                    if($(this).closest('.formTr').find('.error').length){
                        return false;
                    }
                    var param={phone:data};
                    $.ajax({
                        url: url,
                        data: param,
                        type: 'POST',
                        async: false,
                        dataType: 'json',
                        success: function(msg){
                            if(msg.code ==0){
                                window.boor=false;
                                showValidResult('txt_mobileReg_mobile','success','');
                            }else{
                                showValidResult('txt_mobileReg_mobile','error',msg.message);
                            }
                        }
                    });
                    return false;
                });
                //昵称验证
                ui.$txt_mobileReg_nickname.on('blur',function(e){
                    var url='/?c=register&a=check_nickname';
                    var data=$(this).val();
                    fInputValid($(this),true);
                    if($(this).closest('.formTr').find('.error').length){
                        return false;
                    }
                    var param={nickname:data};
                    $.ajax({
                        url: url,
                        data: param,
                        type: 'POST',
                        async: false,
                        dataType: 'json',
                        success: function(msg){
                            if(msg.code ==0){
                                window.boor=false;
                                showValidResult('txt_mobileReg_nickname','success','')
                            }else{
                                showValidResult('txt_mobileReg_nickname','error',msg.message);
                            }
                        }
                    });
               /*     $.post(url,param,function(msg){
                        if(msg.code ==0){
                            window.boor=false;
                            showValidResult('txt_mobileReg_nickname','success','')
                        }else{
                            showValidResult('txt_mobileReg_nickname','error',msg.message);
                        }
                    },"json");*/
                    return false;
                });
                //用户是否存在验证
                ui.$txt_ordinaryReg_account.on('blur',function(e){
                    var url='/?c=register&a=user_exists';
                    var data=$(this).val();
                    fInputValid($(this));
                    if($(this).closest('.formTr').find('.error').length){
                        return false;
                    }
                    var param={userid:data};
                    $.ajax({
                        url: url,
                        data: param,
                        type: 'POST',
                        async: false,
                        dataType: 'json',
                        success: function(msg){
                            if(msg.code ==0){
                                window.boor=false;
                                showValidResult('txt_ordinaryReg_account','success','')
                            }else{
                                showValidResult('txt_ordinaryReg_account','error',msg.message);
                            }
                        }
                    });
                   /* $.post(url,param,function(msg){
                        if(msg.code ==0){
                            window.boor=false;
                            showValidResult('txt_ordinaryReg_account','success','')
                        }else{
                            showValidResult('txt_ordinaryReg_account','error',msg.message);
                        }
                    },"json");*/
                    return false;
                });
                //普通注册昵称是否可用验证
                ui.$txt_ordinaryReg_nickname.on('blur',function(e){
                    var url='/?c=register&a=check_nickname';
                    var data=$(this).val();
                    fInputValid($(this));
                    if($(this).closest('.formTr').find('.error').length){
                        return false;
                    }
                    var param={nickname:data};
                    $.ajax({
                        url: url,
                        data: param,
                        type: 'POST',
                        async: false,
                        dataType: 'json',
                        success: function(msg){
                            if(msg.code ==0){
                                window.boor=false;
                                showValidResult('txt_ordinaryReg_nickname','success','')
                            }else{
                                showValidResult('txt_ordinaryReg_nickname','error',msg.message);
                            }
                        }
                    });
                  /*  $.post(url,param,function(msg){
                        if(msg.code ==0){
                            window.boor=false;
                            showValidResult('txt_ordinaryReg_nickname','success','')
                        }else{
                            showValidResult('txt_ordinaryReg_nickname','error',msg.message);
                        }
                    },"json");*/
                    return false;
                });
                // 表单校验
                ui.$txt_valids.on('blur', function() {
                    fInputValid($(this));
                });
                //发送免费验证码
                $('body').on('click','[data-send]:not(.disabled)',function(){
                    var $this=$(this);
                    var type=$this.attr('data-send');
                    var url='?c=register&a=send_msmvcode';
                    if(ui.$txt_mobileReg_mobile.siblings('.error:not(.hide)').length ){
                        return false;
                    }else{
                        fInputValid(ui.$txt_mobileReg_mobile);
                        if(ui.$txt_mobileReg_mobile.siblings('.error:not(.hide)').length){
                            return false;
                        }
                    }
                    var param={
                        phone:ui.$txt_mobileReg_mobile.val()
                    };
                    $.get(url,param,function(msg){
                        if(msg.code==0){
                            self.fSetTime($this);
                        }else{
                            alert(msg.message)
                        }
                    },"json")

                })
                // 手机注册第一步提交
                ui.$btn_mobile_submit_step1.on('click', function() {
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        var flag = true;
                        flag = self.fFormValid(ui.$form_mobile_step1);
                        if(flag) {//表单异步请求
                            ui.$form_mobile_step1.ajaxSubmit({
                                success:function(msg){
                                    if(!msg.code){
                                        self.fShowRegist('mobile', 2);
                                    }else{
                                        alert(msg.message)
                                    }
                                    $this.data('ing', false);
                                }
                            })

                        }else{
                            alert('请修改错误后提交');
                            $this.data('ing', false);
                        }
                    }else{

                    }
                });
                // 手机注册第二步提交
                ui.$btn_mobile_submit_step2.on('click', function() {
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        var flag = true;
                        flag = self.fFormValid(ui.$form_mobile_step2);
                        if(flag) {//表单异步请求
                            ui.$form_mobile_step2.ajaxSubmit({
                                success:function(msg){
                                    if(msg.code ==0){
                                        ui.$mobileSuccessAccount.text(ui.$txt_mobileReg_mobile.val());
                                        self.fShowRegist('mobile', 3);
                                    }else{
                                        alert(msg.message)
                                    }
                                    $this.data('ing', false);
                                }
                            })

                        }else{
                            alert('请修改错误后提交');
                            $this.data('ing', false);
                        }
                    }else{

                    }
                });
                // 普通注册提交
                ui.$btn_ordinary_submit.on('click', function() {
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        var flag = true;
                        flag = self.fFormValid(ui.$form_ordinary_regist);
                        if(flag) {//表单异步请求
                            ui.$form_ordinary_regist.ajaxSubmit({
                                success:function(msg){
                                    if(msg.code ==0 ){
                                        ui.$ordinarySuccessAccount.text(ui.$txt_ordinaryReg_account.val());
                                        ui.$ordinarySuccessNickname.text(ui.$txt_ordinaryReg_nickname.val());
                                        self.fShowRegist('ordinary', 2);
                                    }else{
                                        alert(msg.message)
                                    }
                                    $this.data('ing', false);
                                }
                            })

                        }else{
                            alert('请修改错误后提交');
                            $this.data('ing', false);
                        }
                    }else{

                    }

                });
                // 普通注册里加入qq群
                ui.$row_join.on('click', 'input[type=radio]', function() {
                    var val = $(this).closest('div').find('input[type=radio]:checked').val();
                    if(val == 1) {//加入
                        ui.$row_qq.show();
                    } else {
                        ui.$row_qq.hide();
                    }
                });
                //接受协议checkbox
                ui.$chb_ordinaryReg_accept.on('change',function(){
                    fInputValid($(this));
                });
                // 注册协议关闭
                ui.$dialog_acccept.on('click', 'a', function() {
                    if($(this).data('accept') == 'close') {
                        ui.$dialog_acccept.addClass('hide');
                        ui.$mask.hide();
                    }
                });
                // 显示注册协议
                ui.$btn_common.on('click', function() {
                    var common = $(this).data('common');
                    if(common == 'showAccept') {
                        ui.$mask.show();
                        ui.$dialog_acccept.removeClass('hide');
                    }
                });
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
            // 显示注册
            fShowRegist: function(type, step) {
                if(!type) {
                    type = 'mobile';
                }
                this.fShowRegistType(type);
                this.fShowRegistContent(type, step);
            },

            // 注册方式显示
            fShowRegistType: function(type) {
                var $lis = ui.$nav_regist_type.find('li').removeClass('cur');
                $lis.each(function() {
                    if($(this).data('type') == type) {
                        $(this).addClass('cur');
                        return false;
                    }
                });
            },
            // 注册内容块显示
            fShowRegistContent: function(type, step) {
                ui.$nav_regist_step.addClass('hide');
                ui.$form_mobile_step1.addClass('hide');
                ui.$form_mobile_step2.addClass('hide');
                ui.$div_mobile_step3.addClass('hide');
                ui.$form_ordinary_regist.addClass('hide');
                ui.$div_ordinary_success.addClass('hide');
                if(!step) {
                    step = 1;
                }
                if(!type) {
                    type = 'mobile';
                }
                if(type == 'mobile') {
                    ui.$nav_regist_step.removeClass('hide')
                        .find('li').removeClass('cur').eq(step-1).addClass('cur');
                    if(step == 1) {
                        ui.$form_mobile_step1.removeClass('hide');
                    } else if(step == 2) {
                        ui.$form_mobile_step2.removeClass('hide');
                    } else if(step == 3) {
                        ui.$div_mobile_step3.removeClass('hide');
                    }
                } else if(type == 'ordinary') {
                    if(step == 1) {
                        ui.$form_ordinary_regist.removeClass('hide');
                    } else if(step == 2) {
                        ui.$div_ordinary_success.removeClass('hide');
                    }
                }
            },
            // 手机注册步骤显示
            fShowRegist_mobile_nav: function(step) {
                ui.$nav_regist_step.find('li').removeClass('cur').index(step - 1).addClass('cur');
            },
            fGetRequest: function() {
                var url = location.search; //获取url中"?"符后的字串
                var theRequest = new Object();
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    for(var i = 0; i < strs.length; i ++) {
                        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
                    }
                }
                return theRequest;
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
