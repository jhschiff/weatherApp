# EventCast - Weather Forecast App

EventCast is a modern web application that helps users plan outdoor events by providing detailed weather forecasts. The app allows users to check weather conditions for specific days and time ranges, making it easier to plan outdoor activities.

## Features

- 🔍 Location-based weather forecasting
- 📅 Day and time range selection
- 📊 Interactive weather charts
- 🌡️ Temperature, precipitation, humidity, and wind speed data
- 📱 Responsive design for all devices
- 🎨 Modern Material-UI interface

## Tech Stack

- React.js
- Material-UI (MUI)
- Chart.js for data visualization
- date-fns for date manipulation
- CSS Modules for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Visual Crossing Weather API key

### Environment Variables

Create a `.env` file in the root directory with your API key:
```
REACT_APP_VISUAL_CROSSING_API_KEY=your_api_key_here
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The app will be available at `http://localhost:3000`

## Usage

1. Enter a location in the search bar
2. Select your preferred event day (Monday through Sunday)
3. Choose a time range (Morning, Afternoon, or Evening)
4. View the detailed weather forecast with interactive charts

### Data Fetching

The app fetches weather data in the following way:
- Initial fetch includes 4 weeks of data
- Additional data is fetched automatically when viewing future weeks
- Data is cached to prevent unnecessary API calls
- Mock data is available for development (disabled by default)

## Project Structure

```
src/
├── components/
│   ├── Layout.js
│   ├── LocationSearch.js
│   └── WeatherChart.js
├── hooks/
│   └── useWeather.js
├── services/
│   └── weatherApi.js
├── styles/
│   └── *.css
└── App.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [Weather API]
- Icons from Material-UI
- Chart.js for the beautiful visualizations
