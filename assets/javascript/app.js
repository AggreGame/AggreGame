$(document).ready(function() {

	var searchQuery= "arkham-knight"
	var iframe = $("<iframe>")
	// IGDB API
	// ======================================================================
	var databaseSettings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?search=" + searchQuery,
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
	  console.log(response[0].id);
	  databaseSettings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + response[0].id + "?fields=*"


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
	})

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

// DO NOT CODE BELOW THIS LINE: END OF FILE
// ======================================================================
});
