import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { TrendingUp, DollarSign } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const EconomicAnalysis = () => {
  const { technology, economicMetrics } = useDashboard()
  const { isDark } = useTheme()
  const metrics = economicMetrics[technology]
  
  const chartData = {
    labels: ['IRR (%)', 'BCR (₱)', 'NPV (₱M)', 'Payback (Years)'],
    datasets: [
      {
        label: 'WSN',
        data: [
          economicMetrics.wsn.irr,
          economicMetrics.wsn.bcr,
          economicMetrics.wsn.npv,
          economicMetrics.wsn.payback
        ],
        backgroundColor: 'rgba(0, 114, 245, 0.6)',
        borderColor: '#0072F5',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'LoRa',
        data: [
          economicMetrics.lora.irr,
          economicMetrics.lora.bcr,
          economicMetrics.lora.npv,
          economicMetrics.lora.payback
        ],
        backgroundColor: 'rgba(56, 149, 211, 0.6)',
        borderColor: '#3895D3',
        borderWidth: 1,
        borderRadius: 4
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
            const value = context.parsed.y
            const dataIndex = context.dataIndex
            
            switch(dataIndex) {
              case 0: return `${label}: ${value}%`
              case 1: return `${label}: ₱${value}`
              case 2: return `${label}: ₱${value}M`
              case 3: return `${label}: ${value} year${value !== 1 ? 's' : ''}`
              default: return `${label}: ${value}`
            }
          }
        }
      }
    },
    scales: {
      x: {
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
      }
    }
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(value)
  }
  
  const getComparisonColor = (currentValue, compareValue, higherIsBetter = true) => {
    const isHigher = currentValue > compareValue
    if (higherIsBetter) {
      return isHigher ? 'text-green-400' : 'text-red-400'
    } else {
      return isHigher ? 'text-red-400' : 'text-green-400'
    }
  }
  
  const MetricCard = ({ label, value, unit, comparison, higherIsBetter = true }) => {
    const comparisonColor = getComparisonColor(value, comparison, higherIsBetter)
    const difference = value - comparison
    const percentDiff = ((difference / comparison) * 100).toFixed(1)
    
    return (
      <div className="bg-dark-900 border border-dark-700 rounded-lg p-4 text-center">
        <div className="text-sm text-gray-400 mb-1">{label}</div>
        <div className="text-xl font-bold text-white mb-2">
          {typeof value === 'number' && unit === '₱' ? formatCurrency(value) : `${value}${unit}`}
        </div>
        <div className={`text-xs font-medium ${comparisonColor}`}>
          {difference > 0 ? '+' : ''}{percentDiff}% vs {technology === 'wsn' ? 'LoRa' : 'WSN'}
        </div>
      </div>
    )
  }
  
  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <TrendingUp className="w-5 h-5 text-caraga-blue" />
          Economic Analysis
        </h2>
        <div className={`text-xs uppercase font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {technology.toUpperCase()}
        </div>
      </div>
      
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <MetricCard
            label="IRR"
            value={metrics.irr}
            unit="%"
            comparison={technology === 'wsn' ? economicMetrics.lora.irr : economicMetrics.wsn.irr}
            higherIsBetter={true}
          />
          
          <MetricCard
            label="BCR"
            value={metrics.bcr}
            unit="₱"
            comparison={technology === 'wsn' ? economicMetrics.lora.bcr : economicMetrics.wsn.bcr}
            higherIsBetter={true}
          />
          
          <MetricCard
            label="NPV"
            value={metrics.npv}
            unit="₱M"
            comparison={technology === 'wsn' ? economicMetrics.lora.npv : economicMetrics.wsn.npv}
            higherIsBetter={true}
          />
          
          <MetricCard
            label="Payback"
            value={metrics.payback}
            unit=" year"
            comparison={technology === 'wsn' ? economicMetrics.lora.payback : economicMetrics.wsn.payback}
            higherIsBetter={false}
          />
        </div>
        
        {/* Comparative Chart */}
        <div className="h-48">
          <h3 className="text-sm font-medium text-gray-300 mb-3">WSN vs LoRa Comparison</h3>
          <Bar data={chartData} options={options} />
        </div>
        
        {/* ROI Summary */}
        <div className="mt-6 bg-dark-900 border border-dark-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Investment Summary</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Technology Advantage:</span>
              <span className="text-white font-medium">
                {economicMetrics.wsn.npv > economicMetrics.lora.npv ? 'WSN' : 'LoRa'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">NPV Difference:</span>
              <span className="text-green-400 font-medium">
                ₱{Math.abs(economicMetrics.wsn.npv - economicMetrics.lora.npv).toFixed(2)}M
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Break-even:</span>
              <span className="text-blue-400 font-medium">
                {Math.min(economicMetrics.wsn.payback, economicMetrics.lora.payback)} year
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EconomicAnalysis