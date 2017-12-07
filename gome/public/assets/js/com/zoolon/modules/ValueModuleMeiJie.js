/**
 * Value
 */
			var httpid="external-interface/";

	        /*var strMoney='<div class="digit_set marRig"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set marRig"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set marRig"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set set_last"></div>';
		    
		    var strPieces='<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set marRig"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set marRig"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set"></div>'+
			  '<div class="digit_set set_last"></div>';
		    
		    var sumMoney = 0;
		    var sumPieces = 0;

		    $(".pieces").html(strPieces);
			$(".money").html(strMoney);
		    //放款金额
			$('.money').dataStatistics({
		      	max:sumMoney,//数值
		      	len:10//数字是几位数
		    });

		    //放款件数
		    $('.pieces').dataStatistics({
		      	max:sumPieces,//数值
		      	len:9//数字是几位数
		    });*/
		    
		    function askForSumData(){
		    	

		    	$.ajax({
		    		//url:"http://10.129.223.172:8080/app/daping/loanAmountAndCount.gm",
					//url:"./loan.json",
					url:httpid+"mfy/monitor/getLoan.gm",
		    		type:"get",
		    		dataType:"json",
		    		success:function(e){
						//console.log(e);
		    			/*sumMoney = e.data.dataInfo.loanAmount;
		    			sumPieces = e.data.dataInfo.loanCount;
		    			
	    				$(".pieces").html(strPieces);
	    				$(".money").html(strMoney);
	    				//放款金额
		    			$('.money').dataStatistics({
					      	max:sumMoney,//数值
					      	len:10//数字是几位数
					    });
					    
					    //放款件数
		    			$('.pieces').dataStatistics({
					      	max:sumPieces,//数值
					      	len:9//数字是几位数
					    });*/

		    		
					},
					error:function(err){
						console.log(err);
					}
		    			
		    	})
		    	
		    	
		    }

