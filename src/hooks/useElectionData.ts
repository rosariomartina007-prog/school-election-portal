import { useState, useEffect } from "react";
import { Candidate, Admin, VoteSelection } from "../types";
import { getStoredData, setStoredData } from "../utils/localStorageUtils";

export const useElectionData = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  // Load data whenever currentAdminId changes (login/logout)
  useEffect(() => {
    loadData();
  }, [currentAdminId]);

  const loadData = () => {
    const data = getStoredData();
    setAdmins(data.admins || []);
    
    // STRICT ISOLATION LOGIC:
    // If an admin is logged in, ONLY show candidates created by that specific admin.
    // If no admin is logged in (Voting Section), show ALL candidates from all admins.
    if (currentAdminId) {
      const myCandidates = data.candidates?.filter((c: Candidate) => c.adminId === currentAdminId) || [];
      setCandidates(myCandidates);
    } else {
      // Public voting view: show all candidates
      setCandidates(data.candidates || []);
    }
  };

  const saveCandidates = (newCandidates: Candidate[]) => {
    const data = getStoredData();
    // Keep candidates from OTHER admins, update/replace current admin's candidates
    const otherCandidates = data.candidates?.filter((c: Candidate) => c.adminId !== currentAdminId) || [];
    data.candidates = [...otherCandidates, ...newCandidates];
    setStoredData(data);
    setCandidates(newCandidates);
  };

  const saveAdmins = (newAdmins: Admin[]) => {
    const data = getStoredData();
    data.admins = newAdmins;
    setStoredData(data);
    setAdmins(newAdmins);
  };

  const addCandidate = (candidate: Candidate) => {
    if (!currentAdminId) return;
    // Ensure the candidate is tagged with the current admin's ID
    const candidateWithAdmin = { ...candidate, adminId: currentAdminId };
    const newCandidates = [...candidates, candidateWithAdmin];
    saveCandidates(newCandidates);
  };

  const updateCandidate = (id: string, updatedData: Partial<Candidate>) => {
    const newCandidates = candidates.map((c) =>
      c.id === id ? { ...c, ...updatedData } : c
    );
    saveCandidates(newCandidates);
  };

  const deleteCandidate = (id: string) => {
    const newCandidates = candidates.filter((c) => c.id !== id);
    saveCandidates(newCandidates);
  };

  const addAdmin = (admin: Admin) => {
    const newAdmins = [...admins, admin];
    saveAdmins(newAdmins);
  };

  const authenticateAdmin = (username: string, password: string): Admin | null => {
    const admin = admins.find(
      (a) => a.username === username && a.password === password
    );
    if (admin) {
      setCurrentAdminId(admin.id);
    }
    return admin || null;
  };

  const submitVotes = (selections: VoteSelection) => {
    const data = getStoredData();
    // Update votes globally (since votes are public data)
    const updatedCandidates = data.candidates?.map((c: Candidate) => {
      if (selections[c.position] === c.id) {
        return { ...c, votes: c.votes + 1 };
      }
      return c;
    }) || [];
    data.candidates = updatedCandidates;
    setStoredData(data);
    // Refresh local state based on current view (Admin or Public)
    loadData();
  };

  const getPositions = () => {
    const positions = [...new Set(candidates.map((c) => c.position))];
    return positions;
  };

  const getCandidatesByPosition = (position: string) => {
    return candidates.filter((c) => c.position === position);
  };

  const getResults = () => {
    return [...candidates].sort((a, b) => b.votes - a.votes);
  };

  const logout = () => {
    setCurrentAdminId(null);
    // loadData will be called by useEffect due to state change, loading all candidates
  };

  return {
    candidates,
    admins,
    currentAdminId,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    addAdmin,
    authenticateAdmin,
    submitVotes,
    getPositions,
    getCandidatesByPosition,
    getResults,
    loadData,
    logout,
  };
};