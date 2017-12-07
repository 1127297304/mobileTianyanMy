App.ModuleManager = {};

App.ModuleManager.list = [
	{x:0,y:0,width:1080*2,height:1920,instanceOf:App.VolumeModule},
	{x:1080*2,y:0,width:1920,height:1080,instanceOf:App.GoodsModule},

	{x:1080*3.5,y:0,width:1080*3/2,height:1920,instanceOf:App.NewsModule},
	{x:1080*5,y:0,width:1080*3/2,height:1920,instanceOf:App.UserModule},
	{x:1080*6.5,y:0,width:1080*2,height:1920,instanceOf:App.RecommendedModule},
	{x:1080*8.5,y:0,width:1080*2,height:1920,instanceOf:App.MarketingModule},

	{x:1080*10.5,y:0,width:1280*2,height:1024*2,instanceOf:App.ValueModule},
	{x:1080*10.5,y:0,width:1280*2,height:1024*2,instanceOf:App.ValueModuleSeven},
	{x:1080*10.5,y:0,width:1280*2,height:1024*2,instanceOf:App.ValueModuleSevenMj},
	{x:1080*10.5,y:0,width:1280*2,height:1024*2,instanceOf:App.ValueModuleMeiJie}
];

App.ModuleManager.modules = [];

App.ModuleManager.init = function()
{
	var container = $("<div>");
	container.appendTo(App.view);
	for(var i = 0;i<this.list.length;i++)
	{
		var ModuleClass = this.list[i].instanceOf;
		var tw = this.list[i].width;
		var th = this.list[i].height;
		var module = new ModuleClass({width:tw,height:th});
		App.ModuleManager.modules.push(module);
		module.appendTo(container);
		var tx = this.list[i].x;
		var ty = this.list[i].y;
		module.setPosition(tx,ty);
	}
}