App.ValueModuleMeiJie = function(size) {
	var gDate = new Date();
	var globalTimer = gDate.getTime();
	App.ModuleBase.call(this, size);

	var total_invest_All = 0;



	var module = this;
	//console.log(this)

	this.getPreloadAssets = function() {
		return [{
			type: "html",
			url: "assets/data/modules/valueSevenMeiJie.html"
		}];
	}

	this.initView = function() {
		this.controllers = [
			new Widget0Controller(),
			new WinWidgetController({
				view: module.view.find(".widget1"),
				titleFormat: function(idx, ds) {
					return (idx + 1) + "." + ds[idx].area + " " + ds[idx].orderNum + "笔 RMB" + $.number(ds[idx].total, 2) + "元";
				},
				getProgress: function(idx, ds) {
					return ds[idx].orderNum / ds[0].orderNum;
				}
			}),
			new WinWidgetController({
				view: module.view.find(".widget2"),
				titleFormat: function(idx, ds) {
					return (idx + 1) + "." + ds[idx].category + " " + ds[idx].value + "件";
				},
				getProgress: function(idx, ds) {
					return ds[idx].value / ds[0].value;
				}
			}),
			new WinWidgetController({
				view: module.view.find(".widget3"),
				titleFormat: function(idx, ds) {
					return (idx + 1) + "." + ds[idx].category + " " + ds[idx].value + "件";
				},
				getProgress: function(idx, ds) {
					return ds[idx].value / ds[0].value;
				}
			}),
			new WinWidgetController({
				view: module.view.find(".widget4"),
				titleFormat: function(idx, ds) {
					return (idx + 1) + "." + ds[idx].category + " " + ds[idx].orderNum + "件 RMB" + $.number(ds[idx].total, 2) + "元";
				},
				getProgress: function(idx, ds) {
					return ds[idx].orderNum / ds[0].orderNum;
				}
			}),
			new WinWidgetController({
				view: module.view.find(".widget5"),
				titleFormat: function(idx, ds) {
					return (idx + 1) + "." + ds[idx].brand + " " + ds[idx].value + "件";
				},
				getProgress: function(idx, ds) {
					var value = ds[idx].value;
					var value0 = ds[0].value;
					return value / value0;
				}
			}),
			new WinWidgetController({
				view: module.view.find(".widget6"),
				titleFormat: function(idx, ds) {
					return (idx + 1) + "." + ds[idx].brand + " " + ds[idx].value + "件";
				},
				getProgress: function(idx, ds) {
					var value = ds[idx].value;
					var value0 = ds[0].value;
					return value / value0;
				}
			}),
			// new Widget7Controller(),
			new MapWidgetController()
		];
	};

	/**
	 * widget0
	 */
	var IncrementNow = 0;

	function Widget0Controller() {
		var labels = module.view.find(".widget0 .content span");
		this.setDataSource = function(ds) {
			

		};
	}

//2943215397
//10.
	/**
	 * 图表
	 */
	function WinWidgetController(option) {
		var view = option.view;
		var items = view.find(".item");
		items.each(function() {
			var item = $(this);
			setProgress(item, 0);
		});

		function setProgress(item, value, duration) {
			var tw = value * 337;
			var align = item.find(".title").css("text-align");
			var tx = align == "left" ? 0 : 337 - tw;
			TweenLite.to(item.find(".progress"), duration, {
				width: tw,
				left: tx
			});
		}
		this.setDataSource = function(ds) {
			items.each(function(i) {
				var item = $(this);
				var titleStr = option.titleFormat(i, ds);
				item.find(".title").text(titleStr);
				var percent = option.getProgress(i, ds);
				setProgress(item, percent, 1);
			});
		}

		this.setHeadTitle = function(str) {
			view.find(".header .title").text(str);
		}
	}

	/**
	 * widget7
	 */
	function Widget7Controller() {
		App.CustomLineChart.call(this, {
			container: module.view.find(".widget7 .chartContainer"),
			url: App.Config.request.value['24hours']
		});

		var chart = this.getChart();
		var container = this.getContainer();
		var arrowContainer = $("<div>", {
			style: "position:absolute;left:0px;top:0px;"
		});
		arrowContainer.appendTo(container);

		this.setAmount_hit = function(amount_hit) {
			var data = chart.getOption().series[0].data;
			var dates = chart.getOption().xAxis[0].data;
			var maxNum = max(data);

			arrowContainer.empty();

			for (key in amount_hit) {
				var date = amount_hit[key];
				var item = new ArrowItem();
				item.view.appendTo(arrowContainer);
				item.setText("<span style='font-family:黑体'>突破</span>" + $.number(key) + "<span style='font-family:黑体'>元</span>");

				var idx = getIdx(date, dates);
				var tx = idx / data.length * 1756 + 60;
				var ty = (1 - key / maxNum) * 256 + 40;

				item.view.css("left", tx);
				item.view.css("top", ty);
			}
		}

		function ArrowItem() {
			this.view = $("<div>", {
				style: "position:absolute;"
			});
			var box = $("<div>", {
				style: "position:absolute;background:#FF8A00;color:#ffffff;padding:5px;font-family:'NeoTechStd-Regular';font-size:50px;border-radius:5px;white-space: nowrap;"
			});
			box.appendTo(this.view);
			var arrow = $("<img>", {
				style: "position:absolute;width:10px;height:7px;"
			});
			arrow.attr("src", "assets/images/arrow.png");
			arrow.css("left", -5);
			arrow.css("top", -7);
			arrow.appendTo(this.view);

			this.setText = function(str) {
				box.html(str);
				box.css("left", -box.outerWidth() * 0.5);
				box.css("top", -box.outerHeight() - 7);
			}
		}

		function min(arr) {
			var result = 0;
			for (var i = 0; i < arr.length; i++) {
				result = arr[i] < result ? arr[i] : result;
			}
			return result;
		}

		function max(arr) {
			var result = 0;
			for (var i = 0; i < arr.length; i++) {
				result = arr[i] > result ? arr[i] : result;
			}
			return result;
		}

		function getIdx(date, dates) {
			var result = 0;
			var d0 = new Date(date);
			for (var i = 0; i < dates.length; i++) {
				var d1 = new Date(dates[i]);
				if (d0.getTime() > d1.getTime()) result = i;
			}
			result += (d0.getMinutes() - new Date(dates[result]).getMinutes()) / 10;
			//test
			var len = dates.length;
			if (result >= len) {
				// console.log("%c" + date + " | "+dates[0]+" - "+dates[len-1],"color:#ff0000");
			} else {
				// console.log("%c"+date + " | "+dates[0]+" - "+dates[len-1],"color:#e3e3e3");
			}
			return result;
		}
	}

	/**
	 * mapWidget
	 */
	var random = {
		// "park":
	}
	var count = 0;
	var timeInterval = 10;

	function MapWidgetController() {
		var self = this;
		var view = module.view.find(".mapWidget");
		 var pointMap = {			
			'安徽': [873*2, 572*2],
			'合肥市': [873*2, 572*2,"安徽省"],
			'蚌埠市': [873*2, 572*2,"安徽省"],
			'淮南市': [873*2, 572*2,"安徽省"],
			'淮北市': [873*2, 572*2,"安徽省"],
			'滁州市': [873*2, 572*2,"安徽省"],
			'安庆市': [873*2, 572*2,"安徽省"],
			'马鞍山市': [873*2, 572*2,"安徽省"],
			'阜阳市': [873*2, 572*2,"安徽省"],
			'芜湖市': [873*2, 572*2,"安徽省"],
			'六安市': [873*2, 572*2,"安徽省"],
			'铜陵市': [873*2, 572*2,"安徽省"],
			 
      		'北京': [859*2, 420*2],
			'北京市': [859*2, 420*2,,"北京"],
			
			'广东': [840*2, 746*2,],
			'惠州市': [840*2, 746*2,"广东省"],
			'佛山市': [840*2, 746*2,"广东省"],
			'河源市': [840*2, 746*2,"广东省"],
			'云浮市': [840*2, 746*2,"广东省"],
			'肇庆市': [840*2, 746*2,"广东省"],
						
			'贵州': [803*2, 603*2],
			'贵阳市': [803*2, 603*2,"贵州"],
			'遵义市': [803*2, 603*2,"贵州"],
			'铜仁市': [803*2, 603*2,"贵州"],
			'黔南布依族苗族自治州': [803*2, 603*2,"贵州"],
			'黔东南苗族侗族自治州': [803*2, 603*2,"贵州"],
			'六盘水市': [803*2, 603*2,"贵州"],
			
			
		  '河北': [836*2, 394*2],
			'唐山市': [836*2, 394*2,"河北省"],
			'保定市': [836*2, 394*2,"河北省"],
			'邯郸市': [836*2, 394*2,"河北省"],
			'邢台市': [836*2, 394*2,"河北省"],
			'廊坊市': [836*2, 394*2,"河北省"],
			'秦皇岛市': [836*2, 394*2,"河北省"],
			'石家庄市': [836*2, 394*2,"河北省"],
			'衡水市': [836*2, 394*2,"河北省"],
			
			'河南': [800*2,544*2],
			'郑州市': [800*2,544*2,"河南省"],
			'新乡市': [800*2,544*2,"河南省"],
			'洛阳市': [800*2,544*2,"河南省"],
			'信阳市': [800*2,544*2,"河南省"],
			'漯河市': [800*2,544*2,"河南省"],
			'安阳市': [800*2,544*2,"河南省"],	
			
			'黑龙江': [984*2, 240*2],
			'哈尔滨市': [984*2, 240*2,"黑龙江省"],
			'大庆市': [984*2, 240*2,"黑龙江省"],
			'齐齐哈尔市': [984*2, 240*2,"黑龙江省"],
			'绥化市': [984*2, 240*2,"黑龙江省"],
			'黑河市': [984*2, 240*2,"黑龙江省"],
			'佳木斯市': [984*2, 240*2,"黑龙江省"],
			'伊春市': [984*2, 240*2,"黑龙江省"],
			'双鸭山市': [984*2, 240*2,"黑龙江省"],
			
			'湖北': [795*2, 598*2],
			'武汉市': [795*2, 598*2,"湖北省"],
		
			'吉林': [990*2, 325*2],
			'吉林市': [990*2, 325*2,"吉林省"],
			'长春市': [990*2, 325*2,"吉林省"],
			'松原市': [990*2, 325*2,"吉林省"],
			
			'江苏': [923*2, 572*2],
			'无锡市': [923*2, 572*2,"江苏省"],
			'苏州市': [923*2, 572*2,"江苏省"],
			'南京市': [923*2, 572*2,"江苏省"],
			'常州市': [923*2, 572*2,"江苏省"],
			'扬州市': [923*2, 572*2,"江苏省"],
			'徐州市': [923*2, 572*2,"江苏省"],
			'盐城市': [923*2, 572*2,"江苏省"],
			'南通市': [923*2, 572*2,"江苏省"],
			'宿迁市': [923*2, 572*2,"江苏省"],
			'溧阳市': [923*2, 572*2,"江苏省"],
			'泰州市': [923*2, 572*2,"江苏省"],
			'镇江市': [923*2, 572*2,"江苏省"],
			
			'辽宁': [946*2, 375*2,"辽宁省"],
			'沈阳市': [946*2, 375*2,"辽宁省"],
			'大连市': [946*2, 375*2,"辽宁省"],
			'锦州市': [946*2, 375*2,"辽宁省"],
			'营口市': [946*2, 375*2,"辽宁省"],
			'葫芦岛市': [946*2, 375*2,"辽宁省"],
			'鞍山市': [946*2, 375*2,"辽宁省"],
			'抚顺市': [946*2, 375*2,"辽宁省"],
			'盘锦市': [946*2, 375*2,"辽宁省"],
			'朝阳市': [946*2, 375*2,"辽宁省"],
			'铁岭市': [946*2, 375*2,"辽宁省"],
			'辽阳市': [946*2, 375*2,"辽宁省"],
			'丹东市': [946*2, 375*2,"辽宁省"],
			
		  '内蒙古': [786*2, 387*2],
			'呼和浩特市': [786*2, 387*2,"内蒙古自治区"],
			'呼伦贝尔市': [786*2, 387*2,"内蒙古自治区"],
			 '乌鲁木齐市': [786*2, 387*2,"内蒙古自治区"],
			'包头市': [786*2, 387*2,"内蒙古自治区"],
			'通辽市': [786*2, 387*2,"内蒙古自治区"],
			'赤峰市': [786*2, 387*2,"内蒙古自治区"],

			
			
			'山东': [879*2, 468*2] ,
			'济南市': [879*2, 468*2,"山东省"],
			'青岛市': [879*2, 468*2,"山东省"],
			'泰安市': [879*2, 468*2,"山东省"],
			'济宁市': [879*2, 468*2,"山东省"],
			'烟台市': [879*2, 468*2,"山东省"],
			'聊城市': [879*2, 468*2,"山东省"],
			'潍坊市': [879*2, 468*2,"山东省"],
			'菏泽市': [879*2, 468*2,"山东省"],
			'东营市': [879*2, 468*2,"山东省"],
			'淄博市': [879*2, 468*2,"山东省"],
			'莱芜市': [879*2, 468*2,"山东省"],
			'枣庄市': [879*2, 468*2,"山东省"],
			'德州市': [879*2, 468*2,"山东省"],
			'威海市': [879*2, 468*2,"山东省"],
			'滨州市': [879*2, 468*2,"山东省"],
			
			
			'山西': [790*2, 480*2],
			'大同市': [790*2, 480*2,"山西省"],
			'太原市': [790*2, 480*2,"山西省"],
			'临汾市': [790*2, 480*2,"山西省"],
			'吕梁市': [790*2, 480*2,"山西省"],
			'运城市': [790*2, 480*2,"山西省"],
			'忻州市': [790*2, 480*2,"山西省"],
			'晋中市': [790*2, 480*2,"山西省"],
			'晋城市': [790*2, 480*2,"山西省"],
			'阳泉市': [790*2, 480*2,"山西省"],
							   
			'陕西': [740*2, 537*2,],
			'西安市': [740*2, 537*2,"陕西省"],
						
			'上海': [961*2, 595*2],
			'上海市': [961*2, 595*2],
			
			'四川': [633*2, 614*2],
			'德阳市': [633*2, 614*2,"四川省"],
			'成都市': [633*2, 614*2,"四川省"],
			'凉山自治州': [633*2, 614*2,"四川省"],
			'达州市': [633*2, 614*2,"四川省"],
			'内江市': [633*2, 614*2,"四川省"],
			'巴中市': [633*2, 614*2,"四川省"],
			'泸州市': [633*2, 614*2,"四川省"],
			'攀枝花市': [633*2, 614*2,"四川省"],
			'南充市': [633*2, 614*2,"四川省"],
			'自贡市': [633*2, 614*2,"四川省"],
			'雅安市': [633*2, 614*2,"四川省"],			 
			'宜宾市': [633*2, 614*2,"四川省"],
			'资阳市': [633*2, 614*2,"四川省"],
			'乐山市': [633*2, 614*2,"四川省"],
			'绵阳市': [633*2, 614*2,"四川省"],
			'广元市': [633*2, 614*2,"四川省"],
			'广安市': [633*2, 614*2,"四川省"],
			'眉山市': [633*2, 614*2,"四川省"],
			'凉山彝族自治州': [633*2, 614*2,"四川省"],
						
			'天津市': [869*2, 430*2],
								
			'云南': [620*2, 728*2],
			'昆明市': [620*2, 728*2,"云南省"],
			
						
			'浙江': [945*2, 630*2],
			'宁波市': [945*2, 630*2,"浙江省"],
			'杭州市': [945*2, 630*2,"浙江省"],
			'温州市': [945*2, 630*2,"浙江省"],
			'湖州市': [945*2, 630*2,"浙江省"],
			'嘉兴市': [945*2, 630*2,"浙江省"],
			'舟山市': [945*2, 630*2,"浙江省"],
			'重庆': [748*2, 603*2],
			'重庆市': [748*2, 603*2],
			'铜梁区县': [748*2, 603*2],
			
			
			'广西': [761*2, 739*2],
			'湖南': [779*2, 662*2],
		  	'江西': [862*2, 670*2],
			'新疆': [482*2, 394*2],
			'西藏': [463*2, 594*2],
			'青海': [531*2, 506*2],
			'甘肃': [658*2, 513*2],
			'宁夏': [696*2, 484*2],
			'澳门': [843*2, 774*2],
			'香港': [843*2, 774*2],
			'海南': [754*2, 844*2],
			'福建': [916*2, 691*2],
			'台湾': [954*2, 731*2],
		};

		
		var time = new Date();
		var totalNumObj = {}
		var currentPro = 0;


		
		if(navigator.platform == 'MacIntel'){
			$('#InfoItemUI  .item .detail').css('font-size',"60px");
		}
		
		window.localStorage.ip = 'http://10.129.39.58:8080/';
		//放款金额、件数
//		var threeTime = setInterval(function(){
//			var myDate = new Date();
//			var year = myDate.getFullYear();
//			var month = myDate.getMonth();
//			var day = myDate.getDate();
//			$.ajax({
//				//url: window.localStorage.ip + 'big_screen_branch/battle/getOCBattleCount.do?times='+year+'-'+(month+1)+'-'+day,
//				url:"../../../../data/0.json",
//				type: 'get',
//				success:(data) => {
//					var labels = module.view.find(".widget0 .content span");
//					var data = data.totalList[0]
//					labels.eq(0).text($.number(Number(data.fAppNoCount)))
//					labels.eq(1).text($.number(Number(data.famountCount)))
//				},
//				error: (error,b,c) => {
//					console.log(error)
//					console.log(b)
//					console.log(c)
//				}
//			})
//		},5000)
		var i = 0;

		var informationArr = [];

		/*setInterval(function(){
			console.log(informationArr)
			self.addInfo(informationArr[0]);
			informationArr.shift();
			if(informationArr.length == 0)
			{
				setTimeout(function(){
					askForSumData();
				},2000)
			}
		}, 1000);*/

		setInterval(function(){

			if(informationArr.length<=20){
				$.each(informationArr,function(i,val){
				//if(val.city != "铜仁市 " || val.city != "遵义市"){
					self.addInfo(informationArr[i]);
				//}

				})
			}else{
				for(var i=0;i<20;i++){
					//if(val.city != "铜仁市" || val.city != "遵义市"){
						self.addInfo(informationArr[i]);
					//}
                }
                //var length = informationArr.length-1;
                //for(var i=length;i>length-20;i--){
					//if(informationArr[i].city !== '铜仁市'||informationArr[i].city !== '遵义市'){
					//	self.addInfo(informationArr[i]);
					//}
                //}
			}
			
			if(informationArr.length != 0)
			{
				setTimeout(function(){
					//askForSumData(informationArr);
				},3500)
			}
			informationArr = [];

		},1000);


		setInterval(function(){
			//console.log("地图城市");

			$.ajax({
				//url: window.localStorage.ip+'big_screen_branch/battle/getOCBattle.do?times='+time1,
				//url:"http://10.129.223.172:8080/app/daping/getAreaMapAlert.gm",
				//url:"./mapjson.json",
				//url:"./data/demo10000.json",
				url:httpid+"mfy/monitor/getLoanProcInfo.gm",
				dataType:"json",
				type: 'get',
				success: (data)=>{
					//console.log("我是7");
					//console.log(data.data.length);
					//console.log(data.success);
					//console.log(data.data);
					//var data = data.totalList;
					/*for(var i=0;i<data.length;i++){
						informationArr.push(data[i])
					}*/
					/*var tempData = {
				        "age": "48",
				        "area": "中国 江西 南昌市",
				        "gender": "女",
				        "money": "8000.00",
				        "title": "美保宝76",
				        "total_invest": "2090",
				        "total_register": "1128740"
				    }*/
					//informationArr.push(data[0].data.datainfo.alertJsonData[0]);
					/*var newArr = [];
					for(var i=0;i<data.length;i++){
						if(data[i].city!=='遵义市'&&data[i].city!=='铜仁市'){
							newArr.push(data[i]);
							informationArr.push.apply(informationArr,newArr);
						}
					}*/
					var cityGome = ['合肥市', '蚌埠市', '淮南市', '淮北市', '滁州市', '安庆市', '马鞍山市', '阜阳市', '芜湖市', '六安市', '铜陵市', '北京市', '惠州市', '佛山市',
						'河源市', '云浮市', '肇庆市', '贵阳市', '遵义市', '铜仁市', '黔南布依族苗族自治州', '黔东南苗族侗族自治州', '六盘水市', '唐山市', '保定市',
						'邯郸市', '邢台市', '廊坊市', '秦皇岛市', '石家庄市', '衡水市', '郑州市', '新乡市', '洛阳市', '信阳市', '漯河市', '安阳市', '哈尔滨市', '大庆市', '齐齐哈尔市',
						'绥化市', '黑河市', '佳木斯市', '伊春市', '双鸭山市', '武汉市', '吉林市', '长春市', '松原市', '无锡市', '苏州市', '南京市', '常州市', '扬州市', '徐州市', '盐城市', '南通市', '宿迁市', '溧阳市', '泰州市', '镇江市', '沈阳市',
						'大连市', '锦州市', '营口市', '葫芦岛市', '鞍山市', '抚顺市', '盘锦市', '朝阳市', '铁岭市', '辽阳市', '丹东市', '呼和浩特市',
						'呼伦贝尔市', '乌鲁木齐市', '包头市', '通辽市', '赤峰市', '济南市', '青岛市', '泰安市', '济宁市', '烟台市', '聊城市',
						'潍坊市', '菏泽市', '东营市', '淄博市', '莱芜市', '枣庄市', '德州市', '威海市', '滨州市', '大同市', '太原市', '临汾市', '吕梁市', '运城市', '忻州市', '晋中市',
						'晋城市', '阳泉市', '西安市', '上海市', '德阳市', '成都市', '凉山自治州', '达州市', '内江市', '巴中市', '泸州市', '攀枝花市', '南充市', '自贡市', '雅安市', '宜宾市', '资阳市', '乐山市', '绵阳市', '广元市', '广安市', '眉山市', '凉山彝族自治州', '天津市', '昆明市', '宁波市', '杭州市', '温州市',
						'湖州市', '嘉兴市', '舟山市', '重庆市', '铜梁区县', '台湾', '广西', '湖南', '江西', '新疆', '西藏', '青海', '甘肃', '宁夏', '澳门', '香港', '海南',
						'福建'];
					//if(data.data.length!=0&&data.city!='遵义市'&&data.city!='铜仁市'){
					if(data.data.length!=0){
						//console.log("获得城市"+data.data.length);
						for(var i=0;i<data.data.length;i++){
							//console.log("判断"+data.data.length);
							if(cityGome.indexOf(data.data[i].city)!=-1){
								//console.log("我是7城市");
								//console.log("城市"+data.data[i].city);
								informationArr.push(data.data[i]);
							}
						}
						//informationArr.push.apply(informationArr,data.data);
					}
					//console.log(informationArr);
					//informationArr.push(data.data[0]);
				},
				error: (error,b,c) => {
					console.log(error)
					console.log(b)
					console.log(c)
				}
			})


		},5000);




		function g(id) {
			return document.getElementById(id);
		}

		var DirectionLast = ''
		this.addInfo = function(info) {
			// var key = info.area.split(' ')[1];
			var key = info.city;
			var pos = pointMap[key];
			//console.log(pos)
			//console.log(info)
			if (pos == undefined) trace("找不到位置:" + key);
			var bound = [1577, 1033];
			//var center = {x:bound[0]*0.5,y:bound[1]*0.5};
			var center = {
				x: pointMap['山西'][0],
				y: pointMap['重庆'][1]
			};

			var tx = pos[0];
			var ty = pos[1];
			var province = pos[2];
			info.province = province;
			//var tx = Math.random()*bound[0];
			//var ty = Math.random()*bound[1];
			function Has(value, arr){
				for(var i=0;i<arr.length;i++){
					if(value === arr[i])
						return true
				}
				return false
			}
			var direction;
			if (tx <= center.x && ty <= center.y) //左上
			{
				direction = "right-up";
			} else if (tx < center.x && ty > center.y) //左下
			{
				direction = "right-down";
			} else if (tx > center.x && ty < center.y) //右上
			{
				direction = "left-up";
			} else if (tx > center.x && ty > center.y) //右下
			{
				direction = "left-down";
			}
			if (info.city.indexOf('常州市') != -1
				|| info.city.indexOf('杭州市') != -1
				|| info.city.indexOf('哈尔滨市') != -1
				|| info.city.indexOf('沈阳市') != -1
				|| info.city.indexOf('大连市') != -1
				|| info.city.indexOf('锦州市') != -1
				|| info.city.indexOf('营口市') != -1
				|| info.city.indexOf('葫芦岛市') != -1
				|| info.city.indexOf('鞍山市') != -1
				|| info.city.indexOf('抚顺市') != -1
				|| info.city.indexOf('盘锦市') != -1
				|| info.city.indexOf('朝阳市') != -1
				|| info.city.indexOf('铁岭市') != -1
				|| info.city.indexOf('辽阳市') != -1
				|| info.city.indexOf('丹东市') != -1
				|| info.city.indexOf('上海市') != -1
				|| info.city.indexOf('宁波市') != -1
				|| info.city.indexOf('江西') != -1
				|| info.city.indexOf('温州市') != -1
				|| info.city.indexOf('湖州市') != -1
				|| info.city.indexOf('嘉兴市') != -1
				|| info.city.indexOf('舟山市') != -1
				|| info.city.indexOf('重庆市') != -1
				|| info.city.indexOf('铜梁区县') != -1
				|| info.city.indexOf('烟台市') != -1
				|| info.city.indexOf('江西') != -1
				|| info.city.indexOf('聊城市') != -1
				|| info.city.indexOf('潍坊市') != -1
				|| info.city.indexOf('菏泽市') != -1
				|| info.city.indexOf('东营市') != -1
				|| info.city.indexOf('淄博市') != -1
				|| info.city.indexOf('莱芜市') != -1
				|| info.city.indexOf('枣庄市') != -1
				|| info.city.indexOf('德州市') != -1
				|| info.city.indexOf('威海市') != -1
				|| info.city.indexOf('滨州市') != -1
				|| info.city.indexOf('黑龙江') != -1
				|| info.city.indexOf('吉林') != -1
				|| info.city.indexOf('辽宁') != -1
				|| info.city.indexOf('福建') != -1
				|| info.city.indexOf('安徽') != -1
				|| info.city.indexOf('合肥市') != -1
				|| info.city.indexOf('蚌埠市') != -1
				|| info.city.indexOf('淮南市') != -1
				|| info.city.indexOf('淮北市') != -1
				|| info.city.indexOf('滁州市') != -1
				|| info.city.indexOf('安庆市') != -1
				|| info.city.indexOf('马鞍山市') != -1
				|| info.city.indexOf('阜阳市') != -1
				|| info.city.indexOf('芜湖市') != -1
				|| info.city.indexOf('六安市') != -1
				|| info.city.indexOf('铜陵市') != -1
				|| info.city.indexOf('重庆') != -1
				|| info.city.indexOf('西安') != -1
				|| info.city.indexOf('忻州市') != -1
				|| info.city.indexOf('达州市') != -1
				|| info.city.indexOf('晋城市') != -1
				|| info.city.indexOf('大同市') != -1
				|| info.city.indexOf('吕梁市') != -1
				|| info.city.indexOf('阳泉市') != -1
				|| info.city.indexOf('西安市') != -1
				|| info.city.indexOf('晋中市') != -1
				|| info.city.indexOf('呼伦贝尔市') != -1
				|| info.city.indexOf('包头市') != -1
				|| info.city.indexOf('乌鲁木齐市') != -1
				|| info.city.indexOf('呼和浩特市') != -1
				|| info.city.indexOf('通辽市') != -1
				|| info.city.indexOf('赤峰市') != -1
				|| info.city.indexOf('武汉市') != -1

			) {
				direction = "left-up"
			}
			if (info.city.indexOf('鞍山市') != -1
				|| info.city.indexOf('南通市') != -1
				|| info.city.indexOf('无锡市')!= -1
				|| info.city.indexOf('苏州市')!= -1
				|| info.city.indexOf('遵义市')!= -1
				|| info.city.indexOf('铜仁市')!= -1
				|| info.city.indexOf('南京市')!= -1
				|| info.city.indexOf('广西')!= -1
				|| info.city.indexOf('海南')!= -1
				|| info.city.indexOf('澳门')!= -1
				|| info.city.indexOf('香港')!= -1
				|| info.city.indexOf('惠州市')!= -1
				|| info.city.indexOf('佛山市')!= -1
				|| info.city.indexOf('河源市')!= -1
				|| info.city.indexOf('云浮市')!= -1
				|| info.city.indexOf('肇庆市')!= -1
				|| info.city.indexOf('常州市')!= -1
				|| info.city.indexOf('贵阳市')!= -1
				|| info.city.indexOf('黔南布依族苗族自治州')!= -1
				|| info.city.indexOf('六盘水市')!= -1
				|| info.city.indexOf('唐山市') != -1
				|| info.city.indexOf('保定市') != -1
				|| info.city.indexOf('邯郸市') != -1
				|| info.city.indexOf('邢台市') != -1
				|| info.city.indexOf('廊坊市') != -1
				|| info.city.indexOf('秦皇岛市') != -1
				|| info.city.indexOf('石家庄市') != -1
				|| info.city.indexOf('天津市') != -1
				|| info.city.indexOf('衡水市') != -1
				|| info.city.indexOf('郑州市') != -1
				|| info.city.indexOf('新乡市') != -1
				|| info.city.indexOf('洛阳市') != -1
				|| info.city.indexOf('信阳市') != -1
				|| info.city.indexOf('漯河市') != -1
				|| info.city.indexOf('安阳市') != -1
				|| info.city.indexOf('安阳市') != -1
				|| info.city.indexOf('北京市') != -1
				|| info.city.indexOf('哈尔滨市') != -1
				|| info.city.indexOf('大庆市') != -1
				|| info.city.indexOf('齐齐哈尔市') != -1
				|| info.city.indexOf('绥化市') != -1
				|| info.city.indexOf('黑河市') != -1
				|| info.city.indexOf('佳木斯市') != -1
				|| info.city.indexOf('伊春市') != -1
				|| info.city.indexOf('双鸭山市') != -1
				|| info.city.indexOf('吉林市') != -1
				|| info.city.indexOf('长春市') != -1
				|| info.city.indexOf('松原市') != -1
				|| info.city.indexOf('宿迁市') != -1
				|| info.city.indexOf('溧阳市') != -1
				|| info.city.indexOf('泰州市') != -1
				|| info.city.indexOf('镇江市') != -1
				|| info.city.indexOf('扬州市')!= -1
				|| info.city.indexOf('徐州市')!= -1
				|| info.city.indexOf('盐城市')!= -1
				|| info.city.indexOf('太原市')!= -1
				|| info.city.indexOf('临汾市')!= -1
				|| info.city.indexOf('吕梁市')!= -1
				|| info.city.indexOf('运城市')!= -1
				|| info.city.indexOf('忻州市')!= -1
				|| info.city.indexOf('晋中市')!= -1
				|| info.city.indexOf('晋城市')!= -1
				|| info.city.indexOf('成都市')!= -1
				|| info.city.indexOf('凉山自治州')!= -1
				|| info.city.indexOf('达州市')!= -1
				|| info.city.indexOf('内江市')!= -1
				|| info.city.indexOf('巴中市')!= -1
				|| info.city.indexOf('泸州市')!= -1
				|| info.city.indexOf('攀枝花市')!= -1
				|| info.city.indexOf('南充市')!= -1
				|| info.city.indexOf('自贡市')!= -1
				|| info.city.indexOf('雅安市')!= -1
				|| info.city.indexOf('宜宾市')!= -1
				|| info.city.indexOf('资阳市')!= -1
				|| info.city.indexOf('宜宾市')!= -1
				|| info.city.indexOf('乐山市')!= -1
				|| info.city.indexOf('绵阳市')!= -1
				|| info.city.indexOf('广元市')!= -1
				|| info.city.indexOf('广安市')!= -1
				|| info.city.indexOf('眉山市')!= -1
				|| info.city.indexOf('凉山彝族自治州')!= -1
				|| info.city.indexOf('黔东南苗族侗族自治州')!= -1


			) {
				direction = "left-down"
			}
			/*if (info.city.indexOf('遵义市') != -1
			|| info.city.indexOf('铜仁市') != -1)
			{
				direction = "left-down";
			}*/
			if (info.city.indexOf('新疆') != -1
				|| info.city.indexOf('青海')!= -1
				|| info.city.indexOf('甘肃')!= -1
				|| info.city.indexOf('宁夏')!= -1
			) {
				direction = "right-up"
			}
			if (info.city.indexOf('西藏') != -1
				|| info.city.indexOf('昆明市')!= -1
				|| info.city.indexOf('广西')!= -1
				|| info.city.indexOf('湖南')!= -1

			) {
				direction = "right-down"
			}
			DirectionLast = direction;
			var infoItem = new InfoItem(info);
			infoItem.show(view, {
				x: tx,
				y: ty
			}, direction);

			// module.controllers[0].setDataSource(info);
			// module.controllers[7].setAmount_hit(info.amount_hit);
		}


		function InfoItem(option) {
			this.view = module.view.find("#InfoItemUI").find('.item').clone();
			var lines = this.view.find(".lines img");
			var detail = this.view.find(".detail");
			//console.log(detail);
			var pointer = this.view.find(".pointer");
			var line;

			bindData();

			function bindData() {
				var areaLabel = detail.find(".area");
				var moneyLabel = detail.find(".money");
				var genderLabel = detail.find(".gender");
				var ageLabel = detail.find(".age");
				var proLabel = detail.find(".product");
				if(option.production.length >15){
					option.production = option.production.slice(0,14)
				}
				var area = option.city;
				areaLabel.text('省市 : ' +"  "+area);
				moneyLabel.text('金额 : ' + option.money + ' 元');
				genderLabel.text('性别 : ' + option.gender);
				ageLabel.text('年龄 : ' + option.age + ' 岁');
				proLabel.text('产品 : ' + option.production);
			}

			this.show = function(container, position, direction) {
				this.view.appendTo(container);
				this.view.css("left", position.x);
				this.view.css("top", position.y);
				lines.hide();
				switch (direction) {
					case "left-up":
						line = lines.eq(2);
						line.show();
						line.css("left", -340);
						line.css("top", -110);

						var tx = parseInt(line.css("left")) - detail.outerWidth() + 5;
						var ty = parseInt(line.css("top")) - detail.outerHeight() * 0.5 + 10;
						break;
					case "left-down":
						line = lines.eq(3);
						line.show();
						line.css("left", -346);
						line.css("top", 22);
						var tx = parseInt(line.css("left")) - detail.outerWidth() + 5;
						var ty = parseInt(line.css("top")) + line.outerHeight() - detail.outerHeight() * 0.5 - 10;
						break;
					case "right-up":
						line = lines.eq(0);
						line.show();
						line.css("left", 20);
						line.css("top", -190);
						var tx = parseInt(line.css("left")) + line.outerWidth() - 5;
						var ty = parseInt(line.css("top")) - detail.outerHeight() * 0.5 + 10;
						break;
					case "right-down":
						line = lines.eq(1);
						line.show();
						line.css("left", 70);
						line.css("top", 70);
						var tx = parseInt(line.css("left")) + line.outerWidth();
						var ty = parseInt(line.css("top")) + line.outerHeight() - detail.outerHeight() * 0.5 - 10;
						break;
				}
				if (direction == 'left-down' || direction == 'left-up') {
					detail.css("left", tx + 85);
				} else if (direction == "right-down") {
					detail.css("left", tx)
				} else if (direction == "right-up") {
					detail.css("left", tx + 10)
				}
				detail.css("top", ty);

				TweenLite.from(pointer, 0.8, {
					scale: 0,
					ease: Expo.easeInOut
				});
				TweenLite.from(line, 0.3, {
					alpha: 0,
					ease: Expo.easeInOut,
					delay: 0.5
				});
				TweenLite.from(detail, 0.5, {
					scale: 0,
					alpha: 0,
					ease: Expo.easeInOut,
					delay: 0.5
				});

				var _self = this;
				TweenLite.delayedCall(3, function() {
					_self.hide();
				});
			}
			this.hide = function() {
				var _self = this;
				TweenLite.to(detail, 0.3, {
					scale: 0,
					alpha: 0,
					ease: Expo.easeInOut
				});
				TweenLite.to(line, 0.1, {
					alpha: 0,
					ease: Expo.easeInOut,
					delay: 0.1
				});
				TweenLite.to(pointer, 0.3, {
					scale: 0,
					alpha: 0,
					ease: Expo.easeInOut,
					delay: 0.2,
					onComplete: function() {
						_self.view.remove();
					}
				});
			}
		}
	}
}