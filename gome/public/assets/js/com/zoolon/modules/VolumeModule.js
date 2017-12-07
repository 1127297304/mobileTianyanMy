/**
 * Volume
 * 数据量,用户数,数据钟
 */

App.VolumeModule = function(size)
{
	App.ModuleBase.call(this,size);
	
	var module = this;
	
	this.getPreloadAssets = function()
	{
		return [
			{type:"image",url:"assets/images/gif/sprite4.png"},
			{type:"image",url:"assets/images/gif/sprite5.png"},
			{type:"html",url:"assets/data/modules/volume.html"}
		];
	}
	
	this.initView = function()
	{
		//初始化动画
		this.view.find(".animation").animateSprite({fps:25,loop:true});
		
		this.controllers = [
			new TopWidgetController(),
			new DateWidgetController(),
			new CircleWidgetController()
		];
		
		//总数据量:每10秒更新
		new App.IntervalLoader({
			duration:10,
			url:App.Config.request.volume.history
		},function(data){
			module.controllers[0].setTotal(data.data);
			module.controllers[2].tweenTotalTo(data.data);
		});
		
		//今日数据量:每10秒更新
		new App.IntervalLoader({
			duration:10,
			url:App.Config.request.volume.realTime
		},function(data){
			module.controllers[0].tweenTotalTo(data.data);
		});
		
		//用户总数:每10秒更新
		new App.IntervalLoader({
			duration:10,
			url:App.Config.request.volume.historyUser
		},function(data){
			module.controllers[0].setUserTotal(data.data);
			module.controllers[2].tweenUserTotalTo(data.data);
		});
		
		//今日活跃用户数:每10秒更新
		new App.IntervalLoader({
			duration:10,
			url:App.Config.request.volume.activeUser
		},function(data){
			module.controllers[0].tweenActiveUserTo(data.data);
		});
		
		//商品总数:每10秒更新
		new App.IntervalLoader({
			duration:10,
			url:App.Config.request.volume.historyItem
		},function(data){
			module.controllers[2].tweenGoodsTotalTo(data.data);
		});
	}
	
	/**
	 * 顶部控件
	 */
	function TopWidgetController()
	{
		var totalLabel = module.view.find(".widget0 .header .label span:first");
		var userTotalLabel = module.view.find(".widget1 .header .label span:first");
		var todayTotalLabel = module.view.find(".widget0 .content .label span:first");
		var todayActiveUserLabel = module.view.find(".widget1 .content .label span:first");
		var duration = 20;
		var tweenObj = {};
		
		//设置总数据量
		this.setTotal = function(mb)
		{
			var pb = mb/1024/1024/1024;
			totalLabel.text($.number(pb,1));
		}
		
		//设置用户总量
		this.setUserTotal = function(value)
		{
			var m = value/100000000;
			userTotalLabel.text($.number(m,1));
		}
		
		//今日数据量
		this.tweenTotalTo = function(value)
		{
			tweenObj.total = tweenObj.total == undefined ? value*0.8 : tweenObj.total;
			TweenLite.to(tweenObj,duration,{total:value,onUpdate:function(){
				todayTotalLabel.text($.number(tweenObj.total));
			}});
		}
		
		//今日活跃用户数
		this.tweenActiveUserTo = function(value)
		{
			tweenObj.activeUser = tweenObj.activeUser == undefined ? value*0.8 : tweenObj.activeUser;
			TweenLite.to(tweenObj,duration,{activeUser:value,onUpdate:function(){
				todayActiveUserLabel.text($.number(tweenObj.activeUser));
			}});
		}
	}
	
	/**
	 * 日期控件
	 */
	function DateWidgetController()
	{
		var view = module.view.find(".dateWidget");
		var weekLabel = view.find(".week");
		var dateLabel = view.find(".date");
		var dys = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
		
		setInterval(function(){
			update();
		},1000*60);
		update();
		
		function update()
		{
			var now = new Date();
			var y = now.getFullYear();
			var m = now.getMonth()+1;
			var d = now.getDate();
			var dy = now.getDay();
			dateLabel.text(m+"/"+d+" "+y);
			weekLabel.text(dys[dy]);
		}
	}
	
	/**
	 * 圆形图表控件
	 */
	function CircleWidgetController()
	{
		var view = module.view.find(".circleWidget");
		
		var userCircle = view.find(".userCircle");
		userCircle.circleProgress({startAngle:-Math.PI/2,reverse:true});
		
		var goodsCircle = view.find(".goodsCircle");
		goodsCircle.circleProgress({startAngle:-Math.PI/2,reverse:true});
		
		var mbCircle = view.find(".mbCircle");
		mbCircle.circleProgress({startAngle:-Math.PI/2,reverse:true});
		
		var gbCircle = view.find(".gbCircle");
		gbCircle.circleProgress({startAngle:-Math.PI/2,reverse:true});
		
		var tbCircle = view.find(".tbCircle");
		tbCircle.circleProgress({startAngle:-Math.PI/2,reverse:true});
		
		var pbCircle = view.find(".pbCircle");
		pbCircle.circleProgress({startAngle:-Math.PI/2,reverse:true});
		
		var totalLabel = view.find(".content div span:first");
		
		var pointer0 = new PointerController({
			img:"assets/images/volume/p0.png",
			width:21,
			height:36,
			left:-10,
			top:-30,
			radius:510,
			pointerView:view.find(".pointerView0"),
			offsetX:50
		});
		var pointer1 = new PointerController({
			img:"assets/images/volume/p1.png",
			width:37,
			height:70,
			left:-18,
			top:-60,
			radius:432,
			pointerView:view.find(".pointerView1"),
			offsetX:80
		});
		
		var duration = 20;
		var tweenObj = {};
		
		//总数据量
		this.tweenTotalTo = function(value)
		{
			tweenObj.total = tweenObj.total == undefined ? value*0.8 : tweenObj.total;
			TweenLite.to(tweenObj,duration,{total:value,onUpdate:function(){
				var mb = tweenObj.total;
				var gb = mb/1024;
				var tb = gb/1024;
				var pb = tb/1024;
				var progress_pb = pb/10000;
				var progress_tb = tb%1024/1024;
				var progress_gb = gb%1024/1024;
				var progress_mb = mb%1024/1024;
				totalLabel.text($.number(pb,1));
				mbCircle.circleProgress({value:progress_mb,animation:false});
				gbCircle.circleProgress({value:progress_gb,animation:false});
				tbCircle.circleProgress({value:progress_tb,animation:false});
				pbCircle.circleProgress({value:progress_pb,animation:false});
			}});
		}
		
		//用户总数
		this.tweenUserTotalTo = function(value)
		{
			tweenObj.userTotal = tweenObj.userTotal == undefined ? value*0.8 : tweenObj.userTotal;
			var pointerLabel = pointer0.option.pointerView.find("span:first");
			TweenLite.to(tweenObj,duration,{userTotal:value,onUpdate:function(){
				var progress = tweenObj.userTotal / 2400000000;
				userCircle.circleProgress({value:progress,animation:false});
				
				pointerLabel.text($.number(tweenObj.userTotal));
				var r = Math.PI+progress*Math.PI*2;
				pointer0.update(r);
			}});
		}
		
		//商品总数
		this.tweenGoodsTotalTo = function(value)
		{
			tweenObj.goodsTotal = tweenObj.goodsTotal == undefined ? value*0.8 : tweenObj.goodsTotal;
			var pointerLabel = pointer1.option.pointerView.find("span:first");
			TweenLite.to(tweenObj,duration,{goodsTotal:value,onUpdate:function(){
				var progress = tweenObj.goodsTotal / 150000000;
				goodsCircle.circleProgress({value:progress,animation:false});
				
				pointerLabel.text($.number(tweenObj.goodsTotal));
				var r = Math.PI+progress*Math.PI*2;
				pointer1.update(r);
			}});
		}
		
		
		function PointerController(option)
		{
			this.option = option;
			var dot = $("<div>");
			dot.css("position","absolute");
			var skin = $("<div>");
			skin.appendTo(dot);
			skin.css("background","url("+option.img+")");
			skin.css("position","absolute");
			skin.width(option.width);
			skin.height(option.height);
			skin.css("left",option.left);
			skin.css("top",option.top);
			dot.appendTo(view);
			
			this.update = function(r)
			{
				var radius = option.radius;
				var tx = 490 + Math.sin(r)*radius;
				var ty = 490 + Math.cos(r)*radius;
				dot.css("left",tx);
				dot.css("top",ty);
				var tr = (Math.PI-r)/Math.PI*180;
				TweenLite.set(dot,{rotation:tr});
				
				var pointerView = option.pointerView;
				pointerView.show();
				var tx1 = 490 + Math.sin(r)*(radius+option.offsetX);
				var ty1 = 490 + Math.cos(r)*(radius+option.offsetX);
				if(r/Math.PI*180 - 180 < 180)tx1 = tx1-pointerView.outerWidth();
				pointerView.css("left",tx1);
				pointerView.css("top",ty1);
			}
			
			this.update(Math.PI);
		}
	}
}
