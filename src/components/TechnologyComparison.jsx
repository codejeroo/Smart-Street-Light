import React from 'react'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { GitCompare, Zap } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const TechnologyComparison = () => {
  const { networkMetrics, economicMetrics } = useDashboard()
  const { isDark } = useTheme()
  
  // Normalize metrics to 0-100 scale for radar chart
  const normalizeMetrics = () => {
    return {
      wsn: {
        pdr: networkMetrics.wsn.pdr, // Already 0-100
        latency: Math.max(0, 100 - (networkMetrics.wsn.latency / 200 * 100)), // Lower is better, invert
        throughput: (networkMetrics.wsn.throughput / 1000) * 100, // Normalize to 1000 bps max
        capacity: networkMetrics.wsn.capacity, // Already 0-100
        costEffectiveness: (economicMetrics.wsn.bcr / 600) * 100 // Normalize BCR
      },
      lora: {
        pdr: networkMetrics.lora.pdr,
        latency: Math.max(0, 100 - (networkMetrics.lora.latency / 200 * 100)),
        throughput: (networkMetrics.lora.throughput / 1000) * 100,
        capacity: networkMetrics.lora.capacity,
        costEffectiveness: (economicMetrics.lora.bcr / 600) * 100
      }
    }
  }
  
  const normalizedData = normalizeMetrics()
  
  const chartData = {
    labels: [
      'Packet Delivery',
      'Low Latency',
      'Throughput',
      'Capacity',
      'Cost Effectiveness'
    ],
    datasets: [
      {
        label: 'WSN',
        data: [
          normalizedData.wsn.pdr,
          normalizedData.wsn.latency,
          normalizedData.wsn.throughput,
          normalizedData.wsn.capacity,
          normalizedData.wsn.costEffectiveness
        ],
        borderColor: '#0072F5',
        backgroundColor: 'rgba(0, 114, 245, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#0072F5',
        pointBorderColor: isDark ? '#ffffff' : '#1e293b',
        pointBorderWidth: 2,
        pointRadius: 5
      },
      {
        label: 'LoRa',
        data: [
          normalizedData.lora.pdr,
          normalizedData.lora.latency,
          normalizedData.lora.throughput,
          normalizedData.lora.capacity,
          normalizedData.lora.costEffectiveness
        ],
        borderColor: '#3895D3',
        backgroundColor: 'rgba(56, 149, 211, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#3895D3',
        pointBorderColor: isDark ? '#ffffff' : '#1e293b',
        pointBorderWidth: 2,
        pointRadius: 5
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
          color: isDark ? '#ffffff' : '#374151',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#ffffff' : '#374151',
        bodyColor: isDark ? '#ffffff' : '#374151',
        borderColor: isDark ? '#444444' : '#d1d5db',
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
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || ''
            const value = Math.round(context.parsed.r)
            return `${label}: ${value}%`
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        },
        angleLines: {
          color: 'rgba(75, 85, 99, 0.3)'
        },
        pointLabels: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          color: '#9ca3af',
          backdropColor: 'transparent',
          font: {
            size: 10
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
  
  // Side-by-side metrics comparison
  const comparisonMetrics = [
    {
      label: 'Packet Delivery Ratio',
      wsn: `${networkMetrics.wsn.pdr.toFixed(1)}%`,
      lora: `${networkMetrics.lora.pdr.toFixed(1)}%`,
      winner: networkMetrics.wsn.pdr > networkMetrics.lora.pdr ? 'wsn' : 'lora'
    },
    {
      label: 'Average Latency',
      wsn: `${networkMetrics.wsn.latency.toFixed(1)}ms`,
      lora: `${networkMetrics.lora.latency.toFixed(1)}ms`,
      winner: networkMetrics.wsn.latency < networkMetrics.lora.latency ? 'wsn' : 'lora'
    },
    {
      label: 'Throughput',
      wsn: `${networkMetrics.wsn.throughput.toFixed(0)} bps`,
      lora: `${networkMetrics.lora.throughput.toFixed(0)} bps`,
      winner: networkMetrics.wsn.throughput > networkMetrics.lora.throughput ? 'wsn' : 'lora'
    }
  ]
  
  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <GitCompare className="w-5 h-5 text-caraga-blue" />
          Technology Comparison
        </h2>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Performance Analysis</span>
        </div>
      </div>
      
      <div className="p-6">
        {/* Radar Chart */}
        <div className="h-80 mb-6">
          <Radar data={chartData} options={options} />
        </div>
        
        {/* Side-by-side Comparison */}
        <div className="space-y-3">
          <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Performance Metrics</h3>
          
          {comparisonMetrics.map((metric, index) => (
            <div key={index} className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'} border rounded-lg p-3`}>
              <div className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`text-center p-2 rounded ${
                  metric.winner === 'wsn' 
                    ? 'bg-primary-500/20 border border-primary-500/50' 
                    : isDark ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div className="text-sm font-medium text-primary-400">WSN</div>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{metric.wsn}</div>
                </div>
                <div className={`text-center p-2 rounded ${
                  metric.winner === 'lora' 
                    ? 'bg-accent-500/20 border border-accent-500/50' 
                    : isDark ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div className="text-sm font-medium text-accent-500">LoRa</div>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{metric.lora}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Overall Recommendation */}
        <div className="mt-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Technology Recommendation</span>
          </div>
          <p className="text-sm text-gray-300">
            WSN shows superior performance in throughput and latency, making it ideal for 
            real-time applications. LoRa excels in long-range coverage with lower power consumption.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TechnologyComparison