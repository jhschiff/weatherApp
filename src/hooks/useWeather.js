import { useState, useEffect, useRef } from 'react';
import { format, addDays } from 'date-fns';
import weatherApi from '../services/weatherApi';
import mockWeatherData from '../mocks/weatherData';

const useWeather = (location, weekOffset = 0) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maxWeeksFetched, setMaxWeeksFetched] = useState(0);
  const weatherDataRef = useRef(weatherData);

  // Update ref when weatherData changes
  useEffect(() => {
    weatherDataRef.current = weatherData;
  }, [weatherData]);

  // Use mock data in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Fetch data when location changes or when we need more future data
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location) return;

      // If we already have enough data for the requested weekOffset, don't fetch
      if (weatherDataRef.current && weekOffset < maxWeeksFetched) {
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
          
          // If we already have enough data, don't fetch again
          if (weatherDataRef.current && maxWeeksFetched >= weeksToFetch) {
            setLoading(false);
            return;
          }

          const today = new Date();
          const startDate = format(today, 'yyyy-MM-dd');
          const endDate = format(addDays(today, weeksToFetch * 7), 'yyyy-MM-dd');

          const data = await weatherApi.getForecast(location, startDate, endDate);
          setWeatherData(data);
          setMaxWeeksFetched(weeksToFetch); // Store total weeks fetched
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, weekOffset, maxWeeksFetched, isDevelopment]);

  return {
    weatherData,
    loading,
    error,
    maxWeeksFetched
  };
};

export default useWeather; 