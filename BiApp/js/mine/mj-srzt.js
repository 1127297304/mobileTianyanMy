;(function($,$$,doc){
	$.init({
		swipeBack: false//关闭右滑关闭功能
	})
	var obj;//初始请求的全局变量用以缓存数据
	var dateList;//用于存储时间轴数据	即	横轴
	var stzbObj;//首投占比对象	可删除
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
			newUrl:"/meiJie/getThematicAnalysis.gm",
			//newUrl:"../../js/mine/mjwb.json",
			type:"get",
			data:{
				edate:beforeToday
			},
			callback:function(data){
				
				obj = data.data.datainfo;
				//遍历数据中的数值部分
				$$.each(obj.baseInfo,function(i,val){
					if(val != null){
						obj.baseInfo[i] = outputmoney(val.toString());
					}else{
						obj.baseInfo[i] = '-';
					}
				})

				//页面中所有的渲染操作及初始加载时的判断
				randerAllPage(obj);
					
				//遮罩消失
				$$('.mask').css('display','none');

			}
		})
	}
		
		//日期选择
		dateSelect();

		//第一块tab切换区域
		firstTabChange();
/*		//收入趋势选择列表
		getTrend();*/
		//项目分布
		itemDistribution();
		
		//渠道分析选择列表
		stzbSelect();
		
		//借款周期选择列表
		borrowTime();
