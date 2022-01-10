import {saveFavoriteCities} from "./storage.js";
import {getFavoriteCities} from "./storage.js";
import {saveCurrentCity} from "./storage.js";
import {getCurrentCity} from "./storage.js";


let inputText = document.querySelector(".input_text");
const serverUrl = 'https://api.openweathermap.org/data/2.5/weather';
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

button.addEventListener("click", function() {loadInfo(inputText.value)});
likeButton.addEventListener("click", addToFavorites);

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

    let outputInfo = await fetch(url)
    .then(response => response.json())
    .then(function(response) {
        if (response.cod === "400") {
            throw new Error("Enter city name!");
        } else if (response.cod === "404") {
            throw new Error("Incorrect city name!");
        } else {
            saveCurrentCity(cityName);
            let tempInCels = Math.round(response.main.temp - 273.15);
            nowDegree.innerHTML = `${tempInCels}&deg;`;
            nowCity.innerHTML = response.name;
            nowIcon.src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
            return response;
        }
    })
    .catch(err => alert(err.message));

    // console.log(outputInfo);
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