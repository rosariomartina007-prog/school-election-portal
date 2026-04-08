import { useState } from "react";
import { WelcomeSection } from "./components/WelcomeSection";
import { VotingSection } from "./components/VotingSection";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuthModal } from "./components/AuthModal";
import { CandidateModal } from "./components/CandidateModal";
import { Toast } from "./components/Toast";
import { useElectionData } from "./hooks/useElectionData";
import { Candidate, VoteSelection } from "./types";
import { Toast as ToastType } from "./types";

type View = "welcome" | "voting" | "admin";

function App() {
  const [view, setView] = useState<View>("welcome");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);
  
  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const {
    candidates,
    admins,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    addAdmin,
    submitVotes,
    exportData,
    importData,
    resetData,
  } = useElectionData();

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleVoteSubmit = (selections: VoteSelection) => {
    submitVotes(selections);
    showToast("Votes submitted successfully!");
    setView("welcome"); // Return to home after voting
  };

  const handleSaveCandidate = (candidate: Candidate) => {
    if (editingCandidate) {
      updateCandidate(candidate);
      showToast("Candidate updated successfully!");
    } else {
      addCandidate(candidate);
      showToast("Candidate added successfully!");
    }
    setEditingCandidate(null);
    setShowCandidateModal(false);
  };

  const handleAdminAuth = (username: string, password: string) => {
    const admin = admins.find((a) => a.username === username && a.password === password);
    if (admin) {
      setShowAuthModal(false);
      setView("admin");
      showToast("Welcome back, Admin!");
    } else {
      showToast("Invalid credentials", "error");
    }
  };

  const handleAdminSignup = (username: string, password: string, question: string, answer: string) => {
    if (admins.find((a) => a.username === username)) {
      showToast("Username already exists", "error");
      return;
    }
    addAdmin({ username, password, question, answer });
    setShowAuthModal(false);
    setView("admin");
    showToast("Account created successfully!");
  };

  return (
    <div className="min-h-screen">
      {view === "welcome" && (
        <WelcomeSection
          onVoteNow={() => setView("voting")}
          onAdminLogin={() => {
            setAuthMode("login");
            setShowAuthModal(true);
          }}
          onAdminSignup={() => {
            setAuthMode("signup");
            setShowAuthModal(true);
          }}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {view === "voting" && (
        <VotingSection
          candidates={candidates}
          onBack={() => setView("welcome")}
          onSubmit={handleVoteSubmit}
        />
      )}

      {view === "admin" && (
        <AdminDashboard
          candidates={candidates}
          onBack={() => setView("welcome")}
          onAddCandidate={() => {
            setEditingCandidate(null);
            setShowCandidateModal(true);
          }}
          onEditCandidate={(candidate) => {
            setEditingCandidate(candidate);
            setShowCandidateModal(true);
          }}
          onDeleteCandidate={deleteCandidate}
          onExport={exportData}
          onImport={importData}
          onReset={resetData}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onLogin={handleAdminAuth}
          onSignup={handleAdminSignup}
        />
      )}

      {showCandidateModal && (
        <CandidateModal
          isOpen={showCandidateModal}
          onClose={() => setShowCandidateModal(false)}
          onSave={handleSaveCandidate}
          candidate={editingCandidate}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;