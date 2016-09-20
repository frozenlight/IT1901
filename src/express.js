'use strict';

var express = require('express');
var find = require('../testMongo/findDoc.js')

var app = express();

app.get('/test', function(req,res){
	res.send(find.findDocuments())
})

app.listen(3000, function(){
	console.log("The fronted server is running: port 3000")
});

