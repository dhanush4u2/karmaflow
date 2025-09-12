import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Leaf, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { Skeleton } from "@/components/ui/skeleton"

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
  const { metrics, marketData, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate trends (placeholder logic - in real app you'd compare with previous periods)
  const emissionsTrend = metrics?.last_month_ghg_emissions && metrics?.total_ghg_emissions
    ? ((metrics.total_ghg_emissions - metrics.last_month_ghg_emissions) / metrics.last_month_ghg_emissions * 100)
    : 0

  const emissionsTrendFormatted = emissionsTrend > 0 ? `+${emissionsTrend.toFixed(1)}%` : `${emissionsTrend.toFixed(1)}%`

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total GHG Emissions"
        value={`${metrics?.total_ghg_emissions?.toLocaleString() || 0} tCO₂e`}
        description="from last month"
        trend={emissionsTrend > 0 ? "up" : "down"}
        trendValue={emissionsTrendFormatted}
        icon={Leaf}
        status={emissionsTrend <= 0 ? "success" : "warning"}
      />
      
      <MetricCard
        title="Available Credits"
        value={`${metrics?.available_credits?.toLocaleString() || 0}`}
        description="carbon credits"
        trend="neutral"
        icon={DollarSign}
        status="success"
      />
      
      <MetricCard
        title="Market Price"
        value={`₹${marketData?.market_price_inr?.toLocaleString() || '2,850'}`}
        description="per credit"
        trend="neutral"
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