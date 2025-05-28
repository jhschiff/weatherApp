import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import weatherApi from '../services/weatherApi';
import mockWeatherData from '../mocks/weatherData';

const useWeather = (location, weekOffset = 0) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maxWeeksFetched, setMaxWeeksFetched] = useState(0);

  // Use mock data in development
  // const isDevelopment = process.env.NODE_ENV === 'development';
  const isDevelopment = true
  // const isDevelopment = false

  // Fetch data when location changes or when we need more future data
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location) return;

      // If we already have enough data for the requested weekOffset, don't fetch
      if (weatherData && weekOffset < maxWeeksFetched) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (isDevelopment) {
          // Use mock data in development
          setWeatherData(mockWeatherData);
          setMaxWeeksFetched(2); // Mock data has 2 weeks
        } else {
          // Calculate how many weeks of data we need based on weekOffset
          const weeksToFetch = Math.max(4, 4 + weekOffset);
          const today = new Date();
          const startDate = format(today, 'yyyy-MM-dd');
          const endDate = format(addDays(today, weeksToFetch * 7), 'yyyy-MM-dd');

          const data = await weatherApi.getForecast(location, startDate, endDate);
          setWeatherData(data);
          setMaxWeeksFetched(weeksToFetch / 2); // Store how many pairs of weeks we've fetched
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, weekOffset, weatherData, maxWeeksFetched, isDevelopment]);

  return {
    weatherData,
    loading,
    error,
  };
};

export default useWeather; 