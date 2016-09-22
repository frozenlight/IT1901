
var mongoose = require('mongoose');
var shortid = require('shortid');

var BandSchema = new mongoose.Schema({
	_id: {type:String,'default':shortid.generate},
	name: String,
	concerts: Array, // maybe declare type of array? e.g. [String] as array of strings
	members: Array,
});

module.exports = mongoose.model('Band', BandSchema);
