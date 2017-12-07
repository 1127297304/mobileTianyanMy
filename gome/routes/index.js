
var fs = require('fs')
module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
  });
  // app.post('/updateData', function(req,res){
  // 	var obj = req.body.param
  // 	fs.readFile('./public/data/0.json', function(err, data) {
  // 		if(err) throw err;
  // 		var JsonArr = JSON.parse(data),
  // 				len = JsonArr.length; 
  // 		for(var i =0;i < len; i++){
  // 			for(var j in JsonArr[i]){
  // 				if(j === 'order_amount'){
  // 					JsonArr[i][j] = 111;
  // 				}
  // 			}
  // 			var buffer = new Buffer(JsonArr[i])
  // 		}
  // 		fs.writeFile('./result.json',JsonArr,function(err){
	 //        if(err) throw err;
	 //        console.log('has finished');
	 //    });
  // 	})
  // 	res.send(JSON.stringify({"data":"success"}))
  // })
};
