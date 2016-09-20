var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected successfully to server");

	removeDocument(db, function() {
		db.close();
	});
});

var removeDocument = function(db, callback) {
	// Get the documents collection
	var collection = db.collection('documents');
	// Insert some documents
	collection.deleteOne({ }, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.result.n);
		console.log("Removed the document with the field a equal to 3");
		callback(result);
	});    
}
