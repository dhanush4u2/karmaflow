import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface DashboardMetrics {
  total_ghg_emissions: number
  last_month_ghg_emissions: number
  available_credits: number
}

export interface MarketData {
  market_price_inr: number
  credit_name: string
}

export interface EmissionLog {
  emission_value_tco2e: number
  source: string
  created_at: string
}

export function useDashboardData() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [recentEmissions, setRecentEmissions] = useState<EmissionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError('User not authenticated')
          return
        }

        // Fetch dashboard metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('dashboard_metrics')
          .select('total_ghg_emissions, last_month_ghg_emissions, available_credits')
          .eq('id', user.id)
          .single()

        if (metricsError) {
          console.error('Error fetching metrics:', metricsError)
          setError('Failed to fetch dashboard metrics')
        } else {
          setMetrics(metricsData)
        }

        // Fetch market data
        const { data: marketDataRes, error: marketError } = await supabase
          .from('market_data')
          .select('market_price_inr, credit_name')
          .single()

        if (marketError) {
          console.error('Error fetching market data:', marketError)
        } else {
          setMarketData(marketDataRes)
        }

        // Fetch recent emission logs
        const { data: emissionsData, error: emissionsError } = await supabase
          .from('emission_monitoring_logs')
          .select('emission_value_tco2e, source, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (emissionsError) {
          console.error('Error fetching emissions:', emissionsError)
        } else {
          setRecentEmissions(emissionsData || [])
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return {
    metrics,
    marketData,
    recentEmissions,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      setError(null)
      // Re-run the effect
    }
  }
}