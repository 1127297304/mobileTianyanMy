/**
 * Variety - 用户
 */

App.UserModule = function(size)
{
	App.ModuleBase.call(this,size);
	
	var module = this;
	
	this.getPreloadAssets = function()
	{
		return [
			{type:"html",url:"assets/data/modules/user.html"}
		];
	}
	
	this.initView = function()
	{
		var controllers = [
			new Widget0Controller(),
			new AavatarController(),
			new Widget1Controller({
				view:module.view.find(".widget1"),
				key:"ec_indus"
			}),
			new Widget2Controller(),
			new Widget3Controller(),
			new Widget4Controller({
				view:module.view.find(".widget4"),
				key:"media_indus"
			}),
			new Widget5Controller(),
			new Widget6Controller(),
			new Widget7Controller()
		];
		new NavController(function(data){
			$.each(controllers,function(){
				this.setDataSource(data);
			});
		});
	}
	
	/** 
	 * 导航
	 */
	function NavController(onSelect)
	{
		var self = this;
		
		var view = module.view.find(".navWidget");
		var items = view.find(".item");
		
		var selectedIdx = -1;
		var looper;
		
		new App.IntervalLoader({
			duration:60*60,
			url:App.Config.request.user
		},function(data){
			self.setDataSource(data.data);
		});
		
		$(document).on('ExternalCall',function(e,data){
			var msg = JSON.parse(data);
			var cmd = msg.cmd;
			switch(cmd)
			{
				case "userPlay":
				looper.stop();
				looper.setIdx(selectedIdx);
				looper.start();
				break;
				case "userStop":
				looper.stop();
				break;
				case "showUser":
				var idx = msg.idx;
				self.showIdx(idx);
				looper.setIdx(idx);
				break;
			}
		});
		
		this.setDataSource = function(ds)
		{
			this.ds = ds;
			
			items.each(function(i){
				self.ds[i].idx = i;
			});
			
			if(looper!=undefined)looper.stop();
			var funcArr = (function(){
				var arr = [];
				var len = ds.length;
				for(var i=0;i<len;i++)
				{
					arr.push(new Handler(i).func);
				}
				
				function Handler(idx)
				{
					this.func = function(){self.showIdx(idx);};
				}
				return arr;
			})();
			looper = new App.Looper(5,funcArr);
			looper.start();
		}
		
		this.showIdx = function(idx)
		{
			var item;
			if(selectedIdx>-1)
			{
				item = items.eq(selectedIdx);
				item.removeClass("selected");
			}
			item = items.eq(idx);
			item.addClass("selected");
			selectedIdx = idx;
			onSelect(this.ds[idx]);
		}
	}
	
	/**
	 * widget0
	 */
	function Widget0Controller()
	{
		var view = module.view.find(".widget0");
		
		var idxLabel = view.find(".idx");
		var uidLabel = view.find(".header .uid");
		
		this.setDataSource = function(ds)
		{
			idxLabel.text("U"+(ds.idx+1));
			uidLabel.text(ds.gid);
		}
	}
	
	/**
	 * avatar
	 */
	function AavatarController()
	{
		var container = module.view.find(".avatarWidget");
		this.setDataSource = function(ds)
		{
			container.find("img").hide();
			var idx = ds.sex == "男" ? 0 : 1;
			container.find("img").eq(idx).show();
		}
	}
	
	/**
	 * widget1
	 */
	function Widget1Controller(option)
	{
		var container = option.view.find(".content p");
		this.setDataSource = function(ds)
		{
			var arr = ds.value[option.key];
			var max = 20;
			if(arr.length > max)arr = arr.slice(0,max);
			container.text(arr.join(" | "));
		}
	}
	
	/**
	 * widget2
	 */
	function Widget2Controller()
	{
		var view = module.view.find(".widget2");
		var chart = view.find(".chart0");
		var bars = chart.find(".bar");
		var canvas = chart.find("canvas");
		var labels = chart.find(".label");
		var dots = chart.find(".dot");
		var valueLabels = [];
		
		bars.each(function(i){
			var bar = $(this);
			setBarHeight(bar,0);
			var dot = dots.eq(i);
			dot.show();
			
			var valueLabel = $("<div>",{style:"position:absolute;color:#ffffff;font-size:12px;font-family:'NeoTechStd-Regular';"});
			valueLabel.appendTo(chart);
			valueLabels.push(valueLabel);
			valueLabel.text(0);
			
			bindDot(dot,bar,valueLabel);
		});
		
		function setBarHeight(bar,h)
		{
			bar.height(h);
			bar.css("top",132+28-bar.height());
		}
		
		function bindDot(dot,bar,valueLabel)
		{
			dot.css("left",parseInt(bar.css("left"))+bar.width()*0.5);
			dot.css("top",bar.css("top"));
			
			valueLabel.css("left",parseInt(dot.css("left")) - valueLabel.width()*0.5);
			valueLabel.css("top",parseInt(dot.css("top")) - valueLabel.height() - 10);
		}
		
		this.setDataSource = function(ds)
		{
			var arr = ds.value.consumer;
			
			var max = (function(){
				var result = 0;
				for(var i=0;i<arr.length;i++)
				{
					result = Number(arr[i].value) > result ? Number(arr[i].value) : result;
				}
				return result;
			})();
				
			for(var i=0;i<arr.length;i++)
			{
				var item = arr[i];
				labels.eq(i).text(monthFormat(item.date));
				var bar = bars.eq(i);
				var obj = {
					value:bar.height()/132
				};
				TweenLite.to(obj,0.5,{value:item.value/max,onUpdateParams:[bar,obj,i],onUpdate:function(_bar,_obj,_i){
					setBarHeight(_bar,_obj.value*132);
					var dot = dots.eq(_i);
					var valueLabel = valueLabels[_i];
					valueLabel.text(Math.round(_obj.value*max));
					bindDot(dot,_bar,valueLabel);
					updateLine();
				}});
			}
			
			function updateLine()
			{
				var ctx = canvas.get(0).getContext('2d');
				ctx.beginPath();
				ctx.clearRect(0,0,canvas.width(),canvas.height());
				ctx.strokeStyle = "#ff8a00";
				ctx.lineWidth = 3;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				for(var i=0;i<bars.length;i++)
				{
					var bar = bars.eq(i);
					var tx = parseInt(bar.css("left")) + bar.width()*0.5;
					var ty = parseInt(bar.css("top"));
					if(i == 0)
					{
						ctx.moveTo(tx,ty);
					}
					else
					{
						ctx.lineTo(tx,ty);
					}
				}
				ctx.stroke();
			}
			
			function monthFormat(str) //2015-01
			{
				var m = str.split("-")[1];
				return {
					"01":"一",
					"02":"二",
					"03":"三",
					"04":"四",
					"05":"五",
					"06":"六",
					"07":"七",
					"08":"八",
					"09":"九",
					"10":"十",
					"11":"十一",
					"12":"十二"
				}[m] + "月";
			}
		}
	}
	
	/**
	 * widget3
	 */
	function Widget3Controller()
	{
		var view = module.view.find(".widget3");
		var container = view.find(".container");
		
		var chart = echarts.init(container.get(0));
		
		this.setDataSource = function(ds)
		{
			var option = {
			    series : [
			        {
			            type: 'pie',
			            radius: '65%',
			            data:[],
			            roseType: true,
			            label: {
			                normal: {
			                    textStyle: {
			                        color: 'rgba(255, 255, 255, 0.3)'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    lineStyle: {
			                        color: 'rgba(255, 255, 255, 0.3)'
			                    }
			                }
			            }
			        }
			    ]
			};
			
			var arr = ds.value.structure;
			var len = arr.length;
			for(var i=0;i<len;i++)
			{
				var itemStyle = {
					normal:{
						color:["#ff8a00","#35BFFF","#ffffff"][i%3],
			            shadowBlur: 0,
			            shadowColor: 'rgba(0, 0, 0, 1)'
					}
				};
				option.series[0].data.push({value:arr[i].value,name:arr[i].category,itemStyle:itemStyle});
			}
			
			chart.setOption(option);
		}
	}
	
	/**
	 * widget4
	 */
	function Widget4Controller(option)
	{
		Widget1Controller.call(this,option);
	}
	
	/**
	 * widget5
	 */
	function Widget5Controller()
	{
		var view = module.view.find(".widget5");
		var container = view.find(".area");
		var chart = echarts.init(container.get(0));
		
		var option = {
		    geo: {
		    	map: 'china',
		        label: {
		            emphasis: {
		                show: false
		            }
		        },
		        roam: false,
		        itemStyle: {
		            normal: {
		                areaColor: '#323c48',
		                borderColor: '#111'
		            },
		            emphasis: {
		                areaColor: '#2a333d'
		            }
		        },
		        top:50
		    },
		    series:[{
		    	type:'effectScatter',
		    	coordinateSystem:'geo',
		    	data:[],
		    	showEffectOn: 'render'
		    }],
		    animation:false
		};
		chart.setOption(option);
		
		this.setDataSource = function(ds)
		{
			option.series[0].data = [];
			var arr = ds.value.dg_info;
			for(var i=0;i<arr.length;i++)
			{
				var item = arr[i];
				var obj = {
					name:item.area,
					value:[item.lat,item.lng],
					itemStyle:{
						normal:{
							color: '#35BFFF',
							shadowBlur: 10,
							shadowColor: '#333'
						}
					},
					rippleEffect:{
						brushType: 'stroke',
						scale:20*item.weight
					}
				};
				option.series[0].data.push(obj);
			}
			chart.setOption(option);
		}
	}
	
	/**
	 * widget6
	 */
	function Widget6Controller()
	{
		var view = module.view.find(".widget6");
		var container = view.find(".container");
		
		var canvas = $("<canvas>");
		canvas.get(0).width = container.width();
		canvas.get(0).height = container.height();
		canvas.appendTo(container);
		
		var ctx = canvas.get(0).getContext('2d');
		var chart;
		
		this.setDataSource = function(ds)
		{
			var arr = ds.value.internet;
			if(chart == undefined)
			{
				var data = {
					labels : [],
					datasets : [
						{
							fillColor : "rgba(151,187,205,0.3)",
							strokeColor : "rgba(151,187,205,1)",
							pointColor : "rgba(151,187,205,1)",
							pointStrokeColor : "#fff",
							data : []
						}
					]
				};
				
				for(var i=0;i<arr.length;i++)
				{
					var item = arr[i];
					data.labels.push(item.date+":00");
					data.datasets[0].data.push(item.value);
				}
				
				var option = {
					pointDotRadius : 2,
					animationSteps:30,
					scaleFontSize : 12,
					scaleShowLabels:false
				};
				chart = new Chart(ctx).Line(data,option);
			}
			else
			{
				for(var i=0;i<arr.length;i++)
				{
					chart.datasets[0].points[i].value = arr[i].value;
				}
				chart.update();
			}
		}
	}
	
	/**
	 * widget7
	 */
	function Widget7Controller()
	{
		var view = module.view.find(".widget7");
		var container = view.find(".container");
		
		var canvas = $("<canvas>");
		canvas.get(0).width = container.width();
		canvas.get(0).height = container.height();
		canvas.appendTo(container);
		
		var ctx = canvas.get(0).getContext('2d');
		var chart;
		
		this.setDataSource = function(ds)
		{
			var arr = ds.value.news;
			if(chart == undefined)
			{
				var data = {
					labels : [],
					datasets : [
						{
							fillColor : "rgba(151,187,205,0.3)",
							strokeColor : "rgba(151,187,205,1)",
							pointColor : "rgba(151,187,205,1)",
							pointStrokeColor : "#fff",
							data : []
						}
					]
				};
				
				for(var i=0;i<arr.length;i++)
				{
					var item = arr[i];
					data.labels.push(item.category);
					data.datasets[0].data.push(item.value);
				}
				
				var option = {
					pointDotRadius : 2,
					animationSteps:30,
					scaleFontFamily:"黑体",
					scaleShowLabels:false
				};
				chart = new Chart(ctx).Line(data,option);
			}
			else
			{
				for(var i=0;i<arr.length;i++)
				{
					chart.datasets[0].points[i].value = arr[i].value;
				}
				chart.update();
			}
		}
	}
}
