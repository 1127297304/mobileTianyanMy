;(function(){
	//var timer2 = null;
		/*timer2 = setInterval(funcntion(){
		 	
		},50000)*/
	 	
	 	//顶部放款金额及放款件数
		var httpid="external-interface/";
	 	
		function askSumData(){
			var strMoney='<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set marRig"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set marRig"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set set_last"></div>';
		    
		    var strPieces='<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set marRig"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set set_last"></div>';
		    
		    var sumMoney = 0;
		    var sumPieces = 0;
		    $(".pieces").html(strPieces);
			$(".money").html(strMoney);
		    
		    //放款金额
			$('.money').dataStatistics({
		      	max:sumMoney,//数值
		      	len:9//数字是几位数
		    });
		    
		    //放款件数
		    $('.pieces').dataStatistics({
		      	max:sumPieces,//数值
		      	len:6//数字是几位数
		    });
		    
	    	$(".pieces").html(strPieces);
	    	$(".money").html(strMoney);
	    	
	    	$.ajax({
	    		//url:"http://10.129.223.172:8080/app/daping/loanAmountAndCount.gm",
				url:httpid+"mfy/monitor/getLoan.gm",
	    		type:"get",
	    		dataType:"json",
	    		success:function(e){
	    			sumMoney = e.data.dataInfo.loanAmount;
	    			sumPieces = e.data.dataInfo.loanCount;
					//console.log(sumMoney);
	    			
	    			//放款金额
	    			$('.money').dataStatistics({
				      	max:sumMoney,//数值
				      	len:9//数字是几位数
				    });
				    
				    //放款件数
	    			$('.pieces').dataStatistics({
				      	max:sumPieces,//数值
				      	len:6//数字是几位数
				    });
	    		}
	    	})
		}
		askSumData();
	 	askForPie();
	 	setInterval(function(){
	 		
	 		//饼图
	 		askForPie();
	 		askSumData();
	 		
	 	},5000)
	 	
	 	
	 	
	 	function askForPie(){
			$.ajax({
			 	//url:"http://10.129.223.172:8080/app/daping/getAreaRateOfLoan.gm",
				//url:"./circle1.json",
				url:httpid+"mfy/monitor/getLoanProductRatio.gm",
			 	type:"get",
			 	dataType:"json",
				cache:'false',
			 	success:function(data){
					//console.log(data);
			 		scale_occupy(data);
			 	},
			 	error:function(){
			 		console.log("请求失败");
			 	}
			})
		}
	
		function scale_occupy(data){//饼图
			//console.log(data)
			//转换数据格式 
			/*var dataLast =[];
			for(var i=0,len=data.length;i<len;i++){
				var obj = {};
				obj['value'] = parseInt(data[i].num)
				obj['name'] =  data[i].type
				dataLast.push(obj)
			}*/
			var myChart = echarts.init(document.getElementById('scale_occupy'));
			/*myChart.on("click", function (param,b) { 
		        var hz = param.name;//横坐标的值 
			})*/
			var option = {
			    backgroundColor: '',
				color:['#E95514','#FFEF4F','#F8C000','#4AA9C5','#B3EEF1',  '#FFCB7B'],
			    title: {
			        left: 'center',
			        top: 20,
			        textStyle: {
			            color: 'white'
			        }
			    },

			    axisLabel: {
			    	textStyle: {
			    		color: 'white',
			    		fontSize: 24
			    	}
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)",
			        axisLabel: {
				    	textStyle: {
				    		color: 'white',
				    		fontSize: 24
				    	}
				    },
			    },
			    series : [
			        {
			            name:'购买规模占比',
			            type:'pie',
			            radius : '50%',
			            center: ['50%', '50%'],
			            data:data.data,
			            //roseType: 'angle',  此处控制饼图的半径是否一致的问题

			            label: {
		                	normal: {
	                    		textStyle: {
	                    			fontSize:35,
	                        		color: 'white'
	                   	 		}
		                	},
							emphasis: {
								show: true
							}
			            },
			            labelLine: {
			                normal: {
			                    lineStyle: {
			                        color: 'white'
			                    },
			                    smooth: 0.2,
			                    length: 10,
			                    length2: 20
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
	
	 	askForLineData();
	 	setInterval(function(){
	 		
	 		//折线
	 		askForLineData();
	 		
	 	},5000)
	 	
	 	setInterval(function(){
	 		
	 		window.location.href = ""
	 	},300000)
	 	
	 	function askForLineData(){
	 		$.ajax({
			 	//url:"http://10.129.223.172:8080/app/daping/getRealTimeTotalLoanAmountForTrend.gm",
				//url:"./zzt.json",
				url:httpid+"mfy/monitor/getLoanTrend.gm",
			 	type:"get",
			 	dataType:"json",
			 	success:function(e){
					//console.log(e)
			 		var lineData = e;
			 		userTrend(lineData);
			 	},
			 	error:function(){
			 		console.log("请求失败");
			 	}
			})
	 	}
	 	
		function userTrend(data){//折线
			//console.log(arrTime)
			var myChart = echarts.init(document.getElementById('rts_trend'));
			//console.log(arrLineOne)
			var option = {
		    title: {
		      text: ''
		    },
		    tooltip: {
		      trigger: 'axis'
		    },
		    legend: {
		      data:[{
		      	name: '当日注册用户数'/*,
		      	icon: 'image://./images/icon_yellow.png'*/
		      },{
		      	name:'当日放款金额'/*,
		      	icon: 'image://./images/icon_blue.png'*/
		      }],
			  align: 'right',
		      right: 50,
		      itemWidth: 50	,
		      textStyle: {
		      	fontSize: 24,
		      	color: 'white'
		      }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		      type: 'category',
		      color: 'white',
		      splitLine: {
	              show: false
	          },
		      name: '时间(时)',
		      boundaryGap: false,
		      nameTextStyle:{
			    	color: 'white',
			    	fontSize:26
			    },
			    axisLabel: {
			    	textStyle: {
			    		color: 'white',
			    		fontSize: 24
			    	}
			    },
		      data: data.data.timeList
		    },
		    yAxis: {
			      type: 'value',
			      name: '数量(万)',
				nameGap:25,
			      splitLine: {
		              show: false
		          },
		      nameTextStyle:{
			    	color: 'white',
			    	fontSize:24
			    },
			    axisLabel: {
			    	textStyle: {
			    		color: 'white',
			    		fontSize: 24
			    	}
			    },
		    },
		    series: [
		      /*{
		        name:'当日注册用户数',
		        type:'line',
		        stack: '总量',
		        itemStyle: {
	            normal: {
                color: '#E9A444',
	            },
		        },
		        areaStyle: {
		          normal: {
		            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                offset: 0,
	                color: 	'#E9A444'
		            }, {
	                offset: 1,
	                color: 'rgba(0,0,0,0)'
		            }])
		          }},
		        smooth: true,
	            symbolSize: (a , b) => {
	            	//x坐标轴为最大的值
	            	if(b.dataIndex === option.xAxis.data.length - 1){
	            		return 20
	            	}
	            },
		        data: arrLineOne
		      },*/
		      {
		        name:'当日放款金额',
		        type:'line',
		        stack: '总量',
		        itemStyle: {
		            normal: {
		                color: '#50B3D0'
		            }
		        },
		        smooth:false,
		        areaStyle: {
		          normal: {
		            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		                offset: 0,
		                color: 'lightblue'
		            }, {
		                offset: 1,
		                color: 'rgba(171,221,250,.2)'
		            }])
		          }},
		        smooth: true,
            symbolSize: (a , b) => {
            	//x坐标轴为最大的值
            	if(b.dataIndex === option.xAxis.data.length - 1){
            		return 20
            	}
            },
		        data: data.data.loanAmountOfTrend
		      }
		    ]
			};
			myChart.setOption(option);
		}
	
		//获取时间
		function setDate() {
			var obj = {};
			var myDate = new Date();
			obj.month 	  = myDate.getMonth();
			obj.week  	  = myDate.getDay();
			obj.day  	    = myDate.getDate();
			obj.hour  	  = myDate.getHours();
			if(obj.hour < 10) {
				obj.hour = '0' + obj.hour
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
			var delay = true;
			if(target != undefined){
				var time 			= target.querySelector('span'),
						week      = target.querySelector('#week'),
						day       = target.querySelector('#day'),
						month     = target.querySelector('#month');
						time.innerHTML  = obj.hour + ':' + obj.min;


				 if(time.innerHTML=="00:00") {
					 if (delay)
					 {
						 delay = false;
						 console.log(time.innerHTML+":"+delay);
						 window.setTimeout(function(){
							  window.location.href="./module.html?idx=6";
							 delay = true;
						 }, 60000)
					 }


				 };
				if(time.innerHTML=="00:05") {
					if (delay)
					{
						delay = false;
						console.log(time.innerHTML+":"+delay);
						window.setTimeout(function(){
							window.location.href="./module.html?idx=6";
							delay = true;
						}, 60000)
					}


				};
				if(time.innerHTML=="00:20") {
					if (delay)
					{
						delay = false;
						console.log(time.innerHTML+":"+delay);
						window.setTimeout(function(){
							window.location.href="./module.html?idx=6";
							delay = true;
						}, 60000)
					}


				};
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
		
		//bsMonthInvest();
	 function bsMonthInvest(data){//柱状

			
			//数据
			dataNum = ['1','2','3','4','1','2','3','4']
			dataTime = ['1','2','3','4','1','2','3','4']
			var dataAxis = ['没', '有', '仔', '细', '研', '究', '到', '底', '有', '什', '么', '用'];
			var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var myChart = echarts.init(document.getElementById('bs_mon_invest'));
			var yMax = Math.max(...dataNum) + 10000;
			var dataShadow = [];

			for (let j = 0; j < data.length; j++) {
			    dataShadow.push(yMax);
			}

			var option = {
			    title: {
			        text: ' ',
			    },
			    grid: {
			    		show:true,
			    		backgroundColor: 'rgba(58,58,58,.7)',
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
			    		name: '时间(时)',
			    		type: 'category',
			        data: dataTime,
			        axisLabel: {
			            inside: false,
			            textStyle: {
			                color: 'white',
					    				fontSize: 24
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
			    		'name': '(元)',
			        axisLine: {
			            show: false
			        },
			        axisTick: {
			            show: false
			        },
			        axisLabel: {
			            textStyle: {
			                color: 'white',
			                fontSize: 24
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
			            barCategoryGap:'40%',
			            data: dataShadow
			        },
			        {
			            type: 'bar',
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
		
})();
