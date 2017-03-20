$(document).ready(function() {
	var timer;
	
	function searchIgdb(searchTerm) {
		var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?search=" + searchTerm,
		  "method": "GET",
		  "headers": {
		    "x-mashape-key": "8c4luXnQFumshyCCQ14GeO6WyMNHp1g3smBjsnYaWNSQ3eZl0a",
		    "accept": "application/json",
		    "cache-control": "no-cache",
		    "postman-token": "d6b0037e-a737-9698-1fdc-16bb905fd022"
		  }
		}

		$.ajax(settings).done(function (response) {
		  for (var i = 0; i < 5; i++) {
	  		settings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + response[i].id + "?fields=*"
		  	console.log(settings.url)
		  	$.ajax(settings).done(function (response) {
			 	console.log(response);
			 	var suggestion = $("<li class='collection-item'></li>");
			 	suggestion.text(response[0].name);
			 	suggestion.attr("id", response[0].id);
			 	$("#search-suggestions").append(suggestion);
			 	var url = "https://images.igdb.com/igdb/image/upload/t_cover_big;/" + response[0].cover.cloudinary_id
			 });
		  }

		});
	}

	$("#search").on("keydown", function(event) {
		// Only let user press backspace or numbers
		clearTimeout(timer);
		var searchTerm = $("#search").val();
		timer = setTimeout(function() {
			$("#search-suggestions").empty();
			searchIgdb(searchTerm);
		}, 500);
    });

    $("#search-bar-wrapper").on("click", ".collection-item", function() {
    	console.log($(this).attr("id"));
    });
});