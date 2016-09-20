
//////////////////////////////////////////////////////////////////////
// Connect to the database at localhost:27017
//////////////////////////////////////////////////////////////////////

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  insertDocuments(db, function() {
    findDocuments(db, function() {
      db.close();
    });
  });
});

//////////////////////////////////////////////////////////////////////
// Insert a:1 a:2 and a:3 into the database
//////////////////////////////////////////////////////////////////////

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('bands');
  // Insert some documents

  //Create band objects

  var band1 = {
  	name : "bandname",
  	conserts:
  	  [
  	  	"link to concert 1",
  	  	"link to concert 2",
  	  	"link to concert 3"
  	  ],
  	popularity : 81648712685,
  	members : 
  	  [
  	    "band member 1",
  	    "band member 2",
  	    "band member 3",
  	    "band member 4"
  	  ],
  	 }

  collection.insertMany([
    {a : band1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

//////////////////////////////////////////////////////////////////////
// Request documents from the database
//////////////////////////////////////////////////////////////////////

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('bands');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log(docs.length)
    d = docs
    for (var i = 0; i<docs.length;i++) {
    	if (d[i].a.name) {
    		console.log(d[i].a.conserts)
    	}
    }
    console.log("Found the following records");
    callback(docs);
  });
}

