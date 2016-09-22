
var mongoose = require('mongoose');

var BandSchema = new mongoose.Schema({
	name: String,
	concerts: Array, // maybe declare type of array? e.g. [String] as array of strings
	members: Array,
});

module.exports = mongoose.model('Band', BandSchema);
