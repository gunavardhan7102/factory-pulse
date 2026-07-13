export type MachineStatus = "healthy" | "warning" | "critical"
export type FailureProbability = "Low" | "Medium" | "High"
export type AssetCriticality = "Critical" | "High" | "Medium" | "Low"
export type AlertLevel = "Information" | "Warning" | "Alarm" | "Critical" | "Emergency"
export type FailureMode = "Bearing Degradation" | "Seal Failure" | "Electrical Fault" | "Mechanical Wear" | "Thermal Anomaly" | "Vibration Spike" | "Performance Degradation"
export type MaintenanceWorkflowStage = "Failure Prediction" | "Maintenance Alert" | "Work Order Created" | "Technician Assigned" | "Technician Accepted" | "In Progress" | "Completed" | "Supervisor Verified" | "Closed"
export type TechnicianSkill = "Bearing Replacement" | "Seal Maintenance" | "Electrical Repair" | "Mechanical Adjustment" | "Thermal System" | "Vibration Analysis" | "Preventive Maintenance"

export interface EquipmentHealthIndex {
  score: number // 0-100
  mechanical: number // Contributing factor
  electrical: number // Contributing factor
  thermal: number // Contributing factor
  operational: number // Contributing factor
  temperature?: number // Contribution percentage
  vibration?: number // Contribution percentage
  current?: number // Contribution percentage
  maintenanceHistory?: number // Contribution percentage
  aiPrediction?: number // Contribution percentage
  trend: "improving" | "stable" | "degrading"
  lastUpdated?: string // Timestamp like "10 sec ago"
}

export interface FailureAnalysis {
  mode: FailureMode
  probability: number // 0-100
  rootCause: string
  affectedSystems: string[]
  timeToFailure: number // hours
  recommendedAction: string
  estimatedFailureTime?: string // e.g., "6 Days"
}

export interface RootCauseAnalysis {
  cause: string
  probability: number // 0-100
}

export interface TechnicianProfile {
  id: string
  name: string
  skills: TechnicianSkill[]
  availability: "Available" | "Busy" | "Off-duty"
  workloadPercentage: number // 0-100
  rating: number // 1-5 stars
  matchPercentage?: number // AI recommendation match %
}

export interface MaintenanceWorkflowStep {
  stage: MaintenanceWorkflowStage
  timestamp?: string
  notes?: string
  completed: boolean
}

export interface HealthExplanation {
  lastUpdated: string
  contributors: {
    temperature: { value: number; change: number; status: "up" | "down" | "stable" }
    vibration: { value: number; change: number; status: "up" | "down" | "stable" }
    current: { value: number; change: number; status: "up" | "down" | "stable" }
    maintenanceHistory: { value: number; status: "good" | "fair" | "poor" }
    aiPrediction: { value: number; status: "positive" | "neutral" | "negative" }
  }
}

export interface Machine {
  id: string
  name: string
  type: string
  location: string
  plant?: string // e.g., "Taloja", "Ratnagiri", "Goa"
  processUnit?: string // e.g., "Ammonia Plant", "Nitric Acid Plant", "Utility Plant"
  line?: string // e.g., "Line 1"
  tagId?: string // Equipment tag ID (e.g., "AMN-COMP-001")
  image: string
  temperature: number
  vibration: number
  runtimeHours: number
  currentDraw: number
  healthScore: number
  ehi?: EquipmentHealthIndex // Equipment Health Index
  failureProbability: FailureProbability
  status: MachineStatus
  remainingUsefulLife: number // days
  predictedFailureDate: string | null
  confidence: number
  criticality?: AssetCriticality // Asset criticality for prioritization
  mtbf?: number // Mean Time Between Failures (hours)
  mttr?: number // Mean Time To Repair (hours)
  failureAnalysis?: FailureAnalysis[] // Potential failure modes
  rootCauseAnalysis?: RootCauseAnalysis[] // Root cause breakdown
  availability?: number // 0-100 percentage
  lastMaintenanceDate?: string
  nextScheduledMaintenance?: string
  serialNumber?: string
  installDate?: string
  manufacturer?: string
  model?: string
  operationalStatus?: "Running" | "Standby" | "Maintenance" | "Shutdown"
  currentRuntime?: number // Current session runtime in hours
  pressure?: number // Additional sensor for certain equipment
  flowRate?: number // Flow rate for pumps and compressors (m³/h)
  tankLevel?: number // Tank level percentage for storage vessels
  pH?: number // pH value for chemical processes
  differentialPressure?: number // Differential pressure in kPa
  gasLeakage?: number // Gas leakage indicator or boolean
  valvePosition?: number // Valve position percentage
  bearingTemperature?: number // Bearing temperature in °C
  workflow?: MaintenanceWorkflowStep[] // Maintenance workflow tracking
  healthExplanation?: HealthExplanation
}

