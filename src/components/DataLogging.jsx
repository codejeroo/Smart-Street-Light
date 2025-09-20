import React, { useState, useMemo } from 'react'
import { Database, Download, Search, Filter, Calendar, MapPin } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'

const DataLogging = () => {
  const { dataLogs } = useDashboard()
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = dataLogs
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.nodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.location && log.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter)
    }
    
    // Apply location filter for Caraga provinces
    if (locationFilter !== 'all') {
      filtered = filtered.filter(log => log.location && log.location.includes(locationFilter))
    }
    
    return filtered
  }, [dataLogs, searchTerm, statusFilter, locationFilter])
  
  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortConfig.key === 'timestamp') {
        const aVal = new Date(a[sortConfig.key]).getTime()
        const bVal = new Date(b[sortConfig.key]).getTime()
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      
      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [filteredData, sortConfig])
  
  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage])
  
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>↕️</span>
    }
    return sortConfig.direction === 'asc' ? 
      <span className="text-aethersense-primary">↑</span> : 
      <span className="text-aethersense-primary">↓</span>
  }
  
  const getStatusBadge = (status) => {
    const styles = {
      online: 'bg-green-500/20 text-green-500 border-green-500/50',
      offline: 'bg-red-500/20 text-red-500 border-red-500/50',
      fault: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.offline}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }
  
  const exportToCSV = () => {
    const headers = ['Timestamp', 'Node ID', 'Status', 'Battery (V)', 'RSSI (dBm)', 'SNR (dB)', 'Latency (ms)']
    const csvContent = [
      headers.join(','),
      ...sortedData.map(row => [
        row.timestamp.toISOString(),
        row.nodeId,
        row.status,
        row.batteryVoltage,
        row.rssi,
        row.snr,
        row.latency
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `streetlight-data-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }
  
  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Database className="w-5 h-5 text-aethersense-primary" />
          AetherSense Data Logging - Caraga Region XIII
        </h2>
        <button
          onClick={exportToCSV}
          className="bg-aethersense-primary hover:bg-aethersense-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search by Node ID, Status, or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-aethersense-primary transition-colors ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
            }`}
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-aethersense-primary transition-colors ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="fault">Fault</option>
          </select>
        </div>
        
        {/* Location Filter for Caraga Provinces */}
        <div className="flex items-center gap-2">
          <MapPin className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-aethersense-primary transition-colors ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="all">All Provinces</option>
            <option value="Agusan del Norte">Agusan del Norte</option>
            <option value="Agusan del Sur">Agusan del Sur</option>
            <option value="Surigao del Norte">Surigao del Norte</option>
            <option value="Surigao del Sur">Surigao del Sur</option>
            <option value="Dinagat Islands">Dinagat Islands</option>
          </select>
        </div>
      </div>
      
      {/* Stats with Caraga colors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-lg p-4 text-center border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-caraga-blue/5 border-caraga-blue/20'
        }`}>
          <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{sortedData.length}</div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Records</div>
        </div>
        <div className={`rounded-lg p-4 text-center border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="text-xl font-bold text-caraga-cyan">
            {sortedData.filter(log => log.status === 'online').length}
          </div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Online Nodes</div>
        </div>
        <div className={`rounded-lg p-4 text-center border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-caraga-navy/5 border-caraga-navy/20'
        }`}>
          <div className="text-xl font-bold text-caraga-navy">
            {sortedData.filter(log => log.status === 'offline').length}
          </div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Offline Nodes</div>
        </div>
        <div className={`rounded-lg p-4 text-center border ${
          isDark 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="text-xl font-bold text-caraga-burgundy">
            {sortedData.filter(log => log.status === 'fault').length}
          </div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Fault Nodes</div>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
              <th 
                className={`text-left py-3 px-4 font-medium cursor-pointer transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timestamp {getSortIcon('timestamp')}
                </div>
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium cursor-pointer transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleSort('nodeId')}
              >
                Node ID {getSortIcon('nodeId')}
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium cursor-pointer transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium cursor-pointer transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleSort('batteryVoltage')}
              >
                Battery (V) {getSortIcon('batteryVoltage')}
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium cursor-pointer transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleSort('rssi')}
              >
                RSSI (dBm) {getSortIcon('rssi')}
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium cursor-pointer transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleSort('snr')}
              >
                SNR (dB) {getSortIcon('snr')}
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium cursor-pointer transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleSort('latency')}
              >
                Latency (ms) {getSortIcon('latency')}
              </th>
              <th className={`text-left py-3 px-4 font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((log) => (
              <tr 
                key={log.id}
                className={`border-b transition-colors ${
                  isDark 
                    ? 'border-slate-700 hover:bg-slate-700/50' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {log.timestamp.toLocaleString()}
                </td>
                <td className={`py-3 px-4 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {log.nodeId}
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(log.status)}
                </td>
                <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {log.batteryVoltage}
                </td>
                <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {log.rssi}
                </td>
                <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {log.snr}
                </td>
                <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {log.latency}
                </td>
                <td className={`py-3 px-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {log.location || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark 
                  ? 'bg-slate-700 border border-slate-600 text-white hover:bg-slate-600' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-caraga-blue text-white'
                        : isDark 
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark 
                  ? 'bg-slate-700 border border-slate-600 text-white hover:bg-slate-600' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataLogging