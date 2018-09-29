/**
 * Summary:
 *  This file contains an array of company objects.
 *  This is the complete list of stocks listed on IEX.
 *  This object will be used for all lookups.
 */

var allCompanyNames = {};

function getCompanyNames()
{
	// Step 1 : construct the AJAX query to IEX for all company names
	var queryURL = encodeURI("https://api.iextrading.com/1.0/ref-data/symbols");
	var queryResponse = {};
	var i = 0;

	// Synchronous call (TBD: Use Promises instead)
	$.ajax({
    url: queryURL,
    method: "GET",
    async: false,
    timeout: 30000, // timeout of 30 seconds
    success: function(response){
			queryResponse = response;
			console.log("Here are the companies");
			console.log(queryResponse);
    },
    error: function(){
      console.log("Error in query response for Company Info");
      queryFailed = true;
    }
	});
	
	// We have the companies list, we gotta trim the list to 
	// common stocks only. (type = "cs")
	console.log(queryResponse[0].type);
  for (i = 0; i < queryResponse.length; i++){
		var type = queryResponse[i].type.trim().toLowerCase();
		var name = queryResponse[i].name.trim().toLowerCase();
		var symbol = queryResponse[i].symbol.trim().toLowerCase();
		if(symbol === "adro"){
			console.log("Splicing "+name+" from the list");
			console.log("Its type is "+type);
		}
		if(type !== "cs"){
			if(symbol === "aieq"){
				console.log("Splicing "+name+" from the list");
				console.log("Its type is "+type);
			}
			queryResponse.splice(i,1);
		}
	}

	allCompanyNames =  queryResponse;

	console.log("The filted list of common stocks is ");
	console.log(allCompanyNames);
}