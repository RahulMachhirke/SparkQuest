import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Team, RoundStatus } from '../types';
import { INITIAL_TEAMS } from '../data/defaultTeams';

interface ScoreUpdateEvent {
  id: string;
  timestamp: string;
  teamName: string;
  roundName: string;
  delta: number;
  newTotal: number;
  source: 'auto' | 'manual';
}

export interface ScoreAdjustment {
  round1Score?: number;
  round2Score?: number;
  round3Score?: number;
  round4Score?: number;
  round5Score?: number;
  bonusPoints?: number;
}

interface CompetitionContextType {
  teams: Team[];
  roundStatus: RoundStatus;
  activityFeed: ScoreUpdateEvent[];
  updateScore: (
    teamId: string,
    roundField: 'round1Score' | 'round2Score' | 'round3Score' | 'round4Score' | 'round5Score' | 'bonusPoints',
    newScore: number,
    source?: 'auto' | 'manual'
  ) => void;
  bulkAdjustScores: (teamId: string, scores: ScoreAdjustment) => void;
  toggleRound: (roundKey: keyof RoundStatus) => void;
  addTeam: (team: Omit<Team, 'totalScore'>) => void;
  deleteTeam: (teamId: string) => void;
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const DEFAULT_ROUND_STATUS: RoundStatus = {
  round1Active: true,
  round2Active: true,
  round3Active: true,
  round4Active: true,
  round5Active: true,
};

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const CompetitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('spark_teams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TEAMS;
      }
    }
    return INITIAL_TEAMS;
  });

  const [roundStatus, setRoundStatus] = useState<RoundStatus>(() => {
    const saved = localStorage.getItem('spark_round_status');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ROUND_STATUS;
      }
    }
    return DEFAULT_ROUND_STATUS;
  });

  const [activityFeed, setActivityFeed] = useState<ScoreUpdateEvent[]>(() => {
    const saved = localStorage.getItem('spark_activity');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'ev-1',
        timestamp: 'Just now',
        teamName: 'Binary Beasts',
        roundName: 'Round 1 (Rapid Fire)',
        delta: +2600,
        newTotal: 3145,
        source: 'auto',
      },
      {
        id: 'ev-2',
        timestamp: '2m ago',
        teamName: 'Null Pointers',
        roundName: 'Round 3 (Blind Coding)',
        delta: +85,
        newTotal: 3035,
        source: 'manual',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('spark_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('spark_round_status', JSON.stringify(roundStatus));
  }, [roundStatus]);

  useEffect(() => {
    localStorage.setItem('spark_activity', JSON.stringify(activityFeed));
  }, [activityFeed]);

  const calculateTotal = (t: Partial<Team>): number => {
    return (
      (t.round1Score || 0) +
      (t.round2Score || 0) +
      (t.round3Score || 0) +
      (t.round4Score || 0) +
      (t.round5Score || 0) +
      (t.bonusPoints || 0)
    );
  };

  const updateScore = (
    teamId: string,
    roundField: 'round1Score' | 'round2Score' | 'round3Score' | 'round4Score' | 'round5Score' | 'bonusPoints',
    newScore: number,
    source: 'auto' | 'manual' = 'auto'
  ) => {
    setTeams((prev) => {
      return prev.map((t) => {
        if (t.id === teamId) {
          const delta = newScore - (t[roundField] || 0);
          const updated: Team = {
            ...t,
            [roundField]: newScore,
            lastUpdated: new Date().toLocaleTimeString(),
          };
          updated.totalScore = calculateTotal(updated);

          const roundReadable = {
            round1Score: 'Round 1 (Rapid Fire)',
            round2Score: 'Round 2 (Bug Hunt)',
            round3Score: 'Round 3 (Blind Coding)',
            round4Score: 'Round 4 (Reverse Logic)',
            round5Score: 'Round 5 (Relay Coding)',
            bonusPoints: 'Bonus/Penalty Adjustments',
          }[roundField];

          setActivityFeed((feed) => [
            {
              id: `ev-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              teamName: t.name,
              roundName: roundReadable,
              delta,
              newTotal: updated.totalScore,
              source,
            },
            ...feed.slice(0, 19),
          ]);

          return updated;
        }
        return t;
      });
    });
  };

  const bulkAdjustScores = (teamId: string, scores: ScoreAdjustment) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const merged: Team = { ...t, ...scores };
          merged.totalScore = calculateTotal(merged);
          merged.lastUpdated = new Date().toLocaleTimeString();
          return merged;
        }
        return t;
      })
    );
  };

  const toggleRound = (roundKey: keyof RoundStatus) => {
    setRoundStatus((prev) => ({
      ...prev,
      [roundKey]: !prev[roundKey],
    }));
  };

  const addTeam = (teamData: Omit<Team, 'totalScore'>) => {
    const total = calculateTotal(teamData);
    const newTeam: Team = { ...teamData, totalScore: total };
    setTeams((prev) => [...prev, newTeam]);
  };

  const deleteTeam = (teamId: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
  };

  const resetAllData = () => {
    localStorage.removeItem('spark_teams');
    localStorage.removeItem('spark_round_status');
    localStorage.removeItem('spark_activity');
    setTeams(INITIAL_TEAMS);
    setRoundStatus(DEFAULT_ROUND_STATUS);
    setActivityFeed([]);
  };

  const exportDataJSON = () => {
    return JSON.stringify({ teams, roundStatus, exportDate: new Date().toISOString() }, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.teams)) {
        setTeams(parsed.teams);
        if (parsed.roundStatus) setRoundStatus(parsed.roundStatus);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CompetitionContext.Provider
      value={{
        teams,
        roundStatus,
        activityFeed,
        updateScore,
        bulkAdjustScores,
        toggleRound,
        addTeam,
        deleteTeam,
        resetAllData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetition = () => {
  const ctx = useContext(CompetitionContext);
  if (!ctx) throw new Error('useCompetition must be used within CompetitionProvider');
  return ctx;
};
