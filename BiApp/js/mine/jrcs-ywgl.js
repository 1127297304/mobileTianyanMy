;(function($,$$,doc,appGlobal){
    $.init({
        swipeBack: false//关闭右滑关闭功能
    })

    var obj;//初始请求的全局变量用以缓存数据
    var dateList;//用于存储时间轴数据	即	横轴
    var stzbObj;//首投占比对象	可删除
    var moneyMax;//地域分布-投资金额最大值
    var peopleMax;//地域分布-投资人数最大值
    var beforeToday;//当天前一天的完整日期格式
    var hdxgObj;//服务包购买下拉列表数组
    var showTime ;//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
    var initValue = "firstInvestAmount";

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
            newUrl:"/jinrongchaoshi/getJinRongChaoShiDashboardModel.gm",
            type:"get",
            data:{
                edate:beforeToday
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
    //第一块tab切换区域
    firstTabChange();
    //第二块
    secondTabChange();
    //第三块
    tabChangeThird();
    //指标说明弹框
	tipsExplain();
	
    //日期选择
    function dateSelect(){
        $$("#calendars").on("change",function(){
            var curDate =  $$(this).val();
            //判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
            //在此获取选择的日期重新发送请求
            if((new Date(curDate) >= new Date("2017-01-01")) && (new Date(curDate) <= new Date(beforeToday))){
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
        })
    }
    //第二块tab切换区域
    function secondTabChange(){
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
                case 'ctzt':
                    //超推自投
                    userCondition(obj);
                    break;
                case 'zdcs':
                    //驻点城市
                    realCondition(obj);
                    break;
                case 'ctst':
                    //超推首投
                    var curValue = $$("#userResult").attr("data-value");
firstCondition(obj.chaoTuiFirstInvestRate[curValue],obj.dateList,hdxgObj[curValue]);
                    break;
                case 'txzb':
                    //提现占比
                    addCondition(obj);
                    break;
            }

        })
    }
    //第三块选项卡切换
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
                case 'tzje':
                    //投资金额
                    dyJjCondition(obj.investAmountMap,obj.investAmountMap.maxValue);
                    break;
                case 'tzrs':
                    //投资人数
                    dyFkCondition(obj.investQuantityMap,obj.investQuantityMap.maxValue);
                    break;
                case 'zcrs':
                    //新增注册人数
                    increaPeopleCondition(obj.newRegisterQuantityMap,obj.newRegisterQuantityMap.maxValue);
                    break;
            }

        })
    }
    
    	//指标说明弹框
	    function tipsExplain(){
	    	//用户分析指标说明
	    	$$("#financialSuperQues").on("click",function(){
	    		$$("#financialSuperQuesBox").show();
	    		//弹框出现时页面禁止滚动
	    		$$(".mui-content").css({
	    			"width":"100%",
	    			"height":"100%"
	    		})
	    		$$(".mui-content")[0].style.overflow = 'hidden';
	    		document.body.style.overflow = 'hidden';
	    	})
	    	$$("#financialSuperClose").on("click",function(){
	    		$$("#financialSuperQuesBox").hide();
	    		//弹框关闭时页面恢复滚动
	    		$$(".mui-content").css({
	    			"width":"initial",
	    			"height":"initial"
	    		})
	    		$$(".mui-content")[0].style.overflow = 'scroll';
	    		document.body.style.overflow = 'scroll';
	    	})
	    	
	    }
    
    //超推首投：指标类型选择列表
    function stzbSelect(){

        var userPicker = new $.PopPicker();
        var data=[{
            value: 'firstInvestAmount',
            text: '首投金额'
        }, {
            value: 'firstInvestQuantity',
            text: '首投人数'
        }, {
            value: 'firstInvestCount',
            text: '首投次数'
        }];
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
                firstCondition(obj.chaoTuiFirstInvestRate[items[0].value],obj.dateList,hdxgObj[items[0].value]);
            });
        }, false);
    }
    stzbSelect();

    //渲染总数据
    function randerAllPage(obj){
        //渲染顶部选项卡的日概览	topDay
        randerTopDay(obj);
        hdxgObj={
            "firstInvestAmount": "(万元)",
            "firstInvestQuantity": "(人数)",
            "firstInvestCount": "(次数)"
        };
        //第二块
        var curIndSecond = $$(".secondCont .active").index();
        var echartIdSecond = $$(".secondCont .tabBlockDetail>div").eq(curIndSecond).find(".echartDetail").attr("id");
        switch(echartIdSecond)
        {
            case 'ctzt':
                //超推自投
                userCondition(obj);
                break;
            case 'zdcs':
                //驻点城市
                realCondition(obj);
                break;
            case 'ctst':
                //超推首投
                var curValue = $$("#userResult").attr("data-value");
                firstCondition(obj.chaoTuiFirstInvestRate[curValue],obj.dateList,hdxgObj[curValue]);
                break;
            case 'txzb':
                //提现占比
                addCondition(obj);
                break;
        }

        //第三块
        var curIndThird = $$(".thirdCont .active").index();
        var echartIdThird = $$(".thirdCont .tabBlockDetail>div").eq(curIndThird).find(".echartDetail").attr("id");
        switch(echartIdThird)
        {
            case 'tzje':
                //投资金额
                dyJjCondition(obj.investAmountMap,obj.investAmountMap.maxValue);
                break;
            case 'tzrs':
                //投资人数
                dyFkCondition(obj.investQuantityMap,obj.investQuantityMap.maxValue);
                break;
            case 'zcrs':
                //新增注册人数
                increaPeopleCondition(obj.newRegisterQuantityMap,obj.newRegisterQuantityMap.maxValue);
                break;
        }
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
            bigM:'',
            smallM:'',
            topDayData: {},
            investAmount:{},//日投资金额
            investAmountM:{},//月
            investQuantity:{},//日投资人数
            investQuantityM:{},//月
            investCount:{},//日投资笔数
            investCountM:{},//月
            newRegisterQuantity:{},//日新增注册客户数
            newRegisterQuantityM:{},//月
        },
        mounted: function(){
            var _this=this;
            myvue.$on('getdataDay', function(obj){
                _this.topDayData=obj;
                _this.investAmount=_this.topDayData.curdayIndex.investAmount;
                _this.investQuantity=_this.topDayData.curdayIndex.investQuantity;
                _this.investCount=_this.topDayData.curdayIndex.investCount;
                _this.newRegisterQuantity=_this.topDayData.curdayIndex.newRegisterQuantity;

                _this.investAmountM=_this.topDayData.monthIndex.investAmount;
                _this.investQuantityM=_this.topDayData.monthIndex.investQuantity;
                _this.investCountM=_this.topDayData.monthIndex.investCount;
                _this.newRegisterQuantityM=_this.topDayData.monthIndex.newRegisterQuantity;
                //数字类型转千分符
                for(var key in _this.topDayData){
                    if(typeof _this.topDayData[key]=='number'&&_this.topDayData[key]!=null){
                        _this.topDayData[key]=outputmoney(_this.topDayData[key].toString());
                    }else if(_this.topDayData[key]==null){
                        _this.topDayData[key]=='-';
                    }else if(key=='curdayIndex'||key=='monthIndex'){
                        for(var i in _this.topDayData[key]){
                            for(var j in _this.topDayData[key][i]){
                                _this.topDayData[key][i][j]=outputmoney(_this.topDayData[key][i][j].toString());
                            }
                        }
                    }
                }
                _this.getNumDay();
            })
        },
        methods:{
            getNumDay: function(){
                var itemValue = this.topDayData.dailyAmount.toString();//获取金额格式化后的值
                var itemValueM = this.topDayData.monthIndex.investAmount.investAmount.toString();//获取金额格式化后的值

                if(itemValue.indexOf('.')!=-1){
                    this.big = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
                    this.small = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.big = itemValue;
                    this.small ="";
                }

                if(itemValueM.indexOf('.')!=-1){
                    this.bigM = itemValueM.slice(0,itemValueM.indexOf('.'));//截取小数点以前的金额
                    this.smallM = itemValueM.slice(itemValueM.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.bigM = itemValueM;
                    this.smallM ="";
                }
                /*this.big = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
                this.small = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                this.bigM = itemValueM.slice(0,itemValueM.indexOf('.'));//截取小数点以前的金额
                this.smallM = itemValueM.slice(itemValueM.indexOf('.'));//截取小数点以后的金额*/
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
    //超推自投
    function userCondition(obj){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('ctzt'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            calculable : true,
            legend: {
                data:['超推业绩','自投业绩','超推占比'],
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
                    data : obj.dateList,
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
                    name: '(万元)',
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
                    name: '超推业绩',
                    type: 'bar',
                    data: obj.chaoTuiZiTouRate.chaoTuiAmountList,
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }
                },
                {
                    name: '自投业绩',
                    type: 'bar',
                    data: obj.chaoTuiZiTouRate.ziTouAmountList,
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }
                },
                {
                    name:'超推占比',
                    type:'line',
                    yAxisIndex: 1,
                    data:obj.chaoTuiZiTouRate.chaoTuiAmountRateList,
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
    //驻点城市
    function realCondition(obj){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('zdcs'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:['北京','上海','西安','占比'],
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
                    data : obj.dateList,
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
                    name: '(万元)',
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
                    name: '北京',
                    type: 'bar',
                    data: obj.cityYeJi.beiJingYeJiList,
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }
                },
                {
                    name: '上海',
                    type: 'bar',
                    data: obj.cityYeJi.shangHaiYeJiList,
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }
                },
                {
                    name: '西安',
                    type: 'bar',
                    data: obj.cityYeJi.xiAnYeJiList,
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    }
                },
                /*{
                 name: '提取金额',
                 type: 'bar',
                 data: obj.withDrawAmountList,
                 itemStyle:{
                 normal:{
                 color:"#26a69a"
                 }
                 }
                 },*/
                {
                    name:'占比',
                    type:'line',
                    yAxisIndex: 1,
                    data:obj.cityYeJi.rateList,
                    itemStyle:{
                        normal:{
                            color:"#df6097"
                        }
                    }
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }
    //超推首投
    function firstCondition(obj,dateList,yName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('ctst'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:['首投','复投','首投占比'],
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
                    data : dateList,
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
                    name: yName,
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
                    name: '首投',
                    type: 'bar',
                    data: obj.firstInvestList,
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }

                },
                {
                    name: '复投',
                    type: 'bar',
                    data: obj.secondInvestList,
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }

                },
                {
                    name:'首投占比',
                    type:'line',
                    yAxisIndex: 1,
                    data:obj.firstInvestRateList,
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
    //提现占比
    function addCondition(obj){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('txzb'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:['到期金额','提现金额','提现占比'],
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
                    data : obj.dateList,
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
                    name: '(万元)',
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
                    name: '到期金额',
                    type: 'bar',
                    data: obj.withdrawRate.dueAmountList,
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }
                },
                {
                    name: '提现金额',
                    type: 'bar',
                    data: obj.withdrawRate.withdrawAmountList,
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }
                },
                {
                    name:'提现占比',
                    type:'line',
                    yAxisIndex: 1,
                    data:obj.withdrawRate.withdrawRateList,
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
    //投资金额
    function dyJjCondition(obj,maxNum){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('tzje'));

        var option = {
            title: {
                text: '金额',
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
                    data: obj.areaMap
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }
    //投资人数
    function dyFkCondition(obj,maxNum){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('tzrs'));

        var option = {
            title: {
                text: '人数',
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
                    data: obj.areaMap
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }

    //新增注册人数
    function increaPeopleCondition(obj,maxNum){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('zcrs'));

        var option = {
            title: {
                text: '人数',
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
                    data: obj.areaMap
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }


})(mui,jQuery,document,window.biMobile)
