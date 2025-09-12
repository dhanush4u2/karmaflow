import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Lightbulb, TrendingDown, Zap, ExternalLink, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

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
    high: "bg-success/10 text-success border-success/20 font-medium",
    medium: "bg-warning/10 text-warning border-warning/20 font-medium", 
    low: "bg-muted/10 text-muted-foreground border-border font-medium"
  }
  
  return (
    <Badge variant="outline" className={variants[impact]}>
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
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)

  const handleLearnMore = (recId: string) => {
    console.log(`Learning more about recommendation: ${recId}`)
    // TODO: Navigate to detailed recommendation view
  }

  const handleViewAll = () => {
    setShowAllRecommendations(true)
    console.log("Viewing all recommendations")
    // TODO: Navigate to recommendations page or expand view
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-base font-semibold">AI Insights</div>
            <div className="text-sm text-muted-foreground font-normal">Powered by machine learning</div>
          </div>
        </CardTitle>
        <CardDescription>
          Smart recommendations to reduce your carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className="group p-4 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-1.5 rounded-md bg-accent">
                  <CategoryIcon category={rec.category} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground text-sm mb-1">{rec.title}</h4>
                  <ImpactBadge impact={rec.impact} />
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed pl-9">
              {rec.description}
            </p>
            
            <div className="flex items-center justify-between pl-9">
              <div className="flex flex-col">
                <div className="text-sm">
                  <span className="text-success font-semibold">{rec.potentialReduction}</span>
                  <span className="text-muted-foreground text-xs"> potential savings</span>
                </div>
                <div className="text-xs text-muted-foreground">annually</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleLearnMore(rec.id)}
              >
                Learn More
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 hover:bg-primary hover:text-primary-foreground"
          onClick={handleViewAll}
        >
          <Brain className="h-4 w-4 mr-2" />
          View All AI Recommendations
        </Button>
      </CardContent>
    </Card>
  )
}