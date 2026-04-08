import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Edit, Trash2, Download, Upload, LogOut, Trophy } from "lucide-react";
import { Candidate } from "../types";

interface AdminDashboardProps {
  candidates: Candidate[];
  onBack: () => void;
  onLogout: () => void;
  onEditCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
  onAddCandidate: () => void;
  onExportData: () => void;
  onImportData: (file: File) => Promise<boolean>;
}

export const AdminDashboard = ({
  candidates,
  onBack,
  onLogout,
  onEditCandidate,
  onDeleteCandidate,
  onAddCandidate,
  onExportData,
  onImportData,
}: AdminDashboardProps) => {
  const [importing, setImporting] = useState(false);
  const positions = [...new Set(candidates.map((c) => c.position))];
  const results = [...candidates].sort((a, b) => b.votes - a.votes);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImporting(true);
      const success = await onImportData(file);
      setImporting(false);
      if (success) {
        alert("Data imported successfully!");
        window.location.reload();
      } else {
        alert("Failed to import data. Please check the file format.");
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onExportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => document.getElementById("import-input")?.click()}
              variant="outline"
              size="sm"
              disabled={importing}
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? "Importing..." : "Import"}
            </Button>
            <input
              id="import-input"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button onClick={onAddCandidate} className="bg-purple-500 hover:bg-purple-600">
                Add New Candidate
              </Button>
            </div>
            {positions.map((position) => (
              <Card key={position} className="mb-6">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-slate-800">{position}</CardTitle>
                  <CardDescription>
                    {candidates.filter((c) => c.position === position).length} candidates
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candidates
                      .filter((c) => c.position === position)
                      .map((candidate) => (
                        <Card key={candidate.id} className="border-2 hover:border-purple-300 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-16 h-16 bg-slate-200 rounded-full overflow-hidden flex-shrink-0">
                                {candidate.image ? (
                                  <img
                                    src={candidate.image}
                                    alt={candidate.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                    No Photo
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-800 truncate">
                                  {candidate.name}
                                </h3>
                                <p className="text-sm text-slate-600">
                                  Class {candidate.class}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {candidate.votes} votes
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                onClick={() => onEditCandidate(candidate)}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => {
                                  if (window.confirm(`Delete ${candidate.name}?`)) {
                                    onDeleteCandidate(candidate.id);
                                  }
                                }}
                                variant="outline"
                                size="sm"
                                className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {positions.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-slate-500 mb-4">No candidates added yet</p>
                  <Button onClick={onAddCandidate} className="bg-purple-500 hover:bg-purple-600">
                    Add Your First Candidate
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Election Results
                </CardTitle>
                <CardDescription>
                  Total votes: {candidates.reduce((sum, c) => sum + c.votes, 0)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {results.length > 0 ? (
                  <div className="space-y-3">
                    {results.map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className="flex items-center gap-4 p-4 rounded-lg border-2 bg-white"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0
                              ? "bg-amber-500"
                              : index === 1
                              ? "bg-slate-400"
                              : index === 2
                              ? "bg-amber-700"
                              : "bg-slate-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden flex-shrink-0">
                          {candidate.image ? (
                            <img
                              src={candidate.image}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              No Photo
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">{candidate.name}</h3>
                          <p className="text-sm text-slate-600">
                            {candidate.position} • Class {candidate.class}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{candidate.votes}</p>
                          <p className="text-sm text-slate-500">votes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No votes recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};