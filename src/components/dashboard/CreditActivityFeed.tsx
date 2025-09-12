import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { cn } from "@/lib/utils" // Import a class name utility

interface Activity {
  id: string
  type: "buy" | "sell" | "earn"
  amount: number
  price: number
  timestamp: string
  status: "completed" | "pending" | "failed"
  counterparty?: string
}

const activities: Activity[] = [
  {
    id: "1",
    type: "sell",
    amount: 50,
    price: 2340,
    timestamp: "2 hours ago",
    status: "completed",
    counterparty: "Green Energy Corp"
  },
  {
    id: "2",
    type: "earn",
    amount: 23,
    price: 0,
    timestamp: "1 day ago",
    status: "completed"
  },
  {
    id: "3",
    type: "buy",
    amount: 100,
    price: 2280,
    timestamp: "3 days ago",
    status: "completed",
    counterparty: "EcoTech Industries"
  },
  {
    id: "4",
    type: "sell",
    amount: 75,
    price: 2395,
    timestamp: "5 days ago",
    status: "pending",
    counterparty: "Renewable Solutions Ltd"
  }
]

function ActivityIcon({ type }: { type: Activity["type"] }) {
  if (type === "buy") return <TrendingUp className="h-4 w-4 text-warning" />
  if (type === "sell") return <TrendingDown className="h-4 w-4 text-success" />
  return <ArrowUpDown className="h-4 w-4 text-primary" />
}

function StatusBadge({ status }: { status: Activity["status"] }) {
  const variants = {
    completed: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20"
  }
  
  return (
    <Badge variant="outline" className={cn("font-medium", variants[status])}>
      {status}
    </Badge>
  )
}

// 👇 1. Define an interface for the component's props
interface CreditActivityFeedProps {
  className?: string;
}

// 👇 2. Update the function to accept the props
export function CreditActivityFeed({ className }: CreditActivityFeedProps) {
  return (
    // 👇 3. Apply the passed className and remove the hardcoded `col-span-3`
    <Card className={cn("shadow-none", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest carbon credit transactions and earnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-accent">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground capitalize">
                      {activity.type === "earn" ? "Earned" : activity.type}
                    </span>
                    <span className="text-foreground">
                      {activity.amount} credits
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {activity.counterparty && (
                      <>
                        <span>{activity.counterparty}</span>
                        <span className="text-xs">•</span>
                      </>
                    )}
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {activity.price > 0 && (
                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      ₹{activity.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      per credit
                    </div>
                  </div>
                )}
                <StatusBadge status={activity.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}