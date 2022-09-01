import './main.css';
import { create, control } from './component';
import mockdata from './mocdata';
import weatherUrls from './imgurls';
const searchCity = document.getElementById('searchCity');
const dropDown = document.getElementById('dropdown');
const cityname = document.getElementById('cityname');
const currentTemp = document.getElementById('current-temp');
const daynightTemp = document.getElementById('daynight-temp');
const currentweather = document.getElementById('currentweather');
const hourly = document.getElementById('hrly');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feels-like');
const uvIndex = document.getElementById('uv-index');
const daily = document.getElementById('daily');
const windDirection = document.getElementById('wind-direction');
const windSpeed = document.getElementById('wind-speed');
const sunWidget = document.getElementById('widget');
const sunriseTime = document.getElementById('sunriseTime');
const sunsetTime = document.getElementById('sunsetTime');
const moonPhase = document.getElementById('moonPhase');
const weatherBg = document.getElementById('weather-bg');

create(sunWidget);
async function getWeatherData(long, lat, timezone) {
  const response = await fetch(
    'https://api.openweathermap.org/data/3.0/onecall?' +
      new URLSearchParams({
        lat: lat,
        lon: long,
        exclude: 'minutely',
        appid: '',
        units: 'metric',
      })
  );

  const data = await response.json();
  console.log(data);
  return data;
}

async function getCords(q) {
  const response = await fetch(
    'http://api.positionstack.com/v1/forward?' +
      new URLSearchParams(
        {
          access_key: '946bbe6c6b1ffaaf51b1197cace72d6c',
          query: q,
          timezone_module: 1,
        },
        { mode: 'cors' }
      )
  );

  const data = await response.json();
  return data;
}

function getMoonPhase(value) {
  const newMoon = [0, 1];
  const firstQ = 0.25;
  const full = 0.5;
  const lastQ = 0.75;

  if (value === newMoon[0] || value === newMoon[1])
    return { moon: 'New Moon', icon: 'mdi-moon-new' };
  if (value === firstQ)
    return { moon: 'First Quarter Moon', icon: 'mdi-moon-first-quarter' };
  if (value === full) return { moon: 'Full Moon', icon: 'mdi-moon-full' };
  if (value === lastQ)
    return { moon: 'Last Quarter Moon', icon: 'mdi-moon-last-quarter' };

  if (value > newMoon[0] && value < firstQ)
    return { moon: 'Waxing Crescent', icon: 'mdi-moon-waxing-crescent' };
  if (value > firstQ && value < full)
    return { moon: 'Waxing Gibbous', icon: 'mdi-moon-waxing-gibbous-' };
  if (value > full && value < lastQ)
    return { moon: 'Waning Gibbous', icon: 'mdi-moon-waning-gibbous' };
  if (value > lastQ && value < newMoon[1])
    return { moon: 'Waning Crescent', icon: 'mdi-moon-waning-crescent' };
}

function getWindDir(hdg) {
  if (hdg < 45 || hdg === 360) return 'North';
  if (hdg < 90) return 'North East';
  if (hdg < 135) return 'East';
  if (hdg < 180) return 'South East';
  if (hdg < 225) return 'South';
  if (hdg < 270) return 'South West';
  if (hdg < 315) return 'West';
  if (hdg < 360) return 'North West';

  return hdg;
}

function getBg(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return weatherUrls.lightning;
  if (weatherId >= 300 && weatherId < 600) return weatherUrls.pouring;
  if (weatherId >= 600 && weatherId < 700) return weatherUrls.snow;
  if (weatherId >= 700 && weatherId < 800) return weatherUrls.fog;
  if (weatherId === 800) return weatherUrls.sunny;
  if (weatherId >= 801 && weatherId < 900) return weatherUrls.cloudy;
  console.log(weatherId);
}

function getIcon(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return 'mdi-weather-lightning';
  if (weatherId >= 300 && weatherId < 600) return 'mdi-weather-pouring';
  if (weatherId >= 600 && weatherId < 700) return 'mdi-weather-snowy-heavy';
  if (weatherId >= 700 && weatherId < 800) return 'mdi-weather-fog';
  if (weatherId === 800) return 'mdi-white-balance-sunny';
  if (weatherId >= 801 && weatherId < 900) return 'mdi-weather-cloudy';
  console.log(weatherId);
}

function isTomorrow(todayWeekday, dateWeekday) {
  const weekDayNum = (weekday) => {
    if (weekday === 'Mon') return 1;
    if (weekday === 'Tue') return 2;
    if (weekday === 'Wed') return 3;
    if (weekday === 'Thu') return 4;
    if (weekday === 'Fri') return 5;
    if (weekday === 'Sat') return 6;
    if (weekday === 'Sun') return 7;
  };

  const todayWeekdayNum = weekDayNum(todayWeekday);
  const dateWeekdayNum = weekDayNum(dateWeekday);

  if (dateWeekdayNum - 1 === todayWeekdayNum) return true;

  return false;
}

function amToPm(time) {
  const arr = time.split(':');
  const hr = parseInt(arr[0]);
  let fix = hr > 11 ? 'pm' : 'am';
  const hrPass = hr % 12 === 0 ? 12 : hr % 12;
  return `${hrPass}:${arr[1]} ${fix}`;
}

function uvIndexString(uvi) {
  if (uvi <= 2) return 'Low';
  if (uvi <= 5) return 'Medium';
  if (uvi <= 7) return 'High';
  if (uvi <= 10) return 'Very High';
  if (uvi >= 11) return 'Extremely High';
}

