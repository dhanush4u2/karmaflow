import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Lightbulb, TrendingDown, Zap, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Recommendation {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  potentialReduction: string
  category: "energy" | "process" | "transport" | "waste"
  priority: number
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Optimize Boiler Efficiency",
    description: "Your boiler systems are operating at 78% efficiency. Implementing advanced controls could reduce fuel consumption.",
    impact: "high",
    potentialReduction: "180 tCO₂e/year",
    category: "energy",
    priority: 1
  },
  {
    id: "2", 
    title: "LED Lighting Upgrade",
    description: "Replace remaining fluorescent lighting with LED systems for 40% energy reduction in lighting loads.",
    impact: "medium",
    potentialReduction: "95 tCO₂e/year",
    category: "energy",
    priority: 2
  },
  {
    id: "3",
    title: "Waste Heat Recovery",
    description: "Install heat recovery systems on your exhaust streams to preheat incoming air and reduce heating demand.",
    impact: "high",
    potentialReduction: "220 tCO₂e/year",
    category: "process",
    priority: 1
  }
]

function ImpactBadge({ impact }: { impact: Recommendation["impact"] }) {
  const variants = {
    high: "bg-success text-success-foreground",
    medium: "bg-warning text-warning-foreground", 
    low: "bg-muted text-muted-foreground"
  }
  
  return (
    <Badge className={variants[impact]}>
      {impact} impact
    </Badge>
  )
}

function CategoryIcon({ category }: { category: Recommendation["category"] }) {
  const icons = {
    energy: Zap,
    process: Brain,
    transport: TrendingDown,
    waste: Lightbulb
  }
  
  const Icon = icons[category]
  return <Icon className="h-4 w-4" />
}

export function AIRecommendations() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <CardDescription>
          Smart recommendations to reduce emissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-4 rounded-lg border border-border hover:bg-accent/30 transition-smooth">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <CategoryIcon category={rec.category} />
                <h4 className="font-medium text-foreground text-sm">{rec.title}</h4>
              </div>
              <ImpactBadge impact={rec.impact} />
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {rec.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-success font-medium">{rec.potentialReduction}</span>
                <span className="text-muted-foreground"> saved</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Learn More
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full mt-4">
          View All Recommendations
        </Button>
      </CardContent>
    </Card>
  )
}