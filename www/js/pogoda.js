const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);
    }

    getCurrentWeather(query) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    this.currentWeather = JSON.parse(xhr.responseText);
                    console.log(this.currentWeather);
                    resolve(this.currentWeather);
                } else {
                    reject(new Error("Nie udało się pobrać bieżącej pogody."));
                }
            };
            xhr.onerror = () => reject(new Error("Wystąpił błąd w komunikacji z serwerem."));
            xhr.send();
        });
    }


    getForecast(query) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać prognozy pogody.");
                }
                return response.json();
            })
            .then(forecastData => {
                console.log(forecastData);
                return forecastData;
            })
            .catch(error => {
                console.error(error);
            });
    }

    async getCurrentAndForecastWeather(query) {
        try {
            this.resultsBlock.innerHTML = "<p>Ładowanie danych...</p>";

            const currentWeather = await this.getCurrentWeather(query);
            this.drawCurrentWeather(currentWeather);

            const forecast = await this.getForecast(query);
            this.drawForecastWeather(forecast);
        } catch (error) {
            this.resultsBlock.innerHTML = `<p>${error.message}</p>`;
        }
    }

    drawCurrentWeather(currentWeather) {
        this.resultsBlock.innerHTML = "";

        const currentWeatherBlock = this.createWeatherBlock(
            "Teraz",
            currentWeather.main.temp,
            currentWeather.main.feels_like,
            currentWeather.weather[0].icon,
            currentWeather.weather[0].description
        );
        this.resultsBlock.appendChild(currentWeatherBlock);
    }

    drawForecastWeather(forecast) {
        forecast.list.forEach((item, index) => {
            if (index % 8 === 5) {
                const date = new Date(item.dt * 1000).toLocaleString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });
                const forecastBlock = this.createWeatherBlock(
                    date,
                    item.main.temp,
                    item.main.feels_like,
                    item.weather[0].icon,
                    item.weather[0].description
                );
                this.resultsBlock.appendChild(forecastBlock);
            }
        });
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        const block = document.createElement("div");
        block.className = "weather-block";
        block.innerHTML = `
            <div class="weather-date">${dateString}</div>
            <div class="weather-temperature">${temperature.toFixed(1)} &deg;C</div>
            <div class="weather-temperature-feels-like">Odczuwalna: ${feelsLikeTemperature.toFixed(1)}&deg;C</div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${iconName}@2x.png" alt="${description}">
            <div class="weather-description">${description}</div>
        `;
        return block;
    }
};

document.weatherApp = new WeatherApp("d934bd3a5b1d0d5da396c33edcdc704b", "#weather-results-container");

window.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Szczecin';
    document.weatherApp.getCurrentWeather(defaultLocation).then(currentWeather => {
        document.weatherApp.drawCurrentWeather(currentWeather);
    }).catch(error => {
        document.querySelector("#weather-results-container").innerHTML = `<p>${error.message}</p>`;
    });
});

document.querySelector("#checkButton").addEventListener("click", function () {
    const query = document.querySelector("#locationInput").value;
    if (!query) {
        alert("Wprowadź nazwę miasta");
        return;
    }
    document.weatherApp.getCurrentAndForecastWeather(query);
});
