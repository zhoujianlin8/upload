yp.use('formValid, jquery.form',function(){
    yp.ready(function(){
        var ui = {
            $mask: $('#mask'),
            $txt_valids: $('[data-valid]'),
            $btn_auth_realname: $('#btn_auth_realname'),
            $dialog_realname: $('#dialog_realname'),
            $btn_dialogRealname_close: $('#btn_dialogRealname_close'),
            $btn_dialogRealname_submit: $('#btn_dialogRealname_submit'),
            $dialog_safe: $('#dialog_safe'),
            $btn_dialogSafe_close: $('#btn_dialogSafe_close'),
            $btn_dialogSafe_submit: $('#btn_dialogSafe_submit'),
            $txt_say: $('#txt_say'),
            $btn_changeFriend: $('#btn_changeFriend'),
            $ul_friend: $('#ul_friend'),
            $dialog_friend: $('#dialog_friend'),
            $btn_dialogFriend_close: $('#btn_dialogFriend_close'),
            $btn_dialogFriend_submit: $('#btn_dialogFriend_submit'),
            $btns_activity: $('#btns_activity'),
            $div_activity: $('#div_activity'),
            $barWidth: $('#barWidth')
        };

        var oPageMain = {
            init: function() {
                this.view();
                this.bindEvent();
            },
            view: function() {
                this.fGetMyActive()
                if(!g_realname) {
                    this.fDialogRealnameShowHide(true);
                }else{
                    if(!g_safeSetting) {
                        this.fDialogSafeShowHide(true);
                    }
                }
                //资料完成度
                var barWidth=ui.$barWidth.width();
                ui.$barWidth.width(parseInt(barWidth)-14);
                // 会员特权
                if(g_isMember) {
                    ui.$row_privilege = $('#row_privilege');
                    $('#row_noPrivilege').remove();
                } else {
                    ui.$row_privilege = $('#row_noPrivilege');
                    $('#row_privilege').remove();
                }
                ui.$row_privilege.show();
                this.fPrivilegeShowHide(true);
                ui.$div_privilege_text = $('#div_privilege_text');
                ui.$div_privilege_power = $('#div_privilege_power');

            },
            bindEvent: function() {
                var self = this;
                // 表单校验
                ui.$txt_valids.on('blur', function() {
                    fInputValid($(this));
                });
                // 实名认证按钮
                ui.$btn_auth_realname.on('click', function() {
                    self.fDialogRealnameShowHide(true);

                    return false;
                });
                // 实名认证关闭
                ui.$btn_dialogRealname_close.on('click', function() {
                    self.fDialogRealnameShowHide(false);
                    if(!g_safeSetting) {
                        self.fDialogSafeShowHide(true);
                    }
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
                // 完善安全设置关闭
                ui.$btn_dialogSafe_close.on('click', function() {
                    self.fDialogSafeShowHide(false);
                    g_safeSetting=true;
                });
                // 完善安全设置-以后再说
                ui.$btn_dialogSafe_submit.on('click', function() {
                    if(ui.$txt_say.prop('checked')) {
                        // 异步发送不在提醒
                        var url='?c=ucenter&a=showTip';
                        $.post(url,function(msg){
                            if(msg.code==0){
                                ui.$btn_dialogSafe_close.trigger('click');
                            }else{
                                alert(msg.message)
                            }
                        },'json')
                    } else {
                        ui.$btn_dialogSafe_close.trigger('click');
                    }

                });
                // 会员-特权
                ui.$row_privilege.on('click', 'a', function() {
                    var id = this.id;
                    if(id == 'btn_privilege_show') {//查看特权
                        self.fPrivilegeShowHide(true);
                    } else if(id == 'btn_privilege_privileges') {//收起
                        self.fPrivilegeShowHide(false);
                    }
                });
                // 感兴趣的人,换一批
                ui.$btn_changeFriend.on('click', function() {
                    self.fChangeFriend();
                });
                // 显隐 +好友
                ui.$ul_friend.on('mouseenter', 'li', function() {
                    $(this).find('a').show();
                }).on('mouseleave', 'li', function() {
                        $(this).find('a').hide();
                    });
                // +好友弹层
                ui.$ul_friend.on('click', 'a', function() {
                    self.fDialogFriendShowHide(true);
                });
                // 关闭好友弹层
                ui.$btn_dialogFriend_close.on('click', function() {
                    self.fDialogFriendShowHide(false);
                });
                // 发送好友请求
                ui.$btn_dialogFriend_submit.on('click', function() {
                    // 发送异步请求
                    self.fDialogFriendShowHide(false);
                });
                // 动态翻页 上一页下一页
                ui.$btns_activity.on('click', 'a:not(.disabled)', function() {
                    var i= $(this).attr('data-page');
                    self.fGetMyActive(i);
                });
            },
            // 表单校验
            fFormValid: function($form) {
                var self = this;
                var flag = true;
                $form.find('[data-valid]').trigger('blur');
                if($form.find('.error').not('.hide').length){
                    flag=false;
                }
                return flag;
            },
            // 完善安全设置弹框-显隐
            fDialogSafeShowHide: function(flag) {
                if(flag) {
                    ui.$dialog_safe.show().prev().show();
                } else {
                    ui.$dialog_safe.hide().prev().hide();
                }
                g_safeSetting=true;
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
            // 查看特权
            fPrivilegeShowHide: function(flag) {
                if(flag) {
                    ui.$row_privilege.find('#div_privilege_text').hide();
                    ui.$row_privilege.find('#div_privilege_power').slideDown(800);
                } else {
                    ui.$row_privilege.find('#div_privilege_power').slideUp(800, function() {
                        ui.$row_privilege.find('#div_privilege_text').show();
                    });
                }
            },
            // 感兴趣的人,换一批
            fChangeFriend: function() {
                // 异步请求
                var dataSource = [
                    {'id':'1', 'name':'昵称', 'img':'../statics/i/avatar_1.jpg'},
                    {'id':'2', 'name':'昵称1', 'img':'../statics/i/avatar_1.jpg'},
                    {'id':'3', 'name':'昵称2', 'img':'../statics/i/avatar_1.jpg'},
                    {'id':'4', 'name':'昵称3', 'img':'../statics/i/avatar_1.jpg'}
                ];

                var lis = '';
                $.each(dataSource, function(i, n) {
                    lis += '<li><div class="img"><img src="' + n.img + '" /></div>';
                    lis	+= '<p>' + n.name + '</p><a href="javascript:void(0);" data-id=' + n.id + ' class="addFriend">+ 好友</a></li>';
                });
                ui.$ul_friend.html(lis);
            },
            // 好友弹框-显隐
            fDialogFriendShowHide: function(flag, info) {
                if(flag) {
                    ui.$mask.show();
                    ui.$dialog_friend.show();
                } else {
                    ui.$mask.hide();
                    ui.$dialog_friend.hide();
                }
            },
            // 我的动态设置
            fShowActivity: function(source) {

            },
            // 动态异步数据请求
            fAjaxActivity: function() {


            },
            //我的动态异步请求
            fGetMyActive: function(page){
                var self=this;
                var url='/?c=ucenter&a=getFeed';
                var nPage=page || 1;
                var param={
                    page:nPage
                }
                $.post(url,param,function(msg){
                    if(msg.code ==0){
                        self.fActiveShow(msg.data);
                    }else{
                        alert(msg.message)
                    }
                },"json")
            },
            fActiveShow: function(data){
                if(!$.isEmptyObject(data)){
                    var $next= ui.$btns_activity.find('[data-type=next]');
                    var $prev= ui.$btns_activity.find('[data-type=prev]')
                    if(data.np == 0){
                        $next.addClass('hide');
                    }else{
                        $next.removeClass('hide');
                        $next.attr('data-page',data.page+1);
                    }
                    if(data.page == 1){
                        $prev.addClass('hide');
                    }else{
                        $prev.removeClass('hide');
                        $prev.attr('data-page',data.page-1);
                    }
                    if(data.result){
                        var result=data.result;
                        var sHTML='';
                        var sResult='';
                        for(var i in result){
                            var len=result[i].length;
                            for(var j=0 ;j<len ; j++){
                                var sP='';
                                //1.任务，2.比赛，3.活动，4.推广奖励，5.道具商城， 6.游戏
                                if(result[i][j].type == 1){
                                    sP= '<p><span class="darkGreen">“你”</span>在'+result[i][j].tname+'中'+fHonour(result[i][j].honour)+',获得<span class="red">【'+result[i][j].reward+'】</span>的奖励!</p>';
                                }else if(result[i][j].type == 2){
                                    sP= '<p><span class="darkGreen">“你”</span>在'+result[i][j].tname+'活动中'+fHonour(result[i][j].honour)+',获得<span class="red">【'+result[i][j].reward+fNum(result[i][j].rnum)+'】</span>的奖励!</p>';
                                }else if(result[i][j].type == 3){
                                    sP= '<p><span class="darkGreen">“你”</span>'+result[i][j].tname+',成功'+fHonour(result[i][j].honour)+',获得<span class="red">【'+result[i][j].reward+fNum(result[i][j].rnum)+'】</span>的奖励!</p>';
                                }else if(result[i][j].type == 4){
                                    sP= '<p><span class="darkGreen">“你”</span>的'+result[i][j].tname+'中'+fHonour(result[i][j].honour)+',你获得<span class="red">【'+result[i][j].reward+fNum(result[i][j].rnum)+'】</span>的奖励!</p>';
                                }else if(result[i][j].type == 5){
                                    sP= '<p><span class="darkGreen">“你”</span>在'+result[i][j].tname+'中'+fHonour(result[i][j].honour)+',获得<span class="red">【'+result[i][j].reward+fNum(result[i][j].rnum)+'】</span>的奖励!</p>' ;
                                }else if(result[i][j].type == 6){
                                    sP= '<p><span class="darkGreen">“你”</span>在'+result[i][j].tname+'中'+fHonour(result[i][j].honour)+',获得<span class="red">【'+result[i][j].reward+fNum(result[i][j].rnum)+'】</span>的奖励!</p>' ;
                                }
                                sResult += '<div class="oneRow">'+sP+
                                    '<ul>'+
                                    '<li>'+
                                    '<a href="javascript:void(0);"><img src="'+result[i][j].img+'"></a>'+
                                    '</li>'+
                                    '</ul>'+
                                    '</div>';
                            }
                            sHTML+= '<div class="row ">'+
                                '<p class="time">'+i+'<i></i></p>'+sResult+
                                '</div>';
                        }

                        ui.$div_activity.html(sHTML);
                        function fHonour(data){
                            var str='';
                            if(!data){
                            }else{
                                str=',勇夺'+data;
                            }
                            return str;
                        }
                        function fNum(num){
                            var str='';
                            if(!num){
                            }else{
                                str='x'+num;
                            }
                            return str;
                        }
                        function fType(num){
                            var name='';
                            if(num == 1){
                                name='道具';
                            }else if(num ==2){
                                name='实物';
                            }else if(num ==3){
                                name='卡密';
                            }
                            return name;
                        }
                    }
                }else{
                    alert('数据有问题')
                }
            }
        };

        oPageMain.init();
    })
})