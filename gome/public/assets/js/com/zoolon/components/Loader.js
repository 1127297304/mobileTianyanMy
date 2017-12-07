App.Loader = function(url,vars,onSuccess,onError,dataType)
{
	var ajax = $.ajax({
		type:'GET',
		url:url,
		data:vars,
		dataType:dataType == undefined ? 'json' : dataType,
		success: onSuccess,
		error:onError
	});
	
	this.abort = ajax.abort;
}
