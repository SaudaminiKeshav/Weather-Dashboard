var errorText = $("<p>");
errorText.attr("class", "error-text");
errorText.text("Please enter a valid city name!");
errorText.hide();

var cityListTable = $("<table>");
cityListTable.attr("class", "table table-bordered table-light");

var tbody = $("<tbody>");
var image = "";

var cityName = $("<h4>");
cityName.attr("class", "white-text city-name");

var searchedCityList = [];

$(document).ready(function() {

    // Create search input field and button to make api call and get weather data 
    createCitySearchElements();

    displayCityWeatherData();
});



function createCitySearchElements() {

    var searchLabel = $("<h4>");
    searchLabel.attr("class", "search-label");
    searchLabel.text("Search for a city:");

    var form = $("<form>");
    form.attr("class", "form-inline");

    var inputSearch = $("<INPUT>");
    inputSearch.attr("class", "form-control mr-sm-2");
    inputSearch.attr("type", "text");
    inputSearch.attr("id", "search-input");
    inputSearch.attr("onclick", "searchClick()");
    inputSearch.attr("placeholder", "Search");
    inputSearch.attr("value", "");

    var searchButton = $("<button>");
    searchButton.attr("class", "btn btn-outline-light my-2 my-sm-0");
    searchButton.attr("type", "button");
    searchButton.attr("onclick", "searchCity()");
    searchButton.attr("value", "Search");
    searchButton.text("Search");

    form.append(searchLabel);
    form.append(inputSearch);
    form.append(searchButton);
    form.append(errorText);

    $("body").append(form);
}

function searchClick() {
    errorText.hide();
}

function searchCity() {
    var userInput = $("#search-input").val();
    console.log(userInput);

    getCityWeatherDataFromAPI(userInput);
    $("#search-input").val("");
}

function getCityWeatherDataFromAPI(searchedCity) {
    // de1c7e7fa6f22edc2d1211e63b352b58

    // Constructing a URL to search Giphy for the name of the person who said the quote

    var apiKey = "de1c7e7fa6f22edc2d1211e63b352b58";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apiKey}`

    // Performing our AJAX GET request
    $.ajax({
            url: queryURL,
            method: "GET",
            statusCode: {
                404: function() {
                    displaySearchErrorText();
                }
            }
        })
        // After the data comes back from the API
        // After the data comes back from the API
        .then(function(response) {
            // Storing an array of results in the results variable
            getImageUrl(response);
            addSearchedCityToTable(response.name);
            displaySearchCityWeatherData(response);

            console.log(response);

        });
}


function displayCityWeatherData() {
    var currentWeather = $("<div>");
    currentWeather.attr("id", "current-weather");

    $("body").append(currentWeather);
}

function displaySearchErrorText() {
    errorText.show();
}

function addSearchedCityToTable(searchedCity) {

    if (searchedCityList.includes(searchedCity) != true) {
        searchedCityList.push(searchedCity);

        var row = $("<tr>");

        var cityNameEntry = $("<td>");
        cityNameEntry.attr("colspan", "10");
        cityNameEntry.attr("id", searchedCity);
        cityNameEntry.text(searchedCity);
        cityNameEntry.click(function() {
            console.log("clicked - " + $(this).attr('id'));
            getCityWeatherDataFromAPI($(this).attr('id'))
        })


        row.append(cityNameEntry);
        tbody.append(row);
        cityListTable.append(tbody);
        $("body").append(cityListTable);
    }

    var searchHistory = $(cityNameEntry).find().get($(this));
    console.log(searchHistory);
}


function displaySearchCityWeatherData(response) {

    cityName.text(response.name);

    var currentDate = moment().format('MMMM Do YYYY');

    cityName.append("  (" + currentDate + ")");
    $("#current-weather").append(cityName);
    getImageUrl(response);
}

function getImageUrl(response) {
    if (response.weather[0].description.toString().includes("clear") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("clear-sky");
    }
    if (response.weather[0].description.toString().includes("mist") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("mist");
    }
    if (response.weather[0].description.toString().includes("clouds") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("broken-clouds");
    }
    if (response.weather[0].description.toString().includes("rain") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("moderate-rain");
    }
}

function removeOldCLassName() {
    var className = $("#current-weather").attr('class');
    console.log(className);
    $("#current-weather").removeClass(className);
    console.log($("#current-weather").attr('class'));
}