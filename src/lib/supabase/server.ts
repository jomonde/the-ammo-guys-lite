import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/supabase/database.types';

export const createClient = () => {
  return createServerComponentClient<Database>({
    cookies,
  });
};

export const getSession = async () => {
  const supabase = createClient();
  return await supabase.auth.getSession();
};

export const getUser = async () => {
  const supabase = createClient();
  return await supabase.auth.getUser();
};
