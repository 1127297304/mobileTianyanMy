App.ClassController = function(option)
{
	var self = this;
	var view = option.view;
	
	var navController = new NavController();
	var chartController = new ChartController();
	
	var looper;
	
	//init
	new App.IntervalLoader({
		duration:60*60,
		url:option.url
	},function(data){
		self.setDataSource(data.data);
	});
	
	this.setDataSource = function(ds)
	{
		navController.setDataSource(ds);
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
		navController.selectIdx(idx);
		var ds = navController.data[idx].category;
		chartController.setDataSource(ds);
	}
	
	/**
	 * 导航
	 */
	function NavController()
	{
		var items = view.find(".nav ul li");
		var selectedIdx = -1;
		
		items.each(function(){
			var vline = $("<div>");
			vline.width(1);
			vline.height(20);
			vline.css("position","absolute");
			vline.prependTo($(this));
			vline.css("background","#FFFFFF");
			vline.css("opacity",0.3);
			vline.css("margin-left",12);
			vline.css("margin-top",-20);
			vline.hide();
		});
		
		this.setDataSource = function(ds)
		{
			this.data = ds;
			items.each(function(i){
				var label = $(this).find("label");
				var dot = $(this).find("div").eq(1);
				label.text(monthFormat(ds[i].date));
				var tx = -(label.outerWidth() - dot.outerWidth())*0.5;
				label.css("margin-left",tx);
			});
			
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
		
		this.selectIdx = function(idx)
		{
			var item,dot,label,vline;
			if(selectedIdx > -1)
			{
				item = items.eq(selectedIdx);
				dot = item.find("div").eq(1);
				label = item.find("label");
				vline = item.find("div").eq(0);
				TweenLite.to(dot,0.5,{background:"#03163A"});
				TweenLite.to(label,0.5,{marginTop:-30});
				TweenLite.set(vline,{marginTop:-20});
				vline.hide();
			}
			item = items.eq(idx);
			dot = item.find("div").eq(1);
			label = item.find("label");
			vline = item.find("div").eq(0);
			TweenLite.to(dot,0.5,{background:"#ffffff"});
			TweenLite.to(label,0.5,{marginTop:-50});
			vline.show();
			TweenLite.from(vline,0.5,{marginTop:-10});
			selectedIdx = idx;
		}
	}
	
	/**
	 * 图表
	 */
	function ChartController()
	{
		var container = view.find(".chart .container");
		
		var spacing = 50;
		container.width(container.width()-spacing*2);
		container.height(container.height()-spacing*2);
		container.css("left",parseInt(container.css("left"))+spacing);
		container.css("top",parseInt(container.css("top"))+spacing);
		
		var items = [];
		this.setDataSource = function(ds)
		{
			var len = ds.length;
			if(items.length == 0)
			{
				for(var i=0;i<len;i++)
				{
					var item = new ChartItem();
					item.view.appendTo(container);
					item.setData(ds[i]);
					var tx = ds[i].visit/10*container.width();
					var ty = (1-ds[i].value/10)*container.height();
					item.view.css("left",tx);
					item.view.css("top",ty);
					items.push(item);
				}
			}
			else
			{
				for(var i=0;i<len;i++)
				{
					var item = items[i];
					var tx = ds[i].visit/10*container.width();
					var ty = (1-ds[i].value/10)*container.height();
					TweenLite.to(item.view,1,{left:tx,top:ty,ease:Expo.easeInOut});
				}
			}
		}
	}
		
	function ChartItem()
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
		skin.hide();
		
		var img = $("<img>");
		img.css("position","absolute");
		img.attr("src","assets/images/goods/box.png");
		img.css("left",-8);
		img.css("top",-8);
		img.appendTo(this.view);
		
		var label = $("<div>");
		label.css("position","absolute");
		label.css("white-space","nowrap");
		label.css("color","#FFFFFF");
		label.css("font-size",16);
		label.css("font-family","黑体");
		label.appendTo(this.view);
		label.css("top",15);
		
		this.setData = function(ds)
		{
			label.text(ds.name);
			label.css("left",-label.width()*0.5);
		}
	}
}
