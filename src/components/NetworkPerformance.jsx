import React from 'react'
import { Activity, Zap, Gauge, Server } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'

const NetworkPerformance = () => {
  const { technology, networkMetrics } = useDashboard()
  const { isDark } = useTheme()
  const metrics = networkMetrics[technology]
  
  const MetricCard = ({ icon: Icon, label, value, unit, color = 'text-caraga-blue' }) => (
    <div className={`rounded-lg p-4 border transition-colors ${
      isDark 
        ? 'bg-slate-700/50 border-slate-600' 
        : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center justify-center mb-3">
        <div className={`p-2 rounded-full transition-colors ${
          isDark ? 'bg-slate-800' : 'bg-white'
        } ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className={`text-2xl font-bold ${color} mb-1`}>
        {value}{unit}
      </div>
      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {label}
      </div>
    </div>
  )
  
  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Activity className="w-5 h-5 text-caraga-blue" />
          Network Performance
        </h2>
        <div className={`text-xs uppercase font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {technology.toUpperCase()}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            icon={Gauge}
            label="Packet Delivery Ratio"
            value={metrics.pdr.toFixed(1)}
            unit="%"
            color="text-green-400"
          />
          
          <MetricCard
            icon={Zap}
            label="Average Latency"
            value={metrics.latency.toFixed(1)}
            unit="ms"
            color="text-yellow-400"
          />
          
          <MetricCard
            icon={Activity}
            label="Throughput"
            value={metrics.throughput.toFixed(0)}
            unit=" bps"
            color="text-blue-400"
          />
          
          <MetricCard
            icon={Server}
            label="Network Capacity"
            value={metrics.capacity.toFixed(0)}
            unit="%"
            color="text-purple-400"
          />
        </div>
        
        {/* Performance Bars */}
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">PDR</span>
              <span className="text-green-400">{metrics.pdr.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.pdr}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Capacity</span>
              <span className="text-purple-400">{metrics.capacity.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.capacity}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetworkPerformance