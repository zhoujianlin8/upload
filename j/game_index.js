yp.use('gameListCollapse, gameBannerCollapse', function () {
    yp.ready(function () {
        var ui = {
            $toggle:$('[data-toggle=toggle]'),
            $tab:$('[data-toggle=tab]'),
            $tabC:$('[data-content=tab]'),
            $change:$('[data-toggle=change]'),
            $changeC:$('[data-content=change]'),
            $scrolling:$('[data-toggle=scrolling]'),
            $carousel:$('[data-toggle=carousel]'),
            $scroll:$('[ data-toggle=scroll]'),
            $startRank:$('#startRank'),
            $loading:$('.loading')
        };
        var oGamePage = {
            init:function () {
                this.view();
                this.bindEvent();
            },
            view:function () {
                ui.$tabC.gameListCollapse();
                ui.$carousel.gameBannerCollapse();
                this.fScroll();
            },
            bindEvent:function () {
                var self = this;
//tab 导航条 游戏类切换
                ui.$tab.on('click', 'li', function () {
                    var $this = $(this);
                    var i = $this.index();
                    $this.addClass('cur');
                    $this.siblings().removeClass('cur');
                    ui.$tabC.addClass('hide').eq(i).removeClass('hide');
                });
//change 本周最高评分最高
                ui.$change.on('click', 'li', function () {
                    var $this = $(this);
                    var i = $this.index();
                    $this.addClass('cur');
                    $this.siblings().removeClass('cur');
                    ui.$changeC.addClass('hide').eq(i).removeClass('hide');
                    if (i == 0) {
                        $this.closest('ul').removeClass('change');
                    } else {
                        $this.closest('ul').addClass('change');
                    }
                })
                ui.$changeC.on('mouseenter', 'li', function () {
                    $(this).addClass('cur').siblings('li').removeClass('cur');
                })
            },
            //明星榜
            fScroll:function () {
                var self = this;
                var $ul = ui.$scroll.find('ul');
                var len = $ul.find('>li').length;
                var liWidth = $ul.find('>li').outerWidth(true);
                var $next = ui.$scroll.find('.next');
                var $prev = ui.$scroll.find('.prev');
                var dataLi = $ul.find('>li').clone();
                $ul.append(dataLi);
                var currentWidth = ui.$scroll.find('.gallery').width();
                if (currentWidth >= liWidth * len) {     //当显示区域的宽度大于所有li宽度的总和
                    $ul.css('left', -(liWidth * len - currentWidth) / 2);
                    $next.addClass('hide');
                    $prev.addClass('hide');
                    return false
                }
                var i = 0;
                var ulLeft = 0;
                ui.$scroll.on('click', '.prev:not(.disabled)', function () {
                    $(this).addClass('disabled');
                    if (i == 0) {
                        i = len - 1;
                        $ul.css('left', ulLeft - liWidth * len);
                        ulLeft = -liWidth * (len - 1);
                    } else {
                        ulLeft = ulLeft + liWidth;
                        i--;
                    }
                    fAnimate(i);
                });
                ui.$scroll.on('click', '.next:not(.disabled)', function () {
                    $(this).addClass('disabled');
                    if (i == len) {
                        $ul.css('left', 0);
                        ulLeft = -liWidth;
                        i = 1;
                    } else {
                        i++;
                        ulLeft = ulLeft - liWidth;
                    }
                    fAnimate(i);
                });
                $ul.on('click', 'li', function () {
                    fGetRank($(this));
                });
                function fGetRank($this){
                    var n = $this.index();
                    faddCur(n);
//                if(i != len){
//                    i=n%len;
//                }
                    if (!$this.data('ing')) {
                        $this.data('ing', true);
                        var url = '?c=game&a=rank';
                        var param = {
                            gid:$this.attr("data-id")
                        }
                        ui.$loading.show();
                        $.post(url, param, function (msg) {
                            if (msg.code == 0) {
                                self.fStartRank(msg.data);
                            } else {
                                alert(msg.message);
                            }
                            ui.$loading.hide();
                            $this.data('ing', false);
                        }, "json")
                    }
                };
                function fAnimate(n) {
                   // $ul.find('>li').eq(n).trigger('click');
                    fGetRank($ul.find('>li').eq(n));
                    faddCur(n);
                    $ul.animate({
                        left:ulLeft
                    }, function () {
                        ui.$scroll.find('.next, .prev').removeClass('disabled');
                    })
                }

                function faddCur(n) {
                    if (n > len) {
                        $ul.find('>li').removeClass('cur').eq(n).addClass('cur').end().eq(n - len).addClass('cur');
                    } else {
                        $ul.find('>li').removeClass('cur').eq(n).addClass('cur').end().eq(n + len).addClass('cur');
                    }
                }
            },
            fStartRank:function (data) {
                var self = this;
                if (data) {
                    var rank = data.rank;
                    var liHTML = '';
                    if (rank) {
                        var len = rank.length;
                        for (var i = 0; i < len; i++) {
                            liHTML += self.fNum(i) + '<div class="img">' +
                                '<img src="/statics/images/avatar_1_1.png">' +
                                '</div>' +
                                '<p class="name">' + rank[i].nickname + '</p>' +
                                '<p>' + rank[i].rankname + '</p>' +
                                '</li>';
                            self.fGetAvatar(rank[i].numid, i);

                        }
                    } else {

                    }
                    var sHTML = '<div class="gamePeopleTit png">当前游戏人数：<span>' + data.ucount + '</span></div> <ul class="clearFix">' + liHTML + '</ul>';
                    ui.$startRank.html(sHTML);
                } else {
                    console.log('data  wrong')
                }
            },
            fNum:function (i) {
                var str = '<li class="">';
                if (i == 0) {
                    str = '<li class="first"><i class="crown png"></i>';
                } else if (i == 1) {
                    str = '<li class="second"><i class="crown png"></i>';
                } else if (i == 2) {
                    str = '<li class="third"><i class="crown png"></i>';
                }
                return str;
            },
            fGetAvatar: function(data,i){
                $.post('index.php?c=index&a=getAvatar',{numid:data}, function(msg){
                    if(msg.code == 0){
                        if(msg.data){
                            if(msg.data){
                                var str='';
                                if(msg.data.avatar){
                                    str = msg.data.avatar;
                                }else{
                                    if(msg.data.sex == 0){
                                        str = 'statics/images/avatar_1_2.png'; //女
                                    }else{
                                        str = '/statics/images/avatar_1_1.png'; //男
                                    }
                                }
                                ui.$startRank.find('.img img').eq(i).attr('src',str);
                            }
                        }

                    }else{

                    }
                })
            }
        };
        oGamePage.init();
    })
})

