(function($,doc,appGlobal){
	/*
 	 * 工具集合
 	 */
 	var util={
 		init:function(){
 			this.initDateFormat();
 			this.initNumberFormat();
 			this.initDataCache();
 		},
 		//基础配置项
 		config:{
 			dataErrorTip:'数据加载失败...',
 			dataCacheName:'$phDataCache',
 			dataDom:{}
 		},
 		/*
 		 * 千分位字符串转为数字
 		 * str:待转换字符
 		 * separator：分隔符。默认为,
 		 */
 		stringToNumber:function(str,separator){
 			var sep=separator||',';
 			if(!str) return false;
 			if(!isNaN(str)) return Number(str);
 			return Number(str.replace(new RegExp(sep,'gm'),''));
 		},
 		//数字格式化
 		numberFormat:function(num){		
			var l=num.toString().length;
			if(l>=7){
				return num/1000000+'M';
			}else if(l>=4){
				return num/1000+'K';
			}else{
				return num;
			}
		},
		//数字格式化初始化
 		initNumberFormat:function(){
 			/*
			 * 数字千分位格式化方法
			 * num:小数位数，默认2
			 * thousands：千分位分隔符，默认,
			 * 使用方法： 12.267.format()  //输出12.27
			 */
			Number.prototype.format=function(num,thousands){
				var number=(num || num<0 || num>20)||2,thousand=thousands||',';
				return parseFloat(this).toFixed(number).toString().replace(
			      	/\B(?=(\d{3})+(?!\d))/g, thousand
			    ); 
			};
			/*
			 * 千分位，不设默认小数位数
			 * params:len 默认为0
			 */
			Number.prototype.format2=function(num,len){
				return parseFloat(num).toFixed(len).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			};
 			/*
 			 * 数字万元格式化,注意这里并未进行四舍五入，而是采用截断的方案
 			 * (可选)force：对于小于1W以下的数字强制转换。默认false
 			 * （可选）num:保留小数位数，默认2
 			 */
			Number.prototype.tenThousandsFormat=function(force,number){
				var num=number||2,len=this.toString().length,reVal=this;
				if(len>=5||force){
					reVal=[
						((Number(this)/Math.pow(10,4)).toFixed(num+1)).match(new RegExp("\\d+\\.\\d{" + num+ "}","gm"))
					].join('');
				}
				return reVal;
			};
			/*
			 * 计算百分比
			 * divide：被除数，必须
			 * num：保留小数位数，默认2
			 * errorVal：错误时返回值，默认-
			 */
			Number.prototype.percent=function(divide,num,errorVal){
				var num_fixed=(num || num<0 || num>20)||2,reVal=errorVal||'-';
				if(!isNaN(this) && !isNaN(divide) && divide!==0){
					reVal= [(this/divide*100).toFixed(num_fixed),'%'].join('');
				}
				return reVal;
			};
		},
		//数据请求
		//type:请求数据类型，callback：成功后的回调函数
		ajaxGetData:function(url,model,callback,errorCallback,params){
			var self=this;
			$.ajax(url,{
				data:$.extend(true, {
					_:new Date()-0,
					token:appGlobal.getLocalUserInfo().token||''
				}, params),
				dataType:'json',
				type:'get',
				timeout:100000,
				success:function(res){
					if(200==res.code && res.data.status && 'ok'==res.data.status){
						callback(res.data[model]);
					}else{
						$.toast(self.config.dataErrorTip);
					}
				},
				error:function(xhr,type,errorThrown){
					$.toast(self.config.dataErrorTip);
					if(xhr.status == 404){
						errorCallback();
					}
				}
			});
		},
		//空对象判断
		isEmptyObject:function(obj){
			return Object.keys(obj).length === 0;
		},
		//日期格式化
		initDateFormat:function(){
			Date.prototype.Format = function(fmt){  
			  var o = { 
			    "M+" : this.getMonth()+1,                 //月份 
			    "d+" : this.getDate(),                    //日 
			    "h+" : this.getHours(),                   //小时 
			    "m+" : this.getMinutes(),                 //分 
			    "s+" : this.getSeconds(),                 //秒 
			    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
			    "S"  : this.getMilliseconds()             //毫秒 
			  }; 
			  if(/(y+)/.test(fmt)) 
			    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			  for(var k in o) 
			    if(new RegExp("("+ k +")").test(fmt)) 
			  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
			  return fmt; 
			};
		},
		/*
		 * 字符串日期比较
		 * date1:待比较日期，格式：yyyy-MM-dd
		 * date2:待比较日期，格式：yyyy-MM-dd
		 * 返回值：true:date1>date2
		 */
		compareDate:function(date1,date2){
			var d1=new Date(date1.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1/$2/$3")),
				d2=new Date(date2.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1/$2/$3"));
			return d1>d2;	
		},
		/*
		 * 字符串日期比较
		 * date1:待比较日期，格式：yyyy-MM
		 * date2:待比较日期，格式：yyyy-MM
		 * 返回值：true:date1==date2
		 */
		isCurrentMonth:function(date1,date2){
			var d1=0,d2=1;
			if(date1.length>=7 && date2.length>=7)
			{
				d1 = date1.substr(0,7);
				d2 = date2.substr(0,7);
			}
			return d1==d2;
		},
		getType:function(o){    //判断对象类型
	          var _t;
	          return ((_t = typeof(o)) == "object" ? o===null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
	      },
        deepClone:function(source){    //深拷贝
              var self=this;    //保存当前对象引用
              var destination=self.getType(source);
             destination=destination==='array'?[]:(destination==='object'?{}:source);
             for (var p in source) {
                 if (self.getType(source[p]) === "array" || self.getType(source[p]) === "object") {
                    destination[p] = self.getType(source[p]) === "array" ? [] : {};
                     destination[p]=arguments.callee.call(self, source[p]);    //使用call修改函数的作用域
                 } else {
                     destination[p] = source[p];
                 }
             }
             return destination;
        },
        /*
         * 数组数据提取
         * arr：源数组
         * key:提取的对象属性
         */
        arrayFetch:function(arr,key){
        	var r=[];
        	if($.isArray(arr)){
        		$.each(arr,function(i,item){
        			r.push(item[key]);
        		});
        	}
        	return r;
        },
        /*
         * 设置缓存图表数据
         * type:图表类型
         * index：索引
         */
        setDataCache:function(type,index,data){
        	var cache=sessionStorage.getItem(this.config.dataCacheName);
        	cache=JSON.parse(cache);
        	cache[type][index]=data;
        	sessionStorage.setItem(this.config.dataCacheName,JSON.stringify(cache));
        },
        /*
         * 获取图表缓存数据
         */
        getDataCache:function(type,index){
        	var cache=sessionStorage.getItem(this.config.dataCacheName),re=false;
        	cache=JSON.parse(cache);
        	if(cache && cache[type] && cache[type][index]){
        		re= cache[type][index];
        	}
        	return re;
        },
        /*
         * 初始化本地存储
         */
        initDataCache:function(){
        	var source={
        		user:[],
        		credit:[],
        		cash:[]
        	};
        	sessionStorage.setItem(this.config.dataCacheName,JSON.stringify(source));
        },
        //初始化获取数据节点DOM
 		initDataDom:function(nodeName){
 			var self=this;
 			$('['+nodeName+']').each(function(i,dom){
 				var t=dom.getAttribute(nodeName);
 				if(t){
 					self.config.dataDom[t]=dom;
 				}
 			});
			$.each(self.config.dataDom,function(val){
				if(val!=='refreshTime'){
					self.config.dataDom[val].innerTEXT='-';
				}
			});
 		},
         //insertAfter方法
		insertAfter:function(newElement, targetElement){
			var parent = targetElement.parentNode;
			if (parent.lastChild == targetElement) {
				parent.appendChild(newElement);
			}else {
				parent.insertBefore(newElement, targetElement.nextSibling);
			}
		},
 		//更新数据,在调用之前应先使用initDataDom对DOM进行缓存
 		updateData:function(newData){
 			var self=this;
 			$.each(newData,function(key){
 				if(self.config.dataDom[key])
 				self.config.dataDom[key].innerHTML=newData[key];
 			});
 		},
 		//从URL获取参数
 		getUrlParam:function(name) {
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		    if (r !== null) return unescape(r[2]); return null; //返回参数值
		}
 	};
	appGlobal.util=util;
})(mui,document,window.biMobile={});