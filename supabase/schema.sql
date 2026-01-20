-- INIT: Limpieza de tablas antiguas (Clean Slate)
DROP TABLE IF EXISTS profiles CASCADE; -- Eliminar tabla antigua si existe
DROP TABLE IF EXISTS users_profile CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP FUNCTION IF EXISTS get_current_user_school_id CASCADE;

-- 1. Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'director', 'admin', 'teacher', 'student', 'parent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tablas
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Profile (Extiende auth.users)
CREATE TABLE users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id),
    role user_role NOT NULL DEFAULT 'student',
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices (Performance)
CREATE INDEX idx_users_profile_school_id ON users_profile(school_id);
CREATE INDEX idx_users_profile_role ON users_profile(role);

-- 4. Habilitar RLS (Seguridad)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

-- 5. Función Helper RLS (Zero Trust)
CREATE OR REPLACE FUNCTION get_current_user_school_id()
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT school_id FROM users_profile WHERE id = auth.uid());
END;
$$;

-- 6. Políticas de Seguridad (Policies)

-- POLÍTICAS SCHOOLS
-- Todos los usuarios autenticados pueden leer SU propio colegio.
CREATE POLICY "Schools Isolation Policy" ON schools
FOR SELECT
TO authenticated
USING (
    id = get_current_user_school_id()
);

-- POLÍTICAS USERS_PROFILE
-- 1. Usuario ve su propio perfil
CREATE POLICY "User view own profile" ON users_profile
FOR SELECT
TO authenticated
USING (
    id = auth.uid()
);

-- 2. Director/Admin ve perfiles de SU colegio
CREATE POLICY "Staff view same school profiles" ON users_profile
FOR SELECT
TO authenticated
USING (
    school_id = get_current_user_school_id()
    AND (
        EXISTS (
            SELECT 1 FROM users_profile up
            WHERE up.id = auth.uid()
            AND up.role IN ('director', 'admin')
        )
    )
);

-- 3. Docentes ven perfiles de SU colegio (Requisito Crítico)
CREATE POLICY "Teachers view same school profiles" ON users_profile
FOR SELECT
TO authenticated
USING (
    school_id = get_current_user_school_id()
    AND (
        EXISTS (
            SELECT 1 FROM users_profile up
            WHERE up.id = auth.uid()
            AND up.role = 'teacher'
        )
    )
);

-- 7. Trigger Automático (Auth -> Profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users_profile (id, school_id, role, full_name)
  VALUES (
    new.id,
    (new.raw_user_meta_data->>'school_id')::uuid,
    (new.raw_user_meta_data->>'role')::user_role,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
