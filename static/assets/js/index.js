//Saves the charts
var myBarChart
var compareBarChart
var myPieChart

//Loading up csv data for graphs
d3.csv("./static/labour_word_frequency.csv").then((Labour)=> {
  d3.csv("./static/national_word_frequency.csv").then((National)=> {
    console.log("Making csv")
    data_collection = {Labour, National}
    data_col_len = Object.keys(data_collection).length
    //Setting correct variables for top row cards
    card_div = document.getElementById("card_top_div")
    for(let i =0; i < data_col_len; i++) {
      let party_data_len = data_collection[Object.keys(data_collection)[i]].length
      //card_div.innerHTML += '<div class="col-md-6 mb-4"><div class="card border-left-success shadow h-100 py-2"><div class="card-body"><div class="row no-gutters align-items-center"><div class="col mr-2"><div class="text-xs font-weight-bold text-uppercase mb-1">' + Object.keys(data_collection)[i] + " Corpus Size" + '</div><div class="h5 mb-0 font-weight-bold text-gray-800">'+ party_data_len +'</div></div><div class="col-auto"></div></div></div></div></div>'
    }
    /*words = find_word("environment")
    colours = ['#bd1313', '#133087'] //Setting colours array to the suitable colour for each of the parties
    if(words[0]["count"] > words[1]["count"]){
      max_value = words[0]["count"]
    } else {
      max_value = words[1]["count"]
    }
    graph_data = [words, colours, max_value, ['Labour', 'National']]
    create_graphs(graph_data)
    key_data = [words, colours]*/
})});

searchbar = document.getElementById("search_input")
searchbar.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {  
    searchWord('topsearch');
  }
});
//Used for search features
function searchWord(search_area) {
  //document.getElementById("buttons").style.display = ""
  switch(search_area){
    case 'topsearch':
      search = document.getElementById('search_input')
      break;
    case 'frequencies':
      search = document.getElementById('search_input_frequencies')
  }
  if(document.getElementById("lab_data")){
    document.getElementById("lab_data").innerHTML = ""
  }
  /*search = document.getElementById("search_input_frequencies")
  if(search.value == "") {
    search = document.getElementById("search_input") //Retrieving the data from the search field
  }*/
  words_data = find_word(search.value) //Using the find_word function to retrieve the suitable data from each of the parties
  colours = ['#bd1313', '#133087'] //Setting colours array to the suitable colour for each of the parties
  //If else function to determine which data is larger
  if(words_data[0]["count"] > words_data[1]["count"]) {
    max_value = words_data[0]["count"]
  } else {
    max_value = words_data[1]["count"]
  }
  labels = ['Labour', 'National']
  data = [words_data, colours, max_value, labels]
  create_graphs(data)
  card_div = ""//document.getElementById("card_top_div")
  card_div.innerHTML = ""
  /*for(let i = 0; i < words_data.length; i++){
    card_div.innerHTML += '<div class="col-md-6 mb-4"><div class="card border-left-success shadow h-100 py-2"><div class="card-body"><div class="row no-gutters align-items-center"><div class="col mr-2"><div class="text-xs font-weight-bold text-uppercase mb-1">' + Object.keys(data_collection)[i] + " Representitive Frequency of " + words_data[i]["word"] + '</div><div class="h5 mb-0 font-weight-bold text-gray-800">'+ words_data[i]["count"] +'</div></div><div class="col-auto"></div></div></div></div></div>'
  }*/
}

function add_key(key_data) {
  data = key_data[0]
  colours = key_data[1]
  key_element = '<div class="mt-4 text-center small">'
  for(i=0;i<data.length;i++) {
    key_element += '<span class="mr-2"><i style="color: ' + colours[i] + '"class="fas fa-circle"></i>' + data[i] + '</span>'
  }
  key_element += '</div>'
  document.getElementById("bar-chart-area").innerHTML = key_element
  document.getElementById("pie-chart-area").innerHTML = key_element
}

function remove_key() {
  document.getElementById('bar-chart-area').innerHTML = ''
  document.getElementById('pie-chart-area').innerHTML = ''
}

//Using a singular function to create  both graphs to prevent one graph being generated without the other
function create_graphs(data){
  create_party_bar_graph(data)
  create_pie_graph(data)
}

//Finds a specific word in the csv files
function find_word(word) {
    //Getting data 
    console.log(word)
    for(item of data_collection["Labour"]){
      if(item["word"] == word) {
        csv_data_labour = item
      }
    }
  
    for(item of data_collection["National"]) {
      if(item["word"] == word) {
        csv_data_national = item
      }
    }

    return [csv_data_labour, csv_data_national]
}

//Creates a pie graph based on the word/frequency
function create_pie_graph(graph_data) {
  //Getting data
  data = graph_data[0]
  colours = graph_data[1]
  max_value = graph_data[2]
  labels = graph_data[3]

  //Seperating the words from the values
  words_keys = []
  words_values = []
  for(i=0;i<data.length;i++){
    words_keys.push( data[i]["word"])
    words_values.push(Number(data[i]["count"]))
  }

  if(labels === "party-overview"){ 
    add_key([words_keys, colours])
  } else {
    add_key([labels, colours])
  }
  // Set new default font family and font color to mimic Bootstrap's default styling
  Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';
  // Pie Chart Example
  var ctx = document.getElementById("myPieChart");
  if(myPieChart) {
    myPieChart.destroy()
  }
  myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: words_keys,
      datasets: [{
        data: words_values,
        backgroundColor: colours,
        hoverBackgroundColor: colours,
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  });

}

//Creates a bar chart based on the word/frequency, requires an array containing the data, graph colours, the maximum value and chart labels in that order
function create_party_bar_graph(graph_data) {
  //Chart.js code
  Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';
  //Seperating the different data from the graph data input
  data = graph_data[0]
  colours = graph_data[1]
  max_value = graph_data[2]
  labels = graph_data[3]
  //Seperating the words from the values
  words_keys = []
  words_values = []
  for(i=0;i<data.length;i++){
    words_keys.push( data[i]["word"])
    words_values.push(Number(data[i]["count"]))
  }
  if(labels === "party-overview"){ 
    add_key([words_keys, colours])
  } else {
    add_key([labels, colours])
  }
  function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }

  if(myBarChart != undefined){
    myBarChart.destroy()
  }

  var ctx = document.getElementById("myBarChart");
  myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: words_keys,
      datasets: [{
        label: 'Representitive Frequency',
        backgroundColor: colours,
        hoverBackgroundColor: colours,
        borderColor: "#4e73df",
        data: words_values
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'party'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 6
          },
          maxBarThickness: 25,
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: Math.ceil(max_value*100)/100,
            maxTicksLimit: 4,
            padding: 10,
            callback: function(value, index, values) {
              return "" + number_format(value, 3);
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': ' + number_format(tooltipItem.yLabel, 3);
          }
        }
      },
    }
  })
}

