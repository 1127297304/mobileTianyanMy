App.CustomLineChart = function(option)
{
	var self = this;
	var container = option.container;
	var chart = echarts.init(container.get(0));
	
	new App.IntervalLoader({
		duration:60*60,
		url:option.url
	},function(data){
		self.setDataSource(data.data);
	});
	
	this.getChart = function()
	{
		return chart;
	}
	
	this.getContainer = function()
	{
		return container;
	}
	
	this.setDataSource = function(ds)
	{
		var _option = {
		    grid: {
		        left:'3%',
		        right:'3%',
		        top:0,
		        containLabel: false
		    },
		    xAxis: {
		    	type:'category',
		        boundaryGap: false,
		        data: [],
		        splitLine: {
		            show: false
		        },
		        axisLine:{
		        	show:false
		        },
		        axisLabel:{
		        	textStyle:{
		        		color:"#ffffff"
		        	},
		        	interval:function(index,value){
		        		/*
		        		只显示小时整
		        		*/
		        		var result = false;
		        		var dateStr = ds[index].date.split(" ")[1];
		        		var arr = dateStr.split(":");
		        		var m = Number(arr[1]);
		        		if(m == 0)result = true;
		        		return result;
		        	},
		        	formatter:function(value,index){
		        		return dateFormat(value);
		        	}
		        },
		        axisTick:{
		        	length:5,
		        	lineStyle:{
		        		color:"#ffffff",
		        		opacity:0.5,
		        		width:1
		        	},
		        	interval:0
		        }
		    },
		    yAxis: {
		        type: 'value',
		        show:false
		    },
		    series: [
		        {
		            type:'line',
		            data:[],
		            smooth:true,
		            symbolSize:8,
		            showAllSymbol:true,
		            itemStyle:{
		            	normal:{
		            		borderWidth:0
		            	}
		            },
		            lineStyle:{
		                normal:{
		                    color:'rgba(255,255,255,0.3)'
		                }
		            }
		        }
		    ]
		};
		
		for(var i=0;i<ds.length;i++)
		{
			var item = ds[i];
			_option.xAxis.data.push(item.date);
			_option.series[0].data.push(item.value);
		}
		chart.setOption(_option);
		
		//日期格式化
		function dateFormat(dateStr)
		{
			var result = dateStr.split(" ")[1];
			var arr = result.split(":");
			var h = Number(arr[0]);
			var m = arr[1];
			var _h = h > 12 ? h - 12 : h;
			result = _h + ":"+m;
			result += h>12 ? "PM" : "AM";
			return result;
		}
	}
}
