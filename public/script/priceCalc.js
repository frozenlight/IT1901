
console.log("HEIII, fant den")

function ticketCalc(bookings,stages){
	console.log("WTF")
	
}

document.addEventListener("DOMContentLoaded",function(e){
	console.log("HEIII, gjorde noe")
	let bookings = $.get('/api/bookings')
	let stages = $.get('/api/stages')
	$.when(bookings,stages).done(function(){
		bookings = JSON.parse(bookings.responseText)
		stages = JSON.parse(stages.responseText)
		console.log(bookings)
		
		document.getElementById('sel2').addEventListener('onChange',function(e){
			console.log("FORANDRING FRYDER")
			ticketCalc(bookings,stages)
		})
		document.getElementById('sel1').addEventListener('onChange',function(e){
			ticketCalc(bookings,stages)
		})
	})
})