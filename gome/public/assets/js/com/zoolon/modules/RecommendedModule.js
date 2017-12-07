/**
 * Velocity - 推荐引擎
 */

App.RecommendedModule = function(size)
{
	App.ModuleBase.call(this,size);
	
	var module = this;
	
	this.getPreloadAssets = function()
	{
		return [
			{type:"html",url:"assets/data/modules/recommended.html"}
		];
	}
	
	this.initView = function()
	{
		this.controllers = [
			new App.Bre3D(module.view.find(".bre3d")),
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
			url:App.Config.request.recommended.realTime
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
			url:App.Config.request.recommended['24hours']
		});
	}
}
