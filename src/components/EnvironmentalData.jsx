import React, { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useDashboard } from '../context/DashboardContext'
import { Thermometer, Droplets, Gauge, Lightbulb, Cloud } from 'lucide-react'

const EnvironmentalData = () => {
  const { isDark } = useTheme()
  const { nodes } = useDashboard()
  const [selectedNode, setSelectedNode] = useState(nodes[0]?.id || '')
  const [environmentalData, setEnvironmentalData] = useState({})

  // Generate environmental data for all nodes
  useEffect(() => {
    const generateEnvironmentalData = () => {
      const newData = {}
      nodes.forEach(node => {
        // Simulate tropical climate data for Caraga region
        const baseTemp = 27 // Average tropical temperature
        const baseHumidity = 75 // High humidity for tropical climate
        const basePressure = 1013 // Sea level pressure

        newData[node.id] = {
          temperature: (baseTemp + (Math.random() - 0.5) * 8).toFixed(1), // 23-31°C
          humidity: (baseHumidity + (Math.random() - 0.5) * 20).toFixed(1), // 65-85%
          pressure: (basePressure + (Math.random() - 0.5) * 30).toFixed(1), // 998-1028 hPa
          lightIntensity: (Math.random() * 100000).toFixed(0), // 0-100,000 lux
          timestamp: new Date().toISOString()
        }
      })
      setEnvironmentalData(newData)
    }

    generateEnvironmentalData()
    const interval = setInterval(generateEnvironmentalData, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [nodes])

  const currentData = environmentalData[selectedNode] || {}

  const getTemperatureColor = (temp) => {
    if (temp < 20) return 'text-blue-500'
    if (temp < 25) return 'text-green-500'
    if (temp < 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getHumidityColor = (humidity) => {
    if (humidity < 40) return 'text-orange-500'
    if (humidity < 70) return 'text-green-500'
    return 'text-blue-500'
  }

  const getPressureColor = (pressure) => {
    if (pressure < 1000) return 'text-red-500'
    if (pressure < 1020) return 'text-green-500'
    return 'text-blue-500'
  }

  const getLightIntensityColor = (lux) => {
    if (lux < 1000) return 'text-slate-500' // Very low light
    if (lux < 10000) return 'text-yellow-500' // Low light
    if (lux < 50000) return 'text-orange-500' // Moderate light
    return 'text-yellow-400' // Bright light
  }

  const getLightIntensityLabel = (lux) => {
    if (lux < 1000) return 'Very Low'
    if (lux < 10000) return 'Low'
    if (lux < 50000) return 'Moderate'
    return 'Bright'
  }

  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Cloud className="w-5 h-5 text-aethersense-primary" />
          Environmental Data - Caraga Region XIII
        </h2>
        
        {/* Node Selector */}
        <select
          value={selectedNode}
          onChange={(e) => setSelectedNode(e.target.value)}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            isDark
              ? 'bg-slate-700 border-slate-600 text-white'
              : 'bg-white border-slate-300 text-slate-900'
          }`}
        >
          {nodes.slice(0, 10).map(node => (
            <option key={node.id} value={node.id}>
              {node.name}
            </option>
          ))}
        </select>
      </div>

      {/* Environmental Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {/* Temperature */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Thermometer className={`h-5 w-5 ${getTemperatureColor(currentData.temperature)}`} />
            <div>
              <p className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Temperature
              </p>
              <p className={`text-lg font-bold ${getTemperatureColor(currentData.temperature)}`}>
                {currentData.temperature || '--'}°C
              </p>
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Droplets className={`h-5 w-5 ${getHumidityColor(currentData.humidity)}`} />
            <div>
              <p className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Humidity
              </p>
              <p className={`text-lg font-bold ${getHumidityColor(currentData.humidity)}`}>
                {currentData.humidity || '--'}%
              </p>
            </div>
          </div>
        </div>

        {/* Pressure */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Gauge className={`h-5 w-5 ${getPressureColor(currentData.pressure)}`} />
            <div>
              <p className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Pressure
              </p>
              <p className={`text-lg font-bold ${getPressureColor(currentData.pressure)}`}>
                {currentData.pressure || '--'} hPa
              </p>
            </div>
          </div>
        </div>

        {/* Light Intensity */}
        <div className={`p-4 rounded-lg border transition-colors ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Lightbulb className={`h-5 w-5 ${getLightIntensityColor(currentData.lightIntensity)}`} />
            <div>
              <p className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Light Intensity
              </p>
              <p className={`text-lg font-bold ${getLightIntensityColor(currentData.lightIntensity)}`}>
                {currentData.lightIntensity ? `${Math.round(currentData.lightIntensity / 1000)}k` : '--'} lux
              </p>
              <p className={`text-xs ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}>
                {currentData.lightIntensity ? getLightIntensityLabel(currentData.lightIntensity) : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Insights */}
      <div className={`mt-4 p-4 rounded-lg border ${
        isDark 
          ? 'bg-slate-700/50 border-slate-600' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <h4 className={`text-sm font-semibold mb-2 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Environmental Insights
        </h4>
        <div className={`text-sm space-y-1 ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {currentData.pressure < 1000 && (
            <p className="text-red-500">⚠️ Low pressure detected - possible storm approaching</p>
          )}
          {currentData.humidity > 80 && (
            <p className="text-blue-500">💧 High humidity - condensation risk on equipment</p>
          )}
          {currentData.temperature > 32 && (
            <p className="text-orange-500">🌡️ High temperature - monitor battery performance</p>
          )}
          {currentData.lightIntensity < 1000 && (
            <p className="text-yellow-500">💡 Low light detected - streetlights may need to activate</p>
          )}
          {currentData.lightIntensity > 50000 && (
            <p className="text-green-500">☀️ Bright conditions - optimal solar charging</p>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className={`mt-4 text-xs text-center ${
        isDark ? 'text-slate-500' : 'text-slate-400'
      }`}>
        Last updated: {currentData.timestamp ? new Date(currentData.timestamp).toLocaleTimeString() : '--'}
      </div>
    </div>
  )
}

export default EnvironmentalData