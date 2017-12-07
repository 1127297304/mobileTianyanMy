/**
 * Created by Administrator on 2017/5/15.
 */
;(function($,$$,doc,appGlobal){
    $.init({
        swipeBack: false//关闭右滑关闭功能
    })
    var globalObj;//初始请求的全局变量用以缓存数据
    var obj;//当前维度的所有数据
    var dateList;//用于存储时间轴数据	即	横轴
    var stzbObj;//首投占比对象	可删除
    var beforeToday;//当天前一天的完整日期格式
    var hdxgObj;//信云贷大客户对象
    var charts = [];
    var obj1, obj2, obj3, obj4, obj5, obj6, obj7;
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
            newUrl:"/getPayMentPlatForm.gm",
            type:"get",
            data:{
                edate:beforeToday
            },
            callback:function(data){
                globalObj = data.data.datainfo;
                //console.log(globalObj);
                //此处是加千分号
                function toThousands(num) {
                    num=parseFloat(Number(num).toFixed(2)).toString();
                    var reg=num.indexOf('.') >-1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;//千分符的正则
                    num=num.replace(reg, '$1,');
                    return num;
                };
                var objj1=globalObj.busiDataModel.meiYiFenBusiDataInfo;
                var objj2=globalObj.busiDataModel.meiJieBusiDataInfo;
                var objj3=globalObj.busiDataModel.meiYiCheBusiDataInfo;
                var objj4=globalObj.payMentDataModel.lianTongPayMentDataInfo;
                var objj5=globalObj.payMentDataModel.guangYinPayMentDataInfo;
                var objj6=globalObj.payMentDataModel.yiBaoPayMentDataInfo;
                var objj7=globalObj.payMentDataModel.kuaiFuPayMentDataInfo;

                for(var s in objj1){
                    if(typeof objj1[s]=="number"){
                        objj1[s]=toThousands(objj1[s]);
                    }
                    if(objj1[s]=="null"){
                        objj1[s]="-";
                    }
                };
                for(var s in objj2){
                    if(typeof objj2[s]=="number"){
                        objj2[s]=toThousands(objj2[s]);
                    }
                    if(objj2[s]=="null"){
                        objj2[s]="-";
                    }
                };
                for(var s in objj3){
                    if(typeof objj3[s]=="number"){
                        objj3[s]=toThousands(objj3[s]);
                    }
                    if(objj3[s]=="null"){
                        objj3[s]="-";
                    }
                };
                for(var s in objj4){
                    if(typeof objj4[s]=="number"){
                        objj4[s]=toThousands(objj4[s]);
                    }
                    if(objj4[s]=="null"){
                        objj4[s]="-";
                    }
                };
                for(var s in objj5){
                    if(typeof objj5[s]=="number"){
                        objj5[s]=toThousands(objj5[s]);
                    }
                    if(objj5[s]=="null"){
                        objj5[s]="-";
                    }
                };
                for(var s in objj6){
                    if(typeof objj6[s]=="number"){
                        objj6[s]=toThousands(objj6[s]);
                    }
                    if(objj6[s]=="null"){
                        objj6[s]="-";
                    }
                };
                for(var s in objj7){
                    if(typeof objj7[s]=="number"){
                        objj7[s]=toThousands(objj7[s]);
                    }
                    if(objj7[s]=="null"){
                        objj7[s]="-";
                    }
                };

                var curIndOne = $$(".secondCont .active").index();
                switch(curIndOne){
                    case 0:
                        YWXsjgl(globalObj.busiDataModel.meiYiFenBusiDataInfo);
                        break;
                    case 1:
                        YWXsjgl(globalObj.busiDataModel.meiJieBusiDataInfo);
                        break;
                    case 2:
                        YWXsjgl(globalObj.busiDataModel.meiYiCheBusiDataInfo);
                        break;
                }

                var curIndTwo = $$(".forthCont .active").index();
                switch(curIndTwo){
                    case 0:
                        ZFQDsjgl(globalObj.payMentDataModel.lianTongPayMentDataInfo);
                        break;
                    case 1:
                        ZFQDsjgl(globalObj.payMentDataModel.guangYinPayMentDataInfo);
                        break;
                    case 2:
                        ZFQDsjgl(globalObj.payMentDataModel.yiBaoPayMentDataInfo);
                        break;
                    case 3:
                        ZFQDsjgl(globalObj.payMentDataModel.kuaiFuPayMentDataInfo);
                        break;
                }
                //console.log(globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionNum);
                obj1={
                    "transactionNum":[
                        [globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionNum.descList,globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionNum.dateList,globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionNum.nReceiptTotalList,globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionNum.nReceiptSuccessList,globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionNum.rateCountSuccessList,"(笔数)"]
                    ],
                    "transactionMoney":[
                        [globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionMoney.descList,globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionMoney.dateList,globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionMoney.sReceiptTotalList,globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionMoney.sReceiptSuccessList,globalObj.busiSuccessModel.meiYiFenBusiSuccessInfo.transactionMoney.rateSumSuccessList,"(万元)"]
                    ]
                };
                obj2={
                    "transactionNum":[
                        [globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionNum.descList,globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionNum.dateList,globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionNum.nReceiptTotalList,globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionNum.nReceiptSuccessList,globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionNum.rateCountSuccessList,"(笔数)"]
                    ],
                    "transactionMoney":[
                        [globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionMoney.descList,globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionMoney.dateList,globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionMoney.sReceiptTotalList,globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionMoney.sReceiptSuccessList,globalObj.busiSuccessModel.meiJieBusiSuccessInfo.transactionMoney.rateSumSuccessList,"(万元)"]
                    ]
                };
                obj3={
                    "transactionNum":[
                        [globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionNum.descList,globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionNum.dateList,globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionNum.nReceiptTotalList,globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionNum.nReceiptSuccessList,globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionNum.rateCountSuccessList,"(笔数)"]
                    ],
                    "transactionMoney":[
                        [globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionMoney.descList,globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionMoney.dateList,globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionMoney.sReceiptTotalList,globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionMoney.sReceiptSuccessList,globalObj.busiSuccessModel.meiYiCheBusiSuccessInfo.transactionMoney.rateSumSuccessList,"(万元)"]
                    ]
                };
                obj4={
                    "transactionNum":[
                        [globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionNum.descList,globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionNum.dateList,globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionNum.nReceiptTotalList,globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionNum.nReceiptSuccessList,globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionNum.rateCountSuccessList,"(笔数)"]
                    ],
                    "transactionMoney":[
                        [globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionMoney.descList,globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionMoney.dateList,globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionMoney.sReceiptTotalList,globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionMoney.sReceiptSuccessList,globalObj.payMentSuccessModel.lianTongPayMentSuccessInfo.transactionMoney.rateSumSuccessList,"(万元)"]
                    ]
                };
                obj5={
                    "transactionNum":[
                        [globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionNum.descList,globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionNum.dateList,globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionNum.nReceiptTotalList,globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionNum.nReceiptSuccessList,globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionNum.rateCountSuccessList,"(笔数)"]
                    ],
                    "transactionMoney":[
                        [globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionMoney.descList,globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionMoney.dateList,globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionMoney.sReceiptTotalList,globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionMoney.sReceiptSuccessList,globalObj.payMentSuccessModel.guangYinPayMentSuccessInfo.transactionMoney.rateSumSuccessList,"(万元)"]
                    ]
                };
                obj6={
                    "transactionNum":[
                        [globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionNum.descList,globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionNum.dateList,globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionNum.nReceiptTotalList,globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionNum.nReceiptSuccessList,globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionNum.rateCountSuccessList,"(笔数)"]
                    ],
                    "transactionMoney":[
                        [globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionMoney.descList,globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionMoney.dateList,globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionMoney.sReceiptTotalList,globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionMoney.sReceiptSuccessList,globalObj.payMentSuccessModel.yiBaoPayMentSuccessInfo.transactionMoney.rateSumSuccessList,"(万元)"]
                    ]
                };
                obj7={
                    "transactionNum":[
                        [globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionNum.descList,globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionNum.dateList,globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionNum.nReceiptTotalList,globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionNum.nReceiptSuccessList,globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionNum.rateCountSuccessList,"(笔数)"]
                    ],
                    "transactionMoney":[
                        [globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionMoney.descList,globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionMoney.dateList,globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionMoney.sReceiptTotalList,globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionMoney.sReceiptSuccessList,globalObj.payMentSuccessModel.kuaiFuPayMentSuccessInfo.transactionMoney.rateSumSuccessList,"(万元)"]
                    ]
                };

                myfCondition(obj1.transactionNum,obj1.transactionNum[0][5]);
                mjCondition(obj2.transactionNum,obj2.transactionNum[0][5]);
                mjcCondition(obj3.transactionNum,obj3.transactionNum[0][5]);
                ltysCondition(obj4.transactionNum,obj4.transactionNum[0][5]);
                gylCondition(obj5.transactionNum,obj5.transactionNum[0][5]);
                ybCondition(obj6.transactionNum,obj6.transactionNum[0][5]);
                kftCondition(obj7.transactionNum,obj7.transactionNum[0][5]);
                ywxmyfChoose();
                ywxmjChoose();
                ywxmycChoose();
                zfqdltysChoose();
                zfqdgylChoose();
                zfqdybChoose();
                zfqdkftChoose();
                $$("ul li:first-child ").addClass("on").siblings().removeClass();
                //遮罩消失
                $$('.mask').css('display','none');

            }
        })
    }

    //业务线-成功率中的交易笔数和交易金额切换
    /*美易分切换*/
    function ywxmyfChoose(){
        $$("#khChooseItem").on("tap","li",function(){
            var curValue = $$(this).data("value");
            //console.log(curValue);
            $$(this).addClass("on").siblings().removeClass();
            //业务线-成功率 美易分		维度更改时改变
            myfCondition(obj1[curValue],obj1[curValue][0][5]);
        })
    }

    /*美借切换*/
    //ywxmjChoose();
    function ywxmjChoose(){
        $$("#khChooseItem2").on("tap","li",function(){
            var curValue = $$(this).data("value");
            //console.log("美借");
            $$(this).addClass("on").siblings().removeClass();
            mjCondition(obj2[curValue],obj2[curValue][0][5]);
        })
    }

    /*美易车切换*/
    //ywxmycChoose();
    function ywxmycChoose(){
        $$("#khChooseItem3").on("tap","li",function(){
            var curValue = $$(this).data("value");
            //console.log("美易车");
            $$(this).addClass("on").siblings().removeClass();
            mjcCondition(obj3[curValue],obj3[curValue][0][5]);
        })
    }


    //支付渠道-成功率中的交易笔数和交易金额切换
    /*联通优势切换*/
    function zfqdltysChoose(){
        $$("#khChooseItem4").on("tap","li",function(){
            var curValue = $$(this).data("value");
            $$(this).addClass("on").siblings().removeClass();
            ltysCondition(obj4[curValue],obj4[curValue][0][5]);

        })
    }

    /*广银联切换*/

    function zfqdgylChoose(){
        $$("#khChooseItem5").on("tap","li",function(){
            var curValue = $$(this).data("value");
            $$(this).addClass("on").siblings().removeClass();
            gylCondition(obj5[curValue],obj5[curValue][0][5]);
        })
    }

    /*易宝切换*/

    function zfqdybChoose(){
        $$("#khChooseItem6").on("tap","li",function(){
            var curValue = $$(this).data("value");
            $$(this).addClass("on").siblings().removeClass();
            ybCondition(obj6[curValue],obj6[curValue][0][5]);
            //客户转化率		维度更改时改变
            //khzhlCondition(obj.khzhl[curValue]);

        })
    }

    /*快付通切换*/

    function zfqdkftChoose(){
        $$("#khChooseItem7").on("tap","li",function(){
            var curValue = $$(this).data("value");
            $$(this).addClass("on").siblings().removeClass();
            kftCondition(obj7[curValue],obj7[curValue][0][5]);
            //客户转化率		维度更改时改变
            //khzhlCondition(obj.khzhl[curValue]);

        })
    }

    dateSelect();
    //日期选择
    function dateSelect(){
        $$("#calendars").on("change",function(){
            var curDate =  $$(this).val();
            //判断：满足 设定日期 <= 选择的日期 <= 当天的前一天 时，发送请求
            //在此获取选择的日期重新发送请求
            if((new Date(curDate) >= new Date("2017-03-17")) && (new Date(curDate) <= new Date(beforeToday))){
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

    // 业务线-数据概览切换
    tabChange();
    function tabChange(){
        var parentBox = $$(".secondCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();//获取当前点击的索引
            $$(this).addClass("active").siblings("a").removeClass("mui-active active");
            switch(curInd){
                case 0:
                    //console.log(globalObj)
                    YWXsjgl(globalObj.busiDataModel.meiYiFenBusiDataInfo);
                    break;
                case 1:
                    YWXsjgl(globalObj.busiDataModel.meiJieBusiDataInfo);
                    break;
                case 2:
                    YWXsjgl(globalObj.busiDataModel.meiYiCheBusiDataInfo);
                    break;
            }

        })
    }

    //业务线-成功率切换
    tabChange2();
    function tabChange2(){
        var parentBox = $$(".thirdCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();//获取当前点击的索引
            $$(this).addClass("active").siblings("a").removeClass("mui-active active");
            $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
            switch(curInd){
                case 0:
                    $$("ul li:first-child ").addClass("on").siblings().removeClass();
                    myfCondition(obj1.transactionNum,obj1.transactionNum[0][5]);
                    break;
                case 1:
                    $$("ul li:first-child ").addClass("on").siblings().removeClass();
                    mjCondition(obj2.transactionNum,obj2.transactionNum[0][5]);
                    break;
                case 2:
                    $$("ul li:first-child ").addClass("on").siblings().removeClass();
                    mjcCondition(obj3.transactionNum,obj3.transactionNum[0][5]);
                    break;
            }
        })
    }

    //支付渠道-数据概览切换
    tabChange3();
    function tabChange3(){
        var parentBox = $$(".forthCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();//获取当前点击的索引
            $$(this).addClass("active").siblings("a").removeClass("mui-active active");
          /*  $$(".forthCont .tabBlockDetail1>div:eq("+curInd+")").addClass("show").siblings().removeClass();*/
            switch(curInd){
                case 0:
                    ZFQDsjgl(globalObj.payMentDataModel.lianTongPayMentDataInfo);
                    break;
                case 1:
                    ZFQDsjgl(globalObj.payMentDataModel.guangYinPayMentDataInfo);
                    break;
                case 2:
                    ZFQDsjgl(globalObj.payMentDataModel.yiBaoPayMentDataInfo);
                    break;
                case 3:
                    ZFQDsjgl(globalObj.payMentDataModel.kuaiFuPayMentDataInfo);
                    break;
            }

        })
    }

    //支付渠道-成功率
    tabChange4();
    function tabChange4(){
        var parentBox = $$(".fifthCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();//获取当前点击的索引
            $$(this).addClass("active").siblings("a").removeClass("mui-active active");
            $$(".fifthCont .tabBlockDetail>div:eq("+curInd+")").addClass("show").siblings().removeClass();
            switch(curInd){
                case 0:
                    $$("ul li:first-child ").addClass("on").siblings().removeClass();
                    ltysCondition(obj4.transactionNum,obj4.transactionNum[0][5]);
                    break;
                case 1:
                    $$("ul li:first-child ").addClass("on").siblings().removeClass();
                    gylCondition(obj5.transactionNum,obj5.transactionNum[0][5]);
                    break;
                case 2:
                    $$("ul li:first-child ").addClass("on").siblings().removeClass();
                    ybCondition(obj6.transactionNum,obj6.transactionNum[0][5]);
                    break;
                case 3:
                    $$("ul li:first-child ").addClass("on").siblings().removeClass();
                    kftCondition(obj7.transactionNum,obj7.transactionNum[0][5]);
                    break;
            }
        })
    }


    var  myvue=new Vue() ;//借助第三方vue用来传值

    function YWXsjgl(obj){
        //请求成功后传递数据
        //console.log(obj)
        myvue.$emit('getdataDay',obj);
    }
    /*业务线-数据概览vue*/
    new Vue({
        el: '#dataDetail1',
        data: {
            Data: ''
        },
        mounted: function(){
            var that = this;
            myvue.$on('getdataDay', function(obj){
               // console.log(obj);
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


    function ZFQDsjgl(obj){
        //请求成功后传递数据
        myvue.$emit('getdataDay1',obj);
    }
    /*业务线-数据概览vue*/
    new Vue({
        el: '#dataDetail2',
        data: {
            Data: ''
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
                var itemValue = this.Data;//获取金额格式化后的值
            }
        }
    });

    /*图表区域*/
    //美易分图表
    function myfCondition(obj,yName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('myf1'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:obj[0][0],
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
                    data :obj[0][1],
                    axisLine:{
                        show:false
                    },
                    axisLabel:{},
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
                    name: obj[0][0][0],
                    type: 'bar',
                    data: obj[0][2],
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }

                },
                {
                    name: obj[0][0][1],
                    type: 'bar',
                    data: obj[0][3],
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }

                },
                {
                    name:obj[0][0][2],
                    type:'line',
                    yAxisIndex: 1,
                    data:obj[0][4],
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    }
                }
            ]
        };
        //console.log(option.xAxis)
       /* if(obj[0][1].length<8){
            option.xAxis[0].axisLabel.interval=0;
        }else{
            option.xAxis[0].axisLabel.interval=5;
        }*/
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        charts.push(myChart);
    }
    //美借图表
    function mjCondition(obj,yName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('mj1'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:obj[0][0],
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
                    data : obj[0][1],
                    axisLine:{
                        show:false
                    },
                    axisLabel:{},
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
                    name:obj[0][0][0],
                    type: 'bar',
                    data: obj[0][2],
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }

                },
                {
                    name: obj[0][0][1],
                    type: 'bar',
                    data: obj[0][3],
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }

                },
                {
                    name:obj[0][0][2],
                    type:'line',
                    yAxisIndex: 1,
                    data:obj[0][4],
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    }
                }
            ]
        };
       /* if(obj[0][1].length<8){
            option.xAxis[0].axisLabel.interval=0;
        }else{
            option.xAxis[0].axisLabel.interval=5;
        }*/
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        charts.push(myChart);
    }
    //美易车图表
    function mjcCondition(obj,yName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('myc1'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:obj[0][0],
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
                    data : obj[0][1],
                    axisLine:{
                        show:false
                    },
                    axisLabel:{},
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
                    name: obj[0][0][0],
                    type: 'bar',
                    data: obj[0][2],
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }

                },
                {
                    name:obj[0][0][1],
                    type: 'bar',
                    data: obj[0][3],
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }

                },
                {
                    name:obj[0][0][2],
                    type:'line',
                    yAxisIndex: 1,
                    data:obj[0][4],
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    }
                }
            ]
        };
       /* if(obj[0][1].length<8){
            option.xAxis[0].axisLabel.interval=0;
        }else{
            option.xAxis[0].axisLabel.interval=2;
        }*/

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        charts.push(myChart);
    }

    //联通优势图表
    function ltysCondition(obj,yName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('ltys1'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:obj[0][0],
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
                    data : obj[0][1],
                    axisLine:{
                        show:false
                    },
                    axisLabel:{},
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
                    name: obj[0][0][0],
                    type: 'bar',
                    data: obj[0][2],
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }

                },
                {
                    name: obj[0][0][1],
                    type: 'bar',
                    data: obj[0][3],
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }

                },
                {
                    name:obj[0][0][2],
                    type:'line',
                    yAxisIndex: 1,
                    data:obj[0][4],
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    }
                }
            ]
        };
       /* if(obj[0][1].length<8){
            option.xAxis[0].axisLabel.interval=0;
        }else{
            option.xAxis[0].axisLabel.interval=5;
        }*/
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        charts.push(myChart);
    }
    //广银联图表
    function gylCondition(obj,yName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('gyl1'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:obj[0][0],
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
                    data : obj[0][1],
                    axisLine:{
                        show:false
                    },
                    axisLabel:{},
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
                    name: obj[0][0][0],
                    type: 'bar',
                    data: obj[0][2],
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }

                },
                {
                    name: obj[0][0][1],
                    type: 'bar',
                    data: obj[0][3],
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }

                },
                {
                    name:obj[0][0][2],
                    type:'line',
                    yAxisIndex: 1,
                    data:obj[0][4],
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    }
                }
            ]
        };
        /*if(obj[0][1].length<8){
            option.xAxis[0].axisLabel.interval=0;
        }else{
            option.xAxis[0].axisLabel.interval=5;
        }*/
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        charts.push(myChart);
    }
    //易宝图表
    function ybCondition(obj,yName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('yb1'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:obj[0][0],
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
                    data : obj[0][1],
                    axisLine:{
                        show:false
                    },
                    axisLabel:{},
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
                    name: obj[0][0][0],
                    type: 'bar',
                    data: obj[0][2],
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }

                },
                {
                    name: obj[0][0][1],
                    type: 'bar',
                    data: obj[0][3],
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }

                },
                {
                    name:obj[0][0][2],
                    type:'line',
                    yAxisIndex: 1,
                    data:obj[0][4],
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    }
                }
            ]
        };
        /*if(obj[0][1].length<8){
            option.xAxis[0].axisLabel.interval=0;
        }else{
            option.xAxis[0].axisLabel.interval=5;
        }*/
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        charts.push(myChart);
    }
    //快付通图表
    function kftCondition(obj,yName){

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('kft1'));

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
            },
            calculable : true,
            legend: {
                data:obj[0][0],
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
                    data : obj[0][1],
                    axisLine:{
                        show:false
                    },
                    axisLabel:{},
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
                    name: obj[0][0][0],
                    type: 'bar',
                    data: obj[0][2],
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    }

                },
                {
                    name: obj[0][0][1],
                    type: 'bar',
                    data: obj[0][3],
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    }

                },
                {
                    name:obj[0][0][2],
                    type:'line',
                    yAxisIndex: 1,
                    data:obj[0][4],
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    }
                }
            ]
        };
        /*if(obj[0][1].length<8){
            option.xAxis[0].axisLabel.interval=0;
        }else{
            option.xAxis[0].axisLabel.interval=5;
        }*/
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