import { format, parseISO } from 'date-fns';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { useTheme } from '@mui/material';

export const getWeatherDescription = (summary) => {
  const { avgTemp, avgPrecip, avgHumidity, avgWind } = summary;
  
  const tempDesc = avgTemp > 75 ? 'warm' : avgTemp > 60 ? 'mild' : 'cool';
  const precipDesc = avgPrecip > 50 ? 'high chance of precipitation' : avgPrecip > 20 ? 'some chance of precipitation' : 'low chance of precipitation';
  const windDesc = avgWind > 15 ? 'windy' : avgWind > 8 ? 'breezy' : 'calm';
  const humidityDesc = avgHumidity > 70 ? 'humid' : avgHumidity > 40 ? 'moderate humidity' : 'dry';

  return `${tempDesc}, ${precipDesc}, ${windDesc} and ${humidityDesc}.`;
};

export const getTimeRangeHours = (timeRange) => {
  switch (timeRange) {
    case 'morning':
      return { startHour: 8, endHour: 12 };
    case 'afternoon':
      return { startHour: 12, endHour: 17 };
    case 'evening':
      return { startHour: 17, endHour: 21 };
    default:
      return { startHour: 12, endHour: 17 };
  }
};

export const getEventDayData = (weatherData, eventDay, weekOffset, isNextWeek) => {
  if (!weatherData?.days) {
    console.log('No weather data available');
    return null;
  }

  // Find all matching days for the selected event day
  const matchingDays = weatherData.days
    .filter(day => {
      const dayDate = parseISO(day.datetime);
      const dayOfWeek = format(dayDate, 'EEEE').toLowerCase();
      return dayOfWeek === eventDay;
    })
    .sort((a, b) => parseISO(a.datetime) - parseISO(b.datetime));

  // Calculate the index based on weekOffset and isNextWeek
  const baseIndex = weekOffset;
  const index = baseIndex + (isNextWeek ? 1 : 0);

  // Get the appropriate day
  return matchingDays[index];
};

export const WeatherIcon = ({ icon }) => {
  const theme = useTheme();
  const iconSize = 48;
  
  switch (icon) {
    case 'partly-cloudy-day':
      return <CloudIcon sx={{ fontSize: iconSize, color: theme.palette.primary.main }} />;
    case 'clear-day':
      return <WbSunnyIcon sx={{ fontSize: iconSize, color: theme.palette.warning.main }} />;
    case 'rain':
      return <WaterDropIcon sx={{ fontSize: iconSize, color: theme.palette.info.main }} />;
    case 'thunder-rain':
      return <WaterDropIcon sx={{ fontSize: iconSize, color: theme.palette.error.main }} />;
    default:
      return <CloudIcon sx={{ fontSize: iconSize, color: theme.palette.primary.main }} />;
  }
}; 