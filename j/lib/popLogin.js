$(function () {
  var ui = {
        $login: $('#login'),
        $wrapModal: $("#wrapModal")
      };

  var oPopLogin = {
    sCaptchaImgSrc: '',

    init: function(){
      var self = this;

      self.sCaptchaImgSrc = window.APP_URL + '?c=index&a=verify&_t=1';
      $('body').append('<div class="modal userLogin hide" id="loginModal"></div>');
      ui.$loginModal = $('#loginModal');
      //打开登录框
      ui.$login.on('click',function(){
        self.view();
        self.bindEvent();

        ui.$loginModal.removeClass('hide').show();
        return false;
      })

    },
    view: function(){
      var self = this;

      var sCaptcha = ''
        , sHtml = '';

      if(window.BSHOWCAPTCHA){
        sCaptcha = '<div class="formTr" style="margin-top:20px;">\
                      <b>验证码：</b>\
                      <input type="text" class="inputMin" name="captcha" data-valid="checkNum">\
                      <div class="checkedNumber inlineB" style="width:72px; height: 32px;"><img src="' + self.sCaptchaImgSrc + '" id="checkNumPic"/></div>\
                      <button class="greenIt" id="changeOne">换一张</button><span class="tipInfo"></span>\
                    </div>';
      }

      sHtml = '<div class="mask"></div>\
                <div class="modalContent">\
                    <div class="modalHd clearFix png"><h3 class="fl"><i class="user png"></i>玩家登录</h3><a class="close fr png" href="###" title="关闭" id="btn_close_modal"></a></div>\
                    <div class="modalBd">\
                        <form action="/?c=index&a=login">\
                            <div class="first">\
                                <div class="formTr">\
                                    <b>游戏账号：</b>\
                                    <input type="text" class="inputSmall" placeholder="请输入您的账号..." name="userid" data-valid="userid"><span class="tipInfo"></span>\
                                </div>\
                                <div class="formTr">\
                                    <b>密码：</b>\
                                    <input type="password" class="inputSmall" name="password" data-valid="password"><span class="tipInfo"></span>\
                                    <a href="' + window.APP_URL + 'index.php?c=findpwd" class="forgetPassword greenIt">忘记密码？</a>\
                                </div>' + sCaptcha + '<div class="errorText hide"></div>\
                            </div>\
                            <div class="loginNow">\
                                <a href="###" class="btn enrollNow" id="btn_login_submit">立刻登录</a><a class="greenIt" href="' + window.APP_URL + 'index.php?c=register">我要注册</a>\
                            </div>\
                        </form>\
                    </div>\
                    <div class="modalFt png"></div>\
                </div>';

      ui.$loginModal.html(sHtml);
      
      ui.$loginClose = $('#btn_close_modal');
      ui.$loginSubmit = $('#btn_login_submit');
      ui.$errorText = $('.userLogin .errorText');
      ui.$change = $('#changeOne');
      ui.$checkpic = $('#checkNumPic');
    },
    bindEvent:function () {
      var self=this;
      
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
              window.BSHOWCAPTCHA = false;
              if(window.fLoginSuccess ) {
                fLoginSuccess(msg);
              }
            }else{
              self.fValidError('',msg.message);
              if(msg.data){
                if(msg.data.ecount>2){
                  window.BSHOWCAPTCHA = true;
                  if(!$('#changeOne').length){
                    $('.errorText').before('<div class="formTr" style="margin-top:20px;">\
            <b>验证码：</b>\
        <input type="text" class="inputMin"  name="captcha" data-valid="checkNum">\
            <div class="checkedNumber inlineB" style="width:72px; height: 32px;"><img src="' + self.sCaptchaImgSrc + '" id="checkNumPic"/></div>\
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
      ui.$loginModal.on('click','#changeOne',function(){
        ui.$checkpic=$('#checkNumPic');
        var url = self.sCaptchaImgSrc
          , arr = url.split('_t=')
          , len = arr.length;

        arr[len-1] = arr[len-1]*2;
        self.sCaptchaImgSrc = arr.join('_t=');
        ui.$checkpic.attr('src', self.sCaptchaImgSrc);
        return false;
      });
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
      var reg=/^[0-9a-z\u4E00-\u9FA5]{1,40}$/i;
      var error=["不能为空","格式不对"];
      var sType=$this.attr('data-valid');
      if(sType=='userid'){
        error=["游戏账号不能为空","游戏账号格式不对"];
        fValid();
      }else if(sType == 'password'){
        reg=/^[0-9a-z#$@&*]{6,40}$/i;
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
    }
  };

  oPopLogin.init();
});