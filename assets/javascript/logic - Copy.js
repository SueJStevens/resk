/**
 * Summary:
 *  This file contains the main logic for 
 *     1. User input (search for stock info based on company name/ticker symbol)
 *     2. Use IEX API to fetch stock information about the company, and the Stocktwits API
 *        to fetch trending tweets a bout the company.
 *     3. Store recent company searches in FireBase. 
 *        These will be pre-loaded as 'recent/trending' the next time.
 */

$(function () {

  //set variables to toggle datatables search boxes
    var dtsearching = false; 
    var dtpaging = false;
    var dtinfo = false;
    var searchedCompaniesList = [];
  

  //temporarily set some companies into the array
  //searchedCompaniesList = 

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

  //if/else for positiveOrNegative symbol output
  if(quote.change >= 0){
    positiveOrNegative = "+";

  }else{
    positiveOrNegative = "";
  }
    

  var companyOutput = $('table').dataTable();
  //company output DataTable for all variables is here
  /*
  var companyOutput = $('table').dataTable({
    searching: false, 
    paging: false, 
    info: false});
    */


  companyOutput.row.add([
    quote.symbol,
    quote.companyName,
    quote.latestPrice,
    quote.previousClose,
    positiveOrNegative + quote.change,
    positiveOrNegative + quote.changePercent
  ]).draw();

  $("#clear-output-button").on("click", function() {   
    companyOutput.clear().draw();
  });


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
$('#add-company-button').on("click", function(event){
  event.preventDefault();
    companyName = $('#company-name-input').val().trim().toLowerCase();
    console.log("The company name is "+companyName);

    // Check for blank input
    if(companyName == ""){
      console.log("Please enter a company name");
      return;
    }

    //split the string into two parts:  The stock ticker symbol and the company name
    var tickerFromInput = companyName.substr(0, companyName.indexOf('-') - 1);
    var companyFromInput = companyName.substr(companyName.indexOf("-") + 1);
    console.log("SUE's Ticker: "+tickerFromInput);
    console.log("SUE's Co: "+companyFromInput);
    companyName = tickerFromInput;

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

    // Also get stock tweets about this company
    console.log("Getting stock twits on "+ companyName);
    getStockTwits(companyName);
    $('#company-name-input').val("");
});

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

    //split the string into two parts:  The stock ticker symbol and the company name
    var tickerFromInput = companyName.substr(0, companyName.indexOf('-') - 1);
    var companyFromInput = companyName.substr(companyName.indexOf("-") + 1);
    console.log("SUE's Ticker: "+tickerFromInput);
    console.log("SUE's Co: "+companyFromInput);
    companyName = tickerFromInput;

    /* Still TBD: not sure if this will be necessary with auto-complete
    tickerSymbol = lookupCompany(companyName);
    if(!tickerSymbol){
      console.log(companyName + " not found");
      return;
    }*/

    // Valid company - construct API call to look up stock price and 
    // other info
    console.log("Looking up stock info on "+companyName);

    // Get stock information about this company
    getStockInfo(companyName);

    // Also get stock tweets about this company
    console.log("Getting stock twits on "+ companyName);
    getStockTwits(companyName);

    $('#company-name-input').val("");

  }
  
});


}); //end on ready function