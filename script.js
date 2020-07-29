var errorText = $("<p>");
errorText.attr("class", "error-text");
errorText.text("Please enter a valid city name!");
errorText.hide();

var cityListTable = $("<table>");
cityListTable.attr("class", "table table-bordered table-light");

var tbody = $("<tbody>");
var image = "";

var cityName = $("<h3>");
cityName.attr("class", "white-text city-name bold_text outlined-text");

var temperature = $("<h5>");
temperature.attr("class", "white-text city-name bold_text outlined-text");

var humidity = $("<h5>");
humidity.attr("class", "white-text city-name bold_text outlined-text");
var wind_speed = $("<h5>");
wind_speed.attr("class", "white-text city-name bold_text outlined-text");
var uv_index = $("<h5>");
uv_index.attr("class", "white-text city-name bold_text outlined-text uv");

var searchedCityList = [];
var userSearchResultList = [];
var userSearch5DayResultList = [];

var userSearchResultList5Days = [];

var fiveDayForcast = [];
var formatedDate = "";


$(document).ready(function () {

    if (localStorage.getItem('UserSearchCityList') === null) {
        // Create search input field and button to make api call and get weather data 
        createCitySearchElements();
    } else {
        reloadWeatherDataFromLocalStorage();
    }
});

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

    uv_index.text("UV Index: " + searchedCityData.uv_index);
    $("#current-weather").append(uv_index);

    getImageUrlFromLocalStorage(searchedCityData);
}

function createCitySearchElements() {

    var searchLabel = $("<h4>");
    searchLabel.attr("class", "search-label");
    searchLabel.text("Search for a city:");

    var form = $("<form>");
    form.attr("class", "form-inline");

    var inputSearch = $("<INPUT>");
    inputSearch.attr("class", "form-control mr-sm-1");
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

    var clearButton = $("<button>");
    clearButton.attr("class", "btn btn-outline-light my-1 my-sm-0");
    clearButton.attr("type", "button");
    clearButton.attr("onclick", "clearData()");
    clearButton.attr("value", "Clear");
    clearButton.text("Clear");

    form.append(searchLabel);
    form.append(inputSearch);
    form.append(searchButton);
    form.append(clearButton);
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
    getCity5DaysWeatherForcast(userInput);
    $("#search-input").val("");
}

function clearData() {
    if (localStorage.getItem('UserSearchCityList') != null) {
        // Else fetch the existing array from local storage 
        localStorage.removeItem("UserSearchCityList");

        location.reload();
    }
    if (localStorage.getItem('UserSearchResultList5Days') != null) {
        // Else fetch the existing array from local storage 
        localStorage.removeItem("UserSearchResultList5Days");

        location.reload();
    }
}

function getCityWeatherDataFromAPI(searchedCity) {
    // de1c7e7fa6f22edc2d1211e63b352b58

    // Constructing a URL
    var apiKey = "de1c7e7fa6f22edc2d1211e63b352b58";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apiKey}&units=imperial`

    // Performing our AJAX GET request
    $.ajax({
        url: queryURL,
        method: "GET",
        statusCode: {
            404: function () {
                displaySearchErrorText();
            }
        }
    })
        // After the data comes back from the API
        // After the data comes back from the API
        .then(function (response) {
            // Storing an array of results in the results variable

            var uvindex = getUVIndex(response.coord);

            addResponseToLocalStorage(response, uvindex);
            // getImageUrl(response);
            addSearchedCityToTable(response.name);
            displaySearchCityWeatherData(response, uvindex);

            console.log(response);

        });
}

function getCity5DaysWeatherForcast(userInput) {

    // Constructing a URL
    var apiKey = "de1c7e7fa6f22edc2d1211e63b352b58";
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${apiKey}&units=imperial`

    // Performing our AJAX GET request
    $.ajax({
        url: queryURL,
        method: "GET",
        statusCode: {
            404: function () {
                // displaySearchErrorText();
            }
        }
    })

        // After the data comes back from the API
        .then(function (response) {
            // Storing an array of results in the results variable



            // // getImageUrl(response);
            // addSearchedCityToTable(response.name);
            // displaySearchCityWeatherData(response);


            for (var i = 0; i < response.list.length; i++) {
                if (i % 9 == 0) {
                    formatedDate = moment(response.list[i].dt_txt, 'YYYY-MM-DD').format('DD/MM/YYYY').toString();

                    fiveDayForcast.push({
                        date: formatedDate,
                        icon: response.list[i].weather[0].icon,
                        temp: response.list[i].main.temp,
                        humidity: response.list[i].main.humidity
                    })
                }
            }

            console.log(fiveDayForcast);
            add5DayForecastToLocalStorage(userInput, fiveDayForcast);
            fiveDayForcast = [];
            display5DayWeatherForecast(userInput);
        });
}

