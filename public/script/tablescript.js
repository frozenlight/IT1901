$(document).ready(function() {
	//Søkefunksjon
	$(".search").keyup(function(){
		let searchTerm = $(".search").val();
		let listItem = $('.results tbody').children('tr');
		let searchSplit = searchTerm.replace(/ /g, "'):containsi('")

		$.extend($.expr[':'], {'containsi': function(elem, i , match, array){
				return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
			}
		});

		$(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function(e){
			$(this).attr('visible', 'false');
		});

		$(".results tbody tr:containsi('" + searchSplit + "')").each(function(e){
			$(this).attr('visible','true');
		});
	});

	$("#scenedrop li").on("click", function(){
		let searchTerm = $('.search').val($(this).text());
		let searchText = searchTerm.val();
		let listItem = $('.results tbody').children('tr');
		let searchSplit = searchText.replace(/ /g, "'):containsi('")

		$.extend($.expr[':'], {'containsi': function(elem, i , match, array){
				return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
			}
		});

		$(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function(e){
			$(this).attr('visible', 'false');
		});

		$(".results tbody tr:containsi('" + searchSplit + "')").each(function(e){
			$(this).attr('visible','true');
		});
	});

});