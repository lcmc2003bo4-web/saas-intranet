export type UserRole = 'super_admin' | 'director' | 'admin' | 'teacher' | 'student' | 'parent';

export interface School {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
}

export interface UserProfile {
    id: string;
    school_id: string;
    role: UserRole;
    full_name: string | null;
    email: string | null; // Joined from auth or kept separately
}

export interface UserContextType {
    user: any | null; // Supabase User type can be imported if needed, using any for now to avoid dep cycle or complex imports immediately
    profile: UserProfile | null;
    school: School | null;
    isLoading: boolean;
    error: Error | null;
}
