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
	};

	// Take a search value and populate the page with the first result returned
	// COULD BE ALTERED TO BE A LIST (AS OPPOSED TO FIRST SEARCH TERM)
	function populateWithIGDB_ID(searchTerm) {
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
			settings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + response[0].id + "?fields=*"
		  	$.ajax(settings).done(function (response) {
		  		var responseId = response[0].id;
		  		populatePage(responseId);
		  	});
		});
	}

	// Hides drop down menu from search
	function hideSuggestions () {
		$("#search-suggestions").addClass("hide");
		clearTimeout(timer);
	}

	// If the input field is blank, stop making ajax calls and hide 
	// previous search results
	$("#search").on("keyup", function(event) {
		if(!this.value) {
			hideSuggestions();
		}
	});

	// Clear value of search bar when "x" is clicked
	// IMPORTANT!! NEED TO ADD CLOSE OUT FUNCTIONALITY
	$("#close").on("click", function() {
		$("#search").val('');
		hideSuggestions();
	});

	// Changed value to "keypress" from "keydown" to avoid automatic searches when 
	// not-printing keys pressed
	$("#search").on("keypress", function(event) {
		// If input is blank, clear the ajax call
		if (!this.value) {
			hideSuggestions();
		}
		console.log($("#search").val().trim());
		// Only let user press backspace or numbers
		clearTimeout(timer);
		var searchTerm = $("#search").val();
		timer = setTimeout(function() {
			$("#search-suggestions").empty();
			$("#search-suggestions").removeClass("hide");
			searchIgdb(searchTerm);
		}, 500);
    });

    // Populate the page with information upon clicking the search icon
    $(".label-icon").on("click", function(event) {
    	var searchTerm = $("#search").val().trim();
    	//Animate the search bar
    	$("#search-bar-wrapper").animateCss("bounceOutRight");
    	populateWithIGDB_ID(searchTerm);
    });

    // Add animation functionality
	$.fn.extend({
		animateCss: function (animationName) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			this.addClass('animated ' + animationName).one(animationEnd, function() {
		    	$(this).removeClass('animated ' + animationName);
			});
		}
	});

	// Populate the page with information upon pressing the enter key
	$("#search").on("keypress", function(event) {
		var searchTerm = $("#search").val().trim();
		if (searchTerm !== '' && event.which === 13) {
			event.preventDefault();
			$(".label-icon").click();
		};
	});

    $("#search-bar-wrapper").on("click", ".collection-item", function() {
    	populatePage($(this).attr("id"));
    });

    function populatePage(elementId) {
    	var databaseSettings = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + elementId + "?fields=*",
		  "method": "GET",
		  "headers": {
		    "x-mashape-key": "8c4luXnQFumshyCCQ14GeO6WyMNHp1g3smBjsnYaWNSQ3eZl0a",
		    "accept": "application/json",
		    "cache-control": "no-cache",
		    "postman-token": "d6b0037e-a737-9698-1fdc-16bb905fd022"
		  }
		}

		$.ajax(databaseSettings).done(function (response) {
		 	console.log(response);
		 	var url = "https://images.igdb.com/igdb/image/upload/t_cover_big/" + response[0].cover.cloudinary_id;
		 	var backgroundImg = "background-image:url('https://images.igdb.com/igdb/image/upload/t_screenshot_big/" + response[0].screenshots[0].cloudinary_id + ".png')";

		 	$("body").attr("style", backgroundImg);
			$("#thumbnail").attr("src", url);
			$("#game-title").html("<strong>" + response[0].name + "</strong>");
			$("#game-rating-user").text("User Rating: " + parseInt(response[0].rating));
			$("#game-rating-critic").text("Critic Rating: " + parseInt(response[0].aggregated_rating));
			$("#summary").text(response[0].summary);
			$("#release-date").text("Release Date: " + response[0].release_dates[0].human);
		});
		$("#search-bar-wrapper").attr("class", "hide");
		$("#main-content").removeClass("hide");
		$("#video-content").removeClass("hide");
    };

	var searchQuery= "arkham-knight"
	var iframe = $("<iframe>")
	// IGDB API
	// ======================================================================
	

	// twitch API
	// ======================================================================
	var twitchSettings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://api.twitch.tv/kraken/search/streams?query=" + searchQuery,
	  "method": "GET",
	  "headers": {
	    "client-id": "w5185xydst8a2ijuvc2lwnvdpoqznk",
	    "accept": "application/vnd.twitchtv.v4+json",
	  }
	}

	$.ajax(twitchSettings).done(function (response) {
	  console.log(response);
	  // console.log(response.streams[0].channel._id);

	  var twitchSettings2 = {
	    "async": true,
	    "crossDomain": true,
	    "url": "https://api.twitch.tv/kraken/streams/" + response.streams[1].channel._id,
	    "method": "GET",
	    "headers": {
	      "client-id": "w5185xydst8a2ijuvc2lwnvdpoqznk",
	      "accept": "application/vnd.twitchtv.v4+json",
	    }
	  }

	  $.ajax(twitchSettings2).done(function (response) {
	    console.log(response);
	    var twitchVid = response._links.channel;
	    console.log(twitchVid);
	    var twitch = $("<iframe>");
	    //Alan I made an Ifram variable at the top of the page, take a look! It is globally scoped
	    // twitch.attr("src", twitchVid);
	    // $("#twitch-content").append(twitch);
	  });

	});

	// youtube API
	// ======================================================================
	function youtubeApiCall(){
		 $.ajax({
			 cache: false,
			 data: $.extend({
				 key: 'AIzaSyDRap3f9X_Bae5wKGY1nmd8wklgFoqxc7A',
				 q: searchQuery + "reviews",
				 part: 'snippet'
			 }, {maxResults:20,pageToken:$("#pageToken").val()}),
			 dataType: 'json',
			 type: 'GET',
			 timeout: 5000,
			 url: 'https://www.googleapis.com/youtube/v3/search'
		 })
		.done(function(response) {
			console.log(response);

			for (var i = 1; i < 4; i++){
				iframe = $("<iframe>")
				var youtubeVid = response.items[i].id.videoId;
				console.log(youtubeVid);
				var youtubeUrl = "https://www.youtube.com/embed/" + youtubeVid
				iframe.attr("src", youtubeUrl);
				$("#youtube-content").append(iframe);
			}
		});
	}
	youtubeApiCall();
});