import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function signUpWithEmail(email: string, password: string, username: string) {
  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username,
            level: 1,
            eco_points: 0,
            streak_days: 0,
            co2_saved: 0,
          },
        ]);

      if (profileError) throw profileError;
    }

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  return await supabase.auth.getUser();
}

export async function getUserProfile(userId: string) {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
}

export async function updateUserProfile(userId: string, updates: any) {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
}

export async function trackHabit(habitData: any) {
  return await supabase
    .from('habits')
    .insert([habitData]);
}

export async function getUserHabits(userId: string) {
  return await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function getChallenges() {
  return await supabase
    .from('challenges')
    .select('*')
    .gte('end_date', new Date().toISOString());
}

export async function joinChallenge(userId: string, challengeId: string) {
  return await supabase
    .from('user_challenges')
    .insert([
      {
        user_id: userId,
        challenge_id: challengeId,
      },
    ]);
}

export async function updateChallengeProgress(userId: string, challengeId: string, progress: number) {
  return await supabase
    .from('user_challenges')
    .update({ progress })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId);
}