/*		//收入趋势 的选择
	function getTrend(){

		var userPicker = new $.PopPicker();
		var data=[{
			value: 'wholeIncomeList',
			text: '整体'
		}, {
			value: '5550',
			text: '小额分期'
		}, {
			value: '5501',
			text: 'PD'
		}, {
			value: '5560',
			text: '公积金贷'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showUserPickerItem1');
		var userResult = doc.getElementById('userResultItem1');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				//userResult.setAttribute("data-value",items[0].value);
				//收入趋势
				userCondition(obj.incomeTrend[items[0].value]);
				//realCondition(obj.projectDistributions[items[0].value]);
			});
		}, false);
	}*/
	
		//项目分布
		function itemDistribution(){
				
			var userPicker = new $.PopPicker();
	/*		var data=[{
				value: 'all',
				text: '整体'
			}, {
				value: '5550',
				text: '小额分期'
			}, {
				value: '5501',
				text: 'PD'
			}, {
				value: '5560',
				text: '公积金贷'
			}];*/
			var data=[{
				value: '整体',
				text: '整体'
			}, {
				value: '小额分期',
				text: '小额分期'
			}, {
				value: '现金贷',
				text: '现金贷'
			}, {
				value: '公积金贷',
				text: '公积金贷'
			}, {
				value: '快速借款',
				text: '快速借款'
			}, {
				value: '卡族分期',
				text: '卡族分期'
			}, {
				value: '闪银资产分期',
				text: '闪银资产分期'
			}
			];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showUserPickerItem');
			var userResult = doc.getElementById('userResultItem');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					//console.log(stzbObj[items[0].value]);
					//项目分布
					realCondition(obj.projectDistributions[items[0].value]);
				});
			}, false);
		}
		
		//渠道分析选择列表
		function stzbSelect(){
			
			var userPicker = new $.PopPicker();
			/*var data=[{
				value: 'all',
				text: '整体'
			}, {
				value: '5550',
				text: '小额分期'
			}, {
				value: '5501',
				text: 'PD'
			}, {
				value: '5560',
				text: '公积金贷'
			}];*/
			var data=[{
				value: '整体',
				text: '整体'
			}, {
				value: '小额分期',
				text: '小额分期'
			}, {
				value: '现金贷',
				text: '现金贷'
			}, {
				value: '公积金贷',
				text: '公积金贷'
			}, {
				value: '快速借款',
				text: '快速借款'
			}, {
				value: '卡族分期',
				text: '卡族分期'
			}, {
				value: '闪银资产分期',
				text: '闪银资产分期'
			}
			];
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
					//渠道分析
					firstCondition(obj.channelAnalysis[items[0].value].amountList,obj.channelAnalysis[items[0].value].typeList);
				});
			}, false);	
		}
		
		//借款周期选择列表
		function borrowTime(){
			var userPicker = new $.PopPicker();
			var data=[{
				value: '现金贷',
				text: '现金贷'
			},{
				value: '小额分期',
				text: '小额分期'
			}, {
				value: '公积金贷',
				text: '公积金贷'
			}, {
				value: '快速借款',
				text: '快速借款'
			}, {
				value: '卡族分期',
				text: '卡族分期'
			}, {
				value: '闪银资产分期',
				text: '闪银资产分期'
			}
		];
			userPicker.setData(data);
			var showUserPickerButton = doc.getElementById('showUserPickerBorrow');
			var userResult = doc.getElementById('userResultBorrow');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					userResult.setAttribute("data-value",items[0].value)
					//返回 false 可以阻止选择框的关闭
					//return false;
					
					//console.log(stzbObj[items[0].value]);
					console.log(items[0].value);
					//借款周期
					addCondition(obj.borrowingCycles[items[0].value]);
				});
			}, false);	
		}
		
		//页面中所有的渲染操作及初始加载时的判断
		function randerAllPage(obj){
				
			//渲染echarts图表
				
				//首投占比对象	此块先别删
				/*stzbObj={
					"je":[
						["首投金额","复投金额","首投占比"],
						[obj.firstInvestAmountList,obj.secondInvestAmountList,obj.firstInvestAmountRateList,dateList],
						['(万元)','{value}K']
					],
					"rs":[
						["首投人数","复投人数","首投占比"],
						[obj.firstInvestQuantityList,obj.secondInvestQuantityList,obj.firstInvestQuantityRateList,dateList],
						['(人数)','{value}']
					],
					"cs":[
						["首投次数","复投次数","首投占比"],
						[obj.firstInvestCountList,obj.secondInvestCountList,obj.firstInvestCountRateList,dateList],
						['(次数)','{value}']
					]
				};*/
					
			//判断切换日期后 初始加载页面时对应显示哪个图表
				
				//渲染顶部选项卡的日概览	topDay
				randerTopDay(obj.baseInfo);
				
				/*第一块选项卡切换*/
					var curIndOne = $$(".firstCont .active").index();
					var echartIdOne = $$(".firstCont .tabBlockDetail>div").eq(curIndOne).find(".echartDetail").attr("id");
					//打开页面时维度恢复默认值
					
					switch(echartIdOne)
					{
						case 'tzzl':
						  //收入趋势
							$$("#userResultItem1").text("整体");
							userCondition(obj.incomeTrend);
							//userCondition(obj.incomeTrend);
						  break;
						case 'txzb':
						  //项目分布
						  	$$("#userResultItem").text("整体");
							realCondition(obj.projectDistributions.整体);
							//realCondition(obj.projectDistributions.all);
						  break;
					  	case 'stzb':
						  //渠道分析
						  	$$("#userResult").text("整体");
							firstCondition(obj.channelAnalysis.整体.amountList,obj.channelAnalysis.整体.typeList);
							//firstCondition(obj.channelAnalysis.all.amountList,obj.channelAnalysis.整体.typeList);
					  	  break;
						case 'yyzl':
						  //借款周期
						  	$$("#userResultBorrow").text("现金贷");
							addCondition(obj.borrowingCycles.现金贷);
							//addCondition(obj.borrowingCycles[5501]);
						  break;
						
					}
		}
		
		//日期选择
		function dateSelect(){
			$$("#calendars").on("change",function(){
				var curDate =  $$(this).val();
				//判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
				//在此获取选择的日期重新发送请求
				if((new Date(curDate) >= new Date("2017-03-12")) && (new Date(curDate) <= new Date(beforeToday))){
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
	
		//第一块tab切换区域
		function firstTabChange(){
			var parentBox = $$(".firstCont .tableTitle");
			var subItem = parentBox.find("a");
			subItem.on("tap",function(){
				var curInd = $$(this).index();
				$$(this).addClass("active").siblings("a").removeClass("active mui-active");
				$$(".firstCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
				//加载对应的图表
				var href = $$(".firstCont .tabBlockDetail>div:eq("+curInd+")").find(".echartDetail").attr("id");
				
				switch(href)
				{
					case 'tzzl':
					  //收入趋势
						userCondition(obj.incomeTrend);
					  break;
					case 'txzb':
					  //项目分布
					  	$$("#userResultItem").text("整体");
						realCondition(obj.projectDistributions.整体);
					  break;
				  	case 'stzb':
					  //渠道分析
					  $$("#userResult").text("整体");
						firstCondition(obj.channelAnalysis.整体.amountList,obj.channelAnalysis.整体.typeList);
				  	  break;
					case 'yyzl':
					  //借款周期
					  $$("#userResultBorrow").text("现金贷");
						//addCondition(obj.borrowingCycles[5501]);
						addCondition(obj.borrowingCycles.现金贷);
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
		//渲染顶部区域日概览	日期变更	或者	维度变更时传参改变
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
					that.topDayData = obj;
					that.getNumDay();
				})
			},
			methods:{
				getNumDay: function(){
					var itemValue = this.topDayData.monthCumulativeAmount.toString();//获取金额格式化后的值
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
		
		/**********************************************格式化金额结束*************************************************/
		
		/**********************************************图表渲染部分开始***********************************************/
		
		//渠道分析
		function firstCondition(obj,dateList){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('stzb'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data:[''],
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
		                data : dateList,
		                axisTick: {
			                alignWithLabel: true,
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
			            name: '(万元)',
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
		            {
			            name:'',
			            type:'bar',
			            data:obj,
			            itemStyle:{
				            normal:{
				                color:"#6FC3FF"
				            }
				        }
			        }
		        ]
		    };
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		
		}
		
		//收入趋势
		function userCondition(obj){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('tzzl'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data:['整体','现金贷','小额分期','公积金贷','快速借款','卡族分期','闪银资产分期'],
		            itemGap: 10,
		            itemWidth:15,
			        itemHeight:10,
			        /*selectedMode:false,*/
			        textStyle:{
			            fontSize:10,
			            color: '#929292'
			        },
			        bottom:'0%'
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
		                data : obj.dateList,
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
			            name: '(万元)',
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
		            {
		                name: '整体',
		                type: 'line',
		                data: obj.wholeIncomeList,
					    itemStyle:{
				            normal:{
				                color:"#83B9F5"
				            }
				        }
		            },
		            {
		                name: '现金贷',
		                type: 'line',
		                data: obj.pdIncomeList,
					    itemStyle:{
				            normal:{
				                color:"#B515E8"
				            }
				        }
		            },
		            {
			            name:'小额分期',
			            type:'line',
			            data: obj.spIncomeList,
			            itemStyle:{
				            normal:{
				                color:"#FF9211"
				            }
				        }
			        },
			        {
			            name:'公积金贷',
			            type:'line',
			            data: obj.gjjIncomeList,
			            itemStyle:{
				            normal:{
				                color:"lightgreen"
				            }
				        }
			        },
					{
						name:'快速借款',
						type:'line',
						data: obj.fastLendIncomeList,
						itemStyle:{
							normal:{
								color:"yellow"
							}
						}
					},
					{
						name:'卡族分期',
						type:'line',
						data: obj.cardPeriodIncomeList,
						itemStyle:{
							normal:{
								color:"red"
							}
						}
					},
					{
						name:'闪银资产分期',
						type:'line',
						data: obj.shanyinzcIncomeList,
						itemStyle:{
							normal:{
								color:"blue"
							}
						}
					}
		        ]
		    };
		
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		}
		
		//项目分布
		function realCondition(obj){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('txzb'));
		    
		    var option = {
			        tooltip: {
				        trigger: 'item',
				        formatter: "{a} <br/>{b}: {c} ({d}%)",
				        confine: true
				    },
				    series: [  
				        {
				            name:'访问来源',
				            type:'pie',
				            silent: true,
				            labelLine: {
				            	normal: {
				            		length: 12,
				            		length2: 8
				            	}
				            },
				            center: ['50%', '44%'],
				            radius: ['30%', '43%'],
				            data: obj
				        }
				    ]
		    };
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		}
		
		//借款周期
		function addCondition(obj){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('yyzl'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data:[''],
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
		        grid: {//只有横向时grid的值需要调整
		            top: '15%',
		            bottom: '15%',
		            left: '5%',
		            right: '6%',
		            containLabel: true
		        },
		        xAxis: [
		            {
		                type : 'value',
		                name : '(万元)',
		                nameGap :0,
						nameRotate:25,
						nameLocation: 'start',
		                /*data : date,*/
		                axisTick:{
			                show:false
			            },
			            axisLine:{
			                show:false,
			                lineStyle:{
			                    type:"dotted"
			                }
			            },
			            splitLine:{
			            	show:true,
			                lineStyle:{
			                    type:"dotted"
			                }
			            }
		            }
		        ],
		        yAxis: [
		            {
			            type: 'category',
			            name: '',
			            axisLine:{
			                show:false
			            },
			            data : obj.dateList,
			            axisTick: {
			                alignWithLabel: true,
			                show:false
			            },
			            splitLine:{
			            	show:false,
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
		        series : [
		            {
			            name:'',
			            type:'bar',
			            data:obj.amountList,
			            itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
			        }
		        ]
		    };
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		
		}

})(mui,jQuery,document)
