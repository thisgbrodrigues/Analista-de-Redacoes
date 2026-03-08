// ═══════════════════════════════════════════════
// === HISTÓRICO DE REDAÇÕES ====================
// ═══════════════════════════════════════════════

(function () {
    const { isConfigured, getSupabase } = window.RedacaoPro.Supabase;
    const { getCurrentUser } = window.RedacaoPro.Auth;
    const MAX_HISTORY_ITEMS = window.RedacaoPro.Config.MAX_HISTORY_ITEMS;

    // === Chave localStorage (fallback) ===
    function getHistoryKey() {
        const user = getCurrentUser();
        const email = user ? user.email : 'guest';
        return `redacaopro_history_${email}`;
    }

    // === Obter histórico ===
    async function getHistory() {
        if (isConfigured()) {
            const sb = getSupabase();
            const user = getCurrentUser();
            if (!user) return [];
            const { data, error } = await sb.from('essays')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(MAX_HISTORY_ITEMS);
            return error ? [] : (data || []).map(row => ({
                id: row.id, title: row.title, theme: row.theme,
                text: row.content, score: row.score, isDraft: row.is_draft,
                date: row.created_at,
            }));
        } else {
            try { return JSON.parse(localStorage.getItem(getHistoryKey())) || []; }
            catch { return []; }
        }
    }

    // === Salvar no histórico ===
    async function saveToHistory(entry) {
        if (isConfigured()) {
            const sb = getSupabase();
            const user = getCurrentUser();
            if (!user) return;
            await sb.from('essays').insert({
                user_id: user.id,
                title: entry.title || null, theme: entry.theme || null,
                content: entry.text,
                score: entry.score !== undefined ? entry.score : null,
                is_draft: entry.score === undefined,
            });
        } else {
            const history = await getHistory();
            history.unshift(entry);
            if (history.length > MAX_HISTORY_ITEMS) history.pop();
            localStorage.setItem(getHistoryKey(), JSON.stringify(history));
        }
    }

    // === Formatar data ===
    function formatDate(dateStr) {
        const d = new Date(dateStr);
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear()}`;
    }

    // === Salvar redação com helper ===
    async function saveEssayToHistory(text, score) {
        const titleInput = document.querySelector('.essay-title-input');
        const themeInput = document.querySelector('.essay-theme-input');
        const title = titleInput ? titleInput.value.trim() : '';
        const theme = themeInput ? themeInput.value.trim() : '';
        const entry = {
            id: Date.now().toString(),
            title: title || theme || text.substring(0, 60) + '...',
            theme, text,
            date: new Date().toISOString(),
        };
        if (score !== undefined) entry.score = score;
        await saveToHistory(entry);
        await renderHistory();
    }

    // === Renderizar histórico ===
    async function renderHistory() {
        const history = await getHistory();
        const historyList = document.getElementById('history-list');
        const historyEmpty = document.getElementById('history-empty');
        const statMedia = document.getElementById('stat-media');
        const statMaior = document.getElementById('stat-maior');
        const statTotal = document.getElementById('stat-total');

        if (!historyList) return;

        if (history.length === 0) {
            if (statMedia) statMedia.textContent = '--';
            if (statMaior) statMaior.textContent = '--';
            if (statTotal) statTotal.textContent = '0';
            historyList.innerHTML = '';
            if (historyEmpty) {
                historyList.appendChild(historyEmpty);
                historyEmpty.style.display = '';
            }
            return;
        }

        const scores = history.filter(h => h.score !== undefined && h.score !== null).map(h => h.score);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '--';
        const max = scores.length > 0 ? Math.max(...scores) : '--';

        if (statMedia) statMedia.textContent = avg;
        if (statMaior) statMaior.textContent = max;
        if (statTotal) statTotal.textContent = history.length;

        historyList.innerHTML = history.map(entry => {
            const title = entry.title || entry.theme || 'Redação sem título';
            const date = formatDate(entry.date);
            const hasScore = entry.score !== undefined && entry.score !== null;
            const scoreHtml = hasScore
                ? `<span class="hi-score">${entry.score}</span>`
                : `<span class="hi-score draft">Rascunho</span>`;
            return `
                <div class="history-item">
                    <div class="hi-info">
                        <i class="ph ph-file-text"></i>
                        <div>
                            <strong>${title}</strong>
                            <span class="hi-date">Salvo em ${date}</span>
                        </div>
                    </div>
                    ${scoreHtml}
                </div>
            `;
        }).join('');
    }

    // === Inicializar ===
    async function initHistory() {
        const btnSaveDraft = document.getElementById('btn-save-draft');
        if (btnSaveDraft) {
            btnSaveDraft.addEventListener('click', async () => {
                const editor = document.querySelector('.essay-editor');
                const text = editor ? editor.innerText.trim() : '';
                if (text.length < 10) {
                    alert('Escreva pelo menos algumas linhas antes de salvar.');
                    return;
                }
                await saveEssayToHistory(text);
                const originalText = btnSaveDraft.innerHTML;
                btnSaveDraft.innerHTML = '<i class="ph ph-check"></i> Salvo!';
                btnSaveDraft.style.backgroundColor = '#059669';
                btnSaveDraft.style.color = '#fff';
                btnSaveDraft.style.borderColor = '#059669';
                setTimeout(() => {
                    btnSaveDraft.innerHTML = originalText;
                    btnSaveDraft.style.backgroundColor = '';
                    btnSaveDraft.style.color = '';
                    btnSaveDraft.style.borderColor = '';
                }, 2000);
            });
        }
        await renderHistory();
    }

    window.RedacaoPro.History = { initHistory, saveEssayToHistory, renderHistory };
})();
