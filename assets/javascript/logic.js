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

  //Upon page load initialize DataTables
  var companyOutput = $('#company-output').DataTable({
    "lengthMenu": [[5, 10, 15, 20, 25 - 1], [5, 10, 15, 20, 25, "All"]],

       columns : [
        { title : "Symbol" },
        { title : "Name" },
        { title : "Current Price" },
        { title : "Prior Day Close" },
        { title : "Change" ,
          render: function (cellData, type, row ) {
          if (parseFloat(cellData) > 0.0) {
              return '<p class="positive">'+cellData+'</p>';
          } else if (parseFloat(cellData) < 0.0) {
              return '<p class="negative">'+cellData+'</p>';
          } else {
            return '<p class="neutral">'+cellData+'</p>';
          }
        }},
        { title : "% Change", 
          render: function (cellData, type, row ) {
          if (parseFloat(cellData) > 0.0) {
              return '<p class="positive">'+cellData+'</p>';
          } else if (parseFloat(cellData) < 0.0) {
              return '<p class="negative">'+cellData+'</p>';
          } else {
            return '<p class="neutral">'+cellData+'</p>';
          }
        }
      }
      ]
       

    //rowCallback: function(row, quote, index){
      //if(quote.change > 0){
          //$('td:eq(5)', row).css('color', 'red');
        //  return $('td:eq(5)', row).html('<span style="red">'+quote.change+'</span>');
      //}
      //if(quote.change < 0){
          //$(row).find('td:eq(5)').css('color', 'green');
        //  return $($(row).find('td')[5]).css('color','green');

      //}
    //}

  });
 

  // Upon page load, initialize Firebase
  var config = {
    apiKey: "AIzaSyAXVYzxF-AEeVZkY_qwNuUe3FK2yMX94bE",
    authDomain: "reskybusiness.firebaseapp.com",
    databaseURL: "https://reskybusiness.firebaseio.com",
    projectId: "reskybusiness",
    storageBucket: "reskybusiness.appspot.com",
    messagingSenderId: "166640070696"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var companyName = "";

  /**
   * Summary: 
   *  Firebase related callback Function invoked once when the page is loaded.
   *  This function fetches the recently searched companies from Firebase. 
   *  For each company, query IEX for stock information and query Stocktwits 
   *  for trending tweets.
   */
  database.ref().once("value").then(function (snapshot) {

    if (!snapshot.val()) {
      console.log("Unexpected - snapshot from Firebase is null");
      return;
    }

    console.log(snapshot.val());

    snapshot.forEach(function (eachEntry) {
      var companyObj = eachEntry.val();

      // Check for corrupted objects
      if (undefined === companyObj.companyName) {
        console.log("Unexpected error - company object " +
          "doesn't contain the field 'companyname'");
        return;
      }

      var companyName = companyObj.companyName;
      console.log("Snapshot contains " + companyName);

      // Do this in the "child_added" callback instead
      //searchedCompaniesList.push(companyName);

      // Get stock info from IEX & stock tweets from 
      // stocktwits
      getStockInfo(companyName);
      getStockTwits(companyName);
    });


    //getStockInfo(companyName);
    //getStockTwits(companyName);

  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  /**
   * Summary: 
   *  Firebase related callback Function invoked each time a new company is
   *  added to the database.
   *  This function updates the searchedCompaniesList array with the newly
   *  added company.  
   *  It does not update the stock information table, nor does it fetch updated 
   *  tweets.
   */
  database.ref().on("child_added", function (snapshot) {
    if (undefined === snapshot.val().companyName) {
      console.log("Unexpected error - company name not found in snapshot");
      return;
    }

    var companyName = snapshot.val().companyName;
    searchedCompaniesList.push(companyName);

    console.log("New company added to fireBase, updated list with " + companyName);
    console.log(searchedCompaniesList);
  });

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
  function displayStockInfo(response) {
    console.log("Here is the stock quote information -");
    console.log(response.quote);

    var quote = response.quote;

    //if/else for positiveOrNegative symbol output
    if (quote.change > 0) {
      positiveOrNegative = "+";

    } else {
      positiveOrNegative = "";
    }

    var percentFormatted = (100.0 * quote.changePercent).toFixed(3)

    if (!alreadyPresent) {
      companyOutput.row.add([
        quote.symbol,
        quote.companyName,
        quote.latestPrice,
        quote.previousClose,
        positiveOrNegative + quote.change,
        positiveOrNegative + percentFormatted + "%"
      ]).draw();
    }
  }

  $("#clear-output-button").on("click", function() {   
    $("#company-output-tbody").empty();
  });

  /**
   * Summary:
   *  Get Stock information on the specified company
   * 
   * @param {string} companyName
   */
  function getStockInfo(companyName) {

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
      error: function () {
        console.log("Error in query response for Company Info");
        queryFailed = true;
      }
    });
  }

  /**
   * Summary:
   *  This function does the main input processing for the 
   *  specified company name. It performs two AJAX queries
   *  1. IEX to obtain stock information about the company
   *  2. Stocktwits to obtain trending tweets about the company
   * 
   * The logic for this function is TBD.
   */
  function processInput(companyName) {
    //split the string into two parts:  The stock ticker symbol and the company name
    var tickerFromInput = companyName.substr(0, companyName.indexOf('-') - 1);
    //var companyFromInput = companyName.substr(companyName.indexOf("-") + 1);

    // Verify if company is already present in recents list
    if (searchedCompaniesList.includes(tickerFromInput)) {
      console.log(tickerFromInput + " is ALREADY PRESENT in the searched companies");
      alreadyPresent = true;
    } else {
      alreadyPresent = false;
    }
    console.log("Current list of searched companies is ");
    console.log(searchedCompaniesList);

    // Add to Firebase if not already present
    if (!alreadyPresent) {
      database.ref().push({
        companyName: tickerFromInput
      });
    }

    // Valid company - construct API call to look up stock price and 
    // other info
    console.log("Looking up stock info on " + tickerFromInput);
    getStockInfo(tickerFromInput);

    // Also get stock tweets about this company
    console.log("Getting stock twits on " + tickerFromInput);
    getStockTwits(tickerFromInput);
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
  $('#add-company-button').on("click", function (event) {
    event.preventDefault();
    companyName = $('#company-name-input').val().trim().toLowerCase();
    console.log("The company name is " + companyName);

    // Check for blank input
    if (companyName == "") {
      console.log("Please enter a company name");
      return;
    }

    processInput(companyName);
  });

  /**
   * Summary: 
   *  Key press handler to handle the 'enter' button when the user
   *  enters a company.
   *
   * Description.
   *  If the user typed in a company name, it fetches stock info
   *  for that company.
   *  If the user specified a sector, it fetches stock info about
   *  companies in that sector.
   */
  $('#company-name-input').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    var companyName = "";


    if (keycode !== 13) {
      console.log('You pressed' + event.keyCode + ' key in textbox');
    }
    else {
      event.preventDefault();
      companyName = $('#company-name-input').val().trim().toLowerCase();
      console.log("The company name is " + companyName);

      // Check for blank input
      if (companyName == "") {
        console.log("Please enter a company name");
        return;
      }

      processInput(companyName);
    }

  });
});
