var App = {};

function trace(any)
{
    console.log(any);
}

//随机颜色
function randomColor()
{
	var rand = Math.floor(Math.random()*0xFFFFFF).toString(16);
	return rand.length == 6 ? "#"+rand : randomColor();
}