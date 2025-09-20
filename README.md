# Smart Street Light Monitoring Dashboard

A modern, responsive web dashboard for monitoring solar-powered smart streetlights using LoRa and WSN data transmission technologies.

## Features

### Dashboard Components
1. **Real-time Map View** - Interactive map showing streetlight locations with color-coded status
2. **Network Performance Panel** - PDR, latency, throughput, and network capacity metrics  
3. **Energy & Sensor Data Panel** - Battery voltage, solar charging status, ambient light, and power consumption
4. **System Alerts Panel** - Active faults, communication failures, and system warnings
5. **Signal Quality Charts** - RSSI and SNR visualization across distance
6. **Economic Analysis** - IRR, BCR, NPV, and payback period comparison
7. **Technology Comparison** - WSN vs LoRa side-by-side metrics with radar charts
8. **Data Logging Table** - Historical records with CSV export functionality

### Technologies Used
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS v3
- **Charts**: Chart.js with react-chartjs-2
- **Maps**: Leaflet with react-leaflet
- **Icons**: Lucide React
- **State Management**: React Context API

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Navigate to project directory**
   ```bash
   cd "Smart Street Light"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Alternative Installation (if PowerShell execution policy issues)

If you encounter PowerShell execution policy errors on Windows:

1. **Enable script execution** (Run PowerShell as Administrator):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Or use Node.js directly**:
   ```cmd
   node node_modules/.bin/vite
   ```

## Project Structure

```
Smart Street Light/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation header with technology toggle
│   │   ├── MapView.jsx          # Interactive streetlight location map
│   │   ├── NetworkPerformance.jsx # Network metrics display
│   │   ├── EnergyPanel.jsx      # Energy and sensor data
│   │   ├── SystemAlerts.jsx     # System alerts and notifications
│   │   ├── SignalQuality.jsx    # RSSI/SNR charts
│   │   ├── EconomicAnalysis.jsx # Financial comparison metrics
│   │   ├── TechnologyComparison.jsx # WSN vs LoRa radar charts
│   │   └── DataLogging.jsx      # Historical data table
│   ├── context/
│   │   └── DashboardContext.jsx # Global state management
│   ├── utils/
│   │   └── index.js            # Utility functions
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind CSS imports
├── css/
│   └── styles.css             # Additional custom styles
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js           # Vite build configuration
└── postcss.config.js        # PostCSS configuration
```

## Key Features

### Data Simulation
- Real-time data updates every 10 seconds
- Mock WSN and LoRa performance metrics
- Simulated streetlight node statuses and sensor readings

### Technology Comparison
- **WSN Performance**: 24.5ms latency, 979.59 bps throughput, 7285% IRR
- **LoRa Performance**: 198.88ms latency, 150.85 bps throughput, 3367% IRR
- **Signal Quality**: RSSI values from -64dBm (100m) to -70dBm (250m)

### Economic Metrics
- **WSN**: IRR 7285%, BCR ₱588.12, NPV ₱23.37M, 1-year payback
- **LoRa**: IRR 3367%, BCR ₱272.12, NPV ₱23.27M, 1-year payback

### Responsive Design
- Mobile-first responsive layout
- Dark theme for professional appearance
- Accessibility features with ARIA labels
- Touch-friendly interface elements

## Usage

### Technology Toggle
Switch between WSN and LoRa technologies using the toggle in the header to compare real-time metrics.

### Map Interaction
- Click on streetlight markers to view detailed node information
- Color coding: Green (Online), Red (Offline), Yellow (Fault)

### Data Export
Export historical data to CSV format using the Export button in the Data Logging panel.

### Charts & Visualizations
- Interactive charts with hover tooltips
- Real-time updates reflecting current technology selection
- Responsive chart sizing for different screen sizes

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_MAP_CENTER_LAT=14.5995
VITE_MAP_CENTER_LNG=120.9842
VITE_UPDATE_INTERVAL=10000
```

### Customization
- Modify `tailwind.config.js` for custom styling
- Update `src/context/DashboardContext.jsx` for different data simulation
- Adjust chart configurations in component files

## Browser Support
- Chrome 80+
- Firefox 78+
- Safari 13+
- Edge 80+

## Performance Optimization
- Component memoization with React.memo
- Efficient state updates with useCallback and useMemo
- Lazy loading for chart components
- Optimized bundle size with Vite

## Troubleshooting

### Common Issues

1. **PowerShell Execution Policy Error**
   - Run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
   - Or use Command Prompt instead

2. **Port Already in Use**
   - Change port in `vite.config.js` or kill process on port 5173

3. **Chart Not Rendering**
   - Ensure Chart.js components are properly registered
   - Check console for JavaScript errors

4. **Map Not Loading**
   - Verify internet connection for tile server
   - Check browser console for network errors

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Ensure all dependencies are properly installed

---

**Dashboard Preview**: The dashboard provides comprehensive monitoring capabilities for solar-powered smart streetlight networks, featuring real-time data visualization, economic analysis, and technology comparison tools for effective network management.