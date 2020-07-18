


$(document).ready(function () {

    createCitySearchElement();
    getWeatherDataForCityFromAPI();

    displayCityWeatherData();

});

function getWeatherDataForCityFromAPI() {
    // de1c7e7fa6f22edc2d1211e63b352b58

    // Constructing a URL to search Giphy for the name of the person who said the quote

    var city = "detroit";
    var apiKey = "de1c7e7fa6f22edc2d1211e63b352b58";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    // Performing our AJAX GET request
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // After the data comes back from the API
        // After the data comes back from the API
        .then(function (response) {
            // Storing an array of results in the results variable
            var results = response.data;
            console.log(response);
        });
}

function createCitySearchElement() {

    var searchLabel = $("<h4>");
    searchLabel.attr("class", "search-label");
    searchLabel.text("Search for a city:");

    var form = $("<form>");
    form.attr("class", "form-inline");

    var inputSearch = $("<INPUT>");
    inputSearch.attr("class", "form-control mr-sm-2");
    inputSearch.attr("type", "search");
    inputSearch.attr("placeholder", "Search");
    inputSearch.attr("aria-label", "Search");

    var searchButton = $("<button>");
    searchButton.attr("class", "btn btn-outline-success my-2 my-sm-0");
    searchButton.text("Search");

    form.append(searchLabel);
    form.append(inputSearch);
    form.append(searchButton);

    $("body").append(form);
}

function displayCityWeatherData(){
    var currentWeather = $("<div>");
    currentWeather.attr("class", "current-weather");

    $("body").append(currentWeather);

}