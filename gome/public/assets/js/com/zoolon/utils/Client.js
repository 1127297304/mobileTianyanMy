var Client = {};

Client.init = function()
{
	if(window.require == undefined)return;
	var gui = require('nw.gui');
	var win = gui.Window.get();

	$(window).keyup(function(e){
		if(e.ctrlKey && e.keyCode == 70) //ctrl+f
		{
			if(!win.isFullscreen)
			{
				win.enterFullscreen();
			}
		}
		else if(e.keyCode == 27) //esc
		{
			if(win.isFullscreen)
			{
				win.leaveFullscreen();
			}
		}
	});
}