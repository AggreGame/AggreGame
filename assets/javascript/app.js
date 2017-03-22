$(document).ready(function() {

	var timer;
	// Make a game searched variable so that 
	var gameSearched = false;

	var igdbSettings = {
		"async": true,
		"crossDomain": true,
		"url": "",
		"method": "GET",
		"headers": {
			"x-mashape-key": "8c4luXnQFumshyCCQ14GeO6WyMNHp1g3smBjsnYaWNSQ3eZl0a",
			"accept": "application/json",
			"cache-control": "no-cache",
			"postman-token": "d6b0037e-a737-9698-1fdc-16bb905fd022"
		}
	}

    // Add animation functionality
	$.fn.extend({
		animateCss: function (animationName) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			this.addClass('animated ' + animationName).one(animationEnd, function() {
		    	$(this).removeClass('animated ' + animationName);
			});
		}
	});

	$("#search-link-parent").on("click", function() {
		$("#search-bar-wrapper").removeClass("hide");
		$("#search-bar-wrapper").animateCss("bounceInLeft");
		$("#main-content").addClass("hide");
	});

	// not-printing keys pressed
	$("#search").on("keypress", function(event) {
		// If input is blank, clear the ajax call
		if (!this.value) {
			hideSuggestions();
		}
		console.log($("#search").val().trim());
		// Only let user press backspace or numbers
		clearTimeout(timer);
		var searchTerm = $("#search").val().trim();
		if (searchTerm !== '' && event.which === 13) {
			$("#search-bar-wrapper").animateCss("bounceOutRight");
			event.preventDefault();
			populatePageFromNewQuery(searchTerm);
		} else {
			timer = setTimeout(function() {
				$("#search-suggestions").empty();
				$("#search-suggestions").removeClass("hide");
				populateSearchSuggestions(searchTerm);
			}, 500);
		}
    });

	$("#search").on("keyup", function(event) {
		if(!this.value) {
			hideSuggestions();
		}
	});

	// Clear value of search bar when "x" is clicked
	$("#close").on("click", function() {
		var searchTerm = $("#search").val().trim();
		//Animate the bar, but only after a search has been made
		if (!gameSearched && searchTerm === '') {
			$("#search-bar-wrapper").animateCss("shake");
		} else if (!gameSearched && searchTerm !== '') {
			$("#search").val('');
			hideSuggestions();
		} else if (gameSearched && searchTerm !== '') {
			$("#search-bar-wrapper").addClass("hide");
			$("#main-content").removeClass("hide");
		} else {
			$("#search-bar-wrapper").addClass("hide");
			$("#main-content").removeClass("hide");
			$("#search").val('');
			hideSuggestions();
		}
	});

    $("#search-bar-wrapper").on("click", ".collection-item", function() {
		populatePageFromSuggestion($(this));
		gameSearched = true;
    });


    // Populate the page with information upon clicking the search icon
    $(".label-icon").on("click", function(event) {
    	var searchTerm = $("#search").val().trim();
    	//MAX CORRECTION--MAKE BLANK SEARCH INPUT RETURN NOTHING
    	if (searchTerm === '') {
    		$("#search-bar-wrapper").animateCss("jello");
    		return false;
    	};
    	//Animate the search bar
    	$("#search-bar-wrapper").animateCss("bounceOutRight");
    	populatePageFromNewQuery(searchTerm);
    });

	function populateSearchSuggestions(searchTerm) {
		var settings = igdbSettings;
		var rawUrl = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?search=" + searchTerm;
		settings.url = rawUrl.split(' ').join('+')
		
		$.ajax(settings).done(function (response) {
				for (var i = 0; i < 5; i++) {
					settings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + response[i].id + "?fields=*"
					console.log(settings.url)
					$.ajax(settings).done(function (response) {
				 	console.log(response);
				 	var suggestion = $("<li class='collection-item'></li>");
				 	suggestion.text(response[0].name);
				 	suggestion.attr("id", response[0].id);
				 	suggestion.attr("data-summary", response[0].summary);
				 	suggestion.attr("data-user-rating", response[0].rating);
				 	suggestion.attr("data-critic-rating", response[0].aggregated_rating);
				 	suggestion.attr("data-release-date", response[0].release_dates[0].human);
				 	suggestion.attr("data-background-img", "https://images.igdb.com/igdb/image/upload/t_screenshot_big/" + response[0].screenshots[0].cloudinary_id + ".png");
					suggestion.attr("data-thumb", "https://images.igdb.com/igdb/image/upload/t_cover_big/" + response[0].cover.cloudinary_id);
				 	suggestion.attr("data-title", response[0].name);
				 	$("#search-suggestions").append(suggestion);
				 	var url = "https://images.igdb.com/igdb/image/upload/t_cover_big;/" + response[0].cover.cloudinary_id
				});
			}
		});
	};

	// Hides drop down menu from search
	function hideSuggestions () {
		$("#search-suggestions").addClass("hide");
		clearTimeout(timer);
	}

    //MAX CORRECTION---LINK AMAZON WEBSITE WITH GAME TITLE AS KEY WORDS
    function createAmazonLink(gameTitle) {
    	var gameKeyWords = gameTitle.replace(/\s/g, '+');
    	var amazonLink = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords="+ gameKeyWords
    	$("#amazon-link").attr("href", amazonLink);
    };

    function populatePageFromNewQuery(searchTerm) {
        youtubeApiCall(searchTerm);
    	var databaseSettings = igdbSettings;
		databaseSettings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?search=" + searchTerm;
		$.ajax(databaseSettings).done(function (response) {
	  		databaseSettings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + response[0].id + "?fields=*";
		  	$.ajax(databaseSettings).done(function (response) {
			 	console.log(response);
			 	var url = "https://images.igdb.com/igdb/image/upload/t_cover_big/" + response[0].cover.cloudinary_id;
			 	var backgroundImg = "background-image:url('https://images.igdb.com/igdb/image/upload/t_screenshot_big/" + response[0].screenshots[0].cloudinary_id + ".png')";

			 	$("#page-bg").attr("style", backgroundImg);
				$("#thumbnail").attr("src", url);
				$("#game-title").html("<strong>" + response[0].name + "</strong>");
				$("#game-rating-user").text("User Rating: " + parseInt(response[0].rating));
				$("#game-rating-critic").text("Critic Rating: " + parseInt(response[0].aggregated_rating));
				$("#summary").text(response[0].summary);
				$("#release-date").text("Release Date: " + response[0].release_dates[0].human);
				//MAX CORRECTION
				createAmazonLink(response[0].name);
			});
		});
		prepPageForContentViewing();
    };

    function populatePageFromSuggestion(htmlSuggestion) {
        youtubeApiCall(htmlSuggestion.attr("data-title"));
	 	var url = htmlSuggestion.attr("data-thumb");
	 	var backgroundImg = "background-image:url(" + htmlSuggestion.attr("data-background-img") + ");"

	 	$("#page-bg").attr("style", backgroundImg);
		$("#thumbnail").attr("src", url);
		$("#game-title").html("<strong>" + htmlSuggestion.attr("data-title") + "</strong>");
		$("#game-rating-user").text("User Rating: " + parseInt(htmlSuggestion.attr("data-user-rating")));
		$("#game-rating-critic").text("Critic Rating: " + parseInt(htmlSuggestion.attr("data-critic-rating")));
		$("#summary").text(htmlSuggestion.attr("data-summary"));
		$("#release-date").text("Release Date: " + htmlSuggestion.attr("data-release-date"));
		//MAX CORRECTION
		createAmazonLink(htmlSuggestion.attr("data-title"));
		prepPageForContentViewing();
    };

    function prepPageForContentViewing() {
    	$("#search-bar-wrapper").animateCss("bounceOutRight");
    	setTimeout(function() {
    		$("#main-content").animateCss("bounceInUp");
			$("#search-bar-wrapper").attr("class", "hide");
			$("#main-content").removeClass("hide");
			$("#video-content").removeClass("hide");
    	}, 500);
		//MAX CORRECTION--CHANGED GAME SEARCHED TO TRUE WHEN POPULATING PAGE 
		//INSTEAD OF ON CLICK FROM SEARCH ICON (FIXES BUG)
		gameSearched = true;
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
	    var twitchVid = response.streams[0].preview.large;
	    console.log(twitchVid);
	    var twitch = $("<iframe>");
	    twitch.attr("src", twitchVid);
	    $("#twitch-content").append(twitch);
	 });
	function youtubeApiCall(term){
		 $.ajax({
			 cache: false,
			 data: $.extend({
				 key: 'AIzaSyDRap3f9X_Bae5wKGY1nmd8wklgFoqxc7A',
				 q: term + " game reviews",
				 part: 'snippet'
			 }, {maxResults:20,pageToken:$("#pageToken").val()}),
			 dataType: 'json',
			 type: 'GET',
			 timeout: 5000,
			 url: 'https://www.googleapis.com/youtube/v3/search' 
		 })
		.done(function(response) {
			console.log(response);
			console.log("YOUTUBE API")
			for (var i = 0; i < 1; i++){
				iframe = $("<iframe>")
				var youtubeVid = response.items[i].id.videoId;	
				console.log(youtubeVid);
				var youtubeUrl = "https://www.youtube.com/embed/" + youtubeVid
				iframe.attr("src", youtubeUrl);
				$("#youtube-content").html(iframe);
			}
		});
	};

// DO NOT CODE BELOW THIS LINE: END OF FILE
// ======================================================================
});