/**
 * Variety - 资讯
 */

App.NewsModule = function(size)
{
	App.ModuleBase.call(this,size);
	
	var module = this;
	
	this.getPreloadAssets = function()
	{
		return [
			{type:"html",url:"assets/data/modules/news.html"}
		];
	}
	
	this.initView = function()
	{
		this.controllers = [
			new NewsCountController(),
			new NewsClassController(),
			new NewsTopTenController()
		];
	}
	
	/**
	 * 内容总数
	 */
	function NewsCountController()
	{
		App.CountController.call(this,{
			view:module.view.find(".widget0"),
			url:App.Config.request.news.itemInfo
		});
	}
	
	/**
	 * 品类体检
	 */
	function NewsClassController()
	{
		App.ClassController.call(this,{
			view:module.view.find(".widget1"),
			url:App.Config.request.news.itemReview
		});
	}
	
	/**
	 * 今日内容热点TOP10
	 */
	function NewsTopTenController()
	{
		var hotArticleDetailController = new HotArticleDetailController();
		var newsSalesController = new NewsSalesController();
		
		App.TopTenController.call(this,{
			view:module.view.find(".widget2"),
			url:App.Config.request.news.topTen,
			bind:["name","visit"],
			onSelect:function(data)
			{
				hotArticleDetailController.setDataSource(data);
				newsSalesController.setDataSource(data);
			}
		});
	}
	
	/**
	 * 热门文章详情
	 */
	function HotArticleDetailController()
	{
		var view = module.view.find(".widget3");
		var article = view.find(".articleContent");
		var tagContainer = view.find(".tags");
		var b0 = view.find(".b0");
		
		this.setDataSource = function(ds)
		{
			this.clear();
			//设置文章详情
			article.find(".title").text(ds.detail.title);
			article.find(".content").text(ds.detail.content);
			article.find(".date").text(ds.detail.date);
			TweenLite.set(article.children(),{alpha:0});
			TweenMax.staggerTo(article.children(),0.5,{alpha:1},0.1);
			//设置tags
			for(var i=0;i<ds.tags.length;i++)
			{
				var tag = $('<div class="tag"></div>');
				tag.text(ds.tags[i]);
				tag.appendTo(tagContainer);
			}
			TweenMax.staggerFrom(tagContainer.children(),0.5,{scale:0,alpha:0},0.1);
			//其它
			b0.text("分享数:"+$.number(ds.share));
			TweenLite.set(b0,{alpha:0});
			TweenLite.to(b0,0.5,{alpha:1,delay:0.5});
		}
		
		this.clear = function()
		{
			article.find(".title").text("-");
			article.find(".content").text("-");
			article.find(".date").text("-");
			tagContainer.empty();
			b0.text("-");
		}
	}
	
	/**
	 * 浏览量走势
	 */
	function NewsSalesController()
	{
		App.SalesController.call(this,{
			view:module.view.find(".widget4"),
			labels:["TODAY","TOMORROW","DAY1","DAY2","DAY3","DAY4","DAY5","DAY6"],
			lightIdx:0,
			sortData:function(ds){
				var arr = ds.trend["6d"].concat();
				arr.unshift(ds.trend.tomorrow);
				arr.unshift(ds.trend.today);
				return arr;
			}
		});
	}
}
