'use strict';

var express = require('express');

var app = express();

app.get('/test', function(req,res){
	res.send("Hello world!")
})

app.listen(3000, function(){
	console.log("The fronted server is running: port 3000")
});

