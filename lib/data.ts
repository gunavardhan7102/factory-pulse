export type MachineStatus = "healthy" | "warning" | "critical"
export type FailureProbability = "Low" | "Medium" | "High"

export interface Machine {
  id: string
  name: string
  type: string
  location: string
  image: string
  temperature: number
  vibration: number
  runtimeHours: number
  currentDraw: number
  healthScore: number
  failureProbability: FailureProbability
  status: MachineStatus
  remainingUsefulLife: number // days
  predictedFailureDate: string | null
  confidence: number
}

export const machines: Machine[] = [
  {
    id: "M-101",
    name: "Hydraulic Press A1",
    type: "Hydraulic Press",
    location: "Factory A — Line 1",
    image: "/hydraulic-press.png",
    temperature: 82,
    vibration: 4.0,
    runtimeHours: 12450,
    currentDraw: 48.2,
    healthScore: 78,
    failureProbability: "High",
    status: "warning",
    remainingUsefulLife: 15,
    predictedFailureDate: "2026-06-25",
    confidence: 91,
  },
  {
    id: "M-205",
    name: "Conveyor Motor B3",
    type: "AC Induction Motor",
    location: "Factory A — Line 2",
    image: "/conveyor-motor.png",
    temperature: 64,
    vibration: 1.8,
    runtimeHours: 8230,
    currentDraw: 22.5,
    healthScore: 94,
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 240,
    predictedFailureDate: null,
    confidence: 88,
  },
  {
    id: "M-312",
    name: "CNC Spindle C2",
    type: "CNC Spindle",
    location: "Factory B — CNC Bay",
    image: "/cnc-spindle.png",
    temperature: 91,
    vibration: 6.2,
    runtimeHours: 18900,
    currentDraw: 61.0,
    healthScore: 52,
    failureProbability: "High",
    status: "critical",
    remainingUsefulLife: 6,
    predictedFailureDate: "2026-06-16",
    confidence: 95,
  },
  {
    id: "M-118",
    name: "Cooling Pump D1",
    type: "Centrifugal Pump",
    location: "Factory A — Utilities",
    image: "/conveyor-motor.png",
    temperature: 58,
    vibration: 2.1,
    runtimeHours: 6420,
    currentDraw: 18.9,
    healthScore: 89,
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 180,
    predictedFailureDate: null,
    confidence: 84,
  },
  {
    id: "M-407",
    name: "Robotic Arm E5",
    type: "6-Axis Robot",
    location: "Factory B — Assembly",
    image: "/motor-twin.png",
    temperature: 73,
    vibration: 3.4,
    runtimeHours: 14200,
    currentDraw: 35.7,
    healthScore: 71,
    failureProbability: "Medium",
    status: "warning",
    remainingUsefulLife: 42,
    predictedFailureDate: "2026-07-22",
    confidence: 79,
  },
  {
    id: "M-220",
    name: "Air Compressor F2",
    type: "Screw Compressor",
    location: "Factory A — Utilities",
    image: "/conveyor-motor.png",
    temperature: 67,
    vibration: 2.6,
    runtimeHours: 9870,
    currentDraw: 29.3,
    healthScore: 86,
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 160,
    predictedFailureDate: null,
    confidence: 82,
  },
  {
    id: "M-509",
    name: "Welding Cell G1",
    type: "Robotic Welder",
    location: "Factory C — Fabrication",
    image: "/motor-twin.png",
    temperature: 88,
    vibration: 5.1,
    runtimeHours: 16540,
    currentDraw: 54.8,
    healthScore: 61,
    failureProbability: "Medium",
    status: "warning",
    remainingUsefulLife: 28,
    predictedFailureDate: "2026-07-08",
    confidence: 86,
  },
  {
    id: "M-133",
    name: "Extruder Motor H4",
    type: "DC Motor",
    location: "Factory C — Extrusion",
    image: "/conveyor-motor.png",
    temperature: 95,
    vibration: 7.0,
    runtimeHours: 21300,
    currentDraw: 68.4,
    healthScore: 44,
    failureProbability: "High",
    status: "critical",
    remainingUsefulLife: 4,
    predictedFailureDate: "2026-06-14",
    confidence: 97,
  },
  {
    id: "M-276",
    name: "Packaging Line I2",
    type: "Servo Drive",
    location: "Factory A — Packaging",
    image: "/cnc-spindle.png",
    temperature: 61,
    vibration: 1.5,
    runtimeHours: 5210,
    currentDraw: 16.2,
    healthScore: 96,
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 300,
    predictedFailureDate: null,
    confidence: 90,
  },
  {
    id: "M-388",
    name: "Grinding Machine J3",
    type: "Surface Grinder",
    location: "Factory B — Finishing",
    image: "/cnc-spindle.png",
    temperature: 76,
    vibration: 3.9,
    runtimeHours: 13750,
    currentDraw: 41.1,
    healthScore: 74,
    failureProbability: "Medium",
    status: "warning",
    remainingUsefulLife: 38,
    predictedFailureDate: "2026-07-18",
    confidence: 80,
  },
  {
    id: "M-142",
    name: "Boiler Feed Pump K1",
    type: "Centrifugal Pump",
    location: "Factory C — Utilities",
    image: "/conveyor-motor.png",
    temperature: 69,
    vibration: 2.3,
    runtimeHours: 7640,
    currentDraw: 24.0,
    healthScore: 91,
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 210,
    predictedFailureDate: null,
    confidence: 85,
  },
  {
    id: "M-451",
    name: "Stamping Press L2",
    type: "Mechanical Press",
    location: "Factory B — Stamping",
    image: "/hydraulic-press.png",
    temperature: 84,
    vibration: 4.7,
    runtimeHours: 17800,
    currentDraw: 52.3,
    healthScore: 66,
    failureProbability: "Medium",
    status: "warning",
    remainingUsefulLife: 33,
    predictedFailureDate: "2026-07-13",
    confidence: 83,
  },
]

