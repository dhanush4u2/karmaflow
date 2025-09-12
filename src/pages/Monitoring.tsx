import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Wifi, WifiOff, Plus, Filter } from "lucide-react"

interface DataSource {
  id: string
  name: string
  type: string
  status: "active" | "inactive" | "warning"
  lastReading: string
  location: string
  gasType: string[]
}

const dataSources: DataSource[] = [
  {
    id: "1",
    name: "Boiler Stack Monitor",
    type: "IoT Sensor",
    status: "active",
    lastReading: "2 minutes ago",
    location: "Production Floor A",
    gasType: ["CO₂", "NOx", "SO₂"]
  },
  {
    id: "2",
    name: "Fuel Consumption Meter",
    type: "Smart Meter",
    status: "active", 
    lastReading: "1 minute ago",
    location: "Fuel Storage",
    gasType: ["CO₂"]
  },
  {
    id: "3",
    name: "Waste Incinerator",
    type: "IoT Sensor",
    status: "warning",
    lastReading: "15 minutes ago",
    location: "Waste Management",
    gasType: ["CO₂", "CH₄"]
  },
  {
    id: "4",
    name: "Vehicle Fleet Tracker",
    type: "GPS + OBD",
    status: "inactive",
    lastReading: "2 hours ago",
    location: "Vehicle Fleet",
    gasType: ["CO₂", "NOx"]
  }
]

function StatusIcon({ status }: { status: DataSource["status"] }) {
  if (status === "active") return <Wifi className="h-4 w-4 text-success" />
  if (status === "warning") return <Wifi className="h-4 w-4 text-warning" />
  return <WifiOff className="h-4 w-4 text-destructive" />
}

function StatusBadge({ status }: { status: DataSource["status"] }) {
  const variants = {
    active: "bg-success-light text-success border-success",
    warning: "bg-warning-light text-warning border-warning", 
    inactive: "bg-destructive/10 text-destructive border-destructive"
  }
  
  return (
    <Badge variant="outline" className={variants[status]}>
      {status}
    </Badge>
  )
}

export function Monitoring() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emissions Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time tracking of emissions from all connected sources
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
      </div>

      {/* Data Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Connected Data Sources
          </CardTitle>
          <CardDescription>
            Monitor all IoT sensors and data collection points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                <div className="flex items-center space-x-4">
                  <StatusIcon status={source.status} />
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{source.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{source.type}</span>
                      <span>•</span>
                      <span>{source.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Last Reading</div>
                    <div className="font-medium text-foreground">{source.lastReading}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {source.gasType.map((gas) => (
                      <Badge key={gas} variant="secondary" className="text-xs">
                        {gas}
                      </Badge>
                    ))}
                  </div>
                  
                  <StatusBadge status={source.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">3 of 4</div>
            <p className="text-xs text-muted-foreground mt-1">Data sources online</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2.3 tCO₂e</div>
            <p className="text-xs text-muted-foreground mt-1">Today's total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Data Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">98.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Accuracy rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}