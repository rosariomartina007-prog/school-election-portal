const STORAGE_KEY = "school_election_data";

export const getStoredData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { candidates: [], admins: [] };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return { candidates: [], admins: [] };
  }
};

export const setStoredData = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error writing to localStorage:", error);
    return false;
  }
};

export const exportData = (adminId: string) => {
  const data = getStoredData();
  const adminData = {
    admins: data.admins.filter((a: Admin) => a.id === adminId),
    candidates: data.candidates.filter((c: Candidate) => c.adminId === adminId),
  };
  const blob = new Blob([JSON.stringify(adminData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `election_data_${adminId}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file: File, adminId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        const data = getStoredData();
        
        // Import candidates with adminId
        if (importedData.candidates) {
          const candidatesWithAdminId = importedData.candidates.map((c: Candidate) => ({
            ...c,
            adminId: adminId,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          }));
          data.candidates = [...data.candidates, ...candidatesWithAdminId];
        }
        
        setStoredData(data);
        resolve(true);
      } catch (error) {
        console.error("Error importing data:", error);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
};

export const resetAdminData = (adminId: string) => {
  const data = getStoredData();
  data.candidates = data.candidates.filter((c: Candidate) => c.adminId !== adminId);
  setStoredData(data);
};