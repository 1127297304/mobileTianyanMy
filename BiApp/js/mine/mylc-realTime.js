;(function($,$$,doc){
	$.init({
		swipeBack: false//关闭右滑关闭功能
	})
	
	/*
		全局变量指标说明：
		ssObj 初始请求的总数据
		cpdtObj	产品动态不同维度的数据
		yhdtObj 时段趋势-时段趋势不同维度的数据
		yhdtObjTotal 时段趋势-累计趋势不同维度的数据
		basicObj 代表数值部分对象
	*/
	
	var ssObj , yhdtObj , yhdtObjTotal, basicObj, cpdtObj ;//图表部分			
	var	onlyYMDate;//只有年-月-日的日期格式
	var rtDayBefore;//当天的前一天
	var timerTop=null;//定时器
	var showTime ;//时段趋势-时段趋势	如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
	var showTime2 ;
	var showTime3 ;
	var showTimeTotal ;//时段趋势-累计趋势
	var showTimeTotal2 ;
	var showTimeTotal3 ;
	
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
		showTime = rtDayBefore;//未选择符合范围内的日期时	默认存储当前前一天的日期
		showTime2 = '-';
		showTime3 = '-';
		showTimeTotal = rtDayBefore;//同上
		showTimeTotal2 = '-';//同上
		showTimeTotal3 = '-';//同上
		
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
		return (m<10 ? "0"+m : m)+"-"+(d<10 ? "0"+d : d); 
	}
	
	//请求实时数据
	function rtAskforDate(){
		//获取当前页面显示的对比日期
		var addYear = new Date().getFullYear()+'-';
		var day1 = addYear + rtDayBefore;
		var day2 = $$("#calendarsTwo").val();
		var day3 = $$("#calendarsThree").val();
		var curWd = $$("#userResult").attr("data-value");
		var sendDay2, sendDay3, curTabNum, legend2, legend3;
		var curIndOne = $$(".firstCont .active").index();
		if(curIndOne == "1"){
			curTabNum = 1;
		}else{
			curTabNum = "";
		}
		if(day2 == "-"){
			sendDay2 = "";
			legend2 = "";
		}else{
			sendDay2 = addYear+day2;
			legend2 = day2;
		}
		if(day3 == "-"){
			sendDay3 = "";
			legend3 = "";
		}else{
			sendDay3 = addYear+day3;
			legend3 = day3;
		}
		
		//调用请求ajax的插件
		$$.ajaxData({
			newUrl:"/meiYiFinancing/getMeiYiFinancingRealTimeWebModel.gm",
			//newUrl:"../../js/mine/mjwbt.json",
			data:{
				rdate1: day1,
				rdate2: sendDay2,
				rdate3: sendDay3,
				index: curWd,
				flag: curTabNum
			},
			callback:function(data){
				
				ssObj = data.data.datainfo.productActive;//图表部分的全局变量
				basicObj = data.data.datainfo.investTjxx;//基础数值部分的全局变量
				//格式化所有数值部分的金额
				$$.each(basicObj,function(i,val){
					if(val == null){
						basicObj[i] = '-';
					}else{
						basicObj[i] = outputmoney(val.toString());
					}
				})
				
				//顶部渲染Vue
				randerTopVue(basicObj);
				
				//时段趋势对象-时段趋势	//今 选 横轴
				if(legend2 == "" && legend3!=""){
					yhdtObj=[
							[ssObj.todayList,ssObj.otherDayList1,ssObj.timeList,ssObj.otherDayList3,ssObj.otherDayList2]
						];
						//时段趋势图表-时段趋势
					userCondition(yhdtObj,rtDayBefore,legend3,legend2);
				}else{
					yhdtObj=[
							[ssObj.todayList,ssObj.otherDayList1,ssObj.timeList,ssObj.otherDayList2,ssObj.otherDayList3]
						];
						//时段趋势图表-时段趋势
					userCondition(yhdtObj,rtDayBefore,legend2,legend3);
				}
				$$("#userResult").text("注册用户数");
				//设置默认显示日期为(时段趋势)
				$$("#calendars").val(rtDayBefore);
				//设置默认显示日期为(累计趋势)
				$$("#calendarsTotal").val(rtDayBefore);
				
				/*//时段趋势对象-累计趋势	//今 选 横轴
				yhdtObjTotal={
					"zc":[
						[ssObj.accumuRegisterQuantityListOfToday,ssObj.accumuRregisterQuantityListOfOtherDay,ssObj.accumuTimeList]
					]
				};
				var dayTotal2 = $$("#calendarsTotalTwo").val();
				var dayTotal3 = $$("#calendarsTotalThree").val();
				//时段趋势图表-累计趋势
				userConditionTotal(yhdtObjTotal.zc,rtDayBefore,dayTotal2,dayTotal3);
				$$("#userResultTotal").text("注册用户数");*/
				
				//产品动态对象	//横轴	利率1	利率2	利率3	利率4
				cpdtObj={
					"tze":[
						[ssObj.investAmount54,ssObj.investAmount5562,ssObj.investAmount6369,ssObj.investAmount7]
					],
					"st":[
						[ssObj.firstInvest54,ssObj.firstInvest5562,ssObj.firstInvest6369,ssObj.firstInvest7]
					],
					"ft":[
						[ssObj.secondInvest54,ssObj.secondInvest5562,ssObj.secondInvest6369,ssObj.secondInvest7]
					]
				}
				
				//产品端动态图表
				$$("#productResult").text("投资额");
				productCondition(cpdtObj.tze);
				
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
			topArea: ''
		},
		mounted: function(){
			var that = this;
			myvue.$on('topAreaData', function(obj){
				that.topArea = obj;
			})
		}
	})
	
	/*****************************格式化金额 **********************************/
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
	
	/**************************格式化金额结束 ***************************/
	
	
	/******************************下拉刷新****************************/
	
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
    
/******************************下拉刷新结束******************************/	
	
	//日期选择-时段趋势
	realTimeSelect();
	
	//日期选择-累计趋势
	realTimeSelectTotal();
	
	//first选项卡切换
	tabChange();
	
	//时段趋势-时段趋势指标选择
	stzbCh();
	
	//时段趋势-累计趋势指标选择
	stzbChTotal();
	
	//产品端动态指标选择
	stzbSelect();
	
	//指标说明弹框
	tipsExplain();
	
		//firstCont选项卡切换
		function tabChange(){
			var parentBox = $$(".firstCont .tableTitle");
			var subItem = parentBox.find("a");
			subItem.on("tap",function(){
				var curInd = $$(this).index();//获取当前点击的索引
				$$(this).addClass("active").siblings("a").removeClass("mui-active active");
				$$(".firstCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
				
				switch(curInd){
					case 0:
						var nowVal = $$("#userResult").attr("data-value");
						var date1 = $$("#calendars").val();
						var date2 = $$("#calendarsTwo").val();
						var date3 = $$("#calendarsThree").val();
						var addYear = new Date().getFullYear()+'-';
						var sendDate2, sendDate3, legend2, legend3;
						if(date2 == "-"){
							sendDate2 = "";
							legend2 = "";
						}else{
							sendDate2 = addYear+date2;
							legend2 = date2;
						}
						if(date3 == "-"){
							sendDate3 = "";
							legend3 = "";
						}else{
							sendDate3 = addYear+date3;
							legend3 = date3;
						}
						$$.ajaxData({
							newUrl:"/meiYiFinancing/getDataFromDashUserActiveTableOfOtherDay.gm",
							data:{
								rdate1: addYear+date1,
								rdate2: sendDate2,
								rdate3: sendDate3,
								index: nowVal
							},
							callback:function(data){
								var curObj;
								if(legend2 == "" && legend3!=""){
									curObj = [
										[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList3,data.data.datainfo.otherDayList2]
									];
									//维度改变时图表改变	时段趋势图表-时段趋势
									userCondition(curObj,date1,legend3,legend2);
								}else{
									curObj = [
										[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
									];
									//维度改变时图表改变	时段趋势图表-时段趋势
									userCondition(curObj,date1,legend2,legend3);
								}
							}
							
						})
						break;
					case 1:
						var nowValTotal = $$("#userResultTotal").attr("data-value");
						var dateTotal1 = $$("#calendarsTotal").val();
						var dateTotal2 = $$("#calendarsTotalTwo").val();
						var dateTotal3 = $$("#calendarsTotalThree").val();
						var addYear = new Date().getFullYear()+'-';
						var sendDateTotal2, sendDateTotal3, legendTotal2, legendTotal3;
						if(dateTotal2 == "-"){
							sendDateTotal2 = "";
							legendTotal2 = "";
						}else{
							sendDateTotal2 = addYear+dateTotal2;
							legendTotal2 = dateTotal2;
						}
						if(dateTotal3 == "-"){
							sendDateTotal3 = "";
							legendTotal3 = "";
						}else{
							sendDateTotal3 = addYear+dateTotal3;
							legendTotal3 = dateTotal3;
						}
						$$.ajaxData({
							newUrl:"/meiYiFinancing/getDataFromDashUserAccumuActiveTableOfOtherDay.gm",
							data:{
								rdate1: addYear+dateTotal1,
								rdate2: sendDateTotal2,
								rdate3: sendDateTotal3,
								index: nowValTotal
							},
							callback:function(data){
								var curObj;
								if(legendTotal2 == "" && legendTotal3!=""){
									curObj = [
										[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList3,data.data.datainfo.otherDayList2]
									];
									//维度改变时图表改变	时段趋势图表-累计趋势
									userConditionTotal(curObj,dateTotal1,legendTotal3,legendTotal2);
								}else{
									curObj = [
										[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
									];
									//维度改变时图表改变	时段趋势图表-累计趋势
									userConditionTotal(curObj,dateTotal1,legendTotal2,legendTotal3);
								}
							}
						})
						break;
				}
				
			})
		}
		
		//时段趋势-时段趋势
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
						
						var date1 = $$("#calendars").val();
						var date2 = $$("#calendarsTwo").val();
						var date3 = $$("#calendarsThree").val();
						var addYear = new Date().getFullYear()+'-';
						var sendDate2, sendDate3, legend2, legend3;
						if(date2 == "-"){
							sendDate2 = "";
							legend2 = "";
						}else{
							sendDate2 = addYear+date2;
							legend2 = date2;
						}
						if(date3 == "-"){
							sendDate3 = "";
							legend3 = "";
						}else{
							sendDate3 = addYear+date3;
							legend3 = date3;
						}
						$$.ajaxData({
							newUrl:"/meiYiFinancing/getDataFromDashUserActiveTableOfOtherDay.gm",
							data:{
								rdate1: addYear+date1,
								rdate2: sendDate2,
								rdate3: sendDate3,
								index: dataValue
							},
							callback:function(data){
								var curObj;
								if(legend2 == "" && legend3!=""){
									curObj = [
										[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList3,data.data.datainfo.otherDayList2]
									];
									//维度改变时图表改变	时段趋势图表-时段趋势
									userCondition(curObj,date1,legend3,legend2);
								}else{
									curObj = [
										[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
									];
									//维度改变时图表改变	时段趋势图表-时段趋势
									userCondition(curObj,date1,legend2,legend3);
								}
							}
							
						})
					});
				}, false);
		}
		
		//时段趋势-累计趋势
		function stzbChTotal(){
				
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
				var showUserPickerButton = doc.getElementById('showUserPickerTotal');
				var userResult = doc.getElementById('userResultTotal');
				showUserPickerButton.addEventListener('tap', function(event) {
					userPicker.show(function(items) {
						userResult.innerText = items[0].text;
						//返回 false 可以阻止选择框的关闭
						//return false;
						var dataValue=items[0].value;
						userResult.setAttribute("data-value",dataValue);
						
						var addYear = new Date().getFullYear()+'-';
						var dateOne = $$("#calendarsTotal").val();
						var dateTwo = $$("#calendarsTotalTwo").val();
						var dateThree = $$("#calendarsTotalThree").val();
						var sendDate2, sendDate3, legend2, legend3;
						if(dateTwo == "-"){
							sendDate2 = "";
							legend2 = "";
						}else{
							sendDate2 = addYear+dateTwo;
							legend2 = dateTwo;
						}
						if(dateThree == "-"){
							sendDate3 = "";
							legend3 = "";
						}else{
							sendDate3 = addYear+dateThree;
							legend3 = dateThree;
						}
						$$.ajaxData({
							newUrl:"/meiYiFinancing/getDataFromDashUserAccumuActiveTableOfOtherDay.gm",
							data:{
								rdate1: addYear+dateOne,
								rdate2: sendDate2,
								rdate3: sendDate3,
								index: dataValue
							},
							callback:function(data){
								var curObj;
								if(legend2 == "" && legend3!=""){
									curObj = [
										[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList3,data.data.datainfo.otherDayList2]
									];
									//维度改变时图表改变	时段趋势图表-累计趋势
									userConditionTotal(curObj,dateOne,legend3,legend2);
								}else{
									curObj = [
										[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
									];
									//维度改变时图表改变	时段趋势图表-累计趋势
									userConditionTotal(curObj,dateOne,legend2,legend3);
								}
							}
						})
					});
				}, false);
		}
		
		//产品端动态指标选择
		function stzbSelect(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: 'tze',
				text: '投资额'
			}, {
				value: 'st',
				text: '首投'
			}, {
				value: 'ft',
				text: '复投'
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
		
		//指标说明弹框
	    function tipsExplain(){
	    	//用户分析指标说明
	    	$$("#realTimeDataQues").on("click",function(){
	    		$$("#realTimeDataBox").show();
	    		//弹框出现时页面禁止滚动
	    		$$(".mui-content").css({
	    			"width":"100%",
	    			"height":"100%"
	    		})
	    		$$(".mui-content")[0].style.overflow = 'hidden';
	    		document.body.style.overflow = 'hidden';
	    	})
	    	$$("#realTimeDataClose").on("click",function(){
	    		$$("#realTimeDataBox").hide();
	    		//弹框关闭时页面恢复滚动
	    		$$(".mui-content").css({
	    			"width":"initial",
	    			"height":"initial"
	    		})
	    		$$(".mui-content")[0].style.overflow = 'scroll';
	    		document.body.style.overflow = 'scroll';
	    	})
	    }
		
		//日期选择-时段趋势
		function realTimeSelect(){
			$$("#calendars").on("change",function(){
				
				var addYear = new Date().getFullYear()+'-';
				var curDate = $$(this).val();
				var dateTwo = $$("#calendarsTwo").val();
				var dateThree = $$("#calendarsThree").val();
				var curWd = $$("#userResult").attr("data-value");
				var sendDate2, sendDate3, legend2, legend3;
				if(dateTwo == "-"){
					sendDate2 = "";
					legend2 = "";
				}else{
					sendDate2 = addYear+dateTwo;
					legend2 = dateTwo;
				}
				if(dateThree == "-"){
					sendDate3 = "";
					legend3 = "";
				}else{
					sendDate3 = addYear+dateThree;
					legend3 = dateThree;
				}
				
				//在此获取选择的日期重新发送请求
				if((new Date(addYear+curDate) >= new Date("2017-04-24")) && (new Date(addYear+curDate) < new Date(addYear+onlyYMDate))){
					showTime = curDate;//当前页面显示的日期永远是符合时间范围内的日期
					
					$$.ajaxData({
						newUrl:"/meiYiFinancing/getDataFromDashUserActiveTableOfOtherDay.gm",
						data:{
							rdate1: addYear+curDate,
							rdate2: sendDate2,
							rdate3: sendDate3,
							index: curWd
						},
						callback:function(data){
							var curObj;
							if(legend2 == "" && legend3!= ""){
								curObj = [
									[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList3,data.data.datainfo.otherDayList2]
								];
								//维度改变时图表改变	时段趋势图表-时段趋势
								userCondition(curObj,curDate,legend3,legend2);
							}else{
								curObj = [
									[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
								];
								//维度改变时图表改变	时段趋势图表-时段趋势
								userCondition(curObj,curDate,legend2,legend3);
							}
						}
					})
				}
				else{
					mui.toast('不在可支持的统计时间范围内');
					$$(this).val(showTime);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			});
			$$("#calendarsTwo").on("change",function(){
				
				var addYear = new Date().getFullYear()+'-';
				var curDate = $$(this).val();
				var dateOne = $$("#calendars").val();
				var dateThree = $$("#calendarsThree").val();
				var curWd = $$("#userResult").attr("data-value");
				var sendDate3, legend3;
				if(dateThree == "-"){
					sendDate3 = "";
					legend3 = "";
				}else{
					sendDate3 = addYear+dateThree;
					legend3 = dateThree;
				}
				
				//在此获取选择的日期重新发送请求
				if((new Date(addYear+curDate) >= new Date("2017-04-24")) && (new Date(addYear+curDate) < new Date(addYear+onlyYMDate))){
					showTime2 = curDate;//当前页面显示的日期永远是符合时间范围内的日期
					
					$$.ajaxData({
						newUrl:"/meiYiFinancing/getDataFromDashUserActiveTableOfOtherDay.gm",
						data:{
							rdate1: addYear+dateOne,
							rdate2: addYear+curDate,
							rdate3: sendDate3,
							index: curWd
						},
						callback:function(data){
							var curObj = [
								[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
							];
							//维度改变时图表改变	时段趋势图表-时段趋势
							userCondition(curObj,dateOne,curDate,legend3);
						}
					})
				}
				else{
					mui.toast('不在可支持的统计时间范围内');
					$$(this).val(showTime2);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			});
			$$("#calendarsThree").on("change",function(){
				var addYear = new Date().getFullYear()+'-';
				var curDate = $$(this).val();
				var dateOne = $$("#calendars").val();
				var dateTwo = $$("#calendarsTwo").val();
				var curWd = $$("#userResult").attr("data-value");
				var sendDate2, legend2;
				if(dateTwo == "-"){
					sendDate2 = "";
					legend2 = "";
				}else{
					sendDate2 = addYear+dateTwo;
					legend2 = dateTwo;
				}
				//在此获取选择的日期重新发送请求
				if((new Date(addYear+curDate) >= new Date("2017-04-24")) && (new Date(addYear+curDate) < new Date(addYear+onlyYMDate))){
					showTime3 = curDate;//当前页面显示的日期永远是符合时间范围内的日期
					
					$$.ajaxData({
						newUrl:"/meiYiFinancing/getDataFromDashUserActiveTableOfOtherDay.gm",
						data:{
							rdate1: addYear+dateOne,
							rdate2: sendDate2,
							rdate3: addYear+curDate,
							index: curWd
						},
						callback:function(data){
							var curObj;
							if(legend2 == ""){
								curObj = [
									[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList3,data.data.datainfo.otherDayList2]
								];
								//维度改变时图表改变	时段趋势图表-时段趋势
								userCondition(curObj,dateOne,curDate,legend2);
							}else{
								curObj = [
									[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
								];
								//维度改变时图表改变	时段趋势图表-时段趋势
								userCondition(curObj,dateOne,legend2,curDate);
							}
						}
					})
				}
				else{
					mui.toast('不在可支持的统计时间范围内');
					$$(this).val(showTime3);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			});
		}
		
		//日期选择-累计趋势
		function realTimeSelectTotal(){
			$$("#calendarsTotal").on("change",function(){
				var addYear = new Date().getFullYear()+'-';
				var curDate = $$(this).val();
				var dateTwo = $$("#calendarsTotalTwo").val();
				var dateThree = $$("#calendarsTotalThree").val();
				var curWd = $$("#userResultTotal").attr("data-value");
				var sendDate2, sendDate3, legend2, legend3;
				if(dateTwo == "-"){
					sendDate2 = "";
					legend2 = "";
				}else{
					sendDate2 = addYear+dateTwo;
					legend2 = dateTwo;
				}
				if(dateThree == "-"){
					sendDate3 = "";
					legend3 = "";
				}else{
					sendDate3 = addYear+dateThree;
					legend3 = dateThree;
				}
						
				//在此获取选择的日期重新发送请求
				if((new Date(addYear+curDate) >= new Date("2017-04-24")) && (new Date(addYear+curDate) < new Date(addYear+onlyYMDate))){
					showTimeTotal = curDate;//当前页面显示的日期永远是符合时间范围内的日期
					
					$$.ajaxData({
						newUrl:"/meiYiFinancing/getDataFromDashUserAccumuActiveTableOfOtherDay.gm",
						data:{
							rdate1: addYear+curDate,
							rdate2: sendDate2,
							rdate3: sendDate3,
							index: curWd
						},
						callback:function(data){
							var curObj;
							if(legend2 == "" && legend3!=""){
								curObj = [
									[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList3,data.data.datainfo.otherDayList2]
								];
							
								//维度改变时图表改变	时段趋势图表-累计趋势
								userConditionTotal(curObj,curDate,legend3,legend2);
							}else{
								curObj = [
									[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
								];
								
								//维度改变时图表改变	时段趋势图表-累计趋势
								userConditionTotal(curObj,curDate,legend2,legend3);
							}
						}
					})
				}
				else{
					mui.toast('不在可支持的统计时间范围内');
					$$(this).val(showTimeTotal);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			});
			$$("#calendarsTotalTwo").on("change",function(){
				
				var addYear = new Date().getFullYear()+'-';
				var curDate = $$(this).val();
				var dateOne = $$("#calendarsTotal").val();
				var dateThree = $$("#calendarsTotalThree").val();
				var curWd = $$("#userResultTotal").attr("data-value");
				var sendDate3;
				if(dateThree == "-"){
					sendDate3 = "";
				}else{
					sendDate3 = addYear+dateThree;
				}
						
				//在此获取选择的日期重新发送请求
				if((new Date(addYear+curDate) >= new Date("2017-04-24")) && (new Date(addYear+curDate) < new Date(addYear+onlyYMDate))){
					showTimeTotal2 = curDate;//当前页面显示的日期永远是符合时间范围内的日期
					
					$$.ajaxData({
						newUrl:"/meiYiFinancing/getDataFromDashUserAccumuActiveTableOfOtherDay.gm",
						data:{
							rdate1: addYear+dateOne,
							rdate2: addYear+curDate,
							rdate3: sendDate3,
							index: curWd
						},
						callback:function(data){
							
							var curObj = [
								[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
							];
							
							//维度改变时图表改变	时段趋势图表-累计趋势
							userConditionTotal(curObj,dateOne,curDate,dateThree);
						}
					})
				}
				else{
					mui.toast('不在可支持的统计时间范围内');
					$$(this).val(showTimeTotal2);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			});
			$$("#calendarsTotalThree").on("change",function(){
				
				var addYear = new Date().getFullYear()+'-';
				var curDate = $$(this).val();
				var dateOne = $$("#calendarsTotal").val();
				var dateTwo = $$("#calendarsTotalTwo").val();
				var curWd = $$("#userResultTotal").attr("data-value");
				var sendDate2, legend2;
				if(dateTwo == "-"){
					sendDate2 = "";
					legend2 = "";
				}else{
					sendDate2 = addYear+dateTwo;
					legend2 = dateTwo;
				}
						
				//在此获取选择的日期重新发送请求
				if((new Date(addYear+curDate) >= new Date("2017-04-24")) && (new Date(addYear+curDate) < new Date(addYear+onlyYMDate))){
					showTimeTotal3 = curDate;//当前页面显示的日期永远是符合时间范围内的日期
					
					$$.ajaxData({
						newUrl:"/meiYiFinancing/getDataFromDashUserAccumuActiveTableOfOtherDay.gm",
						data:{
							rdate1: addYear+dateOne,
							rdate2: sendDate2,
							rdate3: addYear+curDate,
							index: curWd
						},
						callback:function(data){
							var curObj;
							if(legend2 == ""){
								curObj = [
									[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList3,data.data.datainfo.otherDayList2]
								];
								//维度改变时图表改变	时段趋势图表-累计趋势
								userConditionTotal(curObj,dateOne,curDate,legend2);
							}else{
								curObj = [
									[data.data.datainfo.todayList,data.data.datainfo.otherDayList1,data.data.datainfo.timeList,data.data.datainfo.otherDayList2,data.data.datainfo.otherDayList3]
								];
								//维度改变时图表改变	时段趋势图表-累计趋势
								userConditionTotal(curObj,dateOne,legend2,curDate);
							}
						}
					})
				}
				else{
					mui.toast('不在可支持的统计时间范围内');
					$$(this).val(showTimeTotal3);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			});
		}
		
		//时段趋势图表-时段趋势
		function userCondition(obj,rtDayBefore,dayTwo,dayThree){
			
			var dayTwoOption, dayThreeOption;
			if(dayTwo == ""){
				dayTwoOption = [];
			}else{
				dayTwoOption = obj[0][3];
			}
			if(dayThree == ""){
				dayThreeOption = [];
			}else{
				dayThreeOption = obj[0][4];
			}
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('yhdt'));
		    
		    var option = {
			    tooltip: {
			        trigger: 'axis',
			        confine: true,
			        backgroundColor: 'rgba(87,106,118,0.7)'
			    },
			    legend: {
			        data:['今日',rtDayBefore,dayTwo,dayThree],
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
			    dataZoom: [
		            {
		                show:false,//水平滚动条显示或隐藏
		                start: 0,//窗口中数据显示的起始位置
		                end: 100,//窗口中数据显示的结束位置
		                height:14,//水平滚动条的高度
		                bottom:"3%"
		            },
		            {
		                type: 'inside',//内置型数据区域缩放组件
		                start: 94,//数据无影响
		                end: 100
		            },
		            {
		                show: false,//垂直滚动条是否显示
		                yAxisIndex: 0,//控制双y轴中的第一个y轴	0  代表即万元轴	1  代表百分比轴
		                filterMode: 'empty',//改变 Y 轴过滤柱时，X 轴范围不受影响	默认：filter
		                width: 20,//控制垂直过滤柱的宽
		                height: '70%',//控制垂直过滤柱的高
		                showDataShadow: false,//是否显示过滤柱中的数据趋势阴影
		                left: '93%'//距离窗口左边的位置
		            }
		        ],
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
			    },
			    {
			        name: dayTwo ,
			        type: 'line',
			        smooth: true,
			        data: dayTwoOption,
			        itemStyle:{
			            normal:{
			                color:"lightgreen"
			            }
			        }
			    },
			    {
			        name: dayThree ,
			        type: 'line',
			        smooth: true,
			        data: dayThreeOption,
			        itemStyle:{
			            normal:{
			                color:"#FF9211"
			            }
			        }
			    }]
			};
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		
		}
		
		//时段趋势图表-累计趋势
		function userConditionTotal(obj,rtDayBefore,dayTwo,dayThree){
			
			var dayTwoOption, dayThreeOption;
			if(dayTwo == ""){
				dayTwoOption = [];
			}else{
				dayTwoOption = obj[0][3];
			}
			if(dayThree == ""){
				dayThreeOption = [];
			}else{
				dayThreeOption = obj[0][4];
			}
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('yhdtTotal'));
		    
		    var option = {
			    tooltip: {
			        trigger: 'axis',
			        confine: true,
			        backgroundColor: 'rgba(87,106,118,0.7)'
			    },
			    legend: {
			        data:['今日',rtDayBefore,dayTwo,dayThree],
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
			    dataZoom: [
		            {
		                show:false,//水平滚动条显示或隐藏
		                start: 0,//窗口中数据显示的起始位置
		                end: 100,//窗口中数据显示的结束位置
		                height:14,//水平滚动条的高度
		                bottom:"3%"
		            },
		            {
		                type: 'inside',//内置型数据区域缩放组件
		                start: 94,//数据无影响
		                end: 100
		            },
		            {
		                show: false,//垂直滚动条是否显示
		                yAxisIndex: 0,//控制双y轴中的第一个y轴	0  代表即万元轴	1  代表百分比轴
		                filterMode: 'empty',//改变 Y 轴过滤柱时，X 轴范围不受影响	默认：filter
		                width: 20,//控制垂直过滤柱的宽
		                height: '70%',//控制垂直过滤柱的高
		                showDataShadow: false,//是否显示过滤柱中的数据趋势阴影
		                left: '93%'//距离窗口左边的位置
		            }
		        ],
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
			    },
			    {
			        name: dayTwo ,
			        type: 'line',
			        smooth: true,
			        data: dayTwoOption,
			        itemStyle:{
			            normal:{
			                color:"lightgreen"
			            }
			        }
			    },
			    {
			        name: dayThree ,
			        type: 'line',
			        smooth: true,
			        data: dayThreeOption,
			        itemStyle:{
			            normal:{
			                color:"#FF9211"
			            }
			        }
			    }]
			};
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		
		}
		
		//产品端动态
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
		            data: ['5.4%及以下','5.5%-6.2%','6.3%-6.9%','7%+'],
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
		                data : ['新手类','10-49天','50-79天','80-129天','130-199天','200天+'],
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
			            name: '(千万)',
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
		                name:'5.4%及以下',
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
		                name:'5.5%-6.2%',
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
			            name:'6.3%-6.9%',
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
			            name:'7%+',
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
		
})(mui,jQuery,document)
