import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { EmissionsChart } from "@/components/dashboard/EmissionsChart"
import { CreditActivityFeed } from "@/components/dashboard/CreditActivityFeed"
import { AIRecommendations } from "@/components/dashboard/AIRecommendations"
import heroImage from "@/assets/carbon-dashboard-hero.jpg"

export function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden">
        <div 
          className="h-48 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
          <div className="relative h-full flex items-center justify-between px-8">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">Carbon Management Dashboard</h1>
              <p className="text-lg opacity-90">
                Monitor emissions, trade credits, and stay compliant in real-time
              </p>
            </div>
            <div className="text-right text-white">
              <div className="text-sm opacity-75">Current Month Reduction</div>
              <div className="text-2xl font-bold">12.5%</div>
              <div className="text-sm opacity-75">vs. last month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts and Activity Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* 👇 Assign column spans to each component. The total should be 7. */}
        {/* Example: 3 + 2 + 2 = 7 */}
        <EmissionsChart className="md:col-span-4" />
        <CreditActivityFeed className="md:col-span-3" />
      </div>

      {/* AI Recommendations (Row 2, full width) */}
      {/* Moved AIRecommendations to its own div to span full width below */}
      <div className="grid gap-6"> {/* Use a simple grid for full width behavior */}
        <AIRecommendations className="md:col-span-full" /> {/* Or just w-full, or no col-span at all here */}
      </div>
    </div>
  )
}