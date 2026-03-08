// ═══════════════════════════════════════════════
// === PONTO DE ENTRADA — INICIALIZAÇÃO =========
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Auth (restaura sessão ou mostra login)
        await window.RedacaoPro.Auth.initAuth();

        // 2. Navegação sidebar
        window.RedacaoPro.Navigation.initNavigation();

        // 3. Editor de texto rico
        window.RedacaoPro.Editor.initEditor();

        // 4. Repertório
        window.RedacaoPro.Repertoire.initRepertoire();

        // 5. Histórico
        await window.RedacaoPro.History.initHistory();

        // 6. Submissão e resultado
        window.RedacaoPro.Submission.initSubmission();

        // 7. Configurações
        window.RedacaoPro.Settings.initSettings();

        console.log('[RedaçãoPro] Todos os módulos inicializados.');
    } catch (err) {
        console.error('[RedaçãoPro] Erro na inicialização:', err);
    }
});
