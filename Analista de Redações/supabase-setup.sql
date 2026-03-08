-- ═══════════════════════════════════════════════
-- RedaçãoPro — Setup do Banco de Dados Supabase
-- Execute este script no SQL Editor do Supabase
-- Dashboard → SQL Editor → New Query → Cole e Execute
-- ═══════════════════════════════════════════════

-- 1. Tabela de perfis (estende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de redações/histórico
CREATE TABLE IF NOT EXISTS essays (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    theme TEXT,
    content TEXT,
    score INTEGER,
    is_draft BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_created_at ON essays(created_at DESC);

-- 4. Row Level Security (RLS) — OBRIGATÓRIO para segurança
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;

-- Políticas de profiles: cada usuário só acessa seu próprio perfil
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
    ON profiles FOR DELETE
    USING (auth.uid() = id);

-- Políticas de essays: cada usuário só acessa suas próprias redações
CREATE POLICY "Users can view own essays"
    ON essays FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own essays"
    ON essays FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own essays"
    ON essays FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own essays"
    ON essays FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Trigger para auto-atualizar updated_at em profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- 6. Função para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: quando um novo usuário se registra, cria perfil automático
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
