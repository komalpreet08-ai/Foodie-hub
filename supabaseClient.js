/**
 * Foodie Hub - Supabase Client Configuration
 * Connected to Project: ufprpvbrtrclhgsrtjbd
 */
const SUPABASE_URL = 'https://ufprpvbrtrclhgsrtjbd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Ab1l5r25-TNgUf6G05teLQ_vltrf2Ma';

// Initialize Supabase Client
let supabaseClient = null;

if (typeof supabase !== 'undefined' && supabase.createClient) {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized successfully for Foodie Hub!');
  } catch (err) {
    console.warn('⚠️ Supabase initialization failed:', err);
  }
} else {
  console.warn('⚠️ Supabase JS SDK not loaded yet.');
}

// Export to window for global access
window.supabaseClient = supabaseClient;
window.SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY
};