function create_party_graphs(party) {
  //document.getElementById("buttons").style.display = "none"
  colours = []
  if (party == 'Labour') {
    party_array = data_collection["Labour"]
  } else if (party == "National") {
    party_array = data_collection["National"]
  }
  //Generating random colours for each piece of data
  for(i=0; i<5; i++){
    colours.push('#' + Math.floor(Math.random()*16777215).toString(16))
  }

  //Sorts the party_array from most used to least used
  top_words = party_array.sort(function(a,b) {
    return Number(b.count) - Number(a.count)
  })
  top_50_words = top_words.slice(0,25)
  top_5_words = top_words.slice(0,5)
  graph_data = [top_5_words, colours, top_words[0]["count"], "party-overview"]
  create_graphs(graph_data)
  create_wordcloud([top_50_words,colours[0],"party-cloud"])
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

//Used to compare words using the 'compare words' tab
function compareWords(words, word_relations) {
  word_1 = words[0]
  word_2 = words[1]
  nat_sim = word_relations[0]
  lab_sim = word_relations[1]

  //Getting all needed html objects
  title = document.getElementById("compare_title")
  lab_div = document.getElementById("compare_lab_data")
  nat_div = document.getElementById("compare_nat_data")
  bar_graph_div = document.getElementById("compare_bar_graph")

  words_data_1 = find_word(word_1) //Using the find_word function to retrieve the suitable data from each of the parties from the first search query
  words_data_2 = find_word(word_2) // Same as above with the second search query
  colours = ['#bd1313', '#133087', '#bd1313', '#133087'] //Setting colours array to the suitable colour for each of the parties

  title.innerHTML = '<div class="d-sm-flex align-items-center justify-content-between mb-4"><h1 class="h3 mb-0 text-gray-800">Similarity between words "' + word_1 + '" and "' + word_2 + '"</h1></div><hr>'

  lab_div.innerHTML = '<div class="mb-4"><div class="card labour_left_border shadow h-100 py-2"><div class="card-body"><div class="row no-gutters align-items-center"><div class="col mr-2"><div class="text-xs font-weight-bold text-uppercase mb-1">' + "Similarity for Labour" + '</div><div class="h5 mb-0 font-weight-bold text-gray-800">'+ lab_sim.toFixed(3) +'</div></div><div class="col-auto"></div></div></div></div></div>'
  nat_div.innerHTML = '<div class="mb-4"><div class="card national_left_border shadow h-100 py-2"><div class="card-body"><div class="row no-gutters align-items-center"><div class="col mr-2"><div class="text-xs font-weight-bold text-uppercase mb-1">' + "Similarity for National" + '</div><div class="h5 mb-0 font-weight-bold text-gray-800">'+ nat_sim.toFixed(3) +'</div></div><div class="col-auto"></div></div></div></div></div>'
  for(let i = 0; i<Object.keys(lab_similarity).length; i++) {
      lab_div.innerHTML += '<div class="mb-4"><div class="card labour_left_border shadow h-100 py-2"><div class="card-body"><div class="row no-gutters align-items-center"><div class="col mr-2"><div class="text-xs font-weight-bold text-uppercase mb-1">' + lab_similarity[i][0] + '</div><div class="h5 mb-0 font-weight-bold text-gray-800">'+ lab_similarity[i][1].toFixed(3) +'</div></div><div class="col-auto"></div></div></div></div></div>'
  }

  for(let i = 0; i<Object.keys(nat_similarity).length; i++) {
      nat_div.innerHTML += '<div class="mb-4"><div class="card national_left_border shadow h-100 py-2"><div class="card-body"><div class="row no-gutters align-items-center"><div class="col mr-2"><div class="text-xs font-weight-bold text-uppercase mb-1">' + nat_similarity[i][0] + '</div><div class="h5 mb-0 font-weight-bold text-gray-800">'+ nat_similarity[i][1].toFixed(3) +'</div></div><div class="col-auto"></div></div></div></div></div>'
  }

  //If else function to determine which data is larger
  if(words_data_1[0]["count"] > words_data_1[1]["count"]) {
    max_value = words_data_1[0]["count"]
  } else {
    max_value = words_data_1[1]["count"]
  }

  //Comparing the max value of words_data_1 to the values of words_data_2
  if(words_data_2[0]["count"] > max_value) {
    max_value = words_data_2[0]["count"]
  } else if (words_data_2[1]["count"] > max_value) {
    max_value = words_data_2[1]["count"]
  }

  //Combining both sets of words_data into one array
  all_words_data = []
  for (i = 0; i < words_data_1.length; i++) {
    all_words_data.push(words_data_1[i])
  }

  for(i=0; i<words_data_2.length; i++) {
    all_words_data.push(words_data_2[i])
  }

  labels = ['Labour', 'National']
  data = [all_words_data, colours, max_value, labels]
  console.log(data)
  compare_bar_graph(data)
  card_div = document.getElementById("card_top_div")
  card_div.innerHTML = ""
  /*for(let i = 0; i < all_words_data.length; i++){
    card_div.innerHTML += '<div class="col-xl-3 col-md-6 mb-4"><div class="card border-left-success shadow h-100 py-2"><div class="card-body"><div class="row no-gutters align-items-center"><div class="col mr-2"><div class="text-xs font-weight-bold text-uppercase mb-1">' + Object.keys(data_collection)[i] + " Representitive Count of " + words_data[i]["word"] + '</div><div class="h5 mb-0 font-weight-bold text-gray-800">'+ words_data[i]["count"] +'</div></div><div class="col-auto"></div></div></div></div></div>'
  }*/
}

function compare_bar_graph(data){
    //Chart.js code
    console.log(data)
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';
    //Seperating the different data from the graph data input
    c_data = data[0]
    console.log(c_data)
    colours = data[1]
    max_value = data[2]
    labels = data[3]
    //Seperating the words from the values
    words_keys = []
    words_values = []
    for(i=0;i<data.length;i++){
      words_keys.push( c_data[i]["word"])
      words_values.push(Number(c_data[i]["count"]))
    }
    console.log(words_keys)
    console.log(words_values)
    function number_format(number, decimals, dec_point, thousands_sep) {
      number = (number + '').replace(',', '').replace(' ', '');
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
          var k = Math.pow(10, prec);
          return '' + Math.round(n * k) / k;
        };
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
    }
  
    if(compareBarChart != undefined){
      compareBarChart.destroy()
    }
    console.log("Making graph")
    var ctx = document.getElementById("compareBarChart");
    compareBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: words_keys,
        datasets: [{
          label: 'Representitive Frequency',
          backgroundColor: colours,
          hoverBackgroundColor: colours,
          borderColor: "#4e73df",
          data: words_values
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [{
            time: {
              unit: 'party'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 6
            },
            maxBarThickness: 25,
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: Math.ceil(max_value*100)/100,
              maxTicksLimit: 4,
              padding: 10,
              callback: function(value, index, values) {
                return "" + number_format(value, 3);
              }
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, chart) {
              var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
              return datasetLabel + ': ' + number_format(tooltipItem.yLabel, 3);
            }
          }
        },
      }
    })

    //Making graph area visibile
    document.getElementById("compare_graphs").style.display = ""

    key_element = '<div class="mt-4 text-center small">'
    for(i=0;i<labels.length;i++) {
      key_element += '<span class="mr-2"><i style="color: ' + colours[i] + '"class="fas fa-circle"></i>' + labels[i] + '</span>'
    }
    key_element += '</div>'
    document.getElementById("compare-bar-chart-area").innerHTML = key_element
}

