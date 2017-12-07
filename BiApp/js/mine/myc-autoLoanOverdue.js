;(function($,$$,doc,appGlobal){
	$.init({
		swipeBack: false//关闭右滑关闭功能
	})

	var beforeToday;//当天前一天的完整日期格式
	//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
	var showTime, showTimeMonth, areaYearTime, areaMonthTime, areaDayTime;
	//	年趋势			月趋势		年				月				日
	var markNum = 2;//控制loading隐藏
	
	//给所有的tab标签添加局部滚动
	mui('.mui-scroll-wrapper').scroll();
	
	//判断当前显示的时间
	showCurTime();
	
	//判断当前的显示时间
	function showCurTime(){
		
		//获取当前日期	如果当天为1号则取上个月最后一天的日期
		beforeToday=GetDateStr(-1);
		
		$$("#showAutoLoanDate").text(beforeToday);//在页面中显示当前日期
		$$("#onlyYear").val(beforeToday.slice(0,4));	//年趋势
		$$("#onlyMonth").val(beforeToday.slice(0,7));	//月趋势
		$$("#areaYear").val(beforeToday.slice(0,4));	//年
		$$("#areaMonth").val(beforeToday.slice(0,7));	//月
		$$("#areaDay").val(beforeToday);				//日
		
		//默认发送请求（请求当前日期的数据）
		askForDataBefore();
	}
		
	//计算当日前任何一天的日期
	function GetDateStr(AddDayCount) { 
		var dd = new Date(); 
		dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
		var y = dd.getFullYear(); 
			m = dd.getMonth()+1;//获取当前月份的日期
		var d = dd.getDate(); 
		return y+"-"+(m<10 ? "0"+m : m)+"-"+(d<10 ? "0"+d : d); 
	} 
		
	//请求ajax
	function askForDataBefore(){
		
		//当前页面显示的日期永远是符合时间范围内的日期
		showTime = beforeToday.slice(0,4);//		年趋势
		showTimeMonth = beforeToday.slice(0,7);//	月趋势
		areaYearTime = beforeToday.slice(0,4);//	年
		areaMonthTime = beforeToday.slice(0,7)//	月
		areaDayTime = beforeToday;//				日
		
		//逾期率-趋势类型请求
		var monthTime = $$("#onlyMonth").val();
		var monthAmountType = $$("#monthMoneyResult").attr("data-value");
		var monthProductType = $$("#monthProductResult").attr("data-value");
		var monthCarType = $$("#monthCarResult").attr("data-value");
		//逾期率-趋势类型请求数据
		typeOfTendency(monthTime,monthAmountType,monthProductType,monthCarType,'2');
		
		//逾期率-地区类型请求
		var dayAreaTime = $$("#areaDay").val();
		var dayAmountAreaType = $$("#dayMoneyAreaResult").attr("data-value");
		var dayMobAreaType = $$("#dayMobAreaResult").attr("data-value");
		var dayProductAreaType = $$("#dayProductAreaResult").attr("data-value");
		var dayCarAreaType = $$("#dayCarAreaResult").attr("data-value");
		//逾期率-地区类型请求数据
		typeofArea(dayAreaTime,dayAmountAreaType,dayMobAreaType,dayProductAreaType,dayCarAreaType,'3');
	
	}
	
	//逾期率-趋势类型请求数据
	function typeOfTendency(curTime,amountType,productType,carType,flagType){
		
		var yearSendInfo = {
			time: curTime,
		    amount_type: amountType,
		    product_type: productType,
		    car_type: carType
		};
		
		$$.ajaxData({
			newUrl:"/car/overdue/trend.gm",
			type:"get",
			data:{
				flag: flagType,
				bus_param: encodeURIComponent(JSON.stringify(yearSendInfo))
			},
			callback:function(data){
				var backValue = data.data.datainfo;
				if(backValue.mob1_list.length>0){
					//趋势图
					userCondition(backValue);
					$$("#tzzl").removeClass("qsNoInfo");
				}else{
					$$("#tzzl").text("暂无业务数据");
					$$("#tzzl").addClass("qsNoInfo");
				}
				
				
				markNum--;
				if(markNum == 0){
					//遮罩消失
					$$('.mask').css('display','none');
				}
			}
		})
	}
	
	//逾期率-地区类型请求数据
	function typeofArea(curTime,amountType,mobType,productType,carType,flagType){
		
		var yearSendInfo = {
			time: curTime,
		    amount_type: amountType,
		    mob_type: mobType,
		    product_type: productType,
		    car_type: carType
		};
		
		$$.ajaxData({
			newUrl:"/car/overdue/area.gm",
			type:"get",
			data:{
				flag: flagType,
				bus_param: encodeURIComponent(JSON.stringify(yearSendInfo))
			},
			callback:function(data){
				//地图区域
				areaInvestMoney(data.data.datainfo,data.data.datainfo.maxMapValue);
				//大区列表
				randerTopDay(data.data.datainfo,mobType);
				
				markNum--;
				if(markNum == 0){
					//遮罩消失
					$$('.mask').css('display','none');
				}
			}
		})
	}
	/****************************日期选择*****************************/
	dateSelect();
	/****************************维度选择*****************************/
	//全部金额选择列表	年趋势
	yearSelectMoney();
	//全部产品选择列表	年趋势
	yearSelectProduct();
	//全部车类选择列表	年趋势
	yearSelectCar();
	
	//全部金额选择列表	月趋势
	monthSelectMoney();
	//全部产品选择列表	月趋势
	monthSelectProduct();
	//全部车类选择列表	月趋势
	monthSelectCar();
	
	//全部金额选择列表	年地域
	yearAreaSelectMoney();
	//MOB选择列表		年地域
	yearAreaSelectMob();
	//全部产品选择列表	年地域
	yearAreaSelectProduct();
	//全部车类选择列表	年地域
	yearAreaSelectCar();
	
	//全部金额选择列表	月地域
	monthAreaSelectMoney();
	//MOB选择列表		月地域
	monthAreaSelectMob();
	//全部产品选择列表	月地域
	monthAreaSelectProduct();
	//全部车类选择列表	月地域
	monthAreaSelectCar();
	
	//全部金额选择列表	日地域
	dayAreaSelectMoney();
	//MOB选择列表		日地域
	dayAreaSelectMob();
	//全部产品选择列表	日地域
	dayAreaSelectProduct();
	//全部车类选择列表	日地域
	dayAreaSelectCar();
	/****************************选项卡切换*****************************/
	//secondCont选项卡切换
	tabChangeSecond();
	
	//fourth选项卡切换
	tabChangeFourth();
		
	//指标说明弹框	待用
	//tipsExplain();
		
	//指标说明弹框
    /*function tipsExplain(){
    	//用户分析指标说明
    	$$("#DayAndMonthOverviewQues").on("click",function(){
    		$$("#DayAndMonthOverviewQuesBox").show();
    		//弹框出现时页面禁止滚动
    		$$(".mui-content").css({
    			"width":"100%",
    			"height":"100%"
    		})
    		$$(".mui-content")[0].style.overflow = 'hidden';
    		document.body.style.overflow = 'hidden';
    	})
    	$$("#DayAndMonthOverviewClose").on("click",function(){
    		$$("#DayAndMonthOverviewQuesBox").hide();
    		//弹框关闭时页面恢复滚动
    		$$(".mui-content").css({
    			"width":"initial",
    			"height":"initial"
    		})
    		$$(".mui-content")[0].style.overflow = 'scroll';
    		document.body.style.overflow = 'scroll';
    	})
    	
    }*/
		
	//日期选择
	function dateSelect(){
		var btns = $('.btn');
		btns.each(function(i, btn) {
			btn.addEventListener('tap', function() {
				var dateOptions;
				switch(i)
				{
					case 0:
						//月趋势
						dateOptions={
							type: "month",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 1:
						//年趋势
						/*dateOptions={
							type: "month",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}*/
						break;
					case 2:
						//日地域
						dateOptions={
							type: "date",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 3:
						//月地域
						dateOptions={
							type: "month",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 4:
						//年地域
						/*dateOptions={
							type: "month",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}*/
						break;
				}
				
				var options = dateOptions || {};
				var picker = new $.DtPicker(options);
				picker.show(function(rs) {
					/*
					 * rs.value 拼合后的 value
					 * rs.text 拼合后的 text
					 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
					 * rs.m 月，用法同年
					 * rs.d 日，用法同年
					 * rs.h 时，用法同年
					 * rs.i 分（minutes 的第二个字母），用法同年
					 */
					$$(btn).val(rs.text);
					
					switch(i)
					{
						case 0:
						//月趋势
						var amountType = $$("#monthMoneyResult").attr("data-value");
						var productType = $$("#monthProductResult").attr("data-value");
						var carType = $$("#monthCarResult").attr("data-value");
						//请求数据
						typeOfTendency(rs.text,amountType,productType,carType,'2');
							break;
						case 1:
						//年趋势
						/*var amountType = $$("#yearMoneyResult").attr("data-value");
						var productType = $$("#yearProductResult").attr("data-value");
						var carType = $$("#yearCarResult").attr("data-value");
						//请求数据
						typeOfTendency(rs.text,amountType,productType,carType,'1');*/
							break;
						case 2:
						//日地域
						var amountType = $$("#dayMoneyAreaResult").attr("data-value");
						var mobType = $$("#dayMobAreaResult").attr("data-value");
						var productType = $$("#dayProductAreaResult").attr("data-value");
						var carType = $$("#dayCarAreaResult").attr("data-value");
						//请求数据
						typeofArea(rs.text,amountType,mobType,productType,carType,'3');
							break;
						case 3:
						//月地域
						var amountType = $$("#monthMoneyAreaResult").attr("data-value");
						var mobType = $$("#monthMobAreaResult").attr("data-value");
						var productType = $$("#monthProductAreaResult").attr("data-value");
						var carType = $$("#monthCarAreaResult").attr("data-value");
						//请求数据
						typeofArea(rs.text,amountType,mobType,productType,carType,'2');
							break;
						case 4:
						/*var amountType = $$("#yearMoneyAreaResult").attr("data-value");
						var mobType = $$("#yearMobAreaResult").attr("data-value");
						var productType = $$("#yearProductAreaResult").attr("data-value");
						var carType = $$("#yearCarAreaResult").attr("data-value");
						//请求数据
						typeofArea(rs.text,amountType,mobType,productType,carType,'1');*/
							break;
					}
					/* 
					 * 返回 false 可以阻止选择框的关闭
					 * return false;
					 */
					/*
					 * 释放组件资源，释放后将将不能再操作组件
					 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
					 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
					 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
					 */
					picker.dispose();
				});
			}, false);
		});
	}
		
		//日期选择		留一个以备需求更改
		/*function dateSelect(){
			//年趋势
			$$("#onlyYear").on("change",function(){
				var curDate =  $$(this).val().slice(0,4);
				$$(this).val(curDate);
				//判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
				//在此获取选择的日期重新发送请求
				if((new Date(curDate).getFullYear() >= new Date("2017").getFullYear()) && (new Date(curDate).getFullYear() < new Date().getFullYear()+1)){
					
					var amountType = $$("#yearMoneyResult").attr("data-value");
					var productType = $$("#yearProductResult").attr("data-value");
					var carType = $$("#yearCarResult").attr("data-value");
					//请求数据
					typeOfTendency(curDate,amountType,productType,carType,'1');
					
				}
				else{
					$.toast('不在可支持的统计时间范围内');
					$$(this).val(showTime);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			})
		}*/
	
		//全部金额选择列表	年趋势
		function yearSelectMoney(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部金额'
			}, {
				value: '6万以内',
				text: '6万以内'
			}, {
				value: '6万至12万',
				text: '6万至12万'
			}, {
				value: '12万以上',
				text: '12万以上'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showYearMoneyPicker');
			var userResult = doc.getElementById('yearMoneyResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#onlyYear").val();
					var productType = $$("#yearProductResult").attr("data-value");
					var carType = $$("#yearCarResult").attr("data-value");
					
					typeOfTendency(yearTime,items[0].value,productType,carType,'1');
					
				});
			}, false);	
		}
		
		//全部产品选择列表	年趋势
		function yearSelectProduct(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部产品'
			}, {
				value: '小贷',
				text: '小贷'
			}, {
				value: '融资租赁',
				text: '融资租赁'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showYearProductPicker');
			var userResult = doc.getElementById('yearProductResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#onlyYear").val();
					var amountType = $$("#yearMoneyResult").attr("data-value");
					var carType = $$("#yearCarResult").attr("data-value");
					
					typeOfTendency(yearTime,amountType,items[0].value,carType,'1');
					
				});
			}, false);	
		}
		
		//全部车类选择列表	年趋势
		function yearSelectCar(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部车类'
			}, {
				value: '新车',
				text: '新车'
			}, {
				value: '二手车',
				text: '二手车'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showYearCarPicker');
			var userResult = doc.getElementById('yearCarResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#onlyYear").val();
					var amountType = $$("#yearMoneyResult").attr("data-value");
					var productType = $$("#yearProductResult").attr("data-value");
					
					typeOfTendency(yearTime,amountType,productType,items[0].value,'1');
					
				});
			}, false);
		}
		
		//全部金额选择列表	月趋势
		function monthSelectMoney(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部金额'
			}, {
				value: '6万以内',
				text: '6万以内'
			}, {
				value: '6万至12万',
				text: '6万至12万'
			}, {
				value: '12万以上',
				text: '12万以上'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showMonthMoneyPicker');
			var userResult = doc.getElementById('monthMoneyResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var monthTime = $$("#onlyMonth").val();
					var productType = $$("#monthProductResult").attr("data-value");
					var carType = $$("#monthCarResult").attr("data-value");
					
					typeOfTendency(monthTime,items[0].value,productType,carType,'2');
					
				});
			}, false);	
		}
		
		//全部产品选择列表	月趋势
		function monthSelectProduct(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部产品'
			}, {
				value: '小贷',
				text: '小贷'
			}, {
				value: '融资租赁',
				text: '融资租赁'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showMonthProductPicker');
			var userResult = doc.getElementById('monthProductResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var monthTime = $$("#onlyMonth").val();
					var amountType = $$("#monthMoneyResult").attr("data-value");
					var carType = $$("#monthCarResult").attr("data-value");
					
					typeOfTendency(monthTime,amountType,items[0].value,carType,'2');
					
				});
			}, false);	
		}
		
		//全部车类选择列表	月趋势
		function monthSelectCar(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部车类'
			}, {
				value: '新车',
				text: '新车'
			}, {
				value: '二手车',
				text: '二手车'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showMonthCarPicker');
			var userResult = doc.getElementById('monthCarResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var monthTime = $$("#onlyMonth").val();
					var amountType = $$("#monthMoneyResult").attr("data-value");
					var productType = $$("#monthProductResult").attr("data-value");
					
					typeOfTendency(monthTime,amountType,productType,items[0].value,'2');
				});
			}, false);	
		}
		
		//全部金额选择列表	年地域
		function yearAreaSelectMoney(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部金额'
			}, {
				value: '6万以内',
				text: '6万以内'
			}, {
				value: '6万至12万',
				text: '6万至12万'
			}, {
				value: '12万以上',
				text: '12万以上'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showYearMoneyAreaPicker');
			var userResult = doc.getElementById('yearMoneyAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaYear").val();
					var mobType = $$("#yearMobAreaResult").attr("data-value");
					var productType = $$("#yearProductAreaResult").attr("data-value");
					var carType = $$("#yearCarAreaResult").attr("data-value");
					
					typeofArea(yearTime,items[0].value,mobType,productType,carType,'1');
					
				});
			}, false);	
		}
		
		//MOB选择列表	年地域
		function yearAreaSelectMob(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: 'MOB1',
				text: 'MOB1'
			}, {
				value: 'MOB2',
				text: 'MOB2'
			}, {
				value: 'MOB3',
				text: 'MOB3'
			}, {
				value: 'MOB4',
				text: 'MOB4'
			}, {
				value: 'MOB4+',
				text: 'MOB4+'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showYearMobAreaPicker');
			var userResult = doc.getElementById('yearMobAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaYear").val();
					var amountType = $$("#yearMoneyAreaResult").attr("data-value");
					var productType = $$("#yearProductAreaResult").attr("data-value");
					var carType = $$("#yearCarAreaResult").attr("data-value");
					
					typeofArea(yearTime,amountType,items[0].value,productType,carType,'1');
					
				});
			}, false);	
		}
		
		//全部产品选择列表	年地域
		function yearAreaSelectProduct(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部产品'
			}, {
				value: '小贷',
				text: '小贷'
			}, {
				value: '融资租赁',
				text: '融资租赁'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showYearProductAreaPicker');
			var userResult = doc.getElementById('yearProductAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaYear").val();
					var amountType = $$("#yearMoneyAreaResult").attr("data-value");
					var mobType = $$("#yearMobAreaResult").attr("data-value");
					var carType = $$("#yearCarResult").attr("data-value");
					
					typeofArea(yearTime,amountType,mobType,items[0].value,carType,'1');
					
				});
			}, false);	
		}
		
		//全部车类选择列表	年地域
		function yearAreaSelectCar(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部车类'
			}, {
				value: '新车',
				text: '新车'
			}, {
				value: '二手车',
				text: '二手车'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showYearCarAreaPicker');
			var userResult = doc.getElementById('yearCarAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaYear").val();
					var amountType = $$("#yearMoneyAreaResult").attr("data-value");
					var mobType = $$("#yearMobAreaResult").attr("data-value");
					var productType = $$("#yearProductAreaResult").attr("data-value");
					
					typeofArea(yearTime,amountType,mobType,productType,items[0].value,'1');
					
				});
			}, false);
		}
		
		//全部金额选择列表	月地域
		function monthAreaSelectMoney(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部金额'
			}, {
				value: '6万以内',
				text: '6万以内'
			}, {
				value: '6万至12万',
				text: '6万至12万'
			}, {
				value: '12万以上',
				text: '12万以上'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showMonthMoneyAreaPicker');
			var userResult = doc.getElementById('monthMoneyAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaMonth").val();
					var mobType = $$("#monthMobAreaResult").attr("data-value");
					var productType = $$("#monthProductAreaResult").attr("data-value");
					var carType = $$("#monthCarAreaResult").attr("data-value");
					
					typeofArea(yearTime,items[0].value,mobType,productType,carType,'2');
					
				});
			}, false);	
		}
		
		//MOB选择列表	月地域
		function monthAreaSelectMob(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: 'MOB1',
				text: 'MOB1'
			}, {
				value: 'MOB2',
				text: 'MOB2'
			}, {
				value: 'MOB3',
				text: 'MOB3'
			}, {
				value: 'MOB4',
				text: 'MOB4'
			}, {
				value: 'MOB4+',
				text: 'MOB4+'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showMonthMobAreaPicker');
			var userResult = doc.getElementById('monthMobAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaMonth").val();
					var amountType = $$("#monthMoneyAreaResult").attr("data-value");
					var productType = $$("#monthProductAreaResult").attr("data-value");
					var carType = $$("#monthCarAreaResult").attr("data-value");
					
					typeofArea(yearTime,amountType,items[0].value,productType,carType,'2');
					
				});
			}, false);	
		}
		
		//全部产品选择列表	月地域
		function monthAreaSelectProduct(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部产品'
			}, {
				value: '小贷',
				text: '小贷'
			}, {
				value: '融资租赁',
				text: '融资租赁'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showMonthProductAreaPicker');
			var userResult = doc.getElementById('monthProductAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaMonth").val();
					var amountType = $$("#monthMoneyAreaResult").attr("data-value");
					var mobType = $$("#monthMobAreaResult").attr("data-value");
					var carType = $$("#monthCarAreaResult").attr("data-value");
					
					typeofArea(yearTime,amountType,mobType,items[0].value,carType,'2');
					
				});
			}, false);	
		}
		
		//全部车类选择列表	月地域
		function monthAreaSelectCar(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部车类'
			}, {
				value: '新车',
				text: '新车'
			}, {
				value: '二手车',
				text: '二手车'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showMonthCarAreaPicker');
			var userResult = doc.getElementById('monthCarAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaMonth").val();
					var amountType = $$("#monthMoneyAreaResult").attr("data-value");
					var mobType = $$("#monthMobAreaResult").attr("data-value");
					var productType = $$("#monthProductAreaResult").attr("data-value");
					
					typeofArea(yearTime,amountType,mobType,productType,items[0].value,'2');
					
				});
			}, false);
		}
		
		//全部金额选择列表	日地域
		function dayAreaSelectMoney(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部金额'
			}, {
				value: '6万以内',
				text: '6万以内'
			}, {
				value: '6万至12万',
				text: '6万至12万'
			}, {
				value: '12万以上',
				text: '12万以上'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showDayMoneyAreaPicker');
			var userResult = doc.getElementById('dayMoneyAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaDay").val();
					var mobType = $$("#dayMobAreaResult").attr("data-value");
					var productType = $$("#dayProductAreaResult").attr("data-value");
					var carType = $$("#dayCarAreaResult").attr("data-value");
					
					typeofArea(yearTime,items[0].value,mobType,productType,carType,'3');
					
				});
			}, false);	
		}
		
		//MOB选择列表	日地域
		function dayAreaSelectMob(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: 'MOB1',
				text: 'MOB1'
			}, {
				value: 'MOB2',
				text: 'MOB2'
			}, {
				value: 'MOB3',
				text: 'MOB3'
			}, {
				value: 'MOB4',
				text: 'MOB4'
			}, {
				value: 'MOB4+',
				text: 'MOB4+'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showDayMobAreaPicker');
			var userResult = doc.getElementById('dayMobAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaDay").val();
					var amountType = $$("#dayMoneyAreaResult").attr("data-value");
					var productType = $$("#dayProductAreaResult").attr("data-value");
					var carType = $$("#dayCarAreaResult").attr("data-value");
					
					typeofArea(yearTime,amountType,items[0].value,productType,carType,'3');
					
				});
			}, false);	
		}
		
		//全部产品选择列表	日地域
		function dayAreaSelectProduct(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部产品'
			}, {
				value: '小贷',
				text: '小贷'
			}, {
				value: '融资租赁',
				text: '融资租赁'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showDayProductAreaPicker');
			var userResult = doc.getElementById('dayProductAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaDay").val();
					var amountType = $$("#dayMoneyAreaResult").attr("data-value");
					var mobType = $$("#dayMobAreaResult").attr("data-value");
					var carType = $$("#dayCarAreaResult").attr("data-value");
					
					typeofArea(yearTime,amountType,mobType,items[0].value,carType,'3');
					
				});
			}, false);	
		}
		
		//全部车类选择列表	日地域
		function dayAreaSelectCar(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: '',
				text: '全部车类'
			}, {
				value: '新车',
				text: '新车'
			}, {
				value: '二手车',
				text: '二手车'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showDayCarAreaPicker');
			var userResult = doc.getElementById('dayCarAreaResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					var yearTime = $$("#areaDay").val();
					var amountType = $$("#dayMoneyAreaResult").attr("data-value");
					var mobType = $$("#dayMobAreaResult").attr("data-value");
					var productType = $$("#dayProductAreaResult").attr("data-value");
					
					typeofArea(yearTime,amountType,mobType,productType,items[0].value,'3');
					
				});
			}, false);
		}
		
		//secondCont选项卡切换
		function tabChangeSecond(){
			var parentBox = $$(".secondCont .tableTitle");
			var subItem = parentBox.find("a");
			subItem.on("tap",function(){
				var curInd = $$(this).index();
				$$(this).addClass("active").siblings("a").removeClass("active mui-active");
				$$(".secondCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
				
				switch(curInd)
				{
					case 1:
						//年趋势
						var yearTime = $$("#onlyYear").val();
						var yearAmountType = $$("#yearMoneyResult").attr("data-value");
						var yearProductType = $$("#yearProductResult").attr("data-value");
						var yearCarType = $$("#yearCarResult").attr("data-value");
						
						typeOfTendency(yearTime,yearAmountType,yearProductType,yearCarType,'1');
						break;
					case 0:
						//月趋势
						var monthTime = $$("#onlyMonth").val();
						var monthAmountType = $$("#monthMoneyResult").attr("data-value");
						var monthProductType = $$("#monthProductResult").attr("data-value");
						var monthCarType = $$("#monthCarResult").attr("data-value");
						
						typeOfTendency(monthTime,monthAmountType,monthProductType,monthCarType,'2');
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
				
				switch(curInd)
				{
					case 2:
					  	//年地域
					  	var yearTime = $$("#areaYear").val();
					  	var amountType = $$("#yearMoneyAreaResult").attr("data-value");
						var mobType = $$("#yearMobAreaResult").attr("data-value");
						var productType = $$("#yearProductAreaResult").attr("data-value");
						var carType = $$("#yearCarAreaResult").attr("data-value");
						typeofArea(yearTime,amountType,mobType,productType,carType,'1')
					  break;
					case 1:
					  	//月地域
						var monthTime = $$("#areaMonth").val();
					  	var monthAmountType = $$("#monthMoneyAreaResult").attr("data-value");
						var monthMobType = $$("#monthMobAreaResult").attr("data-value");
						var monthProductType = $$("#monthProductAreaResult").attr("data-value");
						var monthCarType = $$("#monthCarAreaResult").attr("data-value");
						typeofArea(monthTime,monthAmountType,monthMobType,monthProductType,monthCarType,'2')
					  break;
					case 0:
					  	//日地域
						var dayTime = $$("#areaDay").val();
						var datAmountType = $$("#dayMoneyAreaResult").attr("data-value");
						var dayMobType = $$("#dayMobAreaResult").attr("data-value");
						var dayProductType = $$("#dayProductAreaResult").attr("data-value");
						var dayCarType = $$("#dayCarAreaResult").attr("data-value");
						
						typeofArea(dayTime,datAmountType,dayMobType,dayProductType,dayCarType,'3');
					  break;
				}
				
			})
		}
		
		/*数值部分渲染*/
		
		var myvue=new Vue();//借助第三方vue用来传值
		//渲染底部大区详情
		function randerTopDay(obj,mobValue){
			//请求成功后传递数据
			myvue.$emit('getareadata',obj,mobValue);
		}
		//渲染底部大区详情	日期变更时传参改变
		new Vue({
			el: '#areaBlock',
			data: {
				allData:'',
				areaData: '',
				areaDetail:'',
				cityDetail:'',
				vShow:false,
				curName:'',
				mobType:'',
				curTap:'',
				curTarget:''
			},
			mounted: function(){
				var that = this;
				myvue.$on('getareadata', function(obj,mobValue){
					that.allData = obj;
					that.mobType = mobValue;
					if(obj.area_list.length != 0){
						that.areaData = obj.area_list;
						that.curName = obj.area_list[0].name;
						that.areaDetail = obj.area_detail_list[obj.area_list[0].code];
					}else{
						that.areaData = '';
						that.curName = '';
						that.areaDetail = '';
					}
					
				})
			},
			methods:{
				changeDetailData: function(item){
					//改变高亮
					this.curName = item.name;
					//切换大区时 改变数据 大区详情对应更新
					this.areaDetail = this.allData.area_detail_list[item.code];
					
				},
				showPop: function(curValue,event){
					
					var curIndOne = $$(".fourthCont .active").index();
					var time,amountType,mobType,productType,carType,flagType;
					var posTop = $$(event.currentTarget).position().top;
					var popHeight;//弹框高度
					var curNum = $$(event.currentTarget).index();
					this.curTarget = $$(event.currentTarget);
					$$(".popLoadingBlock").show().css("top",posTop*1-50+"px");
					$$(event.currentTarget).find("button").attr("disabled",true);
					
					if(this.curTap){
						if(this.curTap == curValue){
							if(this.vShow){
								$$(".popLoadingBlock").hide();
							}else{
								$$(".popLoadingBlock").show();
							}
							
						}else{
							$$(".popLoadingBlock").show();
							this.curTap = curValue;
							$$(event.currentTarget).parent().find("li").each(function(i,val){
								if(i != curNum){
									$$(this).find("button").attr("disabled",false);
								}
							})
						}
					}else{
						this.curTap = curValue;
					}
					this.askForPopData(curIndOne,curValue,posTop);
				},
				askForPopData: function(num,curValue,posTop){
					var that = this;
					switch(num){
						case 2:
							flagType = "1";
							time = $$("#areaYear").val();
							amountType = $$("#yearMoneyAreaResult").attr("data-value");
							mobType = $$("#yearMobAreaResult").attr("data-value");
							productType = $$("#yearProductAreaResult").attr("data-value");
							carType = $$("#yearCarAreaResult").attr("data-value");
							break;
						case 1:
							flagType = "2";
							time = $$("#areaMonth").val();
							amountType = $$("#monthMoneyAreaResult").attr("data-value");
							mobType = $$("#monthMobAreaResult").attr("data-value");
							productType = $$("#monthProductAreaResult").attr("data-value");
							carType = $$("#monthCarAreaResult").attr("data-value");
							break;
						case 0:
							flagType = "3";
							time = $$("#areaDay").val();
							amountType = $$("#dayMoneyAreaResult").attr("data-value");
							mobType = $$("#dayMobAreaResult").attr("data-value");
							productType = $$("#dayProductAreaResult").attr("data-value");
							carType = $$("#dayCarAreaResult").attr("data-value");
							break;
					}
					
					var sendInfo = {
						time: time,
						amount_type: amountType,
						mob_type: mobType,
						product_type: productType,
						car_type: carType,	
						city_code: curValue
					}
					
					$$.ajaxData({
						newUrl:"/car/overdue/area/detail.gm",
						type:"get",
						data:{
							flag: flagType,
							bus_param: encodeURIComponent(JSON.stringify(sendInfo))
						},
						callback:function(data){
							//改变弹框内容
							that.cityDetail = data.data.datainfo;
							that.vShow = true;
							$$(".popLoadingBlock").hide();
							
							setTimeout(function(){
								popHeight = $$(".popBlock").height();
								$$(".popBlock").css("top",posTop*1-popHeight*1+"px");
							},0);
						}
					})
				},
				closePop: function(){
					this.vShow = false;
					this.curTarget.find("button").attr("disabled",false);
					//关闭按钮时全部button 取消 disabled属性	上一步骤已实现 多加一层保险
					$$(".eventItem").find("button").attr("disabled",false);
				}
			}
		});
		
		/****************************************格式化金额*********************************************/
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
		
		/************************************格式化金额结束**************************************/
		
		/**************************************图表渲染部分开始**********************************/
		
		//年趋势
		function userCondition(item){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('tzzl'));
		    
		    var option = {
			        tooltip : {
			            trigger: 'axis',
			            confine: true,
			            backgroundColor: 'rgba(87,106,118,0.7)'
			        },
			        legend: {
			            data:['MOB1','MOB2','MOB3','MOB4','MOB4+'],
			            itemGap: 10,
			            itemWidth: 15,
				        itemHeight: 10,
				        /*selectedMode: false,*/
				        textStyle:{
				            fontSize:10,
				            color: '#929292'
				        },
				        bottom: '2%'
			        },
			        grid: {
			            top: '15%',
			            bottom: '15%',
			            left: '3%',
			            right: '3%',
			            containLabel: true
			        },
			        xAxis: [
			            {
			                type : 'category',
			                data : item.time_list,
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
				            name: '',
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
				                formatter: '{value}%'
				            }
				        }
			        ],
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
			        series : [
			            {
			                name: 'MOB1',
			                type: 'line',
			                data: item.mob1_list,
						    itemStyle:{
					            normal:{
					                color:"#f88f8f"
					            }
					        }
			            },
			            {
			                name: 'MOB2',
			                type: 'line',
			                data: item.mob2_list,
						    itemStyle:{
					            normal:{
					                color:"#e26262"
					            }
					        }
			            },
			            {
				            name:'MOB3',
				            type:'line',
				            data: item.mob3_list,
				            itemStyle:{
					            normal:{
					                color:"#d54242"
					            }
					        }
				        },
				        {
				            name:'MOB4',
				            type:'line',
				            data: item.mob4_list,
				            itemStyle:{
					            normal:{
					                color:"#ba2020"
					            }
					        }
				        },
				        {
				            name:'MOB4+',
				            type:'line',
				            data: item.mob4plus_list,
				            itemStyle:{
					            normal:{
					                color:"#a00707"
					            }
					        }
				        }
			        ]
			    };
				
				//使用刚指定的配置项和数据显示图表。
			  	myChart.setOption(option);
		
		}
		
		//年
		function areaInvestMoney(obj,maxNum){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('dytzje'));
		   
			var option = {
			    /*title: {
			        text: '金额',
			        left: 'right',
			        subtext: '(万元)'
			    },*/
			    tooltip: {
			        show: false,
			        trigger: 'item'
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'left',
			        data:['百分比'],
			        show: false
			    },
			    visualMap: {
			        min: 0,
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
			            name: '百分比',
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
			            data:obj.map_list
			        }
			    ]
			};
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		  	
		}
		
})(mui,jQuery,document,window.biMobile)
