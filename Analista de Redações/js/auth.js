// ═══════════════════════════════════════════════
// === SISTEMA DE AUTENTICAÇÃO ==================
// ═══════════════════════════════════════════════

(function () {
    const { isConfigured, getSupabase } = window.RedacaoPro.Supabase;

    // === Fallback localStorage ===
    const AUTH_USERS_KEY = 'redacaopro_users';
    const AUTH_SESSION_KEY = 'redacaopro_session';

    function localGetUsers() {
        try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || {}; } catch { return {}; }
    }
    function localSaveUsers(u) { localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(u)); }
    function localHash(pw) { return btoa(encodeURIComponent(pw)); }
    function localGetSession() {
        try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)); } catch { return null; }
    }
    function localSetSession(email) {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ email, loginAt: new Date().toISOString() }));
    }
    function localClearSession() { localStorage.removeItem(AUTH_SESSION_KEY); }

    // === Estado ===
    let currentUser = null;

    function getCurrentUser() { return currentUser; }

    function getAvatarUrl(name, size) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=E5E7EB&color=374151&size=${size || 64}`;
    }

    // === UI do perfil ===
    function updateProfileUI() {
        if (!currentUser) return;
        const u = currentUser;
        const set = (id, prop, val) => { const el = document.getElementById(id); if (el) el[prop] = val; };
        set('sidebar-user-name', 'textContent', u.name);
        set('sidebar-user-email', 'textContent', u.email);
        set('user-avatar', 'src', getAvatarUrl(u.name));
        set('settings-avatar', 'src', getAvatarUrl(u.name, 96));
        set('settings-display-name', 'textContent', u.name);
        set('settings-display-email', 'textContent', u.email);
        set('settings-name', 'value', u.name);
        set('settings-age', 'value', u.age || '');
        set('settings-email', 'value', u.email);
        const srcEl = document.getElementById('settings-source');
        if (srcEl) srcEl.value = u.source || 'outro';
    }

    function showApp() {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        updateProfileUI();
    }

    function showAuth() {
        document.getElementById('app-container').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-error').classList.add('hidden');
        document.getElementById('register-error').classList.add('hidden');
    }

    // === REGISTER ===
    async function handleRegister(name, age, email, password, source) {
        email = email.toLowerCase();
        if (isConfigured()) {
            const sb = getSupabase();
            const { data, error } = await sb.auth.signUp({ email, password });
            if (error) throw new Error(error.message);
            const userId = data.user.id;
            await sb.from('profiles').upsert({ id: userId, name, age: age || null, source });
            currentUser = { id: userId, name, email, age, source };
        } else {
            const users = localGetUsers();
            if (users[email]) throw new Error('Já existe uma conta com este e-mail.');
            users[email] = {
                name, email, age: age || null, source,
                password: localHash(password),
                createdAt: new Date().toISOString(),
            };
            localSaveUsers(users);
            localSetSession(email);
            currentUser = users[email];
        }
    }

    // === LOGIN ===
    async function handleLogin(email, password) {
        email = email.toLowerCase();
        if (isConfigured()) {
            const sb = getSupabase();
            const { data, error } = await sb.auth.signInWithPassword({ email, password });
            if (error) throw new Error(error.message);
            const { data: profile } = await sb.from('profiles').select('*').eq('id', data.user.id).single();
            currentUser = {
                id: data.user.id,
                name: profile?.name || email.split('@')[0],
                email, age: profile?.age, source: profile?.source
            };
        } else {
            const users = localGetUsers();
            const user = users[email];
            if (!user) throw new Error('Nenhuma conta encontrada com este e-mail.');
            if (user.password !== localHash(password)) throw new Error('Senha incorreta.');
            localSetSession(email);
            currentUser = user;
        }
    }

    // === LOGOUT ===
    async function handleLogout() {
        if (isConfigured()) {
            await getSupabase().auth.signOut();
        } else {
            localClearSession();
        }
        currentUser = null;
    }

    // === RESTAURAR SESSÃO ===
    async function restoreSession() {
        if (isConfigured()) {
            const sb = getSupabase();
            const { data: { session } } = await sb.auth.getSession();
            if (!session) return false;
            const { data: profile } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
            currentUser = {
                id: session.user.id,
                name: profile?.name || session.user.email.split('@')[0],
                email: session.user.email,
                age: profile?.age, source: profile?.source,
            };
            return true;
        } else {
            const session = localGetSession();
            if (!session) return false;
            const users = localGetUsers();
            if (!users[session.email]) { localClearSession(); return false; }
            currentUser = users[session.email];
            return true;
        }
    }

    // === ATUALIZAR PERFIL ===
    async function updateProfile({ name, age, email, source, newPassword }) {
        if (isConfigured()) {
            const sb = getSupabase();
            await sb.from('profiles').update({ name, age: age || null, source }).eq('id', currentUser.id);
            if (email && email !== currentUser.email) await sb.auth.updateUser({ email });
            if (newPassword) await sb.auth.updateUser({ password: newPassword });
            currentUser = { ...currentUser, name, age, email: email || currentUser.email, source };
        } else {
            const users = localGetUsers();
            const oldEmail = currentUser.email;
            const user = users[oldEmail];
            user.name = name;
            user.age = age || user.age;
            user.source = source;
            if (newPassword) user.password = localHash(newPassword);
            if (email && email !== oldEmail) {
                user.email = email;
                delete users[oldEmail];
                users[email] = user;
                localSetSession(email);
                const oldKey = `redacaopro_history_${oldEmail}`;
                const newKey = `redacaopro_history_${email}`;
                const h = localStorage.getItem(oldKey);
                if (h) { localStorage.setItem(newKey, h); localStorage.removeItem(oldKey); }
            } else {
                users[oldEmail] = user;
            }
            localSaveUsers(users);
            currentUser = user;
        }
        updateProfileUI();
    }

    // === EXCLUIR CONTA ===
    async function deleteAccount() {
        if (isConfigured()) {
            const sb = getSupabase();
            await sb.from('essays').delete().eq('user_id', currentUser.id);
            await sb.from('profiles').delete().eq('id', currentUser.id);
            await sb.auth.signOut();
        } else {
            const email = currentUser.email;
            const users = localGetUsers();
            delete users[email];
            localSaveUsers(users);
            localStorage.removeItem(`redacaopro_history_${email}`);
            localClearSession();
        }
        currentUser = null;
    }

    // === INICIALIZAÇÃO ===
    async function initAuth() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginError = document.getElementById('login-error');
        const registerError = document.getElementById('register-error');

        // Toggle Login ↔ Cadastro
        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            loginError.classList.add('hidden');
        });

        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            registerError.classList.add('hidden');
        });

        // Submit: Cadastro
        registerForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerError.classList.add('hidden');
            try {
                const name = document.getElementById('reg-name').value.trim();
                const age = parseInt(document.getElementById('reg-age').value);
                const email = document.getElementById('reg-email').value.trim();
                const password = document.getElementById('reg-password').value;
                const source = document.getElementById('reg-source').value;
                if (!name || !email || !password || !source) throw new Error('Preencha todos os campos.');
                if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');
                await handleRegister(name, age, email, password, source);
                showApp();
            } catch (err) {
                registerError.textContent = err.message;
                registerError.classList.remove('hidden');
            }
        });

        // Submit: Login
        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginError.classList.add('hidden');
            try {
                const email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value;
                await handleLogin(email, password);
                showApp();
            } catch (err) {
                loginError.textContent = err.message;
                loginError.classList.remove('hidden');
            }
        });

        // Logout
        document.getElementById('btn-logout')?.addEventListener('click', async () => {
            if (confirm('Deseja realmente sair?')) {
                await handleLogout();
                showAuth();
            }
        });

        // Restaurar sessão
        const hasSession = await restoreSession();
        if (hasSession) {
            showApp();
        } else {
            showAuth();
        }
    }

    window.RedacaoPro.Auth = {
        initAuth, getCurrentUser, updateProfile, deleteAccount, updateProfileUI, showAuth
    };
})();