function display5DayWeatherForecast(city) {

    var UserSearchResultList5Days = JSON.parse(localStorage.getItem('UserSearchResultList5Days'));

    for (var i = 0; i < UserSearchResultList5Days.length; i++) {

        if (UserSearchResultList5Days[i].key == city) {

            var fiveDayWeatherList = UserSearchResultList5Days[i].fiveDayWeather;

            for (var j = 0; j < fiveDayWeatherList.length; j++) {

                if (j == 0) {
                    console.log(fiveDayWeatherList[j].icon);
                    console.log(fiveDayWeatherList[j]);
                    $("#five-date-0").text("\n\n" +
                        "Date: " + fiveDayWeatherList[j].key + "\nTemperature: " + fiveDayWeatherList[j].temp + "\n" + "\nHumidity: " + fiveDayWeatherList[j].humidity);
                    $(`#img-0`).attr("src", `http://openweathermap.org/img/wn/${fiveDayWeatherList[j].weather_icon}@2x.png`);
                }

                if (j == 1) {
                    $("#five-date-1").text("\n\n" +
                        "Date: " + fiveDayWeatherList[j].key + "\nTemperature: " + fiveDayWeatherList[j].temp + "\n" + "\nHumidity: " + fiveDayWeatherList[j].humidity);
                    $(`#img-1`).attr("src", `http://openweathermap.org/img/wn/${fiveDayWeatherList[j].weather_icon}@2x.png`);
                }

                if (j == 2) {
                    $("#five-date-2").text("\n\n" +
                        "Date: " + fiveDayWeatherList[j].key + "\nTemperature: " + fiveDayWeatherList[j].temp + "\n" + "\nHumidity: " + fiveDayWeatherList[j].humidity);
                    $(`#img-2`).attr("src", `http://openweathermap.org/img/wn/${fiveDayWeatherList[j].weather_icon}@2x.png`);
                }

                if (j == 3) {
                    $("#five-date-3").text("\n\n" +
                        "Date: " + fiveDayWeatherList[j].key + "\nTemperature: " + fiveDayWeatherList[j].temp + "\n" + "\nHumidity: " + fiveDayWeatherList[j].humidity);
                    $(`#img-3`).attr("src", `http://openweathermap.org/img/wn/${fiveDayWeatherList[j].weather_icon}@2x.png`);
                }

                if (j == 4) {
                    $("#five-date-4").text("\n\n" +
                        "Date: " + fiveDayWeatherList[j].key + "\nTemperature: " + fiveDayWeatherList[j].temp + "\n" + "\nHumidity: " + fiveDayWeatherList[j].humidity);
                    $(`#img-4`).attr("src", `http://openweathermap.org/img/wn/${fiveDayWeatherList[j].weather_icon}@2x.png`);
                }
            }
        }
    }
}