export const machines: Machine[] = [
  // Taloja - Ammonia Plant
  {
    id: "M-101",
    name: "Primary Air Compressor 1A",
    type: "Centrifugal Compressor",
    location: "Taloja — Ammonia Plant",
    plant: "Taloja",
    processUnit: "Ammonia Plant",
    tagId: "AMN-COMP-001",
    image: "/compressor.png",
    temperature: 82,
    vibration: 4.0,
    runtimeHours: 34250,
    currentDraw: 48.2,
    healthScore: 78,
    pressure: 185,
    flowRate: 450,
    operationalStatus: "Running",
    ehi: {
      score: 78,
      mechanical: 72,
      electrical: 85,
      thermal: 68,
      operational: 82,
      trend: "degrading",
    },
    failureProbability: "High",
    status: "warning",
    remainingUsefulLife: 15,
    predictedFailureDate: "2026-06-25",
    confidence: 91,
    criticality: "Critical",
    mtbf: 4200,
    mttr: 12,
    availability: 98.5,
    lastMaintenanceDate: "2026-05-15",
    nextScheduledMaintenance: "2026-06-15",
    serialNumber: "TPS-2019-001",
    installDate: "2015-03-10",
    manufacturer: "Siemens",
    model: "S100-450-A",
    failureAnalysis: [
      {
        mode: "Bearing Degradation",
        probability: 72,
        rootCause: "Extended runtime causing bearing wear",
        affectedSystems: ["Main bearing assembly", "Thrust bearing", "Oil circulation"],
        timeToFailure: 360,
        recommendedAction: "Schedule bearing replacement within 2 weeks",
      },
    ],
  },
  {
    id: "M-205",
    name: "Synthesis Reactor Main",
    type: "High-Pressure Reactor",
    location: "Taloja — Ammonia Plant",
    plant: "Taloja",
    processUnit: "Ammonia Plant",
    tagId: "AMN-RCTM-001",
    image: "/reactor.png",
    temperature: 64,
    vibration: 1.8,
    runtimeHours: 28900,
    currentDraw: 22.5,
    healthScore: 94,
    pressure: 250,
    tankLevel: 78.5,
    operationalStatus: "Running",
    ehi: {
      score: 94,
      mechanical: 95,
      electrical: 92,
      thermal: 96,
      operational: 93,
      trend: "stable",
    },
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 240,
    predictedFailureDate: null,
    confidence: 88,
    criticality: "Critical",
    mtbf: 5800,
    mttr: 8,
    availability: 99.2,
    lastMaintenanceDate: "2026-05-10",
    nextScheduledMaintenance: "2026-08-10",
    serialNumber: "TPS-2020-045",
    installDate: "2018-09-14",
    manufacturer: "Thyssenkrupp",
    model: "HPS-300-250",
  },
  {
    id: "M-312",
    name: "Heat Exchanger Train A",
    type: "Multi-Tube Heat Exchanger",
    location: "Taloja — Ammonia Plant",
    plant: "Taloja",
    processUnit: "Ammonia Plant",
    tagId: "AMN-HEXA-001",
    image: "/heat-exchanger.png",
    temperature: 91,
    vibration: 6.2,
    runtimeHours: 42300,
    currentDraw: 61.0,
    healthScore: 52,
    flowRate: 380,
    differentialPressure: 45,
    operationalStatus: "Maintenance",
    ehi: {
      score: 52,
      mechanical: 48,
      electrical: 58,
      thermal: 42,
      operational: 55,
      trend: "degrading",
    },
    failureProbability: "High",
    status: "critical",
    remainingUsefulLife: 6,
    predictedFailureDate: "2026-06-16",
    confidence: 95,
    criticality: "Critical",
    mtbf: 3850,
    mttr: 16,
    availability: 96.2,
    lastMaintenanceDate: "2026-04-20",
    nextScheduledMaintenance: "2026-06-16",
    serialNumber: "TPS-2018-023",
    installDate: "2013-11-05",
    manufacturer: "API",
    model: "APEX-600-45",
    failureAnalysis: [
      {
        mode: "Thermal Anomaly",
        probability: 85,
        rootCause: "Fouling in exchanger tubes reducing efficiency",
        affectedSystems: ["Tube bundle", "Thermosiphon system", "Control valves"],
        timeToFailure: 144,
        recommendedAction: "Schedule tube bundle cleaning immediately",
      },
    ],
  },
  {
    id: "M-118",
    name: "Recirculation Pump",
    type: "Centrifugal Pump",
    location: "Taloja — Ammonia Plant",
    plant: "Taloja",
    processUnit: "Ammonia Plant",
    tagId: "AMN-PUMP-002",
    image: "/pump.png",
    temperature: 58,
    vibration: 2.1,
    runtimeHours: 16420,
    currentDraw: 18.9,
    healthScore: 89,
    flowRate: 125,
    pressure: 42,
    operationalStatus: "Running",
    ehi: {
      score: 89,
      mechanical: 88,
      electrical: 90,
      thermal: 89,
      operational: 89,
      trend: "stable",
    },
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 180,
    predictedFailureDate: null,
    confidence: 84,
    criticality: "High",
    mtbf: 5200,
    mttr: 8,
    availability: 99.4,
    lastMaintenanceDate: "2026-05-20",
    nextScheduledMaintenance: "2026-08-20",
    serialNumber: "TPS-2021-056",
    installDate: "2016-12-01",
    manufacturer: "Flowserve",
    model: "SIHI-150-125",
  },
  // Taloja - Nitric Acid Plant
  {
    id: "M-407",
    name: "Absorption Tower Main",
    type: "Packed Absorption Tower",
    location: "Taloja — Nitric Acid Plant",
    plant: "Taloja",
    processUnit: "Nitric Acid Plant",
    tagId: "NIT-TOWER-001",
    image: "/tower.png",
    temperature: 73,
    vibration: 3.4,
    runtimeHours: 38200,
    currentDraw: 35.7,
    healthScore: 71,
    pressure: 3.5,
    flowRate: 280,
    operationalStatus: "Running",
    ehi: {
      score: 71,
      mechanical: 68,
      electrical: 75,
      thermal: 70,
      operational: 72,
      trend: "degrading",
    },
    failureProbability: "Medium",
    status: "warning",
    remainingUsefulLife: 42,
    predictedFailureDate: "2026-07-22",
    confidence: 79,
    criticality: "Critical",
    mtbf: 4200,
    mttr: 14,
    availability: 97.8,
    lastMaintenanceDate: "2026-05-08",
    nextScheduledMaintenance: "2026-07-08",
    serialNumber: "TPS-2019-078",
    installDate: "2015-06-15",
    manufacturer: "Sulzer",
    model: "SCT-280-3.5",
    failureAnalysis: [
      {
        mode: "Mechanical Wear",
        probability: 58,
        rootCause: "Corrosion and erosion of internal surfaces",
        affectedSystems: ["Packing material", "Support tray", "Liquid distributor"],
        timeToFailure: 1008,
        recommendedAction: "Plan rebuild of internal components",
      },
    ],
  },
  {
    id: "M-220",
    name: "Product Cooler Unit",
    type: "Tube Bundle Cooler",
    location: "Taloja — Nitric Acid Plant",
    plant: "Taloja",
    processUnit: "Nitric Acid Plant",
    tagId: "NIT-COOL-001",
    image: "/cooler.png",
    temperature: 67,
    vibration: 2.6,
    runtimeHours: 25870,
    currentDraw: 29.3,
    healthScore: 86,
    flowRate: 95,
    differentialPressure: 28,
    operationalStatus: "Running",
    ehi: { score: 86, mechanical: 85, electrical: 88, thermal: 86, operational: 85, trend: "stable" },
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 160,
    predictedFailureDate: null,
    confidence: 82,
    criticality: "High",
    mtbf: 4600,
    mttr: 10,
    availability: 98.9,
    lastMaintenanceDate: "2026-04-25",
    nextScheduledMaintenance: "2026-07-25",
    serialNumber: "TPS-2020-034",
    installDate: "2017-02-18",
    manufacturer: "SPX",
    model: "APX-200-28",
  },
  {
    id: "M-509",
    name: "Acid Storage Tank 1",
    type: "Storage Tank with Agitation",
    location: "Taloja — Nitric Acid Plant",
    plant: "Taloja",
    processUnit: "Nitric Acid Plant",
    tagId: "NIT-TANK-001",
    image: "/tank.png",
    temperature: 88,
    vibration: 5.1,
    runtimeHours: 44540,
    currentDraw: 54.8,
    healthScore: 61,
    tankLevel: 82.3,
    pH: 0.8,
    operationalStatus: "Running",
    ehi: { score: 61, mechanical: 58, electrical: 65, thermal: 60, operational: 62, trend: "degrading" },
    failureProbability: "Medium",
    status: "warning",
    remainingUsefulLife: 28,
    predictedFailureDate: "2026-07-08",
    confidence: 86,
    criticality: "High",
    mtbf: 3400,
    mttr: 12,
    availability: 97.5,
    lastMaintenanceDate: "2026-04-30",
    nextScheduledMaintenance: "2026-07-08",
    serialNumber: "TPS-2019-112",
    installDate: "2016-08-07",
    manufacturer: "Pfaudler",
    model: "GL-1000-NSF",
  },
  // Taloja - Utility Plant
  {
    id: "M-133",
    name: "Boiler 1A",
    type: "Water-Tube Boiler",
    location: "Taloja — Utility Plant",
    plant: "Taloja",
    processUnit: "Utility Plant",
    tagId: "UTIL-BOIL-001",
    image: "/boiler.png",
    temperature: 95,
    vibration: 7.0,
    runtimeHours: 67300,
    currentDraw: 68.4,
    healthScore: 44,
    pressure: 42,
    operationalStatus: "Standby",
    ehi: {
      score: 44,
      mechanical: 38,
      electrical: 48,
      thermal: 35,
      operational: 48,
      trend: "degrading",
    },
    failureProbability: "High",
    status: "critical",
    remainingUsefulLife: 4,
    predictedFailureDate: "2026-06-14",
    confidence: 97,
    criticality: "Critical",
    mtbf: 2650,
    mttr: 18,
    availability: 94.8,
    lastMaintenanceDate: "2026-03-10",
    nextScheduledMaintenance: "2026-06-14",
    serialNumber: "TPS-2014-089",
    installDate: "2012-07-22",
    manufacturer: "Babcock & Wilcox",
    model: "FM-1500-42",
    failureAnalysis: [
      {
        mode: "Mechanical Wear",
        probability: 89,
        rootCause: "Tube erosion and scale buildup reducing efficiency",
        affectedSystems: ["Water tubes", "Superheater", "Fuel burner"],
        timeToFailure: 96,
        recommendedAction: "URGENT: Schedule tube cleaning and inspection within 4 days",
      },
    ],
  },
  {
    id: "M-276",
    name: "Cooling Tower Fan",
    type: "Induced Draft Tower",
    location: "Taloja — Utility Plant",
    plant: "Taloja",
    processUnit: "Utility Plant",
    tagId: "UTIL-COOL-001",
    image: "/cooling-tower.png",
    temperature: 61,
    vibration: 1.5,
    runtimeHours: 19210,
    currentDraw: 16.2,
    healthScore: 96,
    flowRate: 680,
    operationalStatus: "Running",
    ehi: { score: 96, mechanical: 96, electrical: 96, thermal: 97, operational: 96, trend: "stable" },
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 300,
    predictedFailureDate: null,
    confidence: 90,
    criticality: "High",
    mtbf: 5100,
    mttr: 6,
    availability: 99.5,
    lastMaintenanceDate: "2026-05-22",
    nextScheduledMaintenance: "2026-08-22",
    serialNumber: "TPS-2021-145",
    installDate: "2019-01-09",
    manufacturer: "BAC",
    model: "FXV-680-IDT",
  },
  {
    id: "M-388",
    name: "Chiller Unit 2",
    type: "Centrifugal Chiller",
    location: "Taloja — Utility Plant",
    plant: "Taloja",
    processUnit: "Utility Plant",
    tagId: "UTIL-CHIL-002",
    image: "/chiller.png",
    temperature: 76,
    vibration: 3.9,
    runtimeHours: 31750,
    currentDraw: 41.1,
    healthScore: 74,
    flowRate: 125,
    bearingTemperature: 58,
    operationalStatus: "Running",
    ehi: { score: 74, mechanical: 72, electrical: 78, thermal: 75, operational: 73, trend: "degrading" },
    failureProbability: "Medium",
    status: "warning",
    remainingUsefulLife: 38,
    predictedFailureDate: "2026-07-18",
    confidence: 80,
    criticality: "High",
    mtbf: 3700,
    mttr: 10,
    availability: 97.9,
    lastMaintenanceDate: "2026-05-05",
    nextScheduledMaintenance: "2026-07-18",
    serialNumber: "TPS-2018-167",
    installDate: "2016-10-20",
    manufacturer: "Carrier",
    model: "19XR-125",
  },
  {
    id: "M-142",
    name: "Feedwater Pump",
    type: "Multi-Stage Centrifugal Pump",
    location: "Taloja — Utility Plant",
    plant: "Taloja",
    processUnit: "Utility Plant",
    tagId: "UTIL-PUMP-001",
    image: "/feedwater-pump.png",
    temperature: 69,
    vibration: 2.3,
    runtimeHours: 29640,
    currentDraw: 24.0,
    healthScore: 91,
    flowRate: 85,
    pressure: 55,
    operationalStatus: "Running",
    ehi: { score: 91, mechanical: 92, electrical: 90, thermal: 91, operational: 90, trend: "stable" },
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 210,
    predictedFailureDate: null,
    confidence: 85,
    criticality: "Critical",
    mtbf: 4950,
    mttr: 8,
    availability: 99.3,
    lastMaintenanceDate: "2026-05-18",
    nextScheduledMaintenance: "2026-08-18",
    serialNumber: "TPS-2020-178",
    installDate: "2016-04-11",
    manufacturer: "KSB",
    model: "CPKN-85-55",
  },
  {
    id: "M-451",
    name: "Air Dryer Unit 1",
    type: "Desiccant Air Dryer",
    location: "Taloja — Utility Plant",
    plant: "Taloja",
    processUnit: "Utility Plant",
    tagId: "UTIL-DRYR-001",
    image: "/air-dryer.png",
    temperature: 84,
    vibration: 4.7,
    runtimeHours: 21800,
    currentDraw: 52.3,
    healthScore: 66,
    flowRate: 210,
    operationalStatus: "Running",
    ehi: { score: 66, mechanical: 64, electrical: 70, thermal: 65, operational: 67, trend: "degrading" },
    failureProbability: "Medium",
    status: "warning",
    remainingUsefulLife: 33,
    predictedFailureDate: "2026-07-13",
    confidence: 83,
    criticality: "Medium",
    mtbf: 3500,
    mttr: 11,
    availability: 97.6,
    lastMaintenanceDate: "2026-04-15",
    nextScheduledMaintenance: "2026-07-13",
    serialNumber: "TPS-2019-189",
    installDate: "2016-11-28",
    manufacturer: "Atlas Copco",
    model: "FD-210-M",
  },
  // Ratnagiri - Ammonia Plant
  {
    id: "M-601",
    name: "Secondary Air Compressor",
    type: "Centrifugal Compressor",
    location: "Ratnagiri — Ammonia Plant",
    plant: "Ratnagiri",
    processUnit: "Ammonia Plant",
    tagId: "AMN-COMP-002",
    image: "/compressor.png",
    temperature: 78,
    vibration: 3.2,
    runtimeHours: 22150,
    currentDraw: 42.1,
    healthScore: 82,
    pressure: 175,
    flowRate: 320,
    operationalStatus: "Running",
    ehi: { score: 82, mechanical: 80, electrical: 84, thermal: 82, operational: 83, trend: "stable" },
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 140,
    predictedFailureDate: null,
    confidence: 86,
    criticality: "High",
    mtbf: 4800,
    mttr: 11,
    availability: 99.1,
    lastMaintenanceDate: "2026-05-12",
    nextScheduledMaintenance: "2026-08-12",
    serialNumber: "RAT-2020-034",
    installDate: "2018-04-15",
    manufacturer: "Siemens",
    model: "S100-320-B",
  },
  {
    id: "M-602",
    name: "Heat Exchanger Train B",
    type: "Multi-Tube Heat Exchanger",
    location: "Ratnagiri — Ammonia Plant",
    plant: "Ratnagiri",
    processUnit: "Ammonia Plant",
    tagId: "AMN-HEXA-002",
    image: "/heat-exchanger.png",
    temperature: 72,
    vibration: 2.1,
    runtimeHours: 18900,
    currentDraw: 28.4,
    healthScore: 88,
    flowRate: 290,
    differentialPressure: 32,
    operationalStatus: "Running",
    ehi: { score: 88, mechanical: 87, electrical: 89, thermal: 88, operational: 88, trend: "stable" },
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 175,
    predictedFailureDate: null,
    confidence: 87,
    criticality: "High",
    mtbf: 5400,
    mttr: 9,
    availability: 99.0,
    lastMaintenanceDate: "2026-05-08",
    nextScheduledMaintenance: "2026-08-08",
    serialNumber: "RAT-2021-045",
    installDate: "2019-07-20",
    manufacturer: "API",
    model: "APEX-500-32",
  },
  // Ratnagiri - Utility Plant
  {
    id: "M-603",
    name: "Boiler 2A",
    type: "Water-Tube Boiler",
    location: "Ratnagiri — Utility Plant",
    plant: "Ratnagiri",
    processUnit: "Utility Plant",
    tagId: "UTIL-BOIL-002",
    image: "/boiler.png",
    temperature: 88,
    vibration: 5.8,
    runtimeHours: 38250,
    currentDraw: 59.2,
    healthScore: 57,
    pressure: 38,
    operationalStatus: "Standby",
    ehi: { score: 57, mechanical: 54, electrical: 61, thermal: 50, operational: 58, trend: "degrading" },
    failureProbability: "Medium",
    status: "warning",
    remainingUsefulLife: 45,
    predictedFailureDate: "2026-08-24",
    confidence: 81,
    criticality: "High",
    mtbf: 3100,
    mttr: 15,
    availability: 97.2,
    lastMaintenanceDate: "2026-04-08",
    nextScheduledMaintenance: "2026-08-24",
    serialNumber: "RAT-2016-067",
    installDate: "2014-09-03",
    manufacturer: "Babcock & Wilcox",
    model: "FM-1000-38",
  },
  // Goa - Utility Plant
  {
    id: "M-701",
    name: "Emergency Generator",
    type: "Diesel Generator Set",
    location: "Goa — Utility Plant",
    plant: "Goa",
    processUnit: "Utility Plant",
    tagId: "UTIL-GENR-001",
    image: "/generator.png",
    temperature: 79,
    vibration: 2.8,
    runtimeHours: 8450,
    currentDraw: 45.6,
    healthScore: 87,
    operationalStatus: "Standby",
    ehi: { score: 87, mechanical: 86, electrical: 88, thermal: 87, operational: 86, trend: "stable" },
    failureProbability: "Low",
    status: "healthy",
    remainingUsefulLife: 185,
    predictedFailureDate: null,
    confidence: 89,
    criticality: "High",
    mtbf: 4700,
    mttr: 9,
    availability: 99.2,
    lastMaintenanceDate: "2026-05-01",
    nextScheduledMaintenance: "2026-08-01",
    serialNumber: "GOA-2022-012",
    installDate: "2020-06-17",
    manufacturer: "Cummins",
    model: "C1000D5",
  },
]

