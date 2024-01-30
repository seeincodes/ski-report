import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL as string,
  process.env.NEXT_PUBLIC_SUPA_ANON as string
);
