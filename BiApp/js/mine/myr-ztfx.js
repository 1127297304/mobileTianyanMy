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

    //调用请求ajax的插件
    function askForDataBefore(beforeToday){
    	
    	showTime = beforeToday;//当前页面显示的日期永远是符合时间范围内的日期
    	
        $$.ajaxData({
            newUrl:"/meiyirong/getThematicAnalysisNew.gm",
            type:"get",
            data:{
                edate:beforeToday
            },
            callback:function(data){

                globalObj=data.data.datainfo;//console.log(globalObj);
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
                };
                var obj1= globalObj.smallLaon.hisAccum.accumData;
                for(var s in obj1){
                    if(typeof obj1[s].total=="number"){
                        obj1[s].total=toThousands(obj1[s].total);
                    }else if(obj1[s].total=="null"){
                        obj1[s].total="-";
                    }
                };
                var obj2= globalObj.smallLaon.monAccum.accumData;
                for(var s in obj2){
                    if(typeof obj2[s].total=="number"){
                        obj2[s].total=toThousands(obj2[s].total);
                    }else if(obj2[s].total=="null"){
                        obj2[s].total="-";
                    }
                };
                var obj3= globalObj.factoring.hisAccum.accumData;
                for(var s in obj3){
                    if(typeof obj3[s].total=="number"){
                        obj3[s].total=toThousands(obj3[s].total);
                    }else if(obj3[s].total=="null"){
                        obj3[s].total="-";
                    }
                };
                var obj4= globalObj.factoring.monAccum.accumData;
                for(var s in obj4){
                    if(typeof obj4[s].total=="number"){
                        obj4[s].total=toThousands(obj4[s].total);
                    }else if(obj4[s].total=="null"){
                        obj4[s].total="-";
                    }
                };

               /* var curIndOne = $$(".secondCont .active").index();
                $$(".secondCont .tabBlockDetail>div").eq(curIndOne).addClass("show").siblings().removeClass();*/
                var curInd1 =  $$(".firstCont .active").index();//获取当前点击的索引
                //$$("#qhhz>div").eq(curInd1).addClass("show").siblings().removeClass();
                $$("#qhhz >div").eq(curInd1).removeClass("off").addClass("on").siblings().removeClass("on").addClass("off");
                switch(curInd1){
                    case 0:
                        randerTopMouth(globalObj.smallLaon.hisAccum.accumData.ljzdje);
                        //$$(".xdlsTotalMoney").text(globalObj.smallLaon.hisAccum.accumData.ljzdje.total);
                        randerTopMouth1(globalObj.smallLaon.monAccum.accumData);
                       /* $$(".xdyhje").text(globalObj.smallLaon.monAccum.accumData.yyhje.total);
                        $$(".xdshje").text(globalObj.smallLaon.monAccum.accumData.yshje.total);*/
                        $$("#userResultItem1").text("累计在贷余额");
                        firstCondition(globalObj.smallLaon.hisAccum.accumData.ljzdje,['累计在贷余额'],globalObj.smallLaon.hisAccum.dateList);
                        userCount(globalObj.smallLaon.monAccum.accumData,globalObj.smallLaon.monAccum.dateList);
                        break;
                    case 1:
                        randerTopMouth2(globalObj.factoring.hisAccum.accumData.ljzdje);
                        //$$(".bllsTotalMoney").text(globalObj.factoring.hisAccum.accumData.ljzdje.total);
                        randerTopMouth3(globalObj.factoring.monAccum.accumData.yshje);
                        //$$(".blyshje").text(globalObj.factoring.monAccum.accumData.yshje.total);
                        $$("#userResultItem2").text("累计在贷余额");
                        bLCondition(globalObj.factoring.hisAccum.accumData.ljzdje,['累计在贷余额'],globalObj.factoring.hisAccum.dateList);
                        bLuserCount(globalObj.factoring.monAccum.accumData.yshje,globalObj.factoring.monAccum.dateList);
                        break;
                }





                //遮罩消失
                $$('.mask').css('display','none');
            }
        })
    }


    //日期选择
    dateSelect();
    tabChange();
    stzbSelect();
    bLSelect();
    var  myvue=new Vue() ;
    function randerTopMouth(obj){
        //请求成功后传递数据
        myvue.$emit('getdataDay1',obj);
    }
    new Vue({
        el: '#xdlsTotalMoney',
        data: {
            kpiBig: '',
            kpiSmall: '',
            Data: '',
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
                var itemValue = this.Data.total.toString();//获取kpi金额格式化后的值
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
               /* var realCom = this.Data.aPaymentAmount.toString();//获取总通过率格式化后的值
                if(realCom.indexOf('.')!=-1){
                    this.comBig = realCom.slice(0,realCom.indexOf('.'));//截取小数点以前的金额
                    this.comSmall = realCom.slice(realCom.indexOf('.'));//截取小数点以后的金额
                    console.log(this.comSmall)
                }else{
                    this.comBig = realCom;
                    this.comSmall ="";
                }*/

                //this.comSmall = realCom.slice(realCom.indexOf('.'));//截取小数点以后的金额
                //console.log( this.comSmall)
            }
        }
    });

    function randerTopMouth1(obj){
        //请求成功后传递数据
        myvue.$emit('getdataDay2',obj);
    }
    new Vue({
        el: '#xdchong',
        data: {
            kpiBig: '',
            kpiSmall: '',
            Data: '',
             comBig: '',
             comSmall: ''
        },
        mounted: function(){
            var that = this;
            myvue.$on('getdataDay2', function(obj){
                that.Data=obj;
                that.getNumDay();
            })
        },
        methods:{
            getNumDay: function(){
                var itemValue = this.Data.yyhje.total.toString();//获取kpi金额格式化后的值

                if(itemValue.indexOf('.')!=-1){
                    this.kpiBig = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
                    this.kpiSmall = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.kpiBig = itemValue;
                    this.kpiSmall ="";
                }


                 var realCom = this.Data.yshje.total.toString();//获取总通过率格式化后的值
                 if(realCom.indexOf('.')!=-1){
                 this.comBig = realCom.slice(0,realCom.indexOf('.'));//截取小数点以前的金额
                 this.comSmall = realCom.slice(realCom.indexOf('.'));//截取小数点以后的金额
                 }else{
                 this.comBig = realCom;
                 this.comSmall ="";
                 }

            }
        }
    });

    function randerTopMouth2(obj){
        //请求成功后传递数据
        myvue.$emit('getdataDay3',obj);
    }
    new Vue({
        el: '#bllsTotalMoney',
        data: {
            kpiBig: '',
            kpiSmall: '',
            Data: '',
        },
        mounted: function(){
            var that = this;
            myvue.$on('getdataDay3', function(obj){
                that.Data=obj;
                that.getNumDay();
            })
        },
        methods:{
            getNumDay: function(){
                var itemValue = this.Data.total.toString();//获取kpi金额格式化后的值
                if(itemValue.indexOf('.')!=-1){
                    this.kpiBig = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
                    this.kpiSmall = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.kpiBig = itemValue;
                    this.kpiSmall ="";
                }
            }
        }
    });

    function randerTopMouth3(obj){
        //请求成功后传递数据
        myvue.$emit('getdataDay4',obj);
    }
    new Vue({
        el: '#blyshje',
        data: {
            kpiBig: '',
            kpiSmall: '',
            Data: '',
        },
        mounted: function(){
            var that = this;
            myvue.$on('getdataDay4', function(obj){
                that.Data=obj;
                that.getNumDay();
            })
        },
        methods:{
            getNumDay: function(){
                var itemValue = this.Data.total.toString();//获取kpi金额格式化后的值
                if(itemValue.indexOf('.')!=-1){
                    this.kpiBig = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
                    this.kpiSmall = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.kpiBig = itemValue;
                    this.kpiSmall ="";
                }
            }
        }
    });

    function dateSelect(){
        $$("#calendars").on("change",function(){
            var curDate =  $$(this).val();
            //判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
            //在此获取选择的日期重新发送请求
            if((new Date(curDate) >= new Date("2015-09-29")) && (new Date(curDate) <= new Date(beforeToday))){
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
        $$("#qhhz >div:eq("+curInd+")").removeClass("off").addClass("on").siblings().removeClass("on").addClass("off");
        if( $$(this).html()=="小贷"){
            randerTopMouth(globalObj.smallLaon.hisAccum.accumData.ljzdje);
            //$$(".xdlsTotalMoney").text(globalObj.smallLaon.hisAccum.accumData.ljzdje.total);
            randerTopMouth1(globalObj.smallLaon.monAccum.accumData);
            /*$$(".xdyhje").text(globalObj.smallLaon.monAccum.accumData.yyhje.total);
            $$(".xdshje").text(globalObj.smallLaon.monAccum.accumData.yshje.total);*/
            $$("#userResultItem1").text("累计在贷余额");
            firstCondition(globalObj.smallLaon.hisAccum.accumData.ljzdje,['累计在贷余额'],globalObj.smallLaon.hisAccum.dateList);
            userCount(globalObj.smallLaon.monAccum.accumData,globalObj.smallLaon.monAccum.dateList);

        }else if($$(this).html()=="保理"){
            bLCondition(globalObj.factoring.hisAccum.accumData.ljzdje,['累计在贷余额'],globalObj.factoring.hisAccum.dateList);
            bLuserCount(globalObj.factoring.monAccum.accumData.yshje,globalObj.factoring.monAccum.dateList);
            randerTopMouth2(globalObj.factoring.hisAccum.accumData.ljzdje);
            //$$(".bllsTotalMoney").text(globalObj.factoring.hisAccum.accumData.ljzdje.total);
            randerTopMouth3(globalObj.factoring.monAccum.accumData.yshje);
            //$$(".blyshje").text(globalObj.factoring.monAccum.accumData.yshje.total);
            $$("#userResultItem2").text("累计在贷余额");
        }


    })
}

    //小贷-历史累计选择列表
    function stzbSelect(){
        $.ready(function() {
            //普通示例
            var userPicker = new $.PopPicker();
            var data=[{
                value: 'ljzdje',
                text: '累计在贷余额'
            }, {
                value: 'ljsr',
                text: '累计收入'
            }, {
                value: 'yqwhje',
                text: '逾期未还金额'
            }];
            userPicker.setData(data);
            var showUserPickerButton = doc.getElementById('showUserPickerItem1');
            var userResult = doc.getElementById('userResultItem1');
            showUserPickerButton.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    userResult.innerText = items[0].text;
                    userResult.setAttribute("data-value",items[0].value)
                     //$$(".xdlsTotalMoney").text(globalObj.smallLaon.hisAccum.accumData[items[0].value].total);
                    randerTopMouth(globalObj.smallLaon.hisAccum.accumData[items[0].value]);
                    firstCondition(globalObj.smallLaon.hisAccum.accumData[items[0].value],[items[0].text],globalObj.smallLaon.hisAccum.dateList);
                });
            }, false);
        });
    }
    //小贷-历史累计
    function firstCondition(obj,echartText,datelist){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('xdlsle'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            calculable : true,
            legend: {
                data:echartText,
                itemGap: 10,
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
                    data : datelist,
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
                    name: echartText,
                    type: 'line',
                    data: obj.zdjexx,
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
        charts.push(myChart);
    }

    //小贷-月累计
    function userCount(obj,dateList){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('xdyele'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            calculable : true,
            legend: {
                data:['月应还金额','月实还金额'],
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
                    data : dateList,
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
                    name:'月应还金额',
                    type:'line',
                    yAxisIndex: 0,
                    data: obj.yyhje.zdjexx,
                    itemStyle:{
                        normal:{
                            color:"#5c6bc0"
                        }
                    }
                },
                {
                    name:'月实还金额',
                    type:'line',
                    yAxisIndex: 0,
                    data: obj.yshje.zdjexx,
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

    //保理-历史累计选择列表
    function bLSelect(){
        $.ready(function() {
            //普通示例
            var userPicker = new $.PopPicker();
            var data=[{
                value: 'ljzdje',
                text: '累计在贷余额'
            }, {
                value: 'ljsr',
                text: '累计收入'
            }];
            userPicker.setData(data);
            var showUserPickerButton = doc.getElementById('showUserPickerItem2');
            var userResult = doc.getElementById('userResultItem2');
            showUserPickerButton.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    userResult.innerText = items[0].text;
                    userResult.setAttribute("data-value",items[0].value)
                    randerTopMouth2(globalObj.factoring.hisAccum.accumData[items[0].value]);
                    //$$(".bllsTotalMoney").text(globalObj.factoring.hisAccum.accumData[items[0].value].total);
                    bLCondition(globalObj.factoring.hisAccum.accumData[items[0].value],[items[0].text],globalObj.factoring.hisAccum.dateList);
                });
            }, false);
        });
    }
    //保理-历史累计
    function bLCondition(obj,echartText,dateList){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('bllsle'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            calculable : true,
            legend: {
                data:echartText,
                itemGap: 10,
                //itemWidth:15,
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
                    data : dateList,
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
                    name: echartText,
                    type: 'line',
                    data: obj.zdjexx,
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
        charts.push(myChart);
    }

    //保理-月累计
    function bLuserCount(obj,dateList){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('blyele'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            calculable : true,
            legend: {
                data:['月实还金额'],
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
                    data : dateList,
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
                    name:'月实还金额',
                    type:'line',
                    yAxisIndex: 0,
                    data: obj.zdjexx,
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

    /* 此处是为了让一个页面里的所有图表都能够自适应*/
    window.onresize = function(){
        for(var i = 0; i < charts.length; i++){
            charts[i].resize();
        }
    };

})(mui,jQuery,document,window.biMobile)