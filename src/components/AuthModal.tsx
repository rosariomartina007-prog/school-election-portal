import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { X, AlertCircle } from "lucide-react";
import { Admin } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup" | "forgot";
  onModeChange: (mode: "login" | "signup" | "forgot") => void;
  onLogin: (username: string, password: string) => Admin | null;
  onSignup: (admin: Admin) => void;
}

export const AuthModal = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
  onLogin,
  onSignup,
}: AuthModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotAnswer, setForgotAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1);
  const [passwordError, setPasswordError] = useState("");

  // Reset form fields when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setQuestion("");
      setAnswer("");
      setPasswordError("");
      setForgotUsername("");
      setForgotAnswer("");
      setNewPassword("");
      setForgotStep(1);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
    const admin = onLogin(username, password);
    if (!admin) {
      alert("Invalid username or password");
    }
  };

  const handleSignup = () => {
    if (!username || !password || !question || !answer) {
      alert("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    setPasswordError("");
    onSignup({
      id: Date.now().toString(),
      username,
      password,
      question,
      answer,
    });
    onClose();
  };

  const handleForgotStep1 = () => {
    if (!forgotUsername) {
      alert("Please enter your username");
      return;
    }
    setForgotStep(2);
  };

  const handleForgotStep2 = () => {
    if (!forgotAnswer) {
      alert("Please answer the security question");
      return;
    }
    setForgotStep(3);
  };

  const handleForgotStep3 = () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    alert("Password reset successful! Please login with your new password.");
    onModeChange("login");
    setForgotStep(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">
            {mode === "login" && "Admin Login"}
            {mode === "signup" && "Create Admin Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {mode === "login" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <Button
                onClick={() => onModeChange("forgot")}
                variant="link"
                className="px-0 text-sm"
              >
                Forgot password?
              </Button>
              <Button onClick={handleLogin} className="w-full bg-purple-500 hover:bg-purple-600">
                Login
              </Button>
              <p className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <button
                  onClick={() => onModeChange("signup")}
                  className="text-purple-600 hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Choose a password (min 6 characters)"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Confirm your password"
                />
                {passwordError && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="security-question">Security Question</Label>
                <Select value={question} onValueChange={setQuestion}>
                  <SelectTrigger id="security-question">
                    <SelectValue placeholder="Select a question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pet">What was the name of your first pet?</SelectItem>
                    <SelectItem value="city">In what city were you born?</SelectItem>
                    <SelectItem value="school">What was the name of your first school?</SelectItem>
                    <SelectItem value="book">What is your favorite book?</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="security-answer">Answer</Label>
                <Input
                  id="security-answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Your answer"
                />
              </div>
              <Button onClick={handleSignup} className="w-full bg-indigo-500 hover:bg-indigo-600">
                Create Account
              </Button>
              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <button
                  onClick={() => onModeChange("login")}
                  className="text-purple-600 hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          )}

          {mode === "forgot" && (
            <div className="space-y-4">
              {forgotStep === 1 && (
                <>
                  <div>
                    <Label htmlFor="forgot-username">Username</Label>
                    <Input
                      id="forgot-username"
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <Button onClick={handleForgotStep1} className="w-full bg-purple-500 hover:bg-purple-600">
                    Continue
                  </Button>
                </>
              )}
              {forgotStep === 2 && (
                <>
                  <p className="text-sm text-slate-600">
                    Security Question: What was the name of your first pet?
                  </p>
                  <div>
                    <Label htmlFor="forgot-answer">Answer</Label>
                    <Input
                      id="forgot-answer"
                      value={forgotAnswer}
                      onChange={(e) => setForgotAnswer(e.target.value)}
                      placeholder="Enter your answer"
                    />
                  </div>
                  <Button onClick={handleForgotStep2} className="w-full bg-purple-500 hover:bg-purple-600">
                    Verify Answer
                  </Button>
                </>
              )}
              {forgotStep === 3 && (
                <>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  <Button onClick={handleForgotStep3} className="w-full bg-purple-500 hover:bg-purple-600">
                    Reset Password
                  </Button>
                </>
              )}
              <Button
                onClick={() => {
                  onModeChange("login");
                  setForgotStep(1);
                }}
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};