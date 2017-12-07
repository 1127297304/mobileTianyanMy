;(function($,$$,doc,appGlobal){
    $.init({
        swipeBack: false//关闭右滑关闭功能
    })

    var obj;//初始请求的全局变量用以缓存数据
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
            newUrl:"/meiyifang/overview.gm",
            type:"get",
            data:{
                date:beforeToday
            },
            callback:function(data){
                $$('.mask').css('display','none');
                obj = data.data.datainfo;
                
                randerAllPage(obj);
            }
        })
    }
    //日期选择
    dateSelect();
    //全部地区选择列表
	selectAll();
	//北京地区选择列表
	selectBj();
	//上海地区选择列表
	selectSh();
	//天津地区选择列表
	selectTj();
    //指标说明弹框
    tipsExplain();
    //第一块	kpi跟踪
    firstTabChange();
    //第三块	用户规模
    secondTabChange();
    //第四块	利率分析
    fiveTabChange();
    //日期选择
    function dateSelect(){
        $$("#calendars").on("change",function(){
            var curDate =  $$(this).val();
            //判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
            //在此获取选择的日期重新发送请求
            if((new Date(curDate) >= new Date("2017-01-03")) && (new Date(curDate) <= new Date(beforeToday))){
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
    
    //全部地区选择列表
	function selectAll(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'je',
			text: '金额(万元)'
		}, {
			value: 'js',
			text: '件数'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showUserPickerAll');
		var userResult = doc.getElementById('userResultAll');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				var chType = $$(".fiveCont .active").attr("data-code");
				//地域分析
	            if(obj.rate_analyze[chType]){
		       		myvue.$emit('changeData',obj.rate_analyze[chType][items[0].value]);
	            }
			});
		}, false);	
	}
	
	//北京地区选择列表
	function selectBj(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'je',
			text: '金额(万元)'
		}, {
			value: 'js',
			text: '件数'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showUserPickerBj');
		var userResult = doc.getElementById('userResultBj');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				var chType = $$(".fiveCont .active").attr("data-code");
				//地域分析
	            if(obj.rate_analyze[chType]){
		       		myvue.$emit('changeData',obj.rate_analyze[chType][items[0].value]);
	            }
			});
		}, false);	
	}
	
	//上海地区选择列表
	function selectSh(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'je',
			text: '金额(万元)'
		}, {
			value: 'js',
			text: '件数'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showUserPickerSh');
		var userResult = doc.getElementById('userResultSh');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				var chType = $$(".fiveCont .active").attr("data-code");
				//地域分析
	            if(obj.rate_analyze[chType]){
		       		myvue.$emit('changeData',obj.rate_analyze[chType][items[0].value]);
	            }
			});
		}, false);	
	}
	
	//天津地区选择列表
	function selectTj(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'je',
			text: '金额(万元)'
		}, {
			value: 'js',
			text: '件数'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showUserPickerTj');
		var userResult = doc.getElementById('userResultTj');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				var chType = $$(".fiveCont .active").attr("data-code");
				//地域分析
	            if(obj.rate_analyze[chType]){
		       		myvue.$emit('changeData',obj.rate_analyze[chType][items[0].value]);
	            }
			});
		}, false);	
	}
    
    //指标说明弹框
    function tipsExplain(){
    	//kpi跟踪指标说明
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
    	//业绩概览指标说明
    	$$("#businessOverviewQues").on("click",function(){
    		$$("#businessOverviewQuesBox").show();
    		//弹框出现时页面禁止滚动
    		$$(".mui-content").css({
    			"width":"100%",
    			"height":"100%"
    		})
    		$$(".mui-content")[0].style.overflow = 'hidden';
    		document.body.style.overflow = 'hidden';
    	})
    	$$("#businessOverviewClose").on("click",function(){
    		$$("#businessOverviewQuesBox").hide();
    		//弹框关闭时页面恢复滚动
    		$$(".mui-content").css({
    			"width":"initial",
    			"height":"initial"
    		})
    		$$(".mui-content")[0].style.overflow = 'scroll';
    		document.body.style.overflow = 'scroll';
    	})
    	//用户规模指标说明
    	$$("#riskOverviewQues").on("click",function(){
    		$$("#riskOverviewQuesBox").show();
    		//弹框出现时页面禁止滚动
    		$$(".mui-content").css({
    			"width":"100%",
    			"height":"100%"
    		})
    		$$(".mui-content")[0].style.overflow = 'hidden';
    		document.body.style.overflow = 'hidden';
    	})
    	$$("#riskOverviewClose").on("click",function(){
    		$$("#riskOverviewQuesBox").hide();
    		//弹框关闭时页面恢复滚动
    		$$(".mui-content").css({
    			"width":"initial",
    			"height":"initial"
    		})
    		$$(".mui-content")[0].style.overflow = 'scroll';
    		document.body.style.overflow = 'scroll';
    	})
    }
    
    //第一块tab切换区域	kpi跟踪
    function firstTabChange(){
        var parentBox = $$(".firstCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
        	
            var curCode = $$(this).attr("data-code");
        	
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            if(obj.kpi_track){
            	myvue.$emit('getdataDay',obj.kpi_track[curCode]);//kpi跟踪
            	progressCondition(obj.kpi_track[curCode]);//进度条
            }
            
        })
    }
    
    //第三块tab切换区域	用户规模
    function secondTabChange(){
        var parentBox = $$(".secondCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();
            var curCode = $$(this).attr("data-code");
        	
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            if(obj.user_scale){
            	myvue.$emit('getRiskData',obj.user_scale[curCode]);
            }
            
        })
    }
    
    //第五块tab切换区域	利率分析
    function fiveTabChange(){
    	var parentBox = $$(".fiveCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
        	var areaCode = $$(this).attr("data-code");
        	var curInd = $$(this).index();
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            $$(".fiveCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
            var chType = $$(".fiveCont .tabBlockDetail>div:eq("+curInd+")").find(".pickerRe").attr("data-value");
            //地域分析
            if(obj.rate_analyze[areaCode]){
	       		myvue.$emit('changeData',obj.rate_analyze[areaCode][chType]);
	        }
        })
    }
    
    //渲染总数据
    function randerAllPage(obj){
    	
        //渲染顶部kpi跟踪	topDay
        var kpiCode = $$(".firstCont .active").attr("data-code");
        myvue.$emit('getdataDay',obj.kpi_track[kpiCode]);//kpi跟踪
        //进度条渲染
        progressCondition(obj.kpi_track[kpiCode]);
        
        //业绩概览
        myvue.$emit('getTrueLoan',obj);
        
        //用户规模
		var curCode = $$(".secondCont .active").attr("data-code");
		myvue.$emit('getRiskData',obj.user_scale[curCode]);
		
        //利率分析
		var areaCode = $$(".fiveCont .active").attr("data-code");
		var curInd = $$(".fiveCont .active").index();
		var chType = $$(".fiveCont .tabBlockDetail>div:eq("+curInd+")").find(".pickerRe").attr("data-value");
		myvue.$emit('changeData',obj.rate_analyze[areaCode][chType]);//地域分析
    }
    
    //进度条插件
    function progressCondition(obj){
        //入口
        appGlobal.util.init();
        new appGlobal.progress('progress2',{
            totalData:appGlobal.util.stringToNumber(100),//项目计划总完成量
            planData:appGlobal.util.stringToNumber(obj.time_schedule),//时间进度
            actualData:appGlobal.util.stringToNumber(obj.kpi_complete_rate)//月实际完成率
        });
    }

    /*数值部分渲染*/
    var myvue=new Vue();//借助第三方vue用来传值
    
    //渲染顶部区域当月、当年跟踪	日期变更	或者	维度变更时传参改变
    new Vue({
        el: '#topDay',
        data: {
            comBig:'',
            comSmall:'',
            kpiBig:'',
            kpiSmall:'',
            topDayData: {},
        },
        mounted:function(){
            var _this=this;
            myvue.$on('getdataDay', function(obj){
                _this.topDayData=obj;
                //数字类型转千分符
                for(var key in _this.topDayData){
                	if(_this.topDayData[key] != ''){
	                    if(typeof _this.topDayData[key]!='string' && _this.topDayData[key]!=null){
							_this.topDayData[key]=outputmoney(_this.topDayData[key].toString());
	                    }
                    }else if(_this.topDayData[key] == ''){
                        _this.topDayData[key]= 0 ;
                    }
                }
                _this.getNumDay();
            })
        },
        methods:{
            getNumDay: function(){
                //获取金额格式化后的值
                var comBigValue=this.topDayData.loan_amount.toString();
                var kpiValue=this.topDayData.kpi_amount.toString();
                
                if(comBigValue.indexOf('.')!=-1){
                    this.comBig = comBigValue.slice(0,comBigValue.indexOf('.'));//截取小数点以前的金额
                    this.comSmall = comBigValue.slice(comBigValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.comBig = comBigValue;
                    this.comSmall ="";
                }

                if(kpiValue.indexOf('.')!=-1){
                    this.kpiBig = kpiValue.slice(0,kpiValue.indexOf('.'));//截取小数点以前的金额
                    this.kpiSmall = kpiValue.slice(kpiValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.kpiBig = kpiValue;
                    this.kpiSmall ="";
                }
            }
        }
    });
    
    //渲染业绩概览	日期变更	或者	维度变更时传参改变
    new Vue({
        el: '#trueLoan',
        data: {
            topDayData: {},
            clickClass: '',
            initPro:''
        },
        mounted:function(){
            var _this=this;
            myvue.$on('getTrueLoan', function(obj){
                _this.topDayData = obj.achieve_overview;
                if(obj.achieve_overview.prod_data.length != 0){
                	_this.clickClass = _this.topDayData.prod_data[0].name;//默认高亮的产品
                	_this.initPro = _this.topDayData.prod_data[0].code;//默认显示的产品柱状图
                	this.$nextTick(function(){
						_this.barChart(_this.topDayData.line_chart[_this.initPro],_this.clickClass);	//柱状图
                	})
                	if(_this.topDayData.pie_chart.data_list.length!=0){
	                	this.$nextTick(function(){
			        	_this.achieveChart(_this.topDayData.pie_chart);	//玫瑰图
	                	})
	            	}else{
	            		$$("#yjgl").text("暂无图表信息");
	            	}
                }
                
                //数字类型转千分符	不同产品类型金额
                for(var key in _this.topDayData.prod_data){
                    if(typeof _this.topDayData.prod_data[key].loan_amount=='number'&&_this.topDayData.prod_data[key].loan_amount!=null){
                        _this.topDayData.prod_data[key].loan_amount=outputmoney(_this.topDayData.prod_data[key].loan_amount.toString());
                    }else if(_this.topDayData.prod_data[key].loan_amount==null){
                        _this.topDayData.prod_data[key].loan_amount='-';
                    }
                }
            })
        },
        methods:{
            achieveChart: function(pieData){
            	//业绩概览-丁格尔图
        		performanceOverview(pieData);
            },
            clickChange: function(code,name){
            	//点击更改高亮显示
            	this.clickClass = name;
            	this.barChart(this.topDayData.line_chart[code],name);//改变柱状图
            },
            barChart: function(item,name){
            	//业绩概览-柱状图
        		userCondition(item,name);
            }
        }
    });
    
    //渲染风控概览	日期变更	或者	维度变更时传参改变
    new Vue({
        el: '#riskManage',
        data: {
            riskData:''
        },
        mounted:function(){
            var _this=this;
            myvue.$on('getRiskData', function(obj){
                _this.riskData = obj;
            	this.$nextTick(function(){
					_this.riskLineChart(_this.riskData);//折线图
            	})
            })
        },
        methods:{
            riskLineChart: function(item){
            	//风控概览-折线图
    			failedReason(item)
            }
        }
    });
    
    //地图  地域分布
    new Vue({
        "el":"#cityDetails",
        data:{
            areaData:{}
        },
        mounted:function(){
            var _this=this;
            myvue.$on('changeData', function(obj){
                //处理返回数据
                _this.areaData = obj;
                if(obj.total_loan_amount.length != 0){
                	this.$nextTick(function(){
 						_this.areaChart(_this.areaData);
                	})
                }else{
	            	$$("#dyjj").text("暂无图表信息");
	            }
            });
        },
        methods:{
            areaChart: function(item){
            	//地域分布
    			dyJjCondition(item)
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
	
	//业绩概览-丁格尔图
	function performanceOverview(obj){
		
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('yjgl'));
		
		var option = {
		    /*title : {//如需添加标题则放开注释
		        text: '南丁格尔玫瑰图',
		        subtext: '',
		        x:'right'
		    },*/
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)",
                confine: true,
                show: false,
                backgroundColor: 'rgba(87,106,118,0.7)'
		    },
		    //color:['red','yellow','lightblue','lightgreen','purple'],如需改变颜色
		    legend: {
		    	show: false,
		        x : 'center',
		        y : 'bottom',
		        data: obj.prod_list,
		        selectedMode: false
		    },
		    calculable : true,
		    series : [
		        {
		            name:'放款金额',
		            type:'pie',
		            radius : [30, 94],//此处如果需要加标题	则图表的半径需要减小
		            center : ['50%', '50%'],
		            roseType : 'area',
		            data: obj.data_list,
		            labelLine: {
		                normal: {
		                    length: 10,
		                    length2: 4
		                }
		            }
		        }
		    ]
		};
		
		//使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
	}	
   
    //业绩概览-柱状图
    function userCondition(obj,curName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('tzzl'));

        var option = {
        	title: {
		        text: curName,
		        textStyle:{
		        	fontSize: 12
		        },
		        top:0,
		        right:0
		    },
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
                formatter:function(params){
                    var str=params[0].name+'</br>';
                    var divideNum , col;
                    if(params.length>1){
                    	$.each(params,function(i,val){
	                        col=option.series[i].itemStyle.normal.color;
	                        str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col+'"></span>'+val.seriesName+' ：'+val.value+'</br>';
	                    });
                    }else{
                    	str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+params[0].color+'"></span>'+params[0].seriesName+' ：'+params[0].value+'</br>';
                    }
					//如果放款金额、放款件数缺一则件均不显示
                    if(params[0] && params[1]){
	                    if(params[1].value == 0){
	                    	divideNum = 0;
	                    }else{
	                    	divideNum=(params[0].value/params[1].value).toFixed(2);
	                    }
	                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:lightgreen"></span>件均 : '+divideNum;
	                }
                    return str;
                }
            },
            calculable : true,
            legend: {
                data:['放款金额','放款件数'],
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
                    data : obj.date_list,
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
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisTick:{
                        show:false
                    },
                    axisLine:{
                        show:false
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            type:"dotted"
                        }
                    },
                },
                {
                    type: 'value',
                    name: '',
                    /*min: 0,
                     max: 40,
                     interval: 10,控制最大值、最小值及幅度*/
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisTick:{
                        show:false
                    },
                    axisLine:{
                        show:false
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            type:"dotted"
                        }
                    },
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
                    name: '放款金额',
                    type: 'bar',
                    data: obj.loan_amount_list,
                    itemStyle:{
                        normal:{
                            color:"#6FC3FF"
                        }
                    }
                },
                {
                    name:'放款件数',
                    type:'line',
                    yAxisIndex: 1,
                    data:obj.loan_num_list,
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

    //风控概览-折线图
    function failedReason(obj){
    	
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('sbyy'));

        var option = {
        	title: {
		        text: '',
		        textStyle:{
		        	fontSize: 12
		        },
		        top:0,
		        right:0
		    },
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            calculable : true,
            legend: {
                data:['月累计进件件数'],
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
                bottom: '15%',
                left: '3%',
                right: '3%',
                containLabel: true
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
            xAxis: [
                {
                    type : 'category',
                    data : obj.date_list,
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    /*min: 0,
                     max: 5,
                     interval: 1,控制最大值、最小值及幅度*/
                    axisLabel: {
                        formatter: '{value}'
                    },
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
                }
            ],
            series : [
                {
                    name: '月累计进件件数',
                    type: 'line',
                    data: obj.artificial_credit,
                    itemStyle:{
                        normal:{
                            color:"#e84e40"
                        }
                    }
                }
            ]
        };
        
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //地域分布
    function dyJjCondition(obj){

        // 基于准备好的dom，初始化echarts实例
	    var myChart = echarts.init(document.getElementById('dyjj'));
	    
	    var option = {
	        tooltip : {
	            trigger: 'axis',
	            confine: true,
	            backgroundColor: 'rgba(87,106,118,0.7)'
	        },
	        legend: {
	            data: ['累计','存量'],
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
	                data : obj.name_list,
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
	                name: '累计',
	                type: 'bar',
	                data: obj.total_loan_amount,
				    itemStyle:{
			            normal:{
			                color:"#6E9BFC"
			            }
			        }
	            },
	            {
	                name: '存量',
	                type: 'bar',
	                data: obj.stock_loan_amount,
				    itemStyle:{
			            normal:{
			            	color:"#F8405F"
			                //color:"#2BE1CF"
			            }
			        }
	            }
	        ]
	    };
			
		//使用刚指定的配置项和数据显示图表。
	  	myChart.setOption(option);
    }
})(mui,jQuery,document,window.biMobile)
