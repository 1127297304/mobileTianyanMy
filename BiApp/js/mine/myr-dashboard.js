/**
 * Created by Administrator on 2017/5/2.
 */
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
    var hdxgObj;//信云贷大客户对象
    var charts = [];
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
            newUrl:"/meiyirong/getMeiYiRongDashboardWebInfo.gm",
            type:"get",
            data:{
                edate:beforeToday
            },
            callback:function(data){
                globalObj = data.data.datainfo;
                var curIndOne = $$(".secondCont .active").index();
                $$(".secondCont .tabBlockDetail>div").eq(curIndOne).addClass("show").siblings().removeClass();
                switch(curIndOne){
                    case 0:
                        randerTopDay(globalObj.loanWebModel.loanTypeDatas.每日新增.loanMap.总计);
                        $$("#userResultItem1").text("总计");
                        break;
                    case 1:

                        randerTopDay(globalObj.loanWebModel.loanTypeDatas.每月贷款.loanMap.总计);
                        $$("#userResultItem2").text("总计");
                        break;
                    case 2:

                        randerTopDay(globalObj.loanWebModel.loanTypeDatas.历史累计.loanMap.总计);
                        $$("#userResultItem3").text("总计");
                        break;
                }
                function toThousands(num) {
                    /*var num = (num || 0).toString(), result = '';
                     var str;*/
                    // console.log(num);
                    //num=Number(num).toFixed(2);
                    num=parseFloat(Number(num).toFixed(2)).toString();
                    //console.log(num);
                    var reg=num.indexOf('.') >-1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;//千分符的正则
                    num=num.replace(reg, '$1,');
                    return num;
                }
                var obj1= globalObj.rwgzsWebModel.monthTask;
                var obj2= globalObj.rwgzsWebModel.weekTask;
                var obj3= globalObj.loanWebModel.loanTypeDatas.每日新增.loanMap.信云贷;
                var obj4= globalObj.loanWebModel.loanTypeDatas.每日新增.loanMap.总计;
                var obj5= globalObj.loanWebModel.loanTypeDatas.每日新增.loanMap.账云贷;
                var obj6= globalObj.loanWebModel.loanTypeDatas.每日新增.loanMap.货云贷;
                var obj7= globalObj.loanWebModel.loanTypeDatas.每月贷款.loanMap.信云贷;
                var obj8= globalObj.loanWebModel.loanTypeDatas.每月贷款.loanMap.总计;
                var obj9= globalObj.loanWebModel.loanTypeDatas.每月贷款.loanMap.账云贷;
                var obj10= globalObj.loanWebModel.loanTypeDatas.每月贷款.loanMap.货云贷;
                var obj11= globalObj.loanWebModel.loanTypeDatas.历史累计.loanMap.信云贷;
                var obj12= globalObj.loanWebModel.loanTypeDatas.历史累计.loanMap.总计;
                var obj13= globalObj.loanWebModel.loanTypeDatas.历史累计.loanMap.账云贷;
                var obj14= globalObj.loanWebModel.loanTypeDatas.历史累计.loanMap.货云贷;

                for(var s in obj1){
                    if(typeof obj1[s]=="number"){
                        obj1[s]=toThousands(obj1[s]);
                    }else if(obj1[s]=="null"){
                        obj1[s]="-";
                    }
                }
                for(var s in obj2){
                    if(typeof obj2[s] == 'number') {
                        obj2[s] = toThousands(obj2[s]);

                    }else if(obj2[s]=="null"){
                        obj2[s]="-";
                    }
                }
                for(var s in obj3){
                    if(typeof obj3[s] == 'number') {
                        obj3[s] = toThousands(obj3[s]);

                    }else if(obj3[s]=="null"){
                        obj3[s]="-";
                    }
                }
                for(var s in obj4){
                    if(typeof obj4[s] == 'number') {
                        obj4[s] = toThousands(obj4[s]);

                    }else if(obj4[s]=="null"){
                        obj4[s]="-";
                    }
                }
                for(var s in obj5){
                    if(typeof obj5[s] == 'number') {
                        obj5[s] = toThousands(obj5[s]);

                    }else if(obj5[s]=="null"){
                        obj5[s]="-";
                    }
                }
                for(var s in obj6){
                    if(typeof obj6[s] == 'number') {
                        obj6[s] = toThousands(obj6[s]);

                    }else if(obj6[s]=="null"){
                        obj6[s]="-";
                    }
                }
                for(var s in obj7){
                    if(typeof obj7[s] == 'number') {
                        obj7[s] = toThousands(obj7[s]);

                    }else if(obj7[s]=="null"){
                        obj7[s]="-";
                    }
                }
                for(var s in obj8){
                    if(typeof obj8[s] == 'number') {
                        obj8[s] = toThousands(obj8[s]);

                    }else if(obj8[s]=="null"){
                        obj8[s]="-";
                    }
                }
                for(var s in obj9){
                    if(typeof obj9[s] == 'number') {
                        obj9[s] = toThousands(obj9[s]);

                    }else if(obj9[s]=="null"){
                        obj9[s]="-";
                    }
                }
                for(var s in obj10){
                    if(typeof obj10[s] == 'number') {
                        obj10[s] = toThousands(obj10[s]);

                    }else if(obj10[s]=="null"){
                        obj10[s]="-";
                    }
                }
                for(var s in obj11){
                    if(typeof obj11[s] == 'number') {
                        obj11[s] = toThousands(obj11[s]);

                    }else if(obj11[s]=="null"){
                        obj11[s]="-";
                    }
                }
                for(var s in obj12){
                    if(typeof obj12[s] == 'number') {
                        obj12[s] = toThousands(obj12[s]);

                    }else if(obj12[s]=="null"){
                        obj12[s]="-";
                    }
                }
                for(var s in obj14){
                    if(typeof obj14[s] == 'number') {
                        obj14[s] = toThousands(obj14[s]);

                    }else if(obj14[s]=="null"){
                        obj14[s]="-";
                    }
                }
                for(var s in obj13){
                    if(typeof obj13[s] == 'number') {
                        obj13[s] = toThousands(obj13[s]);
                    }else if(obj13[s]=="null"){
                        obj13[s]="-";
                    }
                }
                /*var obj1= globalObj.rwgzsWebModel.monthTask;
                var obj2= globalObj.rwgzsWebModel.weekTask;
                for(var s in obj1){
                    console.log(obj1[s]);
                    obj1[s]=outputmoney(obj1[s]);
                }
*/
                /*此处是顶部初始*/
                var curIndOne1 = $$(".firstCont .active").index();
                $$(".firstCont .tabBlockDetail>div").eq(curIndOne1).addClass("show").siblings().removeClass();

                switch(curIndOne1){
                    case 0:
                        progressCondition(globalObj.rwgzsWebModel.monthTask);
                        randerTopMouth(globalObj.rwgzsWebModel.monthTask);
                        $$(".YZ").html(globalObj.rwgzsWebModel.monthTask.rq);
                        break;
                    case 1:
                        progressCondition(globalObj.rwgzsWebModel.weekTask);
                        randerTopMouth(globalObj.rwgzsWebModel.weekTask);
                        $$(".YZ").html(globalObj.rwgzsWebModel.weekTask.rq);
                        break;
                }
                $$("#userResultItem4").text("数量")
                //信云贷大客户对象
                hdxgObj={
                    "sl":[
                        [globalObj.bigCustomerWebInfo.customerData.sl["未注册"],globalObj.bigCustomerWebInfo.customerData.sl["已注册未使用"],globalObj.bigCustomerWebInfo.dateList,globalObj.bigCustomerWebInfo.customerData.sl["已使用"],globalObj.bigCustomerWebInfo.customerData.sl.others],
                        ['(人数)','{value}']
                    ],
                    "sxje":[
                        [globalObj.bigCustomerWebInfo.customerData.sxje["未注册"],globalObj.bigCustomerWebInfo.customerData.sxje["已注册未使用"],globalObj.bigCustomerWebInfo.dateList,globalObj.bigCustomerWebInfo.customerData.sxje["已使用"],globalObj.bigCustomerWebInfo.customerData.sxje.others],
                        ['(万元)','{value}']
                    ]
                };

                //信云贷大客户
                firstCondition(hdxgObj.sl);

                var xName = {
                    "sl":"(人数)",
                    "fkje":"(万元)"
                };

                dshzPercent(globalObj.customerConversionWebModel.ccData["客户转化-每日"].sl,globalObj.customerConversionWebModel.thirtyDateList,xName.sl);
                failedReason(globalObj.customerConversionWebModel.ccData["客户转化-月累"].sl,globalObj.customerConversionWebModel.monthDateList,xName.sl);


                //遮罩消失
                $$('.mask').css('display','none');

            }
        })
    }
    //进度条插件
    function progressCondition(obj){

        //入口
        appGlobal.util.init();

        new appGlobal.progress('progress2',{
            totalData:appGlobal.util.stringToNumber(100),	//项目计划总完成量
            planData:appGlobal.util.stringToNumber(obj.timeSchedule),	//时间进度
            actualData:appGlobal.util.stringToNumber(obj.completionRate)		//月实际完成率
        });

    }

    //点击遮罩层	遮罩层消失并且二级菜单隐藏
    $$("#mark").on("tap",function(){
        $$(this).removeClass("active");
        $$("#subList").removeClass("active");
    })

    //日期选择
    dateSelect();
    //first选项卡切换
    tabChange();
    tabChangeSecond();
    tabChangeThird();
    yhgmSelectDay();
    yhgmSelectMonth();
    yhgmSelectHistory();
    //randerTopDay(globalObj);
    //每日新增
    function yhgmSelectDay(){
        $.ready(function() {
            //普通示例
            var userPicker = new $.PopPicker();
            var data=[{
                value: '总计',
                text: '总计'
            }, {
                value: '信云贷',
                text: '信云贷'
            }, {
                value: '账云贷',
                text: '账云贷'
            }, {
                value: '货云贷',
                text: '货云贷'
            }];
            userPicker.setData(data);
            var showUserPickerButton = doc.getElementById('showUserPickerItem1');
            var userResult = doc.getElementById('userResultItem1');
            showUserPickerButton.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    userResult.innerText = items[0].text;
                    /*此处是调用渲染筛选的每日数据*/
                    randerTopDay(globalObj.loanWebModel.loanTypeDatas.每日新增.loanMap[items[0].value]);

                });
            }, false);
        });
    }
    //每月贷款
    function yhgmSelectMonth(){
        $.ready(function() {
            //普通示例
            var userPicker = new $.PopPicker();
            var data=[{
                value: '总计',
                text: '总计'
            }, {
                value: '信云贷',
                text: '信云贷'
            }, {
                value: '账云贷',
                text: '账云贷'
            }, {
                value: '货云贷',
                text: '货云贷'
            }];
            userPicker.setData(data);
            var showUserPickerButton = doc.getElementById('showUserPickerItem2');
            var userResult = doc.getElementById('userResultItem2');
            showUserPickerButton.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    userResult.innerText = items[0].text;
                    /*此处是调用渲染筛选的每月数据*/
                    randerTopDay(globalObj.loanWebModel.loanTypeDatas.每月贷款.loanMap[items[0].value]);

                });
            }, false);
        });
    }
    //历史累计
    function yhgmSelectHistory(){
        $.ready(function() {
            //普通示例
            var userPicker = new $.PopPicker();
            var data=[{
                value: '总计',
                text: '总计'
            }, {
                value: '信云贷',
                text: '信云贷'
            }, {
                value: '账云贷',
                text: '账云贷'
            }, {
                value: '货云贷',
                text: '货云贷'
            }];
            userPicker.setData(data);
            var showUserPickerButton = doc.getElementById('showUserPicker3');
            var userResult = doc.getElementById('userResultItem3');
            showUserPickerButton.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    userResult.innerText = items[0].text;
                    /*此处是调用渲染筛选的历史累计数据*/
                    randerTopDay(globalObj.loanWebModel.loanTypeDatas.历史累计.loanMap[items[0].value]);
                    //设置未还款余额
                   // $$(".whkye").text(objDmh.loanTypeDatas["历史累计"].loanMap[items[0].value].oweAmount);
                });
            }, false);
        });
    }

    var  myvue=new Vue() ;//借助第三方vue用来传值

    function randerTopDay(obj){
        //请求成功后传递数据
        myvue.$emit('getdataDay',obj);
    }
    /*每日，每月，历史累计数据渲染*/
    new Vue({
        el: '#dataDetail1',
        data: {
            Data: ''
        },
        mounted: function(){
            var that = this;
            myvue.$on('getdataDay', function(obj){
                that.Data=obj;
                that.getNumDay();
            })
        },
        methods:{
            getNumDay: function(){
                var itemValue = this.Data;//获取金额格式化后的值
            }
        }
    });

    function randerTopMouth(obj){
        //请求成功后传递数据
        myvue.$emit('getdataDay1',obj);
    }
   /* 顶部月份滚动条部分*/
    new Vue({
        el: '#topMonth',
        data: {
            kpiBig: '',
            kpiSmall: '',
            Data: '',
            comBig: '',
            comSmall: ''
        },
        mounted: function(){
            var that = this;
            myvue.$on('getdataDay1', function(obj){
                that.Data=obj;
                that.getNumDay();
            })
        },
        methods:{
            getNumDay: function(){
                //var itemValue = this.Data;//获取金额格式化后的值
                //console.log(JSON.stringify(this.Data));
                var itemValue = this.Data.pTaskAmount.toString();//获取kpi金额格式化后的值
                //console.log( itemValue);
                if(itemValue.indexOf('.')!=-1){
                    this.kpiBig = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
                    this.kpiSmall = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.kpiBig = itemValue;
                    this.kpiSmall ="";
                }

                //console.log( this.kpiBig);

                //this.kpiSmall = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                //console.log( this.kpiSmall);
                var realCom = this.Data.aPaymentAmount.toString();//获取总通过率格式化后的值
                if(realCom.indexOf('.')!=-1){
                    this.comBig = realCom.slice(0,realCom.indexOf('.'));//截取小数点以前的金额
                    this.comSmall = realCom.slice(realCom.indexOf('.'));//截取小数点以后的金额
                    //console.log(this.comSmall)
                }else{
                    this.comBig = realCom;
                    this.comSmall ="";
                }

                //this.comSmall = realCom.slice(realCom.indexOf('.'));//截取小数点以后的金额
                //console.log( this.comSmall)
            }
        }
    });

    stzbSelect();
    //信云贷大客户选择列表
    function stzbSelect(){
        $.ready(function() {
            //普通示例
            var userPicker = new $.PopPicker();
            var data=[{
                value: 'sl',
                text: '数量'
            }, {
                value: 'sxje',
                text: '授信金额'
            }];
            userPicker.setData(data);
            var showUserPickerButton = doc.getElementById('showUserPickerItem4');
            var userResult = doc.getElementById('userResultItem4');
            showUserPickerButton.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    userResult.innerText = items[0].text;
                    userResult.setAttribute("data-value",items[0].value)
                    firstCondition(hdxgObj[items[0].value]);
                });
            }, false);
        });
    }
    //信云贷大客户
    function firstCondition(obj){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('stzb'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
                formatter:function(params){
                    var str=params[0].name+'</br>';
                    var itemIndex=params[0].dataIndex;
                    var col1=option.series[0].itemStyle.normal.color;
                    var	col2=option.series[1].itemStyle.normal.color;
                    var	col3=option.series[2].itemStyle.normal.color;
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col1+'"></span>未注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ：'+params[0].value+'&nbsp;&nbsp;&nbsp;&nbsp;'+obj[0][4][itemIndex].wzcbfb+'%</br>';

                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col2+'"></span>已注未用 ：'+params[1].value+'&nbsp;&nbsp;&nbsp;&nbsp;'+obj[0][4][itemIndex].yzcbfb+'%</br>';

                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col3+'"></span>已用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ：'+params[2].value+'&nbsp;&nbsp;&nbsp;&nbsp;'+obj[0][4][itemIndex].ysybfb+'%</br>';

                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:green"></span>总计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp ：'+obj[0][4][itemIndex].zjzs+'&nbsp;&nbsp;&nbsp;&nbsp;'+obj[0][4][itemIndex].zjbfb+'%</br>';

                    return str;
                }
            },
            calculable : true,
            legend: {
                data:['未注册大客户','已注册未使用大客户','已使用大客户'],
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
                    data : obj[0][2],
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
                    name: obj[1][0],
                    axisLabel: {
                        formatter: obj[1][1],
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
                    name: '未注册大客户',
                    type: 'bar',
                    data: obj[0][0],
                    stack: '服务包购买',
                    itemStyle:{
                        normal:{
                            color:"#6d90fa"
                        }
                    }

                },
                {
                    name: '已注册未使用大客户',
                    type: 'bar',
                    data: obj[0][1],
                    stack: '服务包购买',
                    itemStyle:{
                        normal:{
                            color:"#2fcacc"
                        }
                    }

                },
                {
                    name: '已使用大客户',
                    type: 'bar',
                    data: obj[0][3],
                    stack: '服务包购买',
                    itemStyle:{
                        normal:{
                            color:"#ffcca0"
                        }
                    }
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        charts.push(myChart);
    }

    stzbSelectCusDay();
    //客户转化-每日选择列表
    function stzbSelectCusDay(){
        $.ready(function() {
            //普通示例
            var userPicker = new $.PopPicker();
            var data=[{
                value: 'sl',
                text: '数量'
            }, {
                value: 'fkje',
                text: '放款金额'
            }];
            userPicker.setData(data);
            var showUserPickerButton = doc.getElementById('showUserPickerItem5');
            var userResult = doc.getElementById('userResultItem5');
            showUserPickerButton.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    userResult.innerText = items[0].text;
                    userResult.setAttribute("data-value",items[0].value);
                    var xName = {
                        "sl":"(人数)",
                        "fkje":"(万元)"
                    };
                    //客户转化-每日
                    //console.log(globalObj);
                    dshzPercent(globalObj.customerConversionWebModel.ccData["客户转化-每日"][items[0].value],globalObj.customerConversionWebModel.thirtyDateList,xName[items[0].value]);
                });
            }, false);
        });
    }
    //客户转化-每日选择图表
    function dshzPercent(obj,timeList,xName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('dshzlDay'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:['日大客户转化','日全量转化'],
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
                    data : timeList,
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
                    name: xName,
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
                    name: '日大客户转化',
                    type: 'bar',
                    data: obj['日大客户转化'],
                    itemStyle:{
                        normal:{
                            color:"#738ffe"
                        }
                    }
                },
                {
                    name: '日全量转化',
                    type: 'bar',
                    data: obj['日全量转化'],
                    itemStyle:{
                        normal:{
                            color:"#26a69a"
                        }
                    }
                }
            ]
        };


        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        charts.push(myChart);

    }


    stzbSelectCusMonth();
    //客户转化-月累选择列表
    function stzbSelectCusMonth(){
        $.ready(function() {
            //普通示例
            var userPicker = new $.PopPicker();
            var data=[{
                value: 'sl',
                text: '数量'
            }, {
                value: 'fkje',
                text: '放款金额'
            }];
            userPicker.setData(data);
            var showUserPickerButton = doc.getElementById('showUserPickerItem6');
            var userResult = doc.getElementById('userResultItem6');
            showUserPickerButton.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    userResult.innerText = items[0].text;
                    userResult.setAttribute("data-value",items[0].value)
                    //返回 false 可以阻止选择框的关闭
                    //return false;

                    //console.log(stzbObj[items[0].value]);
                    //firstCondition(hdxgObj[items[0].value]);
                    var xName = {
                        "sl":"(人数)",
                        "fkje":"(万元)"
                    };
                    //客户转化-月累
                    failedReason(globalObj.customerConversionWebModel.ccData["客户转化-月累"][items[0].value],globalObj.customerConversionWebModel.monthDateList,xName[items[0].value]);
                });
            }, false);
        });
    }
    //客户转化-月累选择图表
    function failedReason(obj,timeList,xName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('sbyyMonth'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:['月大客户转化','月全量转化'],
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
                    data : timeList,
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
                    name: xName,
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
                {
                    name: '月大客户转化',
                    type: 'line',
                    data: obj['月大客户转化'],
                    itemStyle:{
                        normal:{
                            color:"#2baf2b"
                        }
                    }
                },
                {
                    name: '月全量转化',
                    type: 'line',
                    data: obj['月全量转化'],
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
        charts.push(myChart);
    }



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
    //firstCont选项卡切换
    function tabChange(){
        var parentBox = $$(".firstCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();//获取当前点击的索引
            $$(this).addClass("active").siblings("a").removeClass("mui-active active");
            $$(".firstCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
            if( $$(this).html()=="月任务跟踪"){
                progressCondition(globalObj.rwgzsWebModel.monthTask);
                $$(".YZ").html(globalObj.rwgzsWebModel.monthTask.rq);
                //console.log("月任务跟踪");
                randerTopMouth(globalObj.rwgzsWebModel.monthTask);
            }else if($$(this).html()=="周任务跟踪"){
                progressCondition(globalObj.rwgzsWebModel.weekTask);
                $$(".YZ").html(globalObj.rwgzsWebModel.weekTask.rq);
                //console.log("周任务跟踪");
                randerTopMouth(globalObj.rwgzsWebModel.weekTask);
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
            //console.log($$(this).html());
            //console.log(globalObj);
            if( $$(this).html()=="每日新增"){
                //console.log(globalObj);
                randerTopDay(globalObj.loanWebModel.loanTypeDatas.每日新增.loanMap.总计);
                $$("#userResultItem1").text("总计");
                $$(".secondCont .dataDetail1 .teli").removeClass("on").addClass("off");
            }else if($$(this).html()=="每月贷款"){
                randerTopDay(globalObj.loanWebModel.loanTypeDatas.每月贷款.loanMap.总计);
                $$("#userResultItem2").text("总计");
                $$(".secondCont .dataDetail1 .teli").removeClass("on").addClass("off");
            }else if($$(this).html()=="历史累计"){
                randerTopDay(globalObj.loanWebModel.loanTypeDatas.历史累计.loanMap.总计);
                $$("#userResultItem3").text("总计");
                $$(".secondCont .dataDetail1 .teli").removeClass("off").addClass("on");
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
            var xName = {
                "sl":"(人数)",
                "fkje":"(万元)"
            };

            dshzPercent(globalObj.customerConversionWebModel.ccData["客户转化-每日"].sl,globalObj.customerConversionWebModel.thirtyDateList,xName.sl);
            failedReason(globalObj.customerConversionWebModel.ccData["客户转化-月累"].sl,globalObj.customerConversionWebModel.monthDateList,xName.sl);
            $$("#userResultItem6").text("数量");
            $$("#userResultItem5").text("数量");
        })
    }

    /* 此处是为了让一个页面里的所有图表都能够自适应*/
    window.onresize = function(){
        for(var i = 0; i < charts.length; i++){
            charts[i].resize();
        }
    };


})(mui,jQuery,document,window.biMobile)