
var mongoose = require('mongoose')
var shortid = require('shortid')

var Stage = require('./Stage.js')
var Band = require('./Band.js')

var ConcertSchema = new mongoose.Schema({
	name: String,
	genre: String,
	bands: [{type: mongoose.Schema.ObjectId, ref: 'Band'}],
	stage: {type: mongoose.Schema.ObjectId, ref: 'Stage'},
	audSize: Number,
 	date: String,
	time: String,

	bandIDs: Array, //Will contain the database ID's for the bands, if they exist
});

module.exports = mongoose.model('Concert', ConcertSchema)