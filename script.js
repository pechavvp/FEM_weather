import {saveFavoriteCities} from "./storage.js";
import {getFavoriteCities} from "./storage.js";
import {saveCurrentCity} from "./storage.js";
import {getCurrentCity} from "./storage.js";


let inputText = document.querySelector(".input_text");
const serverUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastServerUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
let button = document.querySelector(".input_button");
let likeButton = document.querySelector(".weather_block_show_like");
let favoritesList = document.querySelector(".locations_block_list_items");
let deleteFromFavoritesButtons;
let favoritesCityNames;
let favoriteCities = [];
let nowDegree = document.querySelector(".weather_block_show_degree");
let nowCity = document.querySelector(".weather_block_show_city");
let nowCityName = nowCity.innerHTML;
let nowIcon = document.querySelector(".weather_block_show_icon");

let menuNowButton = document.querySelector(".menu_now");
let menuDetailsButton = document.querySelector(".menu_details");
let menuForecastButton = document.querySelector(".menu_forecast");
let nowBlock = document.querySelector(".weather_block_now");
let detailsBlock = document.querySelector(".weather_block_details");
let forecastBlock = document.querySelector(".weather_block_forecast");

let detailsCity = document.querySelector(".weather_block_details_title_text");
let detailsTemp = document.querySelector(".details_temp");
let detailsFeelsLike = document.querySelector(".details_feels");
let detailsWeather = document.querySelector(".details_weather");
let detailsSunrise = document.querySelector(".details_sunrise");
let detailsSunset = document.querySelector(".details_sunset");

let forecastCity = document.querySelector(".weather_block_forecast_title_text");
let forecastList = document.querySelector(".weather_block_forecast_list_items");

button.addEventListener("click", function() {loadInfo(inputText.value)});
likeButton.addEventListener("click", addToFavorites);

menuDetailsButton.addEventListener("click", showDetailsBlock);

function showDetailsBlock() {
    nowBlock.style.display = "none";
    detailsBlock.style.display = "block";
    forecastBlock.style.display = "none";
    menuNowButton.classList.remove("menu_active");
    menuDetailsButton.classList.add("menu_active");
    menuForecastButton.classList.remove("menu_active");
}

menuForecastButton.addEventListener("click", showForecastBlock);

function showForecastBlock() {
    nowBlock.style.display = "none";
    detailsBlock.style.display = "none";
    forecastBlock.style.display = "block";
    menuNowButton.classList.remove("menu_active");
    menuDetailsButton.classList.remove("menu_active");
    menuForecastButton.classList.add("menu_active");
}

menuNowButton.addEventListener("click", showNowBlock);

function showNowBlock() {
    nowBlock.style.display = "block";
    detailsBlock.style.display = "none";
    forecastBlock.style.display = "none";
    menuNowButton.classList.add("menu_active");
    menuDetailsButton.classList.remove("menu_active");
    menuForecastButton.classList.remove("menu_active");
}

loadCurrentCity();

function loadCurrentCity() {
    let storageCurrentCity = getCurrentCity();
    if (storageCurrentCity === undefined) {
        loadInfo("Moscow");
    } else {
        loadInfo(storageCurrentCity);
    }
}

loadFavoritesList();

function loadFavoritesList() {
    favoriteCities = getFavoriteCities();
    favoriteCities.forEach(function(item) {addCityBlock(item)});
    loadInfoFromFavorites();
    deleteFromFavorites();
}