export const kpis = {
  totalMachines: machines.length,
  healthyMachines: machines.filter((m) => m.status === "healthy").length,
  atRisk: machines.filter((m) => m.status !== "healthy").length,
  activeWorkOrders: 7,
  predictedFailures30d: machines.filter(
    (m) => m.predictedFailureDate !== null && m.remainingUsefulLife <= 30,
  ).length,
  avgHealthScore: Math.round(
    machines.reduce((s, m) => s + m.healthScore, 0) / machines.length,
  ),
}

export const healthTrend = [
  { month: "Jan", score: 88, target: 90 },
  { month: "Feb", score: 86, target: 90 },
  { month: "Mar", score: 89, target: 90 },
  { month: "Apr", score: 84, target: 90 },
  { month: "May", score: 81, target: 90 },
  { month: "Jun", score: 78, target: 90 },
]

export const failureTimeline = [
  { week: "Wk 1", predicted: 1, actual: 1 },
  { week: "Wk 2", predicted: 2, actual: 1 },
  { week: "Wk 3", predicted: 3, actual: 0 },
  { week: "Wk 4", predicted: 2, actual: 0 },
  { week: "Wk 5", predicted: 4, actual: 0 },
  { week: "Wk 6", predicted: 3, actual: 0 },
]

export const downtimeReduction = [
  { quarter: "Q1", before: 120, after: 88 },
  { quarter: "Q2", before: 110, after: 64 },
  { quarter: "Q3", before: 132, after: 51 },
  { quarter: "Q4", before: 125, after: 38 },
]

export const costSavings = [
  { month: "Jan", savings: 42 },
  { month: "Feb", savings: 58 },
  { month: "Mar", savings: 71 },
  { month: "Apr", savings: 94 },
  { month: "May", savings: 118 },
  { month: "Jun", savings: 146 },
]

export const statusDistribution = [
  { name: "Healthy", value: kpis.healthyMachines, fill: "var(--color-success)" },
  {
    name: "Warning",
    value: machines.filter((m) => m.status === "warning").length,
    fill: "var(--color-warning)",
  },
  {
    name: "Critical",
    value: machines.filter((m) => m.status === "critical").length,
    fill: "var(--color-destructive)",
  },
]

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface PartRequest {
  id: string
  timestamp: string
  message: string
  status: "Pending" | "Approved" | "Ready"
}

