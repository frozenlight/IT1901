var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected successfully to server");

		indexCollection(db, function() {
			db.close();
		});
});

var indexCollection = function(db, callback) {
	db.collection('documents').createIndex(
		{ "a": 1 },
			null,
			function(err, results) {
				console.log(results);
				callback();
		}
	);
};