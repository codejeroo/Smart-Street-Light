import React, { useRef, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Signal } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const SignalQuality = () => {
  const { technology, signalData } = useDashboard()
  const { isDark } = useTheme()
  const chartRef = useRef(null)
  
  const data = signalData[technology]
  
  const chartData = {
    labels: signalData.distances.map(d => `${d}m`),
    datasets: [
      {
        label: 'RSSI (dBm)',
        data: data.rssi,
        borderColor: '#0072F5',
        backgroundColor: 'rgba(0, 114, 245, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#0072F5',
        pointBorderColor: isDark ? '#ffffff' : '#1e293b',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'SNR (dB)',
        data: data.snr,
        borderColor: '#3895D3',
        backgroundColor: 'rgba(56, 149, 211, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#3895D3',
        pointBorderColor: isDark ? '#ffffff' : '#1e293b',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#444444',
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Distance',
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'RSSI (dBm)',
          color: '#00d4ff',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#00d4ff',
          font: {
            size: 11
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'SNR (dB)',
          color: '#ff6b35',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          drawOnChartArea: false,
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#ff6b35',
          font: {
            size: 11
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  }
  
  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Signal className="w-5 h-5 text-caraga-blue" />
          Signal Quality
        </h2>
        <div className={`text-xs uppercase font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {technology.toUpperCase()}
        </div>
      </div>
      
      <div className="p-6">
        {/* Signal Quality Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`rounded-lg p-3 text-center border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="text-lg font-bold text-aethersense-primary">
              {data.rssi[data.rssi.length - 1]} dBm
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              RSSI @ {signalData.distances[signalData.distances.length - 1]}m
            </div>
          </div>
          
          <div className={`rounded-lg p-3 text-center border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="text-lg font-bold text-aethersense-secondary">
              {data.snr[data.snr.length - 1]} dB
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              SNR @ {signalData.distances[signalData.distances.length - 1]}m
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-64">
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
        
        {/* Signal Quality Indicators */}
        <div className="mt-6 space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Signal Strength</span>
              <span className="text-aethersense-primary">
                {data.rssi[0] > -60 ? 'Excellent' : 
                 data.rssi[0] > -70 ? 'Good' : 
                 data.rssi[0] > -80 ? 'Fair' : 'Poor'}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              isDark ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  data.rssi[0] > -60 ? 'bg-green-500' :
                  data.rssi[0] > -70 ? 'bg-yellow-500' :
                  data.rssi[0] > -80 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (data.rssi[0] + 100) / 40 * 100))}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Noise Ratio</span>
              <span className="text-aethersense-secondary">
                {data.snr[0] > 10 ? 'Excellent' : 
                 data.snr[0] > 5 ? 'Good' : 
                 data.snr[0] > 0 ? 'Fair' : 'Poor'}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              isDark ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  data.snr[0] > 10 ? 'bg-green-500' :
                  data.snr[0] > 5 ? 'bg-yellow-500' :
                  data.snr[0] > 0 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (data.snr[0] / 20) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignalQuality