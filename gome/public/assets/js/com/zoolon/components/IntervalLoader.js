/**
 * 间隔加载
 */
App.IntervalLoader = function(option,onComplete)
{
	var firstLoad = true;
	loop();
	
	function loadData(loadComplete)
	{
		var loader = new App.Loader(option.url,undefined,function(data){
			loadComplete(data);
		},function(){
			loadData(loadComplete);
		});
	}
	
	function loop()
	{
		var duration = firstLoad ? 0 : option.duration;
		TweenLite.delayedCall(duration,function(){
			loadData(function(data){
				onComplete(data);
				loop();
			});
		});
		firstLoad = false;
	}
}
