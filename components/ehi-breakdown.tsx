import { EquipmentHealthIndex } from "@/lib/data"
import { TrendingDown, TrendingUp } from "lucide-react"

interface EHIBreakdownProps {
  ehi?: EquipmentHealthIndex
  compact?: boolean
}

export function EHIBreakdown({ ehi, compact = false }: EHIBreakdownProps) {
  if (!ehi) {
    return <div className="text-sm text-muted-foreground">No health data available</div>
  }

  const factors = [
    { label: "Mechanical", value: ehi.mechanical, color: "bg-blue-500" },
    { label: "Electrical", value: ehi.electrical, color: "bg-amber-500" },
    { label: "Thermal", value: ehi.thermal, color: "bg-orange-500" },
    { label: "Operational", value: ehi.operational, color: "bg-green-500" },
  ]

  const trendIcon = ehi.trend === "improving" ? TrendingUp : TrendingDown
  const TrendIcon = trendIcon
  const trendColor = ehi.trend === "improving" ? "text-green-600" : ehi.trend === "stable" ? "text-gray-600" : "text-red-600"
  const trendBgColor = ehi.trend === "improving" ? "bg-green-50" : ehi.trend === "stable" ? "bg-gray-50" : "bg-red-50"

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Equipment Health Index</span>
          <span className="text-lg font-bold">{ehi.score}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              ehi.score >= 80 ? "bg-green-500" : ehi.score >= 60 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${ehi.score}%` }}
          />
        </div>
        <div className={`flex items-center gap-1 text-xs p-1 rounded ${trendBgColor}`}>
          <TrendIcon className={`size-3 ${trendColor}`} />
          <span className={trendColor}>{ehi.trend.charAt(0).toUpperCase() + ehi.trend.slice(1)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Equipment Health Index (EHI)</p>
          <p className="text-xs text-muted-foreground">Composite health score based on multiple factors</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${trendBgColor}`}>
          <TrendIcon className={`size-4 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>
            {ehi.trend.charAt(0).toUpperCase() + ehi.trend.slice(1)}
          </span>
        </div>
      </div>

      {/* Overall score */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Score</span>
          <span className="text-2xl font-bold">{ehi.score}/100</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              ehi.score >= 80 ? "bg-green-500" : ehi.score >= 60 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${ehi.score}%` }}
          />
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {factors.map((factor) => (
          <div key={factor.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{factor.label}</span>
              <span className="text-sm font-bold">{factor.value}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={factor.color}
                style={{ width: `${factor.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Health status */}
      <div className={`p-2 rounded text-xs ${
        ehi.score >= 80 ? "bg-green-50 text-green-700" : ehi.score >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
      }`}>
        {ehi.score >= 80 && "Equipment is in excellent condition"}
        {ehi.score < 80 && ehi.score >= 60 && "Equipment requires preventive maintenance planning"}
        {ehi.score < 60 && "Equipment requires immediate attention and maintenance"}
      </div>
    </div>
  )
}
