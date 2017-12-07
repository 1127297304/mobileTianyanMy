;(function($,$$,doc,appGlobal){
	$.init({
		swipeBack: false//关闭右滑关闭功能
	})

	var obj;//初始请求的全局变量用以缓存数据
	var dateList;//用于存储时间轴数据	即	横轴
	var stzbObj;//首投占比对象	
	var moneyMax;//地域分布-投资金额最大值
	var peopleMax;//地域分布-投资人数最大值
	var beforeToday;//当天前一天的完整日期格式
	var showTime ;//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
	
	//给所有的tab标签添加局部滚动
	mui('.mui-scroll-wrapper').scroll();
	
	//判断当前显示的时间
	showCurTime();
	
	//判断当前的显示时间
	function showCurTime(){
		
		//获取当前日期	如果当天为1号则取上个月最后一天的日期
		beforeToday=GetDateStr(-1);
		
		$$("#calendars").val(beforeToday);//在页面中显示当前日期
		
		//默认发送请求（请求当前日期的数据）
		askForDataBefore(beforeToday);
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
	function askForDataBefore(beforeToday){
		
		showTime = beforeToday;//当前页面显示的日期永远是符合时间范围内的日期
		
		$$.ajaxData({
			newUrl:"/meiYiFinancing/getMeiYiFinancingDashboardModel.gm",
			//newUrl:"../../js/mine/mylc.json",
			type:"get",
			data:{
				edate:beforeToday
			},
			callback:function(data){
				
				obj = data.data.datainfo;
				//遍历数值部分
				$$.each(obj,function(i,val){
					if(typeof val != 'object'){
						obj[i] = outputmoney(val.toString());
					}
					if(	val == null ){
						obj[i] = '-';
					}
				})
				
				dateList = data.data.datainfo.dateList;
				
				//页面中所有的渲染操作及初始加载时的判断
				randerAllPage(obj);
					
				//遮罩消失
				$$('.mask').css('display','none');

			}
		})
	}
		
		//进度条插件
		function progressCondition(obj){
			
			//入口
	 		appGlobal.util.init();
	 		
	 		new appGlobal.progress('progress2',{
				totalData:appGlobal.util.stringToNumber(100),	//项目计划总完成量
				planData:appGlobal.util.stringToNumber(obj.schedule),	//时间进度
				actualData:appGlobal.util.stringToNumber(obj.actualCompleteRate)		//月实际完成率
			});
	 		
		}
		
		//日期选择
		dateSelect();
		
		//首投占比选择列表
		stzbSelect();
		
		//first选项卡切换
		tabChange();
		
		//secondCont选项卡切换
		tabChangeSecond();
		
		//thirdCont选项卡切换
		tabChangeThird();
		
		//fourth选项卡切换
		tabChangeFourth();
		
		//指标说明弹框
    	tipsExplain();
		
		//页面中所有的渲染操作及初始加载时的判断
		function randerAllPage(obj){
				
			//渲染echarts图表
				
				//首投占比对象
				stzbObj={
					"je":[
						["首投金额","复投金额","首投占比"],
						[obj.firstInvestAmountList,obj.secondInvestAmountList,obj.firstInvestAmountRateList],
						['(千万)','{value}']
					],
					"rs":[
						["首投人数","复投人数","首投占比"],
						[obj.firstInvestQuantityList,obj.secondInvestQuantityList,obj.firstInvestQuantityRateList],
						['(人数)','{value}']
					],
					"cs":[
						["首投次数","复投次数","首投占比"],
						[obj.firstInvestCountList,obj.secondInvestCountList,obj.firstInvestCountRateList],
						['(次数)','{value}']
					]
				};
					
			//判断切换日期后 初始加载页面时对应显示哪个图表
				/*第一块*/
					var curIndOne = $$(".firstCont .active").index();
					$$(".firstCont .tabBlockDetail>div").eq(curIndOne).addClass("show").siblings().removeClass();
					switch(curIndOne){
						case 0:
							//渲染顶部选项卡的日概览	topDay
							randerTopDay(obj);
							break;
						case 1:
							//进度条插件
							progressCondition(obj);
							
							//渲染顶部选项卡的月概览	topMonth
							randerTopMonth(obj);
							break;
					}
					
				/*第二块*/
					var curIndTwo = $$(".secondCont .active").index();
					var echartIdTwo = $$(".secondCont .tabBlockDetail>div").eq(curIndTwo).find(".echartDetail").attr("id");
					
					switch(echartIdTwo)
					{
						case 'tzzl':
						  //投资增量
						  $$("#monthTarget").text(obj.targetAmount);//月目标投资金额
						  userCondition(obj,dateList);
						  break;
						case 'stzb':
						  //首投占比
						  $$("#userResult").text("首投金额");
						  firstCondition(stzbObj.je,dateList);
						  break;
						case 'txtb':
						  //提现占比
						  withdrawCondition(obj,dateList);
						  break;
						case 'yyzl':
						  //预约增量
						  orderCondition(obj,dateList);
						  break;
					}
					
				/*第三块*/
					var curIndThree = $$(".thirdCont .active").index();
					var echartIdThree = $$(".thirdCont .tabBlockDetail>div").eq(curIndThree).find(".echartDetail").attr("id");
					
					switch(echartIdThree)
					{
						case 'yhgm':
						  //用户规模
							userCount(obj,dateList);
						  break;
						case 'xzyh':
						  //新增用户
							newUser(obj,dateList);
						  break;
					}
					
				/*第四块*/
					//地域分布-投资金额
					moneyMax = obj.investMoney.maxNum;//地图数据中的最大值
					//地域分布-投资人数
					peopleMax = obj.investPeople.maxNum;//地图数据中的最大值
					
					var curIndFour = $$(".fourthCont .active").index();
					var echartIdFour = $$(".fourthCont .tabBlockDetail>div").eq(curIndFour).find(".echartDetail").attr("id");
					
					switch(echartIdFour)
					{
						case 'dytzje':
						  //地域分布-投资金额
							areaInvestMoney(obj,moneyMax);
						  break;
						case 'dytzrs':
						  //地域分布-投资人数
							areaInvestPeople(obj,peopleMax);
						  break;
					  	
					}
		}
		
		//指标说明弹框
	    function tipsExplain(){
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
	    	
	    }
		
		//日期选择
		function dateSelect(){
			$$("#calendars").on("change",function(){
				var curDate =  $$(this).val();
				//判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
				//在此获取选择的日期重新发送请求
				if((new Date(curDate) >= new Date("2017-04-01")) && (new Date(curDate) <= new Date(beforeToday))){
					//遮罩出现
					$$('.mask').css('display','block');
					
					askForDataBefore(curDate);
				}
				else{
					$.toast('不在可支持的统计时间范围内');
					$$(this).val(showTime);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
				}
			})		
		}
	
		//首投占比选择列表
		function stzbSelect(){
			//普通示例
			var userPicker = new $.PopPicker();
			var data=[{
				value: 'je',
				text: '首投金额'
			}, {
				value: 'rs',
				text: '首投人数'
			}, {
				value: 'cs',
				text: '首投次数'
			}];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showUserPicker');
			var userResult = doc.getElementById('userResult');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					//console.log(stzbObj[items[0].value]);
					firstCondition(stzbObj[items[0].value],dateList);
				});
			}, false);	
		}
	
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
						//渲染顶部选项卡的日概览	topDay
						randerTopDay(obj);
						break;
					case 1:
						//进度条插件
						progressCondition(obj);
						
						//渲染顶部选项卡的月概览	topMonth
						randerTopMonth(obj);
						break;
				}
				
			})
		}
		
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
					case "tzzl":
						//投资增量
						$$("#monthTarget").text(obj.targetAmount);//月目标投资金额
						userCondition(obj,dateList);
						break;
					case "stzb":
						//首投占比
						$$("#userResult").text("首投金额");
						firstCondition(stzbObj.je,dateList);
						break;
					case 'txtb':
					 	//提现占比
					  	withdrawCondition(obj,dateList);
					  	break;
					case 'yyzl':
					  	//预约增量
					  	orderCondition(obj,dateList);
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
					case "yhgm":
						//用户规模
						userCount(obj,dateList);
						break;
					case "xzyh":
						//新增用户
						newUser(obj,dateList);
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
						areaInvestMoney(obj,moneyMax);
					  break;
					case 'dytzrs':
					  //地域分布-投资人数
						areaInvestPeople(obj,peopleMax);
					  break;
				}
				
			})
		}
		
		/*数值部分渲染*/
		
		var myvue=new Vue();//借助第三方vue用来传值
		//渲染顶部区域日概览
		function randerTopDay(obj){
			//请求成功后传递数据
			myvue.$emit('getdataDay',obj);
		}
		//渲染顶部区域日概览	日期变更时传参改变
		new Vue({
			el: '#topDay',
			data: {
				big: '',
				small: '',
				topDayData: ''
			},
			mounted: function(){
				var that = this;
				myvue.$on('getdataDay', function(obj){
					that.topDayData=obj;
					that.getNumDay();
				})
			},
			methods:{
				getNumDay: function(){
					var itemValue = this.topDayData.dailyAmount.toString();//获取金额格式化后的值
					if(itemValue.indexOf('.') != -1){
						this.big = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
						this.small = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
					}else{
						this.big = itemValue;
						this.small = '';
					}
				}
			}
		});
		//渲染顶部区域月概览
		function randerTopMonth(obj){
			//请求成功后传递数据
			myvue.$emit('getdataMonth',obj);
		}
		//渲染顶部区域月概览	日期变更	或者	维度变更时传参改变
		new Vue({
			el: '#topMonth',
			data:{
				kpiBig: '',
				kpiSmall: '',
				topMonthData: '',
				comBig: '',
				comSmall: ''
			},
			mounted: function(){
				var that = this;
				myvue.$on('getdataMonth', function(obj){
					that.topMonthData=obj;
					that.getNumMonth();
				})
			},
			methods:{
				getNumMonth: function(){
					var itemValue = this.topMonthData.targetAmount.toString();//获取kpi金额格式化后的值
					if(itemValue.indexOf('.') != -1 ){
						this.kpiBig = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
						this.kpiSmall = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
					}else{
						this.kpiBig = itemValue;
						this.kpiSmall = '';
					}
					
					var realCom = this.topMonthData.monthAmount.toString();//获取总通过率格式化后的值
					if(realCom.indexOf('.') != -1 ){
						this.comBig = realCom.slice(0,realCom.indexOf('.'));//截取小数点以前的金额
						this.comSmall = realCom.slice(realCom.indexOf('.'));//截取小数点以后的金额
					}else{
						this.comBig = realCom;
						this.comSmall = '';
					}
					
				}
			}
		})
		
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
		
		//投资增量
		function userCondition(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('tzzl'));
		    
		    var option = {
			        tooltip : {
			            trigger: 'axis',
			            confine: true,
			            backgroundColor: 'rgba(87,106,118,0.7)'
			        },
			        legend: {
			            data:['目标投资金额','实际投资金额'],
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
			                data : date,
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
				                formatter: '{value}'
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
			            /*{
			                name: '到期金额',
			                type: 'bar',
			                data: obj.interestPeriodAmountList,
						    itemStyle:{
					            normal:{
					                color:"#19b6ff"
					            }
					        }
			            },*/
			            {
			                name: '目标投资金额',
			                type: 'line',
			                data: obj.targetAmountOfEveryDayList,
						    itemStyle:{
					            normal:{
					                color:"#83B9F5"
					            }
					        }
			            },
			            {
				            name:'实际投资金额',
				            type:'line',
				            data: obj.aomuntOfEveryDayList,
				            itemStyle:{
					            normal:{
					                color:"#B515E8"
					            }
					        }
				        }
			        ]
			    };
				
				//使用刚指定的配置项和数据显示图表。
			  	myChart.setOption(option);
		
			}
		
		//首投占比
		function firstCondition(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('stzb'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data: obj[0],
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
		                data : date,
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
			            name: obj[2][0],
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
			                formatter: obj[2][1]
			            }
			        },
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
			            max: 40,
			            interval: 10,控制最大值、最小值及幅度*/
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
		                name: obj[0][0],
		                type: 'bar',
		                data: obj[1][0],
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: obj[0][1],
		                type: 'bar',
		                data: obj[1][1],
					    itemStyle:{
				            normal:{
				                color:"#2BE1CF"
				            }
				        }
		            },
		            {
			            name: obj[0][2],
			            type:'line',
			            yAxisIndex: 1,
			            data: obj[1][2],
			            itemStyle:{
				            normal:{
				                color:"#F8405F"
				            }
				        }
			        }
		        ]
		    };
				
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
			
		}
		
		//提现占比
		function withdrawCondition(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('txtb'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data:['到期金额','提取金额','提取占比'],
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
		                data : date,
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
			                formatter: '{value}'
			            }
			        },
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
			            max: 40,
			            interval: 10,控制最大值、最小值及幅度*/
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
		                name: '到期金额',
		                type: 'bar',
		                data: obj.interestPeriodAmountList,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '提取金额',
		                type: 'bar',
		                data: obj.withDrawAmountList,
					    itemStyle:{
				            normal:{
				                color:"#2BE1CF"
				            }
				        }
		            },
		            {
			            name:'提取占比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.withDrawRateList,
			            itemStyle:{
				            normal:{
				                color:"#F8405F"
				            }
				        }
			        }
		        ]
		    };
				
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
			
		}
		
		//预约增量
		function orderCondition(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('yyzl'));
		    
		    var option = {
			        tooltip : {
			            trigger: 'axis',
			            confine: true,
			            backgroundColor: 'rgba(87,106,118,0.7)'
			        },
			        legend: {
			            data:['预约金额'],
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
			                data : date,
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
				                formatter: '{value}'
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
			            /*{
			                name: '到期金额',
			                type: 'bar',
			                data: obj.interestPeriodAmountList,
						    itemStyle:{
					            normal:{
					                color:"#19b6ff"
					            }
					        }
			            },*/
			            {
			                name: '预约金额',
			                type: 'line',
			                data: obj.appiontAmountList,
						    itemStyle:{
					            normal:{
					                color:"#19b6ff"
					            }
					        }
			            }
			        ]
			    };
				
				//使用刚指定的配置项和数据显示图表。
			  	myChart.setOption(option);
			
		}
		
		//用户规模
		function userCount(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('yhgm'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data:['DAU','投资人数','投资转化率'],
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
		                data : date,
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
			                formatter: '{value}'
			            }
			        },
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
			            max: 40,
			            interval: 10,控制最大值、最小值及幅度*/
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
		                name: 'DAU',
		                type: 'bar',
		                data: obj.totalActiveQuantityList,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '投资人数',
		                type: 'bar',
		                data: obj.totalInvestQuantityList,
					    itemStyle:{
				            normal:{
				                color:"#2BE1CF"
				            }
				        }
		            },
		            {
			            name:'投资转化率',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.totalInvestQuantityRateList,
			            itemStyle:{
				            normal:{
				                color:"#F8405F"
				            }
				        }
			        }
		        ]
		    };
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		}
		
		//新增用户
		function newUser(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('xzyh'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data:['DAU','新增注册用户数','新增占比'],
		            itemGap: 10,
		            itemWidth:15,
			        itemHeight:10,
			        /*selectedMode:false,*/
			        textStyle:{
			            fontSize:10,
			            color: '#929292'
			        },
			        bottom: '2%'
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
		                data : date,
		                axisTick: {
			                show:false
			            },
			            axisLine: {
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
			                formatter: '{value}'
			            }
			        },
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
			            max: 40,
			            interval: 10,控制最大值、最小值及幅度*/
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
		                name: 'DAU',
		                type: 'bar',
		                data: obj.totalActiveQuantityList,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '新增注册用户数',
		                type: 'bar',
		                data: obj.totalRegisterQuantityList,
					    itemStyle:{
				            normal:{
				                color:"#2BE1CF"
				            }
				        }
		            },
		            {
			            name:'新增占比',
			            type:'line',
			            yAxisIndex: 1,
			            data:obj.totalRegisterQuantityListRateList,
			            itemStyle:{
				            normal:{
				                color:"#F8405F"
				            }
				        }
			        }
		        ]
		    };
		
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		}
		
		//地域分布-投资金额
		function areaInvestMoney(obj,maxNum){
			
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
			            data:obj.investMoney.cityList
			        }
			    ]
			};
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		  	
		}
		
		//地域分布-投资人数
		function areaInvestPeople(obj,maxNum){
			
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
			        min: 0,
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
			            data:obj.investPeople.cityList
			        }
			    ]
			};
			
			//使用刚指定的配置项和数据显示图表
		  	myChart.setOption(option);
		  	
		}
		
})(mui,jQuery,document,window.biMobile)
