// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// import { createClient } from '@supabase/supabase-js'

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtianR6eWxlbnNxc2h0Z2V3bm9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY2MjMzOCwiZXhwIjoyMDg1MjM4MzM4fQ.Irt7i6jfZoLIfIAKypK17Sf-IZiqQcQaMZ966LYDSQU', // ← PASTE YOUR REAL SERVICE_ROLE KEY HERE
//   {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false,
//       detectSessionInUrl: false
//     }
//   }
// );



import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,   // ← only this one in client code
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);
