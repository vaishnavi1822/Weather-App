import React, { useRef, useEffect, useState } from 'react';
import search_icon from '../assets/search.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow from '../assets/snow.png';
import wind from '../assets/wind.png';
import humidity from '../assets/humidity.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);

    const allIcons = {
        '01d': cloud_icon,
        '01n': cloud_icon,
        '02d': cloud_icon,
        '02n': cloud_icon,
        '03d': cloud_icon,
        '03n': cloud_icon,
        '04d': drizzle_icon,
        '04n': drizzle_icon,
        '09d': rain_icon,
        '09n': rain_icon,
        '10d': rain_icon,
        '10n': rain_icon,
        '13d': snow,
        '13n': snow,
    };

    const search = async (city) => {
        if (city === '') {
            alert("Enter City Name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            // Get the current weather
            const currentWeather = data.list[0];
            const currentIcon = allIcons[currentWeather.weather[0].icon] || cloud_icon;
            setWeatherData({
                humidity: currentWeather.main.humidity,
                windSpeed: currentWeather.wind.speed,
                temperature: Math.floor(currentWeather.main.temp),
                location: data.city.name,
                icon: currentIcon,
            });

            // Get the 5-day forecast (at 3-hour intervals)
            const forecast = [];
            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                forecast.push({
                    date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                    nightTemp: Math.floor(day.main.temp_min),
                    dayTemp: Math.floor(day.main.temp_max),
                    icon: allIcons[day.weather[0].icon] || cloud_icon,
                });
            }
            setForecastData(forecast);

        } catch (error) {
            setWeatherData(null);
            console.error("Error in fetching data", error);
        }
    };

    useEffect(() => {
        search("Nagpur");
    }, []);

    return (
        <div className='flex flex-col justify-evenly gap-1 items-center p-4 text-black w-full'>
            <div className='flex flex-col justify-start rounded-2xl p-3 bg-transparent text-black shadow-2xl'>
                <div className='flex items-center gap-2 justify-center'>
                    <div>
                        <input ref={inputRef} type="text" className='h-10 w-60 p-3 rounded-3xl text-black bg-gray-300 shadow-2xl' placeholder='Search' />
                    </div>
                    <div className='bg-gray-300 rounded-3xl w-10 h-10 flex items-center justify-center cursor-pointer hover:shadow-2xl'>
                        <img className='w-5' src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
                    </div>
                </div>

                {weatherData && (
                    <div className='flex flex-col items-center justify-center'>
                        <img src={weatherData.icon} alt="Weather Icon" className='w-24 m-4' />
                        <p className='text-4xl'>{weatherData.temperature}℃</p>
                        <p className='text-3xl py-2'>{weatherData.location}</p>
                        <div className='flex justify-around gap-5 mt-4'>
                            <div className='flex items-center gap-2 text-lg'>
                                <img src={humidity} alt="Humidity" className='w-6 invert' />
                                <div>
                                    <p>{weatherData.humidity}%</p>
                                    <span className='text-sm'>Humidity</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 text-lg'>
                                <img src={wind} alt="Wind" className='w-6 invert' />
                                <div>
                                    <p>{weatherData.windSpeed} Km/h</p>
                                    <span className='text-sm'>Wind speed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className='future-forecast flex items-center gap-5 px-2 w-full min-h-[45vh] overflow-x-scroll max-w-full scroll-smooth mt-3'>
                {forecastData.map((day, index) => (
                    <div key={index} className="weather min-w-[200px] sm:min-w-[220px] bg-transparent md:min-w-[250px] lg:min-w-[300px] gap-2 h-[35vh] flex flex-col items-center justify-center transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:cursor-pointer rounded-2xl shadow-2xl">
                        <h1 className='p-2 rounded-3xl bg-gray-200 w-[30%] text-center'>{day.date}</h1>
                        <img src={day.icon} alt="Weather Icon" className='w-20' />
                        <div className='flex flex-col items-center'>
                            <div className="temp">Night - {day.nightTemp}℃</div>
                            <div className="temp">Day - {day.dayTemp}℃</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Weather;
