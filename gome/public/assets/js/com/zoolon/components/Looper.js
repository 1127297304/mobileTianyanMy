/**
 * 轮循
 * @param {Object} duration
 * @param {Object} funcArr
 */
App.Looper = function(duration,funcArr)
{
	var idx = -1;
	var tween;
	function loop()
	{
		var delay = idx == -1 ? 0 : duration;
		tween = TweenLite.delayedCall(delay,function(){
			idx++;
			if(idx == funcArr.length)idx = 0;
			funcArr[idx]();
			loop();
		});
	}
	
	this.start = function()
	{
		loop();
	}
	
	this.stop = function()
	{
		if(tween!=undefined)tween.kill();
		idx = -1;
	}
	
	this.setIdx = function(index)
	{
		idx = index;
	}
}
