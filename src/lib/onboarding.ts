import { supabase } from './supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface OnboardingData {
  // User Information
  fullName: string;
  email: string;
  
  // Caliber Preferences
  calibers: Array<{
    id: string;
    name: string;
    selected: boolean;
    allocation?: number;
  }>;
  
  // Purpose Selection
  purposes: Array<{
    id: string;
    label: string;
    selected: boolean;
  }>;
  
  // AutoStack Configuration
  monthlyBudget: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  
  // Shipping Preferences
  shippingTrigger: {
    type: 'round_count' | 'value_threshold' | 'time_interval' | 'manual';
    value?: number;
    unit?: string;
  };
}

/**
 * Save onboarding data to the user's profile
 */
export const saveOnboardingData = async (userId: string, data: Partial<OnboardingData>) => {
  try {
    const updates = {
      id: userId,
      updated_at: new Date().toISOString(),
      onboarding_completed: false, // Will be set to true on final submission
      onboarding_data: data,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updates, { onConflict: 'id' });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return { success: false, error };
  }
};

/**
 * Complete the onboarding process and create initial stockpile
 */
export const completeOnboarding = async (userId: string, data: OnboardingData) => {
  try {
    // Start a transaction to ensure data consistency
    const { data: result, error } = await supabase.rpc('complete_onboarding', {
      user_id: userId,
      onboarding_data: data,
    });

    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return { success: false, error };
  }
};

/**
 * Get the user's onboarding status
 */
export const getOnboardingStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarding_data')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { 
      completed: data?.onboarding_completed || false,
      data: data?.onboarding_data || null 
    };
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    return { completed: false, data: null, error };
  }
};

/**
 * Create a new stockpile for the user
 */
const createUserStockpile = async (userId: string, data: OnboardingData) => {
  // Create stockpile entries based on selected calibers
  const stockpileEntries = data.calibers
    .filter(caliber => caliber.selected)
    .map(caliber => ({
      user_id: userId,
      caliber_id: caliber.id,
      caliber_name: caliber.name,
      quantity: 0, // Start with 0, will be updated with first shipment
      target_quantity: 1000, // Default target, can be adjusted
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

  const { error } = await supabase
    .from('user_stockpile')
    .insert(stockpileEntries);

  if (error) throw error;
  return { success: true };
};

/**
 * Create a database function to handle the complete onboarding process
 * This should be run as a database function for atomicity
 */
const createOnboardingDatabaseFunction = `
create or replace function public.complete_onboarding(
  user_id uuid,
  onboarding_data jsonb
) returns jsonb
language plpgsql
security definer
as $$
declare
  profile_data jsonb;
  stripe_customer_id text;
  subscription_id uuid;
begin
  -- Update user profile with onboarding data
  update public.profiles
  set 
    first_name = onboarding_data->>'fullName',
    onboarding_data = onboarding_data,
    onboarding_completed = true,
    updated_at = now()
  where id = user_id
  returning to_jsonb(profiles.*) into profile_data;
  
  -- Create Stripe customer (pseudo-code, implement your Stripe integration)
  -- stripe_customer_id := stripe_create_customer(
  --   email := profile_data->>'email',
  --   name := profile_data->>'fullName',
  --   metadata := jsonb_build_object('user_id', user_id)
  -- );
  
  -- Update profile with Stripe customer ID
  -- update public.profiles
  -- set stripe_customer_id = stripe_customer_id
  -- where id = user_id;
  
  -- Create initial stockpile entries
  insert into public.user_stockpile (
    user_id,
    caliber_id,
    caliber_name,
    quantity,
    target_quantity,
    created_at,
    updated_at
  )
  select 
    user_id,
    jsonb_array_elements(onboarding_data->'calibers')::jsonb->>'id' as caliber_id,
    jsonb_array_elements(onboarding_data->'calibers')::jsonb->>'name' as caliber_name,
    0 as quantity,
    1000 as target_quantity, -- Default target
    now() as created_at,
    now() as updated_at
  where (jsonb_array_elements(onboarding_data->'calibers')::jsonb->>'selected')::boolean = true;
  
  -- Create shipping preferences
  insert into public.shipping_preferences (
    user_id,
    trigger_type,
    trigger_value,
    trigger_unit,
    created_at,
    updated_at
  ) values (
    user_id,
    (onboarding_data->'shippingTrigger'->>'type')::text,
    (onboarding_data->'shippingTrigger'->>'value')::numeric,
    (onboarding_data->'shippingTrigger'->>'unit')::text,
    now(),
    now()
  );
  
  -- Return success with profile data
  return jsonb_build_object(
    'success', true,
    'profile', profile_data,
    'stripe_customer_id', stripe_customer_id
  );
exception when others then
  return jsonb_build_object(
    'success', false,
    'error', sqlerrm,
    'error_context', pg_exception_context()
  );
end;
$$;
`;

// Helper function to install the database function
export const installOnboardingFunction = async () => {
  try {
    const { data, error } = await supabase.rpc('pg_temp.execute_sql', {
      sql: createOnboardingDatabaseFunction,
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error installing onboarding function:', error);
    return { success: false, error };
  }
};
