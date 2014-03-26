yp.use('jquery.pagination',function(){
    yp.ready(function(){
        var ui = {
            $search: $('#search'),
            $time: $('#time'),
            $type: $('#typeNear'),
            $prop_tbody: $('#prop_tbody'),
            $div_page: $('#div_page'),
            $span_pageList: $('#span_pageList'),
            $wealthTmpl: $('#wealthTmpl'),
            $mainBd: $('.mainBd'),
            $datePicker: $('.datePicker'),
            $typeRecode: $('#typeRecode'),
            $nearTime: $('#nearTime'),
            $main: $('#main'),
            $Recode: $('#Recode')
        };
        var oPageWealth = {
            init: function() {
                this.view();
                this.bindEvent();
            },
            view: function() {
                this.fPagination();
                this.fDatePicker();
            },
            bindEvent: function() {
                var self = this;
                // 查询点击事件
                ui.$search.on('click',function(){
                    var $this = $(this);
                    if(!$this.data('ing')) {
                        $this.data('ing', true);
                        var $form=$this.closest('form');
                        var data=$form.serialize();
                        var url=$form.attr('action');
                        $.post(url,data,function(msg){
                            if(msg.code ==0){
                                self.fShowRecode(msg.data);
                            }else{
                                alert(msg.message)
                            }
                        },'json');
                        $this.data('ing', false);
                    }
                });
                //最近时间选择
                ui.$nearTime.on('change',function(){
                    var i=$(this).val();
                    var day2=self.fFormatDate(0);
                    var day1=self.fFormatDate(i);
                    ui.$datePicker.eq(0).val(day1);
                    ui.$datePicker.eq(-1).val(day2);
                })

            },
            fShowRecode: function(data){
                if(data){
                    var type=data.type;
                    var param={
                        count:data.count,
                        etime:data.etime,
                        stime:data.stime,
                        page:data.page,
                        pageSize:data.pageSize,
                        type:data.type
                    };
                    this.fChangeRecode(type,data.info);
                    this.fPagination(param);
                }else{
                    alert(data);
                }
            },
            fChangeRecode: function(type,info){
                var sHTML='';
                var sTbody='';
                if(typeof(info) !='object' || $.isEmptyObject(info)){
                    ui.$Recode.html('暂无记录');
                    return false;
                }
                if(type ==1){
                    var len=info.length;
                    for(var i=0;i<len;i++){
                        sTbody +=  ' <tr>'+
                            ' <td><p>'+(info[i].type==1? '银行到钱包':'钱包到银行')+'</p></td>'+
                            ' <td><p>'+info[i].sr+'</p></td>'+
                            ' <td><p>'+info[i].newbank+'</p></td>'+
                            ' <td><p>'+info[i].logtime+'</p></td>'+
                            ' </tr>';
                    }
                    sHTML='<div class="transfer">'+
                        '<table class="table">'+
                        '<thead>'+
                        '<tr>'+
                        '<th>划账方式<i class="line"></i></th>'+
                        ' <th>划账金额（银子）<i class="line"></i></th>'+
                        ' <th>银行余款<i class="line"></i></th>'+
                        ' <th>时间</th>'+
                        ' </tr>'+
                        ' </thead>'+
                        ' <tbody>'+sTbody+
                        ' </tbody>'+
                        ' </table>'+
                        ' </div>'
                }else if(type ==2){
                    var len=info.length;
                    for(var i=0;i<len;i++){
                        sTbody +=  ' <tr>'+
                            ' <td><p>'+(info[i].type==1? '银行到钱包':'钱包到银行')+'</p></td>'+
                            ' <td><p>'+info[i].sr+'</p></td>'+
                            ' <td><p>'+info[i].newbank+'</p></td>'+
                            ' <td><p>'+info[i].logtime+'</p></td>'+
                            ' </tr>';
                    }
                    sHTML='<div class="transfer">'+
                        '<table class="table">'+
                        '<thead>'+
                        '<tr>'+
                        '<th>划账方式<i class="line"></i></th>'+
                        ' <th>划账金额（银子）<i class="line"></i></th>'+
                        ' <th>银行余款<i class="line"></i></th>'+
                        ' <th>时间</th>'+
                        ' </tr>'+
                        ' </thead>'+
                        ' <tbody>'+sTbody+
                        ' </tbody>'+
                        ' </table>'+
                        ' </div>'

                }else if(type ==3){
                    sTbody +=  ' <tr>'+
                        ' <td><p>'+(info[i].type==1? '银行到钱包':'钱包到银行')+'</p></td>'+
                        ' <td><p>'+info[i].sr+'</p></td>'+
                        ' <td><p>'+info[i].newbank+'</p></td>'+
                        ' <td><p>'+info[i].logtime+'</p></td>'+
                        ' </tr>';

                    sHTML=' <div class="preferentialTit">'+
                        '<p><i class="dv"></i>充值优惠信息</p>'+
                        ' <ul>'+
                        '<li>会员折扣：成为会员可享受充值折扣价..............................................（ <a href="javascript:void(0);" class="orange">立刻购买会员</a> ）</li>'+
                        ' </ul>'+
                        ' </div>'+
                        '<div class="transfer">'+
                        '<table class="table">'+
                        '<thead>'+
                        '<tr>'+
                        '<th>订单号<i class="line"></i></th>'+
                        ' <th>充值渠道<i class="line"></i></th>'+
                        '<th>金额<i class="line"></i></th>'+
                        '<th>提交时间<i class="line"></i></th>'+
                        '<th>状态</th>'+
                        '</tr>'+
                        '</thead>'+
                        '<tbody>'+sTbody+
                        '</tbody>'+
                        '</table>'+
                        '</div>'
                }
                ui.$Recode.html(sHTML);
            },
            fFormatDate: function (num) {
                var day=new Date(parseInt(toDay));
                var year=day.getFullYear();
                var month=day.getMonth() - num +1;
                var date=day.getDate();
                if(month <=0){
                    month +=12;
                    year--;
                }
                if(month<10){
                    month="0"+month;
                }
                if(date<10){
                    date="0"+date;
                }
                var str = year + '-' + month + '-' + date;
                return str;
            },
            fDatePicker: function(){
                $('.ui-datepicker').remove();
                var self=this;
                ui.$datePicker.datepicker({
                    monthNames:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
                    monthNamesShort:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
                    dayNamesMin:["日","一","二","三","四","五","六"],
                    dateFormat: "yy-mm-dd",
                    maxDate: self.fFormatDate(0),
                    minDate: '2012-01-01',//最小日期php输出
                    changeMonth: true,
                    changeYear: true
                })
            },
            // 分页
            fPagination: function(opt){
                var self=this;

                var sTime=null;
                var eTime=null;
                var type=1;
                if(opt){
                    len=opt.count || 0;
                    pagesize=opt.pageSize;
                    page= opt.page-1;
                    sTime=opt.stime;
                    eTime=opt.etime;
                    type=opt.type;
                }
                if(len <= pagesize || len<1){
                    $('#div_page').empty();
                    return false;
                }
                var bIsFirst=true;
                $('#div_page').pagination(len,{
                    items_per_page:pagesize,  //一页显示多少个
                    prev_text:"上一页<i></i>",
                    next_text:"下一页<i></i>",
                    num_display_entries:6,
                    current_page:page,     //请改变输出当前显示页
                    num_edge_entries:1,
                    link_to:"/index.php?c=ucenter&a=richRecord",
                    callback: function(i){
                        if(bIsFirst){
                            bIsFirst=false;
                            return false;
                        }
                        var $this = $(this);
                        if(!$this.data('ing')) {
                            $this.data('ing', true);
                            var url='/index.php?c=ucenter&a=richRecord';
                            var param={
                                page:i+1,
                                stime:sTime,
                                etime:eTime,
                                type:type
                            };
                            $.post(url,param,function(msg){
                                if(msg.code == 0){
                                    self.fChangeRecode(msg.data.type,msg.data.info);
                                }else{
                                    alert(msg.message);
                                };
                                $this.data('ing', false);
                            },"json");
                        }else{
                            $this.data('ing', false);
                        }
                        return false;
                    }
                });
            }
        };
        oPageWealth.init();
    })
})
