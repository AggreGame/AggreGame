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

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyB7VSJ2zogjc0aH6rH-ze2qDW_Riv8BQr4",
		authDomain: "aggre-game.firebaseapp.com",
		databaseURL: "https://aggre-game.firebaseio.com",
		storageBucket: "aggre-game.appspot.com",
		messagingSenderId: "362750331357"
	};
	firebase.initializeApp(config);
	var database = firebase.database();

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

    $("#search-suggestions").on("click", ".suggestion", function() {
		populatePageFromSuggestion($(this));
		gameSearched = true;
    });

    $("#search-suggestions").on("click", ".popular", function() {
    	$("#search-suggestions").empty();
		populatePageFromNewQuery($(this).text());
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

    //MAX CORRECTION---LINK AMAZON WEBSITE WITH GAME TITLE AS KEY WORDS
    function createAmazonLink(gameTitle) {
    	var gameKeyWords = gameTitle.replace(/\s/g, '+');
    	var amazonLink = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords="+ gameKeyWords
    	$("#amazon-link").attr("href", amazonLink);
    };

    function start() {
    	$("#search-suggestions").append($("<li class='collection-item'>" + 
    							"<strong>Most Popular</strong></li>"));
    	var topFiveSearches = database.ref("popular").orderByChild("count").limitToLast(5);
    	topFiveSearches.once("value").then(function(snapshot) {
    		snapshot.forEach(function(entry) {
    			$("#search-suggestions").append($("<li class='collection-item popular'>" + 
    												entry.key + "</li>"));
    		});
    	});
    };

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
				 	var suggestion = $("<li class='collection-item suggestion'></li>");
				 	suggestion.text(getGameName(response));
				 	suggestion.attr("id", response[0].id);
				 	suggestion.attr("data-summary", getSummary(response));
				 	suggestion.attr("data-user-rating", getUserRating(response));
				 	suggestion.attr("data-critic-rating", getCriticRating(response));
				 	suggestion.attr("data-release-date", getReleaseDate(response));
				 	suggestion.attr("data-background-img", getBackgroundImage(response));
					suggestion.attr("data-thumb", getThumb(response));
				 	suggestion.attr("data-title", response[0].name);
				 	$("#search-suggestions").append(suggestion);
				 	var url = "https://images.igdb.com/igdb/image/upload/t_cover_big;/" + response[0].cover.cloudinary_id
				});
			}
		});
	};

	function getGameName(response) {
		if (response[0].name) {
			return response[0].name;
		}
		return "";
	}

	function getSummary(response) {
		if (response[0].summary) {
			return response[0].summary;
		}
		return "No summary found";
	}

	function getUserRating(response) {
		if (response[0].rating) {
			return parseInt(response[0].rating) + "";
		}
		return "Unknown";
	}

	function getCriticRating(response) {
		if (response[0].aggregated_rating) {
			return parseInt(response[0].aggregated_rating) + "";
		}
		return "Unknown";
	}

	function getReleaseDate(response) {
		if (response[0].release_dates && 
			response[0].release_dates[0] && 
			response[0].release_dates[0].human) {
			return response[0].release_dates[0].human;
		}
		return "Unknown";
	}

	function getBackgroundImage(response) {
		if (response[0].screenshots && 
			response[0].screenshots[0] && 
			response[0].screenshots[0].cloudinary_id) {
			return "https://images.igdb.com/igdb/image/upload/t_screenshot_big/" + 
					response[0].screenshots[0].cloudinary_id + ".png";
		}
		return "";
	}

	function getThumb(response) {
		if (response[0].cover &&
			response[0].cover.cloudinary_id) {
			return "https://images.igdb.com/igdb/image/upload/t_cover_big/" + 
					response[0].cover.cloudinary_id;
		}
		return "";
	}

	// Hides drop down menu from search
	function hideSuggestions () {
		$("#search-suggestions").addClass("hide");
		clearTimeout(timer);
	}

    function populatePageFromNewQuery(searchTerm) {
        youtubeApiCall(searchTerm);
        twitchApiCall(searchTerm);
    	var databaseSettings = igdbSettings;
		databaseSettings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?search=" + searchTerm;
		$.ajax(databaseSettings).done(function (response) {
	  		databaseSettings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + response[0].id + "?fields=*";
		  	$.ajax(databaseSettings).done(function (response) {
			 	console.log(response);
			 	$("#page-bg").attr("style", getBackgroundImage(response));
				$("#thumbnail").attr("src", getThumb(response));
				$("#game-title").html("<strong>" + getGameName(response) + "</strong>");
				$("#game-rating-user").text("User Rating: " + getUserRating(response));
				$("#game-rating-critic").text("Critic Rating: " + getCriticRating(response));
				$("#summary").text(getSummary(response));
				$("#release-date").text("Release Date: " + getReleaseDate(response));
				updateMostPopular(getGameName(response));
				createAmazonLink(response[0].name);
			});
		});
		prepPageForContentViewing();
    };

    function populatePageFromSuggestion(htmlSuggestion) {
        youtubeApiCall(htmlSuggestion.attr("data-title"));
        twitchApiCall(htmlSuggestion.attr("data-title"));
	 	var url = htmlSuggestion.attr("data-thumb");
	 	var backgroundImg = "background-image:url(" + htmlSuggestion.attr("data-background-img") + ");"

	 	$("#page-bg").attr("style", backgroundImg);
		$("#thumbnail").attr("src", url);
		$("#game-title").html("<strong>" + htmlSuggestion.attr("data-title") + "</strong>");
		$("#game-rating-user").text("User Rating: " + htmlSuggestion.attr("data-user-rating"));
		$("#game-rating-critic").text("Critic Rating: " + htmlSuggestion.attr("data-critic-rating"));
		$("#summary").text(htmlSuggestion.attr("data-summary"));
		$("#release-date").text("Release Date: " + htmlSuggestion.attr("data-release-date"));
		prepPageForContentViewing();
		updateMostPopular(htmlSuggestion.attr("data-title"));
		createAmazonLink(htmlSuggestion.attr("data-title"));
    };

    function prepPageForContentViewing() {
    	gameSearched = true;
    	$("#search-bar-wrapper").animateCss("bounceOutRight");
    	setTimeout(function() {
    		$("#main-content").animateCss("bounceInUp");
			$("#search-bar-wrapper").attr("class", "hide");
			$("#main-content").removeClass("hide");
			$("#video-content").removeClass("hide");
    	}, 500);
    };

    function updateMostPopular(term) {
    	database.ref("popular/" + term).transaction(function(searchTerm) {
    		if (!searchTerm) {
    			return {count: 1};
			}
    		return {count: searchTerm.count += 1};
    	});
    };
	

  // twitch API
  // ======================================================================
  	function twitchApiCall(searchQuery) {
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
		    // MAX CORRECTION
		    var twitchChannel = response.streams[0].channel.display_name
		    console.log("TWITCH CHANNEL: " + twitchChannel);
			var options = {
				width: 800,
				height: 500,
				channel: twitchChannel,
			};
			var player = new Twitch.Player("{twitch-player}", options);
			player.setVolume(0.5);
			player.addEventListener(Twitch.Player.PAUSE, () => { console.log('Player is paused!'); });
		});
	};

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
			var card = $("<div>");
			card.addClass("card large");
			var iframe = $("<iframe>");
			$(card).append(iframe);
			var youtubeVid = response.items[0].id.videoId;	
			console.log(youtubeVid);
			var youtubeUrl = "https://www.youtube.com/embed/" + youtubeVid;
			iframe.attr("src", youtubeUrl);
			$("#youtube-content").append(iframe);
		});
	};

	start();

// DO NOT CODE BELOW THIS LINE: END OF FILE
// ======================================================================
});
// Make it so youtube videos only load when clicked then work on the carrousel 