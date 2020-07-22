var errorText = $("<p>");
errorText.attr("class", "error-text");
errorText.text("Please enter a valid city name!");
errorText.hide();

var cityListTable = $("<table>");
cityListTable.attr("class", "table table-bordered table-light");

var tbody = $("<tbody>");
var image = "";

var cityName = $("<h3>");
cityName.attr("class", "white-text city-name bold_text");

var temperature = $("<h5>");
temperature.attr("class", "white-text city-name bold_text");

var humidity = $("<h5>");
humidity.attr("class", "white-text city-name bold_text");
var wind_speed = $("<h5>");
wind_speed.attr("class", "white-text city-name bold_text");
var uv_index = $("<h5>");
uv_index.attr("class", "white-text city-name bold_text");

var searchedCityList = [];
var userSearchResultList = [];


$(document).ready(function() {
    if (localStorage.getItem('UserSearchCityList') === null) {
        // Create search input field and button to make api call and get weather data 
        createCitySearchElements();

        displayCityWeatherData();
    } else {
        displayCityWeatherData();
        reloadWeatherDataFromLocalStorage();
    }
});

// window.onload =

function reloadWeatherDataFromLocalStorage() {
    createCitySearchElements();

    var savedUserSearchList = JSON.parse(localStorage.getItem('UserSearchCityList'));
    var length = savedUserSearchList.length;
    reloadTableContent(savedUserSearchList);
    reloadDataFromLocalStorage(savedUserSearchList[length - 1]);
}

function reloadTableContent(savedUserSearchList) {
    savedUserSearchList.forEach(object => {
        addSearchedCityToTable(object.key);
    });
}

function reloadDataFromLocalStorage(searchedCityData) {

    cityName.text(searchedCityData.key);

    var currentDate = moment().format('MMMM Do YYYY');

    cityName.append("  (" + currentDate + ")");
    $("#current-weather").append(cityName);

    temperature.text("Temperature: " +
        searchedCityData.temp);
    $("#current-weather").append(temperature);

    humidity.text("Humidity: " + searchedCityData.humidity);
    $("#current-weather").append(humidity);

    wind_speed.text("Wind Speed: " + searchedCityData.wind_speed);
    $("#current-weather").append(wind_speed);

    // humidity.text(searchedCity.humidity);
    // $("#current-weather").append(humidity); *********************

    getImageUrlFromLocalStorage(searchedCityData);
}

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

            addResponseToLocalStorage(response);
            // getImageUrl(response);
            addSearchedCityToTable(response.name);
            displaySearchCityWeatherData(response);

            console.log(response);

        });
}

function addResponseToLocalStorage(response) {
    // for (var i = 0; i < userSearchResultList.length; i++) {
    var UserSearchCityList = [];

    if (localStorage.getItem('UserSearchCityList') === null) {
        userSearchResultList.push({
            key: response.name,
            feels_like: response.main.feels_like,
            humidity: response.main.humidity,
            temp: response.main.temp,
            weather: response.weather[0].description,
            weather_icon: response.weather[0].icon,
            wind_speed: response.wind.speed
        })
        localStorage.setItem('UserSearchCityList', JSON.stringify(userSearchResultList));

    } else {
        // Else fetch the existing array from local storage 
        UserSearchCityList = JSON.parse(localStorage.getItem('UserSearchCityList'));

        if ((UserSearchCityList.length == 0 && userSearchResultList.length == 0)) {
            // Add content to taskArray and set the item to local storage 
            userSearchResultList.push({
                    key: response.name,
                    feels_like: response.main.feels_like,
                    humidity: response.main.humidity,
                    temp: response.main.temp,
                    weather: response.weather[0].description,
                    weather_icon: response.weather[0].icon,
                    wind_speed: response.wind.speed
                })
                // Create a new array in local storage if doesn't exist 
            localStorage.setItem('UserSearchCityList', JSON.stringify(userSearchResultList));
        }

        // If the array existing and is empty, push an object onto the array 
        else if (UserSearchCityList.length != 0 && userSearchResultList.length != 0) {
            for (var i = 0; i < userSearchResultList.length; i++) {
                if (userSearchResultList[i].key == response.name) {
                    userSearchResultList.splice(i, 1);
                }
            }
            userSearchResultList.push({
                key: response.name,
                feels_like: response.main.feels_like,
                humidity: response.main.humidity,
                temp: response.main.temp,
                weather: response.weather[0].description,
                weather_icon: response.weather[0].icon,
                wind_speed: response.wind.speed
            });
            localStorage.setItem('UserSearchCityList', JSON.stringify(userSearchResultList));
            console.log(UserSearchCityList);
        }

    }
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
            var clickedCity = $(this).attr('id');
            getDataFromLocalStorage(clickedCity);
            // getCityWeatherDataFromAPI($(this).attr('id'))
        })


        row.append(cityNameEntry);
        tbody.append(row);
        cityListTable.append(tbody);
        $("body").append(cityListTable);
    }

    var searchHistory = $(cityNameEntry).find().get($(this));
    console.log(searchHistory);
}

