export function saveFavoriteCities(set) {
    localStorage.favoriteCitiesList = JSON.stringify([...set]);
}

export function getFavoriteCities() {
    let favoriteCitiesList = new Set(JSON.parse(localStorage.favoriteCitiesList));
    return favoriteCitiesList;
}

export function saveCurrentCity(cityName) {
    localStorage.currentCity = cityName;
}

export function getCurrentCity() {
    let currentCity = localStorage.currentCity;
    return currentCity;
}