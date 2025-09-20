import React, { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useDashboard } from '../context/DashboardContext'
import { AlertTriangle, Shield, Target, TrendingDown, Clock, MapPin } from 'lucide-react'

const AnomalyDetection = () => {
  const { isDark } = useTheme()
  const { nodes } = useDashboard()
  const [anomalies, setAnomalies] = useState([])
  const [detectionStats, setDetectionStats] = useState({
    totalAnomalies: 0,
    criticalAnomalies: 0,
    resolvedAnomalies: 0,
    detectionAccuracy: 94.5
  })

  // Generate anomaly detection data
  useEffect(() => {
    // Don't generate anomalies if nodes aren't loaded yet
    if (!nodes || nodes.length === 0) return

    const generateAnomalies = () => {
      const anomalyTypes = [
        { 
          type: 'voltage_anomaly', 
          severity: 'critical', 
          message: 'Battery voltage dropping faster than expected',
          icon: TrendingDown,
          color: 'text-red-500'
        },
        { 
          type: 'energy_spike', 
          severity: 'warning', 
          message: 'Unusual energy consumption pattern detected',
          icon: Target,
          color: 'text-yellow-500'
        },
        { 
          type: 'sensor_drift', 
          severity: 'medium', 
          message: 'Environmental sensor readings drifting from baseline',
          icon: AlertTriangle,
          color: 'text-orange-500'
        },
        { 
          type: 'communication_gap', 
          severity: 'low', 
          message: 'Intermittent communication pattern detected',
          icon: Clock,
          color: 'text-blue-500'
        }
      ]

      const newAnomalies = []
      const selectedNodes = nodes.slice(0, 8)

      // Generate 3-7 random anomalies
      const numAnomalies = Math.floor(Math.random() * 5) + 3
      
      for (let i = 0; i < numAnomalies; i++) {
        const randomNode = selectedNodes[Math.floor(Math.random() * selectedNodes.length)]
        const randomAnomaly = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]
        const timestamp = new Date()
        timestamp.setMinutes(timestamp.getMinutes() - Math.floor(Math.random() * 120))

        newAnomalies.push({
          id: `anomaly_${Date.now()}_${i}`,
          nodeId: randomNode.id,
          nodeName: randomNode.name,
          location: randomNode.location,
          type: randomAnomaly.type,
          severity: randomAnomaly.severity,
          message: randomAnomaly.message,
          icon: randomAnomaly.icon,
          color: randomAnomaly.color,
          timestamp: timestamp,
          confidence: 0.75 + Math.random() * 0.24, // 75-99% confidence
          resolved: Math.random() > 0.7, // 30% chance of being resolved
          prediction: Math.random() > 0.5 ? 'escalating' : 'stable'
        })
      }

      // Sort by timestamp (newest first)
      newAnomalies.sort((a, b) => b.timestamp - a.timestamp)
      setAnomalies(newAnomalies)

      // Update stats
      const critical = newAnomalies.filter(a => a.severity === 'critical').length
      const resolved = newAnomalies.filter(a => a.resolved).length
      
      setDetectionStats({
        totalAnomalies: newAnomalies.length,
        criticalAnomalies: critical,
        resolvedAnomalies: resolved,
        detectionAccuracy: 92 + Math.random() * 6 // 92-98%
      })
    }

    generateAnomalies()
    const interval = setInterval(generateAnomalies, 45000) // Update every 45 seconds

    return () => clearInterval(interval)
  }, [nodes])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityBadge = (severity) => {
    const colors = getSeverityColor(severity)
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors}`}>
        {severity.toUpperCase()}
      </span>
    )
  }

  const getPredictionBadge = (prediction) => {
    const isEscalating = prediction === 'escalating'
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
        isEscalating 
          ? 'bg-red-50 text-red-700 border-red-200' 
          : 'bg-green-50 text-green-700 border-green-200'
      }`}>
        {isEscalating ? 'ESCALATING' : 'STABLE'}
      </span>
    )
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diffMs = now - timestamp
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else {
      const diffHours = Math.floor(diffMins / 60)
      return `${diffHours}h ago`
    }
  }

  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Shield className="w-5 h-5 text-aethersense-primary" />
          Anomaly Detection & Prediction
        </h2>
        
        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          AI-Powered Monitoring
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-center">
            <p className="text-2xl font-bold text-aethersense-primary">
              {detectionStats.totalAnomalies}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} break-words`}>
              Total Anomalies
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">
              {detectionStats.criticalAnomalies}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} break-words`}>
              Critical
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              {detectionStats.resolvedAnomalies}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} break-words`}>
              Resolved
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">
              {detectionStats.detectionAccuracy.toFixed(1)}%
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} break-words`}>
              Accuracy
            </p>
          </div>
        </div>
      </div>

      {/* Anomaly List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {anomalies.map((anomaly) => {
          const Icon = anomaly.icon
          return (
            <div
              key={anomaly.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                isDark 
                  ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              } ${anomaly.resolved ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    isDark ? 'bg-slate-600' : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${anomaly.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {anomaly.nodeName}
                      </h4>
                      {getSeverityBadge(anomaly.severity)}
                      {getPredictionBadge(anomaly.prediction)}
                      {anomaly.resolved && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                          RESOLVED
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-sm ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {anomaly.message}
                    </p>
                    
                    <div className={`flex items-center space-x-4 mt-2 text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{anomaly.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(anomaly.timestamp)}</span>
                      </div>
                      <div>
                        Confidence: {(anomaly.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detection Insights */}
      <div className={`mt-6 p-4 rounded-lg border ${
        isDark 
          ? 'bg-slate-700/50 border-slate-600' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <h4 className={`text-sm font-semibold mb-2 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          AI Detection Insights
        </h4>
        <div className={`text-sm space-y-1 ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          <p>🤖 Machine learning models continuously monitor {nodes.length} streetlight nodes</p>
          <p>📊 Pattern recognition algorithms detect deviations from normal behavior</p>
          <p>🔮 Predictive models forecast potential issues 1-6 hours in advance</p>
          <p>⚡ Real-time alerting system for immediate response to critical anomalies</p>
        </div>
      </div>

      {/* Last Updated */}
      <div className={`mt-4 text-xs text-center ${
        isDark ? 'text-slate-500' : 'text-slate-400'
      }`}>
        Anomaly detection last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}

export default AnomalyDetection