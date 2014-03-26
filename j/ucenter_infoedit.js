yp.use('jquery.form, pca ,jquery.form',function(){
    yp.ready(function(){
        var ui = {
            $save: $('#save'),
            $idCard: $('#txt_idCard'),
            $email: $('#email'),
            $phone: $('#phone'),
            $QQ: $('#QQ'),
            $MSN: $('#MSN'),
            $username: $('#username')
        };

        var oPageEdit = {
            init:function () {
                this.view();
                this.bindEvent();
            },
            view:function () {
                $("#pca").pca({valueType:'id',province: window.province, city: window.city, area: window.area });
                // $("#pca2").pca({valueType:'id',province:0, city:0, area:0});
            },
            bindEvent:function () {
                var self=this;
                //身份证验证
                ui.$idCard.on('blur',function(){
                    var error=["身份证号码不能为空"," 身份证号码格式不对"];
                    var $this=$(this);
                    var val=$this.val();
                    if(val==''){
                        self.fValidError($this,error[0]);
                    }else{
                        var reg=/(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
                        if(reg.test(val)){
                            self.fValidSuccess($this);
                        }else{
                            self.fValidError($this,error[1]);
                        }
                    }
                });
                //真实姓名验证
                ui.$username.on('blur',function(){
                    var error=["姓名不能为空","姓名格式不对"];
                    var $this=$(this);
                    var val=$this.val();
                    if(val==''){
                        self.fValidNull($this);
                    }else{
                        var reg=/^[\u4E00-\u9FA5]{2,4}$/;
                        if(reg.test(val)){
                            self.fValidSuccess($this);
                        }else{
                            self.fValidError($this,error[1]);
                        }
                    }
                });
                //邮箱验证
                ui.$email.on('blur',function(){
                    var error=[" 邮箱账号不能为空"," 邮箱账号格式不对"];
                    var $this=$(this);
                    var val=$this.val();
                    if(val==''){
                        self.fValidNull($this);
                    }else{
                        var reg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                        if(reg.test(val)){
                            self.fValidSuccess($this);
                        }else{
                            self.fValidError($this,error[1]);
                        }
                    }
                });
                //QQ 号码验证
                ui.$QQ.on('blur',function(){
                    var error=[" QQ账号不能为空"," QQ账号格式不对"];
                    var $this=$(this);
                    var val=$this.val();
                    if(val==''){
                        self.fValidNull($this);
                    }else{
                        var reg=/^[0-9]{5,10}$/;
                        if(reg.test(val)){
                            self.fValidSuccess($this);
                        }else{
                            self.fValidError($this,error[1]);
                        }
                    }
                })
                //MSN 号码验证
                ui.$MSN.on('blur',function(){
                    var error=["MSN账号不能为空"," MSN账号格式不对"]
                    var $this=$(this);
                    var val=$this.val();
                    if(val==''){
                        self.fValidNull($this);
                    }else{
                        var reg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                        if(reg.test(val)){
                            self.fValidSuccess($this);
                        }else{
                            self.fValidError($this,error[1]);
                        }
                    }
                })
                //手机号码验证
                ui.$phone.on('blur',function(){
                    var error=["手机号码不能为空"," 手机号码格式不对"]
                    var $this=$(this);
                    var val=$this.val();
                    if(val==''){
                        self.fValidNull($this);
                    }else{
                        var reg=/^(13[0-9]|14[1357]|15[0123456789]|18[012356789])[0-9]{8}$/;
                        if(reg.test(val)){
                            self.fValidSuccess($this);
                        }else{
                            self.fValidError($this,error[1]);
                        }
                    }
                })
                // 提交
                ui.$save.on('click',function(){
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        var $form=$this.closest('form');
                        if(self.fValidForm($form)){
                            $form .ajaxSubmit({
                                success:function(msg){
                                    if(msg.code == 0){
                                        alert('编辑成功');
                                    } else{
                                        alert(msg.message);
                                    }

                                    $this.data('ing', false);
                                }
                            })
                        } else{
                            alert('请修改错误后提交');
                            $this.data('ing', false);
                        }
                    }
                })
            },
            fValidForm: function($form){
                ui.$idCard.length && ui.$idCard.trigger('blur');
                if($form.find('.error').not('.hide').length){
                    return false;
                }
                return true;
            },
            fValidSuccess: function($obj) {
                $obj.next('.tipInfo').replaceWith('<span class="tipInfo real dv"><i class="ico_16 i34"></i></span>');
                },
                fValidError: function($obj, content) {
                    $obj.next('.tipInfo').replaceWith('<span class="tipInfo error dv"><i class="ico_16 i33"></i>'+content+'</span>');
                    },
                fValidNull: function($obj) {
                    console.log(222,$obj,$obj.next('.tipInfo'));
                    $obj.next('.tipInfo').replaceWith('<span class="tipInfo"></span>');
                    }
                };
                oPageEdit.init();
    })
})