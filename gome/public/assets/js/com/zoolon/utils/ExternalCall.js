//test
$(window).keyup(function(e){
	switch(e.keyCode)
	{
		case 49: //1
		ExternalCall(JSON.stringify({cmd:"showUser",idx:0}));
		break;
		case 50: //2
		ExternalCall(JSON.stringify({cmd:"showUser",idx:1}));
		break;
		case 51: //3
		ExternalCall(JSON.stringify({cmd:"showUser",idx:2}));
		break;
		case 52: //4
		ExternalCall(JSON.stringify({cmd:"showUser",idx:3}));
		break;
		case 53: //5
		ExternalCall(JSON.stringify({cmd:"showUser",idx:4}));
		break;
		case 54: //6
		ExternalCall(JSON.stringify({cmd:"showUser",idx:5}));
		break;
		case 55: //7
		ExternalCall(JSON.stringify({cmd:"showUser",idx:6}));
		break;
		case 56: //8
		ExternalCall(JSON.stringify({cmd:"showUser",idx:7}));
		break;
		case 57: //9
		ExternalCall(JSON.stringify({cmd:"showUser",idx:8}));
		break;
		case 48: //10
		ExternalCall(JSON.stringify({cmd:"showUser",idx:9}));
		break;
		case 189: //-
		ExternalCall(JSON.stringify({cmd:"userPlay"}));
		break;
		case 187: //+
		ExternalCall(JSON.stringify({cmd:"userStop"}));
		break;
	}
});
function ExternalCall(json)
{
	$(document).trigger("ExternalCall",json);
}
