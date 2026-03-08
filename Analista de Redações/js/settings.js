// ═══════════════════════════════════════════════
// === CONFIGURAÇÕES DO USUÁRIO =================
// ═══════════════════════════════════════════════

(function () {
    const { updateProfile, deleteAccount, updateProfileUI, showAuth } = window.RedacaoPro.Auth;

    function initSettings() {
        const settingsForm = document.getElementById('settings-form');
        const settingsMsg = document.getElementById('settings-msg');
        const btnDeleteAccount = document.getElementById('btn-delete-account');

        if (settingsForm) {
            settingsForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                settingsMsg.classList.add('hidden');

                try {
                    const name = document.getElementById('settings-name').value.trim();
                    const age = parseInt(document.getElementById('settings-age').value);
                    const email = document.getElementById('settings-email').value.trim();
                    const source = document.getElementById('settings-source').value;
                    const newPassword = document.getElementById('settings-password').value;
                    const confirmPassword = document.getElementById('settings-password-confirm').value;

                    if (!name || !email) throw new Error('Nome e e-mail são obrigatórios.');
                    if (newPassword && newPassword.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');
                    if (newPassword && newPassword !== confirmPassword) throw new Error('As senhas não conferem.');

                    await updateProfile({
                        name, age, email, source,
                        newPassword: newPassword || null
                    });

                    settingsMsg.textContent = 'Dados atualizados com sucesso!';
                    settingsMsg.className = 'settings-msg success';

                    document.getElementById('settings-password').value = '';
                    document.getElementById('settings-password-confirm').value = '';
                } catch (err) {
                    settingsMsg.textContent = err.message;
                    settingsMsg.className = 'settings-msg error';
                }
            });
        }

        if (btnDeleteAccount) {
            btnDeleteAccount.addEventListener('click', async () => {
                if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
                    if (confirm('ÚLTIMA CHANCE: Todos os seus dados serão perdidos. Confirmar exclusão?')) {
                        await deleteAccount();
                        showAuth();
                    }
                }
            });
        }
    }

    window.RedacaoPro.Settings = { initSettings };
})();
