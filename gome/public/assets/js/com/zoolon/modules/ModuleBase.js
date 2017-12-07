App.ModuleBase = function(size)
{
	var self = this;
	var view = $("<div>");
	view.css("position","absolute");
	var tw = size.width;
	var th = size.height;
	view.outerWidth(tw);
	view.outerHeight(th);
	
	this.view = view;
	
	//view.css("background-color",randomColor());
	
	this.appendTo = function(container)
	{
		view.appendTo(container);
		
		var spinner = new Spinner({color:"#ffffff",shadow:true});
		spinner.spin(view.get(0));
		
		preloadAssets(function(){
			spinner.spin();
			self.initView();
		});
		
		function preloadAssets(onComplete)
		{
			var assets = self.getPreloadAssets();
			if(assets == 0)
			{
				onComplete();
			}
			else
			{
				var i = 0;
				loadAsset(assets[i],function(){
					i++;
					if(i<assets.length)
					{
						loadAsset(assets[i],arguments.callee);
					}
					else
					{
						onComplete();
					}
				});
			}
		}
		
		function loadAsset(asset,onComplete)
		{
			switch(asset.type)
			{
				case "html":
					loadHtml(asset.url,completeHandler);
				break;
				case "image":
					loadImage(asset.url,completeHandler);
				break;
			}
			
			function completeHandler()
			{
				if(asset.onComplete!=undefined)asset.onComplete();
				onComplete();
			}
		}
		
		function loadHtml(url,onComplete)
		{
			$.get(url,function(data){
				$(data).appendTo(view);
				onComplete();
			});
		}
		
		function loadImage(url,onComplete)
		{
			var img = new Image();
			img.src = url;
			img.onload = function()
			{
				onComplete();
			}
		}
	}
	
	this.setPosition = function(x,y)
	{
		view.css("left",x);
		view.css("top",y);
	}
	
	this.getPreloadAssets = function()
	{
		return [];
	}
	
	this.initView = function()
	{
		//override...
	}
}
