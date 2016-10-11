
var Concert = require('../models/Concert.js');
var Band = require('../models/Band.js');
//require('../config/passport.js')(passport);

var replaceAll = require('./prototypes.js')

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

////////////////////////////////////////////////////////////
// Routing functions for /concerts/
////////////////////////////////////////////////////////////

module.exports = function(router,passport,isLoggedIn){
router.route('/concerts')

	// GET Function for /concerts/
	.get(isLoggedIn, function(req,res){

		// Search database for ALL Concert objects
		Concert.find(function(err, concerts){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client
			console.log(JSON.stringify(concerts))
			res.render('konserttabell', {concerts:concerts,title:'List of concerts'});
		});
	});

router.route('/concert/:concert_id')

	.get(isLoggedIn, function(req,res){

		Concert.findById(req.params.concert_id, function(err,concert) {
			if (err) {res.send(err)}
			console.log(concert)
			if (concert) {
				res.json(concert);
			}
			else {
				res.sendStatus(404);
			}
		})
	})

//Routing function for editing concert
router.route('/concert/:concert_id/edit')
	
	// POST function for this route, on recieve edited object via form
	.post(isLoggedIn, function(req,res) {
		
		Concert.findById(req.params.concert_id, function(err,concert) {
			if (err) {res.send(err)}
			if (concert) {

				// iterate over keys in recieved form, and if anything is edited, change information in object in database
				Object.keys(req.body).forEach(function(key,index) {
					if ([key]in concert && req.body[key] != ''){
						if(typeof concert[key] != "undefined" && concert[key].constructor === Array){
							concert[key] = req.body[key].split(',');
						}
						else{
							concert[key] = req.body[key];
						}
					}
				});
				// After edit, save and redirect to objects' page again, else send error
				concert.save(function(err){
					if(err){res.send(err)}
					else{
						//res.redirect('/concert/' + req.params.concert_id)

						//There is no dedicated concert page, therefore redirecting to the table
						res.redirect('/concerts');

					}
				})
			}
			else {
				// if for some reason the edited object is not found, send 404
				res.sendStatus(404);
			}
		})
	})



	// Find object in database by id and render edit page for object type if found.
	// If not found, send 404
	.get(isLoggedIn, function(req,res){
		Concert.findById(req.params.concert_id, function(err,concert){
			if (err) {res.send(err)};
			if (concert) {
				res.render('concert-edit', concert);
			}
			else {
				res.sendStatus(404);
			}
		})
	})

// Routing functions for /concerts/create/
router.route('/concerts/create')

	// POST function for /concerts/create/
	.post(isLoggedIn, function(req,res){
		// On POST-recieve, create a Concert Object with body params from form
		var concert = new Concert({
			name:req.body.name,
			bands: req.body.bands.split(','),
			genre: req.body.genre,
			stage: req.body.stage,
			audSize: req.body.audSize,
			date:req.body.date,
			time:req.body.time,

			bandIDs:[],
			//genres:req.body.genres.replaceAll(' ','').split(','),
		})
		//Skal prøve å søke opp band-navnene oppgitt i databasen, for å lage en link mellom konsert og band
		concert.bands.forEach(function(bandName){
			Band.findOne({'name':bandName},'_id name',function(err,band){
				if (err) {res.send(err)}
				if(band){
					console.log('FOUND IT! %s %s', band.name, band._id);
					var band_and_id = {name:band.name,id:band._id};
					console.log(band_and_id);
					concert.bandIDs.push(band_and_id);
					console.log("state of bandIDs:"+JSON.stringify(concert.bandIDs));
					concert.save();
				}
			})
		})

		// Add model other variables for created Concert model
		// ......

		// Send redirect to concert object that was just created
		//res.redirect('/concert/' + concert._id)

		//There is no dedicated concert page, therefore redirecting to the table
		res.redirect('/concerts');
	})

	.get(isLoggedIn, function(req,res){
		res.render('concert-form',{});
	});

}