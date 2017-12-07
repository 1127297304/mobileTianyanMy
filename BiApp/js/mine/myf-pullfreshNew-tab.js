/**
 * Created by Administrator on 2017/9/25.
 */
;(function($,$$,doc){
    $.init({
        swipeBack: false//关闭右滑关闭功能
    });
    //给所有的tab标签添加局部滚动
    mui('.mui-scroll-wrapper').scroll();
    var globalObj,globalObj2,globalObj3,globalObj4,globalObj5,globalObj6,globalObj7,globalObj8,globalObj9,globalObj10,globalObj11,globalObj12,globalObj13,globalObj14,globalObj15,globalObj16,globalObj17,globalObj18,globalObj19,globalObj20,globalObj21,globalObj22,globalObj23,globalObj24,globalObj25,globalObj26,globalObj27,globalObj28,globalObj29,globalObj30,globalObj31,globalObj32,globalObj33,globalObj34,globalObj35,globalObj36,globalObj37,globalObj38,globalObj39,globalObj40,globalObj41,globalObj42,globalObj43;
    var showTime,showTime2,showTime3,showTime4,showTime5,showTime6,showTime7,showTime8,showTime9,showTime10,showTime11,showTime12,showTime13,showTime14,showTime15,showTime16,showTime17,showTime18,showTime19,showTime20,showTime21;//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
    var	onlyYMDate;//只有年-月-日的日期格式

    //页面初始请求数据（传参：请求时的时间）
    sendDataTime();
    //页面初始请求数据
    function sendDataTime(){
        //获取当前时间
        onlyYMDate= GetDateStr(0);
        //获取当前前一天的日期
        rtDayBefore = GetDateStr(-1);
        showTime = showTime4=showTime7=showTime10=showTime13=showTime16=showTime19=rtDayBefore;//未选择符合范围内的日期时	默认存储当前前一天的日期
        showTime2 =showTime3=showTime5=showTime6=showTime8=showTime9=showTime11=showTime12=showTime14=showTime15=showTime17=showTime18=showTime20=showTime21= '-';//未选择符合范围内的日期时	默认存储当前前一天的日期

        //showTime3 =showTime4 =showTime5 =showTime6 =showTime7 =showTime8 =showTime9 =showTime10 =showTime11 =showTime12 =showTime13 =showTime14 =showTime15 =showTime16 =showTime17 =showTime18 = rtDayBefore;//未选择符合范围内的日期时	默认存储当前前一天的日期
        //获取当前的时间请求数据
        askForDataNow();
    };
    //计算当日前一天的方法
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return (m<10 ? "0"+m : m)+"-"+(d<10 ? "0"+d : d);
    };
    /*此处是获取系统分析和核心流程数据的页面接口*/
    function askForDataNow(){
        $$.ajaxData({
            newUrl:"/meiyifen/realtime.gm",
            data:{
                rdate:onlyYMDate
            },
            callback:function(data){
                //遮罩消失  调到数据，则遮罩消失
                $$('.mask').css('display','none');
                globalObj=data.data.datainfo;
                $$("#showNowDate").text(data.data.datainfo.realtime);//此处是顶部时间
                /*此处是系统分析的调用 */
                var curInd = $$(".firstCont .active").index();
                switch(curInd){
                    case 0:
                        xtfxSHU(globalObj.sysAnalysis.prod_all);
                        break;
                    case 1:
                        xtfxSHU(globalObj.sysAnalysis.prod_3c);
                        break;
                    case 2:
                        xtfxSHU(globalObj.sysAnalysis.prod_cross);
                        break;
                    case 3:
                        xtfxSHU(globalObj.sysAnalysis.prod_month);
                        break;
                    case 4:
                        xtfxSHU(globalObj.sysAnalysis.prod_accumu);
                        break;
                    case 5:
                        xtfxSHU(globalObj.sysAnalysis.prod_mobile_lease);
                        break;
                    case 6:
                        xtfxSHU(globalObj.sysAnalysis.prod_edu);
                        break;
                };
                /*此处是核心流程的调用*/
                var curIndSecond = $$(".secondCont .active").index();
                switch(curIndSecond){
                    case 0:
                        hxlcTU(globalObj.coreFlow.prod_all);
                        break;
                    case 1:
                        hxlcTU(globalObj.coreFlow.prod_3c);
                        break;
                    case 2:
                        hxlcTU(globalObj.coreFlow.prod_cross);
                        break;
                    case 3:
                        hxlcTU(globalObj.coreFlow.prod_month);
                        break;
                    case 4:
                        hxlcTU(globalObj.coreFlow.prod_accumu);
                        break;
                    case 5:
                        hxlcTU(globalObj.coreFlow.prod_mobile_lease);
                        break;
                    case 6:
                        hxlcTU(globalObj.coreFlow.prod_edu);
                        break;
                };

            }
        });
    };
    /*此处是初始化每个渠道的第一个日期*/
    $$('#calendars2').val(rtDayBefore);
    $$('#calendars3').val(rtDayBefore);
    $$('#calendars4').val(rtDayBefore);
    $$('#calendars5').val(rtDayBefore);
    $$('#calendars6').val(rtDayBefore);
    $$('#calendars7').val(rtDayBefore);
     function shiduanAll(a,b,c,d,e){
         var dataValue=document.getElementById(a).getAttribute('data-value');
         var qushiData;
         var addYear = new Date().getFullYear()+'-';
         var postDate=addYear + rtDayBefore;
         var postDate2=$$(c).val();
         var postDate3=$$(d).val();
         publicSdqu1();
         var sendDay2, sendDay3, legend2, legend3;
         if(postDate2 == "-"){
             sendDay2 = "";
             legend2 = "";
         }else{
             sendDay2 = addYear+postDate2;
             legend2 = postDate2;
         }
         if(postDate3 == "-"){
             sendDay3 = "";
             legend3 = "";
         }else{
             sendDay3 = addYear+postDate3;
             legend3 = postDate3;
         }
         $$(b).val(rtDayBefore);
         var curInd3 = $$(".thirdCont .active").index();
         switch(curInd3){
             case 0:
                 qushiData="110110";
                 break;
             case 1:
                 qushiData="1000001";
                 break;
             case 2:
                 qushiData="6660";
                 break;
             case 3:
                 qushiData="6680";
                 break;
             case 4:
                 qushiData="6670";
                 break;
             case 5:
                 qushiData="6605";
                 break;
             case 6:
                 qushiData="1000002";
                 break;
         };
         $$.ajaxData({
             newUrl:'/meiyifen/realtime/trend.gm',
             data:{
                 product_type:qushiData,
                 date1:postDate,
                 date2:sendDay2,
                 date3:sendDay3,
                 index_type:dataValue,
                 time_type:'c'
             },
             callback:function(data){
                 e=data.data.datainfo;
                 publicSdqu2();
                 /*userCondition(e,rtDayBefore,legend2,legend3);*/
                 if(legend2 == "" && legend3!="") {
                     userCondition(e,rtDayBefore,legend3,legend2);
                 }else{
                     userCondition(e,rtDayBefore,legend2,legend3);
                 }

             }
         });
     };
    askForTimeTrend();
    function askForTimeTrend(){
        var curInd = $$(".thirdCont .active").index();//获取当前点击的索引
        switch(curInd){
            case 0:
                shiduanAll('userResult','#calendars','#calendarsTwo','#calendarsThree',globalObj2);
                break;
            case 1:
                shiduanAll('userResult2','#calendars2','#calendarsTwo2','#calendarsThree2',globalObj32);
                break;
            case 2:
                shiduanAll('userResult3','#calendars3','#calendarsTwo3','#calendarsThree3',globalObj33);
                break;
            case 3:
                shiduanAll('userResult4','#calendars4','#calendarsTwo4','#calendarsThree4',globalObj34);
                break;
            case 4:
                shiduanAll('userResult5','#calendars5','#calendarsTwo5','#calendarsThree5',globalObj35);
                break;
            case 5:
                shiduanAll('userResult7','#calendars7','#calendarsTwo7','#calendarsThree7',globalObj43);
                break;
            case 6:
                shiduanAll('userResult6','#calendars6','#calendarsTwo6','#calendarsThree6',globalObj36);
                break;
        };

    };
    tabChangeFirst();//第一个选项卡调用
    tabChangeSecond();//第二个选项卡调用
    tabChangeThird();//第三个选项卡调用
    tipsExplain();
    /*此处是系统分析的选项卡部分*/
    function tabChangeFirst(){
        var parentBox=$$('.firstCont .tableTitle');
        var subItem=parentBox.find('a');
        subItem.on('tap',function(){
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            var curInd = $$(this).index();//获取当前点击的索引
            switch(curInd){
                case 0:
                    xtfxSHU(globalObj.sysAnalysis.prod_all);
                    break;
                case 1:
                    xtfxSHU(globalObj.sysAnalysis.prod_3c);
                    break;
                case 2:
                    xtfxSHU(globalObj.sysAnalysis.prod_cross);
                    break;
                case 3:
                    xtfxSHU(globalObj.sysAnalysis.prod_month);
                    break;
                case 4:
                    xtfxSHU(globalObj.sysAnalysis.prod_accumu);
                    break;
                case 5:
                    xtfxSHU(globalObj.sysAnalysis.prod_mobile_lease);
                    break;
                case 6:
                    xtfxSHU(globalObj.sysAnalysis.prod_edu);
                    break;
            };

        });
    };
   /* 此处是核心流程的选项卡部分*/
    function tabChangeSecond(){
        var parentBox=$$('.secondCont .tableTitle');
        var subItem=parentBox.find('a');
        subItem.on('tap',function(){
            $$(this).addClass('active').siblings('a').removeClass('active mui-active');
            var curInd = $$(this).index();//获取当前点击的索引
            switch(curInd){
                case 0:
                    hxlcTU(globalObj.coreFlow.prod_all);
                    break;
                case 1:
                    hxlcTU(globalObj.coreFlow.prod_3c);
                    break;
                case 2:
                    hxlcTU(globalObj.coreFlow.prod_cross);
                    break;
                case 3:
                    hxlcTU(globalObj.coreFlow.prod_month);
                    break;
                case 4:
                    hxlcTU(globalObj.coreFlow.prod_accumu);
                    break;
                case 5:
                    hxlcTU(globalObj.coreFlow.prod_mobile_lease);
                    break;
                case 6:
                    hxlcTU(globalObj.coreFlow.prod_edu);
                    break;
            };
        });
    };

    /*此处是时段趋势的选项卡部分*/
    function tabChangeThird(){
        var parentBox=$$('.thirdCont .tableTitle');
        var subItem=parentBox.find('a');
        subItem.on('tap',function(){
            $$(this).addClass('active').siblings('a').removeClass('active mui-active');
            var curInd = $$(this).index();//获取当前点击的索引
            $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").removeClass('off').addClass("show").siblings().addClass('off').removeClass('show');
            switch(curInd){
                case 0:
                    publicSdqu1();
                    var postDate=$$('#calendars').val();
                    var postDate2=$$('#calendarsTwo').val();
                    var postDate3=$$('#calendarsThree').val();
                    var addYear = new Date().getFullYear()+'-';
                    var dataValue=document.getElementById('userResult').getAttribute('data-value');
                    var sendDate2, sendDate3, legend2, legend3;
                    if(postDate2 == "-"){
                        sendDate2 = "";
                        legend2 = "";
                    }else{
                        sendDate2 = addYear+postDate2;
                        legend2 = postDate2;
                    }
                    if(postDate3 == "-"){
                        sendDate3 = "";
                        legend3 = "";
                    }else{
                        sendDate3 = addYear+postDate3;
                        legend3 = postDate3;
                    }
                    $$.ajaxData({
                        newUrl:'/meiyifen/realtime/trend.gm',
                        data:{
                            product_type:'110110',
                            date1:addYear+postDate,
                            date2:sendDate2,
                            date3:sendDate3,
                            index_type:dataValue,
                            time_type:'c'
                        },
                        callback:function(data){
                            globalObj7=data.data.datainfo;
                            publicSdqu2();
                            /*userCondition(globalObj7, postDate, legend2, legend3);*/
                            if(legend2 == "" && legend3!="") {
                                userCondition(globalObj7, postDate, legend3, legend2);
                            }else{
                                userCondition(globalObj7, postDate, legend2, legend3);
                            }
                        }
                    });
                    break;
                case 1:
                    publicSdqu1();
                   /* $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").removeClass('off').addClass("show").siblings().addClass('off').removeClass('show');*/
                    var postDate=$$('#calendars2').val();
                    var postDate2=$$('#calendarsTwo2').val();
                    var postDate3=$$('#calendarsThree2').val();
                    var addYear = new Date().getFullYear()+'-';
                    var dataValue=document.getElementById('userResult2').getAttribute('data-value');
                    var sendDate2, sendDate3, legend2, legend3;
                    if(postDate2 == "-"){
                        sendDate2 = "";
                        legend2 = "";
                    }else{
                        sendDate2 = addYear+postDate2;
                        legend2 = postDate2;
                    }
                    if(postDate3 == "-"){
                        sendDate3 = "";
                        legend3 = "";
                    }else{
                        sendDate3 = addYear+postDate3;
                        legend3 = postDate3;
                    }
                    $$.ajaxData({
                        newUrl:'/meiyifen/realtime/trend.gm',
                        data:{
                            product_type:'1000001',
                            date1:addYear+postDate,
                            date2:sendDate2,
                            date3:sendDate3,
                            index_type:dataValue,
                            time_type:'c'
                        },
                        callback:function(data){
                            globalObj37=data.data.datainfo;
                            publicSdqu2();
                            /*userCondition(globalObj7,postDate,legend2,legend3);*/
                            if(legend2 == "" && legend3!="") {
                                userCondition(globalObj37,postDate,legend3,legend2);
                            }else{
                                userCondition(globalObj37,postDate,legend2,legend3);
                            }

                        }
                    });
                    break;

                case 2:
                    publicSdqu1();
                    //$$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").removeClass('off').addClass("show").siblings().addClass('off').removeClass('show');
                    var postDate=$$('#calendars4').val();
                    var postDate2=$$('#calendarsTwo4').val();
                    var postDate3=$$('#calendarsThree4').val();
                    var addYear = new Date().getFullYear()+'-';
                    var dataValue=document.getElementById('userResult4').getAttribute('data-value');
                    var sendDate2, sendDate3, legend2, legend3;
                    if(postDate2 == "-"){
                        sendDate2 = "";
                        legend2 = "";
                    }else{
                        sendDate2 = addYear+postDate2;
                        legend2 = postDate2;
                    }
                    if(postDate3 == "-"){
                        sendDate3 = "";
                        legend3 = "";
                    }else{
                        sendDate3 = addYear+postDate3;
                        legend3 = postDate3;
                    }
                    $$.ajaxData({
                        newUrl:'/meiyifen/realtime/trend.gm',
                        data:{
                            product_type:'6660',
                            date1:addYear+postDate,
                            date2:sendDate2,
                            date3:sendDate3,
                            index_type:dataValue,
                            time_type:'c'
                        },
                        callback:function(data){
                            globalObj9=data.data.datainfo;
                            publicSdqu2();
                           /* userCondition(globalObj9,postDate,legend2,legend3);*/
                            if(legend2 == "" && legend3!="") {
                                userCondition(globalObj9,postDate,legend3,legend2);
                            }else{
                                userCondition(globalObj9,postDate,legend2,legend3);
                            }
                        }
                    });
                    break;
                case 3:
                    publicSdqu1();
                    //$$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").removeClass('off').addClass("show").siblings().addClass('off').removeClass('show');
                    var postDate=$$('#calendars5').val();
                    var postDate2=$$('#calendarsTwo5').val();
                    var postDate3=$$('#calendarsThree5').val();
                    var addYear = new Date().getFullYear()+'-';
                    var dataValue=document.getElementById('userResult5').getAttribute('data-value');
                    var sendDate2, sendDate3, legend2, legend3;
                    if(postDate2 == "-"){
                        sendDate2 = "";
                        legend2 = "";
                    }else{
                        sendDate2 = addYear+postDate2;
                        legend2 = postDate2;
                    }
                    if(postDate3 == "-"){
                        sendDate3 = "";
                        legend3 = "";
                    }else{
                        sendDate3 = addYear+postDate3;
                        legend3 = postDate3;
                    }
                    $$.ajaxData({
                        newUrl:'/meiyifen/realtime/trend.gm',
                        data:{
                            product_type:'6680',
                            date1:addYear+postDate,
                            date2:sendDate2,
                            date3:sendDate3,
                            index_type:dataValue,
                            time_type:'c'
                        },
                        callback:function(data){
                            globalObj10=data.data.datainfo;
                            publicSdqu2();
                            /*userCondition(globalObj10,postDate,legend2,legend3);*/
                            if(legend2 == "" && legend3!="") {
                                userCondition(globalObj10,postDate,legend3,legend2);
                            }else{
                                userCondition(globalObj10,postDate,legend2,legend3);
                            }
                        }
                    });
                    break;
                case 4:
                    publicSdqu1();
                   // $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").removeClass('off').addClass("show").siblings().addClass('off').removeClass('show');
                    var postDate=$$('#calendars6').val();
                    var postDate2=$$('#calendarsTwo6').val();
                    var postDate3=$$('#calendarsThree6').val();
                    var addYear = new Date().getFullYear()+'-';
                    var dataValue=document.getElementById('userResult6').getAttribute('data-value');
                    var sendDate2, sendDate3, legend2, legend3;
                    if(postDate2 == "-"){
                        sendDate2 = "";
                        legend2 = "";
                    }else{
                        sendDate2 = addYear+postDate2;
                        legend2 = postDate2;
                    }
                    if(postDate3 == "-"){
                        sendDate3 = "";
                        legend3 = "";
                    }else{
                        sendDate3 = addYear+postDate3;
                        legend3 = postDate3;
                    }
                    $$.ajaxData({
                        newUrl:'/meiyifen/realtime/trend.gm',
                        data:{
                            product_type:'6670',
                            date1:addYear+postDate,
                            date2:sendDate2,
                            date3:sendDate3,
                            index_type:dataValue,
                            time_type:'c'
                        },
                        callback:function(data){
                            globalObj11=data.data.datainfo;
                            publicSdqu2();
                           /* userCondition(globalObj11,postDate,legend2,legend3);*/
                            if(legend2 == "" && legend3!="") {
                                userCondition(globalObj11,postDate,legend3,legend2);
                            }else{
                                userCondition(globalObj11,postDate,legend2,legend3);
                            }
                        }
                    });
                    break;
                case 5:
                    publicSdqu1();
                    // $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").removeClass('off').addClass("show").siblings().addClass('off').removeClass('show');
                    var postDate=$$('#calendars7').val();
                    var postDate2=$$('#calendarsTwo7').val();
                    var postDate3=$$('#calendarsThree7').val();
                    var addYear = new Date().getFullYear()+'-';
                    var dataValue=document.getElementById('userResult7').getAttribute('data-value');
                    var sendDate2, sendDate3, legend2, legend3;
                    if(postDate2 == "-"){
                        sendDate2 = "";
                        legend2 = "";
                    }else{
                        sendDate2 = addYear+postDate2;
                        legend2 = postDate2;
                    }
                    if(postDate3 == "-"){
                        sendDate3 = "";
                        legend3 = "";
                    }else{
                        sendDate3 = addYear+postDate3;
                        legend3 = postDate3;
                    }
                    $$.ajaxData({
                        newUrl:'/meiyifen/realtime/trend.gm',
                        data:{
                            product_type:'6605',
                            date1:addYear+postDate,
                            date2:sendDate2,
                            date3:sendDate3,
                            index_type:dataValue,
                            time_type:'c'
                        },
                        callback:function(data){
                            globalObj38=data.data.datainfo;
                            publicSdqu2();
                            /*userCondition(globalObj8,postDate,legend2,legend3);*/
                            if(legend2 == "" && legend3!="") {
                                userCondition(globalObj38,postDate,legend3,legend2);
                            }else{
                                userCondition(globalObj38,postDate,legend2,legend3);
                            }
                        }
                    });
                    break;
                case 6:
                    publicSdqu1();
                    // $$(".thirdCont .tabBlockDetail>div:eq("+curInd+")").removeClass('off').addClass("show").siblings().addClass('off').removeClass('show');
                    var postDate=$$('#calendars3').val();
                    var postDate2=$$('#calendarsTwo3').val();
                    var postDate3=$$('#calendarsThree3').val();
                    var addYear = new Date().getFullYear()+'-';
                    var dataValue=document.getElementById('userResult3').getAttribute('data-value');
                    var sendDate2, sendDate3, legend2, legend3;
                    if(postDate2 == "-"){
                        sendDate2 = "";
                        legend2 = "";
                    }else{
                        sendDate2 = addYear+postDate2;
                        legend2 = postDate2;
                    }
                    if(postDate3 == "-"){
                        sendDate3 = "";
                        legend3 = "";
                    }else{
                        sendDate3 = addYear+postDate3;
                        legend3 = postDate3;
                    }
                    $$.ajaxData({
                        newUrl:'/meiyifen/realtime/trend.gm',
                        data:{
                            product_type:'1000002',
                            date1:addYear+postDate,
                            date2:sendDate2,
                            date3:sendDate3,
                            index_type:dataValue,
                            time_type:'c'
                        },
                        callback:function(data){
                            globalObj8=data.data.datainfo;
                            publicSdqu2();
                            /*userCondition(globalObj8,postDate,legend2,legend3);*/
                            if(legend2 == "" && legend3!="") {
                                userCondition(globalObj8,postDate,legend3,legend2);
                            }else{
                                userCondition(globalObj8,postDate,legend2,legend3);
                            }
                        }
                    });
                    break;

            };
        })
    };
    /*此处是指标说明部分*/
    function tipsExplain() {
        //系统分析指标说明
        $$("#userQues").on("click",function(){
            $$("#sysQuesBox").show();
            //弹框出现时页面禁止滚动
            $$(".mui-content").css({
                "width":"100%",
                "height":"100%"
            })
            $$(".mui-content")[0].style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        });
        $$("#sysClose").on("click",function(){
            $$("#sysQuesBox").hide();
            //弹框关闭时页面恢复滚动
            $$(".mui-content").css({
                "width":"initial",
                "height":"initial"
            })
            $$(".mui-content")[0].style.overflow = 'scroll';
            document.body.style.overflow = 'scroll';
        });
        //核心流程指标说明
        $$("#centreQues").on("click", function () {
            $$("#centreQuesBox").show();
            //弹框出现时页面禁止滚动
            $$(".mui-content").css({
                "width": "100%",
                "height": "100%"
            })
            $$(".mui-content")[0].style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        });
        $$("#centreClose").on("click", function () {
            $$("#centreQuesBox").hide();
            //弹框关闭时页面恢复滚动
            $$(".mui-content").css({
                "width": "initial",
                "height": "initial"
            })
            $$(".mui-content")[0].style.overflow = 'scroll';
            document.body.style.overflow = 'scroll';
        });
        //时段趋势指标说明
        $$("#centreQues2").on("click", function () {
            $$("#sysQuesBox2").show();
            //弹框出现时页面禁止滚动
            $$(".mui-content").css({
                "width": "100%",
                "height": "100%"
            })
            $$(".mui-content")[0].style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        });
        $$("#sysClose2").on("click", function () {
            $$("#sysQuesBox2").hide();
            //弹框关闭时页面恢复滚动
            $$(".mui-content").css({
                "width": "initial",
                "height": "initial"
            })
            $$(".mui-content")[0].style.overflow = 'scroll';
            document.body.style.overflow = 'scroll';
        });
    };
    var myvue=new Vue();//借助第三方vue来传值
    /*此处是系统分析数据部分*/
    function xtfxSHU(obj){
        myvue.$emit('getdataXTFX',obj);
    };
    new Vue({
        el:'#xtfxsj',
        data:{
            Data:'',
        },
        mounted:function(){
            var that=this;
            myvue.$on("getdataXTFX",function(obj){
                that.Data=obj;
                that.getNumXtfx();
            })
        },
        methods:{
            getNumXtfx:function(){
                var itemValue=this.Data;
                this.$nextTick(function(){
                    var aSpan=document.querySelectorAll('.hbcL');
                    for(var i=0;i<aSpan.length;i++){
                        var oSpanInnerHtml=aSpan[i].innerHTML;
                        if(oSpanInnerHtml.indexOf('-')!=-1 && oSpanInnerHtml.indexOf('%')!=-1){
                            aSpan[i].style.color='#6be86a';
                        }else if((oSpanInnerHtml.indexOf('+')!=-1) && (oSpanInnerHtml.indexOf('%')!=-1)) {
                            aSpan[i].style.color='red';
                        }else{
                            aSpan[i].style.color='#000';
                        }
                    };
                });
            }
        }

    });
   /* 此处是核心流程数据部分*/
    function hxlcTU(obj){
        myvue.$emit('getdataLCT',obj);
    };
    new Vue({
        el:"#chart-container",
        data:{
            Data:""
        },
        mounted:function(){
            var that=this;
            myvue.$on('getdataLCT',function(obj){
                that.Data=obj;
                that.getNumLct();
            })
        },
        methods:{
            getNumLct:function(){
                var itemValue=this.Data;
                this.$nextTick(function(){
                    var aSpan=document.querySelectorAll('.hbcL');
                    for(var i=0;i<aSpan.length;i++){
                        var oSpanInnerHtml=aSpan[i].innerHTML;
                        if(oSpanInnerHtml.indexOf('-')!=-1 && oSpanInnerHtml.indexOf('%')!=-1){
                            aSpan[i].style.color='#6be86a';
                        }else if((oSpanInnerHtml.indexOf('+')!=-1) && (oSpanInnerHtml.indexOf('%')!=-1)) {
                            aSpan[i].style.color='red';
                        }else{
                            aSpan[i].style.color='#000';
                        }
                    };
                });
            }
        }
    });

    /*此处是时段趋势的数据部分*/
    var DataAll=[{
        value: '010',
        text: '注册人数'
    }, {
        value: '020',
        text: '进件件数'
    }, {
        value: '030',
        text: '信审通过件数'
    }, {
        value: '040',
        text: '放款件数'
    }, {
        value: '050',
        text: '放款金额(万)'
    }];
    var DataSmall=[ {
        value: '020',
        text: '进件件数'
    }, {
        value: '030',
        text: '信审通过件数'
    }, {
        value: '040',
        text: '放款件数'
    }, {
        value: '050',
        text: '放款金额(万)'
    }];
    /*此处是趋势图指标筛选部分  1*/
    sdqsCh('#calendars','#calendarsTwo','#calendarsThree',DataAll,'showUserPicker','userResult',globalObj3);
    /*此处是趋势图指标筛选部分  2*/
    sdqsCh('#calendars2','#calendarsTwo2','#calendarsThree2',DataSmall,'showUserPicker2','userResult2',globalObj12);
    /*此处是趋势图指标筛选部分  3*/
    sdqsCh('#calendars3','#calendarsTwo3','#calendarsThree3',DataSmall,'showUserPicker3','userResult3',globalObj13);
    /*此处是趋势图指标筛选部分  4*/
    sdqsCh('#calendars4','#calendarsTwo4','#calendarsThree4',DataSmall,'showUserPicker4','userResult4',globalObj14);
    /*此处是趋势图指标筛选部分  5*/
    sdqsCh('#calendars5','#calendarsTwo5','#calendarsThree5',DataSmall,'showUserPicker5','userResult5',globalObj15);
    /*此处是趋势图指标筛选部分  6*/
    sdqsCh('#calendars6','#calendarsTwo6','#calendarsThree6',DataSmall,'showUserPicker6','userResult6',globalObj16);
    /*此处是趋势图指标筛选部分  7*/
    sdqsCh('#calendars7','#calendarsTwo7','#calendarsThree7',DataSmall,'showUserPicker7','userResult7',globalObj42);
    function sdqsCh(e,f,g,a,b,c,d){
        var userPicker = new $.PopPicker({
            layer: 1
        });
        var data=a;
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById(b);
        var userResult = doc.getElementById(c);
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                publicSdqu1();
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;//此处是用户指标筛选
                var qushiData;
                var postDate=$$(e).val();
                var postDate2=$$(f).val();
                var postDate3=$$(g).val();
                var addYear = new Date().getFullYear()+'-';
                var curInd3 = $$(".thirdCont .active").index();
                switch(curInd3){
                    case 0:
                        qushiData="110110";
                        break;
                    case 1:
                        qushiData="1000001";
                        break;
                    case 2:
                        qushiData="6660";
                        break;
                    case 3:
                        qushiData="6680";
                        break;
                    case 4:
                        qushiData="6670";
                        break;
                    case 5:
                        qushiData="6605";
                        break;
                    case 6:
                        qushiData="1000002";
                        break;
                };
                userResult.setAttribute('data-value',dataValue);
                var sendDate2, sendDate3, legend2, legend3;
                if(postDate2 == "-"){
                    sendDate2 = "";
                    legend2 = "";
                }else{
                    sendDate2 = addYear+postDate2;
                    legend2 = postDate2;
                }
                if(postDate3 == "-"){
                    sendDate3 = "";
                    legend3 = "";
                }else{
                    sendDate3 = addYear+postDate3;
                    legend3 = postDate3;
                }
                $$.ajaxData({
                    newUrl:'/meiyifen/realtime/trend.gm',
                    data:{
                        product_type:qushiData,
                        date1:addYear+postDate,
                        date2:sendDate2,
                        date3:sendDate3,
                        index_type:dataValue,
                        time_type:'c'
                    },
                    callback:function(data){
                        d=data.data.datainfo;
                        publicSdqu2();
                        /*userCondition(d,postDate,legend2,legend3);*/
                        if(legend2 == "" && legend3!="") {
                            userCondition(d,postDate,legend3,legend2);

                        }else{
                            userCondition(d,postDate,legend2,legend3);

                        }
                    }
                });
            });
        }, false);
    };
    /*此处是趋势图日期切换部分 1*/
    realTimeSelect('#calendars','#calendarsTwo','#calendarsThree','userResult',showTime,showTime2,showTime3,globalObj4,globalObj5,globalObj6);
    /*此处是趋势图日期切换部分 2*/
    realTimeSelect('#calendars2','#calendarsTwo2','#calendarsThree2','userResult2',showTime4,showTime5,showTime6,globalObj17,globalObj18,globalObj19);

    /*此处是趋势图日期切换部分 3*/
    realTimeSelect('#calendars3','#calendarsTwo3','#calendarsThree3','userResult3',showTime7,showTime8,showTime9,globalObj20,globalObj21,globalObj22);

    /*此处是趋势图日期切换部分 4*/
    realTimeSelect('#calendars4','#calendarsTwo4','#calendarsThree4','userResult4',showTime10,showTime11,showTime12,globalObj23,globalObj24,globalObj25);

    /*此处是趋势图日期切换部分 5*/
    realTimeSelect('#calendars5','#calendarsTwo5','#calendarsThree5','userResult5',showTime13,showTime14,showTime15,globalObj26,globalObj27,globalObj28);

    /*此处是趋势图日期切换部分 6*/
    realTimeSelect('#calendars6','#calendarsTwo6','#calendarsThree6','userResult6',showTime16,showTime17,showTime18,globalObj29,globalObj30,globalObj31);
    /*此处是趋势图日期切换部分 7*/
    realTimeSelect('#calendars7','#calendarsTwo7','#calendarsThree7','userResult7',showTime19,showTime20,showTime21,globalObj39,globalObj40,globalObj41);
   /* 时段趋势日期选择*/
    function realTimeSelect(a,b,c,d,e,f,g,h,i,j){
        $$(a).on("change",function(){
            publicSdqu1();
            var curDate = $$(this).val();
            var addYear = new Date().getFullYear()+'-';
            var postDate2=$$(b).val();
            var postDate3=$$(c).val();
            var dataValue=document.getElementById(d).getAttribute('data-value');
            var qushiData;
            var sendDate2, sendDate3, legend2, legend3;
            if(postDate2 == "-"){
                sendDate2 = "";
                legend2 = "";
            }else{
                sendDate2 = addYear+postDate2;
                legend2 = postDate2;
            }
            if(postDate3 == "-"){
                sendDate3 = "";
                legend3 = "";
            }else{
                sendDate3 = addYear+postDate3;
                legend3 = postDate3;
            }
            var curInd3 = $$(".thirdCont .active").index();
            switch(curInd3){
                case 0:
                    qushiData="110110";
                    break;
                case 1:
                    qushiData="1000001";
                    break;
                case 2:
                    qushiData="6660";
                    break;
                case 3:
                    qushiData="6680";
                    break;
                case 4:
                    qushiData="6670";
                    break;
                case 5:
                    qushiData="6605";
                    break;
                case 6:
                    qushiData="1000002";
                    break;
            };
            //在此获取选择的日期重新发送请求
            if((new Date(addYear+curDate) >= new Date("2016-11-10")) && (new Date(addYear+curDate) < new Date(addYear+onlyYMDate))){
                e = curDate;//当前页面显示的日期永远是符合时间范围内的日期
                $$.ajaxData({
                    newUrl:'/meiyifen/realtime/trend.gm',
                    data:{
                        product_type:qushiData,
                        date1:addYear+curDate,
                        date2:sendDate2,
                        date3:sendDate3,
                        index_type:dataValue,
                        time_type:'c'
                    },
                    callback:function(data){
                        h=data.data.datainfo;
                        publicSdqu2();
                        if(legend2 == "" && legend3!= "") {
                            userCondition(h, curDate, legend3, legend2);
                        }else{
                            userCondition(h, curDate, legend2, legend3);
                        }
                    }
                });
            }
            else{
                publicSdqu2();
                mui.toast('不在可支持的统计时间范围内');
                $$(this).val(e);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
            }
        });
        $$(b).on('change',function(){
            publicSdqu1();
            var addYear = new Date().getFullYear()+'-';
            var curDate = $$(this).val();
            var postDate=$$(a).val();
            var postDate3=$$(c).val();
            var dataValue=document.getElementById(d).getAttribute('data-value');
            var qushiData;
            var sendDate3, legend3;
            if(postDate3 == "-"){
                sendDate3 = "";
                legend3 = "";
            }else{
                sendDate3 = addYear+postDate3;
                legend3 = postDate3;
            }
            var curInd3 = $$(".thirdCont .active").index();
            switch(curInd3){
                case 0:
                    qushiData="110110";
                    break;
                case 1:
                    qushiData="1000001";
                    break;

                case 2:
                    qushiData="6660";
                    break;
                case 3:
                    qushiData="6680";
                    break;
                case 4:
                    qushiData="6670";
                    break;
                case 5:
                    qushiData="6605";
                    break;
                case 6:
                    qushiData="1000002";
                    break;
            };
            //在此获取选择的日期重新发送请求
            if((new Date(addYear+curDate) >= new Date("2016-11-10")) && (new Date(addYear+curDate) < new Date(addYear+onlyYMDate))){
                f = curDate;//当前页面显示的日期永远是符合时间范围内的日期
                $$.ajaxData({
                    newUrl:'/meiyifen/realtime/trend.gm',
                    data:{
                        product_type:qushiData,
                        date1:addYear+postDate,
                        date2:addYear+curDate,
                        date3:sendDate3,
                        index_type:dataValue,
                        time_type:'c'
                    },
                    callback:function(data){
                        i=data.data.datainfo;
                        publicSdqu2();
                        userCondition(i,postDate,curDate,legend3);
                    }
                });
            }
            else{
                publicSdqu2();
                mui.toast('不在可支持的统计时间范围内');
                $$(this).val(f);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
            }
        });
        $$(c).on('change',function(){
            publicSdqu1();
            var addYear = new Date().getFullYear()+'-';
            var curDate = $$(this).val();
            var postDate=$$(a).val();
            var postDate2=$$(b).val();
            var dataValue=document.getElementById(d).getAttribute('data-value');
            var qushiData;
            var sendDate2, legend2;
            if(postDate2 == "-"){
                sendDate2 = "";
                legend2 = "";
            }else{
                sendDate2 = addYear+postDate2;
                legend2 = postDate2;
            };
            var curInd3 = $$(".thirdCont .active").index();
            switch(curInd3){
                case 0:
                    qushiData="110110";
                    break;
                case 1:
                    qushiData="1000001";
                    break;
                case 2:
                    qushiData="6660";
                    break;
                case 3:
                    qushiData="6680";
                    break;
                case 4:
                    qushiData="6670";
                    break;
                case 5:
                    qushiData="6605";
                    break;
                case 6:
                    qushiData="1000002";
                    break;
            };
            //在此获取选择的日期重新发送请求
            if((new Date(addYear+curDate) >= new Date("2016-11-10")) && (new Date(addYear+curDate) < new Date(addYear+onlyYMDate))){
                g = curDate;//当前页面显示的日期永远是符合时间范围内的日期
                $$.ajaxData({
                    newUrl:'/meiyifen/realtime/trend.gm',
                    data:{
                        product_type:qushiData,
                        date1:addYear+postDate,
                        date2:sendDate2,
                        date3:addYear+curDate,
                        index_type:dataValue,
                        time_type:'c'
                    },
                    callback:function(data){
                        j=data.data.datainfo;
                        publicSdqu2();
                        if(legend2 == "") {
                            userCondition(j, postDate, legend2, curDate);
                        }else{
                            userCondition(j, postDate, legend2, curDate);
                        }
                    }
                });
            }
            else{
                publicSdqu2();
                mui.toast('不在可支持的统计时间范围内');
                $$(this).val(g);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
            }
        });

    };
        //时段趋势图表
    function userCondition(obj,rtDayBefore,dayTwo,dayThree){
        var itemNum = Math.floor(((obj.today_list.length)*1/288)*100);
        var dataRangeStart = itemNum-5;
        var dataRangeEnd = itemNum+2;
        var dayTwoOption, dayThreeOption;
        if(dayTwo == ""){
            dayTwoOption =[];
         }else{
            dayTwoOption = obj.other_day_list2;
         }
         if(dayThree == ""){
            dayThreeOption = [];
         }else{
            dayThreeOption = obj.other_day_list3;
         }

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('sdqs'));
        var option = {
            tooltip: {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            legend: {
                data:['今日',rtDayBefore,dayTwo,dayThree],
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
                data: obj.time_list,
                axisTick:{
                    show:false
                },
                axisLine:{
                    show:false
                }
            },
            yAxis: {
                type: 'value',
                //name:obj[0][3],
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
                    start: dataRangeStart,//窗口中数据显示的起始位置
                    end: dataRangeEnd,//窗口中数据显示的结束位置
                    height:14,//水平滚动条的高度
                    bottom:"3%",
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
                },
            ],
            series: [
                {
                    name: '今日',
                    type: 'line',
                    smooth: true,
                    data: obj.today_list,
                    itemStyle:{
                        normal:{
                            color:"#7fbfea"
                        }
                    }
                },
                {
                    name: rtDayBefore ,
                    type: 'line',
                    smooth: true,
                    data: obj.other_day_list1,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                type:'dotted'  //'dotted'虚线 'solid'实线
                            },
                            color:"#e73b83"
                        }
                    }
                },
                {
                    name: dayTwo ,
                    type: 'line',
                    smooth: true,
                    data: dayTwoOption,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                type:'dotted'  //'dotted'虚线 'solid'实线
                            },
                            color:"lightgreen"
                        }
                    }
                },
                {
                    name: dayThree ,
                    type: 'line',
                    smooth: true,
                    data: dayThreeOption,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                type:'dotted'  //'dotted'虚线 'solid'实线
                            },
                            color:"#FF9211"
                        }
                    }
                }],

        };
        var arr =option.legend.data;
        for(var i = arr.length - 1;  i >0; i--){
            if(arr[i] === ''){
                arr.splice(i, 1);
            }
        }
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    };

    /***********************************************下拉刷新************************************************/
    $$('.mui-content').dropload({
        scrollArea : window,
        domUp : {
            domClass   : 'dropload-up',
            domRefresh : '<div class="dropload-refresh">↓&nbsp;&nbsp;下拉刷新	ლ(⌒▽⌒ლ)</div>',
            domUpdate  : '<div class="dropload-update">↑&nbsp;&nbsp;释放更新	ᕙ(˵◕ω◕˵✿)つ</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...٩(◕‿◕｡)۶</div>'
        },
        loadUpFn : function(me){
            //获取当前的时间重新请求数据
            askForDataNow();
            //此处重新获取时段趋势的数据
            askForTimeTrend();
            me.resetload();
        },
        threshold : 50
    });
    /*************************************************下拉刷新结束***************************************************/


    function publicSdqu1(){
        $$('#sdqs1').removeClass('off').addClass('show');
        $$('#sdqs').removeClass('show').addClass('off');
    };
    function publicSdqu2(){
        $$('#sdqs1').removeClass('show').addClass('off');
        $$('#sdqs').removeClass('off').addClass('show');
    };


})(mui,jQuery,document);