
console.log("HEIII, fant den")

const sel2 = document.getElementById('sel2');


function ticketCalc(){
	console.log("HEIII, gjorde noe mer")
	const bookings = sel2.childNodes;
	prompt(bookings);
}

document.addEventListener("DOMContentLoaded",function(e){
	console.log("HEIII, gjorde noe")
	ticketCalc();
})