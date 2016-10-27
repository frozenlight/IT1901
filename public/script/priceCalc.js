

function ticketCalc(bookings,stages){
	let bandSelect = document.getElementById('bands')
	let stageSelect = document.getElementById('stages')
	let ticketPrice = document.getElementById('ticketPrice')
	let expenses = document.getElementById('expenses')
	let extraExpenses = document.getElementById('extraExpenses')

	console.log(bookings)
	console.log(stages)

	let chosenBands = getSelectValues(bandSelect)
	let stage = getSelectValues(stageSelect)

	let capacity = 0
	let studentMass = 36000
	let popularity = 1/3
	let followers = 0
	expenses.value = 0

	for(let i = 0; i < bookings.length; i++){
		if(!bookings[i].concert_created){
			for(let j = 0; j < chosenBands.length; j++){
				if(chosenBands[j] == bookings[i].band.name){
					let curExpense = Number(expenses.value)
					curExpense += Number(bookings[i].price)
					expenses.value = curExpense

					popularity *= (1/Number(bookings[i].band.spotify_popularity))
					followers += Number(bookings[i].band.spotify_followers)
				}
			}
		}
	}
	for(let i = 0; i < stages.length; i++){
		for(let j = 0; j < stage.length; j++){
			if(stage[j] == stages[i].name){
				let curExpense = Number(expenses.value)
				console.log(expenses.value)
				curExpense += Number(stages[i].price)
				expenses.value = curExpense
				console.log(expenses.value)
				capacity = stages[i].capacity
			}
		}
	}

	expenses.value = Number(extraExpenses.value) + Number(expenses.value)

	let expectedSales = studentMass * popularity + followers/1000
	console.log("expectedSales = ",studentMass," * ",popularity," + ",followers,"/1000 = ",expectedSales)
	if (capacity < expectedSales){
		expectedSales = capacity
	}

	ticketPrice.value = (expenses.value*1.5)/expectedSales

	console.log("ticketPrice.value = ",expenses.value,"*1.5/",expectedSales)
}

function getSelectValues(select) {
  let result = [];
  let options = select && select.options;
  let opt;

  for (let i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(/*opt.value ||*/ opt.text);
    }
  }
  return result;
}

document.addEventListener("DOMContentLoaded",function(e){
	let bookings = $.get('/api/bookings')
	let stages = $.get('/api/stages')
	$.when(bookings,stages).done(function(){
		bookings = JSON.parse(bookings.responseText)
		stages = JSON.parse(stages.responseText)

		$('#bands').on('change', function(e) {
			ticketCalc(bookings,stages)
 		 });

		$('#stages').on('change', function(e) {
			ticketCalc(bookings,stages)
 		 });

		$('#extraExpenses').on('change', function(e) {
			ticketCalc(bookings,stages)
 		 });

		
	})
})