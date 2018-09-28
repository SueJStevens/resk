$(function () {

  //11 broad GICS sectors
  arrSectors=[
  "Energy", //353 companies
  "Materials", //308 companies
  "Industrials", //802 companies
  "Consumer Discretionary", //615 companies
  "Consumer Staples", //226 companies
  "Health Care", //881
  "Financials", //1626
  "Technology", //760
  "Communication Services", //106
  "Utilities", //150
  "Real Estate" //477
    ];
  

  //encode URL to accomodate spaces in the sectors
  //var queryURL = encodeURI("https://api.iextrading.com/1.0/stock/market/collection/sector?collectionName="+arrSectors[8]);
  //Sector Performance
  //var queryURL = encodeURI("https://api.iextrading.com/1.0/stock/market/sector-performance");
  //News
  //var queryURL = encodeURI("https://api.iextrading.com/1.0/stock/market/news/last/10");
    //logo
  var queryURL = encodeURI("https://api.iextrading.com/1.0/stock/qcom/logo");
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var data = response;
    console.log(data);
  }); //end ajax call

/**
 * Summary:
 *  This function looks up the company entered by the user.
 *  Returns true if valid company, false otherwise
 * 
 * The logic for this function is TBD.
 */
function lookupCompany(companyName){
  if(companyName)
  {
    return true;
  }
  return false;
}

/**
 * Summary:
 *  Get Stock information on the specified company
 * 
 * @param {string} companyName
 */
function getStockInfo(companyName){
  var currentPrice = null;
  var previousClosingInfo = null;
  var companyInfo = null;
  var queryFailed = false;

  /* Construct three AJAX queries to IEX
     1. First query is for the current price. If market is closed, 
        this will equal previous closing price.
     2. Second query is for the previous closing data (closing price, closing gain/loss etc)
     3. Third query is for company name

     THERE IS POTENTIAL FOR OPTIMIZATION HERE. NEED TO FIND A WAY TO GET ALL THE INFO IN
     A SINGLE AJAX CALL
  */
 
  // First query fetches the current stock price
  var queryURL = "https://api.iextrading.com/1.0/stock/" + companyName + "/price";
  $.ajax({
    url: queryURL,
    method: "GET",
    async: false,
    timeout: 30000, // timeout of 30 seconds
    success: function(response){
      console.log("Here is the stock PRICE information -");
      currentPrice = Number.parseFloat(response);
      console.log(currentPrice);
    },
    error: function(){
      console.log("Error in query response for Company Info");
      queryFailed = true;
    }
  });


  // Second query fetches the previous closing info for the company (Based on its ticker symbol)
  queryURL = "https://api.iextrading.com/1.0/stock/" + companyName + "/previous";
  $.ajax({
    url: queryURL,
    method: "GET",
    async: false,
    timeout: 30000, // timeout of 30 seconds
    success: function(response){
      //console.log("Here is the stock information -");
      previousClosingInfo = response;

      // Conver the closing price into a floating point number
      previousClosingInfo.close = Number.parseFloat(previousClosingInfo.close);
    },
    error: function(){
      console.log("Error in query response for Company Info");
      queryFailed = true;
    }
  });

  // Third query fetches information about the company (we're mainly interested in
  // the company name)
  queryURL = "https://api.iextrading.com/1.0/stock/" + companyName + "/company";
  $.ajax({
    url: queryURL,
    method: "GET",
    async: false,
    timeout: 30000, // timeout of 30 seconds
    success: function(response){
      companyInfo = response;
      //console.log("Here is the company info");
      //console.log(companyInfo);
    },
    error: function(){
      console.log("Error in query response for Company Info");
      queryFailed = true;
    }
  });

  if(queryFailed){
     console.log("Query for ticker "+companyName+" failed!!");
     return;
  }

  // Create a ne row with the stock info and add to our table
  var newRow = $("<tr>");

  // First column - company symbol (ticker)
  newRow.append("<td>"+previousClosingInfo.symbol+"</td>");

  // Second column - company name
  newRow.append("<td>"+companyInfo.companyName+"</td>");
  
  // Third column - current price
  newRow.append("<td>"+currentPrice+"</td>");

  // Fourth column - previous closing price
  newRow.append("<td>"+previousClosingInfo.close+"</td>");

  // Fifth and sixth columns - gain and gain percentage
  // This part requires some additional logic. 
  // 1. If current price EQUALS previous closing price, we can use 
  //    gain and gain percentage from the previous closing info
  // 2. If current price DOES NOT EQUAL closing price, we have to
  //    compute the gain and gain percentage.

  if(currentPrice === previousClosingInfo.close){
    //Current price equals previous closing price. This means either the
    // market is closed OR market is open and current price is equal to 
    // previous closing price. In any case, we can use either value
    newRow.append("<td>"+previousClosingInfo.change+"</td>");
    newRow.append("<td>"+previousClosingInfo.changePercent+"</td>");s
  }else{
    // Calculate the gain (or loss, which would be negative gain)
    // Limit to two digits beyond decimal point
    var gain = currentPrice - previousClosingInfo.close;
    gain = gain.toFixed(2);

    var gainPercentage = (gain/previousClosingInfo.close) * 100;
    gainPercentage = gainPercentage.toFixed(2);

    var positiveOrNegative;

    if(gain >= 0){
      positiveOrNegative = "+";
    }else{
      positiveOrNegative = "-";
    }
    
    newRow.append("<td>"+ positiveOrNegative + gain +"</td>");
    newRow.append("<td>"+ positiveOrNegative + gainPercentage +"%"+"</td>");
  }


  $("#company-output tbody").append(newRow);
}

/**
 * Summary: 
 *  Click Handler for the 'submit' button.
 *
 * Description.
 *  If the user typed in a company name, it fetches stock info
 *  for that company.
 *  If the user specified a sector, it fetches stock info about
 *  companies in that sector.
 */
$('#company-name-input').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  var companyName = "";
  
  
  if(keycode !== 13){
    console.log('You pressed' + event.keyCode + ' key in textbox');
  }
  else{
    var isValidCompany = false;

    console.log('You pressed a "enter" key in textbox');
    event.preventDefault();
    companyName = $('#company-name-input').val().trim().toLowerCase();
    console.log("The company name is "+companyName);

    if(companyName == ""){
      console.log("Please enter a company name");
      return;
    }

    isValidCompany = lookupCompany(companyName);
    if(false === isValidCompany){
      console.log(companyNAme + " not found");
      return;
    }

    // Valid company - construct API call to look up stock price and 
    // other info
    console.log("Looking up stock info on "+companyName);

    getStockInfo(companyName);
  }
  
});


}); //end on ready function