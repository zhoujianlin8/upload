// 校验
function fInputValid($input,boor) {
    var flag = true;
    window.boor=boor || $input.attr('data-ajax');
    var valid = $input.data('valid').replace(/\'/g,'\"');
    var objValid = $.parseJSON(valid),
        type = objValid.type,
        id = $input.attr('id');

    if(type == 'mobile') {
        flag = verifyMobile(id);
    } else if(type == 'txt') {
        flag = verifyTxt(id, objValid.msg);
    } else if(type == 'nickname') {
        flag = verifyNickname(id, objValid.msg);
    } else if(type == 'idcard') {
        flag = verifyIdCard(id, objValid.msg);
    } else if(type == 'realname') {
        flag = verifyRealName(id, objValid.msg);
    } else if(type == 'account') {
        flag = verifyAccount(id);
    } else if(type == 'password') {
        flag = verifyPassword(id, objValid.safeLevel);
    } else if(type == 'passwordAgain') {
        flag = verifyPasswordAgain(objValid.origin, id);
    } else if(type == 'accept') {
        flag = verifyAccept(id);
    }else if(type == 'checkNum'){
        flag = verifyCheckNum(id,objValid.msg);
    }else if(type == 'email'){
        flag = verifyEmail(id,objValid.msg);
    }else if(type='')
    return flag;
}
//验证邮箱
function verifyEmail(id,msg){
    var $this= $('#'+id+'');
    var error=["邮箱账号不能为空"," 邮箱账号格式不对哦"];
    var reg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var val=$this.val();
    if(val== ''){
        showValidResult(id, 'error', msg);
        return false;
    }else if(reg.test(val)){
        showValidResult(id, 'success', '');
        return true;
    }else{
        showValidResult(id, 'error', error[1]);
        return false;
    }
}
//验证验证码 4-6位
function verifyCheckNum(id,msg){
    var $this= $('#'+id+'');
    var str=$this.val();
    if(verifyIsNull(str)) {//验证为空
        showValidResult(id, 'error', '验证码不能为空');
        return false;
    }
    var reg = /^[0-9a-z]{4,6}$/i;
    if (reg.test(str)) {
        showValidResult(id, 'success', '');
        return true;
    } else {
        showValidResult(id, 'error', ' 验证码不符');
        return false;
    }
}
//验证手机号码, 11位
function verifyMobile(id) {
	var strMobile = $('#'+id+'').val();
	if(verifyIsNull(strMobile)) {//验证电话为空
		showValidResult(id, 'error', '手机号码不能为空');
		return false;
	}
	var reg0 = /^(13[0-9]|14[1357]|15[0123456789]|18[012356789])[0-9]{8}$/;
	if (reg0.test(strMobile)) {
		showValidResult(id, 'success', '');
		return true;	
	} else {
		showValidResult(id, 'error', '请输入您的11位手机号码');
		return false;
	}
};

// 验证文本
function verifyTxt(id, msg) {
	var txt = $('#'+id+'').val();
	if(verifyIsNull(txt)) {//验证电话为空
		if(!msg) {
			msg = ' 请输入';
		}
		showValidResult(id, 'error', msg);
		return false;
	} else {
		showValidResult(id, 'success', '');
		return true;
	}
}

// 验证身份证
function verifyIdCard(id, msg){ 
	var Errors = new Array(
			 "您输入的身份证号码错误",
			 "您输入的身份证号码错误",
			 " 身份证号码不能为空"
			);
	if(msg) {
		Errors = new Array(
			msg,
			msg,
			msg
			);
	}
	
	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
	var idcard,Y,JYM;
	var S,M;
	var thisid = idcard;
	var idcard_array = new Array();
	
	//取值
	idcard = $('#'+id+'').val();
	var idcard= TrimStr(idcard);
	
	//验证空
	if(idcard == ''){
		showValidResult(id, 'error', Errors[2]);
		return false;
	}
	
	idcard_array = idcard.split("");
	//地区检验
	if(area[parseInt(idcard.substr(0,2))]==null) {
		showValidResult(id, 'error', Errors[1]);
		return false;
	}
	if (idcard.substr(0,6) == "000000" || idcard.substr(0,6) == "111111" || idcard.substr(0,6) == "222222" || idcard.substr(0,6) == "333333" || idcard.substr(0,6) == "444444" || idcard.substr(0,6) == "555555" || idcard.substr(0,6) == "666666" || idcard.substr(0,6) == "777777" || idcard.substr(0,6) == "888888" || idcard.substr(0,6) == "999999")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "123456" || idcard.substr(0,6) == "234567" || idcard.substr(0,6) == "345678" || idcard.substr(0,6) == "456789" || idcard.substr(0,6) == "567890" || idcard.substr(0,6) == "012345" || idcard.substr(0,6) == "543210" || idcard.substr(0,6) == "432109" || idcard.substr(0,6) == "321098" || idcard.substr(0,6) == "210987" || idcard.substr(0,6) == "109876" || idcard.substr(0,6) == "098765" || idcard.substr(0,6) == "987654" || idcard.substr(0,6) == "876543" || idcard.substr(0,6) == "765432")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "121212" || idcard.substr(0,6) == "131313" || idcard.substr(0,6) == "141414" || idcard.substr(0,6) == "151515" || idcard.substr(0,6) == "161616" || idcard.substr(0,6) == "171717" || idcard.substr(0,6) == "181818" || idcard.substr(0,6) == "191919" || idcard.substr(0,6) == "101010")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "212121" || idcard.substr(0,6) == "232323" || idcard.substr(0,6) == "242424" || idcard.substr(0,6) == "252525" || idcard.substr(0,6) == "262626" || idcard.substr(0,6) == "272727" || idcard.substr(0,6) == "282828" || idcard.substr(0,6) == "292929" || idcard.substr(0,6) == "202020")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "313131" || idcard.substr(0,6) == "323232" || idcard.substr(0,6) == "343434" || idcard.substr(0,6) == "353535" || idcard.substr(0,6) == "363636" || idcard.substr(0,6) == "373737" || idcard.substr(0,6) == "383838" || idcard.substr(0,6) == "393939" || idcard.substr(0,6) == "303030")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "414141" || idcard.substr(0,6) == "424242" || idcard.substr(0,6) == "434343" || idcard.substr(0,6) == "454545" || idcard.substr(0,6) == "464646" || idcard.substr(0,6) == "474747" || idcard.substr(0,6) == "484848" || idcard.substr(0,6) == "494949" || idcard.substr(0,6) == "404040")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "515151" || idcard.substr(0,6) == "525252" || idcard.substr(0,6) == "535353" || idcard.substr(0,6) == "545454" || idcard.substr(0,6) == "565656" || idcard.substr(0,6) == "575757" || idcard.substr(0,6) == "585858" || idcard.substr(0,6) == "595959" || idcard.substr(0,6) == "505050")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "616161" || idcard.substr(0,6) == "626262" || idcard.substr(0,6) == "636363" || idcard.substr(0,6) == "646464" || idcard.substr(0,6) == "656565" || idcard.substr(0,6) == "676767" || idcard.substr(0,6) == "686868" || idcard.substr(0,6) == "696969" || idcard.substr(0,6) == "606060")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "717171" || idcard.substr(0,6) == "727272" || idcard.substr(0,6) == "737373" || idcard.substr(0,6) == "747474" || idcard.substr(0,6) == "757575" || idcard.substr(0,6) == "767676" || idcard.substr(0,6) == "787878" || idcard.substr(0,6) == "797979" || idcard.substr(0,6) == "707070")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "818181" || idcard.substr(0,6) == "828282" || idcard.substr(0,6) == "838383" || idcard.substr(0,6) == "848484" || idcard.substr(0,6) == "858585" || idcard.substr(0,6) == "868686" || idcard.substr(0,6) == "878787" || idcard.substr(0,6) == "898989" || idcard.substr(0,6) == "808080")  {showValidResult(id, 'error', Errors[1]); return false;}
  	if (idcard.substr(0,6) == "919191" || idcard.substr(0,6) == "929292" || idcard.substr(0,6) == "939393" || idcard.substr(0,6) == "949494" || idcard.substr(0,6) == "959595" || idcard.substr(0,6) == "969696" || idcard.substr(0,6) == "979797" || idcard.substr(0,6) == "989898" || idcard.substr(0,6) == "909090")  {showValidResult(id, 'error', Errors[1]); return false;}
	//身份号码位数及格式检验
	switch(idcard.length){
		case 15:
			if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
				ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
			} else {
				ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
			}
			if(ereg.test(idcard)) {
				showValidResult(id, 'success', '');
				return true;
			} else {
				showValidResult(id, 'error', Errors[1]);
				return false;
			}
			break;
		case 18:
			//18位身份号码检测
			//出生日期的合法性检查
			//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
			//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
			if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){
				ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
			} else {
				ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
			}
			if(ereg.test(idcard)){//测试出生日期的合法性
			//计算校验位
				S =   (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
					+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
					+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
					+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
					+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
					+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
					+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
					+ parseInt(idcard_array[7]) * 1
					+ parseInt(idcard_array[8]) * 6
					+ parseInt(idcard_array[9]) * 3 ;
				Y = S % 11;
				M = "F";
				JYM = "10X98765432";
				M = JYM.substr(Y,1);//判断校验位
				if(M == idcard_array[17] || (M == 'X' && idcard_array[17] == 'x')) { //检测ID的校验位
					showValidResult(id, 'success', '');
					return true;
				}else {
					showValidResult(id, 'error', Errors[1]);
					return false;
				}
			}else {
				showValidResult(id, 'error', Errors[1]);
				return false;
			}
			break;
		default:
			showValidResult(id, 'error', Errors[0]);
			return false;
			break;
	}
}

