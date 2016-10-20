
var Band = require('../models/Band.js');
var User = require('../models/user.js');
//var replaceAll = require('./prototypes.js')

////////////////////////////////////////////////////////////
// Routing functions for /bands/
////////////////////////////////////////////////////////////

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

module.exports = function(router,passport,isLoggedIn,user){

	router.route('/bands')

		// GET Function for /bands/
		.get(isLoggedIn, function(req,res){

			// Search database for ALL stage objects
			Band.find(function(err, bands){
				if (err){ res.send(err); }

				// Render found objects with swig and send to client 
				res.render('bandliste', {bands:bands,title:'List of bands'});
			});
		})

	// Routing function for an individual band object
	router.route('/band/:name')

		.get(isLoggedIn, function(req,res){

			// Find object by its' id and render page to user, if not found send 404
			Band.findOne({'name':req.params.name})
				.populate('concerts')
				.populate('stages')
				.populate('bookings')
				.exec(function (err, band) {
					if (err) {res.send(err)}
					if (band) {

						res.render('bandinfo',{band:band});
					}
					else {
						res.render('not-found')
					}
				})
		})
		
		.delete(isLoggedIn, user.can('delete band'), function(req, res) {
			Band.findOneAndRemove({'name' : req.params.name}, function (err, band) {
        		res.redirect('/bands')
      		})
		})

	// Routing function for an individual objects edit page
	router.route('/band/:name/edit')

		// POST function for this route, on recieve edited object via form
		.post(isLoggedIn, function(req,res) {
			
			Band.findOne({'name':req.params.name}, function(err,band) {
				if (err) {
					res.send(err)
				}
				if (band) {

					//onsole.log('REBUILD: '+req.body)

					//Ugly thing done because i cant seem to find the constructor of the JSON type
					if (req.body.spotify_albums != '') {
						console.log('SETTING ALBUMS')
						band.spotify_albums = JSON.parse(req.body.spotify_albums)
						req.body.spotify_albums = ''
					}
					if (req.body.spotify_top_tracks != '') {
						console.log('SETTING TOP TRACKS')
						band.spotify_top_tracks = JSON.parse(req.body.spotify_top_tracks)
						req.body.spotify_top_tracks = ''
					}


					// iterate over keys in recieved form, and if anything is edited, change information in object in database
					Object.keys(req.body).forEach(function (key, index) {
						if ([key] in band && req.body[key] != '') {
							if (typeof band[key] != "undefined" && band[key].constructor === Array) {
								band[key] = req.body[key].split(',')
							}
							else if (typeof band[key] != "undefined" && band[key].constructor === Object) {
								console.log(req.body[key])
								band[key] = JSON.parse(req.body[key])
							}
							else {
								band[key] = req.body[key]
							}
						}
					})

					//console.log('CONSTRUCTOR THINGY'+band.spotify_albums.constructor.name)

					// After edit, save and redirect to objects' page again, else send error
					band.save(function(err){
						if(err){res.send(err)}
						else{
							res.redirect('/band/' + req.params.name)
						}
					})
				}
				else {
					// if for some reason the edited object is not found, send 404
					res.render('not-found')
				}
			})
		})

		// GET function for this route
		.get(isLoggedIn, function(req,res){

			// Find object in database by id and render edit page for object type if found.
			// If not found, send 404
			Band.findOne({'name':req.params.name}, function(err,band) {
				if (err) {res.send(err)}
				if (band) {

					res.render('band-edit',{band:band});
				}
				else {
					res.render('not-found')
				}
			})
		})

		.delete(isLoggedIn, user.can('delete band'), function(req, res) {
			Band.findOneAndRemove({'name' : req.params.name}, function (err, band) {
        		res.redirect('/bands')
      		})
		})

	// Routing functions for /bands/create/
	router.route('/bands/create')

		// POST function for /bands/create/
		.post(isLoggedIn, function(req,res){
			// On POST-recieve, create a Band Object with body params from form
			//console.log('FIRST BUILD: '+req.body)

			Band.find({name:req.body.name}, function(err,old_band){
				if (err) {res.send(err)}
				if (old_band.name != undefined) {res.send("BAND NAME ALREADY EXISTS, ABORTING" + old_band.name)}
				else{
					var name = req.body.name;

					var band = new Band({
	    				name:"",
	    				members:[],
	    				description:"",
	    				previous_concerts:[],
						album_sales:[],

						spotify_id: "",
						spotify_followers:"",
						spotify_genres:[],
						spotify_popularity:"",
						spotify_image:"",

						spotify_albums:{},
						spotify_top_tracks:{},

						external_urls:[],

						lastfm_playcount:"",
						lastfm_listeners:"",
	    			})

	    			Object.keys(req.body).forEach(function(key,index) {
						if ([key] in band && req.body[key] != ''){
							if(typeof band[key] != "undefined" && band[key].constructor === Array){
								band[key] = req.body[key].split(',');
							}
							else if (typeof band[key] != "undefined" && band[key].constructor === Object) {
								console.log(req.body[key])
								band[key] = JSON.parse(req.body[key])
							}
							else{
								band[key] = req.body[key];
							}
						}
					});

					band.save()
					
					var bandUser = new User();
					bandUser.local.username = req.body.name;
					bandUser.local.password = bandUser.generateHash(req.body.name);
					bandUser.role = 'band';
					bandUser.save()
					
					var managerUser = new User();
					managerUser.local.username = req.body.name + '_manager';
					managerUser.local.password = managerUser.generateHash(req.body.name);
					managerUser.role = 'manager';
					managerUser.save()
					
					// Redirect to band page after creation
					res.redirect('/band/' + band.name)
					
					
					// Vi må sette opp slik at når du laget et band, så opprettes det en band-bruker og en band-manager. Disse må lenkes med at band har et felt band_user og 					// manager_user av typen {type:mongoose.Schema.ObjectId,ref:'User'. Band-bruker og manager-bruker må begge ha et felt linked_band av typen									// {type:mongoose.Schema.ObjectId,ref:'Band'}. For at dette skal virke må models/Band.js ha inkludert models/user.js og vica versa.
				}
			})
		})

		// GET function for this route, render form for creating this object type
		.get(isLoggedIn, function(req,res){
			res.render('band-form',{});
		});

}
