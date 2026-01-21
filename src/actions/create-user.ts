'use server'

import { createClient } from '@supabase/supabase-js'

type CreateUserParams = {
    email: string
    password?: string
    first_name: string
    last_name: string
    dni: string
    role: 'student' | 'teacher' | 'admin' | 'director'
    school_id: string
}

export async function createUser(params: CreateUserParams) {
    // 1. Validación de Entorno
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('CRÍTICO: No se encontró la SUPABASE_SERVICE_ROLE_KEY')
        return { success: false, error: 'CRÍTICO: No se encontró la SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.' }
    }

    try {
        // Inicializar cliente dentro del try para capturar posibles errores de configuración
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        )

        const password = params.password || generateTemporaryPassword()

        // 2. Crear usuario en Supabase Auth
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: params.email,
            password: password,
            email_confirm: true,
            user_metadata: {
                full_name: `${params.first_name} ${params.last_name}`,
                dni: params.dni,
                role: params.role,
                school_id: params.school_id,
                first_name: params.first_name,
                last_name: params.last_name
            }
        })

        if (error) {
            console.error('Supabase Create User Error:', error)
            return { success: false, error: error.message }
        }

        if (!data.user) {
            return { success: false, error: 'No se pudo crear el usuario (sin datos retornados)' }
        }

        return {
            success: true,
            data: {
                user: data.user,
                password: password
            }
        }

    } catch (error: any) {
        // 3. Retorno Controlado (No throw)
        console.error('Server Action Error (Catch Block):', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error inesperado al crear usuario'
        }
    }
}

function generateTemporaryPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''

    // Usar crypto para mejor seguridad si está disponible
    try {
        const array = new Uint32Array(12)
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(array)
            for (let i = 0; i < 12; i++) {
                password += chars[array[i] % chars.length]
            }
        } else {
            // Fallback para entornos donde crypto no esté completo (aunque en Node 20 debería estarlo)
            for (let i = 0; i < 12; i++) {
                password += chars[Math.floor(Math.random() * chars.length)]
            }
        }
    } catch (e) {
        // Fallback final
        for (let i = 0; i < 12; i++) {
            password += chars[Math.floor(Math.random() * chars.length)]
        }
    }

    return `Colegio2026!${password.substring(0, 4)}`
}
