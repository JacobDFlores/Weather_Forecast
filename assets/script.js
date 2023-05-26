const apiKey = "0e88f92c6cc3d7bd0a9eb9aca9366e2c";
const today = dayjs();
//I'm using dayjs to keep track of the current day, and the next five days.
var searchHistory = JSON.parse(localStorage.getItem("city")) || [];
var cityName = "";

//takes the name that was in the search field and adds it to local storage
function addNameToHistory(city){

    //this checks to make sure we arent adding a duplicate name to the array
    if (!searchHistory.includes(city)){
        searchHistory.push(city);
        localStorage.setItem("city", JSON.stringify(searchHistory));
    }

    updateHistory();

    return;
}

//Makes the list of buttons for past searches that were saved locally
function updateHistory(){

    //this loop makes sure there are no duplicates in the list
    var searchList = document.getElementById('searchHistoryButtons')
    while(searchList.firstChild){
        searchList.firstChild.remove();
    }

    for (i=0; i < searchHistory.length; i++){
        var newSearch = "<button>" + searchHistory[i] + "</button>"
        $('#searchHistoryButtons').append(newSearch);
    }

    //this sets the "search" value to whatever the clicked button's value is
    $('#searchHistoryButtons').children().on("click", function(){
        $('#search').val(($(this).html()));
        $('.page').removeAttr('style');
        getApiData();
    });

    return;
}

//Uses the current weather data to update the Current weather panel
function updateCurrentWeather(apiObject){
    console.log(apiObject);

    var imgUrl = 'https://openweathermap.org/img/wn/' + apiObject.weather[0].icon + '@2x.png';
    
    $('#cityTitle').html(apiObject.name + " ");
    $('#today').html(today.format('MM/DD/YYYY') + " ");
    $('#weatherImg').attr("src", imgUrl);
    $('#temp').html("Temp: " + apiObject.main.temp + "\u00B0" + "F");
    $('#wind').html("Wind: " + apiObject.wind.speed + " MPH");
    $('#humidity').html("Humidity: " + apiObject.main.humidity + " %");

    return;
}

//Uses the five day weather data to update the five corresponding weather cards
function updateFiveDayForecast(apiObject){
    console.log(apiObject);

    var dayIndex = 1;
    for (var i = 0; i < apiObject.list.length; i+=8){

        var imgUrl = 'https://openweathermap.org/img/wn/' + apiObject.list[i].weather[0].icon + '@2x.png';
        var thisDay = today.add(dayIndex, "day");

        $('.fiveDayRow').children().eq(dayIndex - 1).children().eq(0).html(thisDay.format('MM/DD/YYYY'));
        $('.fiveDayRow').children().eq(dayIndex - 1).children().eq(1).attr("src", imgUrl);
        $('.fiveDayRow').children().eq(dayIndex - 1).children().eq(2).children().eq(0).html("Temp: " + apiObject.list[i].main.temp + "\u00B0" + "F");
        $('.fiveDayRow').children().eq(dayIndex - 1).children().eq(2).children().eq(1).html("Wind: " + apiObject.list[i].wind.speed + " MPH");
        $('.fiveDayRow').children().eq(dayIndex - 1).children().eq(2).children().eq(2).html("Humidity: " + apiObject.list[i].main.humidity + " %");

        dayIndex++;
    }
    
    return;
}

//Fetches the current weather data
function getCurrentWeather(apiUrl){
    
    fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {

      updateCurrentWeather(data);
    })
    .catch(function (error) {
      console.error(error);
    });

    return;
}

//Fetches the data for the next five days
function getFiveDayForecast(apiUrl){

    fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {

      updateFiveDayForecast(data);
    })
    .catch(function (error) {
      console.error(error);
    });
    return;
}

//Takes the value in the search field and uses it to call two APIs
//The first API gets the current weather data
//The second API gets the data for the next five days
function getApiData(){
    if (!$('#search').val()) {
        console.error('You need a search input value!');
        return;
      }
    cityName = $('#search').val();
    addNameToHistory(cityName);
    console.log(cityName);
    const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    const fiveDayForecastAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;
    getCurrentWeather(currentWeatherAPI);
    getFiveDayForecast(fiveDayForecastAPI);

    return;
}

//When document loads, the functionality is active
//When the button is clicked then the weather data is displayed
$(document).ready(function(){

    if (searchHistory.length > 0){
        updateHistory();
    }

    $('#searchButton').on("click", function(){
        $('.page').removeAttr('style');
        getApiData();
    });

});
