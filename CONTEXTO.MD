# CONTEXT.md - Fuente de Verdad Técnica: Plataforma Educativa SaaS

## 1. Resumen Ejecutivo del Sistema

### Definición del Producto
Plataforma SaaS de gestión escolar (Intranet) optimizada para instituciones educativas en Perú (región piloto: Chincha). La arquitectura opera bajo un modelo **Multi-tenant Pooled** (Base de datos compartida, esquema compartido).

### Objetivo Crítico
Maximizar la eficiencia operativa del personal administrativo y garantizar **latencia mínima en reportes críticos** para la toma de decisiones del Director.

### Stack Tecnológico Mandatorio
*   **Frontend:** Next.js (React) - Renderizado Híbrido (SSR para datos críticos, CSR para interacciones).
*   **Base de Datos:** Supabase (PostgreSQL) - Motor de persistencia y capa de seguridad (RLS).
*   **Identidad:** Firebase Auth / Supabase Auth - Gestión de sesiones y JWTs.
*   **Orquestación:** N8N - Webhooks y procesos en background (Notificaciones, Facturación).
*   **Estilos:** Tailwind CSS - Sistema de diseño utilitario.

---

## 2. La "Regla de Oro": Arquitectura Multi-tenant

### Principio de Aislamiento Absoluto
El sistema reside en una única instancia de base de datos. El aislamiento lógico de los datos es **NO NEGOCIABLE**.

### Directrices de Implementación
1.  **Columna Mandatoria (`school_id`):** CADA tabla que contenga datos de negocio (alumnos, notas, pagos, asistencias) **DEBE** tener una columna `school_id` (UUID) con restricción `NOT NULL` y Foreign Key a la tabla `schools`.
2.  **Seguridad Zero Trust en Frontend:** El cliente (browser) es un entorno no confiable. Ningún filtro `WHERE` enviado desde el frontend garantiza seguridad.
3.  **Enforcement vía RLS:** La seguridad se aplica exclusivamente mediante **PostgreSQL Row Level Security (RLS)**. El motor de base de datos debe rechazar cualquier consulta que intente acceder a un `school_id` ajeno al del usuario autenticado, independientemente de la lógica del frontend,.

---

## 3. Esquema de Base de Datos (Core)

El esquema debe seguir estas definiciones estructurales para soportar el aislamiento RLS y RBAC.

### Tablas Principales

```sql
-- 1. Tabla de Inquilinos (Colegios)
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    config JSONB DEFAULT '{}', -- Configuración visual/módulos por colegio
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Perfiles de Usuario (Extensión de Auth)
-- Vincula la identidad (Auth) con el negocio (School + Role)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id), -- Vinculación 1:1 con tabla de auth
    school_id UUID NOT NULL REFERENCES schools(id),
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'director', 'admin', 'teacher', 'student', 'parent')),
    full_name TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Indexación Crítica para Performance de RLS
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_profiles_role ON profiles(role);
```

### Tablas de Negocio (Ejemplo con Students)
Toda tabla de negocio hereda la restricción de `school_id`.

```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id), -- MANDATORIO
    profile_id UUID REFERENCES profiles(id), -- Si el alumno tiene acceso al sistema
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    enrollment_status TEXT DEFAULT 'active'
);
-- Índice compuesto para búsquedas tenant-aware
CREATE INDEX idx_students_tenant ON students(school_id, last_name);
```

---

## 4. Reglas de Seguridad RLS (Row Level Security)

La política de seguridad debe implementarse utilizando funciones de base de datos para evitar repetición de código y optimizar el rendimiento (evitando JOINS costosos en cada fila).

### Estrategia de Implementación RLS
El `school_id` del usuario actual debe extraerse del contexto de la sesión (JWT claims o función auxiliar segura) y compararse contra el `school_id` de la fila.

### Pseudocódigo de Política (PostgreSQL)

```sql
-- Habilitar RLS forzosamente
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Función Helper para obtener el school_id del usuario actual
-- SECURITY DEFINER permite que esta función lea la tabla profiles con privilegios elevados
CREATE OR REPLACE FUNCTION get_current_user_school_id()
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT school_id FROM profiles WHERE id = auth.uid());
END;
$$;

-- Política de Aislamiento Estricto (Tenant Isolation)
CREATE POLICY "Tenant Isolation Policy" ON students
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    -- Regla: El school_id de la fila debe coincidir con el school_id del usuario
    school_id = get_current_user_school_id()
)
WITH CHECK (
    -- Regla para INSERT/UPDATE: No se puede insertar/mover datos a otro colegio
    school_id = get_current_user_school_id()
);
```

*Nota: Para el rol `super_admin`, se debe crear una política de excepción (`BYPASS RLS` o lógica `OR is_super_admin()`) para permitir mantenimiento global.*

---

## 5. Matriz de Permisos (RBAC)

El control de acceso se valida en dos capas: **UI** (ocultar opciones) y **Base de Datos** (bloquear transacciones).

| Rol | Alcance (Scope) | Permisos Críticos & Responsabilidades |
| :--- | :--- | :--- |
| **Super Admin** | **Global** (Cross-Tenant) | Acceso total a `schools` y configuración global. Mantenimiento y Debugging. Puede suplantar identidad (impersonation) para soporte. |
| **Director** | **Single-Tenant** (Su `school_id`) | **CRUD Total** sobre entidades de su colegio. Acceso prioritario a Dashboards financieros y académicos. Gestión de usuarios staff. |
| **Administrativo** | **Single-Tenant** (Su `school_id`) | Gestión operativa: Matrículas, Pagos, Trámites. **Permiso crítico:** Uso de herramientas de carga masiva (Excel/CSV) para ingestión de datos. Sin acceso a configuración sensible. |
| **Docente** | **Scoped** (Su `school_id` + `course_id`) | Acceso limitado: Solo lectura/escritura en cursos asignados. Carga de notas y asistencia. No ve datos financieros. |
| **Alumno/Padre** | **Scoped** (Su `profile_id`) | **Solo Lectura**. Visualización de libreta de notas, asistencia y estado de cuenta. |

---

## 6. Estándares de Código y Diseño

### Arquitectura Frontend (Next.js)
1.  **Patrón Container/Presenter:**
    *   **Componentes "Tontos" (Presentacionales):** Reciben datos vía props, renderizan UI con Tailwind. Sin lógica de negocio ni llamadas a Supabase.
    *   **Contenedores "Inteligentes":** Gestionan el estado, ejecutan queries a Supabase, manejan la lógica de sesión y pasan datos a los componentes tontos.
2.  **Server Components:** Priorizar el fetching de datos en el servidor (`page.tsx`) para reducir la carga en el cliente y mejorar la seguridad de los tokens.

### UI Dinámica (Layouts por Rol)
Utilizar Layouts anidados o condicionales en Next.js para adaptar la navegación,.
*   **Sidebar Contextual:** El menú lateral se renderiza basado en el `role` del usuario almacenado en el contexto de la aplicación.
*   *Regla:* Un usuario `Docente` **jamás** debe recibir en el HTML las opciones de menú de "Facturación", aunque estén deshabilitadas.

### Manejo de Errores y Resiliencia
*   **Fallar Seguro (Fail Safe):** Si la resolución del `school_id` falla o retorna null, la aplicación debe abortar inmediatamente (403 Forbidden). Nunca mostrar una interfaz vacía que sugiera un estado válido.
*   **Feedback de Usuario:** Diferenciar errores de validación (ej. "DNI incorrecto en fila 4") de errores de sistema.
*   **Logging:** Registrar incidentes de violación de políticas RLS (intentos de acceso cruzado) en una tabla de auditoría separada.