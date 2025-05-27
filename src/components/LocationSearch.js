import React, { useState } from 'react';
import { Paper, TextField, Box, Button, CircularProgress, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import '../styles/LocationSearch.css';

const Search = ({ onSearch, eventDay, timeRange, onEventDayChange, onTimeRangeChange }) => {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  const timeRanges = [
    { value: 'morning', label: 'Morning (8AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
    { value: 'evening', label: 'Evening (5PM - 9PM)' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    
    setIsLoading(true);
    onSearch(location.trim());
    setIsLoading(false);
  };

  return (
    <Paper elevation={3} className="search-container">
      <Typography variant="h6" gutterBottom className="search-title">
        <LocationOnIcon /> Plan Your Event
      </Typography>
      
      <Box className="search-form">
        <Box 
          component="form" 
          onSubmit={handleSearch} 
          className="search-input-container"
        >
          <TextField
            fullWidth
            label="Enter Location"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Central Park, New York"
            disabled={isLoading}
            className="search-input"
            slotProps={{
              input: {
                startAdornment: (
                  <LocationOnIcon className="icon" />
                ),
              }
            }}
          />
          <Button
            variant="contained"
            type="submit"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            className="search-button"
            disabled={isLoading || !location.trim()}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Box>

        <Box className="event-settings">
          <FormControl fullWidth className="form-control">
            <InputLabel>Event Day</InputLabel>
            <Select
              value={eventDay}
              label="Event Day"
              onChange={(e) => onEventDayChange(e.target.value)}
              startAdornment={
                <CalendarTodayIcon className="select-icon" />
              }
            >
              {days.map(({ value, label }) => (
                <MenuItem 
                  key={value} 
                  value={value}
                  className="menu-item"
                >
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth className="form-control">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => onTimeRangeChange(e.target.value)}
              startAdornment={
                <AccessTimeIcon className="select-icon" />
              }
            >
              {timeRanges.map(({ value, label }) => (
                <MenuItem 
                  key={value} 
                  value={value}
                  className="menu-item"
                >
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
};

export default Search; 