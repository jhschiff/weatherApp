import React, { useMemo } from 'react';
import { Box, Paper, Typography, CircularProgress, useTheme, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format } from 'date-fns';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import { getWeatherDescription, getTimeRangeHours, getEventDayData } from '../utils/weatherUtils';
import '../styles/WeatherChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherChart = ({ weatherData, eventDay, timeRange, isNextWeek, weekOffset }) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    const eventDayData = getEventDayData(weatherData, eventDay, weekOffset, isNextWeek);

    if (!eventDayData || !eventDayData.hours){
      console.log('No data or no hours data for selected day');
      return null;
    }

    // Get the appropriate hours based on time range
    const { startHour, endHour } = getTimeRangeHours(timeRange);

    // Filter hours for the selected time range
    const filteredHours = eventDayData.hours.filter(hour => {
      const hourStr = hour.datetime.split(':')[0];
      const hourNum = parseInt(hourStr, 10);
      return hourNum >= startHour && hourNum <= endHour;
    });

    if (filteredHours.length === 0) { return null;}

    const labels = filteredHours.map(hour => {
      const [hours] = hour.datetime.split(':');
      const hourNum = parseInt(hours, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum % 12 || 12;
      return `${displayHour}:00 ${ampm}`;
    });
    
    const temperatures = filteredHours.map(hour => Math.round(hour.temp));
    const precipitation = filteredHours.map(hour => Math.round(hour.precipprob));
    const humidity = filteredHours.map(hour => Math.round(hour.humidity));
    const windSpeed = filteredHours.map(hour => Math.round(hour.windspeed));

    // Calculate averages for the weather summary
    const avgTemp = Math.round(temperatures.reduce((a, b) => a + b, 0) / temperatures.length);
    const avgPrecip = Math.round(precipitation.reduce((a, b) => a + b, 0) / precipitation.length);
    const avgHumidity = Math.round(humidity.reduce((a, b) => a + b, 0) / humidity.length);
    const avgWind = Math.round(windSpeed.reduce((a, b) => a + b, 0) / windSpeed.length);

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°F)',
          data: temperatures,
          borderColor: theme.palette.error.main,
          backgroundColor: theme.palette.error.light,
          yAxisID: 'y',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
          fill: false,
        },
        {
          label: 'Precipitation Chance (%)',
          data: precipitation,
          borderColor: theme.palette.info.main,
          backgroundColor: theme.palette.info.light,
          yAxisID: 'y1',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
          fill: false,
        },
        {
          label: 'Humidity (%)',
          data: humidity,
          borderColor: theme.palette.success.main,
          backgroundColor: theme.palette.success.light,
          yAxisID: 'y1',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
          fill: false,
        },
        {
          label: 'Wind Speed (mph)',
          data: windSpeed,
          borderColor: theme.palette.warning.main,
          backgroundColor: theme.palette.warning.light,
          yAxisID: 'y2',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
          fill: false,
        },
      ],
      date: eventDayData.datetime,
      summary: {
        avgTemp,
        avgPrecip,
        avgHumidity,
        avgWind,
      }
    };
  }, [weatherData, eventDay, timeRange, theme, isNextWeek, weekOffset]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (items) => `Time: ${items[0].label}`,
          label: (context) => `${context.dataset.label || ''}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°F)',
          color: theme.palette.error.main,
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: { top: 10, bottom: 10 },
        },
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          padding: 8,
        },
        min: (context) => Math.floor(Math.min(...context.chart.data.datasets[0].data) / 10) * 10,
        max: (context) => Math.ceil(Math.max(...context.chart.data.datasets[0].data) / 10) * 10,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Percentage (%)',
          color: theme.palette.info.main,
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: { top: 10, bottom: 10 },
        },
        grid: {
          drawOnChartArea: false,
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          padding: 8,
        },
        min: 0,
        max: 100,
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Wind Speed (mph)',
          color: theme.palette.warning.main,
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: { top: 10, bottom: 10 },
        },
        grid: {
          drawOnChartArea: false,
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          padding: 8,
        },
        min: 0,
      },
      x: {
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: { size: 11 },
          padding: 8,
        },
      },
    },
  };

  if (!chartData) {
    return (
      <Paper elevation={3} className="loading-container">
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper elevation={3} className="weather-chart-container">
      <Box className="weather-chart-header">
        <Typography 
          variant="h6" 
          gutterBottom
          className="weather-chart-title"
        >
          {format(new Date(chartData.date), 'EEEE, MMMM d')}
        </Typography>
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
                Avg Temp: {chartData.summary.avgTemp}°F
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
      </Box>
      <Box className="weather-chart-wrapper">
        <Line options={options} data={chartData} />
      </Box>
    </Paper>
  );
};

export default WeatherChart;
