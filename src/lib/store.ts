import { useState, useEffect } from 'react';
import { Team, Question, CompetitionState, RoundStatus } from '../types';
import { DEFAULT_TEAMS, INITIAL_QUESTIONS, supabase } from './supabase';

const STORAGE_KEYS = {
  TEAMS: 'sparkquest_teams',
  QUESTIONS: 'sparkquest_questions',
  COMP_STATE: 'sparkquest_comp_state',
  CURRENT_TEAM: 'sparkquest_current_team_id',
  ADMIN_AUTH: 'sparkquest_admin_authenticated'
};

// BroadcastChannel for cross-tab realtime sync (works offline & multi-tab)
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('sparkquest_realtime_bus') 
  : null;

// Initialize localStorage with seeds if empty, and merge any new seeds automatically
export function getInitialTeams(): Team[] {
  if (typeof window === 'undefined') return DEFAULT_TEAMS;
  const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
  if (saved) {
    try {
      const parsed: Team[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing defaults (e.g. team-06, team-07) so newly seeded teams appear immediately
        const existingIdSet = new Set(parsed.map(t => t.id.toLowerCase().replace(/[-_\s]/g, '')));
        const missing = DEFAULT_TEAMS.filter(t => !existingIdSet.has(t.id.toLowerCase().replace(/[-_\s]/g, '')));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing stored teams', e);
    }
  }
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(DEFAULT_TEAMS));
  return DEFAULT_TEAMS;
}

export function getInitialQuestions(): Question[] {
  if (typeof window === 'undefined') return INITIAL_QUESTIONS;
  const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored questions', e);
    }
  }
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  return INITIAL_QUESTIONS;
}

export function getInitialCompState(): CompetitionState {
  const defaultState: CompetitionState = {
    currentRound: 1,
    round1Status: 'waiting',
    activeQuestionIndex: 0,
    updatedAt: new Date().toISOString()
  };
  if (typeof window === 'undefined') return defaultState;
  const saved = localStorage.getItem(STORAGE_KEYS.COMP_STATE);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored comp state', e);
    }
  }
  localStorage.setItem(STORAGE_KEYS.COMP_STATE, JSON.stringify(defaultState));
  return defaultState;
}

/**
 * Global reactive hook for competition state, teams, questions, and current logged-in team
 */
