;(function(){
	var globalData,globalData2,globalData3,globalData4,globalData5,globalData6,globalData7;
	//此处是获取数据  充 提 投数据
	askForData();
	function askForData(){
		$.ajax({
			type:"get",
			dataType:"json",
			url:"/app/promotion/mylc/total.gm",
			success: function(data){
				globalData=data.data.datainfo;
				userConditionTotal(globalData);


			},
			error: function(data) {
				console.log("请求失败");
			}
		});
	};
	askForData2();
	function askForData2(){
		$.ajax({
			type:"get",
			dataType:"json",
			url:"app/meiYiFinancing/getDataFromDashUserActiveTableOfOtherDay.gm?index=tzje",
			success: function(data){
				globalData2=data.data.datainfo;
				userConditionTotal2(globalData2);


			},
			error: function(data) {
				console.log("请求失败");
			}
		});
	};
	/*总投资产品*/
	askForData3();
	function askForData3(){
		$.ajax({
			type:"get",
			dataType:"json",
			url:"app/meiYiFinancing/getMeiYiFinancingRealTimeWebModel.gm",
			success: function(data){
				globalData3=data.data.datainfo;
				productCondition(globalData3.productActive);
				productCondition2(globalData3.productActive);
				productCondition3(globalData3.productActive);


			},
			error: function(data) {
				console.log("请求失败");
			}
		});
	};
	askForData4();
	function askForData4(){
		$.ajax({
			type:"get",
			dataType:"json",
			url:"http://coolscreen.gomefinance.com.cn/bfd/real?type=map_lc",
			success: function(data){
				globalData4=data;
				performanceOverview(globalData4);
				var Data=[];
				for(var i=0;i<globalData4.length;i++){
					var JsonNew={
						value:globalData4[i].num.replace('%',''),
						name:globalData4[i].type
					};

					Data.push(JsonNew);
				};
console.log(Data)
				performanceOverview(Data);

			},
			error: function(data) {
				console.log("请求失败");
			}
		});
	};
	//此处是数量和金额的接口调用
	askForData5();
	function askForData5(){
		$.ajax({
			type:"get",
			dataType:"json",
			url:"http://10.143.113.15:18080/mylc/promotion",
			success: function(data){
				globalData5=data;
				console.log(globalData5);
				var sumMoney = globalData5.amt;
				var sumPieces = globalData5.num;
			/*	$(".price").html(strPieces);
				$(".Num").html(strMoney)*/;

				//放款金额
				$('.price').dataStatistics({
					max:sumMoney,//数值
					len:9//数字是几位数
				});

				//放款件数
				$('.Num').dataStatistics({
					max:sumPieces,//数值
					len:6//数字是几位数
				});



			/*	$('.price').html(globalData5.amt);
				$('.Num').html(globalData5.num);*/

			},
			error: function(data) {
				console.log("请求失败");
			}
		});
	};








	//获取时间
	setDate();
	function setDate() {
		var obj = {};
		var myDate    = new Date();
		obj.month 	  = myDate.getMonth();
		obj.week  	  = myDate.getDay();
		obj.day  	  = myDate.getDate();
		obj.hour  	  = myDate.getHours();
		if(obj.hour < 10) {
			obj.hour  = '0' + obj.hour
		}
		obj.min   	  = myDate.getMinutes();
		if(obj.min < 10) {
			obj.min = '0' + obj.min
		}
		var weekWord  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
		var monthWord = ['January','February','March','April','May','June','July','August','September','October','November ','December ']
		obj.week      = weekWord[obj.week - 1]
		obj.month     = monthWord[obj.month]

		var target 		= document.querySelector('.rts_time');
		if(target != undefined){
			var 	time 	  = target.querySelector('span'),
				week      = target.querySelector('#week'),
				day       = target.querySelector('#day'),
				month     = target.querySelector('#month');
			time.innerHTML  = obj.hour + ':' + obj.min;
			week.innerHTML  = obj.week;
			day.innerHTML   = obj.day;
			month.innerHTML = obj.month;
		}else{
			return
		}

	}
	setInterval(function(){
		setDate();
	}, 3000);

	//充 提 投图表
	function userConditionTotal(obj){
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('ctje'));
		var Data=[obj.depositAmount,obj.investAmount,obj.withdrawAmount]
		var option = {
			title: {
				text: '充值，提取，投资金额',
				textStyle:{
					//文字颜色
					color:'#00B7FF',},
				left:"center"
			},
			/*backgroundColor: '#dcd6d8',//背景色*/
			tooltip: {
				trigger: 'axis',
				confine: true,
				backgroundColor: 'rgba(87,106,118,0.7)'
			},
			axisLine:{
				lineStyle:{
					color:'yellow',
					width:2
				}
			},

			label: {
				normal: {
					show: true,
					textStyle: {color: '#d27d39', fontSize: "18"},
					position: 'inside'
				}
			},
				legend: {
				data:['充值金额','投资金额','提现金额'],
				itemWidth:15,
				itemHeight:10,
				/*selectedMode:false,*/
				textStyle:{
					fontSize: 10,
					color: '#929292'
				},
				bottom:'0%'
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
				data: ['充值金额','投资金额','提现金额'],
				axisTick:{
					show:false
				},
				axisLine:{
					show:false
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: '#56b2e7'
					}
				}
			},

			yAxis: {
				axisLine:{
					show:false,
					lineStyle:{
						color:'#56b2e7',
					}
				},
				type: 'value',
				//name:obj[0][3],
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
			color: ['#3398DB'],
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis : [

				{
					axisLine:{
						show:false,
						lineStyle:{
							color:'#56b2e7',

						}
					},
					type : 'category',
					data : ['充值金额','投资金额','提现金额'],
					axisTick: {
						alignWithLabel: true
					}
				}
			],
			series: [
				{
					name: '',
					type: 'bar',
					smooth: true,
					barWidth:30,
					data: Data,
					itemStyle:{
						normal:{
							color: function (params){
								var colorList = ['rgb(164,205,238)','rgb(42,170,227)','rgb(25,46,94)','rgb(195,229,235)'];
								return colorList[params.dataIndex];

						},
						}
					}
				}]
		};

		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);

	};
	function userConditionTotal2(obj){
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('tzje'));

		var option = {
			title: {
				text: '投资金额区间趋势',
				textStyle:{
					//文字颜色
					color:'#00B7FF',},
				left:"center"
			},
			tooltip: {
				trigger: 'axis',
				confine: true,
				backgroundColor: 'rgba(87,106,118,0.7)'
			},
			label: {
				normal: {
					show: true,
					textStyle: {color: '#d27d39', fontSize: "18"},
					position: 'top'
				}
			},
			legend: {
				data:['今日'],
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
				data: obj.timeList,
				axisTick:{
					show:false
				},
				axisLine:{
					show:false,
					lineStyle:{
						color:'#56b2e7',
					}
				},
		/*		axisLine:{
					show:false
				}*/
			},
			yAxis: {
				type: 'value',
				//name:obj[0][3],
			/*	axisLine:{
					show:false
				},*/
				axisLine:{
					show:false,
					lineStyle:{
						color:'#56b2e7',
					}
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
					areaStyle: {normal: {}},
					data: obj.todayList,
					itemStyle:{
						normal:{
							color:"#7fbfea"
						}
					}
				}]
		};

		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);

	}

	/*产品端动态投资额*/
	function productCondition(obj){

		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('ztz'));

		var option = {
			title: {
				text: '总投资产品占比',
				textStyle:{
					//文字颜色
					color:'#00B7FF',},
				left:"center"
			},
			tooltip : {
				trigger: 'axis',
				confine: true,
				backgroundColor: 'rgba(87,106,118,0.7)'
			},
			label: {
				normal: {
					show: true,
					textStyle: {color: '#d27d39', fontSize: "18"},
					position: 'top'
				}
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
					data : ['新手类','10-49天','50-79天','80-129天','130-199天','200天+'],
					axisTick:{
						show:false
					},
					axisLine:{
						show:false,
						lineStyle:{
							color:'#56b2e7',
						}
					},

				}
			],
			yAxis: [
				{
					type: 'value',
					name: '(千万)',
					axisLine:{
						show:false,
						lineStyle:{
							color:'#56b2e7',
						}
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
					data: obj.investAmount54,
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
					data: obj.investAmount5562,
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
					data: obj.investAmount6369,
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
					data: obj.investAmount7,
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

	};
	/*产品端动态首投*/
	function productCondition2(obj){

		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('st'));

		var option = {
			title: {
				text: '首投投资产品占比',
				textStyle:{
					//文字颜色
					color:'#00B7FF',},
				left:"center"
			},
			tooltip : {
				trigger: 'axis',
				confine: true,
				backgroundColor: 'rgba(87,106,118,0.7)'
			},
			label: {
				normal: {
					show: true,
					textStyle: {color: '#d27d39', fontSize: "18"},
					position: 'top'
				}
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
						show:false,
						lineStyle:{
							color:'#56b2e7',
						}
					},
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '(千万)',
					axisLine:{
						show:false,
						lineStyle:{
							color:'#56b2e7',
						}
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
					data: obj.firstInvest54,
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
					data: obj.firstInvest5562,
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
					data: obj.firstInvest6369,
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
					data: obj.firstInvest7,
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

	};
	/*产品端动态复投*/
	function productCondition3(obj){

		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('ft'));

		var option = {
			title: {
				text: '复投投资产品占比',
				textStyle:{
					//文字颜色
					color:'#00B7FF',},
				left:"center"
			},
			tooltip : {
				trigger: 'axis',
				confine: true,
				backgroundColor: 'rgba(87,106,118,0.7)'
			},
			label: {
				normal: {
					show: true,
					textStyle: {color: '#d27d39', fontSize: "18"},
					position: 'top'
				}
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
						show:false,
						lineStyle:{
							color:'#56b2e7',
						}
					},
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '(千万)',
					axisLine:{
						show:false,
						lineStyle:{
							color:'#56b2e7',
						}
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
					data: obj.secondInvest54,
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
					data: obj.secondInvest5562,
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
					data: obj.secondInvest6369,
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
					data: obj.secondInvest7,
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

	};

	/*购买规模占比图表   酷屏*/
	function performanceOverview(obj){

		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('gmgm'));

		var option = {

			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)",
				confine: true,
				backgroundColor: 'rgba(87,106,118,0.7)'
			},
			/*label: {
				normal: {
					show: true,
					textStyle: {color: '#d27d39', fontSize: "18"},
					position: 'top'
				}
			},*/
			legend: {
				orient: 'vertical',
				left: 'left',
				show: false,
			},
		/*	calculable : true,*/
			series : [
				{
					type: 'pie',
					radius : '55%',
					center: ['50%', '60%'],
					name:'放款金额',
					data: obj,
					labelLine: {
						normal: {
							length: 10,
							length2: 4
						}
					},
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};


		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

})();
