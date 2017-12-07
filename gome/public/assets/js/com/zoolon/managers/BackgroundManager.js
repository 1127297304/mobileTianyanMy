App.BackgroundManager = {};
App.BackgroundManager.init = function()
{
	//new App.BackgroundStyle0();
	//new App.BackgroundStyle1();
	new App.BackgroundStyle2();
}

/**
 * 星空闪烁
 */
App.BackgroundStyle0 = function()
{
	var container = $("<div>");
	container.appendTo(App.view);
	var img = $("<img>");
	img.css("position","absolute");
	img.attr("src","assets/images/bg.jpg");
	img.appendTo(container);
	
	var stars = [];
	
	loop();
	
	function loop()
	{
		var delay = Math.random()*5;
		TweenLite.delayedCall(delay,function(){
			clear();
			var num =  Math.round(Math.random()*200); //星星个数
			for(var i=0;i<num;i++)
			{
				var star = new Star();
				star.view.appendTo(container);
				stars.push(star);
				star.show();
			}
			loop();
		});
	}
	
	function clear()
	{
		while(stars.length>0)
		{
			var star = stars[0];
			stars.shift();
			star.hide();
		}
	}
	
	function Star()
	{
		var styles = ["a1","a2","a3","d1","d2","d3","x1","x2","x3"];
		this.view = $("<img>");
		this.view.css("position","absolute");
		var style = Math.random()*(styles.length-1);
		style = Math.round(style);
		this.view.attr("src","assets/images/xingxing/"+styles[style]+".png");
		var ts = Math.random()*2;
		TweenLite.set(this.view,{scale:ts});
		var tx = Math.random()*App.view.width();
		var ty = Math.random()*App.view.height();
		this.view.css("left",tx);
		this.view.css("top",ty);
		
		this.show = function()
		{
			var dl = Math.random()*6;
			TweenLite.from(this.view,0.5,{alpha:0,delay:dl});
		}
		
		this.hide = function()
		{
			var _self = this;
			var dl = Math.random()*6;
			TweenLite.delayedCall(dl,function(){
				_self.view.remove();
			});
		}
	}
}

/**
 * 粒子海洋
 */
App.BackgroundStyle1 = function()
{
	var container = $("<div>");
	container.appendTo(App.view);
	container.width(App.view.width());
	container.height(App.view.height());
	
	var img = $("<img>");
	img.css("position","absolute");
	img.attr("src","assets/images/bg.jpg");
	img.appendTo(container);
	
	var SEPARATION = 100, AMOUNTX = 150, AMOUNTY = 50;
	var camera, scene, renderer;
	var particles, particle, count = 0;
	var windowHalfX = container.width() / 2;
	var windowHalfY = container.height() / 2;
	
	init();
	animate();
	
	function init() {

		camera = new THREE.PerspectiveCamera( 75, container.width() / container.height(), 1, 10000 );
		camera.position.z = 2000;

		scene = new THREE.Scene();

		particles = new Array();

		var PI2 = Math.PI * 2;
		var material = new THREE.SpriteCanvasMaterial( {

			color: 0xffffff,
			program: function ( context ) {

				context.globalAlpha = 0.3;
				context.beginPath();
				context.arc( 0, 0, 0.5, 0, PI2, true );
				context.fill();

			}

		} );

		var i = 0;

		for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

			for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

				particle = particles[ i ++ ] = new THREE.Sprite( material );
				particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
				particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
				scene.add( particle );

			}

		}

		renderer = new THREE.CanvasRenderer({alpha:true});
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.width(), container.height() );
		$(renderer.domElement).css("position","absolute");
		$(renderer.domElement).appendTo(container);
	}
	
	function animate() {

		requestAnimationFrame( animate );

		render();
	}
	
	function render() {

		camera.position.y = 200;
		camera.lookAt( scene.position );

		var i = 0;

		for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

			for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

				particle = particles[ i++ ];
				particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
					( Math.sin( ( iy + count ) * 0.5 ) * 50 );
				particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 4 +
					( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;

			}

		}

		renderer.render( scene, camera );

		count += 0.1;

	}
}

/**
 * 随机粒子
 */
App.BackgroundStyle2 = function()
{
	var container = $("<div>");
	container.appendTo(App.view);
	container.width(App.view.width());
	container.height(App.view.height());
	
	var img = $("<img>");
	img.css("position","absolute");
	img.attr("src","assets/images/bg.jpg");
	img.appendTo(container);
	
	var camera, scene, renderer, group, particle;
	
	var windowHalfX = container.width() / 2;
	var windowHalfY = container.height() / 2;
	
	init();
	animate();
	
	function init() {

		camera = new THREE.PerspectiveCamera( 75, container.width() / container.height(), 1, 3000 );
		camera.position.z = 0;

		scene = new THREE.Scene();

		var PI2 = Math.PI * 2;
		var program = function ( context ) {

			context.beginPath();
			context.globalAlpha = 0.8;
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();

		};

		group = new THREE.Group();
		scene.add( group );

		for ( var i = 0; i < 6000; i++ ) {

			var material = new THREE.SpriteCanvasMaterial( {
				color: Math.random() * 0x808008 + 0x808080,
				program: program
			} );

			particle = new THREE.Sprite( material );
			var r = container.width();
			particle.position.x = Math.random() * r - r*0.5;
			particle.position.y = Math.random() * r - r*0.5;
			particle.position.z = Math.random() * r - r*0.5;
			particle.scale.x = particle.scale.y = Math.random() * 15 + 10;
			group.add( particle );
		}

		renderer = new THREE.CanvasRenderer({alpha:true});
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.width(), container.height() );
		$(renderer.domElement).css("position","absolute");
		$(renderer.domElement).appendTo(container);
	}
	
	function animate() {

		requestAnimationFrame( animate );

		render();

	}

	function render() {

		camera.lookAt( scene.position );

		group.rotation.x += 0.002;
		group.rotation.y += 0.001;

		renderer.render( scene, camera );

	}
}
