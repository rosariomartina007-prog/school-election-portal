import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { LogIn, UserPlus, ArrowRight, Moon, Sun } from "lucide-react";

interface WelcomeSectionProps {
  onVoteNow: () => void;
  onAdminLogin: () => void;
  onAdminSignup: () => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const WelcomeSection = ({
  onVoteNow,
  onAdminLogin,
  onAdminSignup,
  theme,
  setTheme,
}: WelcomeSectionProps) => {
  const isDark = theme === 'dark';

  return (
    <div className={`relative min-h-screen w-full overflow-hidden flex flex-col font-sans transition-colors duration-700 ${
      isDark ? "bg-slate-950 text-white" : "bg-white text-slate-800"
    }`}>
      
      {/* Background Effects - Conditional */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          // Dark Mode: Neon Glows
          <>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        ) : (
          // Light Mode: Vibrant Blobs
          <>
            <motion.div
              animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"
            />
            <motion.div
              animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"
            />
            <motion.div
              animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
              transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
              className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-cyan-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"
            />
          </>
        )}
      </div>

      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 flex justify-between items-center w-full px-6 md:px-12 py-6"
      >
        {/* Admin Login */}
        <Button
          onClick={onAdminLogin}
          variant="ghost"
          className={`group rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
            isDark 
              ? "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700"
              : "bg-white/40 backdrop-blur-md border border-white/50 text-slate-700 hover:bg-white/60 hover:text-purple-600 shadow-sm hover:shadow-md"
          }`}
        >
          <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Admin Login
        </Button>

        {/* Admin Sign Up */}
        <Button
          onClick={onAdminSignup}
          variant={isDark ? "outline" : "ghost"}
          className={`group rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
            isDark 
              ? "text-slate-400 hover:text-white border-slate-800 hover:border-pink-500 hover:bg-pink-500/10 shadow-lg hover:shadow-pink-500/20"
              : "bg-white/40 backdrop-blur-md border border-white/50 text-slate-700 hover:bg-white/60 hover:text-pink-600 shadow-sm hover:shadow-md"
          }`}
        >
          <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Admin Sign Up
        </Button>
      </motion.nav>

      {/* Main Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 max-w-5xl"
        >
          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className={`font-black tracking-tighter leading-[0.9] ${
              isDark 
                ? "text-5xl md:text-7xl lg:text-8xl" 
                : "text-6xl md:text-8xl lg:text-9xl"
            }`}>
              <span className={`block ${isDark ? "text-white" : "text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"}`}>
                SCHOOL
              </span>
              <span className={`block ${isDark ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" : "text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"}`}>
                ELECTION
              </span>
              <span className={`block ${isDark ? "text-4xl md:text-6xl text-slate-400" : "text-5xl md:text-7xl lg:text-8xl text-slate-800"}`}>
                PORTAL
              </span>
            </h1>
          </motion.div>

          {/* Vote Now Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
            className="pt-8"
          >
            <Button
              onClick={onVoteNow}
              className={`group relative px-16 py-8 text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-[0_20px_50px_-12px_rgba(168,85,247,0.5)] hover:shadow-[0_30px_60px_-12px_rgba(236,72,153,0.6)] hover:scale-105 hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-white/20`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative flex items-center gap-4">
                VOTE NOW
                <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </main>

      {/* Theme Toggle - Bottom Right Corner */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
          isDark 
            ? "bg-slate-800/80 text-yellow-400 border border-slate-700 hover:bg-slate-700" 
            : "bg-white/80 text-indigo-600 border border-white/50 hover:bg-white shadow-indigo-500/20"
        }`}
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </motion.button>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};