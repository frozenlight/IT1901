
// Load NPM package for use in server
var mongoose = require('mongoose');

// Connect to MongoDB server at localhost in the mongoose-test database
mongoose.connect('mongodb://localhost/mongoose-test');

// Create mongoose schema
var BandSchema = new mongoose.Schema({
	name: String,
	concerts: Array, // maybe declare type of array? e.g. [String] as array of strings
	members: Array,
});

// Create mongoose model for the created schema
var Band = mongoose.model('Band', BandSchema);

// Create a new Band schema/model in memory
var band = new Band({
	name: 'Some band name',
	concerts:[
		'some concert',
		'some other concert',
		'some other other concert'
	], 
	members:[
		'Arne',
		'Bjarne',
		'Pelle'
	]
});

// Save the Band in MongoDB
band.save(function(err){
  if(err)
    console.log(err);
  //else
    //console.log(band);
});

// Create a standalone band object

var band2 = {
	name: 'Band/2',
	concerts:[
		'some concert no one heard of',
		'some other concert',
		'Their last concert'
	], 
	members:[
		'Brynjar',
		'Alf',
		'Kåre',
		'Bjørn'
	]
}

// Create and save a Band object in the database in one single step
Band.create(band2, function(err, band){
  if(err) console.log(err);
  //else console.log(JSON.stringify(band));
});

// Find all data in the Band collection
Band.find(function(err,bands) {
	if (err) return console.error(err);
	//console.log(JSON.stringify(bands))
});

// callback function to avoid duplicating it all over
var callback = function (err, data) {
  if (err) { return console.error(err); }
  else { 
  	for (var i = 0; i<data.length;i++){
  		console.log(JSON.stringify(data[i]));
  	}
  }
}

// Trying to find concerts which contain
// 'some other concert' as one of their concerts
Band.find({concerts:'some other concert'}, callback);

// Query for names ending with '2', can probably be done with regex?
//Band.find({name: /2$/ }, callback);
