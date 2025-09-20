import React, { createContext, useContext, useState, useEffect } from 'react'

const DashboardContext = createContext()

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}

// Caraga Region coordinates and cities
const CARAGA_CITIES = [
  { name: 'Butuan City', lat: 8.9470, lng: 125.5456, province: 'Agusan del Norte' },
  { name: 'Cabadbaran', lat: 9.1233, lng: 125.5344, province: 'Agusan del Norte' },
  { name: 'Bayugan', lat: 8.7167, lng: 125.7333, province: 'Agusan del Sur' },
  { name: 'Prosperidad', lat: 8.6083, lng: 125.8417, province: 'Agusan del Sur' },
  { name: 'Surigao City', lat: 9.7606, lng: 125.4806, province: 'Surigao del Norte' },
  { name: 'Siargao', lat: 9.8700, lng: 126.0519, province: 'Surigao del Norte' },
  { name: 'Tandag', lat: 9.0731, lng: 126.1969, province: 'Surigao del Sur' },
  { name: 'Bislig', lat: 8.2108, lng: 126.3214, province: 'Surigao del Sur' },
  { name: 'Dinagat', lat: 10.3658, lng: 125.6078, province: 'Dinagat Islands' },
  { name: 'San Jose', lat: 10.2925, lng: 125.5983, province: 'Dinagat Islands' }
]

// Generate streetlight nodes for Caraga Region
const generateCaragaNodes = () => {
  const nodes = []
  let nodeId = 1

  CARAGA_CITIES.forEach((city, cityIndex) => {
    // Generate 8-12 streetlight nodes per city
    const nodeCount = Math.floor(Math.random() * 5) + 8
    
    for (let i = 0; i < nodeCount; i++) {
      // Create nodes around the city center with some spread
      const latOffset = (Math.random() - 0.5) * 0.02 // ~1km radius
      const lngOffset = (Math.random() - 0.5) * 0.02
      
      const statuses = ['online', 'offline', 'fault']
      const statusWeights = [0.85, 0.10, 0.05] // 85% online, 10% offline, 5% fault
      const randomValue = Math.random()
      let status = 'online'
      
      if (randomValue < statusWeights[2]) status = 'fault'
      else if (randomValue < statusWeights[1] + statusWeights[2]) status = 'offline'
      
      nodes.push({
        id: `CRG-${String(nodeId).padStart(3, '0')}`,
        name: `${city.name} Node ${i + 1}`,
        lat: city.lat + latOffset,
        lng: city.lng + lngOffset,
        status,
        city: city.name,
        province: city.province,
        batteryVoltage: Math.random() * 2 + 11, // 11-13V
        rssi: Math.random() * -30 - 45, // -45 to -75 dBm
        snr: Math.random() * 15 + 5, // 5-20 dB
        lastSeen: new Date(Date.now() - Math.random() * 3600000), // Within last hour
        solarCharging: Math.random() > 0.3, // 70% chance of charging
        ambientLight: Math.random() * 800 + 200, // 200-1000 lux
        powerConsumption: Math.random() * 2 + 1.5 // 1.5-3.5W
      })
      nodeId++
    }
  })
  
  return nodes
}

const generateSystemAlerts = () => [
  {
    id: 1,
    type: 'critical',
    title: 'Communication Failure',
    description: 'Node CRG-045 in Butuan City has lost connection',
    nodeId: 'CRG-045',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    location: 'Butuan City, Agusan del Norte'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Battery Warning',
    description: 'Multiple nodes in Surigao showing low battery levels',
    nodeId: 'CRG-078',
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    location: 'Surigao City, Surigao del Norte'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Solar Panel Efficiency',
    description: 'Reduced charging efficiency detected in Siargao nodes',
    nodeId: 'CRG-091',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    location: 'Siargao, Surigao del Norte'
  },
  {
    id: 4,
    type: 'info',
    title: 'Maintenance Scheduled',
    description: 'Planned maintenance for Dinagat Island nodes',
    nodeId: 'CRG-103',
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    location: 'Dinagat, Dinagat Islands'
  }
]

const generateDataLogs = (nodes) => {
  const logs = []
  const now = new Date()
  
  // Generate logs for the last 24 hours
  for (let i = 0; i < 500; i++) {
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)]
    const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000)
    
    logs.push({
      id: i + 1,
      timestamp,
      nodeId: randomNode.id,
      status: randomNode.status,
      batteryVoltage: (randomNode.batteryVoltage + (Math.random() - 0.5) * 0.5).toFixed(1),
      rssi: (randomNode.rssi + (Math.random() - 0.5) * 5).toFixed(0),
      snr: (randomNode.snr + (Math.random() - 0.5) * 2).toFixed(1),
      latency: (20 + Math.random() * 200).toFixed(1),
      location: `${randomNode.city}, ${randomNode.province}`,
      temperature: (25 + Math.random() * 10).toFixed(1),
      humidity: (60 + Math.random() * 30).toFixed(0),
      lightLevel: Math.floor(randomNode.ambientLight)
    })
  }
  
  return logs.sort((a, b) => b.timestamp - a.timestamp)
}

