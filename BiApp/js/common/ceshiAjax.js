;(function($,$$){
	var askForAjax=function(options){
		var defaults={
			newUrl:null,
			type:"get",
			dataType:"json",
			data:null,
			callback:null
		}
		
		//扩展参数
		var newOption=$.extend({},defaults,options);
		
		//设置全局变量存储请求的数据
		var globalData;
		
		function getUuid(){
			var len=32;//32长度
			var radix=16;//16进制
			var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var uuid=[],i;
			radix=radix||chars.length;
			if(len){
				for(i=0;i<len;i++)
				uuid[i]=chars[0|Math.random()*radix];
			}
			else{
				var r;
				uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';
				uuid[14]='4';
				for(i=0;i<36;i++){
					if(!uuid[i]){
						r=0|Math.random()*16;
						uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];
					}
				}
			}
			return uuid.join('');
		};
		//console.log(getUuid());
		var uuNum=getUuid();//生成的随机数
		var sid=window.localStorage.getItem("sid");//获取本地存储中登录成功后的sid
		var sblx=window.localStorage.getItem("sblx");//获取本地存储中登录成功后的sblx
		var bbh=window.localStorage.getItem("bbh");//获取本地存储中登录成功后的bbh
		var path;//url中的前缀
		
		$.ajax({
			url:"/app"+newOption.newUrl+"?uuid="+uuNum,
			//url:newOption.newUrl+"?uuid="+uuNum,
			type:newOption.type,
			dataType:newOption.dataType,
			data:newOption.data,
			success:function(e){
				if(e.code == 200 && e.data.status =="ok"){
					globalData=e;
					newOption.callback&&newOption.callback(globalData);
				}
				else if(e.code == 203 && e.data.status == "ok"){
					if(window.document.location.pathname.indexOf('pages'))
					{
						path='../../';
					}
					else{
						path='';
					}
					$$.openWindow({
						id: 'newCode',
						url : path+'login.html?sid='+sid+'&sblx='+sblx+'&bbh='+bbh,
						show: {
							aniShow: 'pop-in'
						},
						styles: {
							popGesture: 'hide'//设置侧滑返回
						},
						waiting: {
							autoShow: false
						}
					});
				}
				else if(e.code == 555 && e.data.status == "ok"){
					window.location.href="./IOS.html";
				}
				else if(e.code == 556 && e.data.status == "ok"){
					window.location.href="./Android.html";
				}
				else if(/^100/.test(e.code)){
					$$.toast(e.msg+'<br>'+"如有疑问请联系管理员");
					$("#login").attr("disabled",false);
				}
				else if(e.data.status == "ok"){
					
					//遮罩消失
					$('.mask').css('display','none');
					$("#login").attr("disabled",false);
					$$.toast("数据加载异常");
				}
			},
			error:function(){
				console.log("请求失败");
				
				//遮罩消失
				$('.mask').css('display','none');
				
				//提示
				$$.toast("数据加载异常");
				$("#login").attr("disabled",false);
				if($(".popLoadingBlock")){
					//如果美易车页面的城市详情接口加载失败	则需隐藏
					$(".popLoadingBlock").hide();
				}
			}
		})
		
	}
	
	//封装弹出框插件
	$.ajaxData=function(opt){
		return new askForAjax(opt);
	}
})(jQuery,mui)