// 验证真实姓名(只能是中文)
function verifyRealName(id, msg){
	var Errors = new Array(
			"姓名不能为空",
			"只能填写中文名哦",
			"只能填写中文名哦"
			);
	if(msg) {
		Errors = new Array(
			msg,
			msg,
			msg
			);
	}

	var sn = $('#'+id+'').val();
	var sn=TrimStr(sn);
	if(sn == ''){
		showValidResult(id, 'error', Errors[0]);
		return false;
	}
	//在JavaScript中,正则表达式只能使用"/"开头和结束,不能使用双引号
	var Expression = /[^\u4E00-\u9FA5]/; 
	var objExp = new RegExp(Expression);
	if(objExp.test(sn)==true){
		showValidResult(id, 'error', Errors[1]);
	   	return false;
	}else if(sn.length<2 || sn.length>8){
		showValidResult(id, 'error', Errors[2]);
	   	return false;
	}else{
		showValidResult(id, 'success', '');
	   	return true;
	}
}

// 验证游戏昵称 (4-16位)
function verifyNickname(id) {
	var testStr = /^[a-zA-Z0-9\u4E00-\u9FA5]{4,16}$/;
	var val = $('#'+id).val();
	if(verifyIsNull(val)) {//验证为空
		showValidResult(id, 'error', '昵称不能为空');
		return false;
	}
	if(testStr.test(val)) {
		showValidResult(id, 'success', '');
		return true;	
	} else {
		showValidResult(id, 'error', ' 游戏昵称不对哦（4-16位呢）');
		return false;
	}
}

