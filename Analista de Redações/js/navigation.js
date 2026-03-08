// ═══════════════════════════════════════════════
// === NAVEGAÇÃO DA SIDEBAR =====================
// ═══════════════════════════════════════════════

(function () {
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const viewSections = document.querySelectorAll('.view-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetViewId = item.getAttribute('data-view');
                if (!targetViewId) return;

                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                viewSections.forEach(view => {
                    view.classList.remove('active');
                    if (view.id === targetViewId) {
                        view.classList.add('active');
                    }
                });
            });
        });

        // Botão "Nova Redação" do histórico volta para home
        const btnNewCorrection = document.querySelector('.new-correction-btn');
        if (btnNewCorrection) {
            btnNewCorrection.addEventListener('click', () => {
                document.querySelector('[data-view="view-home"]').click();
            });
        }
    }

    window.RedacaoPro.Navigation = { initNavigation };
})();
