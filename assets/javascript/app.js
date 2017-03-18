$(document).ready(function() {

var searchQuery= "halo-4"

var settings = {
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

$.ajax(settings).done(function (response) {
  console.log(response);
  console.log(response[0].id);
  settings.url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + response[0].id + "?fields=*"
  console.log(settings.url)

  $.ajax(settings).done(function (response) {
 	console.log(response);
 	var url = "https://images.igdb.com/igdb/image/upload/t_cover_big/" + response[0].cover.cloudinary_id;
 	var backgroundImg = "background-image:url('https://images.igdb.com/igdb/image/upload/t_screenshot_big/" + response[0].screenshots[0].cloudinary_id + ".png')";
	
 	$("body").attr("style", backgroundImg);


 // style="background-image:url(//images.igdb.com/igdb/image/upload/t_screenshot_big/usxccsncekxg0wd1v6ee.jpg);" 
 // b41umzxjcehm8fozl3gf

	$("#thumbnail").attr("src", url);
	$("#panel-left, #panel-top").html($('<p>').text("Title: " +response[0].name));
	$("#panel-top").append($('<p>').text("Rating: " + parseInt(response[0].aggregated_rating)));
	$("#summary").html($('<p>').text("Summary: " + response[0].summary));
	$("#panel-left").append($('<p>').text("Release Date: " + response[0].release_dates[0].human));
	
	$(".game").append($('<p>').text("Story: " + response[0].storyline));
 });	
})
});