const machinesWithEHI = machines.filter(m => m.ehi)
const machinesWithMTBF = machines.filter(m => m.mtbf)
const machinesWithMTTR = machines.filter(m => m.mttr)
const machinesWithAvailability = machines.filter(m => m.availability)

export const kpis = {
  totalMachines: machines.length,
  healthyMachines: machines.filter((m) => m.status === "healthy").length,
  atRisk: machines.filter((m) => m.status !== "healthy").length,
  activeWorkOrders: 7,
  overdueWorkOrders: 2,
  predictedFailures30d: machines.filter(
    (m) => m.predictedFailureDate !== null && m.remainingUsefulLife <= 30,
  ).length,
  avgHealthScore: machines.length > 0 ? Math.round(
    machines.reduce((s, m) => s + m.healthScore, 0) / machines.length,
  ) : 0,
  avgEHI: machinesWithEHI.length > 0 ? Math.round(
    machinesWithEHI.reduce((s, m) => s + (m.ehi?.score || 0), 0) / machinesWithEHI.length
  ) : 0,
  avgMTBF: machinesWithMTBF.length > 0 ? Math.round(
    machinesWithMTBF.reduce((s, m) => s + (m.mtbf || 0), 0) / machinesWithMTBF.length
  ) : 0,
  avgMTTR: machinesWithMTTR.length > 0 ? Math.round(
    machinesWithMTTR.reduce((s, m) => s + (m.mttr || 0), 0) / machinesWithMTTR.length
  ) : 0,
  avgAvailability: machinesWithAvailability.length > 0 ? Math.round(
    machinesWithAvailability.reduce((s, m) => s + (m.availability || 0), 0) / machinesWithAvailability.length
  ) : 0,
  predictedFailuresPrevented: 42,
}

