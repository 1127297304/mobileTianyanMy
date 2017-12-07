App.Config = {};
App.Config.debugMode = false;
App.Config.webRoot = "http://exhibition.baifendian.com";

App.Config.request = {

	volume:{
		realTime:App.Config.debugMode ? "assets/data/json/volume/realTime.json" : App.Config.webRoot + "/api/volume/real_time_data/",
		history:App.Config.debugMode ? "assets/data/json/volume/history.json" : App.Config.webRoot + "/api/volume/history_data/",
		activeUser:App.Config.debugMode ? "assets/data/json/volume/activeUser.json" : App.Config.webRoot + "/api/volume/active_user/",
		historyUser:App.Config.debugMode ? "assets/data/json/volume/historyUser.json" : App.Config.webRoot + "/api/volume/history_user/",
		historyItem:App.Config.debugMode ? "assets/data/json/volume/historyItem.json" : App.Config.webRoot + "/api/volume/history_item/",
	},

	goods:{
		itemInfo:App.Config.debugMode ? "assets/data/json/goods/itemInfo.json" : App.Config.webRoot + "/api/variety/item_info/",
		itemReview:App.Config.debugMode ? "assets/data/json/goods/itemReview.json" : App.Config.webRoot + "/api/variety/item_review/",
		topTen:App.Config.debugMode ? "assets/data/json/goods/top10.json" : App.Config.webRoot + "/api/variety/item_profile/"
	},

	news:{
		itemInfo:App.Config.debugMode ? "assets/data/json/news/itemInfo.json" : App.Config.webRoot + "/api/variety/media_info/",
		itemReview:App.Config.debugMode ? "assets/data/json/news/itemReview.json" : App.Config.webRoot + "/api/variety/media_review/",
		topTen:App.Config.debugMode ? "assets/data/json/news/top10.json" : App.Config.webRoot + "/api/variety/media_profile/"
	},

	user:App.Config.debugMode ? "assets/data/json/user/data.json" : App.Config.webRoot + "/api/variety/user_profile_top10/",

	recommended:{
		realTime:App.Config.debugMode ? "assets/data/json/bre/realTime.json" : App.Config.webRoot + "/api/velocity/real_time_bre/",
		'24hours':App.Config.debugMode ? "assets/data/json/bre/24hours.json" : App.Config.webRoot + "/api/velocity/bre_24h/"
	},

	marketing:{
		realTime:App.Config.debugMode ? "assets/data/json/bme/realTime.json" : App.Config.webRoot + "/api/velocity/real_time_bme/",
		'24hours':App.Config.debugMode ? "assets/data/json/bme/24hours.json" : App.Config.webRoot + "/api/velocity/bme_24h/",
		planet:App.Config.debugMode ? "assets/data/json/bme/planet.json" : App.Config.webRoot + "/api/velocity/group/"
	},

	value:{
		classTop10:App.Config.debugMode ? "assets/data/json/value/classTop10.json" : App.Config.webRoot + "/api/value/order_top_category/",
		areaTop10:App.Config.debugMode ? "assets/data/json/value/areaTop10.json" : App.Config.webRoot + "/api/value/order_top_area/",
		classSubTop5:App.Config.debugMode ? "assets/data/json/value/classSubTop5.json" : App.Config.webRoot + "/api/value/order_category_digg/",
		areaSubTop5:App.Config.debugMode ? "assets/data/json/value/areaSubTop5.json" : App.Config.webRoot + "/api/value/order_area_digg/",
		'24hours':App.Config.debugMode ? "assets/data/json/value/24hours.json" : App.Config.webRoot + "/api/value/order_trend_24h/",
		info:App.Config.debugMode ? "assets/data/json/value/info.json" : App.Config.webRoot + "/api/value/order_info/",
		trend:App.Config.debugMode ? "" : App.Config.webRoot + "/api/value/order_trend/" //未使用
	}
};
