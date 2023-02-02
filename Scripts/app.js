//Navbar
const navLinksDiv = document.querySelector('.navLinks');
const navLinkAnchors = document.querySelectorAll('.navLink');
const toggleButton = document.querySelector('.toggleButton');
const navSearchBarForm = document.querySelector('.navSearchBarForm');
const navSearchBarInp = document.querySelector('#navSearchBar');

const searchBar = document.querySelector('.searchBar');
const searchBarInp = document.querySelector('#searchBar');

//Section One
const secOne = document.querySelector('.secOne');
const dateAndTimeSpan = document.querySelector('.dateAndTimeSpan');
const nameSpan = document.querySelector('.name');
const countrySpan = document.querySelector('.country');
const tempSpan = document.querySelector('.temp');
const feelsLikeSpan = document.querySelector('.feelsLike');
const descriptionSpan = document.querySelector('.description');
const minTempSpan = document.querySelector('.minTemp');
const maxTempSpan = document.querySelector('.maxTemp');
const visibilitySpan = document.querySelector('.visibility');
const windSpeedSpan = document.querySelector('.windSpeed');
const humiditySpan = document.querySelector('.humidity');
const pressureSpan = document.querySelector('.pressure');
const sunriseSpan = document.querySelector('.sunrise');
const sunsetSpan = document.querySelector('.sunset');

const bigIconImg = document.querySelector('.icon');
const iconDesctiptionSpan = document.querySelector('.iconDescription');

const cityImg = document.querySelector('.cityImg');

const WeatherAPIkey = '7f05e495c1f55495ab79b16aaf8992ed';
const GooglePlacesAPIkey = 'AIzaSyBRCWY8MnapiB8mVojIN5b32SRSjY0n4n0';
const limit = 1;
let lat, lon;
let responceObj;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTime(unixTimeUTC) {
    const date = new Date(unixTimeUTC * 1000);
    const timeStr = date.toLocaleTimeString(`en-GB`).slice(0, 5);
    return timeStr;
}

function getTimeAndDate(unixTimeUTC) {
    const date = new Date(unixTimeUTC * 1000);
    const timeStr = date.toLocaleTimeString(`en-GB`).slice(0, 5);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Intl.DateTimeFormat('en-GB', options).format(date);
    return `Last Updated: ${dateStr}, ${timeStr}`;
}

function formatForPhotoAPI(string) {
    return string.toLowerCase().split(' ').join('-');
}

const getAndSetLatLon = async (cityName, usedSearchBar) => {
    if (usedSearchBar === 'navSearchBarForm' && navSearchBarForm.elements.city.value !== '') cityName = navSearchBarForm.elements.city.value;
    else if (usedSearchBar === 'searchBar' && searchBar.elements.city.value !== '') cityName = searchBar.elements.city.value;
    else cityName = 'Tbilisi';
    try {
        const res = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${WeatherAPIkey}`);
        lat = res.data[0].lat;
        lon = res.data[0].lon;
    } catch (e) {
        console.log('Error During Getting LAT/LON Data!', e)
    }
}

const fetchCurrWeather = async () => {
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WeatherAPIkey}&units=metric`);
        return res.data;
    } catch (e) {
        console.log(`No Weather Data Available!`, e);
    }
}

const fetchPhotoObject = async (cityName) => {
    try {
        const res = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${cityName}/images/`);
        return res.data;
    } catch (e) {
        console.log(`No City Photo Available!`, e);
        cityImg.src = ''
    }
}
//AIzaSyAyT1s-XWaXkwHOampaY8iU-mDUwsMyRnE

//API_KEY for Google Places:
//AIzaSyBRCWY8MnapiB8mVojIN5b32SRSjY0n4n0
//for reference
//https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Chicago&key=AIzaSyBRCWY8MnapiB8mVojIN5b32SRSjY0n4n0&inputtype=textquery&fields=name,photos
//for photo
//
async function updateCurrWeatherInfo(usedSearchBar) {
    let cityName;
    if (usedSearchBar === 'navSearchBarForm' && navSearchBarForm.elements.city.value !== '') cityName = navSearchBarForm.elements.city.value;
    else if (usedSearchBar === 'searchBar' && searchBar.elements.city.value !== '') cityName = searchBar.elements.city.value;
    else cityName = 'tbilisi';
    cityImg.alt = `An image of the city of ${capitalizeFirstLetter(cityName)}`;
    await getAndSetLatLon(capitalizeFirstLetter(cityName), usedSearchBar);
    responceObj = await fetchCurrWeather();
    const { dt: unixTimeUTC, sys: { country, sunrise, sunset }, visibility, wind: { speed }, main: { temp, humidity, pressure, feels_like: feelsLike } } = responceObj;
    const description = capitalizeFirstLetter(responceObj.weather[0].description);
    const main = responceObj.weather[0].main;
    const icon = responceObj.weather[0].icon;
    dateAndTimeSpan.innerText = getTimeAndDate(unixTimeUTC);
    nameSpan.innerText = capitalizeFirstLetter(cityName);
    countrySpan.innerText = country;
    tempSpan.innerText = temp;
    feelsLikeSpan.innerText = feelsLike;
    descriptionSpan.innerText = description;
    visibilitySpan.innerText = visibility;
    windSpeedSpan.innerText = speed;
    humiditySpan.innerText = humidity;
    pressureSpan.innerText = pressure;
    sunriseSpan.innerText = getTime(sunrise);
    sunsetSpan.innerText = getTime(sunset);
    bigIconImg.src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
    bigIconImg.alt = `Icon of ${main} weather`;
    iconDesctiptionSpan.innerText = `${main}`;
    
    cityPhotoResObj = await fetchPhotoObject(formatForPhotoAPI(cityName));
    const webCityPhotoUrl = cityPhotoResObj.photos[0].image.web;
    // const mobileCityPhotoUrl = cityPhotoResObj.photos[0].image.mobile;
    cityImg.src = webCityPhotoUrl;
}

// Start of execution:
updateCurrWeatherInfo();

//Event Listeners
navSearchBarForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    await updateCurrWeatherInfo('navSearchBarForm');
});

searchBar.addEventListener('submit', async function (e) {
    e.preventDefault();
    await updateCurrWeatherInfo('searchBar');
});

toggleButton.addEventListener('click', () => {
    navLinksDiv.classList.toggle('active');
})