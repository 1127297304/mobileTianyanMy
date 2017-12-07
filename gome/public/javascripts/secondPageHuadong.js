;(function(){
	
	/*动态创建选项卡*/
	var httpid="external-interface/";
	var timer=null;
	timer=setInterval(function(){
		$("#tab_control_con").html('');
		askForData();
	},5000)
	
	askForData();
	function askForData(){
		$.ajax({
			type:"get",
			dataType:"json",
			//url:"secondP.json",
			//url:"http://10.129.223.172:8080/app/daping/getSecondScreenData.gm",
			url:httpid+"mfy/monitor/getLoanAreaBlock.gm",
			success: function(data){
				//console.log(data)
				//console.log(data.success)
				var globalData=data.data.dataInfo;
				//console.log(data.data)
				console.log(globalData)
				
				//创建大区选项
				createTabControl(globalData);
				
				//添加事件
				bindEvent(globalData);
				
				//渲染默认显示的图表
				var initShow = globalData.areaDataValue[3];//获取默认显示的大区
				
				//饼图
				scale_occupy(globalData[initShow]);
				
				//柱状图
				var dataNum = globalData[initShow].productsSaleRanking.productsData;
	 			var dataTime = globalData[initShow].productsSaleRanking.horiAxis;
				bsMonthInvest(dataNum,dataTime)
				
				//渲染城市明细表
				randerTableDetail(globalData[initShow].tableDetailList);
			},
			error: function(data) {
				console.log("请求失败");
			}
		});
	}




	function createTabControl(data){
		//假定返回的按大小排列好的 分区数组
		console.log(data);
		var arr = data.areaNameRankin;
		var arrMoney = data.areaLoanMoneyRanking;
		var target = document.querySelector('#tab_control_con');
		var dataValue = data.areaDataValue;
		//var newDiv = document.create
		//for(var i=0,len=arr.length;i < len ; i++){
			target.appendChild(createLi(arr[3],arrMoney[3],dataValue[3]));
		//}
		$("#tab_control_con li:first-child").addClass("active");
	};
	function createLi(area, num, dataValue){
		var li = document.createElement('li');
		var spanArea = document.createElement('span');
		var spanMoney = document.createElement('span');
		var moneyDetail = document.createElement('a');
		spanArea.innerHTML = area;
		spanArea.className = area;
		moneyDetail.innerHTML = num + '元';
		spanMoney.innerHTML = moneyDetail.innerHTML;
		li.className = area;
		li.setAttribute("data-value",dataValue);
		
		li.appendChild(spanArea);
		li.appendChild(spanMoney);
		return li;
		
	}
			
	function bindEvent(data){
		$("#tab_control_con").on("click","li",function(){
			$(this).addClass("active").siblings().removeClass("active");
			var item=$(this).data("value");
			
			//大全切换时更改饼图、柱状图和城市明细表
			//饼图
			scale_occupy(data[item]);
			
			//柱状图
			var dataN = data[item].productsSaleRanking.productsData;
 			var dataT = data[item].productsSaleRanking.horiAxis;
			bsMonthInvest(dataN,dataT);
			
			//城市列表
			randerTableDetail(data[item].tableDetailList);
		})
	}
	 
	//渲染城市列表
	function randerTableDetail(changeData){
		
		//注册一个Handlebars模版，通过id找到某一个模版，获取模版的html框架
        //$("#table-template").html()是jquery的语法
    	var myTemplate = Handlebars.compile($("#tableDetail-template").html());
		
    	//将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
 		$('#tableDetailContent').html(myTemplate(changeData));
		
	}
	 
	 function bsMonthInvest(dataNum,dataTime){//柱状

			//console.log(data)
			//数据
			//dataNum = ['1','2','3','4','1','2','3','4']
			//dataTime = ['1','2','3','4','1','2','3','4']
			var dataAxis = ['没', '有', '仔', '细', '研', '究', '到', '底', '有', '什', '么', '用'];
			var data = [0, 0, 0, 0];
			var myChart = echarts.init(document.getElementById('bs_mon_invest'));
			var yMax = Math.max(...dataNum) + 1;
			var dataShadow = [];

			for (let j = 0; j < dataNum.length; j++) {
			    dataShadow.push(yMax);
			}

			var option = {
			    title: {
			        text: ' ',
			    },
			    grid: {
			    		show:true,
			    		backgroundColor: 'rgba(58,58,58,.7)'
			    },
			    // legend: {
			    //   data:['月投资金额'],
					  // align: 'right',
			    //   right: 50,
			    //   itemWidth: 80	,
			    //   textStyle: {
			    //   	fontSize: 30,
			    //   	color: 'white'
			    //   }
			    // },
			    xAxis: {
			    		name: '时间',
			    		type: 'category',
			        data: dataTime,
			        axisLabel: {
			            inside: false,
			            textStyle: {
			                color: 'white',
					    				fontSize: 12
			            }
			        },
			        axisTick: {
			            show: false
			        },
			        axisLine: {
			            show: false
			        },
			        nameTextStyle:{
					    	color: 'white',
					    },
			    },
			    yAxis: {
			    		'name': '(万元)',
			        axisLine: {
			            show: false
			        },
			        axisTick: {
			            show: false
			        },
			        axisLabel: {
			            textStyle: {
			                color: 'white',
			                fontSize: 12
			            }
			        },
			        nameTextStyle:{
					    	color: 'white',
					    },
			    },
			    dataZoom: [
			        {
			            type: 'inside'
			        }
			    ],
			    series: [
			        { // For shadow
			            type: 'bar',
			            itemStyle: {
			                normal: {color: 'rgba(0,0,0,0.05)'}
			            },
			            barGap:'-100%',
			            barCategoryGap:'50%',
			            data: dataShadow
			        },
			        {
			            type: 'bar',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'top'
			                }
			            },
			            itemStyle: {
			                normal: {
			                    color: new echarts.graphic.LinearGradient(
			                        0, 0, 0, 1,
			                        [
			                            {offset: 0, color: '#83bff6'},
			                            {offset: 0.5, color: '#188df0'},
			                            {offset: 1, color: '#188df0'}
			                        ]
			                    )
			                },
			                emphasis: {
			                    color: new echarts.graphic.LinearGradient(
			                        0, 0, 0, 1,
			                        [
			                            {offset: 0, color: '#2378f7'},
			                            {offset: 0.7, color: '#2378f7'},
			                            {offset: 1, color: '#83bff6'}
			                        ]
			                    )
			                }
			            },
			            data: dataNum
			        }
			    ]
			};

			// Enable data zoom when user click bar.
			var zoomSize = 6;
			myChart.on('click', function (params) {
			    console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
			    myChart.dispatchAction({
			        type: 'dataZoom',
			        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
			        endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
			    });
			});
			myChart.setOption(option);
		}
	
	
	function scale_occupy(data){//饼图
			
			var myChart = echarts.init(document.getElementById('scale_occupy'));
			/*myChart.on("click", function (param,b) { 
		        var hz = param.name;//横坐标的值 
			})*/
			var option = {
			    backgroundColor: '',

			    title: {
			    	show:true,
			        left: 'center',
			        top: 20,
			        textStyle: {
			            color: '#ccc'
			        }
			    },
			    axisLabel: {
			    	textStyle: {
			    		color: 'white',
			    		fontSize: 12
			    	}
			    },
			    /*tooltip : {
				 trigger: 'item',
				 formatter: "{a} <br/>{b} : {c} ({d}%)",
				 axisLabel: {
				 textStyle: {
				 color: 'white',
				 fontSize: 12
				 }
				 },
				 },*/

			    series : [
			        {
			            name:'购买规模占比',
			            type:'pie',
			            radius : '50%',
			            center: ['50%', '50%'],
			            data: data.rosePieData,/*dataLast.sort(function (a, b) {
			            	console.log(a)
			            	return a.value - b.value
			            	
			            })*/
						//roseType : 'radius',
			            label: {
		                normal: {
	                    textStyle: {
	                    		fontSize:16,
	                        color: 'white'
	                    }
		                }
			            },
			            labelLine: {
			                normal: {
			                    lineStyle: {
			                        color: 'white'
			                    },
			                    smooth: 0.2,
			                    length: 1,
			                    length2: 10
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
			myChart.setOption(option);
		}
	
		//获取时间
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
})();
