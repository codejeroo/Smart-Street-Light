import React from 'react'
import { Sun, Moon, Lightbulb, Wifi, Radio } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'

const Header = () => {
  const { technology, setTechnology, isOnline, lastUpdate } = useDashboard()
  const { theme, toggleTheme, isDark } = useTheme()
  
  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900/95 backdrop-blur-lg border-b border-slate-700' 
        : 'bg-white/95 backdrop-blur-lg border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isDark 
                ? 'bg-gradient-to-r from-aethersense-primary to-aethersense-secondary' 
                : 'bg-gradient-to-r from-aethersense-dark to-aethersense-primary'
            }`}>
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r from-aethersense-primary to-aethersense-secondary bg-clip-text text-transparent`}>
                AetherSense
              </h1>
              <p className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Smart Street Light Monitoring • Caraga Region XIII
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-6">
            
            {/* Technology Toggle */}
            <div className={`flex rounded-lg p-1 ${
              isDark 
                ? 'bg-dark-800 border border-dark-700' 
                : 'bg-gray-100 border border-gray-200'
            }`}>
              <button
                onClick={() => setTechnology('wsn')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  technology === 'wsn'
                    ? isDark
                      ? 'bg-aethersense-primary text-white shadow-lg'
                      : 'bg-aethersense-dark text-white shadow-lg'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-dark-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span>WSN</span>
              </button>
              <button
                onClick={() => setTechnology('lora')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  technology === 'lora'
                    ? isDark
                      ? 'bg-aethersense-secondary text-white shadow-lg'
                      : 'bg-aethersense-accent text-white shadow-lg'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-dark-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>LoRa</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-green-500 animate-pulse-slow' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-300">
                {isOnline ? 'System Online' : 'System Offline'}
              </span>
            </div>
            
            {/* Last Update */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <Wifi className="w-4 h-4" />
              <span>
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header