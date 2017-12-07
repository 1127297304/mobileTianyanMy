;(function($,$$,doc){
	$.init({
		swipeBack: false//关闭右滑关闭功能
	})

	var obj;//初始请求的全局变量用以缓存数据
	var dateList;//用于存储时间轴数据	即	横轴
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
			//newUrl:"/meiYiFinancing/getPlatformFundsInfo.gm",
			newUrl:"../../js/mine/mylczt.json",
			type:"get",
			data:{
				edate:beforeToday
			},
			callback:function(data){
				
				obj = data.data.datainfo;
				
				dateList = data.data.datainfo.sftzbs.je.dateList;//债转用户首复投的时间轴
				
				//页面中所有的渲染操作及初始加载时的判断
				randerAllPage(obj);
					
				//遮罩消失
				$$('.mask').css('display','none');

			}
		})
	}
		
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
		
		//当日债转卖出用户-横向滑动部分
		function swiperHori(){
			var swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        slidesPerView: 2,
		        paginationClickable: false,
		        spaceBetween: 0
		    });
		}
		
		//页面中所有的渲染操作及初始加载时的判断
		function randerAllPage(obj){
			
			//初始化页面中所有的日、周、月维度选择	默认停留在日
			$$(".chooseItem>li:first-child").addClass("on").siblings().removeClass();
			
			//渲染echarts图表
					
			//判断切换日期后 初始加载页面时对应显示哪个图表
				/*第一块*/
					var curIndOne = $$(".firstCont .active").index();
					var echartIdOne = $$(".firstCont .tabBlockDetail>div").eq(curIndOne).find(".echartDetail").attr("id");
					
					switch(echartIdOne){
						case "jekhzhl":
							//债转业务趋势-金额		无需判断直接渲染
							jekhzhlCondition(obj.sftzbs.je,dateList);
							break;
						case "khzhl":
							//债转业务趋势-用户数		无需判断直接渲染
							khzhlCondition(obj.sftzbs.je,dateList);
							break;
					}
					
					
					//渲染顶部选项卡的流入资金 	topDay
					//randerTopDay(obj);
					//渲染顶部选项卡的流出资金
					//randerTopLc(obj)
					//渲染顶部选项卡的表格详情	topTable
					randerTopTable(obj);
					
					//当日债转卖出用户-横向滑动部分
					swiperHori();
					
				/*客户转化率*/
					//债转业务趋势-用户数		无需判断直接渲染
					//khzhlCondition(obj.sftzbs.je,dateList);
					//债转业务趋势-用户数中卖出客户、买入客户切换
					khzhChoose();
					
					//债转业务趋势-金额		无需判断直接渲染
					//jekhzhlCondition(obj.sftzbs.je,dateList);
					//债转业务趋势-金额中卖出客户、买入客户切换
					jekhzhChoose();
					
				/*第二块*/
					var curIndTwo = $$(".secondCont .active").index();
					var echartIdTwo = $$(".secondCont .tabBlockDetail>div").eq(curIndTwo).find(".echartDetail").attr("id");
					
					switch(echartIdTwo)
					{
						case 'tzzl':
						  //卖出用户债转后资金流向-金额
						  userCondition(obj.sftzbs.je,dateList);
						  break;
						case 'stzb':
						  //卖出用户债转后资金流向-用户数
						  firstCondition(obj.sftzbs.je,dateList);
						  break;
					}
					
				/*第三块*/
					var curIndThree = $$(".thirdCont .active").index();
					var echartIdThree = $$(".thirdCont .tabBlockDetail>div").eq(curIndThree).find(".echartDetail").attr("id");
					
					switch(echartIdThree)
					{
						case 'yhgm':
						  //债转用户首复投-金额
							userCount(obj.sftzbs.je,dateList);
						  break;
						case 'xzyh':
						  //债转用户首复投-笔数
							newUser(obj.sftzbs.bs,dateList);
						  break;
						case 'txtb':
						  //债转用户首复投-用户数
						  	withdrawCondition(obj.sftzbs.khs,dateList);
						  break;
					}
					
					//债转用户首复投-金额中的卖出客户、买入客户切换
					lczjMoneyChoose();
					
					//债转用户首复投-用户数中的卖出客户、买入客户切换
					lczjUserChoose();
					
					//债转用户首复投-笔数中的卖出客户、买入客户切换
					lczjPiecesChoose();
					
				/*第四块*/
					var curIndFour = $$(".fourthCont .active").index();
					var echartIdFour = $$(".fourthCont .tabBlockDetail>div").eq(curIndFour).find(".echartDetail").attr("id");
					
					switch(echartIdFour)
					{
						case 'dytzje':
						  //债转用户累计投资-金额
							areaInvestMoney(obj.tzcpph.je.day);
						  break;
						case 'dytzrs':
						  //债转用户累计投资-笔数
							areaInvestPeople(obj.tzcpph.bs.day);
						  break;
						/*case 'yyzl':
					  	  //投资产品偏好-客户数
					  		orderCondition(obj.tzcpph.khs.day);
					  	  break;*/
					  	
					}
					
					//投资产品偏好-金额中的日、周、月切换
					tzjeUserChoose();
					
					//投资产品偏好-笔数中的日、周、月切换
					tzbsUserChoose();
					
					//投资产品偏好-客户数中的日、周、月切换
					tzkhUserChoose();
					
		}
		
		//日期选择
		function dateSelect(){
			$$("#calendars").on("change",function(){
				var curDate =  $$(this).val();
				//判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
				//在此获取选择的日期重新发送请求
				if((new Date(curDate) >= new Date("2016-09-01")) && (new Date(curDate) <= new Date(beforeToday))){
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
			//此函数只起到切换的作用 	无需渲染
			var parentBox = $$(".firstCont .tableTitle");
			var subItem = parentBox.find("a");
			subItem.on("tap",function(){
				var curInd = $$(this).index();//获取当前点击的索引
				$$(this).addClass("active").siblings("div").removeClass();
				$$(".firstCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
				//加载对应的图表
				var href = $$(".firstCont .tabBlockDetail>div:eq("+curInd+")").find(".echartDetail").attr("id");
				
				switch(href){
					case "jekhzhl":
						//债转业务趋势-金额		无需判断直接渲染
						$$("#jeChooseItem>li:first-child").addClass("on").siblings().removeClass();
						jekhzhlCondition(obj.sftzbs.je,dateList);
						break;
					case "khzhl":
						//债转业务趋势-用户数		无需判断直接渲染
						$$("#khChooseItem>li:first-child").addClass("on").siblings().removeClass();
						khzhlCondition(obj.sftzbs.je,dateList);
						break;
				}
				
				/*//渲染顶部选项卡的流入资金 	topDay
				randerTopDay(obj);
				//渲染顶部选项卡的流出资金
				randerTopLc(obj)
				//渲染顶部选项卡的表格详情	topTable
				randerTopTable(obj);*/
				
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
						//卖出用户债转后资金流向-金额
						userCondition(obj.sftzbs.je,dateList);
						break;
					case "stzb":
						//卖出用户债转后资金流向-用户数
						firstCondition(obj.sftzbs.je,dateList);
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
						//债转用户首复投-金额
						$$("#lcjeChooseItem>li:first-child").addClass("on").siblings().removeClass();
						userCount(obj.sftzbs.je,dateList);
						break;
					case "xzyh":
						//债转用户首复投-笔数
						$$("#lcbsChooseItem>li:first-child").addClass("on").siblings().removeClass();
						newUser(obj.sftzbs.bs,dateList);
						break;
					case 'txtb':
					    //债转用户首复投-用户数
					    $$("#lckhChooseItem>li:first-child").addClass("on").siblings().removeClass();
					    withdrawCondition(obj.sftzbs.khs,dateList);
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
					  //债转用户累计投资-金额
					  	$$("#tzjeChooseItem>li:first-child").addClass("on").siblings().removeClass();
						areaInvestMoney(obj.tzcpph.je.day);
					  break;
					case 'dytzrs':
					  //债转用户累计投资-笔数
					  	$$("#tzbsChooseItem>li:first-child").addClass("on").siblings().removeClass();
						areaInvestPeople(obj.tzcpph.bs.day);
					  break;
					/*case 'yyzl':
					  //投资产品偏好-客户数
					  	$$("#tzkhChooseItem>li:first-child").addClass("on").siblings().removeClass();
					  	orderCondition(obj.tzcpph.khs.day);
					  break;*/
				}
				
			})
		}
		
		//债转业务趋势-用户数中卖出客户、买入客户切换
		function khzhChoose(){
			$$("#khChooseItem").on("tap","li",function(){
				var curValue = $$(this).data("value");
				$$(this).addClass("on").siblings().removeClass();
				
				//债转业务趋势-用户数		维度更改时改变
				khzhlCondition(obj.sftzbs.je,dateList);
				
			})
		}
		
		//债转业务趋势-金额中卖出客户、买入客户切换
		function jekhzhChoose(){
			$$("#jeChooseItem").on("tap","li",function(){
				var curValue = $$(this).data("value");
				$$(this).addClass("on").siblings().removeClass();
				
				//债转业务趋势-金额		维度更改时改变
				jekhzhlCondition(obj.sftzbs.je,dateList);
				
			})
		}
		
		//债转用户首复投-金额中的卖出客户、买入客户切换
		function lczjMoneyChoose(){
			$$("#lcjeChooseItem").on("tap","li",function(){
				var curValue = $$(this).data("value");
				$$(this).addClass("on").siblings().removeClass();
				
				//债转用户首复投-金额
				userCount(obj.sftzbs.je,dateList);
				
			})
		}
		
		//债转用户首复投-用户数中的卖出客户、买入客户切换
		function lczjUserChoose(){
			$$("#lckhChooseItem").on("tap","li",function(){
				var curValue = $$(this).data("value");
				$$(this).addClass("on").siblings().removeClass();
				
				//债转用户首复投-用户数
				withdrawCondition(obj.sftzbs.khs,dateList);
				
			})
		}
		
		//债转用户首复投-笔数中的卖出客户、买入客户切换
		function lczjPiecesChoose(){
			$$("#lcbsChooseItem").on("tap","li",function(){
				var curValue = $$(this).data("value");
				$$(this).addClass("on").siblings().removeClass();
				
				//债转用户首复投-笔数
				newUser(obj.sftzbs.bs,dateList);
				
			})
		}
		
		//投资产品偏好-金额中的日、周、月切换
		function tzjeUserChoose(){
			$$("#tzjeChooseItem").on("tap","li",function(){
				var curValue = $$(this).data("value");
				$$(this).addClass("on").siblings().removeClass();
				
				//债转用户累计投资-金额
				areaInvestMoney(obj.tzcpph.je[curValue]);
				
			})
		}
		
		//投资产品偏好-笔数中的日、周、月切换
		function tzbsUserChoose(){
			$$("#tzbsChooseItem").on("tap","li",function(){
				var curValue = $$(this).data("value");
				$$(this).addClass("on").siblings().removeClass();
				
				//债转用户累计投资-笔数
				areaInvestPeople(obj.tzcpph.bs[curValue]);
				
			})
		}
		
		//投资产品偏好-客户数中的日、周、月切换
		function tzkhUserChoose(){
			$$("#tzkhChooseItem").on("tap","li",function(){
				var curValue = $$(this).data("value");
				$$(this).addClass("on").siblings().removeClass();
				
				//流出资金占比-客户数
				orderCondition(obj.tzcpph.khs[curValue]);
				
			})
		}
		
		/*数值部分渲染*/
		
		var myvue=new Vue();//借助第三方vue用来传值
		
		//渲染顶部选项卡的流入资金
		function randerTopDay(obj){
			//请求成功后传递数据
			myvue.$emit('getLr',obj);
		}
		//渲染顶部流入资金	lrzj	日期变更时传参改变
		/*new Vue({
			el: '#lrzj',
			data: {
				big: '',//流入资金金额
				lrzj: ''
			},
			mounted: function(){
				var that = this;
				myvue.$on('getLr', function(obj){
					that.lrzj=obj;
					that.getNumDay();
				})
			},
			methods:{
				getNumDay: function(){
					var itemValue = outputmoney(this.lrzj.lrzjJe.toString());//获取金额格式化后的值
					this.big = itemValue;
				}
			}
		});*/
		
		//渲染顶部选项卡的流出资金
		function randerTopLc(obj){
			//请求成功后传递数据
			myvue.$emit('getLc',obj);
		}
		//渲染顶部流出资金	lczj	日期变更时传参改变
		/*new Vue({
			el: '#lczj',
			data: {
				big: '',//流出资金金额
				lczj: ''
			},
			mounted: function(){
				var that = this;
				myvue.$on('getLc', function(obj){
					that.lczj=obj;
					that.getNumDay();
				})
			},
			methods:{
				getNumDay: function(){
					var itemValue = outputmoney(this.lczj.lczjJe.toString());//获取金额格式化后的值
					this.big = itemValue;
				}
			}
		});*/
		
		//渲染顶部图表区域详情
		function randerTopTable(obj){
			//请求成功后传递数据
			myvue.$emit('getdataTable',obj);
		}
		//渲染顶部图表区域详情	日期变更时传参改变
		new Vue({
			el: '#topTable',
			data:{
				topMonthData: ''
			},
			mounted: function(){
				var that = this;
				myvue.$on('getdataTable', function(obj){
					that.topMonthData=obj;
				})
			},
			methods:{
				doTo: function(event,ind){
					if(ind == 2){
						$$(event.currentTarget).toggleClass("active");
						$$(event.currentTarget).nextAll("tr").css("background","#F7F7F7");
						$$(event.currentTarget).nextAll().toggle();
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
		
		/*************************************格式化金额结束**************************************/
		
		/*************************************图表渲染部分开始***********************************/
		
		//卖出用户债转后资金流向-金额
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
		            data:['充值','提现','投资','充值同比','提现同比','投资同比'],
		            itemGap: 6,
		            itemWidth:10,
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
		                name: '充值',
		                type: 'bar',
		                data: obj.sts,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '提现',
		                type: 'bar',
		                data: obj.fts,
					    itemStyle:{
				            normal:{
				                color:"#2FCACC"
				            }
				        }
		            },
		            {
		                name: '投资',
		                type: 'bar',
		                data: obj.fts,
					    itemStyle:{
				            normal:{
				                color:"#ffcca0"
				            }
				        }
		            },
		            {
			            name:'充值同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.sttbs,
			            itemStyle:{
				            normal:{
				            	color:"#6E9BFC"
				                //color:"#F8405F"
				            }
				        }
			        },
			        {
			            name:'提现同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.fttbs,
			            itemStyle:{
				            normal:{
				            	color:"#2FCACC"
				                //color:"#A73DFF"
				            }
				        }
			        },
			        {
			            name:'投资同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.fttbs,
			            itemStyle:{
				            normal:{
				            	color:"#ffcca0"
				                //color:"#A73DFF"
				            }
				        }
			        }
		        ]
		    };
				
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		
		}
		
		//债转业务趋势-金额
		function jekhzhlCondition(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('jekhzhl'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data:['首投客户','首投同比'],
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
		                name: '首投客户',
		                type: 'bar',
		                data: obj.sts,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
			            name:'首投同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.sttbs,
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
		
		//债转业务趋势-用户数
		function khzhlCondition(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('khzhl'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        legend: {
		            data:['首投客户','首投同比'],
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
		                name: '首投客户',
		                type: 'bar',
		                data: obj.sts,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
			            name:'首投同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.sttbs,
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
		
		//卖出用户债转后资金流向-用户数
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
		            data:['充值','提现','投资','充值同比','提现同比','投资同比'],
		            itemGap: 6,
		            itemWidth:10,
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
		                name: '充值',
		                type: 'bar',
		                data: obj.sts,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '提现',
		                type: 'bar',
		                data: obj.fts,
					    itemStyle:{
				            normal:{
				                color:"#2FCACC"
				            }
				        }
		            },
		            {
		                name: '投资',
		                type: 'bar',
		                data: obj.fts,
					    itemStyle:{
				            normal:{
				                color:"#ffcca0"
				            }
				        }
		            },
		            {
			            name:'充值同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.sttbs,
			            itemStyle:{
				            normal:{
				            	color:"#6E9BFC"
				                //color:"#F8405F"
				            }
				        }
			        },
			        {
			            name:'提现同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.fttbs,
			            itemStyle:{
				            normal:{
				            	color:"#2FCACC"
				                //color:"#A73DFF"
				            }
				        }
			        },
			        {
			            name:'投资同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.fttbs,
			            itemStyle:{
				            normal:{
				            	color:"#ffcca0"
				                //color:"#A73DFF"
				            }
				        }
			        }
		        ]
		    };
				
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
			
		}
		
		//债转用户首复投-用户数
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
		            data:['首投客户','复投客户','首投同比','复投同比'],
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
		                name: '首投客户',
		                type: 'bar',
		                data: obj.sts,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '复投客户',
		                type: 'bar',
		                data: obj.fts,
					    itemStyle:{
				            normal:{
				                color:"#2FCACC"
				            }
				        }
		            },
		            {
			            name:'首投同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.sttbs,
			            itemStyle:{
				            normal:{
				                color:"#F8405F"
				            }
				        }
			        },
			        {
			            name:'复投同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.fttbs,
			            itemStyle:{
				            normal:{
				                color:"#A73DFF"
				            }
				        }
			        }
		        ]
		    };
				
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
			
		}
		
		//投资产品偏好-客户数
		function orderCondition(obj,date){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('yyzl'));
		    
		    var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        grid: {
		            top: '15%',
		            bottom:'5%',
		            left: '3%',
		            right: '3%',
		            containLabel: true
		        },
		        xAxis: [
		            {
		                type : 'category',
		                data : obj.typeList,
		                axisTick:{
			                show:false
			            },
			            axisLine:{
			                show:false
			            }/*,
			            axisLabel: {
			            	rotate :53
			            }*/
		            }
		        ],
		        yAxis: [
		            {
			            type: 'value',
			            name: '万',
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
			                formatter: '{value}'
			            }
			        },
		            {
			            type: 'value',
			            name: '%',
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
		                name: '数值',
		                type: 'bar',
		                data: obj.numList,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
			            name:'同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.hbList,
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
		
		//债转用户首复投-金额
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
		            data:['首投客户','复投客户','首投同比','复投同比'],
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
		                name: '首投客户',
		                type: 'bar',
		                data: obj.sts,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '复投客户',
		                type: 'bar',
		                data: obj.fts,
					    itemStyle:{
				            normal:{
				                color:"#2FCACC"
				            }
				        }
		            },
		            {
			            name:'首投同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.sttbs,
			            itemStyle:{
				            normal:{
				                color:"#F8405F"
				            }
				        }
			        },
			        {
			            name:'复投同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.fttbs,
			            itemStyle:{
				            normal:{
				                color:"#A73DFF"
				            }
				        }
			        }
		        ]
		    };
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		}
		
		//债转用户首复投-笔数
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
		            data:['首投客户','复投客户','首投同比','复投同比'],
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
		                name: '首投客户',
		                type: 'bar',
		                data: obj.sts,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
		                name: '复投客户',
		                type: 'bar',
		                data: obj.fts,
					    itemStyle:{
				            normal:{
				                color:"#2FCACC"
				            }
				        }
		            },
		            {
			            name:'首投同比',
			            type:'line',
			            yAxisIndex: 1,
			            data:obj.sttbs,
			            itemStyle:{
				            normal:{
				                color:"#F8405F"
				            }
				        }
			        },
			        {
			            name:'复投同比',
			            type:'line',
			            yAxisIndex: 1,
			            data:obj.fttbs,
			            itemStyle:{
				            normal:{
				                color:"#A73DFF"
				            }
				        }
			        }
		        ]
		    };
		
			
			//使用刚指定的配置项和数据显示图表。
		  	myChart.setOption(option);
		}
		
		//债转用户累计投资-金额
		function areaInvestMoney(obj){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('dytzje'));
		   
			var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        grid: {
		            top: '15%',
		            bottom:'5%',
		            left: '3%',
		            right: '3%',
		            containLabel: true
		        },
		        xAxis: [
		            {
		                type : 'category',
		                data : obj.typeList,
		                axisTick:{
			                show:false
			            },
			            axisLine:{
			                show:false
			            }/*,
			            axisLabel: {
			            	rotate :53
			            }*/
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
		                name: '数值',
		                type: 'bar',
		                data: obj.numList,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
			            name:'同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.hbList,
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
		
		//债转用户累计投资-笔数
		function areaInvestPeople(obj,maxNum){
			
			// 基于准备好的dom，初始化echarts实例
		    var myChart = echarts.init(document.getElementById('dytzrs'));
		   
			var option = {
		        tooltip : {
		            trigger: 'axis',
		            confine: true,
		            backgroundColor: 'rgba(87,106,118,0.7)'
		        },
		        grid: {
		            top: '15%',
		            bottom:'5%',
		            left: '3%',
		            right: '3%',
		            containLabel: true
		        },
		        xAxis: [
		            {
		                type : 'category',
		                data : obj.typeList,
		                axisTick:{
			                show:false
			            },
			            axisLine:{
			                show:false
			            }/*,
			            axisLabel: {
			            	rotate :53
			            }*/
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
		                name: '数值',
		                type: 'bar',
		                data: obj.numList,
					    itemStyle:{
				            normal:{
				                color:"#6E9BFC"
				            }
				        }
		            },
		            {
			            name:'同比',
			            type:'line',
			            yAxisIndex: 1,
			            data: obj.hbList,
			            itemStyle:{
				            normal:{
				                color:"#F8405F"
				            }
				        }
			        }
		        ]
		    };
			
			//使用刚指定的配置项和数据显示图表
		  	myChart.setOption(option);
		  	
		}
		
})(mui,jQuery,document)
