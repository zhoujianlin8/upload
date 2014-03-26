(function(scope){
    var ImageCropper = function(opt)
    {
        this.$range=$(".uploadPic [type=range]");
        this.$file=$(".uploadPic [type=file]");
        this.$submit=$(".uploadPic [type=submit]");
        this.cropperPic=opt.cropper||"cropper";
        this.rectPic=opt.rect||"squarePic";
        this.squarePic=opt.square||"rectPic";

        this.url=opt.url||null;
        this.callback=opt.callback || function(){};
        this.notSupport=opt.notSupport||function(){};

        this.cropWidth = opt.cropWidth||100;
        this.cropHeight = opt.cropHeight||100;
        this.imageSize=opt.imageSize||4096;
        this.imageMaxWidth=opt.imageMaxWidth||1600;
        this.imageMaxHeight=opt.imageMaxHeight||1600;
        this.imageMinWidth=opt.imageMinWidth||200;
        this.imageMinHeight=opt.imageMinHeight||200;
        this.imageStyleArray=opt.imageStyleArray||["png","jpg","jpeg","gif"];

        this.width = null;
        this.height = null;
        this.image = null;
        this.imageCanvas = null;
        this.imageContext = null;
        this.imageScale = 1;
        this.imageRotation = 0;
        this.imageLeft = 0;
        this.imageTop = 0;
        this.imageViewLeft = 0;
        this.imageViewTop = 0;

        this.canvas = null;
        this.context = null;
        this.previews = [];

        this.maskGroup = [];
        this.maskAlpha = 0.3;
        this.maskColor = "#fff";
        this.borderColor="#000";
        this.borderWidth=2;

        this.cropLeft = 0;
        this.cropTop = 0;
        this.cropViewWidth =  this.cropWidth;
        this.cropViewHeight = this.cropHeight;

        this.dragSize = 7;
        this.dragColor = "#fff";
        this.dragLeft = 0;
        this.dragTop = 0;

        this.mouseX = 0;
        this.mouseY = 0;
        this.inCropper = false;
        this.inDragger = false;
        this.isMoving = false;
        this.isResizing = false;

        //move and resize help properties
        this.mouseStartX = 0;
        this.mouseStartY = 0;
        this.cropStartLeft = 0;
        this.cropStartTop = 0;
        this.cropStartWidth = 0;
        this.cropStartHeight = 0;
        this.imageX=0;
        this.imageY=0;
        this.firstScale=0;
        this.ratio=1;

        //remind crop image
        this.oldImageX=0;
        this.oldImageY=0;
        this.oldCropViewWidth=0;
        this.oldCropViewHeight=0;
        this.oldCropLeft=0;
        this.oldCropTop=0;
        this.oldImageScale=0;
        this.oldN=0;
        this.notFirstClick=false;


        //input=range
        this.min=0;
        this.max=0;
        this.step=0;
        this.n=0;
        this.mousewheelUp=0;

        this.isSet=false;
        this.isBind=true;
        this.isSmall=false;
        this._init();
    }
    scope.ImageCropper = ImageCropper;
    ImageCropper.prototype._init=function(){
        if(!this.isAvaiable()){
            this.notSupport();
            return false;
        }
        if( window.navigator.userAgent.indexOf("Chrome") === -1 ){
            this.$range.hide().siblings("i").hide().parent(".rangeL").append("您可滚动鼠标缩放图片");
        }
        this._inputFile();
    }
    ImageCropper.prototype._inputFile=function(){
         var me=this;
         this.$file.on("change",function(){
              me.loadImage(this.files[0]);
          })

    }
    ImageCropper.prototype.setCanvas = function(canvas)
    {
        //working canvas
        this.canvas = document.getElementById(canvas) || canvas;
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        this.context = this.canvas.getContext("2d");
//        this.canvas.width = this.width;
//        this.canvas.height = this.height;
        this.canvas.oncontextmenu = this.canvas.onselectstart = function(){return false;};

        //caching canvas
        this.imageCanvas = document.createElement("canvas");
        this.imageContext = this.imageCanvas.getContext("2d");
        this.imageCanvas.width = this.width;
        this.imageCanvas.height = this.height;
    }

    ImageCropper.prototype.addPreview = function(canvas)
    {
        var preview = document.getElementById(canvas) || canvas;
        var context = preview.getContext("2d");
        this.previews.push(context);
    }

    ImageCropper.prototype.loadImage = function(file)
    {
        var imageStyleArray=this.imageStyleArray.join(",");
        if(file.type.indexOf("image") !== 0){       //判断文件类型
            alert("文件类型错误，请检查您选择的文件");
            return false;
        }else{
            if(imageStyleArray.indexOf(file.type.slice(6))==-1){
                alert("图片类型不符，请检查您选择的文件");
                return false;
            }

            if(file.size>this.imageSize*1024){                  //判断图片size
                alert("图片太大，请检查您选择的文件");
                return false;
            }
        }
        var reader = new FileReader();
        var me = this;
        reader.readAsDataURL(file);
        reader.onload = function(evt)
        {
            var image = new Image();
            image.src = evt.target.result;
            image.onload = function(e){

                if(image.width>me.imageMaxWidth || image.height>me.imageMaxHeight){  //判断图片长宽
                    alert("图片尺寸太大，请检查您选择的文件");
                    return false;
                }
                if((image.width<me.imageMinWidth || image.height<me.imageMinHeight)){
                    alert("图片尺寸太小，请检查您选择的文件");
                    return false;
                }
               me.setCanvas(me.cropperPic);
               me.removePreviews();
               me.addPreview(me.squarePic);
               me.addPreview(me.rectPic);
               me._reset();
               me._bindEvent();
               me._view(image);
              image = null;

            };
        }
    }
    ImageCropper.prototype._reset=function(){
        this.$range.val(this.$range.attr("min"));
        this.$range.siblings("i").css("width",0);
        this.$submit.attr("disabled",false);
        this.$submit.find("img") && this.$submit.find("img").addClass("hide");
        this.isSet=false;

        this.oldImageX=this.imageX=0;
        this.oldImageY=this.imageY=0;
        this.oldCropViewWidth=0;
        this.oldCropViewHeight=0;
        this.oldCropTop=0;
        this.oldCropLeft=0;
        this.oldImageScale=0;
        this.oldN=0;
        this.notFirstClick=false;
        this.imageScale = 1;
        this.min=0;
        this.max=0;
        this.step=0;
        this.n=0;
        this.ratio=1;
    }
    ImageCropper.prototype._bindEvent=function(){
        if(this.isBind){
            $("body").on("click","#"+this.rectPic,this,this.rect);
            $("body").on("change",'[type=range]',this,function(e) {
                var me= e.data;
                var n=$(this).val();
                var min=$(this).attr("min");
                var max=$(this).attr("max");
                var p=(n-min)/(max-min);
                var width=$(this).css("width");
                $(this).siblings("i").css("width",p*(parseInt(width)));
                me.zoom();
                return false;
            });
            $("body").on("click",'[type=submit]',this,function(e){
                var me= e.data;
                if(me.isSet){
                    var data1= $("#"+me.squarePic)[0].toDataURL("image/jpeg");
                    var data2= $("#"+me.rectPic)[0].toDataURL("image/jpeg");
                    var dataForm=new FormData();
                    dataForm.append(me.squarePic,data1);
                    dataForm.append(me.rectPic,data2);
                    $(this).attr("disabled","true");
                    $(this).find("img") && $(this).find("img").removeClass("hide");
                    me.ajax(dataForm);
                }else{
                    alert("请选择您的长头像进行编辑");
                    return false;
                }
                return false;
            });
            this.isBind=false;
        }
        if(this.isSmall){
            $("body").on("click","#"+this.rectPic,this,this.rect);
            $("body").off("click","#"+this.squarePic,this.square);
        }
        $('#'+this.rectPic).removeClass('on');
        $('#'+this.squarePic).addClass('on');
        $('.cropperPart').addClass('hide');
    }

    ImageCropper.prototype.rect=function(e){
        var me= e.data;
        var id=$(this).attr("id");
        var height=$(this).height();
        var width=$(this).width();
        $(this).addClass("on");
        $("#"+me.squarePic).removeClass("on");
        me.removePreviews();
        me.addPreview(id);
        me.setCropper(width,height);
        $("body").off("click","#"+me.rectPic,me.rect);
        $("body").on("click","#"+me.squarePic,me,me.square);
        if(!me.isSet){
              me.isSet=true;
         }
        me.isSmall=true;
        console.log(me.image);
    }
    ImageCropper.prototype.square=function(e){
        var me= e.data;
        var id=$(this).attr("id");
        var height=$(this).height();
        var width=$(this).width();
        $(this).addClass("on");
        $("#"+me.rectPic).removeClass("on");
        me.removePreviews();
        me.addPreview(id);
        me.setCropper(width,height);
        $("body").on("click","#"+me.rectPic,me,me.rect);
        $("body").off("click","#"+me.squarePic,me.square);
        me.isSmall=false;
    }

    ImageCropper.prototype._view = function(image){
        this.image=image;
        var scale=Math.min(this.width/this.image.width,this.height/this.image.height); //保证图片全部内容在canvas中 并拉伸居中
      // if (scale > 1) scale = Math.min(this.cropViewWidth/this.image.width, this.cropViewHeight/this.image.height);
       if (this.image.width*scale<this.cropViewWidth) scale = Math.min(scale, this.cropViewWidth/this.image.width);
       if (this.image.height*scale<this.cropViewHeight) scale = Math.min(scale, this.cropViewHeight/this.image.height);
        this.imageViewLeft = this.imageLeft = (this.width - this.image.width*scale)/2;
        this.imageViewTop = this.imageTop = (this.height - this.image.height*scale)/2;
        this.imageScale =this.firstScale= scale;
        this.imageRotation = 0;
        //crop view size
        var minSize = Math.min(this.image.width*scale, this.image.height*scale);
        this.cropViewWidth = Math.min(minSize, this.cropWidth);
        this.cropViewHeight = Math.min(minSize, this.cropHeight);
        this.cropLeft = (this.width - this.cropViewWidth)/2;
        this.cropTop = (this.height - this.cropViewHeight)/2;
        this._update();

        //register event handlers
        var me = this;
        this.canvas.onmousedown = function(e){me._mouseHandler.call(me, e)};
        document.body.onmouseup = function(e){me._mouseHandler.call(me, e)};
        //this.canvas.onmouseup = function(e){me._mouseHandler.call(me, e)};
        this.canvas.onmousemove = function(e){me._mouseHandler.call(me, e)};
        this.canvas.onmousewheel=function(e){me._mouseHandler.call(me, e)};
        if(document.addEventListener){
            document.addEventListener('DOMMouseScroll',function(e){me._mouseHandler.call(me, e)},false);
        }//兼容firefox
    }
    ImageCropper.prototype._mouseHandler = function(e)
    {
        if(e.type == "mousemove")
        {
            var clientRect = this.canvas.getClientRects()[0];
            this.mouseX = e.pageX - clientRect.left;
            this.mouseY = e.pageY - clientRect.top;
            this._checkMouseBounds();
            this.canvas.style.cursor = (this.inCropper || this.isMoving)  ? "move" : (this.inDragger || this.isResizing) ? "se-resize" : "";
            this.isMoving ? this._move() : this.isResizing ? this._resize() : null;

        }else if(e.type == "mousedown")
        {
            this.mouseStartX = this.mouseX;
            this.mouseStartY = this.mouseY;
            this.cropStartLeft = this.cropLeft;
            this.cropStartTop = this.cropTop;
            this.cropStartWidth = this.cropViewWidth;
            this.cropStartHeight = this.cropViewHeight;
            this.inCropper ? this.isMoving = true : this.inDragger ? this.isResizing = true : null;
        }else if(e.type == "mouseup")
        {
            this.isMoving = this.isResizing = false;
        }else if(e.type="mousewheel"){
             this.mousewheelUp= e.wheelDelta/120 || e.detail/(-3); //兼容firefox
             this._range();
            e.preventDefault();
        }
    }

    ImageCropper.prototype._checkMouseBounds = function()
    {
        this.inCropper = (this.mouseX >= this.cropLeft && this.mouseX <= this.cropLeft+this.cropViewWidth &&
            this.mouseY >= this.cropTop && this.mouseY <= this.cropTop+this.cropViewHeight);

        this.inDragger = (this.mouseX >= this.dragLeft && this.mouseX <= this.dragLeft+this.dragSize &&
            this.mouseY >= this.dragTop && this.mouseY <= this.dragTop+this.dragSize);

        this.inCropper = this.inCropper && !this.inDragger;
    }

    ImageCropper.prototype._move = function()
    {
        var deltaX = this.mouseX - this.mouseStartX;
        var deltaY = this.mouseY - this.mouseStartY;
        this.cropLeft = Math.max(0,this.imageViewLeft, this.cropStartLeft + deltaX);
        this.cropLeft = Math.min(this.cropLeft, this.width-this.imageViewLeft-this.cropViewWidth);
        this.cropTop = Math.max(0,this.imageViewTop, this.cropStartTop + deltaY);
        this.cropTop = Math.min(this.cropTop, this.height-this.imageViewTop-this.cropViewHeight);
        this._update();
    }

    ImageCropper.prototype._resize = function()
    {
        var delta = Math.min(this.mouseX - this.mouseStartX, this.mouseY - this.mouseStartY);
        var cw = Math.max(10, this.cropStartWidth + delta);
        var ch = Math.max(10, this.cropStartHeight + delta);
        var cw = Math.min(cw, this.width-this.cropStartLeft-this.imageViewLeft);
        var ch = Math.min(ch, this.height-this.cropStartTop-this.imageViewTop);
        this.cropViewWidth = Math.round(Math.min(cw, ch));
        this.cropViewHeight=this.cropViewWidth/this.ratio;
        this.cropViewHeight=Math.min(this.cropViewHeight,this.image.height-this.cropTop);
        this.cropViewWidth=Math.min(this.cropViewWidth,this.image.width-this.cropLeft);
        this._update();
    }

    ImageCropper.prototype._update = function()
    {
        this.imageViewLeft = this.imageLeft = Math.max(0,(this.width - this.image.width*this.imageScale)/2);
        this.imageViewTop = this.imageTop = Math.max(0,(this.height - this.image.height*this.imageScale)/2);
        if(this.cropTop+this.cropViewHeight>this.height){
            this.cropTop=this.height-this.cropViewHeight;
        }
        if(this.cropLeft+this.cropViewWidth>this.width){
            this.cropLeft=this.width-this.cropViewWidth;
        }
        this.cropViewHeight=this.cropViewWidth/this.ratio;
        this.cropTop=Math.max(0,this.cropTop,this.imageViewTop);
        this.cropLeft=Math.max(0,this.cropLeft,this.imageViewLeft);
        if(this.cropViewHeight>this.image.height*this.imageScale){
            this.cropViewHeight=this.image.height*this.imageScale;
            this.cropViewWidth=this.cropViewHeight*this.ratio;
        }
        if(this.cropViewWidth>this.image.width*this.imageScale){
            this.cropViewWidth=this.image.width*this.imageScale;
            this.cropViewHeight=this.cropViewWidth/this.ratio;
        }
        if(this.cropTop+this.cropViewHeight>this.imageViewTop+this.image.height*this.imageScale){
            this.cropTop=this.imageViewTop+this.image.height*this.imageScale-this.cropViewHeight;
        }
        if(this.cropLeft+this.cropViewWidth>this.imageViewLeft+this.image.width*this.imageScale){
            this.cropLeft=this.imageViewLeft+this.image.width*this.imageScale-this.cropViewWidth;
        }
        this.dragLeft = this.cropLeft + this.cropViewWidth - this.dragSize/2;
        this.dragTop = this.cropTop + this.cropViewHeight - this.dragSize/2;
        this.context.clearRect(0, 0, this.width, this.height);
        this._drawImage();
        this._drawMask();
        this._drawDragger();
        this._drawPreview();
    }

    ImageCropper.prototype._drawImage = function()
    {
        this.imageContext.clearRect(0, 0, this.width, this.height);
        this.imageContext.save();
        this.imageContext.translate((this.width-this.image.width*this.imageScale)/2, (this.height-this.image.height*this.imageScale)/2);
        if(this.image.width*this.imageScale>=this.width){
            this.imageContext.translate(this.imageX ,0);
        }
        if(this.image.height*this.imageScale>=this.height){
            this.imageContext.translate(0,this.imageY);
        }

        this.imageContext.scale(this.imageScale, this.imageScale);
        this.imageContext.drawImage(this.image,0,0 );
        this.imageContext.restore();
        this.context.drawImage(this.imageCanvas, 0, 0);
    }

    ImageCropper.prototype._drawPreview = function()
    {
        for(var i = 0; i < this.previews.length; i++)
        {
            var preview = this.previews[i];
            preview.clearRect(0, 0, preview.canvas.width, preview.canvas.height);
            preview.save();
            preview.drawImage(this.imageCanvas, this.cropLeft, this.cropTop, this.cropViewWidth, this.cropViewHeight, 0, 0, preview.canvas.width, preview.canvas.height);
            preview.restore();
        }
        if(this.previews.length>1){
            this.previews.splice(1,this.previews.length-1); //留下默认第一个元素
        }
    }

    ImageCropper.prototype._drawMask = function()
    {
        //this._drawRect(this.imageViewLeft, this.imageViewTop, this.cropLeft-this.imageViewLeft, this.height, this.maskColor, null, this.maskAlpha);
        //this._drawRect(this.cropLeft+this.cropViewWidth, this.imageViewTop, this.width-this.cropViewWidth-this.cropLeft+this.imageViewLeft, this.height, this.maskColor, null, this.maskAlpha);
        //this._drawRect(this.cropLeft, this.imageViewTop, this.cropViewWidth, this.cropTop-this.imageViewTop, this.maskColor, null, this.maskAlpha);
        //this._drawRect(this.cropLeft, this.cropTop+this.cropViewHeight, this.cropViewWidth, this.height-this.cropViewHeight-this.cropTop+this.imageViewTop, this.maskColor, null, this.maskAlpha);
        this._drawRect(this.cropLeft, this.cropTop, this.cropViewWidth, this.cropViewHeight, this.maskColor, this.borderWidth,this.borderColor, this.maskAlpha);
    }

    ImageCropper.prototype._drawDragger = function()
    {
        this._drawRect(this.dragLeft, this.dragTop, this.dragSize, this.dragSize, null,null, this.dragColor, null);
    }

    ImageCropper.prototype._drawRect = function(x, y, width, height, color,borderWidth, borderColor, alpha) //画矩形
    {
        this.context.save();
        if(color !== null) this.context.fillStyle = color;
        if(borderColor !== null) this.context.strokeStyle = borderColor;
        if(alpha !== null) this.context.globalAlpha = alpha;
        if(borderWidth!=null)this.context.lineWidth=borderWidth;
        this.context.beginPath();

        this.context.rect(x, y, width, height);
        this.context.closePath();
        if(color !== null) this.context.fill();
        if(borderColor !== null) this.context.stroke();
        this.context.restore();
    }


    ImageCropper.prototype.isAvaiable = function()
    {
        return typeof(FileReader) !== "undefined";
    }

    ImageCropper.prototype.isImage = function(file)
    {
        return (/image/i).test(file.type);
    }
    ImageCropper.prototype.removePreviews=function(){
         this.previews.length=0;
    }
    ImageCropper.prototype.setCropper=function(cropWidth, cropHeight){
         if(this.notFirstClick){
             this.ratio=cropWidth/cropHeight||this.cropWidth/this.cropHeight;
             this._save();
         }else{
             this.oldImageX=this.imageX;
             this.oldImageY=this.imageY;
             this.oldImageScale=this.imageScale;
             this.oldCropViewHeight=this.cropViewHeight;
             this.oldCropViewWidth=this.cropViewWidth;
             this.oldCropLeft=this.cropLeft;
             this.oldCropTop=this.cropTop;
             this.oldN=this.n;

             this.cropWidth = cropWidth||this.cropWidth;
             this.cropHeight = cropHeight||this.cropHeight;
             this.cropViewWidth = this.cropWidth;
             this.cropViewHeight =this.cropHeight;
             this.notFirstClick=true;
             this.ratio=cropWidth/cropHeight||this.cropWidth/this.cropHeight;
             this._update();
         }


    }
    ImageCropper.prototype._range=function(){
        this.n=this.$range.val();
        this.max=this.$range.attr("max");
        this.min=this.$range.attr("min");
        this.step=this.$range.attr("step");
        if(this.mousewheelUp<0){
            if(this.n>this.min){
                this.imageScale=this.firstScale*(this.n-this.step);
                this.$range.val(this.n-this.step);
                this.$range.trigger("change");
            }

        }else {
            if(this.n<this.max){
                this.imageScale=this.firstScale*((this.n-0)+(this.step-0));
                this.$range.val((this.n-0)+(this.step-0));
                this.$range.trigger("change");
            }
        }
    }
    ImageCropper.prototype._save=function(){
        var imageX=this.imageX;
        var imageY=this.imageY;
        var imageScale=this.imageScale;
        var cropViewHeight=this.cropViewHeight;
        var cropViewWidth=this.cropViewWidth;
        var cropLeft=this.cropLeft;
        var cropTop=this.cropTop;
        var n=this.n;

        this.imageX=this.oldImageX;
        this.imageY=this.oldImageY;
        this.imageScale=this.oldImageScale;
        this.cropViewHeight=this.oldCropViewHeight;
        this.cropViewWidth=this.oldCropViewWidth;
        this.cropLeft=this.oldCropLeft;
        this.cropTop=this.oldCropTop;
        this.n=this.oldN;

        this.oldImageX=imageX;
        this.oldImageY=imageY;
        this.oldImageScale=imageScale;
        this.oldCropViewHeight=cropViewHeight;
        this.oldCropViewWidth=cropViewWidth;
        this.oldCropLeft=cropLeft;
        this.oldCropTop=cropTop;
        this.oldN=n;

        this.$range.val(this.n);
        this.$range.trigger("change");
    }
    ImageCropper.prototype.zoom=function(){
        this.n=this.$range.val();
        this.imageScale=this.firstScale*this.n;
        this.imageX =(this.width/2-this.cropLeft-this.cropViewWidth/2)*(this.image.width*this.imageScale-this.width)/(this.width-this.cropViewWidth);
        this.imageY =(this.height/2-this.cropTop-this.cropViewHeight/2)*(this.image.height*this.imageScale-this.height)/(this.height-this.cropViewHeight);
        this._update();
    }
    ImageCropper.prototype.ajax=function(dataForm){
        $.ajax({
            type:'POST',
            url:this.url,
            data:dataForm,
            /**
             *必须false才会自动加上正确的Content-Type
             */
            contentType:false,
            /**
             * 必须false才会避开jQuery对 formdata 的默认处理
             * 必须false才会避开jQuery对 formdata 的默认处理
             * XMLHttpRequest会对 formdata 进行正确的处理
             */
            processData:false,
            success:this.callback
        })
    }
})(window);