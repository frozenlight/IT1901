
var mongoose = require('mongoose');
var shortid = require('shortid');

var BandSchema = new mongoose.Schema({
	_id: {type:String,'default':shortid.generate},
	name:String,
	concerts:[String], // maybe declare type of array? e.g. [String] as array of strings
	members:[String],
	genre: String,

	spotify_id:String,
	spotify_name:String,
	spotify_followers:String,
	spotify_genres:[String],
	spotify_popularity:String,
	spotify_images:[String],
});

module.exports = mongoose.model('Band', BandSchema);
