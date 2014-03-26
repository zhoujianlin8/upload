 yp.ready(function () {
        var ui = {
            $form_card:$('#form_card'),
            $card_password:$('#card_password'),
            $card_success:$('#card_success'),
            $card_content:$('#card_content'),
            $btn_addCard:$('#btn_addCard'),
            $btn_next:$('#btn_next'),
            $txt_account:$('#txt_account'),
            $div_commonly_words:$('#div_commonly_words'),
            $btn_commonly_words:$('#btn_commonly_words'),
            $txt_message:$('#txt_message'),
            $stateContent:$('#stateContent'),
            btn_charge_again:'#btn_charge_again',
            $username:$('#span_cards_nickname'),
            $signature:$('#signature'),
            $messageOverflow:$('.messageOverflow'),
            $takeMessage:$('#takeMessage'),
            $messageArea:$('#messageArea'),
            $placeholder: $('[placeholder]'),
            $buyProps:$('#buyProps')
        };

        var oPage = {
            init:function () {
                this.view();
                this.bindEvent();
            },
            view:function () {
               ui.$placeholder.placeholder();
            },
            bindEvent:function () {
                var self = this;
                $('body').on('click', function () {
                    ui.$div_commonly_words.hide();
                })
                // 常用语
                ui.$btn_commonly_words.on('click', function () {
                    ui.$div_commonly_words.show();
                    return false;
                });
                ui.$div_commonly_words.on('click', 'li', function () {
                    var val = $(this).data('val');
                    ui.$txt_message.val(val).focus();
                })
                // 增加一张卡
                ui.$btn_addCard.on('click', function () {
                    if ($(this).closest('.addCard').hasClass('disable')) {
                        return false;
                    }
                    var content = $('#tmpl_card').html();
                    ui.$btn_next.closest('div.nextBtn').before(content);
                    if ($('.addCardPassword').length >= 2) {
                        ui.$btn_addCard.closest('.addCard ').addClass("disable");
                    } else {
                        ui.$btn_addCard.closest('.addCard ').removeClass("disable");
                    }
                });
                ui.$card_content.on('click', 'a', function () {
                    var $this = $(this),
                        action = $this.data('action');
                    if (action == 'remove_card') {
                        $this.closest('div.addCardPassword').remove();
                        if ($('.addCardPassword').length >= 2) {
                            ui.$btn_addCard.closest('.addCard ').addClass("disable");
                        } else {
                            ui.$btn_addCard.closest('.addCard ').removeClass("disable");
                        }
                    }
                });
                // 账号
                ui.$txt_account.on('blur', function () {
                    self.fValidAccount(true);
                });
                //卡号
                $('body').on('blur', 'input[data-type=card_id]', function () {
                    var $this = $(this);
                    var sVal = $(this).val();
                    if (sVal == '') {
                        self.fValidError($this, '卡号不能为空');
                        return false;
                    } else {
                        self.fValidSuccess($this);
                       /* var reg = /^[a-z0-9]{15}$/i;
                        if (reg.test(sVal)) {
                            self.fValidSuccess($this);
                        } else {
                            if (sVal.length != 15) {
                                self.fValidError($this, '卡号位数不对');
                            } else {
                                self.fValidError($this, '卡号格式不对');
                            }
                        }*/

                    }
                });
                //密码不为空验证
                $('body').on('blur', 'input[data-type=card_pwd]', function () {
                    var $this = $(this);
                    var sVal = $(this).val();
                    if (sVal == '') {
                        self.fValidError($this, '密码不能为空');
                        return false;
                    } else {
                        self.fValidSuccess($this);
                    }
                });
                // 充值提交
                ui.$btn_next.on('click', function () {
                    var $this = $(this);
                    if (!$this.data('ing')) {
                        $this.data('ing', true);
                        if (self.fValidForm()) {
                            self.fAjaxCardsSubmit();
                        } else {
                            $this.data('ing', false);
                            alert("请修改错误信息后提交");
                        }
                    }
                });
                // 再充一笔
                $('body').on('click', ui.btn_charge_again, function () {
                    self.fShowCardsContent();
                })
                //留言数量控制
                ui.$txt_message.on('keydown', function () {
                    var str = $(this).val();
                    var len = str.length;
                    if (len > 0 && ui.$username.text() != '') {
                        ui.$signature.val(ui.$username.text());
                    }
                    if (len > 100) {
                        $(this).val(str.substr(0, 100));
                        ui.$messageOverflow.removeClass('hide');
                    } else {
                        ui.$messageOverflow.addClass('hide');
                    }
                });
                //点击留言切换
                ui.$takeMessage.on('change', function () {
                    if ($(this).is(':checked')) {
                        ui.$messageArea.removeClass('hide').show();
                    } else {
                        ui.$messageArea.addClass('hide').hide();
                    }
                })
            },
            fValidSuccess:function ($obj) {
                $obj.siblings('.tipInfo').html('<span class="real dv"><i class="ico_16 i34"></i></span>');
            },
            fValidError:function ($obj, content) {
                $obj.siblings('.tipInfo').html('<span class="error dv"><i class="ico_16 i33"></i>' + content + '</span>');
            },
            fValidWait:function ($obj) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo"></span>');
            },
            fValidAccount:function (async) {
                var b = true;
                var val = ui.$txt_account.val();
                if (val == '') {
                    this.fValidError(ui.$txt_account, '请输入账号');
                    ui.$username.html('');
                    b = false;
                } else {
                    this.fValidWait(ui.$txt_account);
                    this.fAjaxAccount(async);
                }
                return b;
            },
            // 异步校验账号
            fAjaxAccount:function (async) {
                var b = false;
                var bAsync = async == undefined ? true : async;
                var self = this;
                var url = '?c=charge&a=checkAccount';
                var data = {account:ui.$txt_account.val()};
                $.post(url, data, function (msg) {
                    if (msg.code == 0) {
                        self.fValidSuccess(ui.$txt_account);
                        ui.$username.html(msg.data.nickname).closest('.formRow').removeClass('hide');
                        ui.$btn_next.data('ing',false);
                        b = true;
                    } else {
                        ui.$btn_next.data('ing',true);
                        self.fValidError(ui.$txt_account, '账号不存在');
                        ui.$username.html('');
                    }
                }, 'json');
                return b;
            },
            fValidCard:function () {
                var b = true;
                var $card_id = ui.$card_content.find('[data-type=card_id]'),
                    $card_pwd = ui.$card_content.find('[data-type=card_pwd]');
                for (var i = 0; i < $card_id.length; i++) {
                    var $id = $card_id.eq(i),
                        $pwd = $card_pwd.eq(i);
                    if ($id.val() == '') {
                        this.fValidError($id, '请输入卡号');
                        b = false;
                    }
                    if ($pwd.val() == '') {
                        this.fValidError($pwd, '请输入密码');
                        b = false;
                    }
                }
                return b;
            },
            fValidForm:function () {
                var b = (this.fValidAccount(false) && this.fValidCard()); //验证输入不为空
                if (ui.$form_card.find('.error:not(.hide)').length) {
                    b = false;               //验证不存在错误
                }
                return b;
            },
            fAjaxCardsSubmit:function () {
                var self = this;
                var url = '?c=charge&a=cardPost';
                var $form = ui.$btn_next.closest('form');
                $form.find('[data-type=card_id]').each(function (i) {
                    $(this).attr('name', 'card[' + (i + 1) + '][cardno]')
                });
                $form.find('[data-type=card_pwd]').each(function (i) {
                    $(this).attr('name', 'card[' + (i + 1) + '][cardpwd]')
                });
                var data = $form.serialize();
                ui.$btn_next.text('提交...');
                $.post(url, data, function (msg) {
                    if (msg.code == 0) {
                        self.fShowCardsSuccess(msg.data);  //成功
                    } else {  //失败
                        var data = msg.data;
                        var str = '';
                        if (typeof(data.success == 'object') && !$.isEmptyObject(data.success)) {
                            if (typeof(data.error == 'object') && !$.isEmptyObject(data.error)) {  //既有成功也有失败
                                var str = '';
                                for (var i in data.error) {
                                    str += '<tr><td>' + i + '</td><td>' + data.error[i] + '</td></tr>'
                                }
                                var sHtml = '<div class="errorAndSuccess textC">' +
                                    '<p>' + msg.message + '</p>' +
                                    '<div class="table">' +
                                    ' <table>' +
                                    ' <thead>' +
                                    ' <th>失败卡号</th><th>失败原因</th>' +
                                    ' </thead>' +
                                    ' <tbody>' + str +
                                    '</tbody>' +
                                    ' </table>' +
                                    ' </div>' +
                                    '<div class="nextBtn textC linear">' +
                                    '<a href="###" class="png" id="btn_charge_again">我还要再充一笔</a>' +
                                    '</div>' +
                                    '</div>';
                                ui.$stateContent.html(sHtml);
                                ui.$card_password.hide();
                                ui.$card_success.show();
                            }
                            /*    for(var i in data.success){
                             str +='<p><span class="orange">'+i+'</span><span>'+data.success[i]+'</span></p>'
                             }*/

                        } else {          //全部失败
                            var sHtml = '<div class="errorContent textC">' +
                                '<i class="i"></i>' +
                                '<p class="chargeFail">充值失败</p>' +
                                ' <p class="msg">' + msg.message + '</p>' +
                                ' </div>' +
                                ' <div class="nextBtn textC linear hide">' +
                                ' <a href="###" class="png" id="btn_charge_again">重新充值</a>' +
                                '</div>';
                            ui.$buyProps.hide();
                            ui.$stateContent.html(sHtml);
                            ui.$card_password.hide();
                            ui.$card_success.show();
                        }

                    }
                    ui.$btn_next.text('提交');
                    ui.$btn_next.data('ing', false);
                }, 'json')
            },
            fShowCardsSuccess:function (data) {
                var amount = data.amount;
                var style;
                if (data.flag == 1) {
                    style = '元宝';
                } else if (data.flag == 2) {
                    style = '两银子';
                }
                var account = ui.$username.text();
                var sHtml = '<div class="successContent textC">' +
                    '<i></i>' +
                    '<p>' +
                    '<span class="orange">' + account + '</span>已成功冲入<span class="orange">' + amount + '</span>' + style +
                    '</p>' +
                    '</div>' +
                    '<div class="nextBtn textC linear">' +
                    '<a href="###" class="png" id="btn_charge_again">我还要再充一笔</a>' +
                    '</div>';
                ui.$buyProps.show();
                ui.$stateContent.html(sHtml);
                ui.$card_password.hide();
                ui.$card_success.show();
            },
            fShowCardsContent:function () {
                ui.$card_success.hide();
                ui.$card_password.show();
            }
        }
        oPage.init();
    })

