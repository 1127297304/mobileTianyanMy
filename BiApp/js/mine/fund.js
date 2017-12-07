/**
 * Created by Administrator on 2017/11/14.
 */
;(function($,$$,doc,appGlobal){
    $.init({
        swipeBack: false//关闭右滑关闭功能
    })
    //给所有的tab标签添加局部滚动
    mui('.mui-scroll-wrapper').scroll();
    var globalObjCenter1,globalObjCenter2,globalObjCenter3,globalObjCenter4,globalObjCenter5,globalObjCenter6,globalObjCenter7;
    var globalObjBusy1,globalObjBusy2,globalObjBusy3,globalObjBusy4,globalObjBusy5,globalObjBusy6,globalObjBusy7;
    var globalObjLJ1,globalObjLJ2,globalObjLJ3;
    //判断当前显示的时间
    showCurTime();
    //判断当前的显示时间
    function showCurTime(){
        var ddNew = new Date();
        var yNew = ddNew.getFullYear();
        var mNew = ddNew.getMonth()+1;//获取当前月份的日期
        //获取当前日期	如果当天为1号则取上个月最后一天的日期
        beforeToday=GetDateStr(-1);

        $$("#showNowDate").text(beforeToday);//在页面中显示当前日期
        $$("#calendarsRi").val(beforeToday);
        $$("#calendarsOnline").val(beforeToday);
        $$("#calendarsOffline").val(beforeToday);
        $$("#calendarsLJ").val(beforeToday);
        $$("#calendarsYue").val(yNew+"-"+(mNew<10 ? "0"+mNew : mNew));
        $$("#calendarsNian").val(yNew);
        //默认发送请求（请求当前日期的数据）
        //askForDataBefore(beforeToday);
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
    /*此处是调取核心数据*/
    askForDataCenter('#calendarsRi',1,globalObjCenter1);
    function askForDataCenter(a,b,c){
        //调用请求ajax的插件
        $$.ajaxData({
            newUrl:"/fund/overview/coredata.gm",
            data:{
                date:$$(a).val(),
                flag:b
            },
            callback:function(data){
                //遮罩消失
                $$('.mask').css('display','none');
                c=data.data.datainfo;
                centerDataAll(c);

            }
        })
    };

    /*此处是调取交易分析数据*/
    askForDataBusy();
    function askForDataBusy(){
        //调用请求ajax的插件
        $$.ajaxData({
            newUrl:"/fund/overview/dealanalysis.gm",
            data:{
                date:beforeToday,
                flag:1
            },
            callback:function(data){
                globalObjBusy1=data.data.datainfo;
                businessOnline(globalObjBusy1.currency.amt_rate_list,globalObjBusy1.mix.amt_rate_list,globalObjBusy1.stock.amt_rate_list,globalObjBusy1.QD.amt_rate_list,globalObjBusy1.bond.amt_rate_list,globalObjBusy1.spec.amt_rate_list,globalObjBusy1.other.amt_rate_list,globalObjBusy1.deal_amt_list,globalObjBusy1.date_list);
            }
        })
    };
    /*此处是调取累计开户数的数据*/
    Cumulative(beforeToday,globalObjLJ1);
    function Cumulative(a,b){
        $$.ajaxData({
            newUrl:"/fund/overview/totalacc.gm",
            data:{
                date:a,
            },
            callback:function(data){
                b=data.data.datainfo;
                userCondition(b);
            }
        })
    }
    //第一块  核心数据的切换
    tabChangeFirst();
    function tabChangeFirst(){
        var parentBox = $$(".firstCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");

            var curInd = $$(this).index();//获取当前点击的索引
            $$('.userBlockOne').eq(curInd).removeClass('off').addClass('on').siblings('.userBlockOne').removeClass('on').addClass('off');
            switch(curInd){
                case 0:
                    $$('.userBlockOne').eq(0).removeClass('off').addClass('on').siblings('.userBlockOne').removeClass('on').addClass('off');
                    askForDataCenter('#calendarsRi',1,globalObjCenter2);
                    break;
                case 1:
                    $$('.userBlockOne').eq(1).removeClass('off').addClass('on').siblings('.userBlockOne').removeClass('on').addClass('off');
                    askForDataCenter('#calendarsYue',2,globalObjCenter3);
                    break;
                case 2:
                    $$('.userBlockOne').eq(2).removeClass('off').addClass('on').siblings('.userBlockOne').removeClass('on').addClass('off');
                    askForDataCenter('#calendarsNian',3,globalObjCenter4);
                    break;
            }
        });
    };

    //第二块  交易分析的切换
    tabChangeSecond();
    function tabChangeSecond(){
        var parentBox = $$(".secondCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();//获取当前点击的索引
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            switch(curInd){
                case 0:
                    $$('.tabBlockDetailShu').eq(curInd).removeClass('off').addClass('on').siblings('.tabBlockDetailShu').removeClass('on').addClass('off');
                    publickbusy1();
                    break;
                case 1:
                    $$('.tabBlockDetailShu').eq(curInd).removeClass('off').addClass('on').siblings('.tabBlockDetailShu').removeClass('on').addClass('off');
                    publickbusy2();
                    break;
            }
        });
    };

    function publickbusy1(){
        var dateNew=$$('#calendarsOnline').val();
        /*console.log(dateNew)*/
        var choices;
        if($$('#userResultOn').text()==='交易金额'){
            $$.ajaxData({
                newUrl:"/fund/overview/dealanalysis.gm",
                data:{
                    date:dateNew,
                    flag:1
                },
                callback:function(data){
                    globalObjBusy2=data.data.datainfo;
                    businessOnline(globalObjBusy2.currency.amt_rate_list,globalObjBusy2.mix.amt_rate_list,globalObjBusy2.stock.amt_rate_list,globalObjBusy2.QD.amt_rate_list,globalObjBusy2.bond.amt_rate_list,globalObjBusy2.spec.amt_rate_list,globalObjBusy2.other.amt_rate_list,globalObjBusy2.deal_amt_list,globalObjBusy2.date_list);
                }
            });
        }else if($$('#userResultOn').text()==='交易账户数'){
            $$.ajaxData({
                newUrl:"/fund/overview/dealanalysis.gm",
                data:{
                    date:dateNew,
                    flag:1
                },
                callback:function(data){
                    globalObjBusy3=data.data.datainfo;
                    businessOnline(globalObjBusy3.currency.acc_rate_list,globalObjBusy3.mix.acc_rate_list,globalObjBusy3.stock.acc_rate_list,globalObjBusy3.QD.acc_rate_list,globalObjBusy3.bond.acc_rate_list,globalObjBusy3.spec.acc_rate_list,globalObjBusy3.other.acc_rate_list,globalObjBusy3.deal_acc_list,globalObjBusy3.date_list);

                }
            });
        }else if($$('#userResultOn').text()==='交易单数'){
            $$.ajaxData({
                newUrl:"/fund/overview/dealanalysis.gm",
                data:{
                    date:dateNew,
                    flag:1
                },
                callback:function(data){
                    globalObjBusy4=data.data.datainfo;
                    businessOnline(globalObjBusy4.currency.order_rate_list,globalObjBusy4.mix.order_rate_list,globalObjBusy4.stock.order_rate_list,globalObjBusy4.QD.order_rate_list,globalObjBusy4.bond.order_rate_list,globalObjBusy4.spec.order_rate_list,globalObjBusy4.other.order_rate_list,globalObjBusy4.deal_order_list,globalObjBusy4.date_list);

                }
            });
        }
    };
    function publickbusy2(){
        var dateNew=$$('#calendarsOffline').val();
        var choices;
        if($$('#userResultoff').text()==='交易金额'){
            $$.ajaxData({
                newUrl:"/fund/overview/dealanalysis.gm",
                data:{
                    date:dateNew,
                    flag:2
                },
                callback:function(data){
                    globalObjBusy5=data.data.datainfo;
                    businessOffline(globalObjBusy5.private.amt_rate_list,globalObjBusy5.info_manage.amt_rate_list,globalObjBusy5.other.amt_rate_list,globalObjBusy5.deal_amt_list,globalObjBusy5.date_list);
                }
            });
        }/*else if($$('#userResultOn').text()==='交易账户数'){
         $$.ajaxData({
         newUrl:"/fund/overview/dealanalysis.gm",
         data:{
         date:dateNew,
         flag:1
         },
         callback:function(data){
         globalObjBusy3=data.data.datainfo;
         businessOnline(globalObjBusy3.currency.acc_rate_list,globalObjBusy3.mix.acc_rate_list,globalObjBusy3.stock.acc_rate_list,globalObjBusy3.QD.acc_rate_list,globalObjBusy3.bond.acc_rate_list,globalObjBusy3.spec.acc_rate_list,globalObjBusy3.other.acc_rate_list,globalObjBusy3.deal_acc_list,globalObjBusy3.date_list);

         }
         });
         }*/else if($$('#userResultoff').text()==='交易单数'){
            $$.ajaxData({
                newUrl:"/fund/overview/dealanalysis.gm",
                data:{
                    date:dateNew,
                    flag:2
                },
                callback:function(data){
                    globalObjBusy6=data.data.datainfo;
                    businessOffline(globalObjBusy6.private.order_rate_list,globalObjBusy6.info_manage.order_rate_list,globalObjBusy6.other.order_rate_list,globalObjBusy6.deal_order_list,globalObjBusy6.date_list);

                }
            });
        }

    };

   /* 此处是线上交易筛选*/
    businessChOn();
    function businessChOn(){
        var userPicker = new $.PopPicker();
        var data=[{
            value: 'amt_rate_list',
            text: '交易金额'
        }, {
            value: 'newuser',
            text: '交易账户数'
        }, {
            value: 'olduser',
            text: '交易单数'
        }
        ];
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById('showUserPickerOn');
        var userResult = doc.getElementById('userResultOn');
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;
               /* var xxkNum,xxk,cpz;
                var curIndForth = $$(".forthCont .active").index();
                switch(curIndForth){
                    case 0:
                        xxkNum="112112";
                        break;
                    case 1:
                        xxkNum="10000000";
                        break;
                    case 2:
                        xxkNum="10000001";
                        break;
                };*/
                publickbusy1();
            });
        }, false);
    };
    /*此处是线下交易筛选*/
    businessChOff();
    function businessChOff(){
        var userPicker = new $.PopPicker();
        var data=[{
            value: 'amt_rate_list',
            text: '交易金额'
        }, /*{
            value: 'newuser',
            text: '交易账户数'
        },*/ {
            value: 'olduser',
            text: '交易单数'
        }
        ];
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById('showUserPickeroff');
        var userResult = doc.getElementById('userResultoff');
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;
                /* var xxkNum,xxk,cpz;
                 var curIndForth = $$(".forthCont .active").index();
                 switch(curIndForth){
                 case 0:
                 xxkNum="112112";
                 break;
                 case 1:
                 xxkNum="10000000";
                 break;
                 case 2:
                 xxkNum="10000001";
                 break;
                 };*/
                publickbusy2();
            });
        }, false);
    };

    /*此处是线上交易的图表*/
    function businessOnline(a,b,c,d,e,f,g,h,i){
        var itemNum = Math.floor(((i.length)*1/30)*100);
        var dataRangeStart = itemNum-30;
        var dataRangeEnd = itemNum;
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('onLine'));
        var dataLenged=[];
        var danwei='';
        var danwei2='';
        var nameFK='';

        if($$('#userResultOn').text()=='交易金额'){
            dataLenged=['货币型','混合型','股票型','QD','债券型','专户','其他','交易金额'];
            danwei='（万元）';
            danwei2='万元';
            nameFK='交易金额';
        }else if($$('#userResultOn').text()=='交易账户数'){
            dataLenged=['货币型','混合型','股票型','QD','债券型','专户','其他','交易账户数'];
            danwei='（个）';
            danwei2='个';
            nameFK='交易账户数';
        }else if($$('#userResultOn').text()=='交易单数'){
            dataLenged=['货币型','混合型','股票型','QD','债券型','专户','其他','交易单数'];
            danwei='（个）';
            danwei2='个';
            nameFK='交易单数';
        };
        var formatLabel = '{b}<br/>'

        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
              /*  formatter: "{b}<br/>"+"{a} ：  {c}"+'%',*/
                backgroundColor: 'rgba(87,106,118,0.7)',
                formatter:function(params){
                    var str=params[0].name+'</br>';
                   /* console.log(params[0]);
                    console.log(params);*/
                    var itemIndex=params[0].dataIndex;
                    /*console.log(itemIndex);*/
                    var shu1=params[0].data;
                    var shu2=params[1].data;
                    var shu3=params[2].data;
                    var shu4=params[3].data;
                    var shu5=params[4].data;
                    var shu6=params[5].data;
                    var shu7=params[6].data;
                    var shu8=params[7].data;
                    var col1=option.series[0].itemStyle.normal.color;
                    var	col2=option.series[1].itemStyle.normal.color;
                    var	col3=option.series[2].itemStyle.normal.color;
                    var col4=option.series[3].itemStyle.normal.color;
                    var	col5=option.series[4].itemStyle.normal.color;
                    var	col6=option.series[5].itemStyle.normal.color;
                    var col7=option.series[6].itemStyle.normal.color;
                    var col8=option.series[7].itemStyle.normal.color;

                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col1+'"></span>货币型 ：'+ shu1+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col2+'"></span>混合型 ：'+ shu2+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col3+'"></span>股票型 ：'+ shu3+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col4+'"></span>QD ：'+ shu4+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col5+'"></span>债券型 ：'+ shu5+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col6+'"></span>专户 ：'+ shu6+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col7+'"></span>其他 ：'+ shu7+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col8+'"></span>'+nameFK+':' +shu8+danwei2+'</br>';
                    return str;
                }
            },
            legend: {
                data: dataLenged,
                itemGap: 10,
                itemWidth:15,
                itemHeight:10,
                /*selectedMode:false,*/
                textStyle:{
                    fontSize:10,
                    color: '#929292'
                },
                bottom:'0'
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
                    data :i ,
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
                    /*min: 0,
                    max: 100,
                    interval: 10,*/
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
                },
                {
                    type: 'value',
                    name: danwei,
                   /* min: 0,
                    max: 50,
                    interval: 5,*/
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
                     start: dataRangeStart,//窗口中数据显示的起始位置
                     end: dataRangeEnd,//窗口中数据显示的结束位置
                    height:14,//水平滚动条的高度
                  /*  bottom:"3%"*/
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
                    name:'货币型',
                    type:'bar',
                    data: a,
                    itemStyle:{
                        normal:{
                            color:"#ee7d2e",

                        },
                    },
                   /* tooltip:{
                        trigger:'item',
                        formatter: "{b}<br/>"+"{a} ：  {c}"+'%',
                    },*/
                   /* barWidth : 30,
                    barGap:'80%',*/
                    stack: '搜索引擎'
                },
                {
                    name:'混合型',
                    type: 'bar',
                    data: b,
                    /*label:{
                        normal:{
                                formatter: "{b}<br/>"+"{a} ：  {c}"+'%',
                            },
                    },*/
                    itemStyle:{
                        normal:{
                           /* color:"#3233ff",*/
                            color:"#f684ef"


                        }
                    },
                    /*tooltip:{
                        trigger:'item',
                        formatter: "{b}<br/>"+"{a} ：  {c}"+'%',
                    },*/
                  /*  barWidth : 30,
                    barGap:'80%',*/
                    stack: '搜索引擎'
                },
                {
                    name:'股票型',
                    type:'bar',
                    data: c,
                    itemStyle:{
                        normal:{
                            color:"#2BE1CF"
                        }
                    },
                    /*barWidth : 30,
                    barGap:'80%',*/
                    stack: '搜索引擎'
                },
                {
                    name:'QD',
                    type:'bar',
                    data: d,
                    itemStyle:{
                        normal:{
                            color:"#F8405F"
                        }
                    },
                   /* barWidth : 30,
                    barGap:'80%',*/
                    stack: '搜索引擎'
                },
                {
                    name:'债券型',
                    type:'bar',
                    data: e,
                    itemStyle:{
                        normal:{
                            color:"#9a7103"
                        }
                    },
                   /* barWidth : 30,
                    barGap:'80%',*/
                    stack: '搜索引擎'
                },
                {
                    name:'专户',
                    type: 'bar',
                    data: f,
                    itemStyle:{
                        normal:{
                            color:"#ffbe01"
                        }
                    },
                  /*  barWidth : 30,
                    barGap:'80%',*/
                    stack: '搜索引擎'
                },
                {
                    name:'其他',
                    type:'bar',
                    data: g,
                    itemStyle:{
                        normal:{
                            color:"#6E9BFC"
                        }
                    },
                  /*  barWidth : 30,
                    barGap:'80%',*/
                    stack: '搜索引擎'
                },
                {
                    name:dataLenged[dataLenged.length-1],
                    type:'line',
                    yAxisIndex: 1,
                    data: h,
                    itemStyle:{
                        normal:{
                            /*color:"#f684ef",*/
                            color:'red'
                        }
                    },
                    /*此处的stack要去掉，否则堆叠图的折线对应的Y轴有问题*/
                   /* stack: '搜索引擎'*/
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    };
    /*此处是线下交易的图表*/
    function businessOffline(a,b,c,h,i){
        var itemNum = Math.floor(((i.length)*1/30)*100);
        var dataRangeStart = itemNum-30;
        var dataRangeEnd = itemNum;
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('offLine'));
        var dataLenged=[];
        var danwei='';
        var danwei2='';
        var nameFK='';
        if($$('#userResultoff').text()=='交易金额'){
            dataLenged=['私募基金','线下资管','其他','交易金额'];
            danwei='（万元）';
            danwei2='万元';
            nameFK='交易金额';
        }else if($$('#userResultoff').text()=='交易单数'){
            dataLenged=['私募基金','线下资管','其他','交易单数'];
            danwei='（个）';
            danwei2='个';
            nameFK='交易单数';
        };
        var option = {
            tooltip : {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)',
                formatter:function(params){
                    var str=params[0].name+'</br>';
                    /* console.log(params[0]);
                     console.log(params);*/
                    var itemIndex=params[0].dataIndex;
                    /*console.log(itemIndex);*/
                    var shu1=params[0].data;
                    var shu2=params[1].data;
                    var shu3=params[2].data;
                    var shu4=params[3].data;

                    var col1=option.series[0].itemStyle.normal.color;
                    var	col2=option.series[1].itemStyle.normal.color;
                    var	col3=option.series[2].itemStyle.normal.color;
                    var col4=option.series[3].itemStyle.normal.color;

                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col1+'"></span>私募基金 ：'+ shu1+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col2+'"></span>线下资管 ：'+ shu2+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col3+'"></span>其他 ：'+ shu3+'%</br>';
                    str+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+col4+'"></span>'+nameFK+':' +shu4+danwei2+'</br>';
                    return str;
                }
            },
            legend: {
                data: dataLenged,
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
                    data :i ,
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
                },
                {
                    type: 'value',
                    name: danwei,
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
                     start: dataRangeStart,//窗口中数据显示的起始位置
                     end: dataRangeEnd,//窗口中数据显示的结束位置
                    height:14,//水平滚动条的高度
                   /* bottom:"3%"*/
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
                    name:'私募基金',
                    type:'bar',
                    data: a,
                    itemStyle:{
                        normal:{
                            color:"#ee7d2e"
                        }
                    },
                  /*  barWidth : 30,
                    barGap:'30%',*/
                    stack: '搜索引擎'
                },
                {
                    name:'线下资管',
                    type: 'bar',
                  /*  barGap:'30%',*/
                    data: b,
                    itemStyle:{
                        normal:{
                           /* color:"#3233ff",*/
                            color:"#f684ef"
                        }
                    },
                    stack: '搜索引擎'
                },
                {
                    name:'其他',
                    type:'bar',

                    data: c,
                    itemStyle:{
                        normal:{/* barGap:'30%',*/
                            color:"#2BE1CF"
                        }
                    },
                    stack: '搜索引擎'
                },
                {
                    name:dataLenged[dataLenged.length-1],
                    type:'line',
                    yAxisIndex: 1,
                    data: h,
                    itemStyle:{
                        normal:{
                          /*  color:"#f684ef"*/
                            color:"red"
                        }
                    },
                   /* stack: '搜索引擎'*/
                }
            ]
        };

        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    };

   /* 此处是累计开户数的图表*/
    function userCondition(obj){

        var myChart = echarts.init(document.getElementById('account'));
        var option = {
            tooltip: {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            legend: {
                data:['累计开户数'],
                itemWidth:15,
                itemHeight:10,
                /*selectedMode:false,*/
                textStyle:{
                    fontSize: 10,
                    color: '#929292'
                },
                bottom:'2%'
            },
            grid: {
                top:'15%',
                bottom:'15%',
                left: '3%',
                right: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: obj.date_list,
                axisTick:{
                    show:false
                },
                axisLine:{
                    show:false
                }
            },
            yAxis: {
                name:'(人数)',
                type: 'value',
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
                    formatter:'{value}'
                }
            },
            dataZoom: [
                {
                    show:false,//水平滚动条显示或隐藏
                   /* start: dataRangeStart,//窗口中数据显示的起始位置
                    end: dataRangeEnd,//窗口中数据显示的结束位置*/
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
            series: [
                {
                    name: '累计开户数',
                    type: 'line',
                    smooth: true,
                    data: obj.acc_num_list,
                    itemStyle:{
                        normal:{
                            color:"#7fbfea"
                        }
                    }
                }]
        };
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };

    //指标说明弹框
    tipsExplain();
    function tipsExplain(){
        //核心数据指标说明
        $$("#userQues").on("click",function(){
            $$("#userQuesBox").show();
            //弹框出现时页面禁止滚动
            $$(".mui-content").css({
                "width":"100%",
                "height":"100%"
            })
            $$(".mui-content")[0].style.overflow = 'hidden';

            document.body.style.overflow = 'hidden';
        });
        $$("#userClose").on("click",function(){
            $$("#userQuesBox").hide();
            //弹框关闭时页面恢复滚动
            $$(".mui-content").css({
                "width":"initial",
                "height":"initial"
            })
            $$(".mui-content")[0].style.overflow = 'scroll';
            document.body.style.overflow = 'scroll';
        });
        //交易分析指标说明
        $$("#userQuesJY").on("click",function(){

            $$("#userQuesBox2").show();
            //弹框出现时页面禁止滚动
            $$(".mui-content").css({
                "width":"100%",
                "height":"100%"
            })
            $$(".mui-content")[0].style.overflow = 'hidden';

            document.body.style.overflow = 'hidden';
        });
        $$("#userClose2").on("click",function(){
            $$("#userQuesBox2").hide();
            //弹框关闭时页面恢复滚动
            $$(".mui-content").css({
                "width":"initial",
                "height":"initial"
            })
            $$(".mui-content")[0].style.overflow = 'scroll';
            document.body.style.overflow = 'scroll';
        });
        //累计开户数指标说明
        $$("#userQuesLJ").on("click",function(){

            $$("#userQuesBox3").show();
            //弹框出现时页面禁止滚动
            $$(".mui-content").css({
                "width":"100%",
                "height":"100%"
            })
            $$(".mui-content")[0].style.overflow = 'hidden';

            document.body.style.overflow = 'hidden';
        });
        $$("#userClose3").on("click",function(){
            $$("#userQuesBox3").hide();
            //弹框关闭时页面恢复滚动
            $$(".mui-content").css({
                "width":"initial",
                "height":"initial"
            })
            $$(".mui-content")[0].style.overflow = 'scroll';
            document.body.style.overflow = 'scroll';
        });
    }
    var  myvue=new Vue() ;//借助第三方vue用来传值
    function centerDataAll(obj){
        //请求成功后传递数据
        myvue.$emit('getCenterdata',obj);
    }
    /*核心数据的数据处理部分*/
    new Vue({
        el: '#centerData',
        data: {
            kpiBig: '',
            kpiSmall: '',
            Data: '',
            comBig: '',
            comSmall: '',
            huBig:'',
            huSmall:'',
            onlineprice:'',
            outlineprice:'',
            onlinenum:'',
            outlinenum:'',
        },
        mounted: function(){
            var that = this;
            myvue.$on('getCenterdata', function(obj){
                that.Data=obj;
                that.getNumDay();
            })
        },
        methods:{
            getNumDay: function(){
                //总交易金额
                var itemValue = this.Data.total_deal_amt.toString();//获取kpi金额格式化后的值
                //console.log( itemValue);
                if(itemValue.indexOf('.')!=-1){
                    this.kpiBig = toThousands(itemValue.slice(0,itemValue.indexOf('.')));//截取小数点以前的金额
                    //this.kpiBig = itemValue.slice(0,itemValue.indexOf('.'));//截取小数点以前的金额
                    this.kpiSmall = itemValue.slice(itemValue.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.kpiBig =toThousands(itemValue) ;
                    this.kpiSmall ="";
                }
                //总交易单数
                var realCom = this.Data.total_deal_order_num.toString();//获取总通过率格式化后的值
                if(realCom.indexOf('.')!=-1){
                    this.comBig = toThousands(realCom.slice(0,realCom.indexOf('.')));//截取小数点以前的金额
                    this.comSmall = realCom.slice(realCom.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.comBig = toThousands(realCom);
                    this.comSmall ="";
                }
                //总交易账户数
                var itemZhanghu = this.Data.total_deal_acc_num.toString();//获取kpi金额格式化后的值
                //console.log( itemValue);
                if(itemZhanghu.indexOf('.')!=-1){
                    this.huBig = toThousands(itemZhanghu.slice(0,itemZhanghu.indexOf('.')));//截取小数点以前的金额
                    this.huSmall = itemZhanghu.slice(itemZhanghu.indexOf('.'));//截取小数点以后的金额
                }else{
                    this.huBig = toThousands(itemZhanghu);
                    this.huSmall ="";
                };
                var itemonlineprice=this.Data.online_deal_amt.toString();
                this.onlineprice=toThousands(itemonlineprice);
                var itemoutlineprice=this.Data.offline_deal_amt.toString();
                this.outlineprice=toThousands(itemoutlineprice);

                var itemonlinenum=this.Data.online_deal_order_num.toString();
                this.onlinenum=toThousands(itemonlinenum);

                var itemoutlinenum=this.Data.offline_deal_order_num.toString();
                this.outlinenum=toThousands(itemoutlinenum);

            }
        }
    });


    //日期选择  核心数据
    dateSelect();
    function dateSelect(){
        var btns = $('.btn');
        btns.each(function(i, btn) {
            btn.addEventListener('tap', function() {
                var dateOptions;
                switch(i)
                {
                    case 0:
                        //日数据
                        dateOptions={
                            type: "date",
                            beginDate: new Date("2016-07-08"),
                            endDate: new Date(beforeToday)
                        };
                        break;
                    case 1:
                        //月数据
                        dateOptions={
                            type: "month",
                            beginDate: new Date("2016-07-08"),
                            endDate: new Date(beforeToday)
                        };
                        break;
                    case 2:
                        dateOptions={
                         type: "year",
                         beginDate: new Date("2016-07-08"),
                         endDate: new Date(beforeToday)
                         }
                        break;
                    case 3:
                        dateOptions={
                         type: "date",
                         beginDate: new Date("2016-07-08"),
                         endDate: new Date(beforeToday)
                         }
                        break;
                    case 4:
                        dateOptions={
                         type: "date",
                         beginDate: new Date("2016-07-08"),
                         endDate: new Date(beforeToday)
                         }
                        break;
                    case 5:
                        dateOptions={
                         type: "date",
                         beginDate: new Date("2016-07-08"),
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
                            askForDataCenter('#calendarsRi',1,globalObjCenter5);
                            break;
                        case 1:
                            askForDataCenter('#calendarsYue',2,globalObjCenter6);
                            break;
                        case 2:
                            askForDataCenter('#calendarsNian',3,globalObjCenter7);
                            break;
                        case 3:
                            publickbusy1();
                            break;
                        case 4:
                            publickbusy2();
                            break;
                        case 5:
                            var date=$$('#calendarsLJ').val();
                            Cumulative(date,globalObjLJ2);
                            break;

                    }

                    picker.dispose();
                });
            }, false);
        });
    }
    function toThousands(num) {
        num=parseFloat(Number(num).toFixed(2)).toString();
        var reg=num.indexOf('.') >-1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;//千分符的正则
        num=num.replace(reg, '$1,');
        return num;
    }
})(mui,jQuery,document,window.biMobile);