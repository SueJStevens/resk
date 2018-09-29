/*
Plugin Source
https://www.jqueryscript.net/form/jQuery-Bootstrap-4-Typeahead-Plugin.html
*/

$(function () {

    $(".typeahead").typeahead({
          source: [
            {id: "id1", name: "jQuery"},
            {id: "id2", name: "Script"},
            {id: "id3", name: "Net"}
          ]
        });
        
/*to load data from json
$.get("data.json", function(data){
      $(".typeahead").typeahead({
        source:data
      });
    },'json');
    // data.json
    ["jQuery","Script","Net"]
    */

    /*
   $(".typeahead").typeahead({
      // data source
      source: [],
      // how many items to show
      items: 8,
      // default template
      menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
      item: '<li><a class="dropdown-item" href="#" role="option"></a></li>',
      headerHtml: '<li class="dropdown-header"></li>',
      headerDivider: '<li class="divider" role="separator"></li>',
      itemContentSelector:'a',
      // min length to trigger the suggestion list
      minLength: 1,
      // number of pixels the scrollable parent container scrolled down
      scrollHeight: 0,
      // auto selects the first item
      autoSelect: true,
      // callbacks
      afterSelect: $.noop,
      afterEmptySelect: $.noop,
      // adds an item to the end of the list
      addItem: false,
      // delay between lookups
      delay: 0,
    });    
    */

}); //end on ready function