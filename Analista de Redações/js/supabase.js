// ═══════════════════════════════════════════════
// === CLIENTE SUPABASE =========================
// ═══════════════════════════════════════════════

(function () {
    const cfg = window.RedacaoPro.Config;
    let client = null;

    function isConfigured() {
        return cfg.SUPABASE_ANON_KEY && cfg.SUPABASE_ANON_KEY !== 'SUA_ANON_KEY_AQUI';
    }

    function getSupabase() {
        if (!client && isConfigured() && window.supabase) {
            client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
        }
        return client;
    }

    window.RedacaoPro.Supabase = { isConfigured, getSupabase };
})();
