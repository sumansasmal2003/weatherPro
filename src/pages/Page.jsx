import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sunrise from '../assets/sunrise.png';
import sunset from '../assets/sunset.png';
import axios from 'axios';

// API Key for OpenWeather
const api = '63d2314cac5eb913d92e2a29e5de8a1c';

const Page = () => {
    const [placeInput, setPlaceInput] = useState('');
    const [weather, setWeather] = useState(null);
    const [currentDate, setCurrentDate] = useState('');
    const navigate = useNavigate();

    // Convert Kelvin to Celsius
    const convertToCelsius = (temp) => (temp - 273.15).toFixed(2);

    // Convert UNIX timestamp to AM/PM format
    const convertToTime = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    // Fetch the current date and format it (e.g., "18 October, 2024")
    const getCurrentDate = () => {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Fetch weather data based on city or coordinates
    const fetchWeather = (url) => {
        axios.get(url)
            .then((res) => {
                setWeather(res.data);
            })
            .catch((error) => console.error('Error fetching weather:', error));
    };

    // Use Geolocation API to get the user's current location
    const getCurrentLocationWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api}`;
                fetchWeather(url); // Fetch weather based on the current location
            }, (error) => {
                console.error('Error getting location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    useEffect(() => {
        // Set current date when the component loads
        setCurrentDate(getCurrentDate());

        // If placeInput is not empty, fetch weather for the input city
        if (placeInput) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${placeInput}&appid=${api}`;
            fetchWeather(url);
        } else {
            // If placeInput is empty, fetch weather for the current location
            getCurrentLocationWeather();
        }
    }, [placeInput]);

    // Handle click on the place name to navigate to the details page
    const handlePlaceClick = (placeName) => {
        navigate(`/details/${placeName}`);
    };

    return (
        <div
            className='flex min-h-screen bg-gradient-to-tr from-blue-600 via-violet-600 to-indigo-600 flex-col items-center justify-center p-4'
        >
            <h1
                className='mb-5 text-lg font-bold text-gray-50'
            >
                Weather PRO
            </h1>
            <div
                className='flex gap-4 shadow-lg flex-col p-4 w-full max-w-3xl h-full bg-gradient-to-tl rounded-lg'
            >
                <div
                    className='flex w-full gap-2 flex-col md:flex-row items-center justify-center'
                >
                    <input
                        type="text"
                        className='pl-3 pr-3 w-full max-w-lg h-[2.5rem] border-none outline-none rounded-full text-gray-900'
                        placeholder='Search Your City...'
                        value={placeInput}
                        onChange={(e) => setPlaceInput(e.target.value)}
                    />
                    <p
                        className='text-gray-100 font-bold text-md rounded-lg shadow-lg p-2 animate-border-color'
                    >
                        {currentDate}
                    </p>
                </div>
                <div
                    className='flex flex-col items-center pl-4 pr-4'
                >
                    <div
                        className='flex items-center gap-2 justify-center animate-border-color w-[10rem]'
                    >
                        {
                            weather && (
                                <>
                                    <i
                                        className="fa-solid fa-location-dot text-gray-50"
                                    >

                                    </i>
                                    <button
                                        onClick={() => handlePlaceClick(weather.name)}
                                        className='text-gray-100 text-start font-bold rounded-lg shadow-lg'
                                    >
                                        {weather.name}
                                    </button>
                                </>
                            )
                        }
                    </div>
                    <div
                        className='flex flex-col items-center justify-center mt-1'
                    >
                        {
                            weather && (
                                <>
                                    <p
                                        className='text-lg font-bold text-gray-100'
                                    >
                                        {convertToCelsius(weather.main.temp)}°C
                                    </p>
                                    <p
                                        className='text-lg font-bold text-gray-100'
                                    >
                                        {weather.weather[0].main}
                                    </p>
                                    <p
                                        className='text-lg font-bold text-gray-100'
                                    >
                                        {convertToCelsius(weather.main.temp_max)}°C ~ {convertToCelsius(weather.main.temp_min)}°C
                                    </p>
                                    <p
                                        className='text-lg font-bold text-gray-100'
                                    >
                                        Feels Like {convertToCelsius(weather.main.feels_like)}°C
                                    </p>
                                </>
                            )
                        }
                    </div>
                    {
                        weather && (
                            <div
                                className='flex justify-between items-center w-full'
                            >
                                <div
                                    className='flex flex-col items-center justify-center gap-2'
                                >
                                    <img
                                        src={sunrise}
                                        alt="Sunrise"
                                        className='w-[5rem] bg-gray-50 p-2 rounded-full'
                                    />
                                    <p
                                        className='text-gray-50 text-xs md:text-sm font-bold'
                                    >
                                        {convertToTime(weather.sys.sunrise)}
                                    </p>
                                </div>
                                <div
                                    className='w-full flex items-center justify-center mb-10 md:mb-5'
                                >
                                    <hr
                                        className='w-full rounded-full h-2 border-0 bg-gray-100 ml-2'
                                    />
                                    <i
                                        className="fa-solid fa-play text-gray-100 pr-2"
                                    >

                                    </i>
                                </div>
                                <div
                                    className='flex flex-col items-center justify-center gap-2'
                                >
                                    <img
                                        src={sunset}
                                        alt="Sunset"
                                        className='w-[5rem] bg-gray-900 p-2 rounded-full'
                                    />
                                    <p
                                        className='text-gray-50 text-xs md:text-sm font-bold'
                                    >
                                        {convertToTime(weather.sys.sunset)}
                                    </p>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default Page;
