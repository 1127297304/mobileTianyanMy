;(function($,$$,doc,appGlobal){
	$.init({
		swipeBack: false//关闭右滑关闭功能
	})

	var globalObj;//初始请求的全局变量用以缓存数据
	var obj;//当前维度的所有数据
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
		//初始化设置
		$$("#subItem").html('整体<span></span>');//默认加载整体的数据
		$$("#subList>li:first").addClass("active").siblings().removeClass();//默认选中整体维度
		
		$$.ajaxData({
			newUrl:"/meijie/getMeiJieDashboardModelNew.gm",
			//newUrl:"../../js/mine/mj.json",
			type:"get",
			data:{
				edate:beforeToday
			},
			callback:function(data){
				
				globalObj = data.data.datainfo;
				//遍历整体、自营、外部中所有的 monthBaseInfo和dayBaseInfo字段
				$$.each(globalObj,function(i,val){
					if( i != 'dateList' ){
						$.each(globalObj[i],function(j,ele){
							if( j == "dayBaseInfo" || j == "monthBaseInfo"){
								$.each(globalObj[i][j],function(k,item){
									if(item != null){
										globalObj[i][j][k] = outputmoney(item.toString());
									}else{
										globalObj[i][j][k] = '-';
									}
								})
							}
						})
					}
				})
				obj = globalObj.allInfo;	//当前默认显示整体维度
				dateList = data.data.datainfo.dateList;
				
				
				
				//页面中所有的渲染操作及初始加载时的判断
				randerAllPage(obj);
					
				//遮罩消失
				$$('.mask').css('display','none');

			}
		})
	}
	
		//切换全局维度
		function changeGlobalWay(){
			//切换全局维度 整体、自营、外部, 改变全局变量		数据渲染成功后才可选择
			$$("#subItem").on("tap",function(){
				
				$$("#subList").toggleClass("active");
				$$("#mark").toggleClass("active");
				if($$("#mark").hasClass("active")){
					$$("#calendars").attr("disabled",true);
				}
				else{
					$$("#calendars").attr("disabled",false);
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
				actualData:appGlobal.util.stringToNumber(obj.doneRate)		//月实际完成率
			});
	 		
		}
		
		//给顶部整体、自营、外部二级菜单添加点击事件	及改变维度重新渲染
		addSubListEvent();
		
		//点击遮罩层	遮罩层消失并且二级菜单隐藏
		$$("#mark").on("tap",function(){
			$$(this).removeClass("active");
			$$("#subList").removeClass("active");
			$$("#calendars").attr("disabled",false);
		})
		
		//切换全局维度
		changeGlobalWay();
		
		//日期选择
		dateSelect();
		
		//first选项卡切换
		tabChange();
		
		//secondCont选项卡切换
		tabChangeSecond();
		
		//thirdCont选项卡切换
		tabChangeThird();
		
		//fourth选项卡切换
		tabChangeFourth();
		
		//给二级菜单添加点击事件
		function addSubListEvent(){
			//点击二级菜单时切换维度显示
			$$("#subList").on("tap","li",function(){
				var curText = $$(this).text();//获取当前点击的文本
				var curVal = $$(this).attr("data-value");//获取当前维度的自定义属性
				
				$$(this).addClass("active").siblings().removeClass();//给二级菜单添加点击样式
				$$(this).parent().removeClass("active");//选中后二级菜单消失
				$$("#subItem").html(curText+'<span></span>');//更改页面的维度显示
				$$("#mark").toggleClass("active");//遮罩消失
				$$("#calendars").attr("disabled",false);
				
				//改变全局变量并重新渲染页面
				obj= globalObj[curVal];
				//页面中所有的渲染操作及初始加载时的判断
				randerAllPage(obj);
				
			})
		}
		
		//页面中所有的渲染操作及初始加载时的判断
		function randerAllPage(obj){
				
			//渲染echarts图表
				
				//首投占比对象
				stzbObj={
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
							progressCondition(obj.monthBaseInfo);
							
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
						  //日完成金额
						  userCondition(obj.dayFinishChart,dateList);
						  break;
						case 'stzb':
						  //月累计金额
						  firstCondition(obj.monthAddAmountChart,dateList);
						  break;
					}
					
				/*第三块*/
					var curIndThree = $$(".thirdCont .active").index();
					var echartIdThree = $$(".thirdCont .tabBlockDetail>div").eq(curIndThree).find(".echartDetail").attr("id");
					
					switch(echartIdThree)
					{
						case 'yhgm':
						  //系统通过率
							userCount(obj.riskPassChart,dateList);
						  break;
						case 'xzyh':
						  //电核通过率
							newUser(obj.telCheckPassChart,dateList);
						  break;
						case "txzb":
						  //放款率
							realCondition(obj.loanRateChart,dateList);
						break;
					}
					
				/*第五块*/
					//美借用户规模
					mjuserCount(obj,dateList);//无需进行初始判断
					
				/*第四块*/
					//地域分布-进件
					moneyMax = obj.areaMapPiecesChart.topNum;//地图数据中的最大值
					//地域分布-交易
					peopleMax = obj.areaMapLoanChart.topNum;//地图数据中的最大值
					
					var curIndFour = $$(".fourthCont .active").index();
					var echartIdFour = $$(".fourthCont .tabBlockDetail>div").eq(curIndFour).find(".echartDetail").attr("id");
					
					switch(echartIdFour)
					{
						case 'dytzje':
						  //地域分布-进件
							areaInvestMoney(obj.areaMapPiecesChart,moneyMax);
							//地域分布-进件中的城市列表渲染
							randerAreaMoney(obj.areaMapPiecesChart);
						  break;
						case 'dytzrs':
						  //地域分布-交易
							areaInvestPeople(obj.areaMapLoanChart,peopleMax);
							//地域分布-交易中的城市列表渲染
							randerAreaPeople(obj.areaMapLoanChart);
						  break;
					  	
					}
		}
		
		//日期选择
		function dateSelect(){
			$$("#calendars").on("change",function(){
				var curDate =  $$(this).val();
				//判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
				//在此获取选择的日期重新发送请求
				if((new Date(curDate) >= new Date("2016-10-01")) && (new Date(curDate) <= new Date(beforeToday))){
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
						progressCondition(obj.monthBaseInfo);
						
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
						//日完成金额
						userCondition(obj.dayFinishChart,dateList);
						break;
					case "stzb":
						//月累计金额
						firstCondition(obj.monthAddAmountChart,dateList);
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
						//系统通过率
						userCount(obj.riskPassChart,dateList);
						break;
					case "xzyh":
						//电核通过率
						newUser(obj.telCheckPassChart,dateList);
						break;
					case "txzb":
						//放款率
						realCondition(obj.loanRateChart,dateList);
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
					  //地域分布-进件
						areaInvestMoney(obj.areaMapPiecesChart,obj.areaMapPiecesChart.topNum);
						//地域分布-进件中的城市列表渲染
						randerAreaMoney(obj.areaMapPiecesChart);
					  break;
					case 'dytzrs':
					  //地域分布-交易
						areaInvestPeople(obj.areaMapLoanChart,obj.areaMapLoanChart.topNum);
						//地域分布-交易中的城市列表渲染
						randerAreaPeople(obj.areaMapLoanChart);
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
					that.topDayData=obj.dayBaseInfo;
					that.getNumDay();
				})
			},
			methods:{
				getNumDay: function(){
					if(this.topDayData.loanAmount == null){
						var itemValue = '-';
					}
					else{
						var itemValue = this.topDayData.loanAmount.toString();//获取金额格式化后的值
					}
					if(itemValue.indexOf('.') != -1 ){
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
					that.topMonthData=obj.monthBaseInfo;
					that.getNumMonth();
				})
			},
			methods:{
				getNumMonth: function(){
					//KPI
					if(this.topMonthData.kpi == null){
						var itemValue = '-';
					}
					else{
						var itemValue = this.topMonthData.kpi.toString();//获取kpi金额格式化后的值
					}
					if(itemValue.indexOf('.') != -1){
						this.kpiBig = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
						this.kpiSmall = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
					}else{
						this.kpiBig = itemValue;
						this.kpiSmall = '';
					}
					
					//实际进度
					if(this.topMonthData.monthLoanAmount == null){
						var realCom = '-';
					}
					else{
						var realCom = this.topMonthData.monthLoanAmount.toString();//获取总通过率格式化后的值
					}
					if(realCom.indexOf('.') != -1){
						this.comBig = realCom.slice(0,realCom.indexOf('.'));//截取小数点以前的金额
						this.comSmall = realCom.slice(realCom.indexOf('.'));//截取小数点以后的金额
					}else{
						this.comBig = realCom;
						this.comSmall = '';
					}
				}
			}
		})
		
		//地域分布-进件中的城市列表渲染
		function randerAreaMoney(obj){
			//请求成功后传递数据
			myvue.$emit('areaJj',obj);
		}
		////地域分布-进件中的城市列表渲染vue
		new Vue({
			el: '#cityListM',
			data:{
				top: '',
				dTop: ''
			},
			mounted: function(){
				var that = this;
				myvue.$on('areaJj', function(obj){
					that.top = obj.top5Data;
					that.dTop = obj.negative5Data
				})
			}
		})
		
		//地域分布-交易中的城市列表渲染
		function randerAreaPeople(obj){
			//请求成功后传递数据
			myvue.$emit('areaJy',obj);
		}
		//地域分布-交易中的城市列表渲染vue
		new Vue({
			el: '#cityListP',
			data:{
				top: '',
				dTop: ''
			},
			mounted: function(){
				var that = this;
				myvue.$on('areaJy', function(obj){
					that.top = obj.top5Data;
					that.dTop = obj.negative5Data
				})
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
		
		/**********************************************格式化金额结束*************************************************/
		
		/**********************************************图表渲染部分开始***********************************************/
		
		//日完成金额
		function userCondition(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('tzzl'));
		    
		    var option = {
			        tooltip : {
			            trigger: 'axis',
			            confine: true,
		            	backgroundColor: 'rgba(87,106,118,0.7)',
		            	formatter:function(params){
			            	var str=params[0].name+'</br>';
			            	var divideNum , col;
			            	$.each(params,function(i,val){
			            		col=option.series[i].itemStyle.normal.color;
			            		str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col+'"></span>'+val.seriesName+' ：'+val.value+'</br>';
			            	})
			            	divideNum=(params[0].value/params[1].value).toFixed(2);
			            	str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:lightgreen"></span>件均 : '+divideNum;
			            	return str;
			            }
			        },
			        legend: {
			            //data:obj[0],
			            data:['交易金额','交易件数'],
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
				            name: '(万元)',
				            //name: obj[2][0],
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
				                //formatter: obj[2][1]
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
			                name: '交易金额',
			                type: 'bar',
			                data: obj.ja_amount,
						    itemStyle:{
					            normal:{
					                color:"#6FC3FF"
					            }
					        }
			            },
			            {
				            name: '交易件数',
				            type:'line',
				            yAxisIndex: 1,
				            data: obj.ja_count,
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
		
		//月累计金额
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
			            data:['目标完成金额','实际完成金额'],
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
			                name: '目标完成金额',
			                type: 'line',
			                data: obj.targetAmount,
						    itemStyle:{
					            normal:{
					                color:"#19b6ff"
					            }
					        }
			            },
			            {
				            name:'实际完成金额',
				            type:'line',
				            data:obj.truthAmount,
				            itemStyle:{
					            normal:{
					                color:"#fb833b"
					            }
					        }
				        }
			        ]
			    };
				
				//使用刚指定的配置项和数据显示图表。
			  	myChart.setOption(option);
			
		}
		
		//放款率
		function realCondition(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('txzb'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)',
		            formatter:'{b}</br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#F8405F"></span>{a0} ：{c0}%'
		        },
		        legend: {
		            data:['放款率'],
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
			            name:'放款率',
			            type:'line',
			            data:obj,
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
		
		//系统通过率
		function userCount(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('yhgm'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)',
		            formatter:'{b}</br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#738ffe"></span>{a0} ：{c0}</br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#26a69a"></span>{a1} ：{c1}</br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#e84e40"></span>{a2} ：{c2}%'
		        },
		        legend: {
		            data:['进入系统用户数','系统通过用户数','系统通过率'],
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
			            name: '(人数)',
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
		                name: '进入系统用户数',
		                type: 'bar',
		                data: obj.risk_pieces,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '系统通过用户数',
		                type: 'bar',
		                data: obj.risk_risk,
					    itemStyle:{
				            normal:{
				                color:"#2BE1CF"
				            }
				        }
		            },
		            {
			            name:'系统通过率',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.risk_rate,
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
		
		//美借用户规模
		function mjuserCount(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('mjyhgm'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data:['注册用户数','进件用户数','交易用户数'],
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
			        }/*,
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
//			            min: 0,
//			            max: 40,
//			            interval: 10,控制最大值、最小值及幅度
			            axisLabel: {
			                formatter: '{value}%'
			            }
			        }*/
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
		                name: '注册用户数',
		                type: 'line',
		                data: obj.registerQuantityList,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '进件用户数',
		                type: 'line',
		                data: obj.intoPiecesCountList,
					    itemStyle:{
				            normal:{
				                color:"#2BE1CF"
				            }
				        }
		            },
		            {
			            name:'交易用户数',
			            type:'line',
			            /*yAxisIndex: 1,*/
			            data: obj.jaQuantity,
			            itemStyle:{
				            normal:{
				                color:"#FFB16D"
				            }
				        }
			        }
		        ]
		    };
		
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		}
		
		//电核通过率
		function newUser(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('xzyh'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)',
		            formatter:'{b}</br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#738ffe"></span>{a0} ：{c0}</br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#26a69a"></span>{a1} ：{c1}</br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#e84e40"></span>{a2} ：{c2}%'
		        },
		        legend: {
		            data:['进入电核用户数','通过电核用户数','电核通过率'],
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
			            name: '(人数)',
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
		                name: '进入电核用户数',
		                type: 'bar',
		                data: obj.telCheckPass_into,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '通过电核用户数',
		                type: 'bar',
		                data: obj.telCheckPass_pass,
					    itemStyle:{
				            normal:{
				                color:"#2BE1CF"
				            }
				        }
		            },
		            {
			            name:'电核通过率',
			            type:'line',
			            yAxisIndex: 1,
			            data:obj.telCheckPass_rate,
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
		
		//地域分布-进件
		function areaInvestMoney(obj,maxNum){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('dytzje'));
		   
			var option = {
			    title: {
			        text: '进件',
			        left: 'right',
			        subtext: ''
			    },
			    tooltip: {
			        show: false,
			        trigger: 'item'
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'left',
			        data:['进件'],
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
			            name: '进件',
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
			            data:obj.data
			        }
			    ]
			};
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		  	
		}
		
		//地域分布-交易
		function areaInvestPeople(obj,maxNum){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('dytzrs'));
		   
			var option = {
			    title: {
			        text: '交易',
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
			        data:['交易'],
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
			            name: '交易',
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
			            data:obj.data
			        }
			    ]
			};
			
			//使用刚指定的配置项和数据显示图表
		  	myChart.setOption(option);
		  	
		}
		
})(mui,jQuery,document,window.biMobile)
