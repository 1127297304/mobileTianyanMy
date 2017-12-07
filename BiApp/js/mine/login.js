(function($, doc,$$) {
	
	$.init({
		swipeBack: false//关闭右滑关闭功能
	})
	
	//点击记住密码 切换样式
	$$("#autoLogin").on("tap",function(){
		$$(this).toggleClass("focusOn");
	})
	
	//如果之前记过密码则打开页面时自动填写在输入框中
	var winL=window.localStorage;
	if(winL.getItem("name") && winL.getItem("pwd")){
		$$("#account").val(winL.getItem("name"));
		$$("#password").val(winL.getItem("pwd"));
		$$("#autoLogin").addClass("focusOn");
	}
	
	//登录成功后的跳转页面
	var toMain = function() {
		setTimeout(function() {
			$.openWindow({
				id: 'main',
				url: "main.html",
				show: {
					aniShow: 'slide-in-right'
				},
				waiting: {
					autoShow: false
				}
			});
		}, 0);
	};
		
	//获取登录手机的sid码
	function GetQueryString(name)
	{
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	// 调用方法
	// sid
	var sid = GetQueryString("sid");
	// 版本号
	var bbh = GetQueryString("bbh");
	
	if( bbh !=null && bbh.length !=0 ){
		//打开页面后先发送请求看是否需要弹出提示信息
		$$.ajaxData({
			newUrl:"/message/getXtgg.gm",
			data:{
	            sid:sid,
				bbh:bbh
			},
			type:"get",
			dataType:"json",
			callback:function(e){
				if(e.data.datainfo.length != 0){
					var text = e.data.datainfo[0].vcMsgmc;
					mui.alert(text, '提示', function() {
						//回调函数
						//info.innerText = '你刚关闭了警告框';
					});
				}
			}
		})
	}
		
	//获取按钮元素
	var loginButton = doc.getElementById('login');//登录按钮
	var accountBox = doc.getElementById('account');//账号名
	var passwordBox = doc.getElementById('password');//密码
	var autoLoginButton = doc.getElementById("autoLogin");//记住密码
	loginButton.addEventListener('tap', function(event) {
		this.setAttribute("disabled",true);
		var loginInfo = {
			account: accountBox.value,
			password: passwordBox.value
		};
		//用户名和密码不为空时发送请求
		if(loginInfo.account!="" && loginInfo.password!=""){
			
			//发送ajax请求
			$$.ajaxData({
				newUrl:"/dologin.gm",
				type:"post",
				dataType:"json",
				data:{
					userName:loginInfo.account,
					userPwd:loginInfo.password,
					sid:sid,
					bbh:bbh
				},
				callback:function(e){
					
					if(e.responseMess == "10000"){
						winL.setItem("sid",sid);//存入设备号
						winL.setItem("bbh",bbh);//存入版本号
						winL.setItem("username",loginInfo.account);//存储用户名 以便展示在菜单页
						//登录成功后将用户信息存储在本地
						if($$("#autoLogin").hasClass("focusOn")){
							winL.setItem("name",loginInfo.account);
							winL.setItem("pwd",loginInfo.password);
						}
						else{
							winL.setItem("name",'');
							winL.setItem("pwd",'');
						}
						toMain();
						
					}
					/*else{
						var strMessage;
						switch(e.responseMess)
						{
							case 10001:
							  strMessage='未获取到sid';
							  break;
							case 10002:
							  strMessage='当前设备已绑定账号';
							  break;
						  	case 10003:
							  strMessage='该账号已在其它设备上绑定';
						  	  break;
							case 10004:
							  strMessage='用户名或密码错误';
							  break;
							case 10005:
							  strMessage='用户不存在';
							  break;
							case 10006:
							  strMessage='用户已处在被禁用状态';
							  break;
							case 10007:
							  strMessage='更新sid失败';
							case 10008:
							  strMessage='没有权限访问此系统';
							  break;
							case 10009:
							  strMessage='没有配置此用户';
							  break;
							case 10010:
							  strMessage='oa系统维护中';
							  break;
							default:
							  strMessage='';
						}
						mui.toast(strMessage+'<br>'+"如有疑问请联系管理员");
					}*/
				}
			})
		}
		else{
			mui.toast("用户名和密码不能为空");
			$$("#login").attr("disabled",false);
		}						
	});

}(mui, document,jQuery));