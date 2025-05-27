import React, { useState } from 'react';
import { Container, Box, Typography, Alert, CircularProgress, Fade, Grid } from '@mui/material';
import WeatherChart from './WeatherChart';
import Search from './LocationSearch';
import useWeather from '../hooks/useWeather';
import '../styles/Layout.css';

const Layout = () => {
  const [location, setLocation] = useState('');
  const [eventDay, setEventDay] = useState('friday');
  const [timeRange, setTimeRange] = useState('afternoon');

  const { weatherData, loading, error } = useWeather(
    location,
    eventDay,
    timeRange
  );

  const handleLocationSearch = (newLocation) => {
    setLocation(newLocation);
  };

  const handleEventDayChange = (newDay) => {
    setEventDay(newDay);
  };

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          className="title"
        >
          EventCast
        </Typography>
        <Typography
          variant="h6"
          align="center"
          className="subtitle"
        >
          Weather insights for perfect outdoor plans
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            className="error-alert"
            onClose={() => setLocation('')}
          >
            {error}
          </Alert>
        )}
        
        <Box className="search-container">
          <Search 
            onSearch={handleLocationSearch}
            eventDay={eventDay}
            timeRange={timeRange}
            onEventDayChange={handleEventDayChange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </Box>

        {loading ? (
          <Box className="loading-container">
            <CircularProgress size={60} />
          </Box>
        ) : weatherData ? (
          <Fade in={true}>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <WeatherChart
                    weatherData={weatherData}
                    eventDay={eventDay}
                    timeRange={timeRange}
                    isNextWeek={false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <WeatherChart
                    weatherData={weatherData}
                    eventDay={eventDay}
                    timeRange={timeRange}
                    isNextWeek={true}
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        ) : (
          <Box className="empty-state-container">
            <Typography variant="h6" className="empty-state-text">
              Enter a location to view weather forecast
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Layout;
