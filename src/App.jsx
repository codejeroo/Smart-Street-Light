import React, { useState, useEffect } from 'react'
import { DashboardProvider } from './context/DashboardContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Header from './components/Header'
import MapView from './components/MapView'
import NetworkPerformance from './components/NetworkPerformance'
import EnergyPanel from './components/EnergyPanel'
import SystemAlerts from './components/SystemAlerts'
import SignalQuality from './components/SignalQuality'
import EconomicAnalysis from './components/EconomicAnalysis'
import TechnologyComparison from './components/TechnologyComparison'
import DataLogging from './components/DataLogging'

function AppContent() {
  const { isDark } = useTheme()
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <Header />
      
      {/* Main Dashboard Grid */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Map View - Full Width */}
          <div className="col-span-full">
            <MapView />
          </div>
          
          {/* Network Performance */}
          <div className="lg:col-span-1">
            <NetworkPerformance />
          </div>
          
          {/* Energy Panel */}
          <div className="lg:col-span-1">
            <EnergyPanel />
          </div>
          
          {/* System Alerts */}
          <div className="lg:col-span-1 xl:col-span-1">
            <SystemAlerts />
          </div>
          
          {/* Signal Quality */}
          <div className="lg:col-span-1">
            <SignalQuality />
          </div>
          
          {/* Economic Analysis */}
          <div className="lg:col-span-1">
            <EconomicAnalysis />
          </div>
          
          {/* Technology Comparison - Full Width */}
          <div className="col-span-full xl:col-span-1">
            <TechnologyComparison />
          </div>
          
          {/* Data Logging - Full Width */}
          <div className="col-span-full">
            <DataLogging />
          </div>
          
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </ThemeProvider>
  )
}

export default App