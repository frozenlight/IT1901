var search_button

document.addEventListener('DOMContentLoaded', function(){
	search_button = document.getElementById('spotify_search_button')

	search_button.addEventListener('click', function(){

	var name = document.getElementById('spotify_search_field').value

	var url_parts = ['https://api.spotify.com/v1/search?q=','&type=artist&limit=1']

	$.get(url_parts.join(name),function(data,status){
		console.log('Data: '+JSON.stringify(data))
		console.log('Status: '+status)

		var artist = data.artists.items[0]

		document.getElementById('spotify_popularity').value = artist.popularity
		document.getElementById('spotify_search_field').value = artist.name
		document.getElementById('spotify_genres').value = artist.genres.join(',')
		document.getElementById('spotify_id').value = artist.id
		document.getElementById('spotify_followers').value = artist.followers.total

		var image = artist.images[0]
		document.getElementById('spotify_image').value = image.url

		var view_image = document.getElementById('artist_image')
		view_image.src = image.url
		view_image.height = "100"
		view_image.width = "100"
	})
})
})
