-- Create a function to complete the onboarding process
create or replace function public.complete_user_onboarding(
  p_user_id uuid,
  p_onboarding_data jsonb
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_profile jsonb;
  v_stripe_customer_id text;
  v_subscription_id uuid;
  v_caliber jsonb;
  v_caliber_id text;
  v_allocation numeric;
  v_total_allocation numeric := 0;
  v_remaining_allocation numeric := 100; -- Start with 100%
  v_error_message text;
  v_error_detail text;
  v_error_hint text;
  v_error_context text;
begin
  -- Begin transaction
  begin
    -- 1. Update user profile with onboarding data
    update public.profiles
    set 
      first_name = p_onboarding_data->>'fullName',
      onboarding_data = p_onboarding_data,
      onboarding_completed = true,
      updated_at = now()
    where id = p_user_id
    returning to_jsonb(profiles.*) into v_profile;
    
    if v_profile is null then
      raise exception 'User profile not found';
    end if;
    
    -- 2. Create stockpile entries for selected calibers
    -- First pass: Calculate total allocation for validation
    for v_caliber in select * from jsonb_array_elements(p_onboarding_data->'calibers')
    loop
      if (v_caliber->>'selected')::boolean then
        v_allocation := (v_caliber->>'allocation')::numeric;
        v_total_allocation := v_total_allocation + coalesce(v_allocation, 0);
      end if;
    end loop;
    
    -- Validate total allocation is 100%
    if v_total_allocation != 100 then
      raise exception 'Total allocation must be 100%%, got %%%', v_total_allocation;
    end if;
    
    -- Second pass: Create stockpile entries
    for v_caliber in select * from jsonb_array_elements(p_onboarding_data->'calibers')
    loop
      if (v_caliber->>'selected')::boolean then
        v_caliber_id := v_caliber->>'id';
        v_allocation := (v_caliber->>'allocation')::numeric;
        
        -- Insert stockpile entry
        insert into public.user_stockpile (
          user_id,
          caliber_id,
          caliber_name,
          current_rounds,
          target_rounds,
          monthly_allocation,
          created_at,
          updated_at
        ) values (
          p_user_id,
          v_caliber_id,
          v_caliber->>'name',
          0, -- Start with 0 rounds
          1000, -- Default target
          v_allocation,
          now(),
          now()
        );
      end if;
    end loop;
    
    -- 3. Save shipping preferences
    insert into public.shipping_preferences (
      user_id,
      trigger_type,
      trigger_value,
      trigger_unit,
      created_at,
      updated_at
    ) values (
      p_user_id,
      p_onboarding_data->'shippingTrigger'->>'type',
      (p_onboarding_data->'shippingTrigger'->'value')::numeric,
      p_onboarding_data->'shippingTrigger'->>'unit',
      now(),
      now()
    );
    
    -- 4. Create subscription (placeholder - integrate with Stripe)
    -- In a real implementation, this would create a Stripe subscription
    -- and store the subscription ID in the database
    
    -- 5. Log the completion
    insert into public.onboarding_completions (
      user_id,
      completed_at,
      metadata
    ) values (
      p_user_id,
      now(),
      jsonb_build_object(
        'calibers', p_onboarding_data->'calibers',
        'monthly_budget', p_onboarding_data->'monthlyBudget',
        'frequency', p_onboarding_data->'frequency'
      )
    );
    
    -- Commit the transaction
    return jsonb_build_object(
      'success', true,
      'message', 'Onboarding completed successfully',
      'user_id', p_user_id,
      'profile', v_profile
    );
    
  exception when others then
    -- Rollback on error
    get stacked diagnostics 
      v_error_message = message_text,
      v_error_detail = pg_exception_detail,
      v_error_hint = pg_exception_hint,
      v_error_context = pg_exception_context;
      
    return jsonb_build_object(
      'success', false,
      'error', v_error_message,
      'detail', v_error_detail,
      'hint', v_error_hint,
      'context', v_error_context
    );
  end;
end;
$$;

-- Grant execute permissions to authenticated users
grant execute on function public.complete_user_onboarding(uuid, jsonb) to authenticated;