export interface WorkOrder {
  id: string
  machineId: string
  machineName: string
  title: string
  priority: "Low" | "Medium" | "High" | "Critical"
  stage: "Pending" | "Assigned" | "In Progress" | "Review" | "Completed"
  technician: string | null
  technicianAccepted: boolean
  assignedAt: string | null
  acceptedAt: string | null
  startedAt: string | null
  reviewedAt: string | null
  completedAt: string | null
  parts: string[]
  partsStatus: "Pending" | "Ready" | "Issued" | "Additional Needed"
  partsRequests: PartRequest[]
  subTasks: SubTask[]
  created: string
  due: string
}

export interface Technician {
  name: string
  id: string
  email: string
  phone: string
  status: "available" | "busy" | "off-duty"
  assignedJobs: number
}

export const technicians: Technician[] = [
  { name: "J. Okafor", id: "T-001", email: "j.okafor@factory.com", phone: "+1-555-0101", status: "available", assignedJobs: 2 },
  { name: "M. Larsson", id: "T-002", email: "m.larsson@factory.com", phone: "+1-555-0102", status: "busy", assignedJobs: 3 },
  { name: "R. Mehta", id: "T-003", email: "r.mehta@factory.com", phone: "+1-555-0103", status: "available", assignedJobs: 1 },
  { name: "A. Costa", id: "T-004", email: "a.costa@factory.com", phone: "+1-555-0104", status: "off-duty", assignedJobs: 0 },
  { name: "S. Nguyen", id: "T-005", email: "s.nguyen@factory.com", phone: "+1-555-0105", status: "available", assignedJobs: 4 },
]

