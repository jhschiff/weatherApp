import React, { useState } from 'react';
import { Container, Box, Typography, Alert, CircularProgress, Fade, Grid, Button, ButtonGroup } from '@mui/material';
import WeatherChart from './WeatherChart';
import Search from './LocationSearch';
import useWeather from '../hooks/useWeather';
import '../styles/Layout.css';

const Layout = () => {
  const [location, setLocation] = useState('');
  const [eventDay, setEventDay] = useState('friday');
  const [timeRange, setTimeRange] = useState('afternoon');
  const [weekOffset, setWeekOffset] = useState(0);

  const { weatherData, loading, error } = useWeather(
    location,
    eventDay,
    timeRange,
    weekOffset
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

  const handlePreviousWeeks = () => {
    setWeekOffset(prev => Math.max(0, prev - 2));
  };

  const handleNextWeeks = () => {
    setWeekOffset(prev => prev + 2);
  };

  const getWeekRangeText = () => {
    if (weekOffset === 0) return 'Current Two Weeks';
    return `Weeks ${weekOffset + 1}-${weekOffset + 2}`;
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
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <ButtonGroup variant="contained" aria-label="week navigation">
                  <Button
                    onClick={handlePreviousWeeks}
                    disabled={weekOffset === 0}
                  >
                    Previous Two Weeks
                  </Button>
                  <Button
                    onClick={handleNextWeeks}
                  >
                    Next Two Weeks
                  </Button>
                </ButtonGroup>
              </Box>
              <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
                {getWeekRangeText()}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <WeatherChart
                    weatherData={weatherData}
                    eventDay={eventDay}
                    timeRange={timeRange}
                    isNextWeek={false}
                    weekOffset={weekOffset}
                  />
                </Grid>
                <Grid item xs={12}>
                  <WeatherChart
                    weatherData={weatherData}
                    eventDay={eventDay}
                    timeRange={timeRange}
                    isNextWeek={true}
                    weekOffset={weekOffset}
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
