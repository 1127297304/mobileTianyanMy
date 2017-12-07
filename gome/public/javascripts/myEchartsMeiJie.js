;(function(){
	//var timer2 = null;
		/*timer2 = setInterval(funcntion(){
		 	
		},50000)*/
	 	
	 	//顶部放款金额及放款件数
		var httpid="external-interface/";
		
		function askSumData(){
			var strMoney='<div class="digit_set marRig"></div>'+
		    '<div class="digit_set"></div>'+
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
		      	len:10//数字是几位数
		    });
		    
		    //放款件数
		    $('.pieces').dataStatistics({
		      	max:sumPieces,//数值
		      	len:9//数字是几位数
		    });
		    
	    	$(".pieces").html(strPieces);
	    	$(".money").html(strMoney);
	    	
	    	$.ajax({//总交易金额、件数
	    		//url:"http://10.129.223.172:8080/app/daping/loanAmountAndCount.gm",
				url:"http://10.143.107.219:8001/activity/meijie/getMeijieLoanInfo.gm",
	    		type:"get",
	    		dataType:"json",
	    		success:function(e){
	    			sumMoney = e.loanAmount;
	    			sumPieces = e.loanNum;
					//console.log(sumMoney);
	    			
	    			//放款金额
	    			$('.money').dataStatistics({
				      	max:sumMoney,//数值
				      	len:10//数字是几位数
				    });
				    
				    //放款件数
	    			$('.pieces').dataStatistics({
				      	max:sumPieces,//数值
				      	len:9//数字是几位数
				    });
	    		}
	    	})
		}
		askSumData();
	 	askForPie();
	 	askForPieMylc();
	 	setInterval(function(){
	 		
	 		//饼图
	 		askForPie();
	 		askForPieMylc();
	 		askSumData();
	 		
	 	},5000)
	 	
	 	function askForPieMylc(){
			$.ajax({//理财投资金额
			 	//url:"http://10.129.223.172:8080/app/daping/getAreaRateOfLoan.gm",
				//url:"./circle1.json",
				url:"http://10.143.107.219:8001/activity/meijie/getMeiJieRealTimeRiskTrendSdqsModel.gm",
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
	 	
	 	function askForPie(){
			$.ajax({//美易分大区占比
			 	//url:"http://10.129.223.172:8080/app/daping/getAreaRateOfLoan.gm",
				//url:"./circle1.json",
				url:"http://10.143.113.15:9080/app/promotion/meijie/channelRate.gm",
			 	type:"get",
			 	dataType:"json",
				cache:'false',
			 	success:function(data){
					//console.log(data);
			 		scale_occupyMyf(data.data.datainfo);
			 	},
			 	error:function(){
			 		console.log("请求失败");
			 	}
			})
		}
		
		function scale_occupyMyf(data){//美易分饼图
			//console.log(data)
			//转换数据格式 
			/*var dataLast =[];
			for(var i=0,len=data.length;i<len;i++){
				var obj = {};
				obj['value'] = parseInt(data[i].num)
				obj['name'] =  data[i].type
				dataLast.push(obj)
			}*/
			var myChart = echarts.init(document.getElementById('scale_occupyMyf'));
			/*myChart.on("click", function (param,b) { 
		        var hz = param.name;//横坐标的值 
			})*/
			var option = {
			    backgroundColor: '',

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
			            radius : '60%',
			            center: ['50%', '50%'],
			            data: data,
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
			    title: {
			      text: ''
			    },
			    tooltip: {
			      trigger: 'axis'
			    },
			    legend: {
			    show:false,
			      data:[{
			      	name: '当日注册用户数'
			      },{
			      	name:'当日放款金额'
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
			      data: data.timesList
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
			        data: data.todayTimesList
			      }
			    ]
			};
			myChart.setOption(option);
		}
	
	 	//askForLineData();
	 	/*setInterval(function(){
	 		
	 		//折线
	 		askForLineData();
	 		
	 	},60000)*/
	 	
	 	askForLineMjData();
	 	setInterval(function(){
	 		
	 		//折线
	 		askForLineMjData();
	 		
	 	},5000)
	 	
	 	askForLineMjDataArea();
	 	setInterval(function(){
	 		
	 		//折线
	 		askForLineMjDataArea();
	 		
	 	},5000)
	 	
	 	function askForLineData(){
	 		$.ajax({//美易分放款金额
			 	//url:"http://10.129.223.172:8080/app/daping/getRealTimeTotalLoanAmountForTrend.gm",
				//url:"./zzt.json",
				url:"http://10.143.113.15:9080/app/meiyifen/realtime/trend.gm?product_type=110110&index_type=050&time_type=a",
			 	type:"get",
			 	dataType:"json",
			 	success:function(e){
					//console.log(e)
			 		var lineData = e.data.datainfo;
			 		userTrend(lineData);
			 		//userMyf(lineData);
			 		//compaire(lineData);
			 		//areaChart(lineData);
			 	},
			 	error:function(){
			 		console.log("请求失败");
			 	}
			})
	 	}
	 	
	 	function askForLineMjData(){
	 		$.ajax({//美借放款金额
			 	//url:"http://10.129.223.172:8080/app/daping/getRealTimeTotalLoanAmountForTrend.gm",
				//url:"./zzt.json",
				url:"http://10.143.107.219:8001/activity/meijie/getTotal.gm",
			 	type:"get",
			 	dataType:"json",
			 	success:function(e){
					//console.log(e)
			 		var lineData = e.data.datainfo;
			 		//userTrend(lineData);
			 		userMyf(lineData);
			 		//compaire(lineData);
			 		//areaChart(lineData);
			 	},
			 	error:function(){
			 		console.log("请求失败");
			 	}
			})
	 	}
	 	
	 	function askForLineMjDataArea(){
	 		$.ajax({//美借热力分布
			 	//url:"http://10.129.223.172:8080/app/daping/getRealTimeTotalLoanAmountForTrend.gm",
				//url:"./zzt.json",
				url:"http://coolscreen.gomefinance.com.cn/bfd/real?type=map_mj",
			 	type:"get",
			 	dataType:"json",
			 	success:function(e){
					//console.log(e)
			 		var lineData = e;
			 		$.each(e,function(i,val){
			 			val.name = val.area;
			 			val.value = val.amount;
			 		})
			 		areaChart(lineData);
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
		    	show:false,
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
		      data: data.time_list
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
		        data: data.today_list
		      }
		    ]
			};
			myChart.setOption(option);
		}
		
		function userMyf(data){//折线
			//console.log(arrTime)
			var myChart = echarts.init(document.getElementById('lineMyf'));
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
		      	name: '当日注册且进件用户数'/*,
		      	icon: 'image://./images/icon_yellow.png'*/
		      },{
		      	name:'当日进件用户数'/*,
		      	icon: 'image://./images/icon_blue.png'*/
		      }],
			  align: 'right',
		      right: 50,
		      itemWidth: 50	,
		      textStyle: {
		      	fontSize: 42,
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
		      data: data.time_list
		    },
		    yAxis: {
			      type: 'value',
			      name: '',
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
		      {
		        name:'当日进件用户数',
		        type:'line',
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
		        data: data.into_user_list
		      },
		      {
		        name:'当日注册且进件用户数',
		        type:'line',
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
		        data: data.reg_into_list
		      }
		    ]
			};
			myChart.setOption(option);
		}
	
		//年龄分布-资产和理财
		function compaire(){
			var ageArea = [ '18以下','18-24','25-34','35-49','50+'];
			var FbarData = [3100, 2142, 1218, 581, 431]; //男
			var MbarData = [-3010, -2742, -218, -381, -521]; //女
			var myChart = echarts.init(document.getElementById('compaireChart'));
			var option = {
		            tooltip : {
		                trigger: 'axis',
		                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		                },
		                formatter: function (params, ticket, callback) {
                           console.log(params)
                           var res = params[0].name ;
                           for (var i = 0, l = params.length; i < l; i++) {
                               res += '<br/>' + params[i].seriesName + ' : ' + Math.abs(params[i].value) ;     
                               }
                           setTimeout(function () {
                               // 仅为了模拟异步回调
                               callback(ticket, res);
                           }, 500)
                           return 'loading...';
                        }
		            },
		            legend: {
		                data:[ '资产', '理财'],
		                show:false,
		                top:'10%'
		            },
		            grid: {
		            	top: '10%',
		                left: '3%',
		                right: '4%',
		                bottom: '3%',
		                containLabel: true
		            },
		            xAxis : [
		                {
		                    axisLabel : { 
		                    	show:false,
		                    	formatter: function (value){
		                    		return Math.abs(value);//显示的数值都取绝对值
				                },
				                color: 'white',
			                    fontSize:80
				        	},
			        		axisLine:{
				                show:false
				            },
				            axisTick:{
				                show:false
				            },
				            splitLine:{
				            	show:false,
				                lineStyle:{
				                    type:"dotted"
				                }
				            },
			                type : 'value'
		                }
		            ],
		            yAxis : [
		                {
		                    type : 'category',
		                    axisTick : {show: false},
		                    axisLine : {show: false},
		                   // data : ['0~5岁','5~10岁','10-30岁','30-50岁','50-70岁','70-100','100以上']
		                   	labelLine:{
		                   		show:false
		                   	},
		                   	axisLabel : {
		                   		show:false,
				                fontSize:80,
				                color:'white'
				        	},
		                    data : ageArea
		                }
		            ],
		            series : [
		                {
		                    name:'资产',
		                    type:'bar',
		                    barWidth:60,
		                    stack: '总量',
		                    label: {
		                        normal: {
		                            show: true,
		                            position: 'right',
									distance: 20,
		                            color:'white',
		                            fontSize:100
		                        }
		                    },
		                    itemStyle: {
		                    	normal:{
		                    		color :'lightblue'
		                    	}
		                    },
		                   // data:[320, 302, 341, 374, 390, 450, 420]
		                    data:FbarData
		                },
		                {
		                    name:'理财',
		                    type:'bar',
		                    stack: '总量',
		                    label: {
		                        normal: {
		                            show: true,
		                            position: 'left',
		                           	formatter:function(v){
		                           		return Math.abs(v.data)
		                           	},
		                           	distance: 20,
		                            color:'white',
		                            fontSize:100
		                        }
		                    },
		                    itemStyle: {
		                    	normal:{
		                    		color :'pink'
		                    	}
		                    },
		                   // data:[-120, -132, -101, -134, -190, -230, -210]
		                    data:MbarData
		                }
		            ]
		        };
		    myChart.setOption(option);
		}
		
		//地图区域-热力图
		function areaChart(data){
			/*var arr =[
					{value: "2042", name: "北京"},
					{value: "1883", name: "天津"},
					{value: "11617", name: "河北"},
					{value: "7943", name: "山西"},
					{value: "6286", name: "内蒙古"},
					{value: "9308", name: "辽宁"},
					{value: "6324", name: "吉林"},
					{value: "9334", name: "黑龙江"},
					{value: "3326", name: "上海"},
					{value: "24873", name: "江苏"},
					{value: "20328", name: "浙江"}
				];*/
			var myChart = echarts.init(document.getElementById('areaChart'));
			var option = {
			    tooltip: {
			        trigger: 'item'
			    },
			    legend: {
			    	show:false,
			        orient: 'vertical',
			        left: 'left',
			        data:['hot']
			    },
			    visualMap: {
			    	show:false,
			        min: 0,
			        max: 10000,
			        left: '4%',
			        bottom: 100,
			        text: ['高','低'],           // 文本，默认为数值文本
			        calculable: true,
			    	textStyle: {
			    		color: 'white',
			    		fontSize: 20
				    }
			    },
			    toolbox: {
			        show: false,
			        orient: 'vertical',
			        left: 'right',
			        top: 'center',
			        feature: {
			            dataView: {readOnly: false},
			            restore: {},
			            saveAsImage: {}
			        }
			    },
			    series: [
			        {
			            name: 'hot',
			            type: 'map',
			            mapType: 'china',
			            roam: false,
			            label: {
			                normal: {
			                    show: true
			                },
			                emphasis: {
			                    show: true
			                }
			            },
			            data: data
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
