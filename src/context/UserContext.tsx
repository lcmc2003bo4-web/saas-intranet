'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserContextType, UserProfile, School, UserRole } from '@/types/auth';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfileAndSchool = async (currentUser: User) => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch Profile with School in a single query (optimization)
            const { data, error: fetchError } = await supabase
                .from('users_profile')
                .select('*, schools(*)')
                .eq('id', currentUser.id)
                .single();

            if (fetchError) throw fetchError;
            if (!data) throw new Error('Profile not found');

            const { schools, ...profileData } = data;

            setProfile(profileData as UserProfile);
            setSchool(schools as School);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
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
