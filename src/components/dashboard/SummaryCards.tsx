import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Leaf, DollarSign, CheckCircle, AlertCircle } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  description: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon: React.ComponentType<{ className?: string }>
  status?: "success" | "warning" | "neutral"
}

function MetricCard({ title, value, description, trend, trendValue, icon: Icon, status = "neutral" }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-warning" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-success" />
    return null
  }

  const getStatusColor = () => {
    if (status === "success") return "text-success"
    if (status === "warning") return "text-warning"
    return "text-foreground"
  }

  return (
    <Card className="transition-smooth hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${getStatusColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {getTrendIcon()}
          {trendValue && <span>{trendValue}</span>}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total GHG Emissions"
        value="1,247 tCO₂e"
        description="from last month"
        trend="down"
        trendValue="-12%"
        icon={Leaf}
        status="success"
      />
      
      <MetricCard
        title="Available Credits"
        value="543"
        description="carbon credits"
        trend="up"
        trendValue="+23"
        icon={DollarSign}
        status="success"
      />
      
      <MetricCard
        title="Market Price"
        value="₹2,340"
        description="per credit"
        trend="up"
        trendValue="+5.2%"
        icon={TrendingUp}
        status="neutral"
      />
      
      <MetricCard
        title="Compliance Status"
        value="Compliant"
        description="all requirements met"
        icon={CheckCircle}
        status="success"
      />
    </div>
  )
}