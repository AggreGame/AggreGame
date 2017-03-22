$(document).ready(function() {

var searchQuery= "horizon-zero-dawn"

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
  // console.log(response);
  // console.log(response[0].id);
  databaseSettings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + response[0].id + "?fields=*"
  // console.log(databaseSettings.url)

  $.ajax(databaseSettings).done(function (response) {
 // 	console.log(response);
 	var url = "https://images.igdb.com/igdb/image/upload/t_cover_big/" + response[0].cover.cloudinary_id;



    $("#thumbnail").attr("src", url);
    $("#game-title").html("<strong>" + response[0].name + "</strong>");
    $("#game-rating-critic").text("Critic Rating: " + parseInt(response[0].aggregated_rating));
    $("#summary").text(response[0].summary);
    $("#release-date").text("Release Date: " + response[0].release_dates[0].human);

    $(".game").append($('<p>').text("Story: " + response[0].storyline));

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

  var twitch = $("<img>");
  twitch.attr("src", response.streams[0].preview.large);
  $("#twitch-content").append(twitch);
});


// DO NOT CODE BELOW THIS LINE: END OF FILE
// ======================================================================
});
