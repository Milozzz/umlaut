/*
main javascript file
writer: Hao Zhang
*/


// main cities and its positions
city = ['sydney', 'brisbane', 'melbourne', 'snowyMountains'];
position = [{lat:'-33.8688',lon:'151.2093'}, {lat:'-27.4698',lon:'153.0251'}, {lat:'-37.8136',lon:'144.9631'}, {lat:'-36.5000',lon:'148.3333'}]

var degree = '\u00b0'; // the degree symbol
var currentCity = 0;

// initial latitude and longitude
var lat = '-33.8688';
var lon = '151.2093';
var apiWeather = 'http://api.openweathermap.org/data/2.5/weather?' +
    'lat=' + lat + '&' + 'lon=' + lon +
    '&appid=48ae69462f10bb1d0ce46e5ef9bfb1a4';
var apiForecast = 'http://api.openweathermap.org/data/2.5/forecast?' +
    'lat=' + lat + '&' + 'lon=' + lon +
    '&appid=48ae69462f10bb1d0ce46e5ef9bfb1a4';


// click the right button, turn to another city.
function rightButton() {
    lat = position[(currentCity + 1)%4].lat;
    lon = position[(currentCity + 1)%4].lon;
    currentCity += 1;
    apiWeather = 'http://api.openweathermap.org/data/2.5/weather?' +
        'lat=' + lat + '&' + 'lon=' + lon +
        '&appid=48ae69462f10bb1d0ce46e5ef9bfb1a4';
    apiForecast = 'http://api.openweathermap.org/data/2.5/forecast?' +
        'lat=' + lat + '&' + 'lon=' + lon +
        '&appid=48ae69462f10bb1d0ce46e5ef9bfb1a4';
    getWeather(); // call the api again to get another city's information
}

function leftButton() {
    lat = position[(currentCity - 1)%4].lat;
    lon = position[(currentCity - 1)%4].lon;
    currentCity -= 1;
    apiWeather = 'http://api.openweathermap.org/data/2.5/weather?' +
        'lat=' + lat + '&' + 'lon=' + lon +
        '&appid=48ae69462f10bb1d0ce46e5ef9bfb1a4';
    apiForecast = 'http://api.openweathermap.org/data/2.5/forecast?' +
        'lat=' + lat + '&' + 'lon=' + lon +
        '&appid=48ae69462f10bb1d0ce46e5ef9bfb1a4';
    getWeather();
}

// unit transfer, from kelvins to degree centigrade
function kftransfer(t) {
  var c = Math.round(c = t - 273.15) ;
  return c
}

// according to the weather, choose the right image.
function weatherPic(id, weatherIcon) {
    if(id.startsWith('2')){
        weatherIcon = 'images/thunderStorm.png';
    }
    else if(id.startsWith('5'))
    {
        weatherIcon = 'images/rain.png';
    }
    else if(id.startsWith('6'))
    {
        weatherIcon = 'images/snow.png';
    }
    else if(id === '800')
    {
        weatherIcon = 'images/sunny.png';
    }
    else if(id.startsWith('8'))
    {
        weatherIcon = 'images/cloudy.png';
    }
    return weatherIcon
}

// call the current weather api and future weather api to get information
function getWeather() {
    // call api
    $.getJSON(apiWeather, currentWeather);
    $.getJSON(apiForecast, addData);

    // get current weather
    function currentWeather(weatherData) {
        var cityName = city[(currentCity + 1)%4];
        var weatherId = (weatherData.weather[0].id).toString();
        var weatherIcon = 0;
        var weatherMain = weatherData.weather[0].main;
        var description = weatherData.weather[0].description;
        var mainTemp = kftransfer(weatherData.main.temp);
        var tempMin = kftransfer(weatherData.main.temp_min);
        var tempMax = kftransfer(weatherData.main.temp_max);
        $('#location').html(cityName);
        $('#weatherResponse').append(cityName, weatherMain, description);
        $('#mainTemp').html(mainTemp + degree);
        $('#tempInterval').html(tempMin + degree + '\xa0\xa0\xa0\xa0\xa0\xa0' + tempMax + degree);
        $('#weatherDescription').html(description);

        weatherIcon = weatherPic(weatherId, weatherIcon);
        $('#weatherIcon').attr("src", weatherIcon);
            }

    // get one week weather
    function addData(forecastData) {
        console.log(forecastData);
        var week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        var i = 0;
        for(var i=0;i<5;i++) {
            var weatherIcon = 0;
            var weatherId = (forecastData.list[i].weather[0].id).toString();
            if(i===4) {
                var tempMin = kftransfer(Math.min(forecastData.list[i].main.temp_min,
                    forecastData.list[i * 8 + 1].main.temp_min,
                    forecastData.list[i * 8 + 2].main.temp_min,
                    forecastData.list[i * 8 + 3].main.temp_min,
                    forecastData.list[i * 8 + 4].main.temp_min));
                var tempMax = kftransfer(Math.max(forecastData.list[i].main.temp_max,
                    forecastData.list[i * 8 + 1].main.temp_max,
                    forecastData.list[i * 8 + 2].main.temp_max,
                    forecastData.list[i * 8 + 3].main.temp_max,
                    forecastData.list[i * 8 + 4].main.temp_max))
            }
            else {
                var tempMin = kftransfer(Math.min(forecastData.list[i].main.temp_min,
                    forecastData.list[i * 8 + 1].main.temp_min,
                    forecastData.list[i * 8 + 2].main.temp_min,
                    forecastData.list[i * 8 + 3].main.temp_min,
                    forecastData.list[i * 8 + 4].main.temp_min,
                    forecastData.list[i * 8 + 5].main.temp_min,
                    forecastData.list[i * 8 + 6].main.temp_min));
                var tempMax = kftransfer(Math.max(forecastData.list[i].main.temp_max,
                    forecastData.list[i * 8 + 1].main.temp_max,
                    forecastData.list[i * 8 + 2].main.temp_max,
                    forecastData.list[i * 8 + 3].main.temp_max,
                    forecastData.list[i * 8 + 4].main.temp_max,
                    forecastData.list[i * 8 + 5].main.temp_max,
                    forecastData.list[i * 8 + 6].main.temp_max));
            }
            console.log(tempMin, tempMax);
            var weatherIcon = weatherPic(weatherId, weatherIcon);
            picId = '#' + week[i];
            tempId = picId + 'Temp';
            $(picId).attr("src", weatherIcon);
            $(tempId).html(tempMax + '/' + tempMin);
        }
    }


}







