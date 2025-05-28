import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import weatherApi from '../services/weatherApi';

const useWeather = (location, eventDay, timeRange, weekOffset = 0) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maxWeeksFetched, setMaxWeeksFetched] = useState(0);

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
        // Calculate how many weeks of data we need based on weekOffset
        const weeksToFetch = Math.max(4, 4 + weekOffset);
        const today = new Date();
        const startDate = format(today, 'yyyy-MM-dd');
        const endDate = format(addDays(today, weeksToFetch * 7), 'yyyy-MM-dd');

        const data = await weatherApi.getForecast(location, startDate, endDate);
        setWeatherData(data);
        setMaxWeeksFetched(weeksToFetch / 2); // Store how many pairs of weeks we've fetched
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, weekOffset, weatherData, maxWeeksFetched]);

  const getEventDayForecast = () => {
    if (!weatherData) return null;

    // Find the forecast for the selected event day
    const eventDayData = weatherData.days.find(day => {
      const dayOfWeek = format(new Date(day.datetime), 'EEEE').toLowerCase();
      return dayOfWeek === eventDay;
    });

    return eventDayData;
  };

  const getNextWeekEventDayForecast = () => {
    if (!weatherData) return null;

    // Find the forecast for the selected event day in the next week
    const nextWeekEventDayData = weatherData.days.find(day => {
      const dayOfWeek = format(new Date(day.datetime), 'EEEE').toLowerCase();
      const isNextWeek = new Date(day.datetime) > addDays(new Date(), 7);
      return dayOfWeek === eventDay && isNextWeek;
    });

    return nextWeekEventDayData;
  };

  return {
    weatherData,
    loading,
    error,
    getEventDayForecast,
    getNextWeekEventDayForecast,
  };
};

export default useWeather; 