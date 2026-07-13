// Terminology mapping for consistent UI naming across the entire application
// This ensures Machine → Equipment, Health Score → EHI, etc.
// DFPCL-specific terminology and process plant context

export const terminologyMap = {
  // Core entities
  machine: "Process Asset",
  machines: "Process Assets",
  machineId: "Equipment ID",
  
  // Health metrics
  healthScore: "Equipment Health Index (EHI)",
  healthScores: "Health Indices",
  health: "Health",
  
  // Failures & Predictions
  prediction: "Failure Prediction",
  predictions: "Failure Predictions",
  failureProbability: "Failure Risk",
  predictedFailure: "Predicted Failure",
  
  // Work & Maintenance
  job: "Work Order",
  jobs: "Work Orders",
  workOrder: "Work Order",
  workOrders: "Work Orders",
  maintenance: "Maintenance",
  
  // Alerts
  alert: "Maintenance Alert",
  alerts: "Maintenance Alerts",
  alarm: "Alarm",
  
  // Personnel
  worker: "Technician",
  workers: "Technicians",
  technician: "Technician",
  technicians: "Technicians",
  
  // Fleet
  fleet: "Process Asset Fleet",
  
  // Status terms
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
  running: "Running",
  standby: "Standby",
  maintenance: "Maintenance",
  shutdown: "Shutdown",
  
  // DFPCL-specific terms
  dfpcl: "DFPCL",
  plant: "Plant",
  plants: "Plants",
  processUnit: "Process Unit",
  processUnits: "Process Units",
  tagId: "Equipment Tag",
  operatingStatus: "Operating Status",
  
  // Process plant equipment types
  compressor: "Compressor",
  reactor: "Reactor",
  heatExchanger: "Heat Exchanger",
  pump: "Pump",
  tower: "Tower",
  tank: "Tank",
  boiler: "Boiler",
  cooler: "Cooler",
  chiller: "Chiller",
  dryer: "Dryer",
} as const

export function getTerminology(key: keyof typeof terminologyMap): string {
  return terminologyMap[key]
}

export function translateText(text: string): string {
  let result = text
  
  // Replace common terms
  result = result.replace(/\bmachine\b/gi, (match) => 
    match === "Machine" ? getTerminology("machine") : getTerminology("machines")
  )
  result = result.replace(/\bHealth Score\b/g, getTerminology("healthScore"))
  result = result.replace(/\bhealth score\b/gi, getTerminology("healthScore").toLowerCase())
  result = result.replace(/\bFailure Probability\b/g, getTerminology("failureProbability"))
  result = result.replace(/\bPrediction\b/g, getTerminology("prediction"))
  result = result.replace(/\bWork Order\b/g, getTerminology("workOrder"))
  result = result.replace(/\bTechnician\b/g, getTerminology("technician"))
  result = result.replace(/\bAlert\b/g, getTerminology("alert"))
  
  return result
}
