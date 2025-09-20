import React from 'react'
import { AlertTriangle, AlertCircle, Clock, MapPin, Info } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'

const SystemAlerts = () => {
  const { alerts } = useDashboard()
  const { isDark } = useTheme()
  
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />
      case 'warning': return <AlertCircle className="w-4 h-4" />
      case 'info': return <Info className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }
  
  const getAlertStyles = (type) => {
    switch (type) {
      case 'critical': 
        return {
          border: 'border-l-caraga-burgundy',
          icon: 'text-caraga-burgundy',
          bg: 'bg-caraga-burgundy/10'
        }
      case 'warning': 
        return {
          border: 'border-l-caraga-blue',
          icon: 'text-caraga-blue',
          bg: 'bg-caraga-blue/10'
        }
      case 'info': 
        return {
          border: 'border-l-caraga-cyan',
          icon: 'text-caraga-cyan',
          bg: 'bg-caraga-cyan/10'
        }
      default: 
        return {
          border: 'border-l-caraga-navy',
          icon: 'text-caraga-navy',
          bg: 'bg-caraga-navy/10'
        }
    }
  }
  
  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }
  
  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <AlertTriangle className="w-5 h-5 text-caraga-burgundy" />
          System Alerts - Caraga Region
        </h2>
        <div className="flex items-center gap-2">
          <span className="bg-caraga-burgundy text-white text-xs font-bold px-2 py-1 rounded-full">
            {alerts.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No active alerts</p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              All systems in Caraga Region operating normally
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {alerts.map((alert) => {
              const styles = getAlertStyles(alert.type)
              
              return (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${styles.border} ${styles.bg} ${
                    isDark ? 'bg-slate-700/50' : 'bg-white'
                  } transition-colors duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${styles.icon}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {alert.title}
                          </h4>
                          <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {alert.description}
                          </p>
                          
                          <div className={`flex items-center gap-4 mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{alert.nodeId}</span>
                            </div>
                            {alert.location && (
                              <div className="flex items-center gap-1">
                                <span>•</span>
                                <span>{alert.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button className={`ml-2 p-1 rounded-md transition-colors ${
                          isDark 
                            ? 'text-slate-400 hover:text-white hover:bg-slate-600' 
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {/* Alert Summary */}
        {alerts.length > 0 && (
          <div className={`mt-6 pt-4 border-t ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-caraga-burgundy font-semibold text-lg">
                  {alerts.filter(a => a.type === 'critical').length}
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Critical</div>
              </div>
              <div className="text-center">
                <div className="text-caraga-blue font-semibold text-lg">
                  {alerts.filter(a => a.type === 'warning').length}
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Warning</div>
              </div>
              <div className="text-center">
                <div className="text-caraga-cyan font-semibold text-lg">
                  {alerts.filter(a => a.type === 'info').length}
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Info</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="mt-4 flex gap-2">
          <button className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
            isDark 
              ? 'bg-slate-700 hover:bg-slate-600 text-white' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}>
            Mark All Read
          </button>
          <button className="flex-1 bg-caraga-blue hover:bg-caraga-navy text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors">
            View Regional Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default SystemAlerts