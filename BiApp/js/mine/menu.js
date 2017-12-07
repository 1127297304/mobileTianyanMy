;(function($,$$){
	
		$.init({
			swipeBack: false//关闭右滑关闭功能
		})
		
		var aniShow = "pop-in";//动画效果
		var globalObj;//全局变量
		
		//登录成功后在列表页显示当前用户信息	
		var loginName = window.localStorage.getItem("username");
		$$("#userInfo").html(loginName);
		
		var sid = window.localStorage.getItem("sid");//获取设备sid
		var bbh = window.localStorage.getItem("bbh");//获取当前版本号
		
		//初始化渲染菜单
		initRender();
		
		//初始化渲染菜单
		function initRender(){
			
			$$.ajaxData({
				newUrl:"/getUserPowerAll.gm",
				//newUrl:"js/mine/newBlock.json",
				type:"get",
				callback:function(e){
					
					globalObj=e.data.dataInfo;
					
					//用vue渲染菜单数据
					vueRender(globalObj);
					
					//用vue渲染子菜单详情
					vueRenderDetail(globalObj);
					
				}
			})
		}
		
		//生成随机数
		function getUuid(){
			var len=32;//32长度
			var radix=16;//16进制
			var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var uuid=[],i;
			radix=radix||chars.length;
			if(len){
				for(i=0;i<len;i++)
				uuid[i]=chars[0|Math.random()*radix];
			}
			else{
				var r;
				uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';
				uuid[14]='4';
				for(i=0;i<36;i++){
					if(!uuid[i]){
						r=0|Math.random()*16;
						uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];
					}
				}
			}
			return uuid.join('');
		};
		
		var uuNum=getUuid();//生成的随机数
		
		//用vue渲染菜单数据
		function vueRender(obj){
			var appMenu = new Vue({
				  el: '#list',
				  data: {
				    newtodos: obj.projectMenuData,
					menuId:'0',
					curMenu: obj.projectMenuData[0].text
				  },
				  mounted:function(){
					  this.getLocal();
				  },
				  methods:{
				  	showDetail: function(event,ind){
						window.localStorage.menuId=ind;
						this.menuId=ind;
				  		//获取当前点击的菜单编码
				  		var activeItem = $$(event.currentTarget).attr("data-item");
				  		//获取当前点击的菜单名称
						this.curMenu = $$(event.currentTarget).text().replace(/\s/g,'');
						window.localStorage.curMenu = this.curMenu;
				  		//将菜单编码传递给另一个组件
				  		bus.$emit('click',activeItem,this.curMenu);
				  	},
					getLocal:function(){
						if(localStorage.menuId){
							this.menuId=localStorage.menuId;
						}
					}
				  }
			})
		}
		
		//用vue渲染子菜单详情
		function vueRenderDetail(obj){
			var appMenuDetail = new Vue({
				el: '#detail',
				data: {
				    newtodos: obj.pageMenuData[obj.projectMenuData[0].value],
					menuId:'0',
					curValue:obj.projectMenuData[0].text
				},
				mounted: function(){
					this.getLocal();
				  	var self = this;
				  	bus.$on('click', function(value,curText){
				  		self.newtodos = obj.pageMenuData[value];
				  		self.curValue = curText;
				  	})
				},
				methods:{
					getLocal:function(){
						if(localStorage.menuId){
							this.menuId=localStorage.menuId;
							this.curValue = localStorage.curMenu;
						}
						this.newtodos=obj.pageMenuData[obj.projectMenuData[this.menuId].value];
					},
				  	pageSwitch: function(event,ind){
				  		//获取当前点击的菜单编码
				  		//console.log(event.currentTarget.getAttribute("data-href"))//这个可以获取到
				  		//var activeItem = event.target.getAttribute('data-href');//这个获取不到 	跟事件在哪个元素上触发有关系
				  		
				  		var id = $$(event.currentTarget).attr('data-href');
						var href = $$(event.currentTarget).attr('data-href');
						var type = $$(event.currentTarget).attr("open-type");
						var clickText = $$(event.currentTarget).text().replace(/\s/g,'');
						var curPar = $$(".menu-cont .active").text().replace(/\s/g,'');
						//var sendName = this.curValue+'-'+clickText;
						var sendName = curPar+'-'+clickText;
						//不使用父子模板方案的页面
						if (type == "common") {
							var webview_style = {
								popGesture: "none"
							}
						}
						
						$$.ajaxData({
							newUrl:"/trajectory.gm",
							type:'post',
							data:{
								name:sendName
							},
							dataType:"json",
							callback:function(e){
								$.openWindow({
									id: id,
									url: href+"?uuid="+uuNum,
									styles: webview_style,
									show: {
										aniShow: "slide-in-right"
									},
									waiting: {
										autoShow:false,//自动显示等待框，默认为true
										title:'正在加载...',//等待对话框上显示的提示内容
										options:{
											//background:''
										}
									}
								})
							}
						})
				  	}
				}
			})
		}
		
		//退出按钮
		$$("#backToIndex").on("tap",function(){
			//清除用户名信息  及  该用户权限下的子集
			window.localStorage.removeItem("username");
			window.localStorage.removeItem("menuId");
			window.localStorage.removeItem("curMenu");
			
			$$.ajaxData({
				newUrl:"/logout.gm",
				dataType:"json",
				callback:function(e){
					
					$.openWindow({
						id: "logout",
						url : "login.html?sid="+sid+"&bbh="+bbh,
						show: {
							aniShow: 'slide-in-right'
						},
						styles: {
							popGesture: 'hide'//设置侧滑返回
						},
						waiting: {
							autoShow: false
						}
					});
					
				}
			})
		})
		
		//使用一个空的  Vue 实例作为中转
		var bus = new Vue();
		
})(mui,jQuery)
