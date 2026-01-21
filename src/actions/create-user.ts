'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)

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
    try {
        const password = params.password || generateTemporaryPassword()

        // 1. Create user in Supabase Auth
        // The trigger in SQL will automatically handle the profile creation in `users_profile` table
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: params.email,
            password: password,
            email_confirm: true, // Auto-confirm email since admin created it
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
        console.error('Server Action Error:', error)
        return { success: false, error: error.message || 'Error interno del servidor' }
    }
}

function generateTemporaryPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    // Generate a reasonably secure random password
    const array = new Uint32Array(12)
    if (typeof crypto !== 'undefined') {
        crypto.getRandomValues(array)
    } else {
        // Fallback for environments where crypto might not be available (though it should be in Node 20)
        for (let i = 0; i < 12; i++) array[i] = Math.floor(Math.random() * chars.length)
    }

    for (let i = 0; i < 12; i++) {
        password += chars[array[i] % chars.length]
    }
    return `Colegio2026!${password.substring(0, 4)}` // Easier format requested by user: Colegio2026! + random suffix
}