function sunComponent(sunriseDt, sunsetDt, timeZone, moonPh) {
  const sunrise = new Date(sunriseDt * 1000).toLocaleString('en-GB', {
    timeZone: timeZone,
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });
  const sunset = new Date(sunsetDt * 1000).toLocaleString('en-GB', {
    timeZone: timeZone,
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });

  const nowTime = new Date().toLocaleString('en-GB', {
    timeZone: timeZone,
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });

  const nowDt = Date.now();

  const minTillSunset = Math.round((sunsetDt - sunriseDt) / 60);
  const nowMinutes = (sunsetDt - nowDt / 1000) / 60;
  let percent = 100 - Math.round((nowMinutes * 100) / minTillSunset);

  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;

  for (let i = 0; i <= percent; i++) {
    setTimeout(() => {
      control.then(({ setState }) => setState(i));
    }, 20 * i);
  }

  sunriseTime.innerHTML = sunrise;
  sunsetTime.innerHTML = sunset;
  const moonStats = getMoonPhase(moonPh);
  moonPhase.innerHTML = `<span class="mdi ${moonStats.icon}"></span> ${moonStats.moon}`;
}

function render(long, lat, timezone, city) {
  getWeatherData(long, lat).then((data) => {
    weatherBg.style.cssText = `
    background: url('${getBg(data.current.weather[0].id)}');
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    `;
    console.log(getBg(data.current.weather[0].id));
    cityname.innerText = city;
    currentTemp.innerHTML = Math.round(data.current.temp);
    daynightTemp.innerHTML = `${Math.round(
      data.daily[0].temp.day
    )} <span class="ntext">/ ${Math.round(data.daily[0].temp.night)} °C</span>`;
    currentweather.innerHTML = data.current.weather[0].description;
    //hourly
    hourly.innerHTML = '';
    data.hourly.forEach((item, index) => {
      const dateUTC = new Date(item.dt * 1000).toLocaleString('en-GB', {
        timeZone: timezone,
      });
      const currentHour = dateUTC.split(',')[1].trim().slice(0, 5);
      const hrlyItem = document.createElement('div');
      hrlyItem.classList.add('card');
      if (index === 0) hrlyItem.classList.add('current');
      hrlyItem.innerHTML = `
      <p>${amToPm(currentHour)}</p>
      <p>${item.humidity}%</p>
      <span class="mdi ${getIcon(item.weather[0].id)}"></span>
      <p class="dgr">${Math.round(item.temp)}°C</p>
      `;
      hourly.append(hrlyItem);
    });
    // daily
    daily.innerHTML = '';
    data.daily.forEach((item, index) => {
      if (index === 0) return;
      const dateUTC = new Date(item.dt * 1000).toLocaleString('en-GB', {
        timeZone: timezone,
        day: 'numeric',
        month: 'short',
      });
      const weekday = new Date(item.dt * 1000).toLocaleString('en-GB', {
        timeZone: timezone,
        weekday: 'short',
      });
      const todayWeekday = new Date().toLocaleString('en-GB', {
        timeZone: timezone,
        weekday: 'short',
      });

      const weekdayPass = isTomorrow(todayWeekday, weekday)
        ? 'Tomorrow'
        : weekday;
      const row = document.createElement('div');
      row.classList.add('row');
      row.innerHTML = `
        <div class="left">
          <p>${weekdayPass},</p>
          <p>${dateUTC}</p>
        </div>
        <div class="mid">
          <span class="mdi ${getIcon(item.weather[0].id)}"></span>
        </div>
        <div class="right">
          <p class="dn">${Math.round(
            item.temp.day
          )} <span class="ntext">/ ${Math.round(item.temp.night)} °C</span></p>
        </div>
      `;
      daily.append(row);
    });
    //comfort level
    humidity.innerHTML = `${data.current.humidity}%`;
    feelsLike.innerHTML = `${Math.round(data.current.feels_like)}°C`;
    const uvi = Math.round(data.current.uvi);
    uvIndex.innerHTML = `${uvi} ${uvIndexString(uvi)}`;
    //wind
    console.log(data.current.wind_deg);
    windDirection.innerHTML = getWindDir(data.current.wind_deg);
    windSpeed.innerHTML = `${Math.round(data.current.wind_speed * 3.6)} km/h`;

    //Sunrise

    sunComponent(
      data.daily[0].sunrise,
      data.daily[0].sunset,
      timezone,
      data.daily[0].moon_phase
    );
  });
}

searchCity.addEventListener('keydown', (e) => {
  if (e.keyCode === 13 && searchCity.value !== '') {
    getCords(searchCity.value).then(({ data }) => {
      dropDown.innerHTML = '';
      data.forEach((item, index) => {
        const dropdownItem = document.createElement('div');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.innerText = item.label;
        dropdownItem.dataset.id = index;
        dropdownItem.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          localStorage.lastSearch = JSON.stringify({
            city: searchCity.value,
            id,
          });
          const long = data[id].longitude;
          const lat = data[id].latitude;
          const timezone = data[id].timezone_module.name;
          const city = data[id].name;
          render(long, lat, timezone, city);
        });
        dropDown.append(dropdownItem);
      });
      dropDown.style.visibility = 'visible';
    });
  }
});

searchCity.addEventListener('focusout', () => {
  setTimeout(() => {
    dropDown.style.visibility = 'hidden';
  }, 300);
});

if (localStorage.lastSearch) {
  const search = JSON.parse(localStorage.lastSearch);
  getCords(search.city).then(({ data }) => {
    const long = data[search.id].longitude;
    const lat = data[search.id].latitude;
    const timezone = data[search.id].timezone_module.name;
    const city = data[search.id].name;
    render(long, lat, timezone, city);
  });
} else {
  render(76.7784, 30.728092, 'Asia/Kolkata', 'Chandigarh');
}
