import axios from 'axios';

const API_KEY = process.env.REACT_APP_VISUAL_CROSSING_API_KEY;
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

// Verify API key is loaded
if (!API_KEY) {
  console.warn('Visual Crossing API key is not set. Please add REACT_APP_VISUAL_CROSSING_API_KEY to your .env file');
}

const weatherApi = {
  async getForecast(location, startDate, endDate) {
    try {
      const response = await axios.get(`${BASE_URL}/${location}/${startDate}/${endDate}`, {
        params: {
          key: API_KEY,
          unitGroup: 'us', // Use US units (Fahrenheit, mph, etc.)
          include: 'days,hours,current,alerts',
          contentType: 'json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
};

export default weatherApi; 