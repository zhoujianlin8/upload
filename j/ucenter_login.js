yp.use('jquery.placeholder.min',function(){
    yp.ready(function(){
        var ui = {
            $loginSubmit: $('#loginSubmit'),
            $errorText: $('.titInfo'),
            $change: $('#changeOnce'),
            $checkpic: $('#captchaPic')
        };
        var oPageLogin = {
            init:function () {
                this.view();
                this.bindEvent();
            },
            view:function () {
            },
            bindEvent:function () {
                var self=this;
                //验证
                $('body').on('blur','[data-valid]',function(){
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
                        $form.submit();
                    }
                })
                //点击更换一张验证码
                ui.$change.on('click',function(){
                    var url=ui.$checkpic.attr('src');
                    var arr=url.split('_t=');
                    var len=arr.length;
                    arr[len-1]=arr[len-1]*2;
                    var sUrl=arr.join('_t=');
                    ui.$checkpic.attr('src',sUrl);
                    return false;
                });
            },
            fValidSuccess: function($obj) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo dv"></i></span>');
                if($obj.closest('form').find('.error:not(hide)').length == 0){
                    $('.titInfo').addClass('hide');
                }
            },
            fValidError: function($obj, content) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo error dv"></span>');
                $('.titInfo').replaceWith('<div class="titInfo"><i class="warn png dv"></i><span class="dv">'+content+'</span></div>');
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
                var reg=/^[0-9a-z\u4E00-\u9FA5]{1,40}$/i;
                var error=["不能为空","格式不对"];
                var sType=$this.attr('data-valid')
                if(sType=='userid'){
                    error=["游戏账号不能为空","游戏账号格式不对"];
                }else if(sType == 'password'){
                    reg=/^[0-9a-z#$@&*]{6,40}$/i;
                    error=["密码不能为空","密码格式不对"];
                }else if(sType == 'checkNum'){
                    reg=/^[0-9a-z]{4}$/i;
                    error=["验证码不能为空","验证码格式不对"];
                    fValid();
                    if($this.closest('.formRow').find('.error:not(.hide)').length){
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
                fValid();
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
            }

        };
        oPageLogin.init();
    })
})
