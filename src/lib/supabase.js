import { createClient } from '@supabase/supabase-js';

// Lấy từ environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Kiểm tra xem có config Supabase không
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Tạo Supabase client (chỉ khi có config)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Game scores table functions
export const saveGameScore = async (playerName, score, wave, health) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured. Score not saved.');
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  try {
    const { data, error } = await supabase
      .from('game_scores')
      .insert([
        {
          player_name: playerName,
          score: score,
          wave: wave,
          health: health,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving game score:', error);
    return { data: null, error };
  }
};

export const getLeaderboard = async (limit = 10) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured. Leaderboard not available.');
    return { data: [], error: { message: 'Supabase not configured' } };
  }

  try {
    // Sắp xếp theo điểm số giảm dần (không quan trọng thời gian)
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .order('score', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { data: [], error };
  }
};

export const getPlayerHistory = async (playerName) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured. Player history not available.');
    return { data: [], error: { message: 'Supabase not configured' } };
  }

  try {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('player_name', playerName)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching player history:', error);
    return { data: [], error };
  }
};