function getUVIndex(coord) {
    let lat = coord.lat;
    let lon = coord.lon;
    var apiKey = "de1c7e7fa6f22edc2d1211e63b352b58";
    var uvURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    var uv = "";
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.current.uvi);

        var uv = response.current.uvi;

        if (uv < 3) {
            uv_index.text("UV Index: " + response.current.uvi);
            uv_index.attr("style", "color: rgb(0, 190, 0);");
        } else if (uv > 5) {
            uv_index.text("UV Index: " + response.current.uvi);
            uv_index.attr("style", "color: rgb(212, 7, 7);");
        } else {
            uv_index.text("UV Index: " + response.current.uvi);
            uv_index.attr("style", "color: yellow;");
        }


        $("#current-weather").append(uv_index);
    });
}

function addResponseToLocalStorage(response, uvindex) {
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
            wind_speed: response.wind.speed,
            uv_index: uvindex
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
                wind_speed: response.wind.speed,
                uv_index: uvindex
            })
            // Create a new array in local storage if doesn't exist 
            // Create a new array in local storage if doesn't exist 
            // Create a new array in local storage if doesn't exist 
            localStorage.setItem('UserSearchCityList', JSON.stringify(userSearchResultList));
        }

        // If the array existing and is not empty, push an object onto the array 
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
                wind_speed: response.wind.speed,
                uv_index: uvindex
            });
            localStorage.setItem('UserSearchCityList', JSON.stringify(userSearchResultList));
            console.log(UserSearchCityList);
        }

    }
}