// 验证账号 (允许中文、字母、数字、下划线，长度在8-18个字符 )
function verifyAccount(id) {
	var testStr = /^[_a-zA-Z0-9\u4E00-\u9FA5]{8,18}$/;
	var val = $('#'+id).val();
	if(verifyIsNull(val)) {//验证为空
		showValidResult(id, 'error', ' 还没有输入游戏账号呢（8-18位哦）');
		return false;
	}
	if(testStr.test(val)) {
		showValidResult(id, 'success', '');
		return true;	
	} else {
		showValidResult(id, 'error', ' 游戏游戏账号不对哦（8-18位呢）');
		return false;
	}
}

// 验证密码 (8-40位)
function verifyPassword(id, safeLevelId) {
	var valPattern = /^[^, '"]+$/;
	var val = $('#'+id).val();
	$('#' + safeLevelId).addClass('hide');
	if(verifyIsNull(val)) {//验证为空
		showValidResult(id, 'error', '密码不能为空');
		return false;
	}
	if(val.length<8 || val.length>40){
		showValidResult(id, 'error', '密码格式不对');
		return false;
	}
	if(!valPattern.test(val)){
		showValidResult(id, 'error', '密码格式不对');
		return false;
	}
	showValidResult(id, 'success', '');

	var level = verifyPasswordLevel(val);
	showPwdLevelIco(safeLevelId, level)
	return true;
}

// 确认密码
function verifyPasswordAgain(id1, id2) {
	var pass1v = $('#'+id1+'').val();
	var pass2v = $('#'+id2+'').val();
	if(pass2v == ''){
		showValidResult(id2, 'error', '确认密码不能为空');
		return false;
	}
    if(pass2v.length<8 || pass2v.length>40){
        showValidResult(id2, 'error', '确认密码格式不对');
        return false;
    }else if(pass1v == pass2v){
        showValidResult(id2, 'success', '');
        return true;
    }else{
        showValidResult(id2, 'error', ' 两次输入的密码不一致');
        return false;
    }

}

/**
 * 检查密码安全等级 (8-40位)
 * @param password
 * @return 返回安全等级数字
 */
function verifyPasswordLevel(s){
	var ls = 0;
	if (s.length < 8){
		return 0;
	}
	if (s.match(/[a-z]/ig)){
		ls++;
	}
	if (s.match(/[0-9]/ig)){
		ls++;
	}
 	if (s.match(/(.[^a-z0-9])/ig)){
		ls++;
	}
    if(s.length > 30){
        ls++;
    }
	if (s.length < 8 && ls > 1){
		ls--;
	}
	if (s.length >= 18 && ls == 2){
		ls++;
	}
   /* if(s.length<8){
        ls=0;
    }else if(s.length <18){
        ls=1;
    }else if(s.length <30){
        ls=2;
    }else if(s.length <40){
        ls=3;
    }*/
	return ls;
}

// 校验是否已经接受协议
function verifyAccept(id) {
	if($('#' + id).is(':checked')) {
		showValidResult(id, 'success', '');
		return true;
	} else {
		showValidResult(id, 'error', ' 您还没有接受协议');
		return false;
	}
}

//去除空格
function TrimStr(str){
	if (str == null) {
		return str
	}
	return str = str.replace(/^\s+|\s+$/g,"");
}

//验证是否为空
function verifyIsNull(str, msg) {
	var flag = false;
	str = TrimStr(str);//去掉空格
	if(str == '') {
		flag = true;
	}
	return flag;
}

// 显示校验结果提示
function showValidResult(id, type, msg) {
	var arr = id.split('_');
	var ico_id = 'ico',
		msg_id = 'msg';
	for(var i=1;i<arr.length;i++) {
		ico_id += '_' + arr[i];
		msg_id += '_' + arr[i];
	}
	showValidIco(ico_id, type);
	showValidMsg(msg_id, msg);
}

/**
 * [showValidIco 显示校验图标ico]
 * @return {[type]} [description]
 */
function showValidIco(id, type) {
	var $obj = $('#' + id);
	if(type == 'warn') {
		$obj.attr('class', 'warn png');
	} else if(type == 'error') {
		$obj.attr('class', 'error png');
	} else if(type == 'success') {
        if(boor){
            $obj.removeClass('error');
        }else{
            $obj.attr('class', 'ok png');
        }

	} else {
		$obj.addClass('hide');
	}
}

/**
 * [showValidMsg 显示校验提示语]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function showValidMsg(id, msg) {
	$('#' + id).text(msg);
}

/**
 * [showPwdLevelIco 显示密码安全等级]
 * @param  {[type]} id    [description]
 * @param  {[type]} level [1:低级，2：中级，3：高级]
 * @return {[type]}       [description]
 */
function showPwdLevelIco(id, level) {
	var $obj = $('#' + id);
	if(level == 0) {
		$obj.addClass('hide');
	} else {
		$obj.removeClass('hide')
			.find('em').eq(level - 1).addClass('cur').siblings().removeClass('cur');
	}
}