export function useCompetitionStore() {
  const [teams, setTeams] = useState<Team[]>(getInitialTeams);
  const [questions, setQuestions] = useState<Question[]>(getInitialQuestions);
  const [compState, setCompState] = useState<CompetitionState>(getInitialCompState);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM) : null;
  });

  // Sync state across tabs & listen to Supabase if configured
  useEffect(() => {
    // 1. Cross-tab BroadcastChannel listener
    const handleBroadcast = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      if (type === 'STATE_CHANGE') {
        setCompState(payload);
      } else if (type === 'TEAMS_CHANGE') {
        setTeams(payload);
      } else if (type === 'QUESTIONS_CHANGE') {
        setQuestions(payload);
      }
    };

    if (syncChannel) {
      syncChannel.addEventListener('message', handleBroadcast);
    }

    // 2. Storage event fallback for older browsers
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.COMP_STATE && e.newValue) {
        setCompState(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.TEAMS && e.newValue) {
        setTeams(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.QUESTIONS && e.newValue) {
        setQuestions(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Supabase Realtime subscription (if Supabase configured)
    let supabaseSub: any = null;
    if (supabase) {
      supabaseSub = supabase
        .channel('public_room')
        .on('broadcast', { event: 'comp_state' }, ({ payload }) => {
          setCompState(payload);
        })
        .on('broadcast', { event: 'teams' }, ({ payload }) => {
          setTeams(payload);
        })
        .on('broadcast', { event: 'questions' }, ({ payload }) => {
          setQuestions(payload);
        })
        .subscribe();
    }

    return () => {
      if (syncChannel) {
        syncChannel.removeEventListener('message', handleBroadcast);
      }
      window.removeEventListener('storage', handleStorage);
      if (supabaseSub && supabase) {
        supabase.removeChannel(supabaseSub);
      }
    };
  }, []);

  // Update Competition State (Admin action)
  const updateCompState = (newState: Partial<CompetitionState>) => {
    setCompState((prev) => {
      const updated: CompetitionState = {
        ...prev,
        ...newState,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.COMP_STATE, JSON.stringify(updated));
      if (syncChannel) {
        syncChannel.postMessage({ type: 'STATE_CHANGE', payload: updated });
      }
      if (supabase) {
        supabase.channel('public_room').send({
          type: 'broadcast',
          event: 'comp_state',
          payload: updated
        });
      }
      return updated;
    });
  };

  // Launch Round 1 (Admin action)
  const launchRound1 = () => {
    updateCompState({ round1Status: 'live' });
  };

  // Reset Round 1 to Waiting Arena (Admin action)
  const resetRound1 = () => {
    updateCompState({ round1Status: 'waiting' });
  };

  // End Round 1 (Admin action)
  const endRound1 = () => {
    updateCompState({ round1Status: 'ended' });
  };

  // Update Teams list
  const updateTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(newTeams));
    if (syncChannel) {
      syncChannel.postMessage({ type: 'TEAMS_CHANGE', payload: newTeams });
    }
    if (supabase) {
      supabase.channel('public_room').send({
        type: 'broadcast',
        event: 'teams',
        payload: newTeams
      });
    }
  };

  // Record a team's Round 1 completion
  const recordTeamScore = (teamId: string, score: number, timeTakenSec: number) => {
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        const round1Score = score;
        const totalScore = round1Score + (t.manualAdjustment || 0);
        return {
          ...t,
          round1Score,
          totalScore,
          timeTakenSec,
          completedAt: new Date().toISOString()
        };
      }
      return t;
    });
    updateTeams(updated);
  };

  // Admin Manual Adjustment (+ / - points)
  const adjustTeamScore = (teamId: string, adjustmentDelta: number) => {
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        const newAdjustment = (t.manualAdjustment || 0) + adjustmentDelta;
        return {
          ...t,
          manualAdjustment: newAdjustment,
          totalScore: (t.round1Score || 0) + newAdjustment
        };
      }
      return t;
    });
    updateTeams(updated);
  };

  // Reset a team's score
  const resetTeamScore = (teamId: string) => {
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          round1Score: 0,
          manualAdjustment: 0,
          totalScore: 0,
          timeTakenSec: 0,
          completedAt: null
        };
      }
      return t;
    });
    updateTeams(updated);
  };

  // Reset all teams' scores
  const resetAllScores = () => {
    const updated = teams.map((t) => ({
      ...t,
      round1Score: 0,
      manualAdjustment: 0,
      totalScore: 0,
      timeTakenSec: 0,
      completedAt: null
    }));
    updateTeams(updated);
  };

  // Question Bank operations
  const updateQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(newQuestions));
    if (syncChannel) {
      syncChannel.postMessage({ type: 'QUESTIONS_CHANGE', payload: newQuestions });
    }
    if (supabase) {
      supabase.channel('public_room').send({
        type: 'broadcast',
        event: 'questions',
        payload: newQuestions
      });
    }
  };

  const addQuestion = (q: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...q,
      id: `q-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`
    };
    updateQuestions([...questions, newQ]);
  };

  const editQuestion = (id: string, updated: Partial<Question>) => {
    const newList = questions.map((q) => (q.id === id ? { ...q, ...updated } : q));
    updateQuestions(newList);
  };

  const deleteQuestion = (id: string) => {
    updateQuestions(questions.filter((q) => q.id !== id));
  };

  const resetQuestionsToDefault = () => {
    updateQuestions(INITIAL_QUESTIONS);
  };

  // Current logged in team
  const loginTeam = (teamId: string) => {
    setCurrentTeamId(teamId);
    localStorage.setItem(STORAGE_KEYS.CURRENT_TEAM, teamId);
    // Mark as online in team list
    const updated = teams.map((t) => t.id === teamId ? { ...t, isOnline: true } : t);
    updateTeams(updated);
  };

  const logoutTeam = () => {
    if (currentTeamId) {
      const updated = teams.map((t) => t.id === currentTeamId ? { ...t, isOnline: false } : t);
      updateTeams(updated);
    }
    setCurrentTeamId(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_TEAM);
  };

  const currentTeam = teams.find((t) => t.id === currentTeamId) || null;

  return {
    teams,
    questions,
    compState,
    currentTeam,
    currentTeamId,
    loginTeam,
    logoutTeam,
    launchRound1,
    resetRound1,
    endRound1,
    updateCompState,
    recordTeamScore,
    adjustTeamScore,
    resetTeamScore,
    resetAllScores,
    addQuestion,
    editQuestion,
    deleteQuestion,
    resetQuestionsToDefault,
    updateTeams
  };
}