export const kpiTrends = {
  avgHealthScore: { current: kpis.avgHealthScore, previous: 81, trend: "down" as const },
  avgEHI: { current: kpis.avgEHI, previous: 74, trend: "up" as const },
  avgMTBF: { current: kpis.avgMTBF, previous: 2650, trend: "down" as const },
  avgMTTR: { current: kpis.avgMTTR, previous: 8.5, trend: "up" as const },
  avgAvailability: { current: kpis.avgAvailability, previous: 97.8, trend: "down" as const },
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
  workflowStage?: MaintenanceWorkflowStage
  technician: string | null
  technicianId?: string
  technicianProfile?: TechnicianProfile
  technicianAccepted: boolean
  assignedAt: string | null
  acceptedAt: string | null
  startedAt: string | null
  reviewedAt: string | null
  completedAt: string | null
  supervisorVerifiedAt?: string | null
  closedAt?: string | null
  parts: string[]
  partsStatus: "Pending" | "Ready" | "Issued" | "Additional Needed"
  partsRequests: PartRequest[]
  subTasks: SubTask[]
  created: string
  due: string
  failurePredictionId?: string // Link to the failure prediction that triggered this WO
  estimatedDuration?: number // Hours
  actualDuration?: number // Hours
  rootCauseIdentified?: string
  notes?: string
}

