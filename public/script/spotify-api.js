

const artists_url = ['https://api.spotify.com/v1/search?q=','&type=artist&limit=1']
const albums_url = ['https://api.spotify.com/v1/artists/','/albums?market=NO']
const top_tracks_url =['https:/api.spotify.com/v1/artists/','/top-tracks?country=NO']
var search_button

document.addEventListener('DOMContentLoaded', function(){
	search_button = document.getElementById('spotify_search_button')

	search_button.addEventListener('click', function(){

	var name = document.getElementById('spotify_search_field').value

	var artists = $.get(artists_url.join(name))

	$.when(artists).done(function () {

		artists = JSON.parse(artists.responseText)
		console.log('Artists: '+JSON.stringify(artists))
		console.log('Status: '+status)

		var artist = artists.artists.items[0]

		document.getElementById('spotify_popularity').value = artist.popularity
		document.getElementById('spotify_search_field').value = artist.name
		document.getElementById('spotify_genres').value = artist.genres.join(',')
		document.getElementById('spotify_id').value = artist.id
		document.getElementById('spotify_followers').value = artist.followers.total

		var image = artist.images[0]
		document.getElementById('spotify_image').value = image.url

		/*var view_image = document.getElementById('artist_image')
		view_image.src = image.url
		view_image.height = "100"
		view_image.width = "100"*/

		var albums = $.get(albums_url.join(artist.id))

		var top_tracks = $.get(top_tracks_url.join(artist.id))

		$.when(albums,top_tracks).done(function () {
			albums = JSON.parse(albums.responseText)
			top_tracks = JSON.parse(top_tracks.responseText)

			var doc_albums = document.getElementById('spotify_albums')
			var doc_top_tracks = document.getElementById('spotify_top_tracks')

			var albums_array = []

			console.log(albums.items)
			console.log(top_tracks.tracks)

			var array_of_names = []
			 
			for (var i = 0; i<albums.items.length; i++) {
				var album = albums.items[i]
				var albums_dict = {
					id:album.id,
					type:album.album_type,
					image:album.images[0].url,
					name:album.name,
				}
				if (!array_of_names.includes(artist.name)) {
					array_of_names.push(albums_dict.name)
					albums_array.push(albums_dict)
				}

			}
			
			var tracks_array = []

			for (var i = 0; i<top_tracks.tracks.length; i++) {
				var track = top_tracks.tracks[i]
				var tracks_dict = {
					id:track.id,
					album:track.album.name,
					name:track.name,
					preview_url:track.preview_url,
					popularity:track.popularity
				}
				tracks_array.push(tracks_dict)
			}

			console.log(albums_array)
			console.log(tracks_array)

			doc_albums.value = JSON.stringify(albums_array)
			doc_top_tracks.value = JSON.stringify(tracks_array)

			
		})

	})


})
})
