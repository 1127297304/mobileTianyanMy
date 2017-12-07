/**
 * 星球
 */
App.Planet3D = function(container)
{
	var camera, scene, renderer;
	var planets = [];
	
	var looper;
	
	init();
	animate();
	
	new App.IntervalLoader({
		duration:60*60,
		url:App.Config.request.marketing.planet
	},function(data){
		setDataSource(data.data);
	});
	
	function init()
	{
		var sw = container.width();
		var sh = container.height();
		camera = new THREE.PerspectiveCamera(45,sw/sh,1,2000);
		
		scene = new THREE.Scene();
		
		renderer = new THREE.WebGLRenderer({ antialias: true,alpha:true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(sw,sh);
		$(renderer.domElement).css("position","absolute");
		$(renderer.domElement).appendTo(container);
		
		// Grid
		
		var line_material = new THREE.LineBasicMaterial( { color: 0x303030 } ),
			geometry = new THREE.Geometry(),
			floor = -75, step = 25;

		for ( var i = 0; i <= 40; i ++ ) {

			geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
			geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );

			geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
			geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );

		}

		var line = new THREE.LineSegments( geometry, line_material );
		//scene.add( line );
		
		//add planet
		
		var planetObjs = [
			{image:"assets/images/planet/01.jpg",x:67,y:-114,z:-24},
			{image:"assets/images/planet/02.jpg",x:83,y:-80,z:5},
			{image:"assets/images/planet/03.jpg",x:117,y:-64,z:13},
			{image:"assets/images/planet/04.jpg",x:119,y:-29,z:-14},
			{image:"assets/images/planet/05.jpg",x:135,y:5,z:-1},
			{image:"assets/images/planet/06.jpg",x:107,y:46,z:-10},
			{image:"assets/images/planet/07.jpg",x:118,y:86,z:12},
			{image:"assets/images/planet/08.jpg",x:79,y:109,z:20},
			{image:"assets/images/planet/09.jpg",x:34,y:114,z:14},
			{image:"assets/images/planet/10.jpg",x:-1,y:132,z:-11},
			{image:"assets/images/planet/11.jpg",x:-53,y:131,z:13},
			{image:"assets/images/planet/12.jpg",x:-84,y:98,z:-17},
			{image:"assets/images/planet/13.jpg",x:-95,y:56,z:7},
			{image:"assets/images/planet/14.jpg",x:-125,y:28,z:-14},
			{image:"assets/images/planet/15.jpg",x:-141,y:-30,z:0},
			{image:"assets/images/planet/16.jpg",x:-107,y:-71,z:-1},
			{image:"assets/images/planet/17.jpg",x:-87,y:-104,z:8},
			{image:"assets/images/planet/18.jpg",x:-43,y:-110,z:-12},
			{image:"assets/images/planet/19.jpg",x:-6,y:-129,z:12},
			{image:"assets/images/planet/20.jpg",x:35,y:-140,z:5}
		];
		
		var urls = [
			"assets/images/textures/skybox/px.jpg",
			"assets/images/textures/skybox/nx.jpg",
			"assets/images/textures/skybox/py.jpg",
			"assets/images/textures/skybox/ny.jpg",
			"assets/images/textures/skybox/pz.jpg",
			"assets/images/textures/skybox/nz.jpg"
		];
		var textureCube = new THREE.CubeTextureLoader().load( urls );
		var glowMap = new THREE.TextureLoader().load( "assets/images/textures/sun_halo.png" );
		
		for(var i=0;i<planetObjs.length;i++)
		{
			//y,z反了
			var tmp = planetObjs[i].y;
			planetObjs[i].y = planetObjs[i].z;
			planetObjs[i].z = tmp;
			
			planetObjs[i].x *= 3.2;
			planetObjs[i].y *= 4;
			planetObjs[i].z *= 3.2;
			
			planetObjs[i].textureCube = textureCube;
			planetObjs[i].glowMap = glowMap;
			
			var planet = new Planet(planetObjs[i]);
			scene.add(planet.mesh);
			planets.push(planet);
		}
		
		// Lights

		var light = new THREE.AmbientLight( 0xffffff );
		scene.add( light );
	}
	
	function animate()
	{
		requestAnimationFrame(animate);
		render();
	}
	
	function render()
	{
		var timer = 0.0001 * Date.now();
		camera.position.y = 200;
		camera.position.x = Math.cos( timer ) * 1000;
		camera.position.z = Math.sin( timer ) * 1000;
		
		$.each(planets,function(){
			this.update();
		});

		camera.lookAt( scene.position );
		renderer.render(scene, camera);
	}
	
	function setDataSource(ds)
	{
		if(looper!=undefined)looper.stop();
		var funcArr = (function(){
			var arr = [];
			var len = planets.length;
			for(var i=0;i<len;i++)
			{
				arr.push(new Handler(i).func);
			}
			
			function Handler(idx)
			{
				this.func = function(){showIdx(idx);};
			}
			return arr;
		})();
		looper = new App.Looper(21,funcArr);
		looper.start();
		
		var max = (function(){
			var result = 0;
			for(var i=0;i<ds.length;i++)
			{
				if(ds[i].total>result)result = ds[i].total;
			}
			return result;
		})();
		$.each(planets,function(i){
			this.scale = 0.3+1.1*ds[i].total/max;
			this.item.setDataSource(ds[i]);
		});
	}
	
	function showIdx(idx)
	{
		planets[idx].item.show(20);
		
		var idx1 = idx+10;
		idx1 = idx1>19 ? idx1-20 : idx1;
		planets[idx1].item.show(20);
	}
	
	/**
	 * 星球
	 */
	function Planet(data)
	{
		var geometry = new THREE.SphereBufferGeometry( 70, 32, 16 );
		var texture = new THREE.TextureLoader().load(data.image);
		var material = new THREE.MeshPhongMaterial({
			map:texture,
			lightMap:texture,
			envMap: data.textureCube,
			bumpMap:texture,
			bumpScale:2
		});
		var mesh = new THREE.Mesh(geometry,material );
		mesh.position.set(data.x,data.y,data.z);
		
		//添加发光
        var material = new THREE.SpriteMaterial( {map: data.glowMap,color:0x35BFFF});
        var sprite = new THREE.Sprite(material);
        sprite.scale.set(355,355,0);
        mesh.add( sprite );
        sprite.visible = false;
		
		mesh.visible = false;
		this.mesh = mesh;
		
		
		this.item = new InfoItem();
		this.item.view.appendTo(container);
		
		this.update = function()
		{
			var timer = 0.0001 * Date.now();
			mesh.rotation.x = 12;
			mesh.rotation.y=timer*2.5;
			
			var p = mesh.position.clone();
			var vector = p.project(camera);
			var pos = {
				x:(vector.x+1)*container.width()*0.5,
				y:-(vector.y-1)*container.height()*0.5
			};
			this.item.setPosition(pos.x,pos.y);
			if(this.scale!=undefined)
			{
				mesh.scale.set(this.scale,this.scale,this.scale);
				this.scale = undefined;
				mesh.visible = true;
			};
			if(sprite.material.map.image!=undefined)
			{
				sprite.visible = true;
			}
		}
	}
	
	function InfoItem()
	{
		this.view = $("#PlanetItemUI").find(".item").clone();
		this.view.hide();
		
		var lines = this.view.find(".lines img");
		var detail = this.view.find(".detail");
		var line;
		
		this.setPosition = function(tx,ty)
		{
			this.view.css("left",tx);
			this.view.css("top",ty);
			
			var center = {x:container.width()*0.5,y:container.height()*0.5};
			
			lines.hide();
			detail.css("text-align","left");
			if(tx<center.x && ty<center.y) //左上
			{
				line = lines.eq(2);
				line.show();
				line.css("left",-line.width()+10);
				line.css("top",-line.height()+10);
				
				detail.css("text-align","right");
				detail.css("left",-detail.width()-140);
				detail.css("top",-182);
			}
			else if(tx<center.x && ty>center.y) //左下
			{
				line = lines.eq(3);
				line.show();
				line.css("left",-line.width()+10);
				line.css("top",-9);
				
				detail.css("text-align","right");
				detail.css("left",-detail.width()-140);
				detail.css("top",82);
			}
			else if(tx>center.x && ty<center.y) //右上
			{
				line = lines.eq(0);
				line.show();
				line.css("left",-10);
				line.css("top",-line.height()+9);
				detail.css("left",140);
				detail.css("top",-182);
			}
			else if(tx>center.x && ty>center.y) //右下
			{
				line = lines.eq(1);
				line.show();
				line.css("left",-10);
				line.css("top",-10);
				detail.css("left",140);
				detail.css("top",82);
			}
		}
		
		this.setDataSource = function(ds)
		{
			var numLabel = detail.find(".num");
			var nameLabel = detail.find(".name");
			var descriptionLabel = detail.find(".description");
			numLabel.text($.number(ds.total));
			nameLabel.text(ds.name);
			descriptionLabel.text(ds.description);
		}
		
		this.show = function(live)
		{
			this.view.fadeIn();
			var _self = this;
			TweenLite.delayedCall(live,function(){
				_self.hide();
			});
		}
		
		this.hide = function()
		{
			this.view.fadeOut();
		}
	}
}
