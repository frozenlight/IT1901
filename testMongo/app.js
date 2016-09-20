var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected to server");

  insertDocuments(db, function() {
    db.close();
  });
});

var info_metallica = {band : "Metallica", concerts : 3, popularSongs :[ "Nothing Else Matters", "Master of Puppets"], popularity : 3209}
var info_acdc = {band : "AC/DC", concerts : 4, popularSongs :["TNT", "Thunderstruck"], popularity : 3424}

var docsToInsert = [info_metallica, info_acdc];

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany(docsToInsert, function(err, result) {
    assert.equal(err, null);
    assert.equal(docsToInsert.length, result.result.n);
    assert.equal(docsToInsert.length, result.ops.length);
    console.log("Inserted " + docsToInsert.length + " documents into the collection");
    callback(result);
  });
}
