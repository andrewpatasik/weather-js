import { compareAsc, format } from 'date-fns';

// import assets
import './style.css'
import './images/vectorpaint.svg'

const API_KEY = process.env.API_KEY;

const time = document.getElementById('time');
const condition = document.getElementById('condition');
const location = document.getElementById('location');
const degree = document.getElementById('deg');
const temp = document.getElementById('temp');
const details = document.querySelector('.weather-detail');
const form = document.querySelector('form');
const searchbox = document.getElementById('searchbox');
const searchBtn = document.getElementById('search_ic');

// const API_KEY = process.env.API_KEY;
// console.log(API_KEY)

class weatherObj {
    constructor(key, city) {
        this.url = `http://api.openweathermap.org/data/2.5/weather?`;
        this.key = `&appid=${key}`;
        this.city = `&q=${city}`;
        this.unit = `&units=metric`
    }
    call() {
        return (this.url + this.city + this.unit + this.key).toString();
    }
}

//jquery untuk autocomplete
// $( function() {
//     $( "#element_id" ).autocomplete({
//       source: countryNameIndex
//     });
//   } );


function setTimeAndDate() {
    let date = format(new Date(), 'PPPP | p');
    time.innerHTML = date;
    console.log(date);
}

async function getWeather(location = 'jakarta') {

    let weatherInThisLocation = new weatherObj(API_KEY, location).call();
    const response = await fetch(weatherInThisLocation);
    const data = await response.json();
    console.log(data);
    if (data.cod === 200) {
        return {
            name: data.name,
            country: data.sys.country,
            condition: data.weather[0].main,
            temp: data.main.temp,
            ['feels_like']: data.main.feels_like,
            humidity: data.main.humidity,
            wind: data.wind.speed
        }
    } else {
        return Promise.reject({
            cod: data.cod,
            msg: data.message
        });
    }
}

function clearData() {
    condition.innerHTML = '';
    location.innerHTML = '';
    degree.innerHTML = '';
    temp.innerHTML = '';

    if (details.hasChildNodes()) {
        let children = details.childNodes;

        children[1].innerHTML = '';
        children[3].innerHTML = '';
        children[5].innerHTML = '';
    }
}

let weatherData = getWeather();
weatherData
    .then(
        function onfulfilled(weather) {
            clearData();

            condition.innerHTML = weather.condition;
            location.innerHTML = weather.name + ', ' + weather.country;
            degree.innerHTML = weather.temp;
            temp.innerHTML = '&deg C';

            if (details.hasChildNodes()) {
                let children = details.childNodes;

                children[1].innerHTML = 'Feels Like: ' + weather['feels_like'];
                children[3].innerHTML = 'Humidity: ' + weather.humidity;
                children[5].innerHTML = 'Wind: ' + weather.wind;
            }
        },
        function onrejected(err) {
            alert(err.msg);
        })
    .catch(error => {
        console.log(error);
    })

form.addEventListener('submit', (e) => {
    e.preventDefault();
})

searchBtn.addEventListener('click', () => {
    const CITY_NAME = searchbox.value;
    console.log(searchbox.value);

    let weatherData = getWeather(CITY_NAME);
    weatherData
        .then(function onfulfilled(weather) {
                clearData();

                condition.innerHTML = weather.condition;
                location.innerHTML = weather.name + ', ' + weather.country;
                degree.innerHTML = weather.temp;
                temp.innerHTML = '&deg C';

                if (details.hasChildNodes()) {
                    let children = details.childNodes;

                    children[1].innerHTML = 'Feels Like: ' + weather['feels_like'];
                    children[3].innerHTML = 'Humidity: ' + weather.humidity;
                    children[5].innerHTML = 'Wind: ' + weather.wind;
                }
            },
            function onrejected(err) {
                alert(err.msg);
            })
        .catch(error => {
            console.log(error);
        })
    // clear search box
    searchbox.value = '';
})

setTimeAndDate();
setInterval(() => setTimeAndDate(), 60 * 1000);

window.addEventListener('beforeunload', function (e) {
    clearInterval(setTimeAndDate());
});

// window.process.env.API_KEY = process.env.API_KEY;
// window.addEventListener('load', () => {

// })