export const workOrders: WorkOrder[] = [
  {
    id: "WO-4821",
    machineId: "M-133",
    machineName: "Extruder Motor H4",
    title: "Bearing replacement — high vibration anomaly",
    priority: "Critical",
    stage: "In Progress",
    technician: "J. Okafor",
    technicianAccepted: true,
    assignedAt: "2026-06-10 08:00",
    acceptedAt: "2026-06-10 08:15",
    startedAt: "2026-06-10 08:30",
    reviewedAt: null,
    completedAt: null,
    parts: ["SKF 6208 bearing", "Grease cartridge", "Seal kit"],
    partsStatus: "Issued",
    partsRequests: [],
    subTasks: [
      { id: "ST-1", title: "Remove old bearing and inspect shaft", completed: true },
      { id: "ST-2", title: "Clean and lubricate shaft surface", completed: true },
      { id: "ST-3", title: "Install new SKF 6208 bearing", completed: true },
      { id: "ST-4", title: "Apply grease and seal", completed: false },
      { id: "ST-5", title: "Run motor test and verify vibration levels", completed: false },
    ],
    created: "2026-06-10",
    due: "2026-06-12",
  },
  {
    id: "WO-4835",
    machineId: "M-205",
    machineName: "Conveyor Motor B3",
    title: "Routine maintenance & oil change",
    priority: "Low",
    stage: "Assigned",
    technician: "M. Larsson",
    technicianAccepted: false,
    assignedAt: "2026-06-11 14:00",
    acceptedAt: null,
    startedAt: null,
    reviewedAt: null,
    completedAt: null,
    parts: ["ISO 46 oil (20L)", "Filter element", "Coupling guard"],
    partsStatus: "Pending",
    partsRequests: [],
    subTasks: [
      { id: "ST-1", title: "Drain old oil from reservoir", completed: false },
      { id: "ST-2", title: "Replace air filter element", completed: false },
      { id: "ST-3", title: "Fill with new ISO 46 oil", completed: false },
      { id: "ST-4", title: "Check pressure gauges", completed: false },
      { id: "ST-5", title: "Run system test", completed: false },
    ],
    created: "2026-06-11",
    due: "2026-06-15",
  },
  {
    id: "WO-4818",
    machineId: "M-101",
    machineName: "Hydraulic Press A1",
    title: "Hydraulic seal degradation",
    priority: "High",
    stage: "Assigned",
    technician: "R. Mehta",
    technicianAccepted: false,
    assignedAt: "2026-06-09 11:00",
    acceptedAt: null,
    startedAt: null,
    reviewedAt: null,
    completedAt: null,
    parts: ["Hydraulic seal kit", "Filter element"],
    partsStatus: "Ready",
    partsRequests: [],
    subTasks: [
      { id: "ST-1", title: "Depressurize hydraulic system", completed: false },
      { id: "ST-2", title: "Remove old seal kit", completed: false },
      { id: "ST-3", title: "Install new seal kit", completed: false },
      { id: "ST-4", title: "Replace filter element", completed: false },
      { id: "ST-5", title: "Pressurize and test for leaks", completed: false },
    ],
    created: "2026-06-08",
    due: "2026-06-20",
  },
  {
    id: "WO-4847",
    machineId: "M-312",
    machineName: "CNC Spindle C2",
    title: "Spindle rebuild — high temp shutdown",
    priority: "Critical",
    stage: "Pending",
    technician: null,
    technicianAccepted: false,
    assignedAt: null,
    acceptedAt: null,
    startedAt: null,
    reviewedAt: null,
    completedAt: null,
    parts: ["Spindle bearing set", "Coolant pump", "Motor coupling"],
    partsStatus: "Pending",
    partsRequests: [],
    subTasks: [
      { id: "ST-1", title: "Drain coolant fluid", completed: false },
      { id: "ST-2", title: "Remove spindle assembly", completed: false },
      { id: "ST-3", title: "Replace bearing set", completed: false },
      { id: "ST-4", title: "Install new coolant pump", completed: false },
      { id: "ST-5", title: "Test spindle rotation and temperature", completed: false },
    ],
    created: "2026-06-11",
    due: "2026-06-13",
  },
  {
    id: "WO-4810",
    machineId: "M-407",
    machineName: "Robotic Arm E5",
    title: "Axis 4 gearbox lubrication",
    priority: "Medium",
    stage: "Pending",
    technician: null,
    technicianAccepted: false,
    assignedAt: null,
    acceptedAt: null,
    startedAt: null,
    reviewedAt: null,
    completedAt: null,
    parts: ["Gear oil", "Gasket"],
    partsStatus: "Pending",
    partsRequests: [],
    subTasks: [
      { id: "ST-1", title: "Drain old gear oil", completed: false },
      { id: "ST-2", title: "Replace gasket seal", completed: false },
      { id: "ST-3", title: "Fill with fresh gear oil", completed: false },
      { id: "ST-4", title: "Check oil level", completed: false },
      { id: "ST-5", title: "Rotate axis and verify operation", completed: false },
    ],
    created: "2026-06-06",
    due: "2026-07-18",
  },
  {
    id: "WO-4802",
    machineId: "M-451",
    machineName: "Stamping Press L2",
    title: "Die clearance calibration",
    priority: "Medium",
    stage: "In Progress",
    technician: "R. Mehta",
    technicianAccepted: true,
    assignedAt: "2026-06-08 10:30",
    acceptedAt: "2026-06-08 10:45",
    startedAt: "2026-06-08 11:00",
    reviewedAt: null,
    completedAt: null,
    parts: ["Die set", "Shims"],
    partsStatus: "Ready",
    partsRequests: [],
    subTasks: [
      { id: "ST-1", title: "Remove press dies", completed: false },
      { id: "ST-2", title: "Calibrate die clearance with shims", completed: false },
      { id: "ST-3", title: "Reinstall calibrated dies", completed: false },
      { id: "ST-4", title: "Perform test run", completed: false },
      { id: "ST-5", title: "Verify clearance precision", completed: false },
    ],
    created: "2026-06-05",
    due: "2026-06-19",
  },
  {
    id: "WO-4795",
    machineId: "M-220",
    machineName: "Air Compressor F2",
    title: "Quarterly filter & oil change",
    priority: "Low",
    stage: "Completed",
    technician: "S. Nguyen",
    technicianAccepted: true,
    assignedAt: "2026-05-29 09:00",
    acceptedAt: "2026-05-29 09:15",
    startedAt: "2026-05-29 09:30",
    reviewedAt: "2026-06-02 14:20",
    completedAt: "2026-06-02 14:30",
    parts: ["Air filter", "Compressor oil"],
    partsStatus: "Issued",
    partsRequests: [],
    subTasks: [
      { id: "ST-1", title: "Drain old compressor oil", completed: true },
      { id: "ST-2", title: "Replace air filter cartridge", completed: true },
      { id: "ST-3", title: "Fill with new synthetic oil", completed: true },
      { id: "ST-4", title: "Check pressure relief valve", completed: true },
      { id: "ST-5", title: "Run system and verify performance", completed: true },
    ],
    created: "2026-05-28",
    due: "2026-06-02",
  },
]

