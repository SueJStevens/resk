/**
 * Summary:
 *  This file contains the main logic for 
 *     1. User input (search for stock info based on company name/ticker symbol)
 *     2. Use IEX API to fetch the desired information
 *     3. Store recent company searches in FireBase. 
 *        These will be pre-loaded as 'recent/trending' the next time.
 */


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


  // Get company info for all companies listed on IEX (Name, Ticker symbol)
  getCompanyNames();


/**
 * Summary:
 *  This function looks up the company entered by the user.
 *  Returns ticker symbol if present in the list, empty 
 *  string otherwise.
 * 
 * The logic for this function is TBD.
 */
function lookupCompany(companyName){
  var tickerSymbol = '';
  if(!companyName)
  {
    return "";
  }
 
  /* Logic to look up company name in the big list */
  /* THIS IS TBD */

  return tickerSymbol;
}

/**
 * Summary:
 *  Callback function that runs when the AJAX
 *  call to IEX returns a successful response.
 * 
 * The response should contain the stock quote
 * information about the company.
 * 
 * @param {object} response : Object returned by IEX
 */
function displayStockInfo(response){
  console.log("Here is the stock quote information -");
  console.log(response.quote);

  var quote = response.quote;

  // Create a ne row with the stock info and add to our table
  var newRow = $("<tr>");

  // First column - company symbol (ticker)
  newRow.append("<td>"+quote.symbol+"</td>");

  // Second column - company name
  newRow.append("<td>"+quote.companyName+"</td>");
  
  // Third column - current price
  newRow.append("<td>"+quote.latestPrice+"</td>");

  // Fourth column - previous closing price
  newRow.append("<td>"+quote.previousClose+"</td>");

  // Fifth and sixth columns - gain and gain percentage

  if(quote.change >= 0){
    positiveOrNegative = "+";

  }else{
    positiveOrNegative = "";
  }
    
  newRow.append("<td>"+ positiveOrNegative + quote.change +"</td>");
  newRow.append("<td>"+ positiveOrNegative + quote.changePercent +"%"+"</td>");

  $("#company-output tbody").append(newRow);

}

/**
 * Summary:
 *  Get Stock information on the specified company
 * 
 * @param {string} companyName
 */
function getStockInfo(companyName){

  /*  Construct the AJAX query for IEX.
   *  It is a batch query to IEX, where type = "quote"
   */
  var queryURL = "https://api.iextrading.com/1.0/stock/" + companyName + "/batch?types=quote";
  $.ajax({
    url: queryURL,
    method: "GET",
    //async: false,
    timeout: 30000, // timeout of 30 seconds
    success: displayStockInfo,
    error: function(){
      console.log("Error in query response for Company Info");
      queryFailed = true;
    }
  });
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
    var tickerSymbol = "";

    console.log('You pressed a "enter" key in textbox');
    event.preventDefault();
    companyName = $('#company-name-input').val().trim().toLowerCase();
    console.log("The company name is "+companyName);

    if(companyName == ""){
      console.log("Please enter a company name");
      return;
    }

    /* Still TBD: not sure if this will be necessary with auto-complete
    tickerSymbol = lookupCompany(companyName);
    if(!tickerSymbol){
      console.log(companyName + " not found");
      return;
    }*/

    // Valid company - construct API call to look up stock price and 
    // other info
    console.log("Looking up stock info on "+companyName);

    getStockInfo(companyName);
  }
  
});


}); //end on ready function