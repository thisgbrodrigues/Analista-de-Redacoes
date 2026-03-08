// ═══════════════════════════════════════════════
// === SUBMISSÃO E MODAL DE RESULTADO ===========
// ═══════════════════════════════════════════════

(function () {
    const { analyzeEssay, getLevelLabel } = window.RedacaoPro.Analysis;

    function generateActionPlan(competencies) {
        const scores = [
            { key: 'C1', name: 'Norma Culta', score: competencies.C1.score },
            { key: 'C2', name: 'Tema e Repertório', score: competencies.C2.score },
            { key: 'C3', name: 'Argumentação', score: competencies.C3.score },
            { key: 'C4', name: 'Coesão Textual', score: competencies.C4.score },
            { key: 'C5', name: 'Proposta de Intervenção', score: competencies.C5.score },
        ].sort((a, b) => a.score - b.score);

        const plan = [];
        const priorities = ['🔴 Prioridade ALTA', '🟠 Prioridade MÉDIA', '🟡 Atenção'];

        for (let i = 0; i < Math.min(3, scores.length); i++) {
            if (scores[i].score < 200) {
                const comp = competencies[scores[i].key];
                const tip = comp.improvements && comp.improvements.length > 0 ? comp.improvements[0] : `Melhore a ${scores[i].name}.`;
                plan.push({ priority: priorities[i], text: `${scores[i].name} (${scores[i].score}/200) — ${tip}` });
            }
        }

        return plan.length > 0 ? plan : [{ priority: 'Parabéns', text: 'Todas as competências estão com nota máxima!' }];
    }

    function showResultModal(result) {
        const { total, badge, badgeClass, generalComment, competencies } = result;

        // Sidebar scores
        const scoreCircle = document.querySelector('.score-circle');
        scoreCircle.textContent = total;

        const cScores = document.querySelectorAll('.c-score');
        const compValues = [competencies.C1.score, competencies.C2.score, competencies.C3.score, competencies.C4.score, competencies.C5.score];
        cScores.forEach((el, i) => { if (compValues[i] !== undefined) el.textContent = compValues[i]; });

        // Modal header
        document.querySelector('.final-grade').textContent = total;
        const badgeEl = document.querySelector('.result-badge');
        badgeEl.textContent = badge;
        badgeEl.className = `result-badge ${badgeClass}`;

        // Competencies breakdown
        const compNames = ['C1: Norma Culta', 'C2: Tema e Repertório', 'C3: Argumentação', 'C4: Coesão Textual', 'C5: Proposta de Intervenção'];
        const compKeys = ['C1', 'C2', 'C3', 'C4', 'C5'];

        let compHtml = '';
        compKeys.forEach((key, i) => {
            const comp = competencies[key];
            const pct = (comp.score / 200) * 100;
            const level = getLevelLabel(comp.score);

            compHtml += `
                <div class="comp-block">
                    <div class="comp-header">
                        <strong>${compNames[i]}</strong>
                        <span class="comp-score">${comp.score}/200</span>
                    </div>
                    <div class="comp-progress-bar"><div class="comp-progress-fill" style="width: ${pct}%"></div></div>
                    <span class="comp-level">${level}</span>
                    <div class="comp-feedback">
                        ${comp.feedback.map(f => `<p>• ${f}</p>`).join('')}
                    </div>
                    ${comp.improvements.length > 0 ? `
                        <div class="comp-improvements">
                            <strong>📌 Como melhorar:</strong>
                            ${comp.improvements.map(imp => `<p>→ ${imp}</p>`).join('')}
                        </div>
                    ` : ''}
                    ${comp.checklist ? `
                        <div class="comp-checklist">
                            <strong>✅ Checklist C5:</strong>
                            ${comp.checklist.map(item => `
                                <div class="checklist-item ${item.present ? 'found' : 'missing'}">
                                    <i class="ph ${item.present ? 'ph-check-circle' : 'ph-x-circle'}"></i>
                                    ${item.name}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        document.querySelector('.competencies-breakdown').innerHTML = compHtml;

        // Action plan
        const actionPlan = generateActionPlan(competencies);
        let actionHtml = `<h3>🎯 Plano de Ação para Nota 1000</h3>`;
        actionHtml += actionPlan.map(item =>
            `<div class="action-item"><span class="action-priority">${item.priority}</span><p>${item.text}</p></div>`
        ).join('');

        // General feedback
        document.querySelector('.general-feedback').innerHTML = `
            <h3>📝 Comentário Geral</h3>
            <p>${generalComment}</p>
            ${actionHtml}
        `;

        document.getElementById('result-modal').classList.remove('hidden');
    }

    function initSubmission() {
        const btnSubmitEssay = document.getElementById('btn-submit-essay');
        const correctionModal = document.getElementById('correction-modal');
        const resultModal = document.getElementById('result-modal');
        const btnCloseModal = document.querySelector('.close-modal-btn');

        if (btnSubmitEssay) {
            btnSubmitEssay.addEventListener('click', async () => {
                const text = window.RedacaoPro.Editor.getEssayText();
                if (text.length < 50) {
                    alert('Sua redação está muito curta. Por favor, escreva um texto completo.');
                    return;
                }

                correctionModal.classList.remove('hidden');
                const progressFill = correctionModal.querySelector('.progress-fill');
                const analysisSteps = correctionModal.querySelectorAll('.analysis-steps li');
                progressFill.style.width = '0%';
                analysisSteps.forEach(s => s.classList.remove('active', 'done'));
                analysisSteps[0].classList.add('active');

                setTimeout(() => {
                    progressFill.style.width = '35%';
                    analysisSteps[0].classList.remove('active');
                    analysisSteps[0].classList.add('done');
                    analysisSteps[1].classList.add('active');
                }, 800);

                setTimeout(() => {
                    progressFill.style.width = '65%';
                    analysisSteps[1].classList.remove('active');
                    analysisSteps[1].classList.add('done');
                    analysisSteps[2].classList.add('active');
                }, 1800);

                setTimeout(() => {
                    progressFill.style.width = '100%';
                    analysisSteps[2].classList.remove('active');
                    analysisSteps[2].classList.add('done');
                }, 2800);

                setTimeout(async () => {
                    correctionModal.classList.add('hidden');
                    const result = analyzeEssay(text);
                    await window.RedacaoPro.History.saveEssayToHistory(text, result.total);
                    showResultModal(result);
                }, 3400);
            });
        }

        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', () => resultModal.classList.add('hidden'));
        }

        if (resultModal) {
            resultModal.addEventListener('click', (e) => {
                if (e.target === resultModal) resultModal.classList.add('hidden');
            });
        }
    }

    window.RedacaoPro.Submission = { initSubmission };
})();
