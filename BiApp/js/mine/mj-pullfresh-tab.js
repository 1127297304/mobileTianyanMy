
;(function($,$$,doc){
    $.init({
        swipeBack: false//关闭右滑关闭功能
    });
    var globalObj,globalObj2,globalObj3,globalObj4,globalObj5,globalObj6,globalObj7,globalObj8,globalObj9,globalObj10,globalObj11,globalObj12,globalObj13,globalObj14;
    var	onlyYMDate;//只有年-月-日的日期格式
    var rtDayBefore;//当天的前一天
    var timerTop=null;//定时器
    var showTime, showTime2 ;//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
    //给所有的tab标签添加局部滚动
    mui('.mui-scroll-wrapper').scroll();
    //页面初始请求数据（传参：请求时的时间）
    sendDataTime();
    //页面初始请求数据
    function sendDataTime(){
        //获取当前时间
        onlyYMDate= GetDateStr(0);
        //获取当前前一天的日期
        rtDayBefore = GetDateStr(-1);
        showTime = rtDayBefore;//未选择符合范围内的日期时	默认存储当前前一天的日期
        showTime2= rtDayBefore;//未选择符合范围内的日期时	默认存储当前前一天的日期
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
        return y+"-"+(m<10 ? "0"+m : m)+"-"+(d<10 ? "0"+d : d);
    };
    //此处是系统分析切换时，筛选内容回到默认
    function PublickStyle(){
        $$("#userResult3").html("全部产品");
        $$("#userResult2").html("全部用户");
    };
    //此处是流程图切换时，筛选内容回到默认
    function PublickStyleLCT(){
        $$("#userResultLCTCP").html("全部产品");
        $$("#userResultLCTKH").html("全部用户");
    };
   /* 此处是获取后台数据的整体页面接口  ajax*/
    function askForDataNow(){
		if($$("#warnTips").length != 0){
			$$("#warnTips").remove();
		}
        //调用请求ajax的插件
        $$.ajaxData({
            newUrl:"/meijieRealTime/getMeiJieRealTimeRiskModel.gm",
            data:{
                rdate:onlyYMDate
            },
            callback:function(data){
                //遮罩消失
                $$('.mask').css('display','none');

                globalObj=data.data.datainfo;
                $$("#showNowDate").text(data.data.datainfo.rdate);
                var curIndOne = $$(".firstCont .active").index();
                switch(curIndOne){
                    case 0:
                        /*$$("#userResultItemyhZY").html("全部产品");*/
                        yhfxZY(globalObj.realTimeRiskUserAanlysis.realTimeRiskUserOwner.wholeProduct);
                        break;
                    case 1:
                        $$("#userResultItemyh").html("全部产品");
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.shanYinChannel.wholeProduct);
                        break;
                    case 2:
                        $$("#userResultItemyh").html("全部产品");
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.wacaiChannel.wholeProduct);
                        break;
                    case 3:
                        $$("#userResultItemyh").html("全部产品");
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.r360Channel.wholeProduct);
                        break;
                    case 4:
                        $$("#userResultItemyh").html("全部产品");
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.r51Channel.wholeProduct);
                        break;
                    case 5:
                        $$("#userResultItemyh").html("全部产品");
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.borrowChannel.wholeProduct);
                        break;
                    case 6:
                        $$("#userResultItemyh").html("全部产品");
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.bairongChannel.wholeProduct);
                        break;
                    case 7:
                        $$("#userResultItemyh").html("全部产品");
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.credit51Channel.wholeProduct);
                        break;
                    case 8:
                        $$("#userResultItemyh").html("全部产品");
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.jielemaChannel.wholeProduct);
                        break;
                    case 9:
                        $$("#userResultItemyh").html("全部产品");
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.shanyinzcChannel.wholeProduct);
                        break;

                };

                var curInd = $$(".secondCont .active").index();
                switch(curInd){
                    case 0:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.allSysChannel.allCustomAllProduct);
                        break;
                    case 1:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.ownerSysChannel.allCustomAllProduct);
                        break;
                    case 2:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.shanyinSysChannel.allCustomAllProduct);
                        break;
                    case 3:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.wacaiSysChannel.allCustomAllProduct);
                        break;
                    case 4:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.r360SysChannel.allCustomAllProduct);
                        break;
                    case 5:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.r51SysChannel.allCustomAllProduct);
                        break;
                    case 6:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.borrowChannel.allCustomAllProduct);
                        break;
                    case 7:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.bairongChannel.allCustomAllProduct);
                        break;
                    case 8:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.credit51Channel.allCustomAllProduct);
                        break;
                    case 9:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.jielemaChannel.allCustomAllProduct);
                        break;
                    case 10:
                        PublickStyle();
                        xtfxSHU(globalObj.realTimeRiskSysAnalysis.shanyinzcChannel.allCustomAllProduct);
                        break;

                };
                $$("#calendars").val(rtDayBefore);
                $$("#calendars2").val(rtDayBefore);
                /*此处是流程图调用*/
                var curIndForth = $$(".forthCont .active").index();
                switch(curIndForth){
                    case 0:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.allSysChannel.realTimeRiskCoreProcess);
                        break;
                    case 1:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.ownerSysChannel.realTimeRiskCoreProcess);
                        break;
                    case 2:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.shanyinSysChannel.realTimeRiskCoreProcess);
                        break;
                    case 3:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.wacaiSysChannel.realTimeRiskCoreProcess);
                        break;
                    case 4:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.r360SysChannel.realTimeRiskCoreProcess);
                        break;
                    case 5:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.r51SysChannel.realTimeRiskCoreProcess);
                        break;
                    case 6:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.borrowChannel.realTimeRiskCoreProcess);
                        break;
                    case 7:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.bairongChannel.realTimeRiskCoreProcess);
                        break;
                    case 8:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.credit51Channel.realTimeRiskCoreProcess);
                        break;
                    case 9:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.jielemaChannel.realTimeRiskCoreProcess);
                        break;
                    case 10:
                        PublickStyleLCT();
                        hxlcTU(globalObj.realTimeRiskCoreAnalysis.shanyinzcChannel.realTimeRiskCoreProcess);
                        break;
                };
                /*此处是预警数调用*/
                yjSHU(globalObj.realTimeRiskAlarm.realTimeRiskAlarmValuesList);
                if($$(".showRest").length != 0){
                	//默认流出资金的投资详情收起
					$$(".showRest").nextAll().hide();
					$$(".pullMore").removeClass("active");
                }
            }
        })
    };
    //此处是时段趋势的初始接口
    askForTimeTrend();
    function askForTimeTrend(){
        publicSdqu1();
        publicLjqu1();
        var dataValue=document.getElementById('userResult').getAttribute('data-value');
        var dataValue1=document.getElementById('userResult').getAttribute('data-value1');
        var dataValue2=document.getElementById('userResult').getAttribute('data-value2');
        var dataValue3=document.getElementById('userResult').getAttribute('data-value3');
        var qushiData;
        var curInd3 = $$(".thirdCont .active").index();
        switch(curInd3){
            case 0:
                qushiData="sdqs";
                break;
            case 1:
                qushiData="ljqs";
                break;
        };
        $$.ajaxData({
            newUrl:"/meijieRealTime/getMeiJieRealTimeRiskTrendModel.gm",
            data:{
                rdate: rtDayBefore,
                xxk:dataValue1,
                kh:dataValue3,
                cp:dataValue2,
                yhzb:dataValue,
                qstu:qushiData,
            },
            callback:function(data){
                globalObj8=data.data.datainfo;
                publicSdqu2();
                publicLjqu2();
                userCondition(globalObj8,rtDayBefore);
            }
        });
    };

    //此处是系统分析切换渠道时 调接口
    function AskForSisterm(a,b,c){
        $$.ajaxData({
            newUrl:"/meijieRealTime/getMeiJieRealTimeSysAnalysis.gm",
            data:{
                xxk:a,
                kh:b,
                cp:c,
            },
            callback:function(data){
                globalObj13=data.data.datainfo;
                xtfxSHU(globalObj13);
            }
        });
    };
    //此处是核心流程切换渠道时  调接口
    function AskForLiuCheng(a,b,c){
        $$.ajaxData({
            newUrl:"/meijieRealTime/getMeiJieRealTimeCoreAnalysis.gm",
            data:{
                xxk:a,
                kh:b,
                cp:c,
            },
            callback:function(data){
                globalObj14=data.data.datainfo;
                hxlcTU(globalObj14);
            }
        });
    };
    //firstCont选项卡切换
    tabChangeFirst();
    //secondCont选项卡切换
    tabChangeSecond();
    //thirdCont选项卡切换
    tabChangeThird();
    //forthCont选项卡切换
    tabChangeForth();
    //指标说明弹框
    tipsExplain();
   /* 第一个选项卡*/
    function tabChangeFirst(){
        var parentBox = $$(".firstCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            var curInd = $$(this).index();//获取当前点击的索引
            if(curInd==0){
                $$(".tabBlockDetail").removeClass("off").addClass("on");
                $$(".tabBlockDetailX").removeClass("on").addClass("off");
            }else if(curInd!=0){
                $$(".tabBlockDetailX").removeClass("off").addClass("on");
                $$(".tabBlockDetail").removeClass("on").addClass("off");
            };
            switch(curInd){
                case 0:
                    /*$$("#userResultItemyhZY").html("全部产品");*/
                    yhfxZY(globalObj.realTimeRiskUserAanlysis.realTimeRiskUserOwner.wholeProduct);
                    break;
                case 1:
                    $$("#userResultItemyh").html("全部产品");
                    yhfxQT(globalObj.realTimeRiskUserAanlysis.shanYinChannel.wholeProduct);
                    break;
                 case 2:
                     $$("#userResultItemyh").html("全部产品");
                     yhfxQT(globalObj.realTimeRiskUserAanlysis.wacaiChannel.wholeProduct);
                    break;
                case 3:
                    $$("#userResultItemyh").html("全部产品");
                    yhfxQT(globalObj.realTimeRiskUserAanlysis.r360Channel.wholeProduct);
                    break;
                case 4:
                    $$("#userResultItemyh").html("全部产品");
                    yhfxQT(globalObj.realTimeRiskUserAanlysis.r51Channel.wholeProduct);
                    break;
                case 5:
                    $$("#userResultItemyh").html("全部产品");
                    yhfxQT(globalObj.realTimeRiskUserAanlysis.borrowChannel.wholeProduct);
                    break;
                case 6:
                    $$("#userResultItemyh").html("全部产品");
                    yhfxQT(globalObj.realTimeRiskUserAanlysis.bairongChannel.wholeProduct);
                    break;
                case 7:
                    $$("#userResultItemyh").html("全部产品");
                    yhfxQT(globalObj.realTimeRiskUserAanlysis.credit51Channel.wholeProduct);
                    break;
                case 8:
                    $$("#userResultItemyh").html("全部产品");
                    yhfxQT(globalObj.realTimeRiskUserAanlysis.jielemaChannel.wholeProduct);
                    break;
                case 9:
                    $$("#userResultItemyh").html("全部产品");
                    yhfxQT(globalObj.realTimeRiskUserAanlysis.shanyinzcChannel.wholeProduct);
                    break;

            };
        })
    }
   /* 第二个选项卡*/
    function tabChangeSecond(){
        var parentBox = $$(".secondCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            var curInd = $$(this).index();//获取当前点击的索引
            switch(curInd){
                case 0:
                    PublickStyle();
                    AskForSisterm('112112','alluser','110110');
                    break;
                case 1:
                    PublickStyle();
                    AskForSisterm('10000000','alluser','110110');
                    break;
                case 2:
                    PublickStyle();
                    AskForSisterm('10000001','alluser','110110');
                    break;
                case 3:
                    PublickStyle();
                    AskForSisterm('10000002','alluser','110110');
                    break;
                case 4:
                    PublickStyle();
                    AskForSisterm('10000003','alluser','110110');
                    break;
                case 5:
                    PublickStyle();
                    AskForSisterm('10000008','alluser','110110');
                    break;
                case 6:
                    PublickStyle();
                    AskForSisterm('10000005','alluser','110110');
                    break;
                case 7:
                    PublickStyle();
                    AskForSisterm('10000006','alluser','110110');
                    break;
                case 8:
                    PublickStyle();
                    AskForSisterm('10000009','alluser','110110');
                    break;
                case 9:
                    PublickStyle();
                    AskForSisterm('10000016','alluser','110110');
                    break;
                case 10:
                    PublickStyle();
                    AskForSisterm('10000007','alluser','110110');
                    break;
            };
        })
    };
    /*第三个选项卡*/
    function tabChangeThird(){
        var parentBox = $$(".thirdCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            var curInd = $$(this).index();
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            $$(".thirdCont .tabBlockDetail2>div:eq("+curInd+")").removeClass('off').addClass("show").siblings().addClass('off').removeClass('show');
            switch(curInd){
                case 0:
                    publicSdqu1();
                    var dataValue=document.getElementById('userResult').getAttribute('data-value');
                    var dataValue1=document.getElementById('userResult').getAttribute('data-value1');
                    var dataValue2=document.getElementById('userResult').getAttribute('data-value2');
                    var dataValue3=document.getElementById('userResult').getAttribute('data-value3');
                    var qushiData="sdqs";
                    $$.ajaxData({
                        newUrl:"/meijieRealTime/getMeiJieRealTimeRiskTrendModel.gm",
                        data:{
                            rdate: $$('#calendars').val(),
                            xxk:dataValue1,
                            kh:dataValue3,
                            cp:dataValue2,
                            yhzb:dataValue,
                            qstu:qushiData,
                        },
                        callback:function(data){
                            globalObj11=data.data.datainfo;
                            publicSdqu2();
                            userCondition(globalObj11,$$('#calendars').val());
                        }
                    });
                    break;
                case 1:
                    publicLjqu1();
                    var dataValue=document.getElementById('userResultqs').getAttribute('data-value');
                    var dataValue1=document.getElementById('userResultqs').getAttribute('data-value1');
                    var dataValue2=document.getElementById('userResultqs').getAttribute('data-value2');
                    var dataValue3=document.getElementById('userResultqs').getAttribute('data-value3');
                    var qushiData="ljqs";
                    $$.ajaxData({
                        newUrl:"/meijieRealTime/getMeiJieRealTimeRiskTrendModel.gm",
                        data:{
                            rdate: $$('#calendars2').val(),
                            xxk:dataValue1,
                            kh:dataValue3,
                            cp:dataValue2,
                            yhzb:dataValue,
                            qstu:qushiData,
                        },
                        callback:function(data){
                            globalObj12=data.data.datainfo;
                            publicLjqu2();
                            userConditionqs(globalObj12,$$('#calendars2').val());
                        }
                    });
                    break;
            };
        })
    }
    //第四个选项卡   流程图的选项卡（后新增选项卡）
    function tabChangeForth(){
        var parentBox = $$(".forthCont .tableTitle");
        var subItem = parentBox.find("a");
        subItem.on("tap",function(){
            $$(this).addClass("active").siblings("a").removeClass("active mui-active");
            var curInd = $$(this).index();//获取当前点击的索引
            switch(curInd){
                case 0:
                    PublickStyleLCT();
                    AskForLiuCheng('112112','alluser','110110');
                    break;
                case 1:
                    PublickStyleLCT();
                    AskForLiuCheng('10000000','alluser','110110');
                    break;
                case 2:
                    PublickStyleLCT();
                    AskForLiuCheng('10000001','alluser','110110');
                    break;
                case 3:
                    PublickStyleLCT();
                    AskForLiuCheng('10000002','alluser','110110');
                    break;
                case 4:
                    PublickStyleLCT();
                    AskForLiuCheng('10000003','alluser','110110');
                    break;
                case 5:
                    PublickStyleLCT();
                    AskForLiuCheng('10000008','alluser','110110');
                    break;
                case 6:
                    PublickStyleLCT();
                    AskForLiuCheng('10000005','alluser','110110');
                    break;
                case 7:
                    PublickStyleLCT();
                    AskForLiuCheng('10000006','alluser','110110');
                    break;
                case 8:
                    PublickStyleLCT();
                    AskForLiuCheng('10000009','alluser','110110');
                    break;
                case 9:
                    PublickStyleLCT();
                    AskForLiuCheng('10000016','alluser','110110');
                    break;
                case 10:
                    PublickStyleLCT();
                    AskForLiuCheng('10000007','alluser','110110');
                    break;

            };
        });
    };
    //指标说明弹框
    function tipsExplain(){
    	//用户分析指标说明
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
    	//系统分析指标说明
    	$$("#sysQues").on("click",function(){
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
    	$$("#centreQues").on("click",function(){
    		$$("#centreQuesBox").show();
    		//弹框出现时页面禁止滚动
            $$(".mui-content").css({
                "width":"100%",
                "height":"100%"
            })
            $$(".mui-content")[0].style.overflow = 'hidden';
    		document.body.style.overflow = 'hidden';
    	});
    	$$("#centreClose").on("click",function(){
    		$$("#centreQuesBox").hide();
    		//弹框关闭时页面恢复滚动
            $$(".mui-content").css({
                "width":"initial",
                "height":"initial"
            })
            $$(".mui-content")[0].style.overflow = 'scroll';
    		document.body.style.overflow = 'scroll';
    	});
        //预警记录说明
       /* $$("#yujing").on("click",function(){
            console.log(111);
            $$("#yujingBox").show();
            //弹框出现时页面禁止滚动
            $$(".mui-content").css({
                "width":"100%",
                "height":"100%"
            })
            $$(".mui-content")[0].style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        });
        $$("#yuClose").on("click",function(){
            console.log(2222222);
            $$("#yujingBox").hide();
            //弹框关闭时页面恢复滚动
            $$(".mui-content").css({
                "width":"initial",
                "height":"initial"
            })
            $$(".mui-content")[0].style.overflow = 'scroll';
            document.body.style.overflow = 'scroll';
        });*/
    }


    var  myvue=new Vue() ;//借助第三方vue用来传值

    /*此处是用户分析   自有部分*/
    function yhfxZY(obj){
        myvue.$emit('getdataMy',obj);
    };
    new Vue({
        el:"#yhfxtbsj",
        data:{
            Data:''
        },
        mounted:function(){
            var that = this;
            myvue.$on('getdataMy', function(obj){
                that.Data=obj;
                that.getNumMy();
            })
        },
        methods:{
            getNumMy:function(){
                var itemValue = this.Data;//获取金额格式化后的值
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

    /*此处是用户分析   融360，闪银，挖财，51 借点钱 百融 51信用卡部分*/
    function yhfxQT(obj){
        myvue.$emit('getdataQT',obj)
    };
    new Vue({
        el:'#yhfxtbsj2',
        data:{
            Data:''
        },
        mounted:function(){
            var that=this;
            myvue.$on('getdataQT',function(obj){
                that.Data=obj;
                that.getNumQt();
            })
        },
        methods:{
            getNumQt:function(){
                var itemValue = this.Data;//获取金额格式化后的值
                this.$nextTick(function(){
                    var aSpan=document.querySelectorAll('.hbcL');
                    for(var i=0;i<aSpan.length;i++){
                        var oSpanInnerHtml=aSpan[i].innerHTML;
                        if(oSpanInnerHtml.indexOf('-')!=-1 && oSpanInnerHtml.indexOf('%')!=-1){
                            aSpan[i].style.color='#6be86a';
                        }else if(oSpanInnerHtml.indexOf('+')!=-1 && oSpanInnerHtml.indexOf('%')!=-1) {
                            aSpan[i].style.color='red';
                        }else{
                            aSpan[i].style.color='#000';
                        }
                    };
                });
            }
        }
    });

    /*此处是核心流程图的部分*/
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

    /*此处是系统分析数据部分*/
    function xtfxSHU(obj){
        myvue.$emit('getdataXTFX',obj);
    };
    new Vue({
        el:"#xtfxsj",
        data:{
            Data:''
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

    /*此处是预警记录的数据*/
    function yjSHU(obj){
        myvue.$emit('getdataYJ',obj);
    };
    new Vue({
        el:'#tabBlockDetail3',
        data:{
            Data:''
        },
        mounted:function(){
            var that=this;
            myvue.$on("getdataYJ",function(obj){
                that.Data=obj;
               /* 此处是用操作dom的形式实现暂无数据的弹框*/
                /*console.log(that.Data.length);
                if(that.Data.length==0){
                    console.log(5555)
                    document.getElementById('SM').style.display='block';
                }else{
                    document.getElementById('SM').style.display='none';
                };*/
                that.getNumYJ();
            })
        },
        methods:{
            getNumYJ:function(){
                var itemValue = this.Data;
                this.$nextTick(function(){
                    var aSpan=document.querySelectorAll('.hbcL');
                    for(var i=0;i<aSpan.length;i++){
                        var oSpanInnerHtml=aSpan[i].innerHTML;
                        if(oSpanInnerHtml.indexOf('-')!=-1 && oSpanInnerHtml.indexOf('%')!=-1){
                            aSpan[i].style.color='#6be86a';
                        }else if(oSpanInnerHtml.indexOf('+')!=-1) {
                            aSpan[i].style.color='red';
                        }
                    }
                });
            },
            warningWindows:function(){
                    $$("#yujingBox").show();
                    //弹框出现时页面禁止滚动
                    $$(".mui-content").css({
                        "width":"100%",
                        "height":"100%"
                    })
                    $$(".mui-content")[0].style.overflow = 'hidden';
                    document.body.style.overflow = 'hidden';

                $$("#yuClose").on("click",function(){
                    $$("#yujingBox").hide();
                    //弹框关闭时页面恢复滚动
                    $$(".mui-content").css({
                        "width":"initial",
                        "height":"initial"
                    })
                    $$(".mui-content")[0].style.overflow = 'scroll';
                    document.body.style.overflow = 'scroll';
                });
            },
            toggleShow:function(event,value,ind){
            	var positionTop = $$(event.currentTarget).position().top;
            	if($$("#warnTips").length == 0){
            		var dom = '<div id="warnTips" class="smallTipsBox">'+
				        '<div class="">'+
				            '<h5 class="popDetailHeader">'+value.channelCols+'预警说明<a class="close" id="closeWarn"></a></h5>'+
				            '<ul class="popDetailUl warn">'+
				                '<li>'+
				                    '<span class="popLeft">'+value.channelCols+'</span>'+
				                    '<span class="popRight">'+value.content+'</span>'+
				                '</li>'+
				            '</ul>'+
				        '</div>'+
				    '</div>';
				    $$("#tabBlockDetail3").prepend(dom);
				    $$("#warnTips").css("top",positionTop*1-126+"px");
				    $$("#closeWarn").on("click",function(){
				    	$$("#warnTips").remove();
				    })
            	}
            },
            showRest:function(){
            	$$(".pullMore").toggleClass("active");
        		$$(".showRest").nextAll().toggle();
            },

        }

    });

    //预警的点击事件有两个，预警指标说明的点击事件无法实现，顾使用原生的方法可行，但是原生的点击事件必须在预警数据处理之后才能实现，否则也无法实现
   /* yuJing();
    function yuJing(){
        var dom=document.getElementById("yujing");
        dom.onclick =function(e){
            console.log(333333);
             $$("#yujing").on("click",function(){
             console.log(111);
             $$("#yujingBox").show();
             //弹框出现时页面禁止滚动
             $$(".mui-content").css({
             "width":"100%",
             "height":"100%"
             })
             $$(".mui-content")[0].style.overflow = 'hidden';
             document.body.style.overflow = 'hidden';
             });
             $$("#yuClose").on("click",function(){
             console.log(2222222);
             $$("#yujingBox").hide();
             //弹框关闭时页面恢复滚动
             $$(".mui-content").css({
             "width":"initial",
             "height":"initial"
             })
             $$(".mui-content")[0].style.overflow = 'scroll';
             document.body.style.overflow = 'scroll';
             });
        };
    };
*/
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
    //用户分析-----筛选产品
/*    yhfxyhCh();
    function yhfxyhCh(){
        var userPicker = new $.PopPicker();
        var data=[{
            value: 'wholeProduct',
            text: '全部产品'
        }, /!*{
            value: 'pDProduct',
            text: 'PD'
        },*!//!* {
            value: 'smallAmountProduct',//之后要删除的
            text: '小额'
        },*!/
        {
            value: 'accumulationFundProduct',
            text: '公积金'
        },
            //之后要放开的
        /!*{
            value: 'fastLendSingleProduct',
            text: '快借单期'
        },
        {
            value: 'fastLendMultiProduct',
            text: '快借多期'
        },*!/
        {
            value: 'periodProduct',
            text: '分期'
        }
        ];
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById('showUserPickerItemyh');
        var userResult = doc.getElementById('userResultItemyh');
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;
                var curIndOne = $$(".firstCont .active").index();
                switch(curIndOne){
                    case 0:
                        //yhfxZY(globalObj.realTimeRiskUserAanlysis.realTimeRiskUserOwner);
                        break;
                    case 1:
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.shanYinChannel[items[0].value]);
                        break;
                    case 2:
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.wacaiChannel[items[0].value]);
                        break;
                    case 3:
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.r360Channel[items[0].value]);
                        break;
                    case 4:
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.r51Channel[items[0].value]);
                        break;
                    case 5:
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.borrowChannel[items[0].value]);
                        break;
                    case 6:
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.bairongChannel[items[0].value]);
                        break;
                    case 7:
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.credit51Channel[items[0].value]);
                        break;
                    case 8:
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.jielemaChannel[items[0].value]);
                        break;
                    case 9:
                        yhfxQT(globalObj.realTimeRiskUserAanlysis.shanyinzcChannel[items[0].value]);
                        break;
                };
            });
        }, false);
    };*/
    //用户分析-------自有  筛选产品
/*    yhfxyhChZY();
    function yhfxyhChZY(){
        var userPicker = new $.PopPicker();
        var data=[{
            value: 'wholeProduct',
            text: '全部产品'
        }, {
            value: 'hasCardProduct',
            text: '有卡'
        }, {
         value: 'noCardProduct',//之后要删除的
         text: '无卡'
         },
            {
                value: 'accumuFundProduct',
                text: '公积金'
            },
        ];
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById('showUserPickerItemyhZY');
        var userResult = doc.getElementById('userResultItemyhZY');
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;
                    yhfxZY(globalObj.realTimeRiskUserAanlysis.realTimeRiskUserOwner[items[0].value]);
            });
        }, false);
    };*/

    //系统分析-----筛选用户
    xtfxyhCh();
    function xtfxyhCh(){
        var userPicker = new $.PopPicker();
        var data=[{
            value: 'alluser',
            text: '全部用户'
        }, {
            value: 'newuser',
            text: '新客'
        }, {
            value: 'olduser',
            text: '老客'
        }
        ];
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById('showUserPicker2');
        var userResult = doc.getElementById('userResult2');
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;
                var xxkNum,xxk,cpz;
                var curIndTwo = $$(".secondCont .active").index();
                switch(curIndTwo){
                 case 0:
                     xxkNum="112112";
                     break;
                 case 1:
                     xxkNum="10000000";
                     break;
                 case 2:
                     xxkNum="10000001";
                     break;
                 case 3:
                     xxkNum="10000002";
                     break;
                 case 4:
                     xxkNum="10000003";
                     break;
                 case 5:
                     xxkNum="10000008";
                     break;
                 case 6:
                        xxkNum="10000005";
                        break;
                 case 7:
                        xxkNum="10000006";
                        break;
                 case 8:
                        xxkNum="10000009";
                        break;
                    case 9:
                        xxkNum="10000016";
                        break;
                    case 10:
                        xxkNum="10000007";
                        break;
                };
                if($$("#userResult3").text()=="全部产品"){
                    cpz="110110";
                }else if($$("#userResult3").text()=="公积金"){
                    cpz="5560000";
                }/*else if($$("#userResult3").text()=="PD"){
                    cpz="5501";
                }*//*else if($$("#userResult3").text()=="小额"){
                    cpz="5550";
                }*//*else if($$("#userResult3").text()=="快借单期"){
                    cpz="5550001";
                }else if($$("#userResult3").text()=="快借多期"){
                    cpz="5550000";
                }*/else if($$("#userResult3").text()=="分期"){
                    cpz="5550002";
                }else if($$("#userResult3").text()=="有卡"){
                    cpz="1000000";
                }else if($$("#userResult3").text()=="无卡"){
                    cpz="1000001";
                };
                $$.ajaxData({
                    newUrl:"/meijieRealTime/getMeiJieRealTimeSysAnalysis.gm",
                    data:{
                        xxk:xxkNum,
                        kh:dataValue,
                        cp:cpz,
                    },
                    callback:function(data){
                        globalObj2=data.data.datainfo;
                        xtfxSHU(globalObj2);
                    }
                });
            });
        }, false);
    };
    //系统分析-----筛选产品
    xtfxcpCh();
    var dataMy=[{
        value: '110110',
        text: '全部产品'
    }, {
        value: '5560000',
        text: '公积金'
    },{
        value: '1000000',
        text: '有卡'
    }, {
        value: '1000001',
        text: '无卡'
    },
    ];
    var dataElse=[{
        value: '110110',
        text: '全部产品'
    }, {
        value: '5560000',
        text: '公积金'
    },/* {
        value: '5501',
        text: 'PD'
    }*//*, {
     value: '5550',
     text: '小额'
     }*//*,{
        value: '5550001',
        text: '快借单期'
    },{
        value: '5550000',
        text: '快借多期'
    },*/{
        value: '5550002',
        text: '分期'
    }
    ];
    var dataAll=[{
        value: '110110',
        text: '全部产品'
    }, {
        value: '5560000',
        text: '公积金'
    },{
        value: '1000000',
        text: '有卡'
    }, {
        value: '1000001',
        text: '无卡'
    },/* {
     value: '5501',
     text: 'PD'
     }*//*, {
     value: '5550',
     text: '小额'
     }*//*,{
     value: '5550001',
     text: '快借单期'
     },{
     value: '5550000',
     text: '快借多期'
     },*/{
        value: '5550002',
        text: '分期'
    }
    ];
    function xtfxcpCh(){
        var userPicker = new $.PopPicker();
 /*       var data=[{
            value: '110110',
            text: '全部产品'
        }, {
            value: '5560',
            text: '公积金贷'
        }, {
            value: '5501',
            text: 'PD'
        }/!*, {
            value: '5550',
            text: '小额'
        }*!/,{
            value: '5550001',
            text: '快借单期'
        },{
            value: '5550000',
            text: '快借多期'
        },{
            value: '5550002',
            text: '分期'
        }
        ];

        userPicker.setData(data);*/
        var showUserPickerButton = doc.getElementById('showUserPicker3');
        var userResult = doc.getElementById('userResult3');
        showUserPickerButton.addEventListener('tap', function(event) {
            var curIndOne = $$(".secondCont .active").text();
            //console.log(curIndOne);
            var data;
            if(curIndOne=='自有'){
                data=dataMy;
            }else if(curIndOne=='全部渠道'){
                data=dataAll;
            }else{
                data=dataElse;
            };
            userPicker.setData(data);
            userPicker.show(function(items) {
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;
                var xxkNum,xxk,khz;
                var curIndTwo = $$(".secondCont .active").index();
                switch(curIndTwo){
                    case 0:
                        xxkNum="112112";
                        break;
                    case 1:
                        xxkNum="10000000";
                        break;
                    case 2:
                        xxkNum="10000001";
                        break;
                    case 3:
                        xxkNum="10000002";
                        break;
                    case 4:
                        xxkNum="10000003";
                        break;
                    case 5:
                        xxkNum="10000008";
                        break;
                    case 6:
                        xxkNum="10000005";
                        break;
                    case 7:
                        xxkNum="10000006";
                        break;
                    case 8:
                        xxkNum="10000009";
                        break;
                    case 9:
                        xxkNum="10000016";
                        break;
                    case 10:
                        xxkNum="10000007";
                        break;

                };
                if($$("#userResult2").text()=="全部用户"){
                    khz="alluser";
                }else if($$("#userResult2").text()=="新客"){
                    khz="newuser";
                }else if($$("#userResult2").text()=="老客"){
                    khz="olduser";
                }
                $$.ajaxData({
                    newUrl:"/meijieRealTime/getMeiJieRealTimeSysAnalysis.gm",
                    data:{
                        xxk:xxkNum,
                        kh:khz,
                        cp:dataValue,
                    },
                    callback:function(data){
                        globalObj3=data.data.datainfo;
                        xtfxSHU(globalObj3);
                    }
                });
            });
        }, false);
    };

    //核心流程------筛选用户
    hxlcyhCh();
    function hxlcyhCh(){
        var userPicker = new $.PopPicker();
        var data=[{
            value: 'alluser',
            text: '全部用户'
        }, {
            value: 'newuser',
            text: '新客'
        }, {
            value: 'olduser',
            text: '老客'
        }
        ];
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById('showUserPickerLCTKH');
        var userResult = doc.getElementById('userResultLCTKH');
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;
                var xxkNum,xxk,cpz;
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
                    case 3:
                        xxkNum="10000002";

                        break;
                    case 4:
                        xxkNum="10000003";
                        break;
                    case 5:
                        xxkNum="10000008";
                        break;
                    case 6:
                        xxkNum="10000005";
                        break;
                    case 7:
                        xxkNum="10000006";
                        break;
                    case 8:
                        xxkNum="10000009";
                        break;
                    case 9:
                        xxkNum="10000016";
                        break;
                    case 10:
                        xxkNum="10000007";
                        break;
                };
                if($$("#userResultLCTCP").text()=="全部产品"){
                    cpz="110110";
                }else if($$("#userResultLCTCP").text()=="公积金"){
                    cpz="5560000";
                }else if($$("#userResultLCTCP").text()=="PD"){
                    cpz="5501";
                }/*else if($$("#userResultLCTCP").text()=="小额"){
                    cpz="5550";
                }*/else if($$("#userResultLCTCP").text()=="快借单期"){
                    cpz="5550001";
                }else if($$("#userResultLCTCP").text()=="快借多期"){
                    cpz="5550000";
                }else if($$("#userResultLCTCP").text()=="分期"){
                    cpz="5550002";
                }else if($$("#userResultLCTCP").text()=="有卡"){
                    cpz="1000000";
                }else if($$("#userResultLCTCP").text()=="无卡"){
                    cpz="1000001";
                };
                $$.ajaxData({
                    newUrl:"/meijieRealTime/getMeiJieRealTimeCoreAnalysis.gm",
                    data:{
                        xxk:xxkNum,
                        kh:dataValue,
                        cp:cpz,
                    },
                    callback:function(data){
                        globalObj4=data.data.datainfo;
                        hxlcTU(globalObj4);
                    }
                });
            });
        }, false);
    }
    //核心流程------筛选产品
    hxlccpCh();
    var dataCenterMy=[{
        value: '110110',
        text: '全部产品'
    }, {
        value: '5560000',
        text: '公积金'
    }, {
        value: '1000000',
        text: '有卡'
    },{
        value: '1000001',
        text: '无卡'
    }
    ];
    var dataCenterElse=[{
        value: '110110',
        text: '全部产品'
    }, {
        value: '5560000',
        text: '公积金'
    },/* {
        value: '5501',
        text: 'PD'
    }*//*, {
     value: '5550',
     text: '小额'
     }*//*,{
        value: '5550001',
        text: '快借单期'
    },{
        value: '5550000',
        text: '快借多期'
    },*/{
        value: '5550002',
        text: '分期'
    }
    ];
    var dataCenterAll=[{
        value: '110110',
        text: '全部产品'
    }, {
        value: '5560000',
        text: '公积金'
    },, {
        value: '1000000',
        text: '有卡'
    },{
        value: '1000001',
        text: '无卡'
    },/* {
     value: '5501',
     text: 'PD'
     }*//*, {
     value: '5550',
     text: '小额'
     }*//*,{
     value: '5550001',
     text: '快借单期'
     },{
     value: '5550000',
     text: '快借多期'
     },*/{
        value: '5550002',
        text: '分期'
    }
    ];
    function hxlccpCh(){
        var userPicker = new $.PopPicker();
/*        var data=[{
            value: '110110',
            text: '全部产品'
        }, {
            value: '5560',
            text: '公积金贷'
        }, {
            value: '5501',
            text: 'PD'
        }/!*, {
            value: '5550',
            text: '小额'
        }*!/,{
            value: '5550001',
            text: '快借单期'
        },{
            value: '5550000',
            text: '快借多期'
        },{
            value: '5550002',
            text: '分期'
        }
        ];
        userPicker.setData(data);*/
        var showUserPickerButton = doc.getElementById('showUserPickerLCTCP');
        var userResult = doc.getElementById('userResultLCTCP');
        showUserPickerButton.addEventListener('tap', function(event) {
            var curIndOne = $$(".forthCont .active").text();
            //console.log(curIndOne);
            var data;
            if(curIndOne=='自有'){
                data=dataCenterMy;
            }else if(curIndOne=='全部渠道'){
                data=dataCenterAll;
            }else{
                data=dataCenterElse;
            };
            userPicker.setData(data);
            userPicker.show(function(items) {
                userResult.innerText = items[0].text;
                var dataValue=items[0].value;
                var xxkNum,xxk,khz;
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
                    case 3:
                        xxkNum="10000002";
                        break;
                    case 4:
                        xxkNum="10000003";
                        break;
                    case 5:
                        xxkNum="10000008";
                        break;
                    case 6:
                        xxkNum="10000005";
                        break;
                    case 7:
                        xxkNum="10000006";
                        break;
                    case 8:
                        xxkNum="10000009";
                        break;
                    case 9:
                        xxkNum="10000016";
                        break;
                    case 10:
                        xxkNum="10000007";
                        break;
                };
                if($$("#userResultLCTKH").text()=="全部用户"){
                    khz="alluser";
                }else if($$("#userResultLCTKH").text()=="新客"){
                    khz="newuser";
                }else if($$("#userResultLCTKH").text()=="老客"){
                    khz="olduser";
                }
                $$.ajaxData({
                    newUrl:"/meijieRealTime/getMeiJieRealTimeCoreAnalysis.gm",
                    data:{
                        xxk:xxkNum,
                        kh:khz,
                        cp:dataValue,
                    },
                    callback:function(data){
                        globalObj5=data.data.datainfo;
                        hxlcTU(globalObj5);
                    }
                });
            });
        }, false);

    };

    /*新增产品后的筛选*/
    var dataTotal=[
        {
            value: 'zcyhs',
            text: '注册用户数',
            children: [{
                value: "10000000",
                text: "自有",
                children: [{
                    value: "",
                    text: "无",
                    children: [{
                        value: "",
                        text: "无"
                    }]
                }]
            }]
        },
        {value: 'rzyhs',
            text: '认证用户数',
            children: [{
                value: "10000000",
                text: "自有",
                children: [{
                    value: "",
                    text: "无",
                    children: [{
                        value: "",
                        text: "无"
                    }]
                }]
            }]
        },
        {
            value: 'jjyhs',
            text: '进件用户数',
            children: [
                {
                    value: "112112",
                    text: "全部渠道",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                value: "newuser",
                                text: "新客"

                            },
                                {
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        },
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                }
            ]
        },
        {value: 'xstgjs',
            text: '信审通过件数',
            children: [
                {
                    value: "112112",
                    text: "全部渠道",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        },
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                }
            ]
        },
        {value: 'xstgje',
            text: '信审通过金额(万)',
            children: [
                {
                    value: "112112",
                    text: "全部渠道",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        },
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                }
            ]
        },
        {value: 'qysxjs',
            text: '签约失效件数',
            children:[
                {
                    value: "10000000",
                    text: "自有",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
            ]
        },
        {value: 'fkbs',
            text: '放款笔数',
            children: [
                {
                    value: "112112",
                    text: "全部渠道",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        },
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                }
            ]
        },
        {value: 'fkhtje',
            text: '放款合同金额(万)',
            children: [
                {
                    value: "112112",
                    text: "全部渠道",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        },
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                }
            ]
        },
        {value: 'jj',
            text: '件均',
            children: [
                {
                    value: "112112",
                    text: "全部渠道",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        },
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                }
            ]
        },
        {value: 'jjjs',
            text: '进件件数',
            children: [
                {
                    value: "112112",
                    text: "全部渠道",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        },
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                }
            ]
        },
        {value: 'dhshjs',
            text: '电核审核件数',
            children: [
                {
                    value: "112112",
                    text: "全部渠道",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        },
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000000",
                            text: "有卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]},
                        {value: "1000001",
                            text: "无卡",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children: [{
                        value: "110110",
                        text: "全部产品",
                        children: [{
                            value: "alluser",
                            text: "全部用户"
                        },{
                            value: "newuser",
                            text: "新客"

                        },{
                            value: "olduser",
                            text: "老客"

                        }]
                    },
                        {value: "5560000",
                            text: "公积金",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },
                                {
                                    value: "newuser",
                                    text: "新客"

                                },
                                {
                                    value: "olduser",
                                    text: "老客"

                                }]},
                        {value: "5550002",
                            text: "分期",
                            children: [{
                                value: "alluser",
                                text: "全部用户"
                            },{
                                value: "newuser",
                                text: "新客"

                            },{
                                value: "olduser",
                                text: "老客"

                            }]
                        }]
                }
            ]
        },
        {
            value:'tsyhs',
            text:'推送用户数',
            children:[
                {
                    value: "112112",
                    text: "全部渠道",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                }
            ]
        },
        {
            value:'fhjjyhs',
            text:'符合进件用户数',
            children:[
                {
                    value: "112112",
                    text: "全部渠道",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000000",
                    text: "自有",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000001",
                    text: "闪银",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000002",
                    text: "挖财",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000003",
                    text: "融360",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000008",
                    text: "51公积金",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000005",
                    text: "借点钱",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000006",
                    text: "百融",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000009",
                    text: "51信用卡",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000016",
                    text: "借了吗",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                },
                {
                    value: "10000007",
                    text: "闪银资产",
                    children:[
                        {
                            value: "",
                            text: "无",
                            children:[
                                {
                                    value: "",
                                    text: "无",
                                }
                            ]

                        }
                    ]
                }
            ]
        },
    ];
    //时段趋势的选择   用户指数的选择
    sdqsCh();
    function sdqsCh(){
        var userPicker = new $.PopPicker({
            layer: 4
        });
        var data=dataTotal;
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById('showUserPicker');
        var userResult = doc.getElementById('userResult');
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                userResult.innerText = items[0].text +"-"+ items[1].text+"-"+ items[2].text+"-"+items[3].text;
                var dataValue=items[0].value;//此处是用户指标筛选
                var dataValue1=items[1].value;//此处是渠道筛选
                var dataValue2=items[2].value;//此处是产品筛选
                var dataValue3=items[3].value;//此处是客户筛选
                var qushiData;
                var postDate=$$('#calendars').val();
                var curInd3 = $$(".thirdCont .active").index();
                switch(curInd3){
                    case 0:
                        qushiData="sdqs";
                        break;
                    case 1:
                        qushiData="ljqs";
                        break;
                };
                userResult.setAttribute('data-value',dataValue);
                userResult.setAttribute('data-value1',dataValue1);
                userResult.setAttribute('data-value2',dataValue2);
                userResult.setAttribute('data-value3',dataValue3);
                publicSdqu1();
                $$.ajaxData({
                    newUrl:"/meijieRealTime/getMeiJieRealTimeRiskTrendModel.gm",
                    data:{
                        xxk:dataValue1,
                        kh:dataValue3,
                        cp:dataValue2,
                        yhzb:dataValue,
                        qstu:qushiData,
                        rdate:postDate,
                    },
                    callback:function(data){
                        globalObj6=data.data.datainfo;
                        publicSdqu2();
                        userCondition(globalObj6,postDate);
                    }
                });
            });
        }, false);
    };

    $$('.userBlock1 .mui-picker:first').css('width','30%');

    var dataDrzcqjjyhs={
        value: 'drzcqjjyhs',
        text: '当日注册且进件用户数',
        children: [{
            value: "10000000",
            text: "自有",
            children: [{
                value: "",
                text: "无",
                children: [{
                    value: "",
                    text: "无"
                }]
            }]
        }]
    };
    //由于累计趋势比时段趋势筛选多了一个指标，所以通过给变量data concat 一个维度，返回新的数组就是累计趋势的整体所有维度的筛选；
    var dataZong=dataTotal.concat(dataDrzcqjjyhs);
    //累计趋势的选择  累计趋势用户指标的选择
    sdqsChqs();
    function sdqsChqs(){
        var userPicker = new $.PopPicker({
            layer: 4
        });
        var data=dataZong;
        userPicker.setData(data);
        var showUserPickerButton = doc.getElementById('showUserPickerqs');
        var userResult = doc.getElementById('userResultqs');
        showUserPickerButton.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                publicLjqu1();
                userResult.innerText = items[0].text +"-"+ items[1].text+"-"+ items[2].text+"-"+items[3].text;
                var dataValue=items[0].value;//此处是用户指标筛选
                var dataValue1=items[1].value;//此处是渠道筛选
                var dataValue2=items[2].value;//此处是产品筛选
                var dataValue3=items[3].value;//此处是客户筛选
                var qushiData;
                var postDate=$$('#calendars2').val();
                var curInd3 = $$(".thirdCont .active").index();
                switch(curInd3){
                    case 0:
                        qushiData="sdqs";
                        break;
                    case 1:
                        qushiData="ljqs";
                        break;
                };
                userResult.setAttribute('data-value',dataValue);
                userResult.setAttribute('data-value1',dataValue1);
                userResult.setAttribute('data-value2',dataValue2);
                userResult.setAttribute('data-value3',dataValue3);
                $$.ajaxData({
                    newUrl:"/meijieRealTime/getMeiJieRealTimeRiskTrendModel.gm",
                    data:{
                        xxk:dataValue1,
                        kh:dataValue3,
                        cp:dataValue2,
                        yhzb:dataValue,
                        qstu:qushiData,
                        rdate:postDate,
                    },
                    callback:function(data){
                        globalObj9=data.data.datainfo;
                        publicLjqu2();
                        userConditionqs(globalObj9,postDate);
                    }
                });
            });
        }, false);
    };

    //时段趋势
    function userCondition(obj,rtDayBefore){
    	var itemNum = Math.floor(((obj.todayTimesList.length)*1/288)*100);
    	var dataRangeStart = itemNum-5;
    	var dataRangeEnd = itemNum+2;
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('sdqs'));
        var option = {
            tooltip: {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            legend: {
                data:['今日',rtDayBefore],
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
                data: obj.timesList,
                axisTick:{
                    show:false
                },
                axisLine:{
                    show:false
                }
            },
            yAxis: {
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
                    start: dataRangeStart,//窗口中数据显示的起始位置
                    end: dataRangeEnd,//窗口中数据显示的结束位置
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
                    name: '今日',
                    type: 'line',
                    smooth: true,
                    data: obj.todayTimesList,
                    itemStyle:{
                        normal:{
                            color:"#7fbfea"
                        }
                    }
                },
                {
                    name: rtDayBefore ,
                    type: 'line',
                    smooth: false,
                    data: obj.compareTimesList,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                type:'dotted'  //'dotted'虚线 'solid'实线
                            },
                            color:"#e73b83"
                        }
                    }
                }]
        };
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };
    //时段趋势  趋势图表
    function userConditionqs(obj,rtDayBefore){
        var itemNum = Math.floor(((obj.todayTimesList.length)*1/288)*100);
        var dataRangeStart = itemNum-5;
        var dataRangeEnd = itemNum+2;
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('sdqsqs'));
        var option = {
            tooltip: {
                trigger: 'axis',
                confine: true,
                backgroundColor: 'rgba(87,106,118,0.7)'
            },
            legend: {
                data:['今日',rtDayBefore],
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
                data: obj.timesList,
                axisTick:{
                    show:false
                },
                axisLine:{
                    show:false
                }
            },
            yAxis: {
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
                    start: dataRangeStart,//窗口中数据显示的起始位置
                    end: dataRangeEnd,//窗口中数据显示的结束位置
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
                    name: '今日',
                    type: 'line',
                    smooth: true,
                    data: obj.todayTimesList,
                    itemStyle:{
                        normal:{
                            color:"#7fbfea"
                        }
                    }
                },
                {
                    name: rtDayBefore ,
                    type: 'line',
                    smooth: false,
                    data: obj.compareTimesList,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                type:'dotted'  //'dotted'虚线 'solid'实线
                            },
                            color:"#e73b83"
                        }
                    },
                }]
        };
        //使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };

    //日期选择    时段趋势
    realTimeSelect();
    function realTimeSelect(){
        $$("#calendars").on("change",function(){
            publicSdqu1();
            var curDate = $$(this).val();
            var dataValue=document.getElementById('userResult').getAttribute('data-value');
            var dataValue1=document.getElementById('userResult').getAttribute('data-value1');
            var dataValue2=document.getElementById('userResult').getAttribute('data-value2');
            var dataValue3=document.getElementById('userResult').getAttribute('data-value3');
            var qushiData;
            var curInd3 = $$(".thirdCont .active").index();
            switch(curInd3){
                case 0:
                    qushiData="sdqs";
                    break;
                case 1:
                    qushiData="ljqs";
                    break;
            };
            //在此获取选择的日期重新发送请求
            if((new Date(curDate) >= new Date("2017-09-05")) && (new Date(curDate) < new Date(onlyYMDate))){
                showTime = curDate;//当前页面显示的日期永远是符合时间范围内的日期
                $$.ajaxData({
                    newUrl:"/meijieRealTime/getMeiJieRealTimeRiskTrendModel.gm",
                    data:{
                        rdate: curDate,
                        xxk:dataValue1,
                        kh:dataValue3,
                        cp:dataValue2,
                        yhzb:dataValue,
                        qstu:qushiData,
                    },
                    callback:function(data){
                        globalObj7=data.data.datainfo;
                        publicSdqu2();
                        userCondition(globalObj7,curDate);
                        var curIndOne = $$(".thirdCont .active").index();
                    }
                });
            }
            else{
                publicSdqu2();
                mui.toast('不在可支持的统计时间范围内');
                $$(this).val(showTime);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
            }
        });
    };
    /*日期选择  累计趋势 */
    realTimeSelectqs();
    function realTimeSelectqs(){
        $$("#calendars2").on("change",function(){
            publicLjqu1();
            var curDate = $$(this).val();
            var dataValue=document.getElementById('userResultqs').getAttribute('data-value');
            var dataValue1=document.getElementById('userResultqs').getAttribute('data-value1');
            var dataValue2=document.getElementById('userResultqs').getAttribute('data-value2');
            var dataValue3=document.getElementById('userResultqs').getAttribute('data-value3');
            var qushiData;
            var curInd3 = $$(".thirdCont .active").index();
            switch(curInd3){
                case 0:
                    qushiData="sdqs";
                    break;
                case 1:
                    qushiData="ljqs";
                    break;
            };
            //在此获取选择的日期重新发送请求
            if((new Date(curDate) >= new Date("2017-09-05")) && (new Date(curDate) < new Date(onlyYMDate))){
                showTime2 = curDate;//当前页面显示的日期永远是符合时间范围内的日期
                $$.ajaxData({
                    newUrl:"/meijieRealTime/getMeiJieRealTimeRiskTrendModel.gm",
                    data:{
                        rdate: curDate,
                        xxk:dataValue1,
                        kh:dataValue3,
                        cp:dataValue2,
                        yhzb:dataValue,
                        qstu:qushiData,
                    },
                    callback:function(data){
                        globalObj10=data.data.datainfo;
                        publicLjqu2();
                        var curIndOne = $$(".thirdCont .active").index();
                        userConditionqs(globalObj10,curDate);
                    }
                })
            }
            else{
                publicLjqu2();
                mui.toast('不在可支持的统计时间范围内');
                $$(this).val(showTime2);//如果选择的日期超出时间范围，则应显示当前时间而非选择后的时间
            }
        });
    };

    function publicSdqu1(){
        $$('#sdqs1').removeClass('off').addClass('show');
        $$('#sdqs').removeClass('show').addClass('off');
    };
    function publicSdqu2(){
        $$('#sdqs1').removeClass('show').addClass('off');
        $$('#sdqs').removeClass('off').addClass('show');
    };
    function publicLjqu1(){
        $$('#sdqsqs').removeClass('show').addClass('off');
        $$('#ljqsLoad').removeClass('off').addClass('show');
    };
    function publicLjqu2(){
        $$('#sdqsqs').addClass('show').removeClass('off');
        $$('#ljqsLoad').removeClass('show').addClass('off');
    };


    //此处是修改多维度筛选框的宽度
    $$('.mui-picker').eq(4).css('width','39%');
    $$('.mui-picker').eq(5).css('width','21%');
    $$('.mui-picker').eq(6).css('width','20%');
    $$('.mui-picker').eq(7).css('width','20%');

    $$('.mui-picker').eq(8).css('width','39%');
    $$('.mui-picker').eq(9).css('width','21%');
    $$('.mui-picker').eq(10).css('width','20%');
    $$('.mui-picker').eq(11).css('width','20%');

})(mui,jQuery,document)

