;(function($,$$,doc,appGlobal){
    $.init({
        swipeBack: false//关闭右滑关闭功能
    })

    var obj;//初始请求的全局变量用以缓存数据
    var beforeToday;//当天前一天的完整日期格式
    var loadNum=5;//控制遮罩消失
    var curDayOverviewObj,dealScaleObj,proAnalyzeObj;
    //		当日概览对象			交易规模对象		产品分析对象

    //给所有的tab标签添加局部滚动
    mui('.mui-scroll-wrapper').scroll();

    //判断当前显示的时间
    showCurTime();

    //判断当前的显示时间
    function showCurTime(){

        //获取当前日期	如果当天为1号则取上个月最后一天的日期
        beforeToday=GetDateStr(-1);

        $$("#showAutoLoanDate").text(beforeToday);//在页面中显示当前日期
        $$("#onlyDay").val(beforeToday);	//当日概览-日
        $$("#onlyMonth").val(beforeToday.slice(0,7));	//当日概览-月
        $$("#scaleSum").val(beforeToday);	//交易规模-保险总额-日
        $$("#scaleUser").val(beforeToday);	//交易规模-新增用户-日
        $$("#proAmount").val(beforeToday);	//产品分析-保险金额
        $$("#proNum").val(beforeToday);		//产品分析-保险笔数
        $$("#rateDay").val(beforeToday);	//渠道占比-日
        $$("#rateMonth").val(beforeToday.slice(0,4));	//渠道占比-月

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

    //渠道占比-请求数据
    function channelRateData(curTime,flagType){
    	
        $$.ajaxData({
            newUrl:"/insurance/overview/channelrate.gm",
            type:"get",
            data:{
                flag: flagType,
				date: curTime
            },
            callback:function(data){
                //渠道占比
				var curChannelType = $$(".fiveCont .active").index();
				var curChannelTime = $$(".fiveCont .tabBlockDetail>div:eq("+curChannelType+")").find("input").val();
                //渠道占比-请求数据
	       		myvue.$emit('changeData',data.data.datainfo);
	       		loadNum--;
	       		if(loadNum == 0){
	       			$$('.mask').css('display','none');//增加判断
	       		}
            }
        })
    }
    //当日概览-请求数据
	function curDayOverview(curTime,flagType){
		
		$$.ajaxData({
			newUrl:"/insurance/overview/dailyoverview.gm",
			type:"get",
			data:{
				flag: flagType,
				date: curTime
			},
			callback:function(data){
				curDayOverviewObj = data.data.datainfo;//当日概览对象
				var curInd = $$(".firstCont .active").index();
				var chPlat = $$(".firstCont .tabBlockDetail>div:eq("+curInd+")").find(".platType").attr("data-value");
				var chAmount = $$(".firstCont .tabBlockDetail>div:eq("+curInd+")").find(".amountType").attr("data-value");
				//console.log(curTime+' '+flagType+' '+chPlat+' '+chAmount)
				//业绩概览
        		myvue.$emit('getTrueLoan',data.data.datainfo[chPlat][chAmount]);
        		loadNum--;
	       		if(loadNum == 0){
	       			$$('.mask').css('display','none');//增加判断
	       		}
			}
		})
	}
	//交易规模-请求数据
	function dealScale(curTime,flagType){
		
		$$.ajaxData({
			newUrl:"/insurance/overview/dealsize.gm",
			type:"get",
			data:{
				flag: flagType,
				date: curTime
			},
			callback:function(data){
				dealScaleObj = data.data.datainfo;
				var curInd = $$(".secondCont .active").index();
				//交易规模
				if(curInd == 0){
					var chPlat = $$(".secondCont .tabBlockDetail>div:eq(0)").find(".platType").attr("data-value");
					myvue.$emit('getRiskData',data.data.datainfo[chPlat],curInd);
				}else if(curInd == 1){
					myvue.$emit('getRiskData',data.data.datainfo,curInd);
				}
        		loadNum--;
	       		if(loadNum == 0){
	       			$$('.mask').css('display','none');//增加判断
	       		}
			}
		})
	}
	//产品分析-请求数据
	function proAnalysizeData(curTime,flagType){
		
		$$.ajaxData({
			newUrl:"/insurance/overview/prodanalysis.gm",
			type:"get",
			data:{
				flag: flagType,
				date: curTime
			},
			callback:function(data){
				proAnalyzeObj = data.data.datainfo;
				var curInd = $$(".thirdCont .active").index();
				var chAmount = $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").find(".amountType").attr("data-value");
				//console.log(curTime+' '+flagType+' '+chAmount)
				//产品分析
				myvue.$emit('getProData',data.data.datainfo[chAmount],data.data.datainfo.date_list);
				loadNum--;
	       		if(loadNum == 0){
	       			$$('.mask').css('display','none');//增加判断
	       		}
			}
		})
	}
	//新增提示框	昨日更新  或  历史数据  请求数据
    function yesterdayOrHistory(beforeToday){
    	$$.ajaxData({
			newUrl:"/insurance/overview/isupdate.gm",
			type:"get",
			data:{
				date: beforeToday
			},
			callback:function(data){
				//提示框信息
				myvue.$emit('tipsInfo',data.data.datainfo);
				loadNum--;
	       		if(loadNum == 0){
	       			$$('.mask').css('display','none');//增加判断
	       		}
			}
		})
    }
    //日期选择
    dateSelect();
    //保费金额选择列表	日
	daySelectMoney();
	//全部平台选择列表	日
	daySelectPlatform();
	//保费金额选择列表	月
	monSelectMoney();
	//全部平台选择列表	月
	monSelectPlatform();
	//全部平台选择列表	交易规模-保险总额
	scaleSelectPlatform();
	//产品分析选择列表	保险金额
	proAmountSelect();
	//产品分析选择列表	保险笔数
	proNumSelect();
    //指标说明弹框
    tipsExplain();
    //第一块	当日概览
    firstTabChange();
    //第二块	交易规模
    secondTabChange();
    //第三块	产品分析
    thirdTabChange();
    //第四块	渠道占比
    fiveTabChange();
    //日期选择
    function dateSelect(){
        var btns = $('.btn');
		btns.each(function(i, btn) {
			btn.addEventListener('tap', function() {
				var dateOptions;
				switch(i)
				{
					case 0:
						//当日概览-日
						dateOptions={
							type: "date",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 1:
						//当日概览-月
						dateOptions={
							type: "month",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 2:
						//交易规模-保险总额-日
						dateOptions={
							type: "date",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 3:
						//交易规模-新增用户-日
						dateOptions={
							type: "date",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 4:
						//产品分析-保险金额
						dateOptions={
							type: "date",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 5:
						//产品分析-保险笔数
						dateOptions={
							type: "date",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 6:
						//渠道占比-日
						dateOptions={
							type: "date",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
						break;
					case 7:
						//渠道占比-月
						dateOptions={
							type: "year",
							beginDate: new Date("2017-03-01"),
							endDate: new Date(beforeToday)
						}
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
							//当日概览-日	请求数据
							curDayOverview(rs.text,i+1);
							break;
						case 1:
							//当日概览-月	请求数据
							curDayOverview(rs.text,i+1);
							break;
						case 2:
							//交易规模-请求数据
							var curScaleTypeOne = $$(".secondCont .active").index();
							dealScale(rs.text,curScaleTypeOne+1);
							break;
						case 3:
							//交易规模-请求数据
							var curScaleTypeTwo = $$(".secondCont .active").index();
							dealScale(rs.text,curScaleTypeTwo+1);
							break;
						case 4:
							//产品分析-请求数据
							var curProTypeOne = $$(".thirdCont .active").index();
							proAnalysizeData(rs.text,curProTypeOne+1);
							break;
						case 5:
							//产品分析-请求数据
							var curProTypeTwo = $$(".thirdCont .active").index();
							proAnalysizeData(rs.text,curProTypeTwo+1);
							break;
						case 6:
							//渠道占比-请求数据
							var curChannelTypeOne = $$(".fiveCont .active").index();
					    	channelRateData(rs.text,curChannelTypeOne+1);
					    	break;
					    case 7:
					    	//渠道占比-请求数据
							var curChannelTypeTwo = $$(".fiveCont .active").index();
					    	channelRateData(rs.text,curChannelTypeTwo+1);
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
    
    //保费金额选择列表	日
	function daySelectMoney(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'premium_amt',
			text: '保费金额'
		}, {
			value: 'insure_customer_num',
			text: '投保客户数'
		}, {
			value: 'insure_order_num',
			text: '保单笔数'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showDayMoneyPicker');
		var userResult = doc.getElementById('dayMoneyResult');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				var chPlat = $$(".firstCont .tabBlockDetail>div:eq(0)").find(".platType").attr("data-value");
				//业绩概览
        		myvue.$emit('getTrueLoan',curDayOverviewObj[chPlat][items[0].value]);
			});
		}, false);	
	}
	
	//全部平台选择列表	日
	function daySelectPlatform(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'all',
			text: '全部平台'
		}, {
			value: 'online',
			text: '线上'
		}, {
			value: 'offline',
			text: '线下'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showDayPlatformPicker');
		var userResult = doc.getElementById('dayPlatform');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				var chAmount = $$(".firstCont .tabBlockDetail>div:eq(0)").find(".amountType").attr("data-value");
				//业绩概览
				myvue.$emit('getTrueLoan',curDayOverviewObj[items[0].value][chAmount]);
			});
		}, false);
	}
	
	//保费金额选择列表	月
	function monSelectMoney(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'premium_amt',
			text: '保费金额'
		}, {
			value: 'insure_customer_num',
			text: '投保客户数'
		}, {
			value: 'insure_order_num',
			text: '保单笔数'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showMonMoneyPicker');
		var userResult = doc.getElementById('monMoneyResult');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				var chPlat = $$(".firstCont .tabBlockDetail>div:eq(1)").find(".platType").attr("data-value");
				//业绩概览
        		myvue.$emit('getTrueLoan',curDayOverviewObj[chPlat][items[0].value]);
			});
		}, false);	
	}
	
	//全部平台选择列表	月
	function monSelectPlatform(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'all',
			text: '全部平台'
		}, {
			value: 'online',
			text: '线上'
		}, {
			value: 'offline',
			text: '线下'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showMonPlatformPicker');
		var userResult = doc.getElementById('monPlatform');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				var chAmount = $$(".firstCont .tabBlockDetail>div:eq(1)").find(".amountType").attr("data-value");
				//业绩概览
				myvue.$emit('getTrueLoan',curDayOverviewObj[items[0].value][chAmount]);
			});
		}, false);
	}
	
	//全部平台选择列表	交易规模-保险总额
	function scaleSelectPlatform(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'all',
			text: '全部平台'
		}, {
			value: 'online',
			text: '线上'
		}, {
			value: 'offline',
			text: '线下'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showScalePlatPicker');
		var userResult = doc.getElementById('scalePlatResult');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				//交易规模
				myvue.$emit('getRiskData',dealScaleObj[items[0].value],0);
			});
		}, false);
	}
	
	//产品分析选择列表	保险金额
	function proAmountSelect(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'financial',
			text: '理财类'
		}, {
			value: 'non_car',
			text: '非车保障类'
		}, {
			value: 'auto_insure',
			text: '车险类'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showProAmountPicker');
		var userResult = doc.getElementById('proAmountResult');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				//产品分析-请求数据
				myvue.$emit('getProData',proAnalyzeObj[items[0].value],proAnalyzeObj.date_list);
				
			});
		}, false);
	}
	
	//产品分析选择列表	保险笔数
	function proNumSelect(){
		//普通示例
		var userPicker = new $.PopPicker();
		var data=[{
			value: 'financial',
			text: '理财类'
		}, {
			value: 'non_car',
			text: '非车保障类'
		}, {
			value: 'auto_insure',
			text: '车险类'
		}];
		userPicker.setData(data);
		var showUserPickerButton = doc.getElementById('showProNumPicker');
		var userResult = doc.getElementById('proNumResult');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				userResult.setAttribute("data-value",items[0].value)
				//返回 false 可以阻止选择框的关闭
				//return false;
				//产品分析-请求数据
				myvue.$emit('getProData',proAnalyzeObj[items[0].value],proAnalyzeObj.date_list);
			});
		}, false);
	}
    
    //指标说明弹框
    function tipsExplain(){
    	//kpi跟踪指标说明
    	$$("#businessOverviewQues").on("click",function(){
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
    
    //第一块tab切换区域	当日概览
    function firstTabChange(){
        var parentBox = $$(".firstCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            $$(".firstCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
            //当日概览
	        var curDayTime = $$(".firstCont .tabBlockDetail>div:eq("+curInd+")").find("input").val();
	        //当日概览-请求数据
			curDayOverview(curDayTime,curInd+1);
        })
    }
    
    //第二块tab切换区域	交易规模
    function secondTabChange(){
        var parentBox = $$(".secondCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            $$(".secondCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
            //交易规模
	        var curScaleTime = $$(".secondCont .tabBlockDetail>div:eq("+curInd+")").find("input").val();
			//交易规模-请求数据
			dealScale(curScaleTime,curInd+1);
        })
    }
    
    //第三块tab切换区域	产品分析
    function thirdTabChange(){
        var parentBox = $$(".thirdCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
	        //产品分析
	        var curProTime = $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").find("input").val();
			//产品分析-请求数据
			proAnalysizeData(curProTime,curInd+1);
        })
    }
    
    //第四块tab切换区域	渠道占比
    function fiveTabChange(){
    	var parentBox = $$(".fiveCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
        	var curInd = $$(this).index();
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            $$(".fiveCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
            //渠道占比
			var curChannelTime = $$(".fiveCont .tabBlockDetail>div:eq("+curInd+")").find("input").val();
			//请求ajax
	    	channelRateData(curChannelTime,curInd+1)
        })
    }
    
    //渲染总数据
    function askForDataBefore(obj){
    	
        //当日概览
        var curDayType = $$(".firstCont .active").index();
        var curDayTime = $$(".firstCont .tabBlockDetail>div:eq("+curDayType+")").find("input").val();
        //当日概览-请求数据
		curDayOverview(curDayTime,curDayType+1);
		
		//交易规模
		var curScaleType = $$(".secondCont .active").index();
        var curScaleTime = $$(".secondCont .tabBlockDetail>div:eq("+curScaleType+")").find("input").val();
		//交易规模-请求数据
		dealScale(curScaleTime,curScaleType+1);
		
		//产品分析
		var curProType = $$(".thirdCont .active").index();
        var curProTime = $$(".thirdCont .tabBlockDetail>div:eq("+curProType+")").find("input").val();
		//产品分析-请求数据
		proAnalysizeData(curProTime,curProType+1);
		
        //渠道占比
		var curChannelType = $$(".fiveCont .active").index();
		var curChannelTime = $$(".fiveCont .tabBlockDetail>div:eq("+curChannelType+")").find("input").val();
		//请求ajax
    	channelRateData(curChannelTime,curChannelType+1)
    	
    	//新增提示框	昨日更新	或	历史数据
    	yesterdayOrHistory(beforeToday);
    }

    /*数值部分渲染*/
    var myvue=new Vue();//借助第三方vue用来传值
    
    //渲染当日概览	日期变更	或者	维度变更时传参改变
    new Vue({
        el: '#trueLoan',
        data: {
            topDayData: {},
            big: '',
            small: ''
        },
        mounted:function(){
            var _this=this;
            myvue.$on('getTrueLoan', function(obj){
                _this.topDayData = obj;
            	if(_this.topDayData.pie_chart.pie_data.length!=0){
                	this.$nextTick(function(){
						_this.achieveChart(_this.topDayData.pie_chart,_this.topDayData.index_name);	//玫瑰图
                	})
                	//数字类型转千分符	不同产品类型金额
	                for(var key in _this.topDayData.prod_list){
	                    if(_this.topDayData.prod_list[key].index_val && typeof _this.topDayData.prod_list[key].index_val != 'string'){
							_this.topDayData.prod_list[key].index_val=outputmoney(_this.topDayData.prod_list[key].index_val.toString());
	                    }else if(_this.topDayData.prod_list[key].index_val==null){
	                        _this.topDayData.prod_list[key].index_val='-';
	                    }
	                }
	                //数字类型转千分符	实际放款金额千分符
                    if(_this.topDayData.total_val && typeof _this.topDayData.total_val != 'string'){
						_this.topDayData.total_val = outputmoney(_this.topDayData.total_val.toString());
                    }else if(_this.topDayData.total_val==null){
                        _this.topDayData.total_val='-';
                    }
	                _this.getNumDay();//实际放款金额	上月同比	昨日环比
            	}else{
            		$$("#yjgl").text("暂无图表信息");
            	}
            })
        },
        methods:{
        	getNumDay: function(){
                var itemValue = this.topDayData.total_val.toString();//获取金额格式化后的值
                if(itemValue.indexOf('.')!=-1){
                    this.big = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
                    this.small = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.big = itemValue;
                    this.small ="";
                }
            },
            achieveChart: function(pieData,chartName){
            	//业绩概览-丁格尔图
        		performanceOverview(pieData,chartName);
            }
        }
    });
    
    //渲染交易规模	日期变更	或者	维度变更时传参改变
    new Vue({
        el: '#riskManage',
        data: {
            riskData:''
        },
        mounted:function(){
            var _this=this;
            myvue.$on('getRiskData', function(obj,ind){
                _this.riskData = obj;//console.log(ind)
            	this.$nextTick(function(){
            		if(ind == 0){
						_this.riskLineChart(_this.riskData);//堆叠图
            		}
            		else if(ind == 1){
            			_this.addUser(_this.riskData);//柱状图
            		}
            	})
            })
        },
        methods:{
            riskLineChart: function(item){
            	//交易规模-保险总额
    			failedReason(item)
            },
            addUser: function(item){
            	//交易规模-新增用户
    			userCondition(item)
            }
        }
    });
    
    //渲染产品分析	日期变更	或者	维度变更时传参改变
    new Vue({
        el: '#proAnalysize',
        data: {
            riskData:''
        },
        mounted:function(){
            var _this=this;
            myvue.$on('getProData', function(obj,date){
                _this.riskData = obj;//console.log(ind)
            	this.$nextTick(function(){
					_this.riskLineChart(_this.riskData,date);//堆叠图
            	})
            })
        },
        methods:{
            riskLineChart: function(item,dateList){
            	//产品分析
    			proAnalysize(item,dateList)
            }
        }
    });
    
    //渠道占比
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
                if(obj.auto_insure_amt_list.length != 0){
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
            	//渠道占比
    			channelRate(item);
            }
        }
    });

	//新增提示框	昨日更新  或  历史数据  请求数据
    new Vue({
        "el":"#infoTips",
        data:{
            showTips:false,
            tipsData:'',
            yesTips:'',
            hisTips:''
        },
        mounted:function(){
            var _this=this;
            myvue.$on('tipsInfo', function(obj){
                //处理返回数据
                _this.tipsData = obj;
                if(_this.tipsData.is_update == '1' || _this.tipsData.is_history_update == '1'){
                	_this.showTips = true;
                	//弹框出现时页面禁止滚动
		    		$$(".mui-content").css({
		    			"width":"100%",
		    			"height":"100%"
		    		})
		    		$$(".mui-content")[0].style.overflow = 'hidden';
		    		document.body.style.overflow = 'hidden';
                	if(_this.tipsData.is_update == '1'){
                		_this.yesTips = '上传日期数据有更新';
                	}
                	if(_this.tipsData.is_history_update == '1'){
                		_this.hisTips = _this.tipsData.update_date_list;
                	}
                }
            });
        },
        methods:{
            closeTips: function(){
            	this.showTips = false;
            	//弹框关闭时页面恢复滚动
	    		$$(".mui-content").css({
	    			"width":"initial",
	    			"height":"initial"
	    		})
	    		$$(".mui-content")[0].style.overflow = 'scroll';
	    		document.body.style.overflow = 'scroll';
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
	function performanceOverview(obj,chName){
		
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
                backgroundColor: 'rgba(87,106,118,0.7)'
		    },
		    //color:['red','yellow','lightblue','lightgreen','purple'],如需改变颜色
		    legend: {
		    	show: false,
		        x : 'center',
		        y : 'bottom',
		        data: obj.pie_list
		    },
		    calculable : true,
		    series : [
		        {
		            name:chName,
		            type:'pie',
		            radius : [30, 78],//此处如果需要加标题	则图表的半径需要减小
		            center : ['50%', '50%'],
		            roseType : 'area',
		            data: obj.pie_data,
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
   
    //交易规模-新增用户
    function userCondition(obj){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('tzzl'));

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
                //以下为件均
                /*formatter:function(params){
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
                }*/
            },
            calculable : true,
            legend: {
                data:['新增注册用户数'],
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
                /*{
                    type: 'value',
                    name: '',
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
                },*/
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
            series : [/*
                {
                    name: 'DAU',
                    type: 'bar',
                    data: obj.dau_list,
                    itemStyle:{
                        normal:{
                            color:"#6FC3FF"
                        }
                    }
                },*/
                {
                    name:'新增注册用户数',
                    type:'bar',
                    data:obj.new_user_list,
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }
                }/*,
                {
                    name:'新增占比',
                    type:'line',
                    yAxisIndex: 1,
                    data:obj.new_rate_list,
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    }
                }*/
            ]
        };
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    
    //产品分析
    function proAnalysize(obj,date_list){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('cpfx'));

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
                data: obj.legend,
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
                    data : date_list,
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
                    name: '(%)',
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
                    name:obj.legend[0],
                    type:'bar',
                    data:obj.first_invest_list,
                    itemStyle:{
                        normal:{
                            color:"#6FC3FF"
                        }
                    }
               	},
                {
                    name:obj.legend[1],
                    type:'bar',
                    data:obj.second_invest_list,
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }
                },
                {
                    name: obj.legend[2],
                    type: 'line',
                    yAxisIndex: 1,
                    data: obj.invest_rate_list,
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

    //交易规模-保险总额
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
                data:['理财类','非车保障类','车险类','投保金额'],
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
                    name: '(元)',
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
                },
                {
                    type: 'value',
                    name: '(%)',
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
                    name: '投保金额',
                    type: 'line',
                    data: obj.premium_amt_list,
                    itemStyle:{
                        normal:{
                            color:"#fd5555"
                        }
                    }
                },
                {
                    name: '理财类',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: obj.financial_rate_list,
                    stack: "rate",
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }
                },
                {
                    name: '非车保障类',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: obj.non_car_rate_list,
                    stack: "rate",
                    itemStyle:{
                        normal:{
                            color:"#c0504e"
                        }
                    }
                },
                {
                    name: '车险类',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: obj.auto_insure_rate_list,
                    stack: "rate",
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }
                }
            ]
        };
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    
    //渠道占比
    function channelRate(obj){
    	
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('dyjj'));

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
                data:['理财类','非车保障类','车险类','金融超市保费占比'],
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
                    name: '(元)',
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
                },
                {
                    type: 'value',
                    name: '(%)',
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
                    name: '理财类',
                    type: 'bar',
                    data: obj.financial_amt_list,
                    stack: "rate",
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }
                },
                {
                    name: '非车保障类',
                    type: 'bar',
                    data: obj.non_car_amt_list,
                    stack: "rate",
                    itemStyle:{
                        normal:{
                            color:"#c0504e"
                        }
                    }
                },
                {
                    name: '车险类',
                    type: 'bar',
                    data: obj.auto_insure_amt_list,
                    stack: "rate",
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }
                },
                {
                    name: '金融超市保费占比',
                    type: 'line',
                    yAxisIndex: 1,
                    data: obj.jc_amt_rate_list,
                    itemStyle:{
                        normal:{
                            color:"#fd5555"
                        }
                    }
                }
            ]
        };
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
})(mui,jQuery,document,window.biMobile)
