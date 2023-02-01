//Navbar
const navLinksDiv = document.querySelector('.navLinks');
const navLinkAnchors = document.querySelectorAll('.navLink');
const toggleButton = document.querySelector('.toggleButton');
const navSearchBarForm = document.querySelector('.navSearchBarForm');
const navSearchBarInp = document.querySelector('#navSearchBar');

const searchBar = document.querySelector('.searchBar');
const searchBarInp = document.querySelector('#searchBar');

const WeatherAPIkey = '7f05e495c1f55495ab79b16aaf8992ed';
const limit = 1;
let lat, lon;
let responceObj;

//Section Two
const secTwo = document.querySelector('.secTwo');
const selectPanelBtn = document.querySelector('.selectPanelBtn');
const panelBtnsDiv = document.querySelector('.panelBtnsDiv');
const panelBtns = document.querySelectorAll('.panelBtn');

const panels = document.querySelectorAll('.panel');
const timeSpans = document.querySelectorAll('.timeSpan');
const smallIconImgs = document.querySelectorAll('.smallIcon');
const temph3s = document.querySelectorAll('.temph3');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTime(unixTimeUTC) {
    const date = new Date(unixTimeUTC * 1000);
    const timeStr = date.toLocaleTimeString(`en-GB`).slice(0, 5);
    return timeStr;
}

function getWeekDays(unixTimeUTC) {
    const date = new Date(unixTimeUTC * 1000);
    const options = { weekday: 'long' };
    const currDay = new Intl.DateTimeFormat('en-GB', options).format(date);

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const i = weekDays.indexOf(currDay);
    return [currDay, weekDays[(i + 1) % 7], weekDays[(i + 2) % 7], weekDays[(i + 3) % 7], weekDays[(i + 4) % 7],]
}

function setWeekDays(unixTimeUTC) {
    const week = getWeekDays(unixTimeUTC);
    for (let i = 0; i < week.length; i++) {
        panelBtns[i].innerText = week[i];
    }
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

const fetchFiveDaysWeather = async () => {
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WeatherAPIkey}&units=metric`);
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
    await getAndSetLatLon(capitalizeFirstLetter(cityName), usedSearchBar);
    responceObj = await fetchCurrWeather();
    const { dt: unixTimeUTC } = responceObj;

    setWeekDays(unixTimeUTC);
}

async function updateFiveDaysWeatherInfo(usedSearchBar) {
    let cityName;
    if (usedSearchBar === 'navSearchBarForm' && navSearchBarForm.elements.city.value !== '') cityName = navSearchBarForm.elements.city.value;
    else if (usedSearchBar === 'searchBar' && searchBar.elements.city.value !== '') cityName = searchBar.elements.city.value;
    else cityName = 'tbilisi';
    await getAndSetLatLon(capitalizeFirstLetter(cityName), usedSearchBar);
    responceObj = await fetchFiveDaysWeather();
    const { list } = responceObj;
    const hours = list.map((item => {
        return item.dt_txt.slice(11, -3);
    }))
    const temps = list.map((item => {
        return item.main.temp;
    }))
    const icons = list.map((item => {
        return item.weather[0].icon;
    }))
    const iconDescriptions = list.map((item => {
        return item.weather[0].description;
    }))

    for (let i = 0; i < temps.length; i++) {
        timeSpans[i].innerText = hours[i];
        smallIconImgs[i].src = `http://openweathermap.org/img/wn/${icons[i]}@2x.png`;
        smallIconImgs[i].title = iconDescriptions[i];
        temph3s[i].innerText = `${temps[i]} °C`;
    }
}

// Start of execution:
updateCurrWeatherInfo();
updateFiveDaysWeatherInfo();

//Event Listeners
navSearchBarForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    await updateCurrWeatherInfo('navSearchBarForm');
    updateFiveDaysWeatherInfo('navSearchBarForm');
});

searchBar.addEventListener('submit', async function (e) {
    e.preventDefault();
    await updateCurrWeatherInfo('searchBar');
    updateFiveDaysWeatherInfo('searchBar');
});

toggleButton.addEventListener('click', () => {
    navLinksDiv.classList.toggle('active');
})

navLinkAnchors[0].addEventListener('click', () => {
    secOne.classList.remove('shown', 'hidden');
    navLinkAnchors[0].classList.remove('no-hover-effect');

    secOne.classList.add('shown');
    secTwo.classList.add('hidden');
    navLinkAnchors[0].classList.add('hover-effect');
    navLinkAnchors[1].classList.add('no-hover-effect');
    navLinkAnchors[2].classList.add('no-hover-effect');
})

navLinkAnchors[1].addEventListener('click', () => {
    secOne.classList.remove('shown', 'hidden');
    navLinkAnchors[1].classList.remove('no-hover-effect');

    secOne.classList.add('shown');
    secTwo.classList.add('hidden');
    navLinkAnchors[0].classList.add('no-hover-effect');
    navLinkAnchors[1].classList.add('hover-effect');
    navLinkAnchors[2].classList.add('no-hover-effect');
})

navLinkAnchors[2].addEventListener('click', () => {
    secTwo.classList.remove('shown', 'hidden');
    navLinkAnchors[2].classList.remove('no-hover-effect');

    secOne.classList.add('hidden');
    secTwo.classList.add('shown');
    navLinkAnchors[0].classList.add('no-hover-effect');
    navLinkAnchors[1].classList.add('no-hover-effect');
    navLinkAnchors[2].classList.add('hover-effect');
})

selectPanelBtn.addEventListener('click', () => {
    panelBtnsDiv.classList.toggle('active');
    panelBtns.forEach(panelBtn => {
        panelBtn.classList.toggle('active');
    })
})

panelBtns[0].addEventListener('click', () => {
    panels[0].classList.remove('selected', 'unselected');

    panels[0].classList.add('selected');
    panels[1].classList.add('unselected');
    panels[2].classList.add('unselected');
    panels[3].classList.add('unselected');
    panels[4].classList.add('unselected');
})

panelBtns[1].addEventListener('click', () => {
    panels[1].classList.remove('selected', 'unselected');

    panels[0].classList.add('unselected');
    panels[1].classList.add('selected');
    panels[2].classList.add('unselected');
    panels[3].classList.add('unselected');
    panels[4].classList.add('unselected');
})

panelBtns[2].addEventListener('click', () => {
    panels[2].classList.remove('selected', 'unselected');

    panels[0].classList.add('unselected');
    panels[1].classList.add('unselected');
    panels[2].classList.add('selected');
    panels[3].classList.add('unselected');
    panels[4].classList.add('unselected');
})

panelBtns[3].addEventListener('click', () => {
    panels[3].classList.remove('selected', 'unselected');

    panels[0].classList.add('unselected');
    panels[1].classList.add('unselected');
    panels[2].classList.add('unselected');
    panels[3].classList.add('selected');
    panels[4].classList.add('unselected');
})

panelBtns[4].addEventListener('click', () => {
    panels[4].classList.remove('selected', 'unselected');

    panels[0].classList.add('unselected');
    panels[1].classList.add('unselected');
    panels[2].classList.add('unselected');
    panels[3].classList.add('unselected');
    panels[4].classList.add('selected');
})