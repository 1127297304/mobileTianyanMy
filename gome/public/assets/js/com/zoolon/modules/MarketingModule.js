/**
 * Velocity - 营销引擎
 */

App.MarketingModule = function(size)
{
	App.ModuleBase.call(this,size);
	
	var module = this;
	
	this.getPreloadAssets = function()
	{
		return [
			{type:"html",url:"assets/data/modules/marketing.html"}
		];
	}
	
	this.initView = function()
	{
		this.controllers = [
			new App.Planet3D(module.view.find(".planet3d").eq(0)),
			new Widget0Controller(),
			new Widget1Controller()
		];
	}
	
	/**
	 * widget0
	 */
	function Widget0Controller()
	{
		var view = module.view.find(".widget0");
		var label = view.find(".content span:first");
		var tweenObj = {};
		
		new App.IntervalLoader({
			duration:10,
			url:App.Config.request.marketing.realTime
		},function(data){
			tweenTo(data.data);
		});
		
		function tweenTo(value)
		{
			tweenObj.total = tweenObj.total == undefined ? value*0.8 : tweenObj.total;
			TweenLite.to(tweenObj,20,{total:value,onUpdate:function(){
				label.text($.number(tweenObj.total));
			}});
		}
	}
	
	/**
	 * widget1
	 */
	function Widget1Controller()
	{
		App.CustomLineChart.call(this,{
			container:module.view.find(".widget1 .chartContainer"),
			url:App.Config.request.marketing['24hours']
		});
	}
}
