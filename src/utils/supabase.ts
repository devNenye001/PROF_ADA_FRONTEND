import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pcfnpamapfxovctijzts.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LqaHES1R2EzcNDqeZKljxg_YI9M9ZM4';

export const supabase = createClient(supabaseUrl, supabaseKey);
