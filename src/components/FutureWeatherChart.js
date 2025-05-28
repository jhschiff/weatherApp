import React, { useMemo } from 'react';
import { Box, Paper, CircularProgress, useTheme, Typography, useMediaQuery } from '@mui/material';
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
import { getEventDayData, WeatherChartHeader } from '../utils/weatherUtils';
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

const FutureWeatherChart = ({ weatherData, eventDay, isNextWeek, weekOffset }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const chartData = useMemo(() => {
    const eventDayData = getEventDayData(weatherData, eventDay, weekOffset, isNextWeek);
    if (!eventDayData) return null;

    return {
      labels: ['Temperature', 'Precipitation', 'Humidity', 'Wind Speed'],
      datasets: [
        {
          label: 'Max Temperature',
          data: [eventDayData.tempmax, null, null, null],
          borderColor: theme.palette.error.main,
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Average Temperature',
          data: [eventDayData.temp, null, null, null],
          borderColor: theme.palette.primary.main,
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: 'y',
        },
        {
          label: 'Min Temperature',
          data: [eventDayData.tempmin, null, null, null],
          borderColor: theme.palette.info.main,
          backgroundColor: 'rgba(2, 136, 209, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Precipitation Chance',
          data: [null, eventDayData.precipprob, null, null],
          borderColor: theme.palette.info.light,
          backgroundColor: 'rgba(2, 136, 209, 0.05)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        },
        {
          label: 'Humidity',
          data: [null, null, eventDayData.humidity, null],
          borderColor: theme.palette.success.main,
          backgroundColor: 'rgba(46, 125, 50, 0.05)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        },
        {
          label: 'Wind Speed',
          data: [null, null, null, eventDayData.windspeed],
          borderColor: theme.palette.warning.main,
          backgroundColor: 'rgba(237, 108, 2, 0.05)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y2',
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
        icon: eventDayData.icon
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
          padding: isMobile ? 10 : 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: isMobile ? 10 : 12,
            weight: 'bold',
          },
          boxWidth: isMobile ? 8 : 12,
          boxHeight: isMobile ? 8 : 12,
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: isMobile ? 8 : 12,
        boxPadding: isMobile ? 4 : 6,
        usePointStyle: true,
        titleFont: {
          size: isMobile ? 12 : 14,
          weight: 'bold',
        },
        bodyFont: {
          size: isMobile ? 11 : 13,
        },
        callbacks: {
          title: (items) => items[0].label,
          label: (context) => {
            const value = context.parsed.y;
            if (value === null) return null;
            const label = context.dataset.label;
            if (label.includes('Temperature')) {
              return `${label}: ${value.toFixed(1)}°F`;
            } else if (label.includes('Precipitation') || label.includes('Humidity')) {
              return `${label}: ${value}%`;
            } else {
              return `${label}: ${value} mph`;
            }
          },
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
            size: isMobile ? 10 : 12,
            weight: 'bold',
          },
        },
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          font: { size: isMobile ? 9 : 11 },
          padding: isMobile ? 4 : 8,
          callback: (value) => `${value}°F`,
        },
        suggestedMin: (context) => {
          const minTemp = Math.min(...context.chart.data.datasets.slice(0, 3).map(d => d.data[0]).filter(v => v !== null));
          return Math.floor(minTemp - 5);
        },
        suggestedMax: (context) => {
          const maxTemp = Math.max(...context.chart.data.datasets.slice(0, 3).map(d => d.data[0]).filter(v => v !== null));
          return Math.ceil(maxTemp + 5);
        }
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
            size: isMobile ? 10 : 12,
            weight: 'bold',
          },
        },
        grid: {
          drawOnChartArea: false,
          drawBorder: false,
        },
        ticks: {
          font: { size: isMobile ? 9 : 11 },
          padding: isMobile ? 4 : 8,
          callback: (value) => `${value}%`,
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
            size: isMobile ? 10 : 12,
            weight: 'bold',
          },
        },
        grid: {
          drawOnChartArea: false,
          drawBorder: false,
        },
        ticks: {
          font: { size: isMobile ? 9 : 11 },
          padding: isMobile ? 4 : 8,
          callback: (value) => `${value} mph`,
        },
        min: 0,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: isMobile ? 9 : 11 },
          padding: isMobile ? 4 : 8,
        },
        offset: true,
        min: -0.5,
        max: 3.5
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
      <WeatherChartHeader chartData={chartData} theme={theme} />
      <Typography 
        variant="caption" 
        sx={{ 
          textAlign: 'center', 
          display: 'block',
          color: theme.palette.text.secondary,
          mb: 1,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.7rem' : '0.75rem',
          px: isMobile ? 1 : 0
        }}
      >
        * Based on historical weather averages for this time period
      </Typography>
      <Box 
        className="weather-chart-wrapper" 
        sx={{ 
          px: isMobile ? 1 : 4,
          height: isMobile ? '300px' : '400px'
        }}
      >
        <Line options={options} data={chartData} />
      </Box>
    </Paper>
  );
};

export default FutureWeatherChart; 