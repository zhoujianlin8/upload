yp.use('popLogin',function(){
    yp.ready(function () {
        window.g_page = null;
        var modelid = 2;
        var ui = {
            $main:$('#main'),
            $toggle:$('[data-toggle=toggle]'),
            $tab:$('[data-toggle=tab]'),
            $tabC:$('.tabC'),
            $sideLeft:$('#sideLeft'),
            $organ:$('[data-toggle=organ]'),
            $load:$('[data-load]'),
            $closeFooter:$('#closeFooter'),
            $carousel:$('[data-toggle=carousel]'),
            $more:$('[data-more]'),
            $setScore:$('#setScore'),
            $unLoadIn:$('#unLoadIn'),
            $formSubmit:$('#formSubmit'),
            $loadOut:$('#loadOut'),
            $gameFooter:$('#gameFooter'),
            $submit:$('#submit'),
            $reviewList:$('#reviewList'),
            $content:$('#content'),
            $nickname:$('#nickname'),
            $toReplace:$('.loginArea .toReplace')
        };
        var oGamePage = {
            init:function () {
                this.view();
                this.bindEvent();
            },
            view:function () {
                this.fMore();
                this.fIsLoadIn(bIsLoadIn);
                this.fSideLeft();
                this.fCarousel();
                this.fOrgan();
                this.fLoad();
            },
            bindEvent:function () {
                var self = this;
                //胜率显示提示
                $('body').on('mouseleave mouseenter', '[data-toggle=toggle]', function () {
                    var target = $(this).attr('data-target');
                    var $target = $(target);
                    $target.toggleClass('hide');
                });

//关闭gameFooter 条
                $('body').on('click', '#closeFooter', function () {
                    ui.$gameFooter.hide();
                });
//点击登录
                /*  ui.$loadIn.on('click',function(){
                 $('#login').trigger('click');
                 return false
                 });*/
//tab 导航条
                ui.$tab.on('click', 'li', function () {
                    var $this = $(this);
                    var i = $this.index();
                    $this.find('>a').addClass('cur');
                    $this.siblings().find('>a').removeClass('cur');
                    ui.$tabC.eq(i).removeClass('hide');
                })
                $('body').on('change', 'input[type=radio]', function () {
                    var midStar = $(this).closest('#setScore').find('i');
                    var value = $(this).val();
                    if (value == 1) {
                        midStar.replaceWith('<i class="i png midStar10"></i>');
                    } else if (value == 2) {
                        midStar.replaceWith('<i class="i png midStar20"></i>');
                    } else if (value == 3) {
                        midStar.replaceWith('<i class="i png midStar30"></i>');
                    } else if (value == 4) {
                        midStar.replaceWith('<i class="i png midStar40"></i>');
                    } else if (value == 5) {
                        midStar.replaceWith('<i class="i png midStar50"></i>');
                    }
                })
//点击退出
                /* ui.$loadOut.on('click',function(){
                 var url='/index.php/ucenter/logout';
                 $.get(url,function(msg){
                 if(msg.code ==0){

                 self.fIsLoadIn(bIsLoadIn);
                 }else{
                 alert(msg.message);
                 }
                 },'json')
                 })*/
//点击发表
                ui.$submit.on('click', function () {
                    if (bIsLoadIn) {             //如果已经登入
                        var $this = $(this);
                        if (!$this.data('ing')) {
                            $this.data('ing', true);
                            var url = '?c=comment&a=add';
                            var valContent = $this.closest('form').find('[name=content]').val();
                            if (valContent == "") {
                                alert('写点啥吧');
                                $this.data('ing', false);
                                return false;
                            }
                            var param = {
                                modelid:modelid,
                                subjectid:subjectid,
                                content:valContent,
                                score:$('[type=radio]:checked').val() || 0
                            }
                            $.post(url, param, function (msg) {
                                if (msg.code == 0) {
                                    self.fShowComment(msg.data.comment);
                                } else {
                                    alert(msg.message);
                                }
                                $this.data('ing', false);
                            }, "json")
                        }
                    } else {

                    }

                })
            },
            fShowComment:function (data) {
                if (data) {
                    var sHTML = '<li class="review">' +
                        '<div class="hd clearFix">' +
                        '<div class="fl">' +
                        '<img src="/statics/images/gameUser2.jpg" alt="">' +
                        ' </div>' +
                        '<div class="fl ml5">' +
                        ' <p class="nameTime"><strong>' + data.nickname + '</strong><span>' + data.addtime + '</span></p>' +
                        '<i class="i ' + this.fScore(data.score) + '"></i>' +
                        ' </div>' +
                        ' </div>' +
                        '<div class="bd">' +
                        '<p>' + data.content + '</p>' +
                        '</div>' +
                        '</li>';
                    ui.$reviewList.prepend(sHTML);
                    ui.$content.val('');
                    this.fSideLeft();
                } else {
                    console.log('data comment wrong')
                }

            },
            fScore:function (i) {
                var str = 'smallStar';
                if (i == 0) {
                    str += '00';
                } else if (i == 1) {
                    str += '10';
                } else if (i == 2) {
                    str += '20';
                } else if (i == 3) {
                    str += '30';
                } else if (i == 4) {
                    str += '40';
                } else if (i == 5) {
                    str += '50';
                } else {
                    str += '00';
                }
                return str;
            },
            fMore:function () {
                var self = this;
                ui.$more.each(function () {
                    var $this = $(this);
                    var sType = $this.attr('data-more');
                    var target = $this.attr('data-target');
                    var height = $(target).height();
                    var maxHeight = parseInt($(target).attr('data-maxHegiht')) || 200;
                    if (height > maxHeight) {
                        $(target).height(maxHeight);
                        $this.removeClass('hide').show();
                    } else {
                        $this.addClass('hide').hide();
                    }
                });
                $('body').on('click', '[data-more]', function () {
                    var $this = $(this);
                    var sType = $this.attr('data-more');
                    var target = $this.attr('data-target');
                    $(target).height('auto');
                    $this.hide();
                    self.fSideLeft();
                })
            },
            fCarousel:function () {
                var $prev = ui.$carousel.find('.prev');
                var $next = ui.$carousel.find('.next');
                var $numList = ui.$carousel.find('.numList');
                var $picList = ui.$carousel.find('.picList');
                var len = $picList.find('li').length;
                var picWidth = $picList.width();
                var timer = null;
                timer = setInterval(function () {
                    $next.trigger('click');
                }, 6000);
                ui.$carousel.on('mouseenter', function () {
                    clearInterval(timer);
                });
                ui.$carousel.on('mouseleave', function () {
                    timer = setInterval(function () {
                        $next.trigger('click');
                    }, 6000);
                });
                $next.on('click', function () {
                    var i = $numList.find('.cur').index();
                    if (i == len - 1) {
                        fAnimate(0)
                    } else {
                        fAnimate(i + 1)
                    }
                    return false;
                });
                $prev.on('click', function () {
                    var i = $numList.find('.cur').index();
                    if (i == 0) {
                        fAnimate(len - 1)
                    } else {
                        fAnimate(i - 1)
                    }
                    return false;
                });
                $numList.on('click', 'a:not(.cur)', function () {
                    var i = $(this).index();
                    fAnimate(i);
                });
                function fAnimate(i) {
                    if ($picList.find('.cur').is(":animated")) {
                        return false;     //如果正在进行动画点击操作无效
                    }
                    $numList.find('a').removeClass('cur').eq(i).addClass('cur');
                    $picList.find('.cur').animate({
                        left:-picWidth
                    }, 200, function () {
                        $(this).removeClass('cur');
                        $(this).css('left', picWidth);
                    });
                    $picList.find('li').eq(i).animate({
                        left:0
                    }, 200, function () {
                        $(this).addClass('cur');
                    });
                }
            },
            fSideLeft:function () {
                ui.$sideLeft.find('>.bd').css('height', 'auto');
                var mainHeight = ui.$main.height();
                var sideLeftHeight = ui.$sideLeft.height();
                var sideLeftHdHeight = ui.$sideLeft.find('>.hd').height();
                var height = Math.max(sideLeftHeight, mainHeight);
                ui.$sideLeft.find('>.bd').height(height - sideLeftHdHeight);
            },
            fOrgan:function () {
                var self = this;
                //ui.$organ.closest('.cur').find('>ul').show();
                this.fSideLeft();
                ui.$organ.on('click', function () {
                    var $ul = $(this).next('ul');
                    $(this).closest('li').toggleClass('cur')
                        .siblings('.cur').find('>ul').slideUp()
                        .end().removeClass('cur');
                    $ul.slideToggle(function () {
                        self.fSideLeft();
                    });
                    self.fSideLeft();
                })
            },
            fLoad:function () {
                ui.$load.on('click', function () {
                    ui.$load.removeClass('open');
                    $(this).addClass('open');
                    var url = $(this).attr('data-load') || $(this).find('>a').eq(0).attr('href');
                    location.href = url;
                    return false;
                })
            },
            fIsLoadIn:function (flag) {
                if (flag) {
                    ui.$unLoadIn.hide().addClass('hide');
                    ui.$formSubmit.show().removeClass('hide');
                    ui.$gameFooter.show().removeClass('hide');
                } else {
                    ui.$unLoadIn.show().removeClass('hide');
                    ui.$formSubmit.hide().addClass('hide');
                    ui.$gameFooter.hide().addClass('hide');
                }
                this.fSideLeft();
            },
            fHasLoadIn:function (nickname) {
                ui.$nickname.text(nickname);
                ui.$toReplace.slice(1).remove();
                ui.$toReplace.eq(0).replaceWith(' <li class="toReplace">欢迎您，<a href="/index.php?c=ucenter"><span class="orange">' + nickname + '</span></a><a href="/index.php?c=ucenter&a=logout" class="ml5">[退出]</a><small>|</small></li>')
                this.fIsLoadIn(true);
                bIsLoadIn = true;
            }

        };
        oGamePage.init();
        window.g_page = {oGamePage:oGamePage, ui:ui};
        window.fLoginSuccess = function (msg) {
            var oGamePage = window.g_page.oGamePage;
            if (msg.data) {
                if (msg.data.userinfo) {
                    oGamePage.fHasLoadIn(msg.data.userinfo.nickname)
                } else {
                }
            } else {
                alert('data数据有误')
            }
        }
    })
})


