$(document).ready(function() {
	//Søkefunksjon
	$(".search").keyup(function(){
		let searchTerm = $(".search").val();
		let listItem = $('.results tbody').children('tr');
		let searchSplit = searchTerm.replace(/ /g, "'):containsi('")

		Search(searchSplit);
	});

	$("#tabledrop li").on("click", function(){
		let searchTerm = $('.search').val($(this).text());
		let searchText = searchTerm.val();
		let listItem = $('.results tbody').children('tr');
		let searchSplit = searchText.replace(/ /g, "'):containsi('")

		Search(searchSplit);
	});

	if ($('.results tbody tr[visible="true"]').length == 0){
		$('.no-result').show();
	}
});

let Search = function(searchSplit){
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

		let jobCount = $('.results tbody tr[visible="true"]').length;
		//$('.counter').text(jobCount + ' item');

		if(jobCount == 0){
			$('.no-result').show();
		}else{
			$('.no-result').hide();
		}
}