export const DashboardProvider = ({ children }) => {
  const [technology, setTechnology] = useState('wsn') // 'wsn' or 'lora'
  const [isOnline, setIsOnline] = useState(true)
  const generatedNodes = useState(() => generateCaragaNodes())[0] // Generate once
  const [nodes, setNodes] = useState(generatedNodes)
  const [alerts, setAlerts] = useState(() => generateSystemAlerts())
  const [dataLogs, setDataLogs] = useState(() => generateDataLogs(generatedNodes)) // Initialize with generated logs
  const [lastUpdate, setLastUpdate] = useState(new Date())
  
  // Network performance metrics
  const [networkMetrics, setNetworkMetrics] = useState({
    wsn: {
      pdr: 98.5,
      latency: 24.5,
      throughput: 979.59,
      capacity: 85
    },
    lora: {
      pdr: 96.2,
      latency: 198.88,
      throughput: 150.85,
      capacity: 72
    }
  })
  
  // Economic metrics
  const [economicMetrics, setEconomicMetrics] = useState({
    wsn: {
      irr: 7285,
      bcr: 588.12,
      npv: 23.37,
      payback: 1
    },
    lora: {
      irr: 3367,
      bcr: 272.12,
      npv: 23.27,
      payback: 1
    }
  })
  
  // Signal quality data for different distances in Caraga terrain
  const [signalData, setSignalData] = useState({
    distances: [50, 100, 150, 200, 250],
    wsn: {
      rssi: [-45, -52, -58, -62, -65],
      snr: [15, 13, 11, 9, 7]
    },
    lora: {
      rssi: [-58, -64, -67, -69, -70],
      snr: [12, 10, 8, 6, 5]
    }
  })
  
  // Initialize Caraga Region data
  useEffect(() => {
    const caragaNodes = generateCaragaNodes()
    setNodes(caragaNodes)
    setAlerts(generateSystemAlerts())
    setDataLogs(generateDataLogs(caragaNodes))
  }, [])
  
  // Simulate real-time updates every 15 seconds for remote region
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      
      // Update network metrics with realistic variations for rural area
      setNetworkMetrics(prev => ({
        wsn: {
          pdr: Math.max(95, Math.min(100, prev.wsn.pdr + (Math.random() - 0.5) * 2)),
          latency: Math.max(20, prev.wsn.latency + (Math.random() - 0.5) * 8),
          throughput: Math.max(850, prev.wsn.throughput + (Math.random() - 0.5) * 150),
          capacity: Math.max(70, Math.min(95, prev.wsn.capacity + (Math.random() - 0.5) * 12))
        },
        lora: {
          pdr: Math.max(88, Math.min(98, prev.lora.pdr + (Math.random() - 0.5) * 3)),
          latency: Math.max(160, prev.lora.latency + (Math.random() - 0.5) * 40),
          throughput: Math.max(100, prev.lora.throughput + (Math.random() - 0.5) * 50),
          capacity: Math.max(55, Math.min(85, prev.lora.capacity + (Math.random() - 0.5) * 15))
        }
      }))
      
      // Update node data with tropical weather considerations
      setNodes(prev => prev.map(node => ({
        ...node,
        batteryVoltage: Math.max(10, Math.min(14, node.batteryVoltage + (Math.random() - 0.5) * 0.3)),
        ambientLight: Math.max(0, node.ambientLight + (Math.random() - 0.5) * 100), // More variation due to weather
        powerConsumption: Math.max(1, Math.min(5, node.powerConsumption + (Math.random() - 0.5) * 0.4)),
        rssi: Math.max(-90, Math.min(-40, node.rssi + (Math.random() - 0.5) * 6)), // Island terrain effects
        snr: Math.max(0, Math.min(20, node.snr + (Math.random() - 0.5) * 3)),
        solarCharging: node.ambientLight > 300 ? Math.random() > 0.2 : Math.random() > 0.7 // Weather dependent
      })))
      
    }, 15000) // Update every 15 seconds for rural monitoring
    
    return () => clearInterval(interval)
  }, [])
  
  const value = {
    technology,
    setTechnology,
    isOnline,
    setIsOnline,
    nodes,
    setNodes,
    alerts,
    setAlerts,
    dataLogs,
    setDataLogs,
    networkMetrics,
    economicMetrics,
    signalData,
    lastUpdate,
    // Caraga specific data
    caragaCities: CARAGA_CITIES,
    region: 'Caraga Region XIII'
  }
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}