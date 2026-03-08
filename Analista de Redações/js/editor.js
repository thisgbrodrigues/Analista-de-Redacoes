// ═══════════════════════════════════════════════
// === EDITOR DE TEXTO RICO =====================
// ═══════════════════════════════════════════════

(function () {
    let essayEditorEl = null;

    function getEssayEditor() {
        if (!essayEditorEl) essayEditorEl = document.querySelector('.essay-editor');
        return essayEditorEl;
    }

    function getEssayText() {
        const editor = getEssayEditor();
        return editor ? editor.innerText.trim() : '';
    }

    function initEditor() {
        const essayEditor = getEssayEditor();
        const toolbarBtns = document.querySelectorAll('.toolbar-btn[data-command]');
        const fontSelect = document.getElementById('toolbar-font');
        const sizeSelect = document.getElementById('toolbar-size');

        toolbarBtns.forEach(btn => {
            btn.addEventListener('mousedown', (e) => e.preventDefault());
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.getAttribute('data-command');
                if (['bold', 'italic', 'underline'].includes(command)) {
                    document.execCommand(command, false, null);
                    btn.classList.toggle('active');
                } else if (['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'].includes(command)) {
                    document.execCommand(command, false, null);
                    document.querySelectorAll('.toolbar-btn[data-command^="justify"]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
                essayEditor.focus();
            });
        });

        if (fontSelect) {
            fontSelect.addEventListener('change', () => {
                document.execCommand('fontName', false, fontSelect.value);
                essayEditor.focus();
            });
        }

        if (sizeSelect) {
            sizeSelect.addEventListener('change', () => {
                document.execCommand('fontSize', false, sizeSelect.value);
                essayEditor.focus();
            });
        }

        if (essayEditor) {
            const updateToolbarState = () => {
                toolbarBtns.forEach(btn => {
                    const cmd = btn.getAttribute('data-command');
                    if (['bold', 'italic', 'underline'].includes(cmd)) {
                        btn.classList.toggle('active', document.queryCommandState(cmd));
                    }
                });
            };
            essayEditor.addEventListener('keyup', updateToolbarState);
            essayEditor.addEventListener('mouseup', updateToolbarState);
            essayEditor.addEventListener('focus', () => {
                if (essayEditor.textContent.trim() === '') essayEditor.classList.add('editing');
            });
            essayEditor.addEventListener('blur', () => essayEditor.classList.remove('editing'));
            essayEditor.addEventListener('input', () => {
                essayEditor.classList.toggle('has-content', essayEditor.textContent.trim() !== '');
            });
        }
    }

    window.RedacaoPro.Editor = { initEditor, getEssayEditor, getEssayText };
})();