export interface Technician {
  name: string
  id: string
  email: string
  phone: string
  status: "available" | "busy" | "off-duty"
  assignedJobs: number
  skills?: TechnicianSkill[]
  workload?: number // 0-100 percentage
  rating?: number // 1-5 stars
  availability?: "Available" | "Busy" | "Off-duty"
}

// Terminology mapping for consistent UI naming
export const terminologyMap = {
  machine: "Equipment",
  machines: "Equipment Fleet",
  healthScore: "Equipment Health Index (EHI)",
  prediction: "Failure Prediction",
  job: "Work Order",
  jobs: "Work Orders",
  alert: "Maintenance Alert",
  alerts: "Maintenance Alerts",
  worker: "Technician",
  workers: "Technicians",
}

export const technicians: Technician[] = [
  {
    name: "J. Okafor",
    id: "T-001",
    email: "j.okafor@factory.com",
    phone: "+1-555-0101",
    status: "available",
    assignedJobs: 2,
    skills: ["Bearing Replacement", "Mechanical Adjustment", "Preventive Maintenance"],
    workload: 45,
    rating: 4.8,
    availability: "Available",
  },
  {
    name: "M. Larsson",
    id: "T-002",
    email: "m.larsson@factory.com",
    phone: "+1-555-0102",
    status: "busy",
    assignedJobs: 3,
    skills: ["Electrical Repair", "Seal Maintenance", "Vibration Analysis"],
    workload: 78,
    rating: 4.5,
    availability: "Busy",
  },
  {
    name: "R. Mehta",
    id: "T-003",
    email: "r.mehta@factory.com",
    phone: "+1-555-0103",
    status: "available",
    assignedJobs: 1,
    skills: ["Thermal System", "Preventive Maintenance", "Bearing Replacement"],
    workload: 35,
    rating: 5.0,
    availability: "Available",
  },
  {
    name: "A. Costa",
    id: "T-004",
    email: "a.costa@factory.com",
    phone: "+1-555-0104",
    status: "off-duty",
    assignedJobs: 0,
    skills: ["Mechanical Adjustment", "Vibration Analysis", "Electrical Repair"],
    workload: 0,
    rating: 4.7,
    availability: "Off-duty",
  },
  {
    name: "S. Nguyen",
    id: "T-005",
    email: "s.nguyen@factory.com",
    phone: "+1-555-0105",
    status: "available",
    assignedJobs: 4,
    skills: ["Seal Maintenance", "Thermal System", "Preventive Maintenance"],
    workload: 62,
    rating: 4.9,
    availability: "Available",
  },
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
  severity: AlertLevel
  title: string
  machine: string
  machineId?: string
  description?: string
  time: string
  timestamp?: string
  channels: ("Email" | "SMS" | "Push" | "Teams")[]
  read: boolean
  type?: "failure_prediction" | "anomaly" | "threshold_exceeded" | "maintenance_due" | "performance_degradation"
  recommendations?: string[]
  relatedFailureMode?: FailureMode
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
