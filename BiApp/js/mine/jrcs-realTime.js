;(function($,$$,doc){
	$.init({
		swipeBack: false//关闭右滑关闭功能
	})
	
	//全局变量
	var ssObj , yhdtObj , userDateObj=[[]], basicObj, cpdtObj, cpdtObjYg;//图表部分	cpdtObj	产品端动态-超推不同维度的数据	cpdtObjYg	产品端动态-员工不同维度的数据	
	//	ssObj 初始请求的总数据  yhdtObj 用户端动态-超推不同维度的数据		userDateObj	用户端-超推选择日期的对象	basic代表数值部分对象
	var yhdtObjYg, userDateObjYg=[[]];//yhdtObjYg 用户端动态-员工不同维度的数据	userDateObjYg 用户端-员工选择日期的对象
	var	onlyYMDate;//只有年-月-日的日期格式
	var rtDayBefore;//当天的前一天
	var moneyMax,moneyMin;//地域分布-投资金额最大值
	var peopleMax,peopleMin;//地域分布-投资人数最大值
	var timerTop=null;//定时器
	var showTimeCt;//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
	var showTimeYg;//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
	
	//统计页面列表添加局部滚动
	mui('.mui-scroll-wrapper').scroll();
	
	//顶部时间实时更新(每分钟刷新一次)
	showRealTime();//初始加载时调用一次
	
	//页面初始请求数据（传参：请求时的时间）
	sendDataTime();
	
	//定时器一秒调用一次
	timerTop=setInterval(function(){
		showRealTime();
	},1000)
	
	//注释以备点击右上角问号时跳转至指标说明页面
	/*$$(".backToMenu").on("tap",function(){
		$.openWindow({
			id: 'menu',
			url: "../../main.html?uuid="+uuNum,
			styles: {
				popGesture: "none"
			},
			show: {
				aniShow: "slide-in-right"
			},
			waiting: {
				autoShow:false,//自动显示等待框，默认为true
				title:'正在加载...',//等待对话框上显示的提示内容
				options:{
					//background:''
				}
			}
		})
	})*/
	
	
	//顶部时间实时更新
	function showRealTime(){
		//不足两位时补“0”
		//获取当地时间
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();//当天
		var hour = date.getHours(); //小时
		var min = date.getMinutes(); //分
		var sen = date.getSeconds(); //秒
		var showDate=year+"-"+(month<10 ? "0" + month : month)+"-"+(day<10 ? "0"+ day : day)+" "+(hour<10 ? "0"+ hour : hour)+":"+(min<10 ? "0" + min : min)+":"+(sen<10 ? "0" + sen : sen);//当前的时间
		
		//显示在页面中
		$$("#showNowDate").text(showDate);
	}
	
	//页面初始请求数据
	function sendDataTime(){
		
		//获取当前时间
		onlyYMDate= GetDateStr(0);
		
		//获取当前前一天的日期
		rtDayBefore = GetDateStr(-1);
		showTimeCt = rtDayBefore;//未选择符合范围内的日期时	默认存储当前前一天的日期
		showTimeYg = rtDayBefore;//未选择符合范围内的日期时	默认存储当前前一天的日期

		//获取当前的时间请求数据
		rtAskforDate();
		
	}
	
	//每隔30s请求一次数据
	/*var timerSelect = null;
	timerSelect=setInterval(function(){
		
			sendDataTime();
		
	},30000)*/
	
	//计算当日前一天的方法
	function GetDateStr(AddDayCount) { 
		var dd = new Date(); 
		dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
		var y = dd.getFullYear(); 
			m = dd.getMonth()+1;//获取当前月份的日期
		var d = dd.getDate(); 
		return y+"-"+(m<10 ? "0"+m : m)+"-"+(d<10 ? "0"+d : d); 
	}
	
	//请求实时数据
	function rtAskforDate(){
		
		//调用请求ajax的插件
		$$.ajaxData({
			newUrl:"/jinrongchaoshi/getJinRongChaoShiRealTimeModel.gm",
			//newUrl:"../../js/mine/mjwbt.json",
			data:{
				rdate:onlyYMDate
			},
			callback:function(data){
				
				ssObj = data.data.datainfo.contrastInfo;//图表部分的全局变量
				basicObj = data.data.datainfo.baseInfo;//基础数值部分的全局变量
				//格式化所有数值部分的金额
				$$.each(basicObj,function(i,val){
					$$.each(val,function(j,ele){
						if(ele == null){
							basicObj[i][j] = '-';
						}else{
							basicObj[i][j] = outputmoney(ele.toString());
						}
					})
				})
				
				//顶部渲染Vue
				randerTopVue(basicObj);
				
				//用户动态-超推对象	//今 选 横轴
				yhdtObj={
					"zc":[
						[ssObj.yhddt.ctYhddt["注册用户数"].jryhsList,ssObj.yhddt.ctYhddt["注册用户数"].tryhsList,ssObj.yhddt.ctYhddt["注册用户数"].timeList]
					],
					"hy":[
						[ssObj.yhddt.ctYhddt["活跃用户数"].jryhsList,ssObj.yhddt.ctYhddt["活跃用户数"].tryhsList,ssObj.yhddt.ctYhddt["活跃用户数"].timeList]
					],
					"cz":[
						[ssObj.yhddt.ctYhddt["充值用户数"].jryhsList,ssObj.yhddt.ctYhddt["充值用户数"].tryhsList,ssObj.yhddt.ctYhddt["充值用户数"].timeList]
					],
					"tz":[
						[ssObj.yhddt.ctYhddt["投资用户数"].jryhsList,ssObj.yhddt.ctYhddt["投资用户数"].tryhsList,ssObj.yhddt.ctYhddt["投资用户数"].timeList]
					],
					"tx":[
						[ssObj.yhddt.ctYhddt["提现用户数"].jryhsList,ssObj.yhddt.ctYhddt["提现用户数"].tryhsList,ssObj.yhddt.ctYhddt["提现用户数"].timeList]
					],
					"tzje":[
						[ssObj.yhddt.ctYhddt["投资金额"].jryhsList,ssObj.yhddt.ctYhddt["投资金额"].tryhsList,ssObj.yhddt.ctYhddt["投资金额"].timeList]
					],
					"czje":[
						[ssObj.yhddt.ctYhddt["充值金额"].jryhsList,ssObj.yhddt.ctYhddt["充值金额"].tryhsList,ssObj.yhddt.ctYhddt["充值金额"].timeList]
					],
					"txje":[
						[ssObj.yhddt.ctYhddt["提现金额"].jryhsList,ssObj.yhddt.ctYhddt["提现金额"].tryhsList,ssObj.yhddt.ctYhddt["提现金额"].timeList]
					]
				};
				
				//不进行维度选择时默认存入今日的
				//userDateObj[0][0]=yhdtObj.zc[0][0];
				userDateObj[0][3]='zc';
				
				//用户动态-员工对象	//今 选 横轴
				yhdtObjYg={
					"zc":[
						[ssObj.yhddt.ygYhddt["注册用户数"].jryhsList,ssObj.yhddt.ygYhddt["注册用户数"].tryhsList,ssObj.yhddt.ygYhddt["注册用户数"].timeList]
					],
					"hy":[
						[ssObj.yhddt.ygYhddt["活跃用户数"].jryhsList,ssObj.yhddt.ygYhddt["活跃用户数"].tryhsList,ssObj.yhddt.ygYhddt["活跃用户数"].timeList]
					],
					"cz":[
						[ssObj.yhddt.ygYhddt["充值用户数"].jryhsList,ssObj.yhddt.ygYhddt["充值用户数"].tryhsList,ssObj.yhddt.ygYhddt["充值用户数"].timeList]
					],
					"tz":[
						[ssObj.yhddt.ygYhddt["投资用户数"].jryhsList,ssObj.yhddt.ygYhddt["投资用户数"].tryhsList,ssObj.yhddt.ygYhddt["投资用户数"].timeList]
					],
					"tx":[
						[ssObj.yhddt.ygYhddt["提现用户数"].jryhsList,ssObj.yhddt.ygYhddt["提现用户数"].tryhsList,ssObj.yhddt.ygYhddt["提现用户数"].timeList]
					],
					"tzje":[
						[ssObj.yhddt.ygYhddt["投资金额"].jryhsList,ssObj.yhddt.ygYhddt["投资金额"].tryhsList,ssObj.yhddt.ygYhddt["投资金额"].timeList]
					],
					"czje":[
						[ssObj.yhddt.ygYhddt["充值金额"].jryhsList,ssObj.yhddt.ygYhddt["充值金额"].tryhsList,ssObj.yhddt.ygYhddt["充值金额"].timeList]
					],
					"txje":[
						[ssObj.yhddt.ygYhddt["提现金额"].jryhsList,ssObj.yhddt.ygYhddt["提现金额"].tryhsList,ssObj.yhddt.ygYhddt["提现金额"].timeList]
					]
				};
				
				//不进行维度选择时默认存入今日的
				//userDateObjYg[0][0]=yhdtObjYg.zc[0][0];
				userDateObjYg[0][3]='zc';
				
			/*第二块*/
				var curIndTwo = $$(".secondCont .active").index();
				var echartIdTwo = $$(".secondCont .tabBlockDetail>div").eq(curIndTwo).find(".echartDetail").attr("id");
				$$("#calendarsYg").val(rtDayBefore);
				switch(echartIdTwo)
				{
					case "yhdt":
						//用户端动态-超推
							$$("#calendars").val(rtDayBefore);
							$$("#userResult").text("注册用户数");
							userCondition(yhdtObj.zc,rtDayBefore);
						break;
					case "yhdtYg":
						//用户端动态-员工
							$$("#userResultYg").text("注册用户数");
							userConditionYg(yhdtObjYg.zc,rtDayBefore);
						break;
				}
				
				//产品端动态-超推对象	//横轴	利率1	利率2	利率3	利率4	单位
				cpdtObj={
					"tze":[
						[ssObj.cpddt.ctCpddt["投资额"].lessSixList,ssObj.cpddt.ctCpddt["投资额"].lessEightList,ssObj.cpddt.ctCpddt["投资额"].lessTenList,ssObj.cpddt.ctCpddt["投资额"].moreTenList,"(万元)"]
					],
					"tzrs":[
						[ssObj.cpddt.ctCpddt["投资人数"].lessSixList,ssObj.cpddt.ctCpddt["投资人数"].lessEightList,ssObj.cpddt.ctCpddt["投资人数"].lessTenList,ssObj.cpddt.ctCpddt["投资人数"].moreTenList,"(人数)"]
					],
					"tzbs":[
						[ssObj.cpddt.ctCpddt["投资笔数"].lessSixList,ssObj.cpddt.ctCpddt["投资笔数"].lessEightList,ssObj.cpddt.ctCpddt["投资笔数"].lessTenList,ssObj.cpddt.ctCpddt["投资笔数"].moreTenList,"(笔数)"]
					]
				};
				
				//产品端动态-员工对象	//横轴	利率1	利率2	利率3	利率4	单位
				cpdtObjYg={
					"tze":[
						[ssObj.cpddt.ygCpddt["投资额"].lessSixList,ssObj.cpddt.ygCpddt["投资额"].lessEightList,ssObj.cpddt.ygCpddt["投资额"].lessTenList,ssObj.cpddt.ygCpddt["投资额"].moreTenList,"(万元)"]
					],
					"tzrs":[
						[ssObj.cpddt.ygCpddt["投资人数"].lessSixList,ssObj.cpddt.ygCpddt["投资人数"].lessEightList,ssObj.cpddt.ygCpddt["投资人数"].lessTenList,ssObj.cpddt.ygCpddt["投资人数"].moreTenList,"(人数)"]
					],
					"tzbs":[
						[ssObj.cpddt.ygCpddt["投资笔数"].lessSixList,ssObj.cpddt.ygCpddt["投资笔数"].lessEightList,ssObj.cpddt.ygCpddt["投资笔数"].lessTenList,ssObj.cpddt.ygCpddt["投资笔数"].moreTenList,"(笔数)"]
					]
				};
				
			/*第三块*/
				var curIndThree = $$(".thirdCont .active").index();
				var echartIdThree = $$(".thirdCont .tabBlockDetail>div").eq(curIndThree).find(".echartDetail").attr("id");
				
				switch(echartIdThree)
				{
					case "stzb":
						//产品端动态-超推
						$$("#productResult").text("投资额");
						productCondition(cpdtObj.tze);
						break;
					case "stzbYg":
						//产品端动态-员工
						$$("#productResultYg").text("投资额");
						productConditionYg(cpdtObjYg.tze);
						break;
				}
				
			/*第四块*/
				//地域分布-投资金额
				moneyMax = Number(ssObj.tzxxfb.moneyRange.max);//地图数据中的最大值
				moneyMin = Number(ssObj.tzxxfb.moneyRange.min);//地图数据中的最大值
				//地域分布-投资人数
				peopleMax = Number(ssObj.tzxxfb.peopleRange.max);//地图数据中的最大值
				peopleMin = Number(ssObj.tzxxfb.peopleRange.min);//地图数据中的最大值
				
				var curIndFour = $$(".fourthCont .active").index();
				var echartIdFour = $$(".fourthCont .tabBlockDetail>div").eq(curIndFour).find(".echartDetail").attr("id");
				
				switch(echartIdFour)
				{
					case 'dytzje':
					  //地域分布-投资金额
						areaInvestMoney(ssObj.tzxxfb.tzjefb,moneyMax,moneyMin);
					  break;
					case 'dytzrs':
					  //地域分布-投资人数
						areaInvestPeople(ssObj.tzxxfb.tzrsfb,peopleMax,peopleMin);
					  break;
				  	
				}
				
				//遮罩消失
				$$('.mask').css('display','none');

			}
		})
	}
	
	//生成随机数
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
		
	var uuNum=getUuid();//生成的随机数
	
	//顶部渲染
	var myvue=new Vue();//借助第三方vue用来传值
	function randerTopVue(obj){
		//使金额按字体大小区分显示
		/*var itemValue = outputmoney(ssObj.realTimeInvestAmount.toString());//获取投资金额格式化后的值
		var before = itemValue.slice(0,itemValue.indexOf('.'));//截取投资金额小数点以前的金额
		var after = itemValue.slice(itemValue.indexOf('.'));//截取投资金额小数点以后的金额*/
		//请求成功后传递数据
		myvue.$emit('topAreaData',obj);
	}
	//顶部渲染vue
	new Vue({
		el: "#topArea",
		data: {
			baseObj: ''
		},
		mounted: function(){
			var that = this;
			myvue.$on('topAreaData', function(obj){
				that.baseObj = obj;
			})
		}
	})
	
	/****************************************格式化金额 *********************************************/
	function outputmoney(number) {
		number = number.replace('/\,/g', "");
		if(isNaN(number) || number == "")return "";
		number = Math.round(number * 100) / 100;
	    if (number < 0){
	        if(number%1 == 0){
				return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '');
			}else{
				return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
			}
		}
	    else{
	        if(number%1 == 0){
				return outputdollars(Math.floor(number - 0) + '');
			}else{
				return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
			}
		}
	}
	//格式化金额
	function outputdollars(number) {
	    if (number.length <= 3)
	        return (number == '' ? '0' : number);
	    else {
	        var mod = number.length % 3;
	        var output = (mod == 0 ? '' : (number.substring(0, mod)));
	        for (i = 0; i < Math.floor(number.length / 3); i++) {
	            if ((mod == 0) && (i == 0))
	                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
	            else
	                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
	        }
	        return (output);
	    }
	}
	function outputcents(amount) {
	    amount = Math.round(((amount) - Math.floor(amount)) * 100);
	    return (amount < 10 ? '.0' + amount : '.' + amount);
	}
	
	/****************************************格式化金额结束 *********************************************/
	
	
	/***********************************************下拉刷新*******************************************/
	
	$$('.mui-content').dropload({
        scrollArea : window,
        domUp : {
            domClass   : 'dropload-up',
            domRefresh : '<div class="dropload-refresh">↓&nbsp;&nbsp;下拉刷新	ლ(⌒▽⌒ლ)</div>',
            domUpdate  : '<div class="dropload-update">↑&nbsp;&nbsp;释放更新	ᕙ(˵◕ω◕˵✿)つ</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...٩(◕‿◕｡)۶</div>'
        },
        loadUpFn : function(me){
        	
        	//获取当前的时间重新请求数据
			rtAskforDate();
			
        	me.resetload();
        },
        threshold : 50
    });
    
/****************************************下拉刷新结束***************************************************/	
	
	//日期选择	用户端动态-超推
	realTimeSelect();
	
	//日期选择	用户端动态-员工
	realTimeSelectYg()
	
	//secondCont选项卡切换
	tabChangeSecond();
	
	//thirdCont选项卡切换
	tabChangeThird();
	
	//fourthCont选项卡切换
	tabChangeFourth();
	
	//用户端动态-超推指标选择
	stzbCh();
	
	//用户端动态-员工指标选择
	stzbChYg();
	
	//产品端动态-超推指标选择
	stzbSelect();
	
	//产品端动态-员工指标选择
	stzbSelectYg();
	
	//指标说明弹框
	tipsExplain();
	
		//secondCont选项卡切换
		function tabChangeSecond(){
			var parentBox = $$(".secondCont .tableTitle");
			var subItem = parentBox.find("a");
			subItem.on("tap",function(){
				var curInd = $$(this).index();
				$$(this).addClass("active").siblings("a").removeClass("active mui-active");
				$$(".secondCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
				
				//加载对应的图表
				var href = $$(".secondCont .tabBlockDetail>div:eq("+curInd+")").find(".echartDetail").attr("id");
				
				switch(href)
				{
					case "yhdt":
						//用户端动态-超推
						var nowDate = $$("#calendars").val();
						var nowVal = $$("#userResult").attr("data-value");
						userCondition(yhdtObj[nowVal],nowDate);
						break;
					case "yhdtYg":
						//用户端动态-员工
						var nowDateTotal = $$("#calendarsYg").val();
						var nowValTotal = $$("#userResultYg").attr("data-value");
						userConditionYg(yhdtObjYg[nowValTotal],nowDateTotal);
						break;
				}
				
			})
		}
		
		//thirdCont选项卡切换
		function tabChangeThird(){
			var parentBox = $$(".thirdCont .tableTitle");
			var subItem = parentBox.find("a");
			subItem.on("tap",function(){
				var curInd = $$(this).index();
				$$(this).addClass("active").siblings("a").removeClass("active mui-active");
				$$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
				
				//加载对应的图表
				var href = $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").find(".echartDetail").attr("id");

				switch(href)
				{
					case "stzb":
						//产品端动态-超推
						var curCh = $$("#productResult").attr("data-value");
						productCondition(cpdtObj[curCh]);
						break;
					case "stzbYg":
						//产品端动态-员工
						var curChYg = $$("#productResultYg").attr("data-value");
						productConditionYg(cpdtObjYg[curChYg]);
						break;
				}
				
			})
		}
		
		//fourthCont选项卡切换
		function tabChangeFourth(){
			var parentBox = $$(".fourthCont .tableTitle");
			var subItem = parentBox.find("a");
			subItem.on("tap",function(){
				var curInd = $$(this).index();
				$$(this).addClass("active").siblings("a").removeClass("active mui-active");
				$$(".fourthCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
				//加载对应的图表
				var href = $$(".fourthCont .tabBlockDetail>div:eq("+curInd+")").find(".echartDetail").attr("id");
				switch(href)
				{
					case 'dytzje':
					  //地域分布-投资金额
						areaInvestMoney(ssObj.tzxxfb.tzjefb,moneyMax,moneyMin);
					  break;
					case 'dytzrs':
					  //地域分布-投资人数
						areaInvestPeople(ssObj.tzxxfb.tzrsfb,peopleMax,peopleMin);
					  break;
				}
				
			})
		}
	
		//用户端动态-超推
		function stzbCh(){
				
				var userPicker = new $.PopPicker();
				var data=[{
					value: 'zc',
					text: '注册用户数'
				}, {
					value: 'hy',
					text: '活跃用户数'
				}, {
					value: 'cz',
					text: '充值用户数'
				}, {
					value: 'tz',
					text: '投资用户数'
				}, {
					value: 'tx',
					text: '提现用户数'
				}, {
					value: 'tzje',
					text: '投资金额'
				}, {
					value: 'czje',
					text: '充值金额'
				}, {
					value: 'txje',
					text: '提现金额'
				}];
				userPicker.setData(data);
				var showUserPickerButton = doc.getElementById('showUserPicker');
				var userResult = doc.getElementById('userResult');
				showUserPickerButton.addEventListener('tap', function(event) {
					userPicker.show(function(items) {
						userResult.innerText = items[0].text;
						//返回 false 可以阻止选择框的关闭
						//return false;
						var dataValue=items[0].value;
						userResult.setAttribute("data-value",dataValue);
						//console.log(yhdtObj[dataValue])
						//为选择日期做准备
						//userDateObj[0][0]=yhdtObj[dataValue][0][0];
						userDateObj[0][3]=dataValue;
						//维度改变时图表改变	用户端动态-超推
						userCondition(yhdtObj[dataValue],showTimeCt);
	
						
					});
				}, false);
		}
		
		//用户端动态-员工
		function stzbChYg(){
				
				var userPicker = new $.PopPicker();
				var data=[{
					value: 'zc',
					text: '注册用户数'
				}, {
					value: 'hy',
					text: '活跃用户数'
				}, {
					value: 'cz',
					text: '充值用户数'
				}, {
					value: 'tz',
					text: '投资用户数'
				}, {
					value: 'tx',
					text: '提现用户数'
				}, {
					value: 'tzje',
					text: '投资金额'
				}, {
					value: 'czje',
					text: '充值金额'
				}, {
					value: 'txje',
					text: '提现金额'
				}];
				userPicker.setData(data);
				var showUserPickerButton = doc.getElementById('showUserPickerYg');
				var userResult = doc.getElementById('userResultYg');
				showUserPickerButton.addEventListener('tap', function(event) {
					userPicker.show(function(items) {
						userResult.innerText = items[0].text;
						//返回 false 可以阻止选择框的关闭
						//return false;
						var dataValue=items[0].value;
						userResult.setAttribute("data-value",dataValue);
						//console.log(yhdtObjYg[dataValue])
						//为选择日期做准备
						//userDateObjYg[0][0]=yhdtObjYg[dataValue][0][0];
						userDateObjYg[0][3]=dataValue;
						//维度改变时图表改变	用户端动态-员工
						userConditionYg(yhdtObjYg[dataValue],showTimeYg);
						
					});
				}, false);
		}
		
		//产品端动态-超推指标选择
		function stzbSelect(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: 'tze',
				text: '投资额'
			}, {
				value: 'tzrs',
				text: '投资人数'
			}, {
				value: 'tzbs',
				text: '投资笔数'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showProductPicker');
			var userResult = doc.getElementById('productResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					productCondition(cpdtObj[items[0].value])
				});
			}, false);	
		}
		
		//产品端动态-员工指标选择
		function stzbSelectYg(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: 'tze',
				text: '投资额'
			}, {
				value: 'tzrs',
				text: '投资人数'
			}, {
				value: 'tzbs',
				text: '投资笔数'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showProductPickerYg');
			var userResult = doc.getElementById('productResultYg');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value);
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					productConditionYg(cpdtObjYg[items[0].value])
				});
			}, false);	
		}
		
		//指标说明弹框
	    function tipsExplain(){
	    	//用户分析指标说明
	    	$$("#financialRealTimeDataQues").on("click",function(){
	    		$$("#financialRealTimeDataBox").show();
	    		//弹框出现时页面禁止滚动
	    		$$(".mui-content").css({
	    			"width":"100%",
	    			"height":"100%"
	    		})
	    		$$(".mui-content")[0].style.overflow = 'hidden';
	    		document.body.style.overflow = 'hidden';
	    	})
	    	$$("#financialRealTimeDataClose").on("click",function(){
	    		$$("#financialRealTimeDataBox").hide();
	    		//弹框关闭时页面恢复滚动
	    		$$(".mui-content").css({
	    			"width":"initial",
	    			"height":"initial"
	    		})
	    		$$(".mui-content")[0].style.overflow = 'scroll';
	    		document.body.style.overflow = 'scroll';
	    	})
	    	
	    }
		
		//日期选择	用户端动态-超推
		function realTimeSelect(){
			$$("#calendars").on("change",function(){
				
				var curDate = $$(this).val();
						
				//在此获取选择的日期重新发送请求
				if((new Date(curDate) >= new Date("2017-04-13")) && (new Date(curDate) < new Date(onlyYMDate))){
					showTimeCt = curDate;//当前页面显示的日期永远是符合时间范围内的日期
					
					$$.ajaxData({
						newUrl:"/jinrongchaoshi/getJinRongChaoShiRealTimeYhddt.gm",
						data:{
							edate: curDate
						},
						callback:function(data){
							
							var changeDateObj={
									'zc':data.data.datainfo.CT["注册用户数"].tryhsList,
									'hy':data.data.datainfo.CT["活跃用户数"].tryhsList,
									'cz':data.data.datainfo.CT["充值用户数"].tryhsList,
									'tz':data.data.datainfo.CT["投资用户数"].tryhsList,
									'tx':data.data.datainfo.CT["提现用户数"].tryhsList,
									'tzje':data.data.datainfo.CT["投资金额"].tryhsList,
									'czje':data.data.datainfo.CT["充值金额"].tryhsList,
									'txje':data.data.datainfo.CT["提现金额"].tryhsList
							};
							
							$$.each(changeDateObj,function(i,val){
								yhdtObj[i][0][1] = val;
							})
							
							//今 选 横轴
							//userDateObj[0][1]=chDateObj;
							//userDateObj[0][2]=ssObj.yhddt.ygYhddt["注册用户数"].timeList;//任意哪个维度的时间均可
							//console.log(userDateObj)
						
							//维度改变时图表改变	用户端动态-超推
							userCondition(yhdtObj[userDateObj[0][3]],curDate);
							
						}
						
					})
		
				}
				else{
					mui.toast('不在可支持的统计时间范围内');
					$$(this).val(showTimeCt);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			});
		}
		
		//日期选择	用户端动态-员工
		function realTimeSelectYg(){
			$$("#calendarsYg").on("change",function(){
				
				var curDate = $$(this).val();
						
				//在此获取选择的日期重新发送请求
				if((new Date(curDate) >= new Date("2017-04-13")) && (new Date(curDate) < new Date(onlyYMDate))){
					showTimeYg = curDate;//当前页面显示的日期永远是符合时间范围内的日期
					
					$$.ajaxData({
						newUrl:"/jinrongchaoshi/getJinRongChaoShiRealTimeYhddt.gm",
						data:{
							edate: curDate
						},
						callback:function(data){
							
							var changeDateObj={
									'zc':data.data.datainfo.YG["注册用户数"].tryhsList,
									'hy':data.data.datainfo.YG["活跃用户数"].tryhsList,
									'cz':data.data.datainfo.YG["充值用户数"].tryhsList,
									'tz':data.data.datainfo.YG["投资用户数"].tryhsList,
									'tx':data.data.datainfo.YG["提现用户数"].tryhsList,
									'tzje':data.data.datainfo.YG["投资金额"].tryhsList,
									'czje':data.data.datainfo.YG["充值金额"].tryhsList,
									'txje':data.data.datainfo.YG["提现金额"].tryhsList
							};
							
							$$.each(changeDateObj,function(i,val){
								yhdtObjYg[i][0][1] = val;
							})
							
							//今 选 横轴
							//userDateObjYg[0][1]=chDateObj;
							//userDateObjYg[0][2]=ssObj.yhddt.ygYhddt["注册用户数"].timeList;//任意哪个维度的时间均可
							//console.log(userDateObjYg)
						
							//维度改变时图表改变	用户端动态-员工
							userConditionYg(yhdtObjYg[userDateObjYg[0][3]],curDate);
							
						}
						
					})
		
				}
				else{
					mui.toast('不在可支持的统计时间范围内');
					$$(this).val(showTimeYg);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			});
		}
		
		//用户端动态-超推图表
		function userCondition(obj,rtDayBefore){
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('yhdt'));
		    
		    var option = {
			    tooltip: {
			        trigger: 'axis',
			        confine: true,
			        backgroundColor: 'rgba(87,106,118,0.7)'
			    },
			    legend: {
			        data:['今日',rtDayBefore],
			        itemWidth:15,
			        itemHeight:10,
			        /*selectedMode:false,*/
			        textStyle:{
			            fontSize: 10,
			            color: '#929292'
			        },
			        bottom:'2%'
			    },
			    grid: {
			    	top:'15%',
			    	bottom:'15%',
			        left: '3%',
			        right: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: obj[0][2],
			        axisTick:{
		                show:false
		            },
		            axisLine:{
		                show:false
		            }
			    },
			    yAxis: {
			        type: 'value',
			        //name:obj[0][3],
			        axisLine:{
		                show:false
		            },
		            axisTick:{
		                show:false
		            },
		            splitLine:{
		            	show:true,
		                lineStyle:{
		                    type:"dotted"
		                }
		            },
			        axisLabel: {
				       formatter:'{value}'
				    }
			    },
			    series: [
			    {
			        name: '今日',
			        type: 'line',
			        smooth: true,
			        data: obj[0][0],
			        itemStyle:{
			            normal:{
			                color:"#7fbfea"
			            }
			        }
			    },
			    {
			        name: rtDayBefore ,
			        type: 'line',
			        smooth: true,
			        data: obj[0][1],
			        itemStyle:{
			            normal:{
			                color:"#e73b83"
			            }
			        }
			    }]
			};
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		
		}
		
		//用户端动态-员工图表
		function userConditionYg(obj,rtDayBefore){
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('yhdtYg'));
		    
		    var option = {
			    tooltip: {
			        trigger: 'axis',
			        confine: true,
			        backgroundColor: 'rgba(87,106,118,0.7)'
			    },
			    legend: {
			        data:['今日',rtDayBefore],
			        itemWidth:15,
			        itemHeight:10,
			        /*selectedMode:false,*/
			        textStyle:{
			            fontSize: 10,
			            color: '#929292'
			        },
			        bottom:'2%'
			    },
			    grid: {
			    	top:'15%',
			    	bottom:'15%',
			        left: '3%',
			        right: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: obj[0][2],
			        axisTick:{
		                show:false
		            },
		            axisLine:{
		                show:false
		            }
			    },
			    yAxis: {
			        type: 'value',
			        //name:obj[0][3],
			        axisLine:{
		                show:false
		            },
		            axisTick:{
		                show:false
		            },
		            splitLine:{
		            	show:true,
		                lineStyle:{
		                    type:"dotted"
		                }
		            },
			        axisLabel: {
				       formatter:'{value}'
				    }
			    },
			    series: [
			    {
			        name: '今日',
			        type: 'line',
			        smooth: true,
			        data: obj[0][0],
			        itemStyle:{
			            normal:{
			                color:"#7fbfea"
			            }
			        }
			    },
			    {
			        name: rtDayBefore ,
			        type: 'line',
			        smooth: true,
			        data: obj[0][1],
			        itemStyle:{
			            normal:{
			                color:"#e73b83"
			            }
			        }
			    }]
			};
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		
		}
		
		//产品端动态-超推
		function productCondition(obj){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('stzb'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data: ['小于6%','6%-8%','8%-10%','10%+'],
		            itemGap: 10,
		            itemWidth:15,
			        itemHeight:10,
			        /*selectedMode:false,*/
			        textStyle:{
			            fontSize:10,
			            color: '#929292'
			        },
			        bottom:'2%'
		        },
		        grid: {
		            top: '15%',
		            bottom:'15%',
		            left: '3%',
		            right: '3%',
		            containLabel: true
		        },
		        xAxis: [
		            {
		                type : 'category',
		                data : ['新手类','0-50天','51-70天','71-109天','110-191天'],
		                axisTick:{
			                show:false
			            },
			            axisLine:{
			                show:false
			            }
		            }
		        ],
		        yAxis: [
		            {
			            type: 'value',
			            name: obj[0][4],
			            axisLine:{
			                show:false
			            },
			            axisTick:{
			                show:false
			            },
			            splitLine:{
			            	show:true,
			                lineStyle:{
			                    type:"dotted"
			                }
			            },
			            /*min: 0,
			            max: 5,
			            interval: 1,控制最大值、最小值及幅度*/
			            axisLabel: {
			                formatter: function(param){
					       		return param.toFixed(2);
					       }
			            }
			        }
		        ],
		        series : [
		            {
		                name:'小于6%',
	            		type:'bar',
		                data: obj[0][0],
					    itemStyle:{
				            normal:{
				                color:"#3683FF"
				            }
				        },
				        barWidth : 30,
	            		stack: '搜索引擎'
		            },
		            {
		                name:'6%-8%',
		                type: 'bar',
		                data: obj[0][1],
					    itemStyle:{
				            normal:{
				                color:"#7EAFFF"
				            }
				       },
				        stack: '搜索引擎'
		            },
		            {
			            name:'8%-10%',
			            type:'bar',
			            data: obj[0][2],
			            itemStyle:{
				            normal:{
				                color:"#A0EAF6"
				            }
				        },
				        stack: '搜索引擎'
			        },
			        {
			            name:'10%+',
			            type:'bar',
			            data: obj[0][3],
			            itemStyle:{
				            normal:{
				                color:"#18D2F9"
				            }
				        },
				        stack: '搜索引擎'
			        }
		        ]
		    };
				
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
			
		}
		
		//产品端动态-员工
		function productConditionYg(obj){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('stzbYg'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data: ['小于6%','6%-8%','8%-10%','10%+'],
		            itemGap: 10,
		            itemWidth:15,
			        itemHeight:10,
			        /*selectedMode:false,*/
			        textStyle:{
			            fontSize:10,
			            color: '#929292'
			        },
			        bottom:'2%'
		        },
		        grid: {
		            top: '15%',
		            bottom:'15%',
		            left: '3%',
		            right: '3%',
		            containLabel: true
		        },
		        xAxis: [
		            {
		                type : 'category',
		                data : ['新手类','0-50天','51-70天','71-109天','110-191天'],
		                axisTick:{
			                show:false
			            },
			            axisLine:{
			                show:false
			            }
		            }
		        ],
		        yAxis: [
		            {
			            type: 'value',
			            name: obj[0][4],
			            axisLine:{
			                show:false
			            },
			            axisTick:{
			                show:false
			            },
			            splitLine:{
			            	show:true,
			                lineStyle:{
			                    type:"dotted"
			                }
			            },
			            /*min: 0,
			            max: 5,
			            interval: 1,控制最大值、最小值及幅度*/
			            axisLabel: {
			                formatter: function(param){
					       		return param.toFixed(2);
					       }
			            }
			        }
		        ],
		        series : [
		            {
		                name:'小于6%',
	            		type:'bar',
		                data: obj[0][0],
					    itemStyle:{
				            normal:{
				                color:"#3683FF"
				            }
				        },
				        barWidth : 30,
	            		stack: '搜索引擎'
		            },
		            {
		                name:'6%-8%',
		                type: 'bar',
		                data: obj[0][1],
					    itemStyle:{
				            normal:{
				                color:"#7EAFFF"
				            }
				       },
				        stack: '搜索引擎'
		            },
		            {
			            name:'8%-10%',
			            type:'bar',
			            data: obj[0][2],
			            itemStyle:{
				            normal:{
				                color:"#A0EAF6"
				            }
				        },
				        stack: '搜索引擎'
			        },
			        {
			            name:'10%+',
			            type:'bar',
			            data: obj[0][3],
			            itemStyle:{
				            normal:{
				                color:"#18D2F9"
				            }
				        },
				        stack: '搜索引擎'
			        }
		        ]
		    };
				
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
			
		}
		
		//地域分布-投资金额
		function areaInvestMoney(obj,maxNum,minNum){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('dytzje'));
		   
			var option = {
			    title: {
			        text: '金额',
			        left: 'right',
			        subtext: '(万元)'
			    },
			    tooltip: {
			        show: false,
			        trigger: 'item'
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'left',
			        data:['金额'],
			        show: false
			    },
			    visualMap: {
			        min: minNum,
			        max: maxNum,
			        left: 'left',
			        top: 'top',
			        text: ['高','低'],           // 文本，默认为数值文本
			        calculable: false,
			        itemHeight: 100,
			        itemWidth: 10,
			        orient: 'horizontal',
			        //color: ['#477bfc','#b4dfff']
			        color: ['#477bfc','#6e9cfc','#6fc1ff']
			    },
			    series: [
			        {
			            name: '金额',
			            type: 'map',
			            showLegendSymbol: false,
			            mapType: 'china',
			            roam: false,
			            label: {
			                normal: {
			                    show:false
			                },
			                emphasis: {
			                    show: false
			                }
			            },
			            //silent:true,
			            data:obj
			        }
			    ]
			};
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		  	
		}
		
		//地域分布-投资人数
		function areaInvestPeople(obj,maxNum,minNum){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('dytzrs'));
		   
			var option = {
			    title: {
			        text: '人数',
			        left: 'right'
			    },
			    tooltip: {
			        show: false,
			        trigger: 'item'
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'left',
			        data:['人数'],
			        show: false
			    },
			    visualMap: {
			        min: minNum,
			        max: maxNum,
			        left: 'left',
			        top: 'top',
			        text: ['高','低'],           // 文本，默认为数值文本
			        calculable: false,
			        itemHeight: 100,
			        itemWidth: 10,
			        orient: 'horizontal',
			        color: ['#477bfc','#6e9cfc','#6fc1ff']
			    },
			    series: [
			        {
			            name: '人数',
			            type: 'map',
			            showLegendSymbol: false,
			            mapType: 'china',
			            roam: false,
			            label: {
			                normal: {
			                    show: false
			                },
			                emphasis: {
			                    show: false
			                }
			            },
			            //silent:true,
			            data:obj
			        }
			    ]
			};
			
			//使用刚指定的配置项和数据显示图表
		  	myChart.setOption(option);
		  	
		}
		
})(mui,jQuery,document)
