import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Battery, Wifi, AlertTriangle, Zap } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icons with standard status colors
const createCustomIcon = (status, isDark) => {
  const statusColors = {
    online: '#10b981',   // Green
    offline: '#ef4444',  // Red  
    fault: '#eab308'     // Yellow
  }
  
  const color = statusColors[status] || statusColors.offline
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid ${isDark ? '#1e293b' : 'white'};
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: ${status === 'online' ? 'pulse 2s infinite' : 'none'};
        position: relative;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  })
}

const MapView = () => {
  const { nodes } = useDashboard()
  const { isDark } = useTheme()
  const mapRef = useRef(null)
  
  // Caraga Region center coordinates (centered between major cities)
  const caragaCenter = [9.5, 125.8]
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-caraga-cyan'
      case 'fault': return 'text-caraga-burgundy'
      default: return 'text-caraga-navy'
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <Wifi className="w-4 h-4" />
      case 'fault': return <AlertTriangle className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }
  
  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <MapPin className="w-5 h-5 text-caraga-blue" />
          Caraga Region XIII - Network Map
        </h2>
        
        {/* Legend with standard status colors */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Fault</span>
          </div>
        </div>
      </div>
      
      <div className={`h-96 relative rounded-lg overflow-hidden border-2 ${
        isDark ? 'border-slate-600' : 'border-caraga-blue/20'
      }`}>
        <MapContainer
          center={caragaCenter}
          zoom={9}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url={isDark 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={isDark 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          />
          
          {nodes.map((node) => (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createCustomIcon(node.status, isDark)}
            >
              <Popup className={`custom-popup ${isDark ? 'dark-popup' : 'light-popup'}`}>
                <div className={`p-3 min-w-[280px] ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-caraga-blue">
                      {node.name || node.id}
                    </h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      node.status === 'online' 
                        ? 'bg-caraga-cyan/20 text-caraga-cyan' 
                        : node.status === 'offline'
                        ? 'bg-caraga-navy/20 text-caraga-navy'
                        : 'bg-caraga-burgundy/20 text-caraga-burgundy'
                    }`}>
                      {getStatusIcon(node.status)}
                      <span className="capitalize">{node.status}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <MapPin className="w-3 h-3" />
                        Location:
                      </span>
                      <span className="font-medium text-right">
                        {node.city}, {node.province}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Node ID:
                      </span>
                      <span className="font-mono text-xs bg-caraga-blue/10 px-2 py-1 rounded">
                        {node.id}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Battery className="w-3 h-3" />
                        Battery:
                      </span>
                      <span className={`font-medium ${
                        node.batteryVoltage > 12 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {node.batteryVoltage?.toFixed(1)}V
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Zap className="w-3 h-3" />
                        Solar:
                      </span>
                      <span className={`font-medium ${
                        node.solarCharging ? 'text-yellow-600' : isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {node.solarCharging ? 'Charging' : 'Not Charging'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Ambient Light:
                      </span>
                      <span className="font-medium">{Math.round(node.ambientLight)} lux</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Power:
                      </span>
                      <span className="font-medium">{node.powerConsumption?.toFixed(1)}W</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Wifi className="w-3 h-3" />
                        RSSI:
                      </span>
                      <span className={`font-medium ${
                        node.rssi > -60 ? 'text-green-600' : 
                        node.rssi > -70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {node.rssi?.toFixed(0)} dBm
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Last Seen:
                      </span>
                      <span className="font-medium text-xs">
                        {node.lastSeen ? new Date(node.lastSeen).toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`mt-3 pt-2 border-t ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Coordinates: {node.lat?.toFixed(4)}, {node.lng?.toFixed(4)}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className={`mt-4 p-3 rounded-md ${
        isDark ? 'bg-slate-700/50' : 'bg-caraga-blue/5'
      }`}>
        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <strong className="text-caraga-blue">Coverage Area:</strong> Caraga Region XIII encompasses 
          the provinces of Agusan del Norte, Agusan del Sur, Surigao del Norte, Surigao del Sur, 
          and Dinagat Islands. Click on any marker to view detailed node information and status.
        </p>
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .dark-popup .leaflet-popup-content-wrapper {
          background-color: #1e293b !important;
          border: 1px solid #475569 !important;
        }
        .dark-popup .leaflet-popup-tip {
          background-color: #1e293b !important;
          border: 1px solid #475569 !important;
        }
        
        .light-popup .leaflet-popup-content-wrapper {
          background-color: white !important;
          border: 1px solid #e2e8f0 !important;
        }
        .light-popup .leaflet-popup-tip {
          background-color: white !important;
          border: 1px solid #e2e8f0 !important;
        }
      `}</style>
    </div>
  )
}

export default MapView