function getDataFromLocalStorage(userSelection) {
    var savedUserSearchList = JSON.parse(localStorage.getItem('UserSearchCityList'));

    console.log(savedUserSearchList);

    var searchedCity = savedUserSearchList.find(item => item.key === userSelection);
    console.log(searchedCity);

    displaySearchCityWeatherDataFromLocalStorage(searchedCity);
}

function displaySearchCityWeatherDataFromLocalStorage(searchedCity) {

    cityName.text(searchedCity.key);

    var currentDate = moment().format('MMMM Do YYYY');

    cityName.append("  (" + currentDate + ")");
    $("#current-weather").append(cityName);

    temperature.text("Temperature: " +
        searchedCity.temp);
    $("#current-weather").append(temperature);

    humidity.text("Humidity: " + searchedCity.humidity);
    $("#current-weather").append(humidity);

    wind_speed.text("Wind Speed: " + searchedCity.wind_speed);
    $("#current-weather").append(wind_speed);

    // humidity.text(searchedCity.humidity);
    // $("#current-weather").append(humidity); *********************

    getImageUrlFromLocalStorage(searchedCity);
}


function displaySearchCityWeatherData(response) {

    cityName.text(response.name);

    var currentDate = moment().format('MMMM Do YYYY');

    cityName.append("  (" + currentDate + ")");
    $("#current-weather").append(cityName);

    temperature.text("Temperature: " +
        response.main.temp);
    $("#current-weather").append(temperature);

    humidity.text("Humidity: " + response.main.humidity);
    $("#current-weather").append(humidity);

    wind_speed.text("Wind Speed: " + response.wind.speed);
    $("#current-weather").append(wind_speed);

    // humidity.text(searchedCity.humidity);
    // $("#current-weather").append(humidity); *********************

    getImageUrl(response);
}


function getImageUrlFromLocalStorage(searchedCity) {
    if (searchedCity.weather.toString().includes("clear") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("clear-sky");
    }
    if (searchedCity.weather.toString().includes("mist") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("mist");
    }
    if (searchedCity.weather.toString().includes("scattered") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("scattered-clouds");
    }
    if (searchedCity.weather.toString().includes("clouds") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("clouds");
    }
    if (searchedCity.weather.toString().includes("rain") == true && searchedCity.weather.toString().includes("moderate") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("moderate-rain");
    }
    if (searchedCity.weather.toString().includes("rain") == true && searchedCity.weather.toString().includes("drizzle") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("drizzle-rain");
    }
    if (searchedCity.weather.toString().includes("rain") == true && searchedCity.weather.toString().includes("thunder") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("thunder-rain");
    }
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
    if (response.weather[0].description.toString().includes("scattered") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("scattered-clouds");
    }
    if (response.weather[0].description.toString().includes("clouds") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("clouds");
    }
    if (response.weather[0].description.toString().includes("rain") == true && response.weather[0].description.toString().includes("moderate") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("moderate-rain");
    }
    if (response.weather[0].description.toString().includes("rain") == true && response.weather[0].description.toString().includes("drizzle") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("drizzle-rain");
    }
    if (response.weather[0].description.toString().includes("rain") == true && response.weather[0].description.toString().includes("thunder") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("thunder-rain");
    }
}

function removeOldCLassName() {
    var className = $("#current-weather").attr('class');

    $("#current-weather").removeClass(className);
}