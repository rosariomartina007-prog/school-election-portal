import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { ArrowLeft, Vote, CheckCircle2 } from "lucide-react";
import { Candidate, VoteSelection } from "../types";

interface VotingSectionProps {
  candidates: Candidate[];
  onBack: () => void;
  onSubmit: (selections: VoteSelection) => void;
}

export const VotingSection = ({
  candidates,
  onBack,
  onSubmit,
}: VotingSectionProps) => {
  const [selections, setSelections] = useState<VoteSelection>({});
  const positions = [...new Set(candidates.map((c) => c.position))];

  const handleVote = () => {
    if (Object.keys(selections).length === 0) {
      alert("Please select at least one candidate to vote for.");
      return;
    }
    if (window.confirm("Are you sure you want to submit your votes?")) {
      onSubmit(selections);
      setSelections({});
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      {/* Background Gradients matching Welcome Section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-50" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between mb-12"
          >
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white/60 backdrop-blur-md border-white/50 text-slate-700 hover:bg-white hover:text-purple-600 rounded-full px-6 shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
              BALLOT
            </h1>
            <div className="w-24" /> {/* Spacer for balance */}
          </motion.div>

          {/* Positions Grid */}
          <div className="space-y-12">
            {positions.map((position, index) => (
              <motion.div
                key={position}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">{position}</h2>
                  <p className="text-slate-500">Select your preferred candidate</p>
                </div>

                <RadioGroup
                  value={selections[position]}
                  onValueChange={(value) =>
                    setSelections({ ...selections, [position]: value })
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {candidates
                      .filter((c) => c.position === position)
                      .map((candidate) => (
                        <motion.div
                          key={candidate.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className={`relative h-full flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                              selections[position] === candidate.id
                                ? "border-indigo-500 bg-white/80 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]"
                                : "border-white/60 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:border-indigo-300 hover:shadow-lg"
                            }`}
                            onClick={() => {
                              const radio = document.getElementById(
                                candidate.id
                              ) as HTMLInputElement;
                              if (radio) radio.click();
                            }}
                          >
                            {/* Selection Indicator */}
                            <AnimatePresence>
                              {selections[position] === candidate.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="absolute top-4 right-4 bg-indigo-500 text-white rounded-full p-1 shadow-lg"
                                >
                                  <CheckCircle2 className="w-6 h-6" />
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <RadioGroupItem
                              value={candidate.id}
                              id={candidate.id}
                              className="sr-only"
                            />

                            {/* Photo */}
                            <div className="w-48 h-48 bg-slate-200 rounded-full overflow-hidden flex-shrink-0 mb-6 border-4 border-white shadow-md">
                              {candidate.image ? (
                                <img
                                  src={candidate.image}
                                  alt={candidate.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  No Photo
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="text-center space-y-2">
                              <Label
                                htmlFor={candidate.id}
                                className="text-xl font-bold text-slate-800 cursor-pointer block"
                              >
                                {candidate.name}
                              </Label>
                              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                                Class {candidate.class}
                              </div>
                              {candidate.hobbies && (
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                  {candidate.hobbies}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </RadioGroup>
              </motion.div>
            ))}
          </div>

          {/* Submit Button Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-16 pb-12"
          >
            <Button
              onClick={handleVote}
              size="lg"
              className="group relative px-12 py-7 text-xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-[0_20px_50px_-12px_rgba(168,85,247,0.5)] hover:shadow-[0_30px_60px_-12px_rgba(236,72,153,0.6)] hover:scale-105 transition-all duration-300"
            >
              <Vote className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Submit Votes
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};