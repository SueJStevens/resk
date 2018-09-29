//THIS LOGIC OUTPUTS 2 TABLES:  (1) COMPANY OUTPUT  (2) INDUSTRY OUTPUT

$(document).ready( function () {
   
  // (1) COMPANY OUTPUT 
  var companyOutput = $("#company-output-tbody").DataTable();


    companyOutput.row.add([// output variables go here snapshot.values
      //e.g. sv.trainName,
      //sv.destination,
      //sv.frequency,
      ]
    ).draw();


    



    //(2) INDUSTRY OUTPUT
    //var industryOutput = $('#industry-output > tbody').DataTable();


    //industryOutput.row.add([// output variables go here snapshot.values
      //e.g. sv.trainName,
      //sv.destination,
      //sv.frequency,
      ]
    //).draw();


} );