export interface SensorReading {
  time: string
  temperature: number
  vibration: number
  current: number
}

export function generateSensorTimeline(): SensorReading[] {
  const data: SensorReading[] = []
  for (let i = 23; i >= 0; i--) {
    const base = 82 - i * 0.2
    data.push({
      time: `${String(23 - i).padStart(2, "0")}:00`,
      temperature: Math.round((base + Math.sin(i) * 3 + Math.random() * 2) * 10) / 10,
      vibration: Math.round((3.5 + Math.cos(i / 2) * 0.8 + Math.random() * 0.4) * 10) / 10,
      current: Math.round((45 + Math.sin(i / 3) * 6 + Math.random() * 3) * 10) / 10,
    })
  }
  return data
}

export const maintenanceHistory = [
  { date: "2026-05-12", action: "Vibration sensor recalibrated", tech: "R. Mehta" },
  { date: "2026-03-28", action: "Hydraulic fluid replaced", tech: "S. Nguyen" },
  { date: "2026-01-15", action: "Bearing inspection — passed", tech: "J. Okafor" },
  { date: "2025-11-02", action: "Seal kit replacement", tech: "A. Costa" },
  { date: "2025-08-19", action: "Annual overhaul completed", tech: "M. Larsson" },
]

export const anomalyData = [
  { time: "T-12h", value: 3.2, anomaly: false },
  { time: "T-10h", value: 3.4, anomaly: false },
  { time: "T-8h", value: 3.3, anomaly: false },
  { time: "T-6h", value: 4.1, anomaly: false },
  { time: "T-4h", value: 5.8, anomaly: true },
  { time: "T-2h", value: 4.6, anomaly: false },
  { time: "Now", value: 6.2, anomaly: true },
]

export const forecastData = [
  { day: "Today", actual: 78, forecast: 78 },
  { day: "+5d", actual: null, forecast: 72 },
  { day: "+10d", actual: null, forecast: 65 },
  { day: "+15d", actual: null, forecast: 54 },
  { day: "+20d", actual: null, forecast: 42 },
  { day: "+25d", actual: null, forecast: 31 },
  { day: "+30d", actual: null, forecast: 22 },
]

export interface Connection {
  id: string
  name: string
  protocol: "OPC UA" | "MQTT" | "Cloud IoT" | "PLC"
  endpoint: string
  status: "Connected" | "Degraded" | "Offline"
  machines: number
  latency: number
}

export const connections: Connection[] = [
  {
    id: "C-01",
    name: "Factory A — Siemens S7 PLC",
    protocol: "OPC UA",
    endpoint: "opc.tcp://10.0.4.12:4840",
    status: "Connected",
    machines: 18,
    latency: 12,
  },
  {
    id: "C-02",
    name: "Factory B — MQTT Broker",
    protocol: "MQTT",
    endpoint: "mqtt://broker.factoryb.local:1883",
    status: "Connected",
    machines: 24,
    latency: 8,
  },
  {
    id: "C-03",
    name: "Factory C — Azure IoT Hub",
    protocol: "Cloud IoT",
    endpoint: "factoryc.azure-devices.net",
    status: "Degraded",
    machines: 15,
    latency: 142,
  },
  {
    id: "C-04",
    name: "Factory A — Allen-Bradley PLC",
    protocol: "PLC",
    endpoint: "192.168.1.55 / EtherNet-IP",
    status: "Connected",
    machines: 9,
    latency: 6,
  },
]

