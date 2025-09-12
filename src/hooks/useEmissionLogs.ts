import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

export type EmissionLog = Tables<'emission_monitoring_logs'>;

// --- WORKAROUND FOR DEMO ---
// This is the fixed user_id that your IoT device is broadcasting.
// All queries will now use this ID to fetch and listen for data.
const IOT_DEVICE_USER_ID = 'b1671c5b-7463-4b07-9479-9d4163df1cb5';

/**
 * A dedicated hook to fetch and subscribe to real-time emission monitoring logs.
 */
export const useEmissionLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<EmissionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialLogs = useCallback(async () => {
    // We still check if a user is logged in to prevent unnecessary fetches.
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching logs for fixed IoT device ID: ${IOT_DEVICE_USER_ID}`);

      // CRITICAL FIX: The query now uses the hardcoded IOT_DEVICE_USER_ID.
      const { data, error: fetchError } = await supabase
        .from('emission_monitoring_logs')
        .select('*')
        .eq('user_id', IOT_DEVICE_USER_ID) // Using the fixed ID here
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      
      console.log(`Found ${data?.length || 0} logs for this device.`);
      
      setLogs((data || []).reverse());
    } catch (err: any) {
      console.error("Error fetching initial emission logs:", err);
      setError("Could not load initial emission data.");
    } finally {
      setLoading(false);
    }
  }, [user]); // Keep 'user' dependency to trigger fetch on login.

  useEffect(() => {
    fetchInitialLogs();

    if (!user) return;

    // CRITICAL FIX: The subscription channel and filter now use the hardcoded ID.
    const channel = supabase
      .channel(`emission_logs:${IOT_DEVICE_USER_ID}`) // Unique channel for the device
      .on<EmissionLog>(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'emission_monitoring_logs', 
          filter: `user_id=eq.${IOT_DEVICE_USER_ID}` // Listen for inserts for this specific device
        },
        (payload) => {
          console.log('New emission log received:', payload.new);
          setLogs(currentLogs => [...currentLogs, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchInitialLogs]);

  return { logs, loading, error };
};
