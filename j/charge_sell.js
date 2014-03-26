yp.ready(function(){
    var ui = {
        $point_tbody: $('#point_tbody'),
        $div_page: $('#div_page'),
        $span_pageList: $('#span_pageList')
    };

    var oPage = {
        init: function() {
            this.view();
            this.bindEvent();
        },
        view: function() {
            // 地图坐标点
            this.fMapMaker();

            // 地图初始化
            this.fBaiduMapInit();

            // 分页显示
            this.fPageContentView();
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
            })
        },
        fBaiduMapInit: function() {
            this.fLoadjscssfile("http://api.map.baidu.com/res/11/bmap.css","css", this.fBaiduMap);
            this.fLoadjscssfile("http://api.map.baidu.com/getscript?v=1.1&ak=&services=true&t=20121127154638","js", this.fBaiduMap);
        },
        fBaiduMap: function(self) {
            if(!window.BMap) {
                return;
            }

            //标注点数组
            var markerArr = self.fMapMaker();

            //创建和初始化地图函数：
            function initMap(){
                createMap();//创建地图
                setMapEvent();//设置地图事件
                addMapControl();//向地图添加控件
                addMarker();//向地图中添加marker
            }

            //创建地图函数：
            function createMap(){
                var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
                var point = new BMap.Point(126.435798,41.945859);//定义一个中心点坐标
                map.centerAndZoom(point,13);//设定地图的中心点和坐标并将地图显示在地图容器中
                window.map = map;//将map变量存储在全局
            }

            //地图事件设置函数：
            function setMapEvent(){
                map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
                map.enableScrollWheelZoom();//启用地图滚轮放大缩小
                map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
                map.enableKeyboard();//启用键盘上下左右键移动地图
            }

            //地图控件添加函数：
            function addMapControl(){
                //向地图中添加缩放控件
                var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
                map.addControl(ctrl_nav);
                //向地图中添加比例尺控件
                var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
                map.addControl(ctrl_sca);
            }

            //创建marker
            function addMarker(){
                for(var i=0;i<markerArr.length;i++){
                    var json = markerArr[i];
                    var p0 = json.point.split("|")[0];
                    var p1 = json.point.split("|")[1];
                    var point = new BMap.Point(p0,p1);
                    var iconImg = createIcon(json.icon);
                    var marker = new BMap.Marker(point,{icon:iconImg});
                    var iw = createInfoWindow(i);
                    var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
                    marker.setLabel(label);
                    map.addOverlay(marker);
                    label.setStyle({
                        borderColor:"#808080",
                        color:"#333",
                        cursor:"pointer"
                    });

                    (function(){
                        var index = i;
                        var _iw = createInfoWindow(i);
                        var _marker = marker;
                        _marker.addEventListener("click",function(){
                            this.openInfoWindow(_iw);
                        });
                        _iw.addEventListener("open",function(){
                            _marker.getLabel().hide();
                        })
                        _iw.addEventListener("close",function(){
                            _marker.getLabel().show();
                        })
                        label.addEventListener("click",function(){
                            _marker.openInfoWindow(_iw);
                        })
                        if(!!json.isOpen){
                            label.hide();
                            _marker.openInfoWindow(_iw);
                        }
                    })()
                }
            }
            //创建InfoWindow
            function createInfoWindow(i){
                var json = markerArr[i];
                var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
                return iw;
            }
            //创建一个Icon
            function createIcon(json){
                var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
                return icon;
            }

            initMap();//创建和初始化地图
        },
        fLoadjscssfile: function(filename, filetype, fCallback) {
            var self = this;
            if(filetype == "js"){
                var fileref = document.createElement('script');
                fileref.setAttribute("type","text/javascript");
                fileref.setAttribute("src",filename);
            }else if(filetype == "css"){
                var fileref = document.createElement('link');
                fileref.setAttribute("rel","stylesheet");
                fileref.setAttribute("type","text/css");
                fileref.setAttribute("href",filename);
            }
            if(typeof fileref != "undefined"){
                fileref.onload = function() {
                    fCallback(self);
                };
                document.getElementsByTagName("head")[0].appendChild(fileref);
            }
        },
        fMapMaker: function() {
            //标注点数组
            this.aMapPoint = [
                {title:"A", name:'英图网络联盟贵宾店', address:"白山市浑江区", tel:'(0439)3273988', point:"126.433794|41.949249"},
                {title:"B", name:'银河网络', address:"白山市浑江区红旗街40-7", point:"126.43685|41.951141"},
                {title:"C", name:'天宇网吧', address:"白山市浑江区红旗街10-4 ", point:"126.446617|41.956009"},
                {title:"D", name:'避风塘网吧', address:"白山市浑江区白山路", point:"126.417378|41.938029"},
                {title:"E", name:'网恋de天空网吧泓朗店', address:"白山市浑江区泓郎街", point:"126.461244|41.958476"},
                {title:"F", name:'腾讯网络', address:"白山市浑江区", point:"126.4205|41.94318"},
                {title:"G", name:'避风塘绿色网络家园', address:"白山市浑江区卫国路22-4", point:"126.440886|41.945521"},
                {title:"H", name:'贵族网吧', address:"白山市浑江区", point:"126.432106|41.938914"},
                {title:"I", name:'液晶网苑', address:"白山市浑江区",point:"126.42825|41.937164"},
                {title:"J", name:'梦缘网络喜丰分店', address:"白山市浑江区喜丰花园",point:"126.434169|41.949417"},
                {title:"K", name:'避风塘网吧', address:"白山市浑江区民中街",point:"126.417378|41.938029"},
                {title:"L", name:'新时代网吧', address:"白山市浑江区",point:"126.431124|41.939397"},
                {title:"M", name:'银桥网吧', address:"白山市浑江区",point:"126.45479|41.956773"},
                {title:"N", name:'飞龙网吧', address:"白山市浑江区",point:"126.438452|41.950517"},
                {title:"O", name:'再回首网吧', address:"白山市浑江区",point:"126.437009|41.948632"},
                {title:"P", name:'博爱网络', address:"白山市浑江区",point:"126.449251|41.953709"},
                {title:"Q", name:'新干线网吧', address:"白山市浑江区红旗街10-3 ",point:"126.446706|41.956056"},
                {title:"R", name:'瑞雪网吧', address:"白山市浑江区",point:"126.413401|41.929919"},
                {title:"S", name:'大厦网吧', address:"白山市浑江区",point:"126.428959|41.944521"},
                {title:"T", name:'馨元夜空网络', address:"白山市浑江区",point:"126.425915|41.947311"},
                {title:"U", name:'昊空网吧', address:"白山市浑江区",point:"126.455543|41.955546"},
                {title:"V", name:'巨人网吧', address:"白山市浑江区",point:"126.423825,41.939149"},
                {title:"W", name:'再聚首步步高网吧', address:"白山市浑江区民中街49-2号", tel:'(0439)8996992', point:"126.424639|41.943354"},
                {title:"X", name:'迎宾网吧', address:"白山市浑江区",point:"126.421573|41.94379"},
                {title:"Y", name:'夜空网吧', address:"白山市浑江区",point:"126.42275|41.937083"},
                {title:"Z", name:'遨游网吧', address:"白山市浑江区",point:"126.408016|41.928188"},
                {title:"A1", name:'连发网吧', address:"白山市浑江区",point:"126.46649|41.964692"}
            ];
            var arr = [];
            for(var i=0;i<this.aMapPoint.length;i++) {
                var obj = this.aMapPoint[i];
                var content = obj.name + '<br/>' + obj.address;
                if(obj.tel) {
                    content += '<br/>' + obj.tel;
                }
                arr.push({title:obj.title, content:content, point:obj.point, isOpen:0, icon:{w:23,h:25,l:46,t:21,x:9,lb:12}});
            }
            return arr;
        },
        // 分页内容
        fPageContentView: function() {
            var trs = [];
            for(var i=0;i<this.aMapPoint.length;i++) {
                var obj = this.aMapPoint[i];
                var tel = obj.tel != undefined ? obj.tel : '暂无';
                var tr =  '<tr><td class="position"><i class="png">'+obj.title+'</i></td>';
                tr += '<td class="sellAddress">'+obj.name+'</td>';
                tr += '<td class="phone">'+tel+'</td>';
                tr += '<td class="address">'+obj.address+'</td></tr>';
                trs.push(tr);
            }
            ui.$point_tbody.html(trs.join(''));
        },
        // 分页
        fPagingView: function() {
            ui.$point_tbody_tr = ui.$point_tbody.find('tr');
            var size = 5,  //每页显示数量
                curPage = 1,    //当前页码
                length = this.aMapPoint.length,
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

            ui.$point_tbody_tr.hide().slice(startIndex, endIndex).show();
            ui.$span_pageList.find('a[data-page='+nPage+']').addClass('cur')
                .siblings().removeClass('cur');
            this.oPageInfo.curPage = nPage;
        }
    }
    oPage.init();
})

