document.addEventListener("DOMContentLoaded", () => {
  let city = {};
  let weather = {};

  async function responce({ name }) {
    try {
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${name}&key=cc9096a511844624a037fdaaec0832ed`
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry;
        city.name = name;
        city.lat = location.lat;
        city.lon = location.lng;
      } else {
        throw new Error("No data found");
      }
      const weatherResponce = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=88c4f1b5740f4887aa5964860a8fd1ca`
      );
      const weatherData = await weatherResponce.json();
      weather = {
        temp: (weatherData.main.temp - 273.15).toFixed(0),
        description: weatherData.weather[0].description,
        id: weatherData.weather[0].id.toString(),
      };
      getIcon(weather.id[0], "weather-icon");


      document.getElementById("city-name").textContent = city.name;
      document.getElementById("weather-icon").alt = weather.description;
      document.getElementById("weather").textContent = weather.description;
      document.getElementById("temp").textContent = weather.temp + "°C";

     
    } catch (err) {
      alert(`Error: ${err}, error here: ${err.stack}`);
    }

    // Fetch information about the weather forecast
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=88c4f1b5740f4887aa5964860a8fd1ca&units=metric`
    );
    const data = await res.json();
    console.log(city);
    console.log("weatherForecast", data);

    const days = [];
    for(let i = 7; i<40; i+=8) {
        let item = data.list[i];
        days.push({
        date: formatDay(item.dt),
        humidity: item.main.humidity + "%",
        maxTemp: (item.main.temp_max).toFixed(0) + "°C",
        minTemp: (item.main.temp_min).toFixed(0) + "°C",
        id: item.weather[0].id.toString(),
        description: item.weather[0].description,
      });}
 
  for (let i = 0;  i<40; i++) {
    getDay(i, days[i]);
  }

  function formatDay(dateInput) {
    const options  =({weekday:'short', day:"2-digit", month:"short"});
    const date = new Date(dateInput*1000);
    return date.toLocaleDateString('en-US', options);

  }

  function getDay(i, el) {
    document.getElementById(`date${i+1}`).textContent = el.date;
    document.getElementById(`maxTemp${i+1}`).textContent = el.maxTemp;
    document.getElementById(`humidity${i+1}`).textContent = el.humidity;
    getIcon(el.id[0], `imgDay${i+1}`);
    document.getElementById(`description${i+1}`).textContent = el.description;
  }
  }
 function getIcon(weatherInput, idInput){
    switch (weatherInput) {
        case "2":
          document.getElementById(`${idInput}`).src =
            "assets/images/RainThunder.png";
          break;
        case "3":
          document.getElementById(`${idInput}`).src =
            "assets/images/Rainy.png";
          break;
        case "5":
          document.getElementById(`${idInput}`).src =
            "assets/images/Rainy.png";
          break;
        case "6":
          document.getElementById(`${idInput}`).src =
            "assets/images/Snowy.png";
          break;
        case "7":
          document.getElementById(`${idInput}`).src =
            "assets/images/WeatherIcon - 1-15.png";
          break;
        case "8":
          if (weather.id !== "800") {
            document.getElementById(`${idInput}`).src =
              "assets/images/PartlyCloudy.png";
          } else {
            document.getElementById(`${idInput}`).src =
              "assets/images/Sunny.png";
          }
          break;
        default:
          console.log("Weather ID not recognized");
      }
 } 

  //Default city
  document
    .getElementById("search-button")
    .addEventListener("click", function () {
      const cityName = document.getElementById("search").value;
      try {
        responce({ name: cityName });
        document.getElementById("search").value = "";
      } catch (err) {
        alert(`Error: ${err}, error here: ${err.stack}`);
      }
    });


  responce({ name: "Kyiv" });
});
