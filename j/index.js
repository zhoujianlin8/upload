yp.use('tabs, slimscroll, bannerSwitch, jquery.placeholder.min, jquery.tmpl.min, newTipsCollapse, gameListCollapse', function() {
	yp.ready(function() {
        var ui = {
            $loginAreaUl: $(".loginArea .di"),
            $bannerSwitch: $(".bannerSwitch"),
            $slimScroll: $(".slim-scroll"),
        	$tabC: $('[data-content="tab"]'),
            $scrolling: $('[data-toggle="scrolling"]'),
            $activityArea: $('.activityArea'),
            $placeholder: $("[placeholder]"),
            $charge: $(".charge"),
            $loginRegisterArea: $('.loginRegisterArea'),
            $login: $(".login"),
            $immediate: $(".immediate"),
            $immediateContent: $('.immediateContent'),
            $userLoginTitle: $('.userLoginTitle'),
            $t_loginForm: $("#t_loginForm"),
            $t_logined: $("#t_logined"),
            $t_immediate: $("#t_immediate"),
            $t_headerlogined: $("#t_headerlogined"),
            $t_headerlogin: $("#t_headerlogin")
        };

        var page = {
            oAjaxUrl: {
                checkAccountUrl: '?c=charge&a=checkAccount',
                chargeUrl: '?c=charge&a=cardPost',
                loginUrl: '?c=index&a=login',
                logoffUrl: '?c=ucenter&a=logout',
                reflashUrl: '?c=index&a=feed'
            },
            nReflashDelay: 5 * 60000,   // 右下角刷新的时间间隔，5分钟
            nReflashTimeout: 0,
            oLastReflash: { id: 0, date: 0 },   // 最近一次刷新获得的最晚的数据
            nIdentifyImgIndex: 1,   // 验证码数字，从1开始，每次请求验证码都需要加1
            bNeedIdentifyCode: false, // 是否要验证码

            init: function() {
                this.view();
                this.bindEvent();
            },
            view: function() {
                var $oSlimScroll = ui.$slimScroll.slimScroll({
                    height: 435,
                    position: 'right'
                });
                ui.$bannerSwitch.bannerSwitch();
                ui.$placeholder.placeholder();
                ui.$scrolling.newTipsCollapse();
                ui.$tabC.gameListCollapse();

                this.fGameCategorySliding();
                //this.fReflashTimeline();

                this.bNeedIdentifyCode = !ui.$login.hasClass('again');
            },
            bindEvent: function(){
            	var self = this,
                    nTimeout;

                // 活动赛事，鼠标移入移出事件
                ui.$activityArea.on('mouseenter', '.toHover', function(){
                    var $this = $(this),
                        $subContent = $this.find('.subContent');

                    if(!$subContent.is(":visible")){
                        nTimeout = setTimeout(function(){
                            $subContent.show();
                            $subContent.animate({ top: 0 }, 200, 'linear');
                        }, 300);
                    } else {
                        if($subContent.is(":animated")){
                            $subContent.stop();
                            $subContent.animate({ top: 0 }, 200, 'linear');
                        }
                    }
                });
                ui.$activityArea.on('mouseleave', '.toHover', function(){
                    var $this = $(this),
                        $subContent = $this.find('.subContent');

                    if(!$subContent.is(":visible")){
                        nTimeout && clearTimeout(nTimeout);
                    } else {
                        if($subContent.is(":animated")){
                            $subContent.stop();
                            $subContent.animate({ top: 111 }, 200, 'linear', function(){
                                $subContent.hide();
                            });
                        } else {
                            $subContent.animate({ top: 111 }, 200, 'linear', function(){
                                $subContent.hide();
                            });
                        }
                    }
                });

                // 登录框、充值框
                ui.$loginRegisterArea.on('tabsactive', function(e, data){
                    var bToggle = ( 0 == data.index ) ? false : true;
                    $(this).find('.tab_panel').toggleClass('change', bToggle);
                });
                // 立即充值按钮
                ui.$charge.on('click', '.submitBtn', function(){
                    if(ui.$charge.data('submiting')){
                        return false;
                    }

                    var $account = ui.$charge.find('.accountNum'),
                        $cardNum = ui.$charge.find('.cardNum'),
                        $cardPassword = ui.$charge.find('.cardPassword'),
                        $notice = ui.$charge.find('.notice'),
                        $uid = ui.$login.find('#userId'),
                        sAccount = $account.val(),
                        sCardNum = $cardNum.val(),
                        sCardPassword = $cardPassword.val();

                    self.fShowMsg($notice, '提交中...');

                    $account.siblings('.png').removeClass('error ok');
                    $cardNum.siblings('.png').removeClass('error ok');
                    $cardPassword.siblings('.png').removeClass('error ok');

                    if('' == sAccount){ // 游戏账号不能为空
                        fShowOkOrError(false, $account, $notice, '请输入账号');
                        return false;
                    }

                    if(15 != sCardNum.length){
                        fShowOkOrError(false, $cardNum, $notice, '卡号位数不对');
                        return false;
                    }

                    if('' == sCardPassword.length){
                        fShowOkOrError(false, $cardPassword, $notice, '请填写密码');
                        return false;
                    }

                    ui.$charge.data('submiting', true); // 添加标示，正在提交
                    // ajax检测游戏账号
                    $.ajax({
                        url: self.oAjaxUrl.checkAccountUrl,
                        data: { account: sAccount },
                        type: 'POST',
                        dataType: 'json',
                        success: function(data){
                            if(0 == data.code){
                                fShowOkOrError(true, $account, $notice);

                                $.ajax({
                                    url: self.oAjaxUrl.chargeUrl,
                                    data: { account: sAccount, 'card[1][cardno]': sCardNum, 'card[1][cardpwd]': sCardPassword },
                                    type: 'POST',
                                    dataType: 'json',
                                    success: function(data){
                                        ui.$charge.data('submiting', false);
                                        if(0 == data.code){
                                            $account.val('').siblings('.png').removeClass('error ok');
                                            $cardNum.val('').siblings('.png').removeClass('error ok');
                                            //$cardPassword.val('').siblings('.png').removeClass('error');
                                            self.fShowMsg($notice, '充值成功');
                                            setTimeout(function(){
                                                self.fShowMsg($notice, false);
                                            }, 1000);
                                        } else {
                                            var error = data.data.error;
                                            fShowOkOrError(false, $cardNum, $notice, error[sCardNum]);
                                        }

                                        return false;
                                    }
                                });
                            } else {
                                ui.$charge.data('submiting', false);
                                fShowOkOrError(false, $account, $notice, data.message);
                                return false;
                            }
                        }
                    });

                    return false;
                });
                function fShowOkOrError(bOk, aInput, $notice, sMsg){
                    // 显示错误信息
                    if(!$.isArray(aInput)){
                        aInput = [aInput];
                    }
                    if(bOk){
                        $.each(aInput, function(i, v){
                            v.siblings('.png').removeClass('error').addClass('ok');
                        });
                        //self.fShowMsg($notice, false);
                    } else {
                        $.each(aInput, function(i, v){
                            v.siblings('.png').removeClass('ok').addClass('error');
                        });
                        self.fShowMsg($notice, sMsg);
                    }
                }

                // 登录
                ui.$login.on('click', '.submitBtn', function(){
                    if(ui.$login.data('submiting')){
                        return false;
                    }

                    var $account = ui.$login.find('.account'),
                        $password = ui.$login.find('.password'),
                        $identifyCode = ui.$login.find('.identifyCode'),
                        $notice = ui.$login.find('.notice'),
                        sAccount = $account.val(),
                        sPassword = $password.val(),
                        sIdentifyCode = $identifyCode.val();

                    self.fShowMsg($notice, '登录中...');
                    $account.siblings('.png').removeClass('error ok');
                    $password.siblings('.png').removeClass('error ok');
                    $identifyCode.siblings('.png').removeClass('error ok');

                    if('' == sAccount){ // 游戏账号不能为空
                        fShowOkOrError(false, $account, $notice, '请输入账号');
                        return false;
                    }
                    if('' == sPassword){ // 游戏账号不能为空
                        fShowOkOrError(false, $password, $notice, '请输入密码');
                        return false;
                    }

                    if(self.bNeedIdentifyCode && ('' == sIdentifyCode || 4 > sIdentifyCode.length)){
                        fShowOkOrError(false, $identifyCode, $notice, '验证码错误');
                        return false;
                    }

                    ui.$login.data('submiting', true); // 添加标示，正在提交
                    $.ajax({
                        url: self.oAjaxUrl.loginUrl,
                        data: { userid: sAccount, password: sPassword, captcha: sIdentifyCode },
                        type: 'POST',
                        dataType: 'json',
                        success: function(data){
                            ui.$login.data('submiting', false);
                            switch(data.code){
                                case 0:     // 登录成功
                                    data.data.userinfo.head_small = data.data.userinfo.head_small || ( '1' == data.data.userinfo.sex ) ? STATICS_PATH + 'images/avatar_1_1.png' : STATICS_PATH + 'images/avatar_1_2.png';
                                    self.fUserLoginSuccess(data.data.userinfo);
                                    // self.fShowMsg($notice, '登录成功');
                                    // setTimeout(function(){
                                    // }, 1000);
                                    break;
                                case 100101:    //  验证码输入错误！
                                    fShowOkOrError(true, [$password, $account], $notice);
                                    fShowOkOrError(false, $identifyCode, $notice, data.message);
                                    break;
                                case 100102:    // 帐号或密码不能为空！
                                case 100103:    // 用户名或密码错误！
                                    fShowOkOrError(false, [$account, $password], $notice, data.message);
                                    $password.val('');
                                    if(3 <= data.data.ecount && !self.bNeedIdentifyCode){
                                        ui.$login.removeClass('again');
                                        self.bNeedIdentifyCode = true;
                                    }
                                    break;
                                case 100104:    // 获取登陆用户信息错误！
                                    self.fShowMsg($notice, data.message);
                                    break;
                                case 1001:
                                    self.fShowMsg($notice, '登录失败，请稍后再试！');
                                    break;
                            }

                            return false;
                        }
                    });

                    return false;
                });
                // 退出登录
                ui.$login.on('click', '.logoffBtn', function(){
                    if(ui.$login.data('submiting')){
                        return false;
                    }

                    ui.$login.data('submiting', true);
                    $.ajax({
                        url: self.oAjaxUrl.logoffUrl,
                        type: 'GET',
                        dataType: 'json',
                        success: function(data){
                            ui.$login.data('submiting', false);
                            if(0 == data.code){
                                self.fUserLogoffSuccess();
                            }
                        }
                    });

                    return false;
                });
                // 切换验证码
                ui.$login.on('click', '.identifyImg', function(){
                    self.fReflashCaptcha(ui.$login.find(".captcha"), true);
                });

                // 右下角的手动刷新
                // ui.$immediate.on('click', '.refresh', function(){
                //     self.nReflashTimeout || clearTimeout(self.nReflashTimeout);
                //     self.fReflashTimeline();
                // });
            },
            fShowMsg: function($notice, sMsg){   // 显示或隐藏提示信息，登录、充值界面用
                if(sMsg){
                    $notice.html('<span>' + sMsg + '</span>').css('visibility', 'visible');
                } else {
                    $notice.html('').css('visibility', 'hidden');
                }
            },
            fUserLoginSuccess: function(oUserInfo){  // 用户登录成功
                var self = this,
                    sHtml = ui.$t_logined.tmpl(oUserInfo),
                    sHeadHtml = ui.$t_headerlogined.tmpl({nickname: oUserInfo.nickname});

                ui.$login.removeClass('again').html(sHtml);
                self.bNeedIdentifyCode = false;
                ui.$userLoginTitle.html('个人信息');

                if( 1 == oUserInfo.isvip ){
                    ui.$login.find(".blueDiamond").removeClass('hide')
                }

                self.fReplaceHead(sHeadHtml);
            },
            fUserLogoffSuccess: function(){  // 用户退出成功
                var self = this,
                    sHtml = ui.$t_loginForm.tmpl({ nIndex : ++self.nIdentifyImgIndex }),
                    sHeadHtml = ui.$t_headerlogin.tmpl();

                ui.$login.addClass('again').html(sHtml);
                self.bNeedIdentifyCode = false;
                ui.$userLoginTitle.html('用户登录');
                self.fShowMsg(ui.$login.find('.notice'), false);

                self.fReplaceHead(sHeadHtml);
            },
            fReplaceHead: function(sHtml){
                var self = this;

                ui.$loginAreaUl.find(".toReplace").remove();
                ui.$loginAreaUl.prepend(sHtml);
            },
            fReflashCaptcha: function($obj, bNotice){    // 刷新验证码
                if($obj.data('loading')){
                    return false;
                }

                var self = this,
                    sSrc = $obj.attr('src'),
                    aSrcSplit = sSrc.split('_t='),
                    $notice = ui.$login.find('.notice'),
                    $identifyCode = ui.$login.find('.identifyCode');

                bNotice && self.fShowMsg($notice, '验证码获取中...');

                self.nIdentifyImgIndex = aSrcSplit[1] = +aSrcSplit[1] + 1;
                sSrc = aSrcSplit.join('_t=');
                $obj.data('loading', true);

                var oBgImg = new Image();
                oBgImg.onload = function() {    // 验证码获取成功，替换
                    oBgImg = $(oBgImg);
                    $('body').append(oBgImg);
                    $obj.replaceWith(oBgImg);
                    oBgImg.addClass('captcha').width(100).height(45);
                    $identifyCode.focus();  // 输入框获得焦点
                    bNotice && self.fShowMsg($notice, ''); // 去除提示信息
                };
                oBgImg.error = function(){  // 验证码获取失败
                    self.fShowMsg($notice, '验证码获取失败，请点击重试');
                    $obj.data('loading', false);
                    oBgImg.error = function(){}
                };
                oBgImg.src = sSrc;
            },

            fReflashTimeline: function(){   // 刷新右下角的内容
                var self = this,
                    $loading = ui.$immediateContent.closest('.immediate').find('.loading'),
                    nLasttime = self.oLastReflash.date;

                if(ui.$immediateContent.data('reflashing')){
                    return false;
                }

                ui.$immediateContent.data('reflashing', true);
                $loading.show();
                $.ajax({
                    url: self.oAjaxUrl.reflashUrl,
                    type: 'POST',
                    data: { lasttime: nLasttime },
                    dataType: 'json',
                    success: function(data){
                        ui.$immediateContent.data('reflashing', false);
                        $loading.hide();
                        if(0 == data.code){
                            var sHtml = '',
                                data = data.data;
                            // 更新数据
                            sHtml = ui.$t_immediate.tmpl(data);
                            if(sHtml){
                                ui.$immediateContent.prepend(sHtml);
                                ui.$immediateContent.trigger('mouseenter').trigger('mouseleave');
                            }
                            // 更新self.oLastReflash
                            self.oLastReflash.id = ui.$immediateContent.find('li.rowOne').eq(0).data('id');
                            self.oLastReflash.date = ui.$immediateContent.find('li.rowOne > p.time').eq(0).data('date');
                            // 更新已有的数据的时间提示
                            self.fReflashTime();
                        }
                    },
                    error: function(){
                        ui.$immediateContent.data('reflashing', false);
                        $loading.hide();
                    }
                });
            },
            fReflashTime: function(){   // 刷新右下角内容的时间显示
                var self = this,
                    $timeSets = ui.$immediateContent.find('.time'),
                    nNow = new Date().getTime(),
                    nOneMin = 60,
                    nOneHour = 3600,
                    nOneDay = 86400,
                    nOneWeek = 604800,
                    nOneMonth = 2419200,
                    nDate, nSubDate, nDivisionDate, sTimeHtml;

                $timeSets.each(function(){
                    var $this = $(this);

                    nDate = $this.data('date');
                    nSubDate = Math.floor((nNow / 1000) - nDate);

                    if( nSubDate < nOneMin ){
                        sTimeHtml = '刚刚';
                    } else if( nSubDate < nOneHour ){
                        sTimeHtml = Math.floor( nSubDate / nOneMin ) + '分钟前';
                    } else if( nSubDate < nOneDay ){
                        sTimeHtml = Math.floor( nSubDate / nOneHour ) + '小时前';
                    } else if( nSubDate < nOneWeek ){
                        sTimeHtml = Math.floor( nSubDate / nOneDay ) + '天前';
                    } else if( nSubDate < nOneMonth ){
                        sTimeHtml = Math.floor( nSubDate / nOneWeek ) + '周前';
                    } else {
                        sTimeHtml = '较早前';
                    }

                    $this.find('span').html(sTimeHtml);
                });
            },
            // 游戏分类的上下滑动
            fGameCategorySliding: function(){
                var ui = {},
                    nCount = 0,
                    nHeight = 47,
                    nNum = 6,
                    $this, nMarginTop;

                ui.$gameArea = $(".gameArea");
                ui.$tabPanel = $(".gameArea .tab_panel");
                ui.$lis = ui.$tabPanel.find('li');

                nCount = ui.$lis.length;

                if(6 < nCount){
                    ui.$gameArea.find('.scroll').removeClass('hide');
                }

                ui.$gameArea.on('click', '.scrollBtn', function(){
                    $this = $(this);
                    if(ui.$tabPanel.is(':animated')){
                        return false;
                    }
                    nMarginTop = parseInt(ui.$tabPanel.css('marginTop')) || 0;

                    if($this.hasClass('up')){
                        nMarginTop = nMarginTop + nHeight * nNum;
                    } else {
                        nMarginTop = nMarginTop - nHeight * nNum;
                    }

                    if(0 < nMarginTop || nCount < Math.abs(nMarginTop / nHeight)){
                        return false;
                    }

                    ui.$tabPanel.animate({ 'marginTop': nMarginTop }, 300);
                    return false;
                });
            }
        };
        page.init();
	});
});