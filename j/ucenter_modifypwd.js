yp.use('jquery.form', function(){
    yp.ready(function(){
        var ui = {
            $submit: $('#submit'),
            $valid: $('[data-valid]'),
            $changeOnce: $('#changeOnce'),
            $captcha: $('#captcha'),
            $tabC:$('.tabc')
        };

        var oPagePassword = {
            init:function () {
                this.view();
                this.bindEvent();
            },
            view:function () {
            },
            bindEvent:function () {
                var self=this;
                //验证
                ui.$valid.on('blur',function(){
                    self.fValidInput($(this));
                });
                //点击更换一张验证码
                ui.$changeOnce.on('click',function(){
                    var url=ui.$captcha.attr('src');
                    var arr=url.split('_t=');
                    var len=arr.length;
                    arr[len-1]=arr[len-1]*2;
                    var sUrl=arr.join('_t=');
                    ui.$captcha.attr('src',sUrl);
                });
                //点击下一步提交操作
                ui.$submit.on('click',function(){
                    var $this = $(this);
                    var $form= $this.closest('form');
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        if(self.fFormValid($form)){
                            $form .ajaxSubmit({
                                success:function(msg){
                                    if(msg.code == 0){
                                        self.fShowNext(1);
                                    }else{
                                        alert(msg.message)
                                    }
                                    $this.data('ing', false);

                                }
                            });
                        }else{
                            alert('请修改错误后提交');
                            $this.data('ing', false);
                        }
                    }

                })
            },
            fValidSuccess: function($obj) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo real dv"><i class="ico_16 i34"></i></span>');
            },
            fValidError: function($obj, content) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo error dv"><i class="ico_16 i33"></i>'+content+'</span>');
            },
            fValidNull: function($obj) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo"></span>');
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
                var reg=/^[0-9a-z@#!%^&*()$]{8,40}$/i;
                var error=["还没有输入密码呀","密码格式不对哦"];
                var sType=$this.attr('data-valid');
                if(sType=='oldpwd'){
                    fValid();
                }else if(sType == 'newpwd'){
                    self.fyPassword($this);
                  /*  fValid();*/
                    /*  var val= $this.val();
                     var rank=verifyPasswordLevel(val);
                     $this.siblings('.strength').removeClass('.hide');*/
                }else if(sType == 'confirmpwd'){
                    fValid();
                    var target=$this.attr('data-target');
                    var $target=$(target);
                    if($this.val()!==$target.val()){
                        self.fValidError($this,'两次输入的密码不一致');
                    }
                }else if(sType == 'checkNum'){
                    reg=/^[0-9a-z]{4}$/i;
                    error=["验证码不能为空","验证码格式不对"];
                    var val=$this.val();
                    if(val==''){
                        self.fValidError($this,error[0]);
                    }else{
                        if(reg.test(val)){
                            self.fValidNull($this);
                        }else{
                            self.fValidError($this,error[1]);
                        }
                    }
                    if($this.closest('.formRow').find('.error:not(.hide)').length){
                        return false;
                    }
                    var url='/index.php?c=index&a=checkVerify';
                    var data=$this.val();
                    var param={captcha:data};
                    $.ajax({
                        url: url,
                        data: param,
                        type: 'POST',
                        async: false,
                        dataType: 'json',
                        success: function(msg){
                            if(msg.code ==0){
                                self.fValidSuccess($this);
                            }else{
                                self.fValidError($this,msg.message);
                            }
                        }
                    });
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
            fShowNext:function(i){
                ui.$tabC.addClass('hide').eq(i).removeClass('hide');
            },
            fyPassword: function($this){
                $this.siblings('.strength ').addClass('hide');
                var val = $this.val();
                if(val == '') {//验证为空
                    this.fValidError($this,'密码不能为空');
                    return false;
                }
                if(val.length<8 || val.length>40 ){
                    this.fValidError($this,'密码长度8-40位');
                    return false;
                }
                if(/^[a-zA-Z]{8,40}$/.test(val)){
                    this.fValidError($this, '密码不能全为字母');
                    return false;
                }
                if(/^[0-9]{8,40}$/.test(val)){
                    this.fValidError($this, '密码不能全为数字');
                    return false;
                }
                if(/^[@#!$%^*&+_-]{8,40}$/.test(val)){
                    this.fValidError($this, '密码不能全为字符');
                    return false;
                }
                if(!/^[A-Za-z0-9@#!$%&^*&+_-]{8,40}$/.test(val)){
                    this.fValidError($this, '密码格式不对');
                    return false;
                }
                this.fValidSuccess($this);
                // 显示等级高低
                var level = this.fyPasswordLevel(val);
                console.log(111111,level,$this.siblings('.strength ').find('li'));
                $this.siblings('.strength ').removeClass('hide')
                                            .find('li').removeClass('cur')
                                                        .eq(level).addClass('cur');


            },
           fyPasswordLevel: function(s){
               var ls = 0;
               if(s.length <18){
                   ls=0;
               }else if(s.length <30){
                   ls=1;
               }else if(s.length <=40){
                   ls=2;
               }
               return ls;
           }
        }
        oPagePassword.init();
    })
})
