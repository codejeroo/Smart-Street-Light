import React from 'react'
import { Battery, Sun, Eye, Zap } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'

const EnergyPanel = () => {
  const { nodes } = useDashboard()
  const { isDark } = useTheme()
  
  // Calculate average values from all nodes in Caraga Region
  const avgBatteryVoltage = nodes.reduce((sum, node) => sum + node.batteryVoltage, 0) / nodes.length || 0
  const solarChargingCount = nodes.filter(node => node.solarCharging).length
  const avgAmbientLight = nodes.reduce((sum, node) => sum + node.ambientLight, 0) / nodes.length || 0
  const avgPowerConsumption = nodes.reduce((sum, node) => sum + node.powerConsumption, 0) / nodes.length || 0
  
  const EnergyCard = ({ icon: Icon, label, value, unit, status, statusColor, bgColor }) => (
    <div className={`p-4 rounded-lg ${bgColor} border ${
      isDark ? 'border-slate-600' : 'border-slate-200'
    } transition-colors duration-300`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${statusColor}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {value}{unit}
          </div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {label}
          </div>
          {status && (
            <div className={`text-xs font-medium mt-1 ${
              status === 'Excellent' ? 'text-caraga-cyan' : 
              status === 'Good' ? 'text-green-500' :
              status === 'Warning' ? 'text-yellow-500' : 'text-caraga-burgundy'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  )
  
  const getBatteryStatus = (voltage) => {
    if (voltage > 12.5) return { 
      status: 'Excellent', 
      color: 'bg-caraga-cyan',
      bgColor: isDark ? 'bg-slate-700/50' : 'bg-caraga-cyan/5'
    }
    if (voltage > 11.5) return { 
      status: 'Good', 
      color: 'bg-green-500',
      bgColor: isDark ? 'bg-slate-700/50' : 'bg-green-50'
    }
    return { 
      status: 'Critical', 
      color: 'bg-caraga-burgundy',
      bgColor: isDark ? 'bg-slate-700/50' : 'bg-red-50'
    }
  }
  
  const getSolarStatus = (chargingCount, totalNodes) => {
    const percentage = (chargingCount / totalNodes) * 100
    if (percentage > 80) return { 
      status: 'Excellent', 
      color: 'bg-caraga-cyan',
      bgColor: isDark ? 'bg-slate-700/50' : 'bg-caraga-cyan/5'
    }
    if (percentage > 60) return { 
      status: 'Good', 
      color: 'bg-caraga-blue',
      bgColor: isDark ? 'bg-slate-700/50' : 'bg-caraga-blue/5'
    }
    return { 
      status: 'Poor Weather', 
      color: 'bg-caraga-navy',
      bgColor: isDark ? 'bg-slate-700/50' : 'bg-caraga-navy/5'
    }
  }
  
  const batteryStatus = getBatteryStatus(avgBatteryVoltage)
  const solarStatus = getSolarStatus(solarChargingCount, nodes.length)
  
  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Sun className="w-5 h-5 text-aethersense-primary" />
          Energy & Sensor Data
        </h2>
        <div className={`text-sm px-3 py-1 rounded-full ${
          isDark ? 'bg-slate-700 text-slate-300' : 'bg-aethersense-primary/10 text-aethersense-primary'
        }`}>
          Caraga Region XIII
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnergyCard
          icon={Battery}
          label="Average Battery Voltage"
          value={avgBatteryVoltage.toFixed(1)}
          unit="V"
          status={batteryStatus.status}
          statusColor={batteryStatus.color}
          bgColor={batteryStatus.bgColor}
        />
        
        <EnergyCard
          icon={Sun}
          label="Solar Charging Status"
          value={solarChargingCount}
          unit={` / ${nodes.length}`}
          status={solarStatus.status}
          statusColor={solarStatus.color}
          bgColor={solarStatus.bgColor}
        />
        
        <EnergyCard
          icon={Eye}
          label="Average Ambient Light"
          value={Math.round(avgAmbientLight)}
          unit=" lux"
          statusColor="bg-caraga-cyan"
          bgColor={isDark ? 'bg-slate-700/50' : 'bg-caraga-cyan/5'}
        />
        
        <EnergyCard
          icon={Zap}
          label="Average Power Usage"
          value={avgPowerConsumption.toFixed(1)}
          unit="W"
          status={avgPowerConsumption < 3 ? 'Efficient' : 'High Usage'}
          statusColor={avgPowerConsumption < 3 ? 'bg-green-500' : 'bg-caraga-burgundy'}
          bgColor={avgPowerConsumption < 3 ? (isDark ? 'bg-slate-700/50' : 'bg-green-50') : (isDark ? 'bg-slate-700/50' : 'bg-red-50')}
        />
      </div>
      
      {/* Regional Performance Indicators */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Battery Health Indicator */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
          <div className="flex justify-between text-sm mb-2">
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Regional Battery Health</span>
            <span className={`font-medium ${
              batteryStatus.status === 'Excellent' ? 'text-caraga-cyan' : 
              batteryStatus.status === 'Good' ? 'text-green-500' :
              batteryStatus.status === 'Warning' ? 'text-yellow-500' : 'text-caraga-burgundy'
            }`}>
              {batteryStatus.status}
            </span>
          </div>
          <div className={`w-full rounded-full h-3 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                batteryStatus.status === 'Excellent' ? 'bg-caraga-cyan' : 
                batteryStatus.status === 'Good' ? 'bg-green-500' :
                batteryStatus.status === 'Warning' ? 'bg-yellow-500' : 'bg-caraga-burgundy'
              }`}
              style={{ width: `${Math.min(100, (avgBatteryVoltage / 14) * 100)}%` }}
            ></div>
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {(avgBatteryVoltage / 14 * 100).toFixed(0)}% capacity across region
          </div>
        </div>
        
        {/* Solar Efficiency Indicator */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
          <div className="flex justify-between text-sm mb-2">
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Solar Charging Efficiency</span>
            <span className="text-caraga-cyan font-medium">
              {Math.round((solarChargingCount / nodes.length) * 100)}%
            </span>
          </div>
          <div className={`w-full rounded-full h-3 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>
            <div 
              className="bg-gradient-to-r from-caraga-cyan to-caraga-blue h-3 rounded-full transition-all duration-500"
              style={{ width: `${(solarChargingCount / nodes.length) * 100}%` }}
            ></div>
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {solarChargingCount} of {nodes.length} nodes charging
          </div>
        </div>
      </div>
      
      {/* Weather Impact Notice for Tropical Region */}
      <div className={`mt-4 p-3 rounded-md ${
        isDark ? 'bg-caraga-blue/10 border border-caraga-blue/20' : 'bg-caraga-blue/5 border border-caraga-blue/20'
      }`}>
        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <span className="font-medium text-caraga-blue">Tropical Climate Notice:</span> Energy 
          efficiency may vary due to Caraga Region's seasonal weather patterns including monsoon periods.
        </p>
      </div>
    </div>
  )
}

export default EnergyPanel