
function compare() {
  function get_option(option) {
    if (option == 'Labour') {
      return "<img src= 'static/labour_all.png'><br>" + "<img src='static/labour_bar.png'>";
    } else if (option == 'National') {
      return "<img src='static/national_all.png'>"
    } else {
      return "<p>Please select an option from the above dropdown table</p>"
    }
  }
  var option_1 = document.getElementById('options_1').value;
  var img_1 = get_option(option_1);
  var result_op_1 = document.getElementById('result_1');
  var option_2 = document.getElementById('options_2').value;
  var img_2 = get_option(option_2);
  var result_op_2 = document.getElementById('result_2');
  document.getElementById('result_1').innerHTML = img_1;
  document.getElementById('result_2').innerHTML = img_2
}

function words() {
  //function to return html code based on the text value of the variable provided
  function get_option(option, word, filereader){
    if(option == 'Labour') {
      
    }
  }

  var fr = new FileReader();
  var labour_text = fr.readAsText();
  //Getting user input for word to compare
  var word = document.getElementById('input_word').value;
  //var party_1 = document.getElementById('option_1').value;
  //var party_2 = document.getElementById('option_2').value;
  var result_area = document.getElementById('result_1');

  //Testing that word input has some value
  /*if (word == "") {
    document.getElementById('result_1').innerHTML = "<p>Please enter a word to compare</p>";
    return;
  } */

  word_count = get_option('Labour', word, filereader)
  result_area.innerHTML = "<p>" + word_count + "</p>"
  
  
}

function search() {
  var content_div = document.getElementById("content")
  var search_div = document.getElementById("search")
  search_div.style.backgroundColor = "#d4d6f5"
  content_div.innerHTML = "<form method = 'post'><input class='contentitems' id='word' name='word' type='text'><button class='contentitems'>Go</button><p onclick='options()' id='moreoptions' style='cursor:pointer'>More Options</p><div id='options' style='display:none'><input type = 'checkbox' id='National' name='partyoptions'><label for='National'>National</label><input type = 'checkbox' id='Labour' name='partyoptions'><label for='Labour'>Labour</label><input type = 'checkbox' id='all' checked  name='partyoptions'><label for='all'>All</label></div></form>"
  var viewdiv = document.getElementById("view")
  viewdiv.style.backgroundColor = "#a7a8be"
  search_div.style.borderBottom = 'none'
  viewdiv.style.borderBottom  = '1px solid #101344'
}

function options() {
  var content_div = document.getElementById("options")
  var moreoptions = document.getElementById("moreoptions")
  content_div.style.display = ""
  moreoptions.onclick = "hide_search()"
  moreoptions.setAttribute("onclick", "javascript: hide_options()")
  moreoptions.innerHTML = "Hide Options"
  //content_div.innerHTML = "<input type = 'radio' id='National'><label for='National'>National</label>"
}

function hide_options() {
  var moreoptions = document.getElementById("moreoptions")
  var content_div = document.getElementById("options")
  content_div.style.display = "none"
  moreoptions.innerHTML = "More Options"
  moreoptions.setAttribute("onclick", "javascript: options()")
}

function view() {
  var content_div = document.getElementById("content")
  var search = document.getElementById("search")
  var viewdiv = document.getElementById("view")
  search.style.backgroundColor = "#a7a8be"
  viewdiv.style.backgroundColor = "#d4d6f5"
  search.style.borderBottom = "1px solid #101344"
  viewdiv.style.borderBottom = 'none'
  content_div.innerHTML = ""
}