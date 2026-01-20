'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { UserContextType, UserProfile, School, UserRole } from '@/types/auth';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfileAndSchool = async (currentUser: User) => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('users_profile')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (profileError) throw profileError;
            if (!profileData) throw new Error('Profile not found');

            // Fetch School
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('*')
                .eq('id', profileData.school_id)
                .single();

            if (schoolError) throw schoolError;
            if (!schoolData) throw new Error('School not found');

            setProfile(profileData as UserProfile);
            setSchool(schoolData as School);
        } catch (err: any) {
            console.error('Error fetching user details:', err);
            setError(err);
            // Clear state on error to prevent inconsistent UI
            setProfile(null);
            setSchool(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) {
                if (session?.user) {
                    setUser(session.user);
                    fetchProfileAndSchool(session.user);
                } else {
                    setUser(null);
                    setProfile(null);
                    setSchool(null);
                    setIsLoading(false);
                }
            }
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (mounted) {
                if (session?.user) {
                    // Only re-fetch if the user ID changed or we don't have a profile yet
                    // This prevents loop if 'SIGNED_IN' fires multiple times
                    if (session.user.id !== user?.id) {
                        setUser(session.user);
                        fetchProfileAndSchool(session.user);
                    }
                } else {
                    setUser(null);
                    setProfile(null);
                    setSchool(null);
                    setIsLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        profile,
        school,
        isLoading,
        error,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
