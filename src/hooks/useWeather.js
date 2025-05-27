import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import weatherApi from '../services/weatherApi';

const useWeather = (location, eventDay, timeRange) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location) return;

      setLoading(true);
      setError(null);

      try {
        // Calculate date range (current week and next week)
        const today = new Date();
        const startDate = format(today, 'yyyy-MM-dd');
        const endDate = format(addDays(today, 14), 'yyyy-MM-dd');

        const data = await weatherApi.getForecast(location, startDate, endDate);
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, eventDay, timeRange]);

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