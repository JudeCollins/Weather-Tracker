// create button to clear the city array
// add functionality to pull current location weather if no current city selected?

var cityList = [];
var id = "5859ec0dbfd9ff0a36abca355158892e";

// stores cityList in localStorage
function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cityList));
}

// adds last searched city to list-group as button for user to select city
function createCityList(){
    $(".cityList").empty();
    cityList.forEach(function(city) {
        $(".cityList").prepend($(`<button class="list-group-item list-group-item-action cityButton" data-city="${city}">${city}</button>`));
    })
}

// loads cityList from local storage and calls api to get data for last searched city if it exists
function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        cityList = storedCities;
    }

    createCityList();

    if (cityList) {
        var thisCity = cityList[cityList.length - 1]
        getCurrentWeather(thisCity, id);
        getForecast(thisCity, id);
    }
}

// gets current forecast for selected city and calls uv index function
function getCurrentWeather(thisCity, id) {
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${thisCity}&units=imperial&appid=${id}`;
    var cityLat;
    var cityLong;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (data) {
        $(".cityToday").append(
            `<div class="row ml-1">
                <h3 class="mr-3">${data.name} (${(new Date(1000 * data.dt).getUTCMonth()) + 1}/${(new Date(1000 * data.dt).getUTCDate()) - 1}/${new Date(1000 * data.dt).getUTCFullYear()})</h3>
                <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
            </div>`
        )
        $(".cityToday").append(`<p>Temperature: ${data.main.temp} &degF</p>`)
        $(".cityToday").append(`<p>Humidity: ${data.main.humidity} %</p>`)
        $(".cityToday").append(`<p>Wind: ${data.wind.speed} mph</p>`)
        cityLat = data.coord.lat;
        cityLong = data.coord.lon;
        getUVI(id, cityLat, cityLong);
    })

}

// gets 5 day forecast for selected city
function getForecast(thisCity, id) {
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${thisCity}&units=imperial&appid=${id}`;

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (data) {
        for (i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.search("15:00:00") != -1) {
                var forecastDate = data.list[i];
                $(".forecast").append(
                    `<div class="card bg-primary shadow m-4">
                        <div class="card-body">
                            <h4 class="card-title">${(new Date(1000 * forecastDate.dt).getUTCMonth()) + 1}/${new Date(1000 * forecastDate.dt).getUTCDate()}/${new Date(1000 * forecastDate.dt).getUTCFullYear()}</h4>
                            <div class="card-text">
                                <img src="http://openweathermap.org/img/w/${forecastDate.weather[0].icon}.png">
                                <p class="card-text">Temp: ${forecastDate.main.temp} &degF</p>
                                <p class="card-text">Humidity: ${forecastDate.main.humidity} %</p>
                            </div>
                        </div>
                    </div>`
                );
            }
        }

    })
}