//Is called when the 'compare word' button is pressed in the drop down menu in the search nav
function compareWords_backup() {
  //Setting different elemets to show/hide to initiate the comparison of a word
  if(document.getElementById("lab_data")){
    document.getElementById("lab_data").innerHTML = ""
    document.getElementById("nat_data").innerHTML = ""
  }
  document.getElementById("hidden_div_1").style.display = "flex" //"Compare With" text
  document.getElementById("hidden_div_2").style.display = "flex" //Second searchbar
  document.getElementById("search-word").style.display = "none" //Seach word button
  document.getElementById("compare-word").style.display = "flex" //Compare Word button
}

//Search function for comparing words
function search_compare_word() {
  search_1 = document.getElementById("search_input") //Retrieving the data from the search field
  search_2 = document.getElementById("search_input_2")
  words_data_1 = find_word(search_1.value) //Using the find_word function to retrieve the suitable data from each of the parties from the first search query
  words_data_2 = find_word(search_2.value) // Same as above with the second search query
  colours = ['#bd1313', '#133087', '#bd1313', '#133087'] //Setting colours array to the suitable colour for each of the parties
  //If else function to determine which data is larger
  if(words_data_1[0]["count"] > words_data_1[1]["count"]) {
    max_value = words_data_1[0]["count"]
  } else {
    max_value = words_data_1[1]["count"]
  }

  //Comparing the max value of words_data_1 to the values of words_data_2
  if(words_data_2[0]["count"] > max_value) {
    max_value = words_data_2[0]["count"]
  } else if (words_data_2[1]["count"] > max_value) {
    max_value = words_data_2[1]["count"]
  }

  //Combining both sets of words_data into one array
  all_words_data = []
  for (i = 0; i < words_data_1.length; i++) {
    all_words_data.push(words_data_1[i])
  }

  for(i=0; i<words_data_2.length; i++) {
    all_words_data.push(words_data_2[i])
  }

  labels = ['Labour', 'National']
  data = [all_words_data, colours, max_value, labels]
  create_graphs(data)
  card_div = document.getElementById("card_top_div")
  card_div.innerHTML = ""
  /*for(let i = 0; i < all_words_data.length; i++){
    card_div.innerHTML += '<div class="col-xl-3 col-md-6 mb-4"><div class="card border-left-success shadow h-100 py-2"><div class="card-body"><div class="row no-gutters align-items-center"><div class="col mr-2"><div class="text-xs font-weight-bold text-uppercase mb-1">' + Object.keys(data_collection)[i] + " Representitive Count of " + words_data[i]["word"] + '</div><div class="h5 mb-0 font-weight-bold text-gray-800">'+ words_data[i]["count"] +'</div></div><div class="col-auto"></div></div></div></div></div>'
  }*/
}

