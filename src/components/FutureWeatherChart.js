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
import { format, parseISO } from 'date-fns';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import { getWeatherDescription, getEventDayData } from '../utils/weatherUtils';
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

const FutureWeatherChart = ({ weatherData, eventDay, timeRange, isNextWeek, weekOffset }) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    const eventDayData = getEventDayData(weatherData, eventDay, weekOffset, isNextWeek);
    if (!eventDayData) return null;

    const { normal } = eventDayData;
    if (!normal) return null;

    return {
      labels: ['Temperature (°F)', 'Precipitation (in)', 'Humidity (%)', 'Wind Speed (mph)'],
      datasets: [
        {
          label: 'Forecast',
          data: [
            eventDayData.temp,
            eventDayData.precip,
            eventDayData.humidity,
            eventDayData.windspeed
          ],
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.light,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'Normal Range',
          data: [
            normal.tempmin[1],
            normal.precip[1],
            normal.humidity[1],
            normal.windspeed[1]
          ],
          borderColor: theme.palette.secondary.main,
          backgroundColor: theme.palette.secondary.light,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderDash: [5, 5],
        }
      ],
      date: eventDayData.datetime,
      summary: {
        avgTemp: Math.round(eventDayData.temp),
        avgPrecip: Math.round(eventDayData.precipprob),
        avgHumidity: Math.round(eventDayData.humidity),
        avgWind: Math.round(eventDayData.windspeed),
        conditions: eventDayData.conditions,
        sunrise: eventDayData.sunrise,
        sunset: eventDayData.sunset,
      }
    };
  }, [weatherData, eventDay, theme, isNextWeek, weekOffset]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
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
          title: (items) => `Weather Metric: ${items[0].label}`,
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          padding: 8,
        },
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
          {format(parseISO(chartData.date), 'EEEE, MMMM d')}
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
                Temp: {chartData.summary.avgTemp}°F
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
          <Typography variant="body2" color="text.secondary">
            Conditions: {chartData.summary.conditions}
          </Typography>
        </Box>
      </Box>
      <Box className="weather-chart-wrapper">
        <Line options={options} data={chartData} />
      </Box>
    </Paper>
  );
};

export default FutureWeatherChart; 