yp.use('jquery.tmpl.min, jquery.form',function(){
    yp.ready(function(){
        var ui = {
            $prop_tbody: $('#prop_tbody'),
            $div_page: $('#div_page'),
            $span_pageList: $('#span_pageList'),
            $give: $('[data-give]'),
            $use: $('[data-use]'),
            $useModal: $('#useModal'),
            $giveModal: $('#giveModal'),
            $tmpl: $('#tmpl'),
            $closeModal: $('[data-close=modal]')
        };

        var oPage = {
            init: function() {
                this.view();
                this.bindEvent();
            },
            view: function() {
                // 分页显示
                this.fPagingView();
                this.fShowCurPage(this.oPageInfo.curPage);
            },
            bindEvent: function() {
                var self = this;
                // 分页事件
                ui.$div_page.on('click', 'a', function() {
                    var $this = $(this),
                        action = $this.data('action'),
                        page = $this.data('page');
                    if(action == 'prev') {//上下页按钮
                        if(self.oPageInfo.curPage > 1) {
                            self.fShowCurPage(self.oPageInfo.curPage - 1);
                        }
                    } else if(action == 'next') {
                        if(self.oPageInfo.curPage < self.oPageInfo.pageCount) {
                            self.fShowCurPage(self.oPageInfo.curPage + 1);
                        }
                    } else {//直接页码
                        self.fShowCurPage(parseInt($this.data('page')));
                    }
                });
                //点击关闭弹出层
                $('body').on('click','[data-close=modal]',function(){
                    $(this).closest('[data-content=modal]').remove();
                })
                //赠送道具
                $('body').on('click','[data-give]',function(){
                    var $this=$(this);
                    var lessCount=$this.closest('tr').find('.num').text();
                    var aCount= [];
                    for(var i=0;i<parseInt(lessCount);i++){
                        aCount[i]=i;
                    }
                    var param={
                        name: $this.closest('tr').find('.name').text(),
                        lessCount: lessCount,
                        pid: $this.attr('data-give'),
                        Count: aCount,
                    }
                    ui.$tmpl.empty();
                    ui.$giveModal.tmpl(param).appendTo(ui.$tmpl);
                })
                //使用道具
                $('body').on('click','[data-use]',function(){
                    var $this=$(this);
                    var url='?c=ucenter&a=getGames';
                    $.post(url,function(msg){
                        if(msg.code ==0){
                            var lessCount=$this.closest('tr').find('.num').text();
                            var aCount= [];
                            for(var i=0;i<parseInt(lessCount);i++){
                                aCount[i]=i;
                            }
                            var param={
                                name: $this.closest('tr').find('.name').text(),
                                lessCount: lessCount,
                                pid: $this.attr('data-use'),
                                Count: aCount,
                                Games: msg.data.games || []
                            }
                            ui.$tmpl.empty();
                            ui.$useModal.tmpl(param).appendTo(ui.$tmpl);
                        }else{
                            alert(msg.message)
                        }
                    },'json')

                });
                //输入验证
                $('body').on('blur','[data-valid]',function(){
                    self.fValidInput($(this));
                })
                //modal 点击提交表单
                $('body').on('click','[data-submit]',function(){
                    var $this = $(this);
                    var $form=$this.closest('form');
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        if($this.attr('data-submit')== 'give'){
                            if(!self.fFormValid($form)){
                                $this.data('ing', false);
                                return false;
                            }

                        }
                        $form .ajaxSubmit({
                            success:function(msg){
                                if(msg.code == 0){
                                    $this.closest('data-content=modal').remove();
                                    var target=$this.attr('data-target');
                                    var $target=$('#game'+target);
                                    var lessCount=$target.find('.num').text();
                                    var nCount=$form.find('.num').val();
                                    $target.find('.num').text(lessCount-nCount);
                                }else{
                                    alert(msg.message)
                                }
                                $this.data('ing', false);
                            }
                        })

                    }

                })
            },
            fValidSuccess: function($obj) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo real dv"><i class="ico_16 i34"></i></span>');
            },
            fValidError: function($obj, content) {
                $obj.siblings('.tipInfo').replaceWith('<span class="tipInfo error dv"><i class="ico_16 i33"></i>'+content+'</span>');
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
                var reg=/^[0-9]$/i;
                var error=["",""];
                var sType=$this.attr('data-valid')
                if(sType=='userId'){
                    fValid();
                }else if(sType == 'confirm'){
                    fValid();
                    var target=$this.attr('data-target');
                    var $target=$(target);
                    if($this.val()!==$target.val()){
                        self.fValidError($this,'');
                    }
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

            },
            // 分页
            fPagingView: function() {
                ui.$prop_tbody_tr = ui.$prop_tbody.find('tr');
                var size = 8,  //每页显示数量
                    curPage = 1,    //当前页码
                    length = ui.$prop_tbody_tr.length,
                    pageCount = Math.ceil(length / size);
                var html = '';
                for(var i=1;i<=pageCount;i++) {
                    if(i == 1) {
                        html += '<a href="###" class="num cur" data-page="'+i+'">'+i+'</a>';
                    } else {
                        html += '<a href="###" class="num" data-page="'+i+'">'+i+'</a>';
                    }
                }
                ui.$span_pageList.html(html);

                this.oPageInfo = {
                    size: size,
                    curPage: curPage,
                    pageCount: pageCount
                };
            },
            fShowCurPage: function(nPage) {
                var startIndex = (nPage - 1) * this.oPageInfo.size,
                    endIndex = startIndex + this.oPageInfo.size,
                    maxIndex = this.oPageInfo.pageCount * this.oPageInfo.size;
                if(endIndex > maxIndex) {
                    endIndex = maxIndex;
                }

                ui.$prop_tbody_tr.hide().slice(startIndex, endIndex).show();
                ui.$span_pageList.find('a[data-page='+nPage+']').addClass('cur')
                    .siblings().removeClass('cur');
                this.oPageInfo.curPage = nPage;
            }
        };

        oPage.init();
    })
});