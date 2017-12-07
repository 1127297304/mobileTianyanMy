;(function($,$$,doc,appGlobal){
    $.init({
        swipeBack: false//关闭右滑关闭功能
    })

    var obj;//初始请求的全局变量用以缓存数据
    var beforeToday;//当天前一天的完整日期格式
    var showTime ;//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
    var achBo= true;//跟随业绩概览模块的显示隐藏决定是否渲染图表		只在模块显示时渲染
    var riskBo = true;//跟随风控概览模块的显示隐藏决定是否渲染图表		只在模块显示时渲染
    var opeBo = true;//跟随运营概览模块的显示隐藏决定是否渲染图表		只在模块显示时渲染
    var mapBo = true;//跟随地域分析概览模块的显示隐藏决定是否渲染图表		只在模块显示时渲染

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
            newUrl:"/meiyifen/overview.gm",
            type:"get",
            data:{
                date:beforeToday
            },
            callback:function(data){
                $$('.mask').css('display','none');
                obj = data.data.datainfo;
                var curIndOne = $$(".sixCont .active").index();
                switch(curIndOne){
                    case 0:
                        $$("#userResult").html("金额");
                        machineCondition(obj.elt_active.prod_rate.date_list,obj.elt_active.prod_rate.elt_normal.loan_amt_list,obj.elt_active.prod_rate.elt_sale.loan_amt_list,obj.elt_active.prod_rate.elt_credit_card.loan_amt_list,obj.elt_active.prod_rate.elt_household.loan_amt_list,obj.elt_active.prod_rate.elt_trust.loan_amt_list,'(万元)');
                        break;
                    case 1:
                        serviceBag(obj.elt_active.server_pak.date_list,obj.elt_active.server_pak.flexible_num_list,obj.elt_active.server_pak.ensure_num_list,obj.elt_active.server_pak.double_num_list);
                        break;
                };
                //machineCondition(obj.elt_active.prod_rate.date_list,obj.elt_active.prod_rate.elt_normal.loan_amt_list,obj.elt_active.prod_rate.elt_sale.loan_amt_list,obj.elt_active.prod_rate.elt_credit_card.loan_amt_list,obj.elt_active.prod_rate.elt_household.loan_amt_list,obj.elt_active.prod_rate.elt_trust.loan_amt_list,'(万元)');
                //serviceBag(obj.elt_active.server_pak.date_list,obj.elt_active.server_pak.flexible_num_list,obj.elt_active.server_pak.ensure_num_list,obj.elt_active.server_pak.double_num_list);
                randerAllPage(obj);
            }
        })
    }
    //日期选择
    dateSelect();
    //指标说明弹框
    tipsExplain();
    //点击蓝色按钮	模块切换显示/隐藏
    toggleShow();
    //第三块	风控概览
    secondTabChange();
    //第五块	地域分析
    fiveTabChange();
    //电器活动的切换
    SixTabChange();
    //日期选择
    function dateSelect(){
        $$("#calendars").on("change",function(){
            var curDate =  $$(this).val();
            //判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
            //在此获取选择的日期重新发送请求
            if((new Date(curDate) >= new Date("2016-11-01")) && (new Date(curDate) <= new Date(beforeToday))){
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
    	//风控概览指标说明
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
    	//运营概览指标说明
    	$$("#operationOverviewQues").on("click",function(){
    		$$("#operationOverviewQuesBox").show();
    		//弹框出现时页面禁止滚动
    		$$(".mui-content").css({
    			"width":"100%",
    			"height":"100%"
    		})
    		$$(".mui-content")[0].style.overflow = 'hidden';
    		document.body.style.overflow = 'hidden';
    	})
    	$$("#operationOverviewClose").on("click",function(){
    		$$("#operationOverviewQuesBox").hide();
    		//弹框关闭时页面恢复滚动
    		$$(".mui-content").css({
    			"width":"initial",
    			"height":"initial"
    		})
    		$$(".mui-content")[0].style.overflow = 'scroll';
    		document.body.style.overflow = 'scroll';
    	})
        //电器活动指标说明
        $$("#householdPart").on("click",function(){
            $$("#machineBox").show();
            //弹框出现时页面禁止滚动
            $$(".mui-content").css({
                "width":"100%",
                "height":"100%"
            })
            $$(".mui-content")[0].style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        })
        $$("#machineClose").on("click",function(){
            $$("#machineBox").hide();
            //弹框关闭时页面恢复滚动
            $$(".mui-content").css({
                "width":"initial",
                "height":"initial"
            })
            $$(".mui-content")[0].style.overflow = 'scroll';
            document.body.style.overflow = 'scroll';
        })
    }
    
    //点击蓝色按钮	模块切换显示/隐藏
    function toggleShow(){
    	$$(".toggle").on("click",function(){
    		$$(this).parent().toggleClass("change");
    		$$(this).parent().next().toggle();
    		var curBlock = $$(this).parent().parent().index();//获取当前点击的是哪个模块
    		switch(curBlock)
			{
				case 1:
					//业绩概览
					achBo = !achBo;
					if(achBo){
						//console.log("业绩概览展开");
						myvue.$emit('getTrueLoan',obj);
					}else{
						//console.log("业绩概览关闭");
					}
					break;
				case 2:
					//风控概览
					riskBo = !riskBo;
					if(riskBo){
						var curCode = $$(".secondCont .active").attr("data-code");
						myvue.$emit('getRiskData',obj.risk_manage_overview[curCode]);//风控概览
					}
					break;
				case 3:
					//运营概览
					opeBo = !opeBo;
					if(opeBo){
						myvue.$emit('getOperation',obj);
					}
					break;
				case 4:
					//地域分析概览
					mapBo = !mapBo;
					if(mapBo){
						var areaCode = $$(".fiveCont .active").attr("data-code");
		        		var curShow = $$(".fiveCont .active").index();
		        		var exceptAll;
		        		if(curShow!=0){
		        			exceptAll = 'rest';
		        		}else{
		        			exceptAll = '';
		        		}
							myvue.$emit('changeData',obj.area_overview[areaCode],exceptAll);//地域分析
					}
					break;
			}
    	})
    };
    //电器活动的筛选   产品分布筛选
    productChange();
    function productChange(){
        var userPicker = new $.PopPicker();
        var data=[{
            value: 'loan_amt_list',
            text: '金额',
            dan:'（万元）'
        }, {
            value: 'loan_num_list',
            text: '件数',
            dan:'（件）'
        }
        ];
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById('showUserPicker');
        var userResult = doc.getElementById('userResult');
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;
                var dataText=items[0].dan;
                console.log(dataValue);
                var curIndOne = $$(".sixCont .active").index();
                switch(curIndOne){
                    case 0:
                        machineCondition(obj.elt_active.prod_rate.date_list,obj.elt_active.prod_rate.elt_normal[dataValue],obj.elt_active.prod_rate.elt_sale[dataValue],obj.elt_active.prod_rate.elt_credit_card[dataValue],obj.elt_active.prod_rate.elt_household[dataValue],obj.elt_active.prod_rate.elt_trust[dataValue],dataText);
                        //yhfxZY(globalObj.realTimeRiskUserAanlysis.realTimeRiskUserOwner);
                        break;
                    case 1:
                        serviceBag(obj.elt_active.server_pak.date_list,obj.elt_active.server_pak.flexible_num_list,obj.elt_active.server_pak.ensure_num_list,obj.elt_active.server_pak.double_num_list);
                        //yhfxQT(globalObj.realTimeRiskUserAanlysis.shanYinChannel[items[0].value]);
                        break;
                };
            });
        }, false);
    };
    //电器活动的切换
    function SixTabChange(){
        var parentBox = $$(".sixCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();
            var curCode = $$(this).attr("data-code");
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            if(curInd==0){
                $$(".fristTu").removeClass("off").addClass("show");
                $$(".secondTu").removeClass("show").addClass("off");
            }else if(curInd==1){
                $$(".secondTu").removeClass("off").addClass("show");
                $$(".fristTu").removeClass("show").addClass("off");
            };
            switch(curInd){
                case 0:
                    $$("#userResult").html("金额");
                    machineCondition(obj.elt_active.prod_rate.date_list,obj.elt_active.prod_rate.elt_normal.loan_amt_list,obj.elt_active.prod_rate.elt_sale.loan_amt_list,obj.elt_active.prod_rate.elt_credit_card.loan_amt_list,obj.elt_active.prod_rate.elt_household.loan_amt_list,obj.elt_active.prod_rate.elt_trust.loan_amt_list,"（万元）");
                    break;
                case 1:
                    serviceBag(obj.elt_active.server_pak.date_list,obj.elt_active.server_pak.flexible_num_list,obj.elt_active.server_pak.ensure_num_list,obj.elt_active.server_pak.double_num_list);
                    break;
            };

        });
    };
    //第三块tab切换区域	风控概览
    function secondTabChange(){
        var parentBox = $$(".secondCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();
            var curCode = $$(this).attr("data-code");
        	
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            if(obj.risk_manage_overview){
            	myvue.$emit('getRiskData',obj.risk_manage_overview[curCode]);
            }
            
        })
    }
    
    //第五块tab切换区域
    function fiveTabChange(){
    	var parentBox = $$(".fiveCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
        	var curInd = $$(this).index();
        	var areaCode = $$(this).attr("data-code");
        	var exceptAll;
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            if(curInd != 0){
            	exceptAll = 'rest';
            }else{
            	exceptAll = '';
            }
            //地域分析
            if(obj.area_overview[areaCode]){
	       		myvue.$emit('changeData',obj.area_overview[areaCode],exceptAll);//地域分析
	        }
        })
    }
    
    //渲染总数据
    function randerAllPage(obj){
    	
        //渲染顶部kpi跟踪	topDay
        randerTopDay(obj);
        //进度条渲染
        progressCondition(obj.kpi_track);
        //风控概览
    	if(riskBo){
			var curCode = $$(".secondCont .active").attr("data-code");
			myvue.$emit('getRiskData',obj.risk_manage_overview[curCode]);//风控概览
		}
        //地域分析
    	if(mapBo){
    		var areaCode = $$(".fiveCont .active").attr("data-code");
    		var curShow = $$(".fiveCont .active").index();
    		var exceptAll;
    		if(curShow!=0){
    			exceptAll = 'rest';
    		}else{
    			exceptAll = '';
    		}
    		myvue.$emit('changeData',obj.area_overview[areaCode],exceptAll);//地域分析
    	}
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
    //渲染顶部区域日概览
    function randerTopDay(obj){
        //请求成功后传递数据
        myvue.$emit('getdataDay',obj);//kpi跟踪
        //业绩概览
    	if(achBo){
			myvue.$emit('getTrueLoan',obj);
		}
        //运营概览
    	if(opeBo){
			myvue.$emit('getOperation',obj);
		}
    }
    //渲染顶部区域日概览	日期变更	或者	维度变更时传参改变
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
                _this.topDayData=obj.kpi_track;
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
                var comBigValue=this.topDayData.month_real_amount.toString();
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
            big: '',
            small: '',
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
                
                //数字类型转千分符	实际放款金额千分符
                for(var key in _this.topDayData){
                    if(typeof _this.topDayData[key]=='number'&&_this.topDayData[key]!=null){
                        _this.topDayData[key]=outputmoney(_this.topDayData[key].toString());
                    }else if(_this.topDayData[key]==null){
                        _this.topDayData[key]='-';
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
                _this.getNumDay();//实际放款金额	上月同比	昨日环比
            })
        },
        methods:{
            getNumDay: function(){
                var itemValue = this.topDayData.current_loan_amount.toString();//获取金额格式化后的值

                if(itemValue.indexOf('.')!=-1){
                    this.big = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
                    this.small = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.big = itemValue;
                    this.small ="";
                }
            },
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
            riskData:'',
            initRate:''
        },
        mounted:function(){
            var _this=this;
            myvue.$on('getRiskData', function(obj){
                _this.riskData = obj;
                if(obj.product_info.length != 0){
                	_this.initRate = obj.product_info[0].chart_code;//默认显示率
                	this.$nextTick(function(){
						_this.riskBarChart(_this.riskData.approval_chart[_this.initRate],_this.riskData.product_name,obj.product_info[0].rate_name);	//风控概览-柱状图
						_this.riskLineChart(_this.riskData.fail_chart,_this.riskData.product_name);//折线图
                	})
                }
            })
        },
        methods:{
            riskBarChart: function(barData,proName,rateName){
            	//风控概览-柱状图
        		intExchange(barData,proName,rateName);
            },
            riskLineChart: function(item,name){
            	//风控概览-折线图
    			failedReason(item,name)
            },
            changeBarChart: function(code,proName,rateName){
            //点击率时更改趋势图表
            this.riskBarChart(this.riskData.approval_chart[code],proName,rateName);
            }
        }
    });
    
    //渲染运营概览	日期变更	或者	维度变更时传参改变
    new Vue({
        el: '#operationOverview',
        data: {
            operationData:'',
            initPro:''
        },
        mounted:function(){
            var _this=this;
            myvue.$on('getOperation', function(obj){
                _this.operationData = obj.operation_overview;
                _this.initPro = _this.operationData.prod_data[0].code;//默认显示产品
				this.$nextTick(function(){
					_this.operationBarChart(_this.operationData.chart_data[_this.initPro],_this.operationData.prod_data[0].name);	//运营概览-柱状图
				})
            })
        },
        methods:{
            operationBarChart: function(barData,proName){
            	//运营概览-柱状图
    			newUser(barData,proName);
            },
            changeBarChart: function(code,proName){
	            //点击率时更改运营图表
	            this.operationBarChart(this.operationData.chart_data[code],proName);
            }
        }
    });

    //地图  地域分布
    new Vue({
        "el":"#cityDetails",
        data:{
            areaData:{},
            initCheck:'',
            cityList:'',
            initArea:'',
            initProList:'',//区、市列表
            exceptRest:'',//地图区域点击除了 3C电器分期的其他选项卡时 省份显示最多五个	+更多按钮	数据需要截取除了	此字段为除五个以外其他的省份
            showOtherCities: false//点击除3C电器分期以外的其他产品时  显示更多城市的弹框
        },
        mounted:function(){
            var _this=this;
            myvue.$on('changeData', function(obj,clickWhich){
                //处理返回数据
                _this.areaData = obj;
                if(obj.area_list.length != 0){
                	_this.initCheck = _this.areaData.area_list[0].name;//默认选中的大区名称
                	_this.initArea = _this.areaData.area_list[0].code;//默认选中的大区编码
                	_this.cityList = _this.areaData.area_detail_list[_this.initArea];//默认显示的大区城市详情
                	_this.initProList = _this.areaData.area_list;
                	if(clickWhich){
                		var before = obj.area_list.slice(0,5);
                		var after = obj.area_list.slice(5);
                		_this.initProList = before;
                		_this.exceptRest = after;
                	}else{
                		_this.exceptRest = '';
                	}
                	if(obj.map_list.length !=0){
	                	this.$nextTick(function(){
	 						_this.areaChart(_this.areaData.map_list,_this.areaData.map_max);
	                	})
	                }else{
	                	$$("#dyjj").text("暂无图表信息");
	                }
                }else if(obj.area_list.length == 0){
                	_this.exceptRest = '';
                }
            });
        },
        methods:{
            //点击切换
            changeCityData:function(item){
            	var _this = this;
            	//this.showOtherCities = false;//每选择一个城市 则关闭弹框		此步骤可跟产品协商
            	_this.initCheck = item.name;
            	_this.cityList = {};
            	$$(".pullMore").removeClass("change");//每切换大区时，按钮状态初始化
            	var timer = setTimeout(function(){
            		_this.cityList = _this.areaData.area_detail_list[item.code];//默认切换大区城市详情
            	})
            },
            areaChart: function(item,maxNum){
            	//地域分布
    			dyJjCondition(item,maxNum)
            },
            showRest:function(){
            	$$(".pullMore").toggleClass("change");
        		$$(".showRest").nextAll().toggle();
            },
            showMore:function(){
            	this.showOtherCities = true;
            },
            closeMore:function(){
            	this.showOtherCities = false;
            }
        }
    });

    //电器活动  图一  产品分布
    function machineCondition(a,b,c,d,e,f,g){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('productCover'));

        var option = {
            /*title: {
                text: name+'失败原因',
                textStyle:{
                    fontSize: 12
                },
                top:0,
                right:0
            },*/
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            calculable : true,
            legend: {
                data:['常规产品','促销产品','信用卡产品','家电套购','托管试点'],
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
                    data : a,
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
                    name: g,
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
                    name: '常规产品',
                    type: 'line',
                    data: b,
                    itemStyle:{
                        normal:{
                            color:"#2baf2b"
                        }
                    }
                },
                {
                    name: '促销产品',
                    type: 'line',
                    data: c,
                    itemStyle:{
                        normal:{
                            color:"#e84e40"
                        }
                    }
                },
                {
                    name:'信用卡产品',
                    type:'line',
                    data:d,
                    itemStyle:{
                        normal:{
                            color:"#ffa726"
                        }
                    }
                },
                {
                    name:'家电套购',
                    type:'line',
                    data:e,
                    itemStyle:{
                        normal:{
                            color:"#5c6bc0"
                        }
                    }
                },
                {
                    name:'托管试点',
                    type:'line',
                    data:f,
                    itemStyle:{
                        normal:{
                            color:"#ff99ff"
                        }
                    }
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };
    //电器活动  图二   服务包购买
    function serviceBag(a,b,c,d) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('serviceBuy'));

        var option = {
            tooltip: {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
                /*formatter: function (params) {
                    var str = params[0].name + '</br>';
                    var itemIndex = params[0].dataIndex;
                    var col1 = option.series[0].itemStyle.normal.color;
                    var col2 = option.series[1].itemStyle.normal.color;
                    var col3 = option.series[2].itemStyle.normal.color;
                    str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + col1 + '"></span>未注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ：' + params[0].value + '&nbsp;&nbsp;&nbsp;&nbsp;' + obj[0][4][itemIndex].wzcbfb + '%</br>';

                    str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + col2 + '"></span>已注未用 ：' + params[1].value + '&nbsp;&nbsp;&nbsp;&nbsp;' + obj[0][4][itemIndex].yzcbfb + '%</br>';

                    str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + col3 + '"></span>已用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ：' + params[2].value + '&nbsp;&nbsp;&nbsp;&nbsp;' + obj[0][4][itemIndex].ysybfb + '%</br>';

                    str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:green"></span>总计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp ：' + obj[0][4][itemIndex].zjzs + '&nbsp;&nbsp;&nbsp;&nbsp;' + obj[0][4][itemIndex].zjbfb + '%</br>';

                    return str;
                }*/
            },
            calculable: true,
            legend: {
                data: ['仅购买灵活包件数', '仅购买保障包件数', '同时购买双包件数'],
                itemGap: 10,
                itemWidth: 15,
                itemHeight: 10,
                /*selectedMode:false,*/
                textStyle: {
                    fontSize: 10,
                    color: '#929292'
                },
                bottom: '0%'
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
                    type: 'category',
                    data: a,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    /*name: obj[1][0],*/
                    axisLabel: {
                       /* formatter: obj[1][1],*/
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dotted"
                        }
                    }
                }
            ],
            dataZoom: [
                {
                    show: false,//水平滚动条显示或隐藏
                    start: 0,//窗口中数据显示的起始位置
                    end: 100,//窗口中数据显示的结束位置
                    height: 14,//水平滚动条的高度
                    bottom: "3%"
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
                    name: '仅购买灵活包件数',
                    type: 'bar',
                    data: b,
                    stack: '服务包购买',
                    itemStyle: {
                        normal: {
                            color: "#6d90fa"
                        }
                    }

                },
                {
                    name: '仅购买保障包件数',
                    type: 'bar',
                    data: c,
                    stack: '服务包购买',
                    itemStyle: {
                        normal: {
                            color: "#2fcacc"
                        }
                    }

                },
                {
                    name: '同时购买双包件数',
                    type: 'bar',
                    data: d,
                    stack: '服务包购买',
                    itemStyle: {
                        normal: {
                            color: "#ffcca0"
                        }
                    }
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
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
                backgroundColor: 'rgba(87,106,118,0.7)'
		    },
		    //color:['red','yellow','lightblue','lightgreen','purple'],如需改变颜色
		    legend: {
		    	show: false,
		        x : 'center',
		        y : 'bottom',
		        data: obj.prod_list
		    },
		    calculable : true,
		    series : [
		        {
		            name:'放款金额',
		            type:'pie',
		            radius : [30, 78],//此处如果需要加标题	则图表的半径需要减小
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

    //运营概览
    function newUser(obj,name){
		
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('xzyh'));

        var option = {
        	title: {
		        text: name,
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
                data:['进件件数'],
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
            xAxis: [
                {
                    type : 'category',
                    data : obj.date_list,
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '',
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
                    name: '进件件数',
                    type: 'bar',
                    data: obj.into_list,
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

    //风控概览-柱状图
    function intExchange(obj,proName,rateName){
    	var nameStr = proName+"-"+rateName;
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('zhzl'));

        var option = {
        	title: {
		        text: nameStr+'趋势',
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
                data:obj.legend_list,
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
                bottom:'13%',
                left: '3%',
                right: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type : 'category',
                    data : obj.date_list,
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '(件数)',
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
                    name: '',
                    /*min: 0,
                     max: 40,
                     interval: 10,控制最大值、最小值及幅度*/
                    axisLabel: {
                        formatter: '{value}%'
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
                    name: obj.legend_list[0],
                    type: 'bar',
                    data: obj.into_list,
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }
                },
                {
                    name: obj.legend_list[1],
                    type: 'bar',
                    data: obj.pass_list,
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }
                },
                {
                    name:obj.legend_list[2],
                    type:'line',
                    yAxisIndex: 1,
                    data:obj.approval_prop_list,
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
    function failedReason(obj,name){
    	
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('sbyy'));

        var option = {
        	title: {
		        text: name+'失败原因',
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
                data:['系统拒绝','人工信审','销售代表','其他'],
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
                    name: '(人数)',
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
                    name: '系统拒绝',
                    type: 'line',
                    data: obj.sys_refuse_list,
                    itemStyle:{
                        normal:{
                            color:"#2baf2b"
                        }
                    }
                },
                {
                    name: '人工信审',
                    type: 'line',
                    data: obj.artificial_credit,
                    itemStyle:{
                        normal:{
                            color:"#e84e40"
                        }
                    }
                },
                {
                    name:'销售代表',
                    type:'line',
                    data:obj.sale_represent,
                    itemStyle:{
                        normal:{
                            color:"#ffa726"
                        }
                    }
                },
                {
                    name:'其他',
                    type:'line',
                    data:obj.other,
                    itemStyle:{
                        normal:{
                            color:"#5c6bc0"
                        }
                    }
                }
            ]
        };
        
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //地域分布
    function dyJjCondition(obj,maxNum){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('dyjj'));

        var option = {
            title: {
                text: '放款',
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
                color: ['#477bfc','#6e9cfc','#6fc1ff'],
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
                    data: obj
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
})(mui,jQuery,document,window.biMobile)
