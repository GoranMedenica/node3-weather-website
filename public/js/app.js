console.log('Client side javascript file is loaded!');



const weatherForm = document.querySelector('form.weather-form');
const addressInput = document.querySelector('form.weather-form input');
const weatherApiResponseEl = document.querySelector('#weather-api-response'); 

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const addresValue = addressInput.value;
    weatherApiResponseEl.textContent = 'Loading...';
    weatherApiResponseEl.style.color = 'black';

    // FETCH --> browser based API (NOT part of JS + not accessible in Node.js)
    fetch('http://localhost:3000/weather-api?address=' + addresValue).then((response) => {
        response.json().then(data => {
            if (data.error) {
                weatherApiResponseEl.textContent = data.error;
                weatherApiResponseEl.style.color = 'red';
            } else {
                // console.log(data.location);
                // console.log(data.forecast);
                weatherApiResponseEl.textContent = `${data.location} - ${data.forecast.temperature}°C - ${data.forecast.weather_descriptions}`;
                weatherApiResponseEl.style.color = 'green';
            }
        })
    })
});