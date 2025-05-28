// Mock weather data for testing - Four weeks starting June 1st
const generateHourlyData = (baseTemp, conditions, date) => {
  const hours = [];
  const isSummer = date.getMonth() >= 5 && date.getMonth() <= 7; // June-July
  const baseTempVariation = isSummer ? 15 : 10; // More variation in summer
  
  for (let hour = 0; hour < 24; hour++) {
    // Temperature follows a daily pattern: cooler at night, warmer during day
    const hourTemp = baseTemp + 
      Math.sin((hour - 6) * Math.PI / 12) * baseTempVariation + // Daily cycle
      (Math.random() - 0.5) * 3; // Small random variation

    // Precipitation probability varies by condition
    let precipProb = 0;
    if (conditions === 'rain') {
      precipProb = 60 + Math.random() * 30;
    } else if (conditions === 'partly-cloudy-day') {
      precipProb = 20 + Math.random() * 20;
    } else {
      precipProb = Math.random() * 10;
    }

    // Humidity follows temperature pattern
    const humidity = 40 + Math.sin((hour - 6) * Math.PI / 12) * 30 + (Math.random() - 0.5) * 10;

    // Wind speed varies by time of day
    const windSpeed = 5 + Math.sin((hour - 12) * Math.PI / 12) * 5 + Math.random() * 3;

    hours.push({
      datetime: `${hour.toString().padStart(2, '0')}:00`,
      temp: Math.round(hourTemp),
      precipprob: Math.round(precipProb),
      humidity: Math.round(humidity),
      windspeed: Math.round(windSpeed * 10) / 10,
      conditions: conditions,
      icon: conditions
    });
  }
  return hours;
};

const generateMockData = () => {
  const days = [];
  const startDate = new Date('2025-06-01');
  const endDate = new Date('2025-07-31');
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const month = date.getMonth();
    const day = date.getDate();
    
    // Base temperature varies by month (warmer in July)
    const baseTemp = month === 6 ? 75 : 80; // June: 75°F, July: 80°F
    
    // Determine weather conditions based on date patterns
    let conditions;
    if (day % 7 === 0) {
      conditions = 'rain'; // Rain every 7th day
    } else if (day % 3 === 0) {
      conditions = 'partly-cloudy-day'; // Partly cloudy every 3rd day
    } else {
      conditions = 'clear-day'; // Clear otherwise
    }

    // Temperature ranges based on conditions
    const tempMax = baseTemp + (conditions === 'clear-day' ? 5 : 0);
    const tempMin = baseTemp - (conditions === 'clear-day' ? 5 : 0);
    const temp = (tempMax + tempMin) / 2;

    // Precipitation probability based on conditions
    const precipprob = conditions === 'rain' ? 70 : conditions === 'partly-cloudy-day' ? 30 : 10;

    // Humidity varies by month (higher in July)
    const humidity = month === 6 ? 60 : 65;

    // Wind speed varies by month (slightly higher in July)
    const windspeed = month === 6 ? 8 : 10;

    // Sunrise and sunset times vary by month
    const sunrise = month === 6 ? '5:45 AM' : '5:30 AM';
    const sunset = month === 6 ? '8:30 PM' : '8:15 PM';

    days.push({
      datetime: date.toISOString().split('T')[0],
      tempmax: Math.round(tempMax),
      tempmin: Math.round(tempMin),
      temp: Math.round(temp),
      humidity: Math.round(humidity),
      precipprob: Math.round(precipprob),
      conditions: conditions,
      icon: conditions,
      sunrise: sunrise,
      sunset: sunset,
      hours: generateHourlyData(temp, conditions, date)
    });
  }

  return { days };
};

const mockWeatherData = generateMockData();

export default mockWeatherData; 