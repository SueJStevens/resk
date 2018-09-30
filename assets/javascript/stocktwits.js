// This is the URL for the StockTwits API
var queryURL = "https://api.stocktwits.com/api/2/streams/symbol/AAPL.json";

/**
 * Summary.
 *  This function displays the top 5 tweets for the stock 
 * */
function getStockTwits(companyName){
  var queryURL = "https://api.stocktwits.com/api/2/streams/symbol/"+companyName.toUpperCase()+".json";

  console.log("Querying stocktwits with the following URL");
  console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET",
    crossDomain:true
  }).then(function (response) {
    var data = response;
    console.log(data);
    // So I have to body so I could display it on the card
  
    console.log("Here is the first tweet");
    console.log(data.messages[0].body);
  
    displayStockTwits(data);
  
  }); 
  
}

/**
 * Summary.
 *  This function displays the top 5 tweets for the stock 
 * */
function displayStockTwits(data){

  // Step 1: Figure out how many tweets are present in  data
  var numTweets = data.messages.length;

  var tweet = "";

  console.log("There are "+numTweets+" tweets in the response object");

  if(numTweets > 5){
    numTweets = 5;
  }

  for(var i = 0; i < numTweets; i++){
    tweet = $("<p>").text(data.messages[i].body);
    $("#tweets-div").append(tweet);
  }
}
/**
 * this the for loop to help me get all the tweets from its array
 * 
 * var myStringArray = ["Hello","World"];
var arrayLength = myStringArray.length;
for (var i = 0; i < arrayLength; i++) {
    alert(myStringArray[i]);
    //Do something
}
 */

// this the animation that controlls the carousel
$(document).on("ready", function(){
  $('#carouselExampleIndicators').carousel();
});





























/*     
 <div class=col-3>
        <div class="card mt-5">

          <!-- Card Header -->
          <div class="card-header">Stocktwits Says: Sun Gone</div>

          <!-- Card Block -->
          <div class="card-body">
            <p class="card-text">Expert opinions are divided. Here's what they say will happen next.</p>
          </div>

          <!-- List Group -->
          <ul class="list-group list-group-flush">
            <li class="list-group-item">The Sun will come back</li>
            <li class="list-group-item">The Sun won't come back</li>
            <li class="list-group-item">It will have babies and spawn thousands more suns</li>
            <li class="list-group-item">Good night!</li>
          </ul>
        </div>
        <!--End Card Container-->

      </div>
      <!--End Split Screen-->
    </div>

  </div>
*/
