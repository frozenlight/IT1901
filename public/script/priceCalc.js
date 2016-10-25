

function ticketCalc(bookings,stages,chooseBands,chooseStage){
	console.log("HEIUHEUGEHKG")
	console.log(getSelectValues(chooseBands))
	console.log(getSelectValues(chooseStage))
}

function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
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
		console.log("HEIUHEUGEHKG 2")
		
		let chooseBands = document.getElementById('bands')
		let chooseStage = document.getElementById('stages')

		$('#bands').on('change', function(e) {
			ticketCalc(bookings,stages,chooseBands,chooseStage)
 		 });

		$('#stages').on('change', function(e) {
			ticketCalc(bookings,stages,chooseBands,chooseStage)
 		 });

		
	})
})