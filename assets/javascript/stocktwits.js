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
    console.log(data.symbol.title);
  
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
  
  var nameCompany = data.symbol.title;


  console.log("There are "+numTweets+" tweets in the response object");
  console.log(" This the company " + nameCompany + " that you entered ");

  if(numTweets > 8){
    numTweets = 8;
  }

  for(var i = 0; i < numTweets; i++){
    var list = document.getElementById("tweets-msg-"+i);
      while (list.hasChildNodes()) {   
          list.removeChild(list.firstChild);
      }
    $("#tweets-header-"+i).text(data.symbol.title);
    tweet = $("<p>").text(data.messages[i].body);
    $("#tweets-msg-"+i).append(tweet);
  }

  
}
  











