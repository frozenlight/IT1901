'use strict';

var express = require('express');

var app = express();
//app.set('', "app.js", '')

app.get('/test', function(req,res){
	
	res.send("")

})

app.listen(3000, function(){
	console.log("The fronted server is running: port 3000")
});

