App.CountController = function(option)
{
	var self = this;
	var view = option.view;
	
	var totalLabel = view.find(".header .title span:first-child");
	var line = view.find(".line");
	
	var navController = new NavController();
	var detailController = new DetailController();
	var looper;
	
	//init
	line.hide();
	
	new App.IntervalLoader({
		duration:60*60,
		url:option.url
	},function(data){
		self.setDataSource(data.data);
	});
	
	this.setDataSource = function(ds)
	{
		totalLabel.text($.number(ds.total));
		line.hide();
		navController.setDataSource(ds.data);
		detailController.reset();
		
		if(looper!=undefined)looper.stop();
		var funcArr = (function(){
			var arr = [];
			var len = navController.data.length;
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
		navController.showIdx(idx);
		line.show();
		TweenLite.fromTo(line,1,{scale:0},{scale:1,ease:Cubic.easeOut});
		detailController.showData(navController.data[idx].children);
	}
	
	/**
	 * 导航
	 */
	function NavController()
	{
		var container = view.find(".container");
		var leftList = container.find(".leftList");
		var rightList = container.find(".rightList");
		
		var lineCanvas = $("<canvas>");
		lineCanvas.get(0).width = 730;
		lineCanvas.get(0).height = 500;
		lineCanvas.css("position","absolute");
		lineCanvas.appendTo(container);
		
		var items = [];
		var dots = [];
		
		var circleContainer = container.find(".circleContainer");
		var circle = circleContainer.find(".circle");
		var valueLabel = circleContainer.find(".label");
		
		this.setDataSource = function(ds)
		{
			this.data = ds;
			this.clear();
			var len = ds.length;
			for(var i=0;i<len;i++)
			{
				var itemData = ds[i];
				itemData.idx = i;
				var item = new NavItem(itemData);
				item.view.appendTo(i<(len-1)/2 ? leftList : rightList);
				items.push(item);
			}
			
			//test
			var centerDot = new Dot();
			centerDot.view.appendTo(circleContainer);
			centerDot.view.css("left",155);
			centerDot.view.css("top",155);
			
			for(var i=0;i<len;i++)
			{
				var dot = new Dot();
				dot.view.appendTo(circleContainer);
				var tx,ty,min,max,r;
				var radius = 95;
				var half = Math.floor((len-1)/2);
				var spacing = 30;
				if(i<half)
				{
					min = 0+spacing;
					max = 180-spacing;
					r = min + (max-min)/(half-1)*i;
					r = r/180*Math.PI;
					r = r + Math.PI;
				}
				else
				{
					min = 0+spacing;
					max = 180-spacing;
					r = min + (max-min)/(len-half-1)*(i-half);
					r = r/180*Math.PI;
					r = Math.PI - r;
				}
				tx = 155 + Math.sin(r)*radius;
				ty = 155 + Math.cos(r)*radius;
				dot.view.css("left",tx);
				dot.view.css("top",ty);
				dot.r = r;
				dots.push(dot);
			}
		}
		
		this.clear = function()
		{
			leftList.empty();
			rightList.empty();
			items = [];
			circle.circleProgress({value:0,animate:false});
			
			while(dots.length>0)
			{
				var dot = dots[0];
				dot.view.remove();
				dots.shift();
			}
			
			var context = lineCanvas.get(0).getContext('2d');
			context.beginPath();
			context.clearRect(0,0,lineCanvas.width(),lineCanvas.height());
		}
		
		this.showIdx = function(idx)
		{
			var rate = items[idx].data.rate;
			valueLabel.text(Math.round(rate*10000)/100);
			var angle = Math.PI/2 - dots[idx].r;
			var half = Math.floor((items.length-1)/2);
			var reverse = idx<half ? true : false;
			if(reverse)
			{
				angle+=Math.PI*2*rate*0.5;
			}
			else
			{
				angle-=Math.PI*2*rate*0.5;
			}
			circle.circleProgress({value:rate,startAngle:angle,reverse:reverse});
			drawLine();
			
			function drawLine()
			{
				var p0 = {
					x:parseInt(items[idx].view.parent().css("left")),
					y:parseInt(items[idx].view.parent().css("top")) + items[idx].view.outerHeight()*(reverse ? idx+1 : idx-half+1)
				};
				
				var p1 = {
					x:parseInt(circleContainer.css("left")) + parseInt(dots[idx].view.css("left")),
					y:parseInt(circleContainer.css("top")) + parseInt(dots[idx].view.css("top")),
				};
				
				var context = lineCanvas.get(0).getContext('2d');
				context.beginPath();
				context.clearRect(0,0,lineCanvas.width(),lineCanvas.height());
				context.save();
				context.strokeStyle = "#FFFFFF";
				context.lineWidth = 2;
				if(reverse)
				{
					context.moveTo(p0.x,p0.y);
					context.lineTo(p0.x+200,p0.y);
					context.lineTo(p1.x,p1.y);
				}
				else
				{
					context.moveTo(p0.x+100,p0.y);
					context.lineTo(p0.x-100,p0.y);
					context.lineTo(p1.x,p1.y);
				}
				context.stroke();
				context.restore();
				TweenLite.fromTo(lineCanvas,1,{alpha:0},{alpha:1});
			}
		}
		
		//测试点
		function Dot()
		{
			this.view = $("<div>");
			this.view.css("position","absolute");
			var skin = $("<div>");
			skin.width(10);
			skin.height(10);
			skin.css("position","absolute");
			skin.css("left",-5);
			skin.css("top",-5);
			skin.css("background","#FFFFFF");
			skin.css("border-radius",5);
			skin.appendTo(this.view);
			//skin.css("opacity",0.2);
			skin.hide();
		}
	}
	
	function NavItem(data)
	{
		this.data = data;
		this.view = $("<div>");
		this.view.addClass("item");
		this.view.html("<span style='font-family: NeoTechStd-Regular;'>"+(data.idx+1)+'</span>'+"、"+data.category);
	}
	
	/**
	 * 详情
	 */
	function DetailController()
	{
		var container = view.find(".details");
		var circles = container.find("div");
		circles.circleProgress({startAngle:-Math.PI/2});
		
		this.reset = function()
		{
			$.each(circles,function(){
				$(this).circleProgress({value:0,animate:false});
				$(this).find("label").text("");
				$(this).hide();
			});
		}
		
		this.showData = function(ds)
		{
			
			$.each(circles,function(i){
				$(this).show();
				var info = ds[i];
				info = info == undefined ? {category:"",rate:0} : info;
				$(this).circleProgress({value:info.rate});
				var label = $(this).find("label");
				label.css("height","auto");
				label.text(info.category);
				var th = label.height();
				th = th > 35 ? 35 : th;
				label.height(th);
				var ty = -60;
				ty+=(35-th)*0.5;
				label.css("margin-top",ty);
				label.css("overflow","hidden");
			});
			TweenLite.set(circles,{scale:1,alpha:1});
			TweenMax.staggerFrom(circles, 2, {scale:0,alpha:0,ease:Elastic.easeOut,force3D:true}, 0.06);
		}
		
		this.reset();
	}
}