async function loadInfo(cityNameSource) {
    let cityName = cityNameSource;
    inputText.value = "";
    let url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
    let forecastUrl = `${forecastServerUrl}?q=${cityName}&appid=${apiKey}`;

    let outputInfo = await fetch(url)
    .then(response => response.json())
    .then(function(response) {
        if (response.cod === "400") {
            throw new Error("Enter city name!");
        } else if (response.cod === "404") {
            throw new Error("Incorrect city name!");
        } else {
            console.log(response);
            saveCurrentCity(cityName);
            nowDegree.innerHTML = `${tempInCels(response.main.temp)}&deg;`;
            nowCity.innerHTML = response.name;
            nowIcon.src = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`

            detailsCity.innerHTML = response.name;
            detailsTemp.innerHTML = `<b>Temperature:</b> ${tempInCels(response.main.temp)}&deg;`;
            detailsFeelsLike.innerHTML = `<b>Feels like:</b> ${tempInCels(response.main.feels_like)}&deg;`;
            detailsWeather.innerHTML = `<b>Weather</b>: ${response.weather[0].main}`;

            let correctTime = function(time) {return new Date(time*1000).toLocaleTimeString('en-GB')};

            detailsSunrise.innerHTML = `<b>Sunrise:</b> ${correctTime(response.sys.sunrise)}`;
            detailsSunset.innerHTML = `<b>Sunset:</b> ${correctTime(response.sys.sunset)}`;

            return response;
        }
    })
    .catch(err => alert(err.message));

    // console.log(outputInfo);

    let forecastInfo = await fetch(forecastUrl)
    .then(response => response.json())
    .then(function(response) {
        if (response.cod === "400") {
            throw new Error("Enter city name!");
        } else if (response.cod === "404") {
            throw new Error("Incorrect city name!");
        } else {
            console.log(response);
            forecastCity.innerHTML = response.city.name;
            forecastList.innerHTML = "";
            response.list.forEach(function(item) {
                addForecastItem(item);
            })
        }
    })
    .catch(err => console.log(err.message));    
}

function tempInCels(temp) {
    return Math.round(temp - 273.15)
};


function addForecastItem(item) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let dateFromItem = new Date(item.dt_txt);
    let forecastIconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    forecastList.insertAdjacentHTML("beforeend", 
    `
    <li class="weather_block_forecast_list_item">
        <p class="weather_block_forecast_date">${dateFromItem.getDate() + " " + monthNames[dateFromItem.getMonth()]}</p>
        <p class="weather_block_forecast_time">${dateFromItem.getHours() + ":" + (dateFromItem.getMinutes()<10?'0':'') + dateFromItem.getMinutes()}</p>
        <div class="weather_block_forecast_temp">
            <p class="weather_block_forecast_temp_fact">Temperature: ${tempInCels(item.main.temp)}&deg;</p>
            <p class="weather_block_forecast_temp_feels">Feels like: ${tempInCels(item.main.feels_like)}&deg;</p>
        </div>
        <div class="weather_block_forecast_weather">
            <p class="weather_block_forecast_weather_title">${item.weather[0].main}</p>
            <img class="weather_block_forecast_weather_icon" src=${forecastIconUrl} alt="icon">
        </div>
    </li>
    `);
}




function addToFavorites() {
    favoriteCities.push(nowCity.innerHTML);
    console.log(favoriteCities);

    saveFavoriteCities(favoriteCities);

    addCityBlock(nowCity.innerHTML);

    deleteFromFavorites();
    
    loadInfoFromFavorites();
}

function addCityBlock(cityName) {
    favoritesList.insertAdjacentHTML("afterbegin", 
    `<li class="locations_block_list_item"><p class="locations_block_list_item_cityname">${cityName}</p><div class="delete_icon"></div></li>`);
}

function loadInfoFromFavorites() {
    favoritesCityNames = document.querySelectorAll(".locations_block_list_item_cityname");
    favoritesCityNames.forEach(function(item) {
        item.addEventListener("click", function() {
            loadInfo(item.innerHTML);
        });
    });
}

function deleteFromFavorites() {
    deleteFromFavoritesButtons = document.querySelectorAll(".delete_icon");
    deleteFromFavoritesButtons.forEach(function(item) {
        item.addEventListener("click", deleteFromFavoritesEvent);
    });

    function deleteFromFavoritesEvent() {
        const indexOfDeleteCity = favoriteCities.indexOf(this.parentNode.firstChild.innerHTML);
        favoriteCities.splice(indexOfDeleteCity, 1);
        console.log(favoriteCities);

        saveFavoriteCities(favoriteCities);

        this.parentNode.parentNode.removeChild(this.parentNode);
    }
}