
var mongoose = require('mongoose');
var shortid = require('shortid');

var BandSchema = new mongoose.Schema({
	_id: {type:String,'default':shortid.generate},
	name:String,
	members:[String],
	description: String,
	previous_concerts:[String],
	album_sales:[String],

	spotify_id:String,
	spotify_followers:String,
	spotify_genres:[String],
	spotify_popularity:String,
	spotify_image:String,
});

module.exports = mongoose.model('Band', BandSchema);
