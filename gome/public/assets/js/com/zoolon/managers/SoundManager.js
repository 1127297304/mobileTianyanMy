App.SoundManager = {};

App.SoundManager.play = function(url)
{
	var musicPlayer = $("<audio>",{
		src:url,
		loop:true
	});
	musicPlayer.get(0).play();
}