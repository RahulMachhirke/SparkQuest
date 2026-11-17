import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, UserRole } from '../types';
import { INITIAL_TEAMS } from '../data/defaultTeams';

interface AuthContextType {
  role: UserRole;
  currentTeam: Team | null;
  isAdmin: boolean;
  loginAsTeam: (teamId: string, passcode: string) => { success: boolean; message: string };
  loginAsAdmin: (adminKey: string) => { success: boolean; message: string };
  logout: () => void;
  quickSwitchTeam: (team: Team) => void;
}

const ADMIN_ACCESS_KEY = 'sparkadmin2026';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('spark_role') as UserRole) || 'guest';
  });

  const [currentTeam, setCurrentTeam] = useState<Team | null>(() => {
    const saved = localStorage.getItem('spark_team');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to Team 01 for smooth demo experience if not logged in
    return INITIAL_TEAMS[0];
  });

  useEffect(() => {
    localStorage.setItem('spark_role', role);
  }, [role]);

  useEffect(() => {
    if (currentTeam) {
      localStorage.setItem('spark_team', JSON.stringify(currentTeam));
    } else {
      localStorage.removeItem('spark_team');
    }
  }, [currentTeam]);

  const loginAsTeam = (teamId: string, passcode: string) => {
    // Get live teams from storage if available
    const savedTeamsStr = localStorage.getItem('spark_teams');
    const teamsList: Team[] = savedTeamsStr ? JSON.parse(savedTeamsStr) : INITIAL_TEAMS;

    const matched = teamsList.find(
      (t) => t.id.toLowerCase() === teamId.trim().toLowerCase() && t.passcode === passcode.trim()
    );

    if (matched) {
      setRole('team');
      setCurrentTeam(matched);
      return { success: true, message: `Welcome back, ${matched.name}!` };
    }
    return { success: false, message: 'Invalid Team ID or Passcode.' };
  };

  const loginAsAdmin = (adminKey: string) => {
    if (adminKey.trim() === ADMIN_ACCESS_KEY || adminKey.trim() === 'admin') {
      setRole('admin');
      return { success: true, message: 'Admin authentication verified.' };
    }
    return { success: false, message: 'Incorrect Admin Key.' };
  };

  const logout = () => {
    setRole('guest');
    localStorage.removeItem('spark_role');
  };

  const quickSwitchTeam = (team: Team) => {
    setCurrentTeam(team);
    setRole('team');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        currentTeam,
        isAdmin: role === 'admin',
        loginAsTeam,
        loginAsAdmin,
        logout,
        quickSwitchTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
