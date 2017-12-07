/**
 * Variety - 商品
 */

App.GoodsModule = function(size)
{
	App.ModuleBase.call(this,size);

	var module = this;

	this.getPreloadAssets = function()
	{
		return [
			{type:"html",url:"assets/data/modules/goods.html"}
		];
	}

	this.initView = function()
	{
		this.controllers = [
			// new GoodsCountController(),
			// new GoodsClassController(),
			//
			//
			new GoodsTopTenController()
		];
	}


	/**
	 * 商品总数
	 */
	function GoodsCountController()
	{
		App.CountController.call(this,{
			view:module.view.find(".widget0"),
			url:App.Config.request.goods.itemInfo
		});
	}

	/**
	 * 品类体检
	 */
	function GoodsClassController()
	{
		App.ClassController.call(this,{
			view:module.view.find(".widget1"),
			url:App.Config.request.goods.itemReview
		});
	}

	/**
	 * 今日热门商品TOP10
	 */
	function GoodsTopTenController()
	{
		// var goodsDetailController = new GoodsDetailController();
		var goodsSalesController = new GoodsSalesController();
		var goodsSalesController2 = new GoodsSalesController2();
		App.TopTenController.call(this,{
			view:module.view.find(".widget2"),
			// url:App.Config.request.goods.topTen,
			url:'/data/item_profile.json',
			bind:["name","value"],
			onSelect:function(data)
			{
				// goodsDetailController.setDataSource(data);
				goodsSalesController.setDataSource(data,1);
				goodsSalesController2.setDataSource(data,2);
			}
		});
	}

	/**
	 * 热门商品详情
	 */


	/**
	 * 销量走势
	 */

	function createXDayDate(x){
		var now = new Date();
		var arr = [];
		for(var i=0;i<x;i++){
			var temp = i * 24 * 3600 * 1000
			var date = new Date(now.getTime() - temp);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			arr.push(  month + '-' + day)
		}
		return arr
	}

	var arrDate = createXDayDate(8).reverse()

	function GoodsSalesController()
	{
		App.SalesController.call(this,{
			view:module.view.find(".widget4"),
			labels:arrDate,
			lightIdx:6,
			sortData:function(ds){
				console.log(ds)
				var arr = ds.trend["6d"].concat();
				arr.push(ds.trend.today);
				arr.push(ds.trend.tomorrow);
				return arr;
			}
		});

	}
	function GoodsSalesController2(){
		App.SalesController.call(this,{
			view:module.view.find(".widget5"),
			labels: arrDate,
			lightIdx:6,
			sortData:function(ds){
				console.log(arr)
				var arr = ds.trend["6d"].concat();
				arr.push(ds.trend.today);
				arr.push(ds.trend.tomorrow);
				return arr;
			}
		});
	}
}