export interface AlertItem {
  id: string
  severity: "critical" | "warning" | "info"
  title: string
  machine: string
  time: string
  channels: ("Email" | "SMS" | "Push" | "Teams")[]
  read: boolean
}

export const alerts: AlertItem[] = [
  {
    id: "A-901",
    severity: "critical",
    title: "Imminent failure predicted — 4 days RUL",
    machine: "M-133 Extruder Motor H4",
    time: "2 min ago",
    channels: ["Email", "SMS", "Push", "Teams"],
    read: false,
  },
  {
    id: "A-900",
    severity: "critical",
    title: "Spindle temperature exceeded 90°C threshold",
    machine: "M-312 CNC Spindle C2",
    time: "18 min ago",
    channels: ["Email", "Push", "Teams"],
    read: false,
  },
  {
    id: "A-898",
    severity: "warning",
    title: "Vibration anomaly detected",
    machine: "M-101 Hydraulic Press A1",
    time: "1 hr ago",
    channels: ["Email", "Push"],
    read: false,
  },
  {
    id: "A-895",
    severity: "warning",
    title: "Maintenance due in 7 days",
    machine: "M-509 Welding Cell G1",
    time: "3 hr ago",
    channels: ["Email"],
    read: true,
  },
  {
    id: "A-890",
    severity: "info",
    title: "Connection latency elevated",
    machine: "Factory C — Azure IoT Hub",
    time: "5 hr ago",
    channels: ["Teams"],
    read: true,
  },
]

export interface ErpSystem {
  name: string
  status: "Connected" | "Not Connected"
  lastSync: string
  purchaseRequests: number
}

export const erpSystems: ErpSystem[] = [
  { name: "SAP S/4HANA", status: "Connected", lastSync: "5 min ago", purchaseRequests: 14 },
  { name: "Oracle E-Business Suite", status: "Connected", lastSync: "22 min ago", purchaseRequests: 6 },
  { name: "Microsoft Dynamics 365", status: "Not Connected", lastSync: "—", purchaseRequests: 0 },
]

export interface TechnicianJob {
  id: string
  machineId: string
  machineName: string
  location: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Assigned" | "In Progress" | "Completed"
  checklist: { task: string; done: boolean }[]
  parts: string[]
}

export const technicianJobs: TechnicianJob[] = [
  {
    id: "WO-4821",
    machineId: "M-133",
    machineName: "Extruder Motor H4",
    location: "Factory C — Extrusion",
    priority: "Critical",
    status: "In Progress",
    checklist: [
      { task: "Lockout / tagout machine", done: true },
      { task: "Inspect drive-end bearing", done: true },
      { task: "Replace bearing 6208-2RS", done: false },
      { task: "Replace shaft seal", done: false },
      { task: "Verify vibration < 3 mm/s", done: false },
    ],
    parts: ["Bearing 6208-2RS", "Shaft seal", "Lubricant"],
  },
  {
    id: "WO-4820",
    machineId: "M-312",
    machineName: "CNC Spindle C2",
    location: "Factory B — CNC Bay",
    priority: "Critical",
    status: "Assigned",
    checklist: [
      { task: "Review thermal logs", done: false },
      { task: "Inspect coolant pump", done: false },
      { task: "Replace thermal sensor", done: false },
    ],
    parts: ["Coolant pump", "Thermal sensor"],
  },
  {
    id: "WO-4818",
    machineId: "M-101",
    machineName: "Hydraulic Press A1",
    location: "Factory A — Line 1",
    priority: "High",
    status: "Assigned",
    checklist: [
      { task: "Depressurize hydraulic system", done: false },
      { task: "Replace seal kit", done: false },
      { task: "Replace filter element", done: false },
      { task: "Pressure test to 200 bar", done: false },
    ],
    parts: ["Hydraulic seal kit", "Filter element"],
  },
]

export function statusColor(status: MachineStatus) {
  switch (status) {
    case "healthy":
      return "text-success"
    case "warning":
      return "text-warning"
    case "critical":
      return "text-destructive"
  }
}
