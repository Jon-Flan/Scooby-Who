// function for burgerbar menu animation

$(document).ready(function() {
	const change = document.getElementsByClassName("burger")
	
	  $('input[type=checkbox][name=checkbox]').change(function() {
		if ($(this).is(':checked')) {
		  for(let i = 0; i < change.length; i += 1) {
			change.item(i).classList.toggle("change");
		}
		}
		else {
		  for(let i = 0; i < change.length; i += 1) {
			change.item(i).classList.toggle("change");
		}
		}
	  });
	});