function add5DayForecastToLocalStorage(city, fiveDayForcast) {
    // for (var i = 0; i < userSearchResultList.length; i++) {
    var UserSearchResultList5Days = [];
    var FiveDayWeather = [];

    if (localStorage.getItem('UserSearchResultList5Days') === null) {
        fiveDayForcast.forEach(forcast => {
            FiveDayWeather.push({
                key: forcast.date,
                humidity: forcast.humidity,
                weather_icon: forcast.icon,
                temp: forcast.temp
            })
        });

        userSearch5DayResultList.push({
            key: city,
            fiveDayWeather: FiveDayWeather
        })
        localStorage.setItem('UserSearchResultList5Days', JSON.stringify(userSearch5DayResultList));

    } else {
        // Else fetch the existing array from local storage 
        UserSearchResultList5Days = JSON.parse(localStorage.getItem('UserSearchResultList5Days'));

        // If the array existing and is not empty, push an object onto the array 
        if (UserSearchResultList5Days.length != 0 && userSearch5DayResultList.length != 0) {
            for (var i = 0; i < userSearch5DayResultList.length; i++) {
                if (userSearch5DayResultList[i].key == city) {
                    userSearch5DayResultList.splice(i, 1);
                }
            }
            fiveDayForcast.forEach(forcast => {
                FiveDayWeather.push({
                    key: forcast.date,
                    humidity: forcast.humidity,
                    weather_icon: forcast.icon,
                    temp: forcast.temp
                })
            });

            userSearch5DayResultList.push({
                key: city,
                fiveDayWeather: FiveDayWeather
            })
            localStorage.setItem('UserSearchResultList5Days', JSON.stringify(userSearch5DayResultList));
            console.log(UserSearchResultList5Days);
        }

    }
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
        cityNameEntry.click(function () {
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

    var searchedCity = savedUserSearchList.find(item => (item.key === userSelection));
    console.log(searchedCity);

    displaySearchCityWeatherDataFromLocalStorage(searchedCity);
}

function displaySearchCityWeatherDataFromLocalStorage(searchedCity) {

    cityName.text(searchedCity.key);

    var currentDate = moment().format('MMMM Do YYYY');

    cityName.append("  (" + currentDate + ")");
    $("#current-weather").append(cityName);

    temperature.text("Temperature: " +
        searchedCity.temp + " \xB0F");
    $("#current-weather").append(temperature);

    humidity.text("Humidity: " + searchedCity.humidity + "%");
    $("#current-weather").append(humidity);

    wind_speed.text("Wind Speed: " + searchedCity.wind_speed + " MPH");
    $("#current-weather").append(wind_speed);

    uv_index.text("UV Index: " + searchedCity.uv_index);
    $("#current-weather").append(uv_index);

    getImageUrlFromLocalStorage(searchedCity);
}


function displaySearchCityWeatherData(response) {

    cityName.text(response.name);

    var currentDate = moment().format('MMMM Do YYYY');

    cityName.append("  (" + currentDate + ")");
    $("#current-weather").append(cityName);

    temperature.text("Temperature: " +
        response.main.temp + " \xB0F");
    $("#current-weather").append(temperature);

    humidity.text("Humidity: " + response.main.humidity + "%");
    $("#current-weather").append(humidity);

    wind_speed.text("Wind Speed: " + response.wind.speed + " MPH");
    $("#current-weather").append(wind_speed);

    getImageUrl(response);
}


function getImageUrlFromLocalStorage(searchedCity) {
    if (searchedCity.weather.toString().toLowerCase().includes("clear") == true) {
        $("#current-weather").addClass("clear-sky");
    } else if (searchedCity.weather.toString().toLowerCase().includes("mist") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("mist");
    } else if (searchedCity.weather.toString().toLowerCase().includes("haze") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("mist");
    } else if (searchedCity.weather.toString().toLowerCase().includes("scattered") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("scattered-clouds");
    } else if (searchedCity.weather.toString().toLowerCase().includes("clouds") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("clouds");
    } else if (searchedCity.weather.toString().toLowerCase().includes("little") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("drizzle-rain");
    } else if (searchedCity.weather.toString().toLowerCase().includes("rain") == true && searchedCity.weather.toString().toLowerCase().includes("light") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("drizzle-rain");
    } else if (searchedCity.weather.toString().toLowerCase().includes("rain") == true && searchedCity.weather.toString().toLowerCase().includes("moderate") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("moderate-rain");
    } else if (searchedCity.weather.toString().toLowerCase().includes("rain") == true && searchedCity.weather.toString().toLowerCase().includes("drizzle") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("drizzle-rain");
    } else if (searchedCity.weather.toString().toLowerCase().includes("rain") == true && searchedCity.weather.toString().toLowerCase().includes("thunder") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("thunder-rain");
    }
}

function getImageUrl(response) {
    if (response.weather[0].description.toString().toLowerCase().includes("clear") == true) {
        $("#current-weather").addClass("clear-sky");
    } else if (response.weather[0].description.toString().toLowerCase().includes("mist") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("mist");
    } else if (response.weather[0].description.toString().toLowerCase().includes("haze") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("mist");
    } else if (response.weather[0].description.toString().toLowerCase().includes("scattered") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("scattered-clouds");
    } else if (response.weather[0].description.toString().toLowerCase().includes("clouds") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("clouds");
    } else if (response.weather[0].description.toString().toLowerCase().includes("little") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("drizzle-rain");
    } else if (response.weather[0].description.toString().toLowerCase().includes("rain") == true && response.weather[0].description.toString().toLowerCase().includes("light") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("drizzle-rain");
    } else if (response.weather[0].description.toString().toLowerCase().includes("rain") == true && response.weather[0].description.toString().toLowerCase().includes("moderate") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("moderate-rain");
    } else if (response.weather[0].description.toString().toLowerCase().includes("rain") == true && response.weather[0].description.toString().toLowerCase().includes("drizzle") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("drizzle-rain");
    } else if (response.weather[0].description.toString().toLowerCase().includes("rain") == true && response.weather[0].description.toString().toLowerCase().includes("thunder") == true) {

        removeOldCLassName();
        $("#current-weather").addClass("thunder-rain");
    }
}

function removeOldCLassName() {
    var className = $("#current-weather").attr('class');

    $("#current-weather").removeClass(className);
}