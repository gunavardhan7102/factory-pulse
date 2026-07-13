// DFPCL Multi-Plant and Process Unit Hierarchy
// Defines the organizational structure of plants, process units, and equipment types

export type PlantName = "Taloja" | "Ratnagiri" | "Goa"
export type ProcessUnitName = "Ammonia Plant" | "Nitric Acid Plant" | "Utility Plant"

export interface ProcessUnit {
  id: string
  name: ProcessUnitName
  description: string
  equipmentTypes: string[]
}

export interface Plant {
  id: string
  name: PlantName
  location: string
  processUnits: ProcessUnit[]
}

// Equipment types used across the chemical/fertilizer industry
export const equipmentTypeCategories = {
  compressionAndVacuum: [
    "Centrifugal Compressor",
    "Reciprocating Compressor",
    "Screw Compressor",
    "Oil-Free Compressor",
    "Vacuum Pump",
  ],
  reactorsAndVessels: [
    "High-Pressure Reactor",
    "Fixed-Bed Reactor",
    "Fluidized-Bed Reactor",
    "Storage Tank with Agitation",
  ],
  heatTransfer: [
    "Multi-Tube Heat Exchanger",
    "Plate Heat Exchanger",
    "Air Cooler",
    "Tube Bundle Cooler",
  ],
  pumpingAndFlow: [
    "Centrifugal Pump",
    "Multi-Stage Centrifugal Pump",
    "Reciprocating Pump",
    "Gear Pump",
  ],
  contactors: [
    "Packed Absorption Tower",
    "Plate Column",
    "Spray Tower",
    "Bubble Column",
  ],
  utilities: [
    "Water-Tube Boiler",
    "Fire-Tube Boiler",
    "Induced Draft Tower",
    "Centrifugal Chiller",
    "Desiccant Air Dryer",
    "Rotary Compressor",
    "Diesel Generator Set",
  ],
}

// Plant hierarchy structure
export const plantHierarchy: Plant[] = [
  {
    id: "plant-taloja",
    name: "Taloja",
    location: "Taloja, Maharashtra",
    processUnits: [
      {
        id: "amn-plant-taloja",
        name: "Ammonia Plant",
        description: "Primary ammonia synthesis and hydrocarbon reforming unit",
        equipmentTypes: [
          "Centrifugal Compressor",
          "High-Pressure Reactor",
          "Multi-Tube Heat Exchanger",
          "Centrifugal Pump",
          "Storage Tank with Agitation",
        ],
      },
      {
        id: "nit-plant-taloja",
        name: "Nitric Acid Plant",
        description: "Nitric acid production and concentration facilities",
        equipmentTypes: [
          "Packed Absorption Tower",
          "Tube Bundle Cooler",
          "Storage Tank with Agitation",
          "Multi-Stage Centrifugal Pump",
        ],
      },
      {
        id: "util-plant-taloja",
        name: "Utility Plant",
        description: "Steam, power, cooling, and supporting utilities",
        equipmentTypes: [
          "Water-Tube Boiler",
          "Induced Draft Tower",
          "Centrifugal Chiller",
          "Multi-Stage Centrifugal Pump",
          "Desiccant Air Dryer",
        ],
      },
    ],
  },
  {
    id: "plant-ratnagiri",
    name: "Ratnagiri",
    location: "Ratnagiri, Maharashtra",
    processUnits: [
      {
        id: "amn-plant-ratnagiri",
        name: "Ammonia Plant",
        description: "Ammonia synthesis with integrated compression",
        equipmentTypes: [
          "Centrifugal Compressor",
          "Multi-Tube Heat Exchanger",
          "High-Pressure Reactor",
        ],
      },
      {
        id: "util-plant-ratnagiri",
        name: "Utility Plant",
        description: "Steam and power generation facilities",
        equipmentTypes: ["Water-Tube Boiler", "Induced Draft Tower"],
      },
    ],
  },
  {
    id: "plant-goa",
    name: "Goa",
    location: "Goa",
    processUnits: [
      {
        id: "util-plant-goa",
        name: "Utility Plant",
        description: "Backup utilities and emergency systems",
        equipmentTypes: ["Diesel Generator Set"],
      },
    ],
  },
]

// Helper functions
export function getPlantByName(plantName: PlantName): Plant | undefined {
  return plantHierarchy.find((p) => p.name === plantName)
}

export function getProcessUnitsByPlant(plantName: PlantName): ProcessUnit[] {
  const plant = getPlantByName(plantName)
  return plant?.processUnits || []
}

export function getProcessUnitByName(
  plantName: PlantName,
  unitName: ProcessUnitName
): ProcessUnit | undefined {
  const plant = getPlantByName(plantName)
  return plant?.processUnits.find((u) => u.name === unitName)
}

export function getEquipmentTypesForUnit(
  plantName: PlantName,
  unitName: ProcessUnitName
): string[] {
  const unit = getProcessUnitByName(plantName, unitName)
  return unit?.equipmentTypes || []
}

export function getAllPlants(): PlantName[] {
  return plantHierarchy.map((p) => p.name)
}

export function getAllProcessUnits(): ProcessUnitName[] {
  const units: ProcessUnitName[] = []
  plantHierarchy.forEach((plant) => {
    plant.processUnits.forEach((unit) => {
      if (!units.includes(unit.name)) {
        units.push(unit.name)
      }
    })
  })
  return units
}