function single_search() {
    //Setting different elemets to show/hide to initiate the comparison of a word
    document.getElementById("hidden_div_1").style.display = "none" //"Compare With" text
    document.getElementById("hidden_div_2").style.display = "none" //Second searchbar
    document.getElementById("search-word").style.display = "flex" //Seach word button
    document.getElementById("compare-word").style.display = "none" //Compare Word button
    document.getElementById("single_search").style.cursor = "default"
    document.getElementById("single_search").classList.toggle("dropbtn-hover")
}

//DELETE AFTER WORD CLOUD IS FINISHED
function single_search_backup() {
  //Setting different elemets to show/hide to initiate the comparison of a word
  document.getElementById("hidden_div_1").style.display = "none" //"Compare With" text
  document.getElementById("hidden_div_2").style.display = "none" //Second searchbar
  document.getElementById("search-word").style.display = "flex" //Seach word button
  document.getElementById("compare-word").style.display = "none" //Compare Word button
  document.getElementById("single_search").style.cursor = "default"
  document.getElementById("single_search").classList.toggle("dropbtn-hover")
}

//Requires the word data, word colour and wordcloud title
function create_wordcloud(wordcloud_data) {

  //Extracting data from the input parameter
  words = wordcloud_data[0]
  colour = wordcloud_data[1]
  title = wordcloud_data[2]
  wordcloud_div = null

  //Clearing wordcloud divs
  
  //document.getElementById("lab_wordclouds").innerHTML = ""
  //document.getElementById("nat_wordclouds").innerHTML = ""

  //Setting up divs to allocate for multiple wordclouds in the same page
  if(title == "Labour"){
    wordcloud_div = document.getElementById("lab_wordclouds")
  } else if (title == "National") {
    wordcloud_div = document.getElementById("nat_wordclouds")
  } else if (title == "party-cloud") {
    title = "Top Words"
    wordcloud_div = document.getElementById("lab_wordclouds")
    document.getElementById("nat_wordclouds").innerHTML = ""
  }
  wordcloud_div.innerHTML = ""
  wordcloud_div.innerHTML += "<div id = 'wordcloud_card' class='card shadow'></div>"
  document.getElementById("wordcloud_card").innerHTML += "<div class='card-header py-3 d-flex flex-row align-items-center justify-content-between'><h6 class='m-0 font-weight-bold text-primary'>" + title + " </h6> </div><div id = 'my_dataviz'></div>"
  //Setting the id of the div to nothing in order to allow for 'wordcloud_card' to be created/targeted multiple times
  if(title == "Labour"){
    document.getElementById('wordcloud_card').innerHTML += "<div style='background-color: #f8f9fc;' id='lab_textdiv'></div>"
  } else if (title == "National") {
    document.getElementById('wordcloud_card').innerHTML += "<div style='background-color: #f8f9fc;' id='nat_textdiv'></div>"
  } else if (title == "Top Words") {
    document.getElementById('wordcloud_card').innerHTML += "<div style='background-color: #f8f9fc;' id='top_textdiv'></div>"
  }
  document.getElementById("wordcloud_card").id = ""
  //Sizes to use for the wordcloud (Similarity numbers are too similar)

  myWords = []
  sizes=[]
  init_value = 50
  change = 50/words.length
  sizes.push(init_value)
  for(i=0; i < words.length; i++){
    init_value -= change
    sizes.push(init_value)
    if(Array.isArray(words[i])){
      if(words[i][0].includes('_')){
        words[i][0] = words[i][0].replace('_', ' ')
      }
      myWords.push( {word: words[i][0], size: sizes[i], true_size: words[i][1]})
    } else {
      console.log(words[i]["count"])
      if(words[i]["word"].includes('_')){
        words[i]["word"] = words[i]["word"].replace('_', ' ')
      }
      myWords.push( {word: words[i]["word"], size: sizes[i], true_size: words[i]["count"]})
    }
  }
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 450 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  mydataviz = document.getElementById("my_dataviz")
  mydataviz.id = title
  mydataviz = document.getElementById(title)

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  var layout = d3.layout.cloud()
    .size([width, height])
    .words(myWords.map(function(d) { return {text: d.word, size:d.size, true_size:d.true_size}; }))
    .padding(5)        //space between words
    //.rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize((d) => { return d.size; }) // font size of words
    .on("end", draw);
  layout.start();
  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    svg
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) {return d.size + "px";})
          .style("fill", colour)
          .attr("text-anchor", "middle")
          .style("font-family", "Impact")
          .style("cursor", "pointer")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; })
          .attr("onclick", function(d) {return "showtip('" + d.text + "','" + d.true_size +"','" + title + "')"});
  }
  showtip("Select a word from the wordcloud to view", "Undefined", title)
}

