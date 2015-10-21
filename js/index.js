var app = angular.module('wikiApp', []);

app.controller('appCtrl', ['$scope', '$http', function($scope, $http) {
  //initializing variables
  $scope.results = [];
  
  //actual search and API call
  $scope.search = function() {
    $scope.results = [];
    var endpoint = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&prop=extracts|pageimages|info&exsentences=1&exlimit=20&pilimit=3&inprop=url&explaintext&excontinue&exintro&gsrsearch='
    var search = document.getElementById('searchbar').value;
    var cb = "&callback=JSON_CALLBACK"
    $http.jsonp(endpoint + search + cb).success(function(data) {
      for (var page in data.query.pages) {
        var obj = data.query.pages[page];
        var tempArticle = {};
        tempArticle.title = obj.title;
        tempArticle.extract = obj.extract;
        tempArticle.link = obj.fullurl;
        tempArticle.edit = obj.editurl;
        $scope.results.push(tempArticle);
      }
    })
  }

}]);

//jQueryUI autocomplete for search
$("#searchbar").autocomplete({
  source: function(request, response) {
    $.ajax({
      url: "http://en.wikipedia.org/w/api.php",
      dataType: "jsonp",
      data: {
        'action': "opensearch",
        'format': "json",
        'search': request.term
      },
      success: function(data) {
        response(data[1]);
      }
    })
  },
  appendTo: '#autoData',
  open: function() {
    $('#autoData').addClass('animated fadeIn');
  },
  close: function() {
    $('#autoData').removeClass('animated fadeIn');
  },
});

//closing autocomplete if search is cleared
$(document).ready(function() {
  if ($('#searchbar').text().value === '') {
    $('#searchbar').autocomplete.close();
  }
})
