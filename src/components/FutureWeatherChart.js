import React, { useMemo } from 'react';
import { Box, Paper, CircularProgress, useTheme } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getEventDayData, WeatherChartHeader } from '../utils/weatherUtils';
import '../styles/WeatherChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FutureWeatherChart = ({ weatherData, eventDay, timeRange, isNextWeek, weekOffset }) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    const eventDayData = getEventDayData(weatherData, eventDay, weekOffset, isNextWeek);
    if (!eventDayData) return null;

    return {
      labels: ['Temperature'],
      datasets: [
        {
          label: 'Max Temperature',
          data: [eventDayData.tempmax],
          backgroundColor: theme.palette.error.light,
          borderColor: theme.palette.error.main,
          borderWidth: 1,
        },
        {
          label: 'Average Temperature',
          data: [eventDayData.temp],
          backgroundColor: theme.palette.error.main,
          borderColor: theme.palette.error.dark,
          borderWidth: 1,
        },
        {
          label: 'Min Temperature',
          data: [eventDayData.tempmin],
          backgroundColor: theme.palette.error.light,
          borderColor: theme.palette.error.main,
          borderWidth: 1,
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
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rect',
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
          title: (items) => `Temperature Range`,
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}°F`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          padding: 8,
          callback: (value) => `${value}°F`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
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
      <WeatherChartHeader chartData={chartData} theme={theme} />
      <Box className="weather-chart-wrapper">
        <Bar options={options} data={chartData} />
      </Box>
    </Paper>
  );
};

export default FutureWeatherChart; 