function showtip(word, size, party){
  div = document.getElementById("textdiv")
  console.log("tooltip")
  if(party == 'Labour') {
    div = document.getElementById("lab_textdiv")
  } else if(party == 'Top Words') {
    div = document.getElementById("top_textdiv")
  } else {
    div = document.getElementById("nat_textdiv")
  }
  if(size != 'Undefined'){
    round_size = parseFloat(size).toFixed(3)
  } else {
    round_size = size
  }
  div.innerHTML = ""
  div.innerHTML += '<div style="text-align:center; background-color:#f8f9fc;"><hr><b> Word: </b> <p>' + word + "</p> <b>Relation Frequency:</b> <p>" + String(round_size) + '</p></div>'
}



function create_wordcloud_backup(wordcloud_data) {
  words = wordcloud_data[0]
  colour = wordcloud_data[1]
  sizes = [50, 45, 30, 35, 30, 25, 20, 15,10,5]
  myWords = []

  for(i=0; i < words.length; i++){
    myWords.push( {word: words[i][0], size: words[i][1]*10})
  }
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 450 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  var layout = d3.layout.cloud()
    .size([width, height])
    .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
    .padding(5)        //space between words
    //.rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize((d) => { return d.size; })      // font size of words
    .on("end", draw);
  layout.start();
  
  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    svg
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", (d) => { return d.size; })
          .style("fill", colour)
          .attr("text-anchor", "middle")
          .style("font-family", "Impact")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
  }
}

function toggle_related_words(list) {
  console.log("working")
  target_1 = document.getElementById("lab_data")
  target_2 = document.getElementById("nat_data")
  words_toggle = document.getElementById("related_words_toggle")
  if(target_1.style.display == 'none') {  
    target_1.style.display = ''
    target_2.style.display = ''
    words_toggle.style.backgroundColor = "#b3b3b3"
    words_toggle.innerHTML = "Hide All Related Words"
  } else {
    target_1.style.display = 'none'
    target_2.style.display = 'none'
    words_toggle.style.backgroundColor = "#fff"
    words_toggle.innerHTML = "Show All Related Words"
  }
}

function openTab(evt, tabName) {
  document.getElementById('topsearch').style.display = "none"
  console.log("Changing tabs")
  document.getElementById("landing-screen").style.display = "none"
  //Removing welcome page title
  document.getElementById('pagetitle').style.display = "none"

  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("nav-link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  console.log("switching")
  switch(tabName){
    case 'frequencies':
      //evt.currentTarget.className += ' active'
      document.getElementById("frequencies").style.display = "block"
      break;
    case 'wordclouds':
      //evt.currentTarget.className += ' active'
      document.getElementById("wordclouds").style.display = "block"
      break;
    case 'related':
      document.getElementById("related_words").style.display = "block"
      break
    case 'compare':
      console.log("Switching to compare")
      document.getElementById("landing-screen").style.display = "none"
      document.getElementById("compare_words").style.display = "block"
      break;
    case 'Labour':
      console.log("labour")
      document.getElementById("landing-screen").style.display = "none"
      document.getElementById("labour_title").style.display = "block"
      document.getElementById("frequencies_charts").style.display = "flex"
      document.getElementById("wordclouds_charts").style.display = "flex"
      create_party_graphs('Labour')
      break;
    case 'National':
      document.getElementById("landing-screen").style.display = "none"
      document.getElementById("national_title").style.display = "block"
      document.getElementById("frequencies_charts").style.display = "flex"
      document.getElementById("wordclouds_charts").style.display = "flex"
      create_party_graphs('National')
      break;
    default:
      document.getElementById("landing-screen").style.display = ""
  }

  /*if(tabName == 'frequencies' && !myBarChart){
    evt.currentTarget.className += " active" 
  } else */if(tabName != "none") {

  // Show the current tab, and add an "active" class to the button that opened the tab*/
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
  }
}