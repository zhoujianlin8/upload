yp.use('jquery.pagination, popLogin',function(){
    yp.ready(function(){
        var ui = {
            $public: $('#public'),
            $carousel: $('[data-toggle=carousel]'),
            $greade : $('[data-greade]'),
            $newComment: $('#newComment'),
            $fontSize: $('#fontSize'),
            $changeSizeContent: $('#changeSizeContent'),
            $commentContent: $('#commentContent'),
            $hasLogin: $('#hasLogin'),
            $unLogin: $('#unLogin'),
            $targetLogin: $('#targetLogin'),
            $nickname: $('#nickname'),
            $toReplace: $('.loginArea .toReplace')
        };
        var oMessagePage = {
            init: function() {
                this.view();
                this.bindEvent();
            },
            view: function() {
                this.fIsLogin(bIsLoadIn);
                this.fPagination();
                this.fCountFloat();
            },
            bindEvent: function() {
                var self=this;
                //改变字体大小
                ui.$fontSize.on('click',function(){
                    ui.$changeSizeContent.css('fontSize','14px');
                })
                //点击发表
                ui.$public.on('click',function(){
                    if(bIsLoadIn){             //如果已经登入
                        var $this = $(this);
                        if(!$this.data('ing')) {
                            $this.data('ing', true);
                            var url='?c=comment&a=add';
                            var valContent=$this.closest('form').find('[name=content]').val();
                            if(valContent==""){
                                alert('写点啥吧');
                                $this.data('ing', false);
                                return false;
                            }
                            var param={
                                modelid:modelid,
                                subjectid:subjectid,
                                content:valContent
                            }
                            $.post(url,param,function(msg){
                                if(msg.code == 0){
                                    self.fShowComment(msg.data.comment);
                                }else{
                                    alert(msg.message);
                                }
                                $this.data('ing', false);
                            },"json")
                        }
                    }else{
                        alert('请登录');
                    }

                })
                //点击登录
                ui.$targetLogin.on('click',function(){
                    $('#login').trigger('click');
                })
                //点击顶一个
                $('body').on('click','[data-greade]:not(.disabled)',function(){
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        var url='?c=comment&a=support';
                        var sId=$this.closest('[data-id]').attr('data-id');

                        var param={
                            id:sId
                        }
                        $.post(url,param,function(msg){
                            if(msg.code == 0){
                                var num= $this.find('.num').text();
                                $this.replaceWith('<span class="dv ">顶<span>[<span class="num">'+(parseInt(num)+1)+'</span>]</span></span>');
                            }else{
                                alert(msg.message)
                            }
                            $this.data('ing', false);
                        },"json")
                    }else{

                    }
                })

            },
            fShowComment: function(data){
                if(data){
                    var sHTML = '<div class="reviewOne" data-id='+data.id+'>'+
                        '<div class="reviewLeft fl">'+
                        '<img src="/statics/images/avatar_1.jpg">'+
                        '</div>'+
                        '<div class="reviewRight">'+
                        ' <p class="name"><span class="fw dv">'+data.nickname+'</span><i class="bank5 phone dv hide"></i><span class="hazel dv"></span></p>'+
                        '<p>'+data.content+'</p>'+
                        '<p class="clearFix">'+
                        '<span class="hazel fl">'+data.addtime+'</span>'+
                        '<span class="fr">'+
                        '<a href="###" class="hazel dv" data-greade="true">顶<span>[<span class="orange num">'+data.support+'</span>]</span></a>'+
                        '<a href="###" class="hazel ml5 dv hide">评论</a>'+
                        '</span></p></div></div>';
                    ui.$newComment.prepend(sHTML);
                    ui.$commentContent.val('');
                }else{
                    console.log('data comment wrong')
                }

            },
            fIsLogin: function(flag){
                if(flag){
                    ui.$unLogin.addClass('hide').hide();
                    ui.$hasLogin.removeClass('hide').show();
                }else{
                    ui.$unLogin.removeClass('hide').show();
                    ui.$hasLogin.addClass('hide').hide();
                }
            },
            fPagination: function(){
                var self=this;
//                var len={$commentcnt}; //分页
                var pagesize=5;  //请输入
                if(len<pagesize){
                    return false;
                }
                var bIsFirst=true;
                $('#div_page').pagination(len,{
                    items_per_page:pagesize,  //一页显示多少个
                    prev_text:"上一页<i></i>",
                    next_text:"下一页<i></i>",
                    num_display_entries:6,
                    current_page:0,     //请改变输出当前显示页
                    num_edge_entries:1,
                    link_to:"###",
                    callback: function(i){
                        if(bIsFirst){
                            bIsFirst=false;
                            return false;
                        }
                        var $this = $(this);
                        if(!$this.data('ing')) {
                            $this.data('ing', true);
                            var url='?c=comment&a=lists';
                            var param={
                                modelid:modelid,
                                subjectid:subjectid,
                                p:i+1,
                                pagesize:pagesize
                            };
                            $.post(url,param,function(msg){
                                if(msg.code==0){
                                    self.fChangeComment(msg.data.list)
                                }else{

                                };
                                $this.data('ing', false);
                            },"json");
                        }else{

                        }
                        return false;
                    }
                });
            },
            fChangeComment: function(data){
                if(data.length){
                    var len=data.length;
                    var sHTML='';
                    for(var i=0;i<len;i++){
                        sHTML+= '<div class="reviewOne" dataid='+data[i].id+'>'+
                            '<div class="reviewLeft fl">'+
                            '<img src="/statics/images/avatar_1.jpg">'+
                            '</div>'+
                            '<div class="reviewRight">'+
                            ' <p class="name"><span class="fw dv">'+data[i].nickname+'</span><i class="bank5 phone dv hide"></i><span class="hazel dv"></span></p>'+
                            '<p>'+data[i].content+'</p>'+
                            '<p class="clearFix">'+
                            '<span class="hazel fl">'+data[i].addtime+'</span>'+
                            '<span class="fr">'+
                            '<a href="###" class="hazel dv" data-greade="true">顶<span>[<span class="orange num">'+data[i].support+'</span>]</span></a>'+
                            '<a href="###" class="hazel ml5 dv hide">评论</a>'+
                            '</span></p></div></div>';
                    }
                    ui.$newComment.html(sHTML);
                }else{console.log('data.list wrong')}
            },
            fCountFloat:function(){
                setTimeout(function(){
                    var data={
                        newsid: subjectid
                    }
                    var url='?c=index&a=addHits';
                    $.post(url,data,function(){},'json')
                },3000)
            },
            fHasLoadIn: function(nickname){
                ui.$nickname.text(nickname);
                ui.$toReplace.slice(1).remove();
                ui.$toReplace.eq(0).replaceWith(' <li class="toReplace">欢迎您，<a href="/index.php?c=ucenter"><span class="orange">'+nickname+'</span></a><a href="/index.php?c=ucenter&a=logout" class="ml5">[退出]</a><small>|</small></li>')
                this.fIsLogin(true);
                bIsLoadIn=true;
            }
        };
        oMessagePage.init();
        window.g_page = {oMessagePage: oMessagePage, ui:ui};
        window.fLoginSuccess= function(msg){
            var oMessagePage =  window.g_page.oMessagePage;
            if(msg.data){
                if(msg.data.userinfo){
                    oMessagePage.fHasLoadIn(msg.data.userinfo.nickname)
                }else{}
            }else{
                alert('data数据有误')
            }
        }
    })
})

