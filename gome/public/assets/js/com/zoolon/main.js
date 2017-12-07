$(function(){
	//缩放app
	App.view = $(".app");
	var ts = 0.48;
	var tx = -App.view.width()*(1-ts)*0.5;
	var ty = -App.view.height()*(1-ts)*0.5;
	TweenLite.set(App.view,{scale:ts,x:tx,y:ty});
	
	Client.init();
	App.BackgroundManager.init();
	App.ModuleManager.init();
});