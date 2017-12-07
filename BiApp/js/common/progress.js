(function($,doc,appGlobal){
	/*
	 * 进度条
	 * domId:进度条dom id
	 * config：额外配置项
	 */
	var progress=function(domId,config){
		//继承默认配置项
		this.option=$.extend(true, {
			overClass:'ph-progress-over',		//超额完成时添加的class
			totalClass:'ph-progress-total',	//目标完成度数值class（通过dom进行子元素选择）
			actualClass:'ph-progress-actual',	//实际完成量class（通过dom进行子元素选择）
			planClass:'ph-progress-plan',	//目标完成度数值class（通过dom进行子元素选择）
			timePercentClass:'ph-progress-timePercent',	//显示时间进度百分比元素CLASS（通过dom进行子元素选择）
			donePercentClass:'ph-progress-donePercent',	//显示完成进度百分比元素CLASS（通过dom进行子元素选择）
			totalData:0,	//项目计划总完成量
			planData:0,		//计划完成值
			actualData:0		//实际完成值
		}, config);
		//缓存dom节点
		this.dom={
			wrapper:doc.querySelector(['#',domId].join('')),
			total:doc.querySelector(['#',domId,' .',this.option.totalClass].join('')),
			plan:doc.querySelector(['#',domId,' .',this.option.planClass].join('')),
			actual:doc.querySelector(['#',domId,' .',this.option.actualClass].join('')),
			timepercent:doc.querySelector(['#',domId,' .',this.option.timePercentClass,' span'].join('')),
			donepercent:doc.querySelector(['#',domId,' .',this.option.donePercentClass,' span'].join(''))
		};
		this.init();
	};
	progress.prototype={
		constructor:progress,
		init:function(){
			this.updateProgress();
		},
		/*
		 * 更新进度条数值
		 * newData配置与config配置相同
		 */
		updateProgress:function(newData){
			//合并参数
			this.option=$.extend(true,this.option,newData);
			//以最大值最为计算百分比基准值
			var baseData=Math.max(this.option.actualData,this.option.totalData),
			actualPercent=Number.prototype.percent.call(this.option.actualData,baseData),
			planPercent=Number.prototype.percent.call(this.option.planData,baseData),
			totalPercent=Number.prototype.percent.call(this.option.totalData,baseData);
			this.dom.actual.style.width=actualPercent;
			this.dom.plan.style.width=planPercent;
			this.dom.total.style.width=totalPercent;
			//更新百分比值（数值以原数据来显示）
			this.dom.timepercent.innerHTML=Number.prototype.percent.call(this.option.planData,this.option.totalData);
			this.dom.donepercent.innerHTML=Number.prototype.percent.call(this.option.actualData,this.option.totalData);
			this.dom.wrapper.classList.toggle(this.option.overClass,this.option.actualData>=this.option.planData);
		}
	};
	appGlobal.progress=appGlobal.progress||progress;
})(mui,document,biMobile=window.biMobile||{});