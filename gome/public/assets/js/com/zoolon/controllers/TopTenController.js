/**
 * Top 10
 */
App.TopTenController = function(option)
{
	var self = this;
	var view = option.view;
	
	var items = view.find(".list .item");
	
	var selectedIdx = -1;
	var looper;
	//init
	new App.IntervalLoader({
		duration:60*60,
		url:option.url
	},function(data){
		self.setDataSource(data.data);
	});
	
	this.setDataSource = function(ds)
	{
		this.data = ds;
		
		items.each(function(i){
			var titleLabel = $(this).find(".title");
			titleLabel.text(ds[i][option.bind[0]]);
			var valueLabel = $(this).find(".value span");
			valueLabel.text($.number(ds[i][option.bind[1]]));
		});
		
		if(looper!=undefined)looper.stop();
		var funcArr = (function(){
			var arr = [];
			var len = ds.length;
			for(var i=0;i<len;i++)
			{
				arr.push(new Handler(i).func);
			}
			
			function Handler(idx)
			{
				this.func = function(){self.showIdx(idx);};
			}
			return arr;
		})();
		looper = new App.Looper(5,funcArr);
		looper.start();
	}
	
	this.showIdx = function(idx)
	{
		var item;
		if(selectedIdx > -1)
		{
			item = items.eq(selectedIdx);
			item.removeClass("selected");
		}
		item = items.eq(idx);
		item.addClass("selected");
		selectedIdx = idx;
		option.onSelect(this.data[idx]);
	}
}
