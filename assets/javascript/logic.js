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


}); //end on ready function