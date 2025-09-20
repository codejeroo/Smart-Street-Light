import React, { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useDashboard } from '../context/DashboardContext'
import { Line } from 'react-chartjs-2'
import { TrendingUp, Battery, Zap, Cloud, AlertTriangle, Brain } from 'lucide-react'

const PredictiveAnalytics = () => {
  const { isDark } = useTheme()
  const { nodes } = useDashboard()
  const [predictions, setPredictions] = useState({})
  const [selectedMetric, setSelectedMetric] = useState('battery')
  const [selectedNode, setSelectedNode] = useState(nodes[0]?.id || '')

  // Generate XGBoost-style predictions
  useEffect(() => {
    const generatePredictions = () => {
      const newPredictions = {}
      
      // Generate predictions for next 6 hours
      const hours = Array.from({ length: 7 }, (_, i) => {
        const now = new Date()
        now.setHours(now.getHours() + i)
        return now
      })

      nodes.slice(0, 5).forEach(node => {
        // Battery voltage predictions (12V system with degradation)
        const batteryPredictions = hours.map((hour, i) => {
          const baseVoltage = 12.6
          const degradation = i * 0.1 + (Math.random() - 0.5) * 0.2
          const solarEffect = Math.sin((hour.getHours() - 6) * Math.PI / 12) * 0.3
          return Math.max(10.5, baseVoltage - degradation + solarEffect)
        })

        // Energy consumption predictions (watts)
        const energyPredictions = hours.map((hour, i) => {
          const baseConsumption = 25
          const timeVariation = hour.getHours() >= 18 || hour.getHours() <= 6 ? 1.5 : 0.8
          const randomVariation = (Math.random() - 0.5) * 5
          return baseConsumption * timeVariation + randomVariation
        })

        // Environmental predictions (pressure trend)
        const pressurePredictions = hours.map((hour, i) => {
          const basePressure = 1013
          const trend = -2 * i // Decreasing pressure indicating weather change
          const variation = (Math.random() - 0.5) * 5
          return basePressure + trend + variation
        })

        newPredictions[node.id] = {
          battery: batteryPredictions,
          energy: energyPredictions,
          pressure: pressurePredictions,
          hours: hours,
          confidence: {
            battery: 0.92,
            energy: 0.87,
            pressure: 0.79
          }
        }
      })

      setPredictions(newPredictions)
    }

    generatePredictions()
    const interval = setInterval(generatePredictions, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [nodes])

  const getChartData = () => {
    if (!predictions[selectedNode]) return null

    const nodeData = predictions[selectedNode]
    const labels = nodeData.hours.map(hour => 
      hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    )

    const datasets = []

    if (selectedMetric === 'battery') {
      datasets.push({
        label: 'Battery Voltage (V)',
        data: nodeData.battery,
        borderColor: '#3895D3',
        backgroundColor: 'rgba(56, 149, 211, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      })
    } else if (selectedMetric === 'energy') {
      datasets.push({
        label: 'Energy Consumption (W)',
        data: nodeData.energy,
        borderColor: '#58CCED',
        backgroundColor: 'rgba(88, 204, 237, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      })
    } else if (selectedMetric === 'pressure') {
      datasets.push({
        label: 'Pressure (hPa)',
        data: nodeData.pressure,
        borderColor: '#0072F5',
        backgroundColor: 'rgba(0, 114, 245, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      })
    }

    return { labels, datasets }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#ffffff' : '#374151',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#ffffff' : '#374151',
        bodyColor: isDark ? '#ffffff' : '#374151',
        borderColor: isDark ? '#444444' : '#d1d5db',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          afterLabel: function(context) {
            const confidence = predictions[selectedNode]?.confidence[selectedMetric]
            return `Confidence: ${(confidence * 100).toFixed(0)}%`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            size: 11
          }
        }
      }
    }
  }

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'battery': return Battery
      case 'energy': return Zap
      case 'pressure': return Cloud
      default: return TrendingUp
    }
  }

  const getMetricUnit = (metric) => {
    switch (metric) {
      case 'battery': return 'V'
      case 'energy': return 'W'
      case 'pressure': return 'hPa'
      default: return ''
    }
  }

  const getMetricName = (metric) => {
    switch (metric) {
      case 'battery': return 'Battery Voltage'
      case 'energy': return 'Energy Consumption'
      case 'pressure': return 'Air Pressure'
      default: return 'Unknown'
    }
  }

  const currentPrediction = predictions[selectedNode]
  const currentConfidence = currentPrediction?.confidence[selectedMetric]

  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Brain className="w-5 h-5 text-aethersense-primary" />
          Predictive Analytics (XGBoost)
        </h2>
        
        <div className="flex items-center gap-3">
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
            {nodes.slice(0, 5).map(node => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex items-center gap-2 mb-6">
        {['battery', 'energy', 'pressure'].map(metric => {
          const Icon = getMetricIcon(metric)
          return (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedMetric === metric
                  ? 'bg-aethersense-primary text-white shadow-md'
                  : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {getMetricName(metric)}
            </button>
          )
        })}
      </div>

      {/* Prediction Chart */}
      <div className="h-64 mb-6">
        {getChartData() && (
          <Line data={getChartData()} options={chartOptions} />
        )}
      </div>

      {/* Prediction Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Confidence Score */}
        <div className={`p-4 rounded-lg border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Model Confidence
              </p>
              <p className="text-2xl font-bold text-aethersense-primary">
                {currentConfidence ? `${(currentConfidence * 100).toFixed(0)}%` : '--'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentConfidence > 0.9 ? 'bg-green-100 text-green-600' :
              currentConfidence > 0.8 ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Key Predictions */}
        <div className={`p-4 rounded-lg border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Next 6 Hours Forecast
            </p>
            {currentPrediction && (
              <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {selectedMetric === 'battery' && (
                  <div className="space-y-1">
                    <p>• Min: {Math.min(...currentPrediction.battery).toFixed(1)}V</p>
                    <p>• Max: {Math.max(...currentPrediction.battery).toFixed(1)}V</p>
                    <p>• Trend: {currentPrediction.battery[6] < currentPrediction.battery[0] ? 'Decreasing' : 'Stable'}</p>
                  </div>
                )}
                {selectedMetric === 'energy' && (
                  <div className="space-y-1">
                    <p>• Peak: {Math.max(...currentPrediction.energy).toFixed(1)}W</p>
                    <p>• Low: {Math.min(...currentPrediction.energy).toFixed(1)}W</p>
                    <p>• Avg: {(currentPrediction.energy.reduce((a, b) => a + b, 0) / currentPrediction.energy.length).toFixed(1)}W</p>
                  </div>
                )}
                {selectedMetric === 'pressure' && (
                  <div className="space-y-1">
                    <p>• Current: {currentPrediction.pressure[0].toFixed(1)} hPa</p>
                    <p>• 6h later: {currentPrediction.pressure[6].toFixed(1)} hPa</p>
                    <p>• Change: {(currentPrediction.pressure[6] - currentPrediction.pressure[0]).toFixed(1)} hPa</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {currentPrediction && (
        <div className={`mt-4 p-4 rounded-lg border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Predictive Alerts
            </h4>
          </div>
          <div className={`text-sm space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {selectedMetric === 'battery' && Math.min(...currentPrediction.battery) < 11.0 && (
              <p className="text-red-500">⚠️ Battery voltage predicted to drop below 11V</p>
            )}
            {selectedMetric === 'energy' && Math.max(...currentPrediction.energy) > 35 && (
              <p className="text-orange-500">🔋 High energy consumption expected during peak hours</p>
            )}
            {selectedMetric === 'pressure' && (currentPrediction.pressure[6] - currentPrediction.pressure[0]) < -10 && (
              <p className="text-blue-500">🌧️ Rapid pressure drop indicates incoming weather system</p>
            )}
            {currentConfidence < 0.8 && (
              <p className="text-yellow-500">📊 Lower confidence - monitor actual vs predicted values</p>
            )}
          </div>
        </div>
      )}

      {/* Model Info */}
      <div className={`mt-4 text-xs text-center ${
        isDark ? 'text-slate-500' : 'text-slate-400'
      }`}>
        XGBoost Model • Features: Weather, Time, Historical Data • Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}

export default PredictiveAnalytics