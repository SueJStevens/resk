$(function () {
  /* code forked from here http://jsfiddle.net/FWWEn/ */
  (function ($) {
    $.fn.textWidth = function () {
      var calc = '<span style="display:none">' + $(this).text() + '</span>';
      $('body').append(calc);
      var width = $('body').find('span:last').width();
      $('body').find('span:last').remove();
      //round width to make it an integer or the ticker never stops
      width = Math.round(width);
      return width;
    };

    $.fn.marquee = function (args) {
      var that = $(this);
      var textWidth = that.textWidth(),
        offset = that.width(),
        width = offset,
        css = {
          'text-indent': that.css('text-indent'),
          'overflow': that.css('overflow'),
          'white-space': that.css('white-space')
        },
        marqueeCss = {
          'text-indent': width,
          'overflow': 'hidden',
          'white-space': 'nowrap'
        },
        args = $.extend(true, { count: -1, speed: 1e1, leftToRight: false }, args),
        i = 0,
        stop = textWidth * -1,
        dfd = $.Deferred();

      function go() {
        if (!that.length) return dfd.reject();
        if (width == stop) {
          i++;
          if (i == args.count) {
            that.css(css);
            return dfd.resolve();
          }
          if (args.leftToRight) {
            width = textWidth * -1;
          } else {
            width = offset;
          }
        }
        that.css('text-indent', width + 'px');
        if (args.leftToRight) {
          width++;
        } else {
          width--;
        }
        setTimeout(go, args.speed);
      };
      if (args.leftToRight) {
        width = textWidth * -1;
        width++;
        stop = offset;
      } else {
        width--;
      }
      that.css(marqueeCss);
      go();
      return dfd.promise();
    };

  })(jQuery);

  /*marquee notes:
  count: n --the number of times to run the scroll and then it stops.
  speed: n --the larger the # the slower the speed
  leftToRight: true --changes direction
  
  //this will run the marquee 1x at normal speed from the right
  $('.stock-ticker').marquee();
  
  //this will run the marquee 2x at normal speed from the right
  $('.stock-ticker').marquee({ count: 2 });  //scrolls two x
  //this will run the marquee 2x at fast speed
  $('.stock-ticker').marquee({ count: 2, speed: 1 });  //fast
  
  
  */

  //$('h5').marquee({ count: 1, speed: 2 }).done(function() { $('h5').css('color', '#f00'); })
  //$('.stock-ticker').marquee({ count: 2 });  //scrolls two x
  //$('.stock-ticker').marquee({ count: 2 });  //scrolls two x
  //$('.stock-ticker').marquee({ speed: 5 });  //fast
  //$('.stock-ticker').marquee({ speed: 5000 });  //VERY SLOW
  //$('.stock-ticker').marquee({ count: 2, speed: 1 });  //fast
  //  $('.stock-ticker').marquee({ leftToRight: true, speed: 1 });
  $('.stock-ticker').marquee({ leftToRight: false, speed: 25 });

  /*Pause on mouse hover -- doesn't work
  $('.myMarquee').marquee();
      $('.myMarquee').mouseover(function () {     
          $(this).removeAttr("style");
     }).mouseout(function () {
          $(this).marquee();
     });
     */

  //create an array of symbols in the DOW
  var arrDowSymbols = [
    "MMM",
    "AXP",
    "AAPL",
    "BA",
    "CAT",
    "CVX",
    "CSCO",
    "KO",
    "DIS",
    "DWDP",
    "XOM",
    "GS",
    "HD",
    "IBM",
    "INTC",
    "JNJ",
    "JPM",
    "MCD",
    "MRK",
    "MSFT",
    "NKE",
    "PFE",
    "PG",
    "TRV",
    "UTX",
    "UNH",
    "VZ",
    "V",
    "WMT",
    "WBA"
  ]

  //turn array into a string
  var strSymbols = arrDowSymbols + ",";

  // First query fetches the current stock price
  var queryURL = "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + strSymbols + "&types=quote,price,previous,company";
  $.ajax({
    url: queryURL,
    method: "GET",
    async: false,
    timeout: 30000, // timeout of 30 seconds
    success: function (response) {
      console.log(response);

      //get length of object
      var count = Object.keys(response).length;
      //console.log("Symbol: " + Object.keys(response)[0]); //this returns the JSON Object Key which is the symbol requested
      //console.log("Company Name: " + Object.values(response)[0].quote.companyName); //this returns the company name
      //console.log("Change in Price: " + Object.values(response)[0].quote.change); //this returns the company name

      //loop through the returned object and append the HTML into the ticker div
      for (var i = 0; i < count - 1; i++) {
        symbol = Object.keys(response)[i];
        companyNameMarquee = Object.values(response)[i].quote.companyName;
        changeInPrice = Object.values(response)[i].quote.change;

        var newTickerCo = $('<span class="font-weight-bold">');
        var newTickerChange = $('<span class="font-weight-normal">');

        newTickerCo.append(" " + symbol + ' ' + companyNameMarquee + " ");
        newTickerChange.append(" " + changeInPrice + " ");

        $("#stock-ticker-div").append(newTickerCo);
        $("#stock-ticker-div").append(newTickerChange);

      } //end loop

    }, //end success

    error: function () {
      console.log("Error in query response for Ticker");
      queryFailed = true;
    } //end error

  }); //end ajax

}); //end on ready function