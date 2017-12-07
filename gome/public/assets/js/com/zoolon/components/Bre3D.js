App.Bre3D = function(container)
{
	var iframe = $("<iframe frameborder=0 scrolling=no>");
	iframe.width(container.width());
	iframe.height(container.height());
	//http://192.168.162.217:8080/vcd/app/assets/data/modules/bre/index.html
	iframe.attr("src","http://192.168.162.217:8080/vcd/app/assets/data/modules/bre/index2.html");
	iframe.appendTo(container);
	
	App.SoundManager.play("assets/sound/bgmusic.ogg");
}