/*
 * 销量走势
 */
App.SalesController = function(option)
{
	var self = this;
	var view = option.view;
		var labels = option.labels;
		var lightIdx = option.lightIdx;
		var chart = view.find(".chart");

		var lightView = $("<div>",{style:"width:80px;height:250px;position:absolute;background:url(assets/images/goods/light.png);top:0px;"});
		var paper = Raphael(chart.get(0),chart.width(),chart.height());
		lightView.prependTo(chart);
		var paddingTop = 32;
		var paddingBottom = 36 + paddingTop;
		var bigCircles=[],smallCircles=[];
		var maxHeight = chart.height()-paddingBottom - paddingTop;
		var pathStr = "";
		var len = 8;

		for(var i=0;i<len;i++)
		{
			var tx = 41 + (41*2)*i + (chart.width()-41*2*len)/(len-1)*i;
			var ty = chart.height()-paddingBottom;
			var circle = paper.circle(tx, ty, i == lightIdx+1 ? 30 : 15);
			circle.attr("stroke", i == lightIdx+1 ? "#61C5D6" : "#C7C8CC");
			circle.attr("stroke-width", i == lightIdx+1 ? 3 : 2);
			bigCircles.push(circle);
			pathStr += (i==0?"M":"L")+tx+","+ty;
		}
		var path = paper.path(pathStr);
		path.attr("stroke", "#C7C8CC");
		path.attr("stroke-width", 2);

		for(var i=0;i<len;i++)
		{
			var tx = bigCircles[i].attr("cx");
			var ty = bigCircles[i].attr("cy");
			var circle = paper.circle(tx, ty, 5);
			circle.attr("fill", i == lightIdx+1 ? "#61C5D6" : "#C7C8CC");
			smallCircles.push(circle);

			//创建文本
			var label = $("<div>");
			label.css("position","absolute");
			label.css("color",i == lightIdx+1 ? "#61C5D6" : "#C7C8CC");
			label.width(82);
			label.appendTo(chart);
			label.text(labels[i]);
			label.css("left",tx-41);
			label.css("top",240);
			label.css("font-size",25);
			label.css("font-family","黑体");
			label.css("text-align","center");

			if(i == lightIdx)
			{
				lightView.css("left",tx+50);
			}
		}
		this.setDataSource = function(ds)
		{
			// var arr = option.sortData(ds);
			var arrTotal ={
				"1":{
					"neg":[
						[10152, 11774, 17678, 11137, 17482, 17023, 17471, 10411],
						[9900, 13014, 12388, 15185, 15576, 10920, 16169, 13204],
						[11162, 14983, 16354, 17321, 17071, 15869, 12245, 14814]
					],
					"pos":[
						[14119, 16393, 17810, 16513, 15159, 12007, 12008, 12665],
						[16652, 17465, 17935, 10452, 10735, 17796, 15392, 17148],
						[13708, 15180, 15665, 15678, 17823, 12372, 9676, 14162]
					]
				},
				"2":{
					"neg":[
						[11974, 16413, 15509, 11489, 14145, 10393, 14263, 13764],
						[15360, 11626, 9906, 10844, 13671, 10720, 11148, 12353],
						[17218, 16689, 17286, 10596, 13466, 13522, 14417, 17333]
					],
					"pos":[
						[12412, 12030, 15693, 15321, 14136, 12166, 14398, 16143],
						[13638, 10338, 16594, 13018, 10816, 16917, 12465, 16240],
						[17635, 13745, 15054, 12958, 17284, 12897, 10959, 13349]
					]
				},
				"3":{
					"neg":[
						[17917, 12523, 10188, 14921, 17898, 15934, 16315, 15658],
						[16716, 14621, 11402, 11457, 9770, 15374, 14477, 9922],
						[17644, 12616, 15239, 11378, 16339, 17060, 12449, 12550]
					],
					"pos":[
						[14709, 12500, 14498, 15701, 13812, 9934, 17986, 10422],
						[10155, 17552, 11432, 10793, 13725, 13221, 10365, 11882],
						[13888, 10227, 12620, 16837, 10275, 17606, 17576, 17492]
					]
				},
				"4":{
					"neg":[
						[9830, 17697, 13868, 14895, 10483, 13634, 11265, 13608],
						[13415, 13698, 10768, 11863, 16684, 10292, 9870, 16009],
						[17154, 12844, 15206, 10358, 17978, 14195, 16127, 12169]
					],
					"pos":[
						[16559, 16991, 17107, 16660, 16103, 12036, 14047, 11544],
						[11315, 17950, 11696, 14867, 16756, 10129, 17242, 15769],
						[10382, 14422, 16306, 17227, 17852, 12578, 10687, 17497]
					]
				},
				"5":{
					"neg":[
						[14693, 14602, 12145, 11116, 14760, 11883, 16043, 16151],
						[16542, 17491, 17535, 10254, 17417, 12199, 12367, 10006],
						[16945, 16579, 12811, 17120, 14309, 16238, 13413, 13341]
					],
					"pos":[
						[11576, 14639, 16850, 13369, 17057, 9900, 10687, 17711],
						[16996, 15050, 11566, 10362, 11051, 17424, 14345, 16865],
						[13722, 9974, 13632, 13916, 11050, 15007, 11507, 14617]
					]
				},
			}
		    socket.on('chatmessage', function(msg){
		    	localStorage.count = msg;
		    })

			var i = Math.ceil(localStorage.count/10)
			if(i == 0) i =1;
			var arr = [];
			if(arguments[1] == '1'){
				arr = arrTotal[i]["neg"][0]
			}else{
				arr = arrTotal[i]["pos"][0]
			}
			var max = (function(){
				var result = 0;
				for(var i=0;i<arr.length;i++)
				{
					result = arr[i] > result ? arr[i] : result;
				}
				return result;
			})();
			for(var i=0;i<arr.length;i++)
			{
				var percent = arr[i] / max;
				var ty = paddingTop+(1-percent)*maxHeight;
				TweenLite.to([bigCircles[i],smallCircles[i]],1,{raphael:{cy:ty},onUpdate:updatePath,ease:Expo.easeInOut});
			}

			function updatePath()
			{
				var pathStr = "";
				for(var i=0;i<bigCircles.length;i++)
				{
					var circle = bigCircles[i];
					var tx = circle.attr("cx");
					var ty = circle.attr("cy");
					pathStr += (i==0?"M":"L")+tx+","+ty;
				}
				path.attr("path",pathStr);
			}
		}

}
