yp.use('imagecropper',function(){
    yp.ready(function(){
        var cropper;
        cropper = new ImageCropper({cropper:"cropper",square:"square",rect:"rectangle",notSupport:notSupport,url:"/index.php?c=ucenter&a=setAvatar",callback:function(msg){
            var $submit= $('[type=submit]');
            $submit.find("img").addClass("hide");
            if(msg.code == 0){
                alert("您的头像已上传成功置");

            }else{
                $submit.attr("disabled",false);
                alert("对不起您的头像生成失败");
            }
        }});
        function notSupport(){
            $(".uploadPic").empty();
            cropper=null;
            alert('您的浏览器不够高级');
        }
    })
})
/*
$(function(){
    $(window).load(function(){
        var cropper;
        cropper = new ImageCropper({cropper:"cropper",square:"square",rect:"rectangle",notSupport:notSupport,url:"/index.php?c=ucenter&a=setAvatar",callback:function(msg){
            var $submit= $('[type=submit]');
            $submit.find("img").addClass("hide");
            if(msg.code == 0){
                alert("您的头像已上传成功置");

            }else{
                $submit.attr("disabled",false);
                alert("对不起您的头像生成失败");
            }
        }});
        function notSupport(){
            $(".uploadPic").empty();
            cropper=null;
            alert('您的浏览器不够高级');
        }
    })
})*/
