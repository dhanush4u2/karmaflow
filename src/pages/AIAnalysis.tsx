import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Sparkles, TrendingDown, Lightbulb, Zap, Leaf, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface UserData {
  totalEmissions: number
  availableCredits: number
  monthlyHistory: Array<{
    month: string
    currentYear: number
    previousYear: number
    target: number
  }>
  recentLogs: Array<{
    source: string
    value: number
    date: string
  }>
}

interface AIInsight {
  category: 'efficiency' | 'reduction' | 'market' | 'compliance'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  recommendation: string
  potentialSavings?: string
}

const GEMINI_API_KEY = 'AIzaSyABWdkXtZ7cIaUKC4sPf2a7wS65PNt3ZeY'

export function AIAnalysis() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch dashboard metrics
      const { data: metrics } = await supabase
        .from('dashboard_metrics')
        .select('total_ghg_emissions, available_credits')
        .eq('id', user.id)
        .single()

      // Fetch monthly history
      const { data: history } = await supabase
        .from('monthly_emissions_history')
        .select('month, current_year_emissions, previous_year_emissions, target_emissions')
        .eq('user_id', user.id)
        .order('month', { ascending: false })
        .limit(6)

      // Fetch recent logs
      const { data: logs } = await supabase
        .from('emission_monitoring_logs')
        .select('source, emission_value_tco2e, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      const formattedUserData: UserData = {
        totalEmissions: metrics?.total_ghg_emissions || 0,
        availableCredits: metrics?.available_credits || 0,
        monthlyHistory: history?.map(h => ({
          month: new Date(h.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          currentYear: h.current_year_emissions || 0,
          previousYear: h.previous_year_emissions || 0,
          target: h.target_emissions || 0
        })) || [],
        recentLogs: logs?.map(l => ({
          source: l.source,
          value: l.emission_value_tco2e || 0,
          date: new Date(l.created_at).toLocaleDateString()
        })) || []
      }

      setUserData(formattedUserData)
      
      // Auto-analyze on load
      await analyzeData(formattedUserData)
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch your data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const analyzeData = async (data: UserData) => {
    if (!data) return

    try {
      setAnalyzing(true)

      const prompt = `
        Analyze the following carbon emissions data for an industrial facility and provide 4 specific, actionable AI insights:
        
        Current Data:
        - Total GHG Emissions: ${data.totalEmissions} tCO2e
        - Available Carbon Credits: ${data.availableCredits}
        - Monthly History: ${JSON.stringify(data.monthlyHistory)}
        - Recent Emission Sources: ${JSON.stringify(data.recentLogs)}
        
        Please provide exactly 4 insights in this JSON format:
        [
          {
            "category": "efficiency|reduction|market|compliance",
            "title": "Brief insight title",
            "description": "Detailed description of the insight",
            "impact": "high|medium|low",
            "recommendation": "Specific actionable recommendation",
            "potentialSavings": "Estimated savings (optional)"
          }
        ]
        
        Focus on:
        1. Energy efficiency opportunities
        2. Emission reduction strategies
        3. Carbon credit market recommendations
        4. Compliance optimization
        
        Be specific and actionable based on the actual data provided.
      `

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI analysis')
      }

      const result = await response.json()
      const generatedText = result.candidates[0].content.parts[0].text

      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsedInsights = JSON.parse(jsonMatch[0])
        setInsights(parsedInsights)
        toast({
          title: "Analysis Complete",
          description: "AI insights have been generated based on your data",
        })
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error analyzing data:', error)
      toast({
        title: "Analysis Failed",
        description: "Unable to generate AI insights. Please try again.",
        variant: "destructive"
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'efficiency': return Zap
      case 'reduction': return TrendingDown
      case 'market': return Brain
      case 'compliance': return Leaf
      default: return Lightbulb
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-success/10 text-success border-success/20'
      case 'medium': return 'bg-warning/10 text-warning border-warning/20'
      case 'low': return 'bg-muted/10 text-muted-foreground border-border'
      default: return 'bg-muted/10 text-muted-foreground border-border'
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading your data...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI-Powered Insights</h1>
          <p className="text-muted-foreground">
            Smart recommendations powered by machine learning analysis
          </p>
        </div>
        <Button 
          onClick={() => userData && analyzeData(userData)}
          disabled={analyzing}
          className="gap-2"
        >
          {analyzing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Re-analyze
            </>
          )}
        </Button>
      </div>

      {/* Data Overview */}
      {userData && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.totalEmissions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">tCO₂e</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{userData.availableCredits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">credits</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.recentLogs.length}</div>
              <p className="text-xs text-muted-foreground">active sources</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        {insights.map((insight, index) => {
          const IconComponent = getCategoryIcon(insight.category)
          return (
            <Card key={index} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{insight.title}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`${getImpactColor(insight.impact)} text-xs font-medium`}
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <Sparkles className="h-4 w-4 text-primary opacity-60" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
                
                <div className="p-3 rounded-lg bg-accent/50 border border-accent">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Recommendation</span>
                  </div>
                  <p className="text-sm text-foreground">
                    {insight.recommendation}
                  </p>
                  {insight.potentialSavings && (
                    <div className="mt-2 text-xs text-success font-medium">
                      💡 {insight.potentialSavings}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {insights.length === 0 && !analyzing && (
        <Card className="text-center py-8">
          <CardContent>
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No insights available</h3>
            <p className="text-muted-foreground mb-4">
              Click "Re-analyze" to generate AI-powered insights based on your current data
            </p>
            <Button 
              onClick={() => userData && analyzeData(userData)}
              disabled={!userData}
            >
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}