let inputText = document.querySelector(".input_text");
const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
let button = document.querySelector(".input_button");
button.addEventListener("click", loadInfo);

let nowDegree = document.querySelector(".weather_block_show_degree");
let nowCity = document.querySelector(".weather_block_show_city");
let nowIcon = document.querySelector(".weather_block_show_icon");

async function loadInfo() {
    let cityName = inputText.value;
    let url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

    let outputInfo = await fetch(url)
    .then(response => response.json());
    console.log(outputInfo);
    
    let tempInCels = Math.round(outputInfo.main.temp - 273.15);
    nowDegree.innerHTML = `${tempInCels}&deg;`;
    nowCity.innerHTML = outputInfo.name;
    nowIcon.src = `http://openweathermap.org/img/wn/${outputInfo.weather[0].icon}@2x.png`
}