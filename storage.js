export function saveFavoriteCities(arr) {
    localStorage.favoriteCitiesList = JSON.stringify(arr);
}

export function getFavoriteCities() {
    let favoriteCitiesList = JSON.parse(localStorage.favoriteCitiesList);
    return favoriteCitiesList;
}

export function saveCurrentCity(cityName) {
    localStorage.currentCity = cityName;
}

export function getCurrentCity() {
    let currentCity = localStorage.currentCity;
    return currentCity;
}