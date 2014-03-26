yp.ready(function(){
    var ui = {
        $nav_charge_step: $('#nav_charge_step'),
        $txt_account: $('#txt_account'),
        $div_commonly_words: $('#div_commonly_words'),
        $btn_commonly_words: $('#btn_commonly_words'),
        $txt_message: $('#txt_message'),
        $ul_money_list: $('#ul_money_list'),
        $span_total_money: $('#span_total_money'),
        $txt_yuanbao: $('#txt_yuanbao'),
        $txt_charge_yuanbao: $('#txt_charge_yuanbao'),
        $btn_step_1: $('#btn_step_1'),
        $form_step_1: $('#form_step_1'),
        $btn_retun_step1: $('[data-goBack=true]'),
        $btn_step_2: $('#btn_step_2'),
        $btn_step_3: $('#btn_step_3'),
        $btn_step_4: $('#btn_step_4'),
        $div_step_3: $('#div_step_3'),
        $username: $('#span_cards_nickname'),
        $success_content: $('#span_cards_success_content'),
        $orderList: $('#orderInfoList'),
        $channel: $('#channel_val'),
        $leftSideNav: $('#leftSideNav'),
        $div_step_2: $('#div_step_2'),
        $playPageAgain: $('[data-playPage=again]'),
        $signature: $('#signature'),
        $messageOverflow: $('.messageOverflow'),
        $takeMessage: $('#takeMessage'),
        $messageArea: $('#messageArea'),
        $placeholder: $('[placeholder]')
    };
    var nRebate = 1; //充值平台折扣率
    var nrebate = ui.$txt_yuanbao.attr('rebate') || 1; //折扣率
    var nUnit = ui.$txt_yuanbao.attr('unit') || 0.85; //汇率
    var oPage = {
        init: function() {
            this.view();
            this.bindEvent();
        },
        view: function() {
            ui.$placeholder.placeholder();
            ui.$ul_money_list.find('.checked:not(.hide)').eq(0).closest('li').trigger('click');
            var strChannel =ui.$leftSideNav.find('.cur, .firstCur').find('[channel]').attr('channel');
            ui.$channel.val(strChannel);
            nRebate = ui.$leftSideNav.find('.cur, .firstCur').find('[rebate]').attr('rebate') || 1;
            var sType=ui.$leftSideNav.find('.cur, .firstCur').attr('data-type');
            if(sType == 'alipay'){
                ui.$div_step_3.addClass('zhifubao');
                ui.$div_step_3.find('[data-text=name]').text('支付宝');
            }else if(sType == 'snda'){
                ui.$div_step_3.addClass('shengda');
                ui.$div_step_3.find('[data-text=name]').text('盛大充值');
            }else if(sType == 'yeepay'){
               ui.$div_step_3.addClass('');
               ui.$div_step_3.find('[data-text=name]').text('易宝支付');
            }
        },
        bindEvent: function() {
            var self = this;
            $('body').on('click', function() {
                ui.$div_commonly_words.hide();
            });
            // 常用语
            ui.$btn_commonly_words.on('click', function() {
                ui.$div_commonly_words.show();
                return false;
            });
            ui.$div_commonly_words.on('click', 'li', function() {
                var val = $(this).data('val');
                ui.$txt_message.val(val).focus();

            });
            // 账号
            ui.$txt_account.on('blur', function() {
                self.fValidAccount(true);
            });
            // 选择充值额度
            ui.$ul_money_list.on('click', 'li', function() {
                var $this = $(this),
                    $this_money = $this.find('div[data-money]'),
                    index = $this.index(),
                    nMoney = $this_money.attr('data-money') || 0;

                if(index != 5) {
                    ui.$txt_yuanbao.addClass('disabled');
                    self.fShowTotalMoney(nMoney);
                } else {
                    ui.$txt_yuanbao.removeClass('disabled');
                    self.fShowTotalMoney(nMoney);
                }
                $this_money.removeClass('hide')
                    .end().siblings('li').find('div[data-money]').addClass('hide');
            });
            // 元宝输入限制
            ui.$txt_yuanbao.on('keydown', function(e) {
                if($(this).hasClass('disabled')){return false}
                var k = window.event ? e.keyCode : e.which;
                if (((k >= 48) && (k <= 57)) || ((k >= 96) && (k<=105)) || k == 8 || k == 0 || k == 37 ||k == 39) {
                } else {
                    if (window.event) {
                        window.event.returnValue = false;
                    } else {
                        e.preventDefault(); //for firefox
                    }

                }
            }).on('blur', function() {
                    if($(this).hasClass('disabled')){return false}
                    self.fShowTotalMoney($(this).val());
                });
            // 步骤一  提交，下一步
            ui.$btn_step_1.on('click', function() {
                if(!$(this).data('ing')){
                    $(this).data('ing',true);
                    if(self.fValidForm()) {
                        self.fAjaxSubmitStep1();
                    }else{
                        $(this).data('ing',false);
                    }
                }

                //  $(this).data('ing',false);
            });
            // 步骤二，返回修改
            ui.$btn_retun_step1.on('click', function() {
                self.fSetChargeStep(0);
            });
            // 步骤二，确认提交
            ui.$btn_step_2.on('click', function() {
                $('#formSubmit').submit();
                self.fSetChargeStep(2);
            });
            //重新弹出支付页面
            ui.$playPageAgain.on('click',function(){
                $('#formSubmit').submit();
            })
            // 步骤三，确认提交
            ui.$btn_step_3.on('click', function() {
                var $this=$(this);
                if(!$this.data('ing')){
                    $this.data('ing',true)
                    var orderid=$('#formSubmit').find('[name=orderid]').val();
                    var url='?c=charge&a=getOrderStatus';
                    var data={orderid:orderid};
                    $.post(url,data,function(msg){
                        var data=msg.data;
                        if(msg.code == 0){
                            self.fSetChargeStep(3);
                            var amount=data.amount;
                            var style;
                            if(data.flag==2){
                                style='元宝';
                            }else if(data.flag==1){
                                style='银子';
                            }
                            var account=ui.$username.text();
                            var sHtml = '<span class="orange">'+account+'</span>已成功冲入<span class="orange">'+amount+'</span>'+style;
                            ui.$success_content.html(sHtml);
                        }else{
                            if(data.paystatus == 0){   //订单付款失败
                                alert(msg.message);
                            }else if(data.paystatus == 1){ //已付款
                                alert(msg.message);
                            }
                            //self.fSetChargeStep(3);
                        }
                        $this.data('ing',false)
                    },"json");
                }
                return false;
            });

            // 步骤四，再充一笔
            ui.$btn_step_4.on('click', function() {
                self.fSetChargeStep(0);
            });
            //留言数量控制
            ui.$txt_message.on('keydown',function(){
                var str=$(this).val();
                var len=str.length;
                if(len>0 && ui.$username.text() != ''){
                    ui.$signature.val(ui.$username.text());
                }
                if(len>100){
                    $(this).val(str.substr(0,100));
                    ui.$messageOverflow.removeClass('hide');
                }else{
                    ui.$messageOverflow.addClass('hide');
                }
            });
            //点击留言切换
            ui.$takeMessage.on('change',function(){
                if($(this).is(':checked')){
                    ui.$messageArea.removeClass('hide').show();
                }else{
                    ui.$messageArea.addClass('hide').hide();
                }
            })
        },
        fSetChargeStep: function(index) {
            ui.$nav_charge_step.find('li').eq(index).addClass('cur').siblings().removeClass('cur');
            var step = index + 1;
            for(var i=1;i<=4;i++) {
                var id = 'div_step_' + i;
                if(step == i) {
                    $('#' + id).removeClass('hide');
                } else {
                    $('#' + id).addClass('hide');
                }
            }
        },
        fValidSuccess: function($obj) {
            $obj.siblings('.tipInfo').html('<span class="real dv"><i class="ico_16 i34"></i></span>');
        },
        fValidError: function($obj, content) {
            $obj.siblings('.tipInfo').html('<span class="error dv"><i class="ico_16 i33"></i>'+content+'</span>');
        },
        fValidWait: function($obj) {
            $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo"></span>');
        },
        fValidAccount: function(async) {
            var b = true;
            var val = ui.$txt_account.val();
            if(val == '') {
                this.fValidError(ui.$txt_account, '请输入账号');
                ui.$username.html('');
                b = false;
            } else {
                this.fValidWait(ui.$txt_account);
                this.fAjaxAccount();
            }
            return b;
        },
        // 异步校验账号
        fAjaxAccount: function(async) {
            var self = this;
            var url='?c=charge&a=checkAccount';
            var data={account: ui.$txt_account.val()};
            $.post(url,data,function(msg){
                if(msg.code == 0){
                    self.fValidSuccess(ui.$txt_account);
                    ui.$username.html(msg.data.nickname).closest('.formRow').removeClass('hide');
                    ui.$btn_step_1.data('ing',false);
                    b=true;
                }else{
                    ui.$username.html('');
                    self.fValidError(ui.$txt_account,'账号不存在');
                    ui.$btn_step_1.data('ing',true);
                }
            },'json');
        },
        fValidChargeMoney: function() {
            var b = true;
        },
        // 显示金额
        fShowTotalMoney: function(nYb) {
            var num = (nYb * nrebate * nRebate * nUnit || 0).toFixed(2);
            ui.$span_total_money.text(num);
            ui.$txt_charge_yuanbao.val(nYb);
            ui.$txt_yuanbao.val(nYb);
        },
        // 提交第一步表单
        fAjaxSubmitStep1: function() {
            var self = this;
            ui.$btn_step_1.text('提交...');
            ui.$form_step_1.ajaxSubmit({
                type:'post',
                url:'?c=charge&a=payOrder',
                success:function(data) {
                    if(data.code == 0) {
                        self.fSetChargeStep(1);
                        self.fSuccessStep1(data.data);
                    } else {
                        alert(data.message);
                    }
                    ui.$btn_step_1.text('提交');
                    ui.$btn_step_1.data('ing',false);
                }
            });
            // self.fSetChargeStep(1); //调试
        },
        fValidForm: function() {
            if(ui.$txt_charge_yuanbao.val() == '') {
                ui.$btn_step_1.data('ing',false);
                alert('请选择充值元宝数量');
                return false;
            }
            return this.fValidAccount(false);
        },
        fSuccessStep1: function(data){
            var info=data.info;
            var username=ui.$username.text();
            var sHtml='<tr><td class="first">充值方式:</td> <td class="last">'+info.payname+'</td></tr>'+
                '<tr class="even"> <td class="first">充值账号:</td><td class="last">'+info.account+'</td></tr>'+
                '<tr> <td class="first">昵称:</td> <td class="orange last">'+username+'</td></tr>'+
                '<tr class="even"><td class="first">充值所得:</td> <td class="last">'+info.amount+'</td> </tr>'+
                '<tr> <td class="first">充值金额:</td> <td class="orange last">'+info.total_fee+ this.fMoney(info.pro_flag)+'</td></tr>'+
                '<tr class="even"><td class="first">订单编号:</td> <td class="last">'+data.orderid+'</td> </tr>';
            ui.$orderList.html(sHtml);
            var sForm='<form action="'+data.gateway+'" method="'+data.method+'" target="_blank" id="formSubmit">'+
                '<input type="hidden" name="orderid" value='+data.orderid+'>'+
                '<input type="hidden" name="signature" value='+data.signature+'>'+
                '</form>';
            ui.$div_step_2.find('.formSubmit').empty().append(sForm);
            this.fSetChargeStep(1);
        },
        fMoney: function(c){
            var str='';
            if(c== 'yz'){
                str='银子';
            }else if(c== 'yb'){
                str='元宝'
            }
            return str;
        }

    }
    oPage.init();
})

