import { format, parseISO } from 'date-fns';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { useTheme } from '@mui/material';
import { Box, Typography, Grid } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';

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

export const WeatherChartHeader = ({ chartData, theme }) => {
  return (
    <Box className="weather-chart-header">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="h6" 
          className="weather-chart-title"
        >
          {format(parseISO(chartData.date), 'EEEE, MMMM d')}
        </Typography>
        <WeatherIcon icon={chartData.summary.icon} />
      </Box>
      <Typography 
        variant="body1" 
        className="weather-chart-description"
      >
        {getWeatherDescription(chartData.summary)}
      </Typography>
      <Grid container spacing={2} className="weather-stats-grid">
        <Grid item xs={6} sm={3}>
          <Box className="weather-stat-item">
            <WbSunnyIcon className="weather-stat-icon" sx={{ color: theme.palette.error.main }} />
            <Typography variant="body2">
              {chartData.summary.avgTemp ? `Avg Temp: ${chartData.summary.avgTemp}°F` : `Temp: ${chartData.summary.avgTemp}°F`}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box className="weather-stat-item">
            <WaterDropIcon className="weather-stat-icon" sx={{ color: theme.palette.info.main }} />
            <Typography variant="body2">
              Precip: {chartData.summary.avgPrecip}%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box className="weather-stat-item">
            <CloudIcon className="weather-stat-icon" sx={{ color: theme.palette.success.main }} />
            <Typography variant="body2">
              Humidity: {chartData.summary.avgHumidity}%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box className="weather-stat-item">
            <AirIcon className="weather-stat-icon" sx={{ color: theme.palette.warning.main }} />
            <Typography variant="body2">
              Wind: {chartData.summary.avgWind} mph
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Sunrise: {chartData.summary.sunrise} | Sunset: {chartData.summary.sunset}
        </Typography>
      </Box>
    </Box>
  );
}; 