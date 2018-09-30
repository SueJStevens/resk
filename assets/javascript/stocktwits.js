




// start of the ajax

// This is the URL for the StockTwits API
var queryURL = "https://api.stocktwits.com/api/2/streams/symbol/AAPL.json";

/**
 * Summary.
 *  This function displays the top 5 tweets for the stock 
 * */
function displayStockTweets(data){

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

  displayStockTweets(data);

}); 


// this the animation that controlls the carousel
$('.carousel').carousel()


//end ajax call

// create all the html here and then 
// use activity 4 student sign in so it help me 






/*
.then(function(response) {
          console.log(queryURL);

          console.log(response);
          // storing the data from the AJAX request in the results variable
          var results = response.data;

          // Looping through each result item
          for (var i = 0; i < results.length; i++) {

            // Creating and storing a div tag
            var animalDiv = $("<div>");

            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").text("Rating: " + results[i].rating);

            // Creating and storing an image tag
            var animalImage = $("<img>");
            // Setting the src attribute of the image to a property pulled off the result item
            animalImage.attr("src", results[i].images.fixed_height.url);

            // Appending the paragraph and image tag to the animalDiv
            animalDiv.append(p);
            animalDiv.append(animalImage);

            // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
            $("#gifs-appear-here").prepend(animalDiv);
          }
        });
*/




























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
