import { useState, useEffect } from "react";
import { Shield, Lock, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthGuardProps {
  children: React.ReactNode;
}

const CORRECT_PIN = "909913";
const AUTH_KEY = "cybersec-auth";

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem(AUTH_KEY);
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, "authenticated");
      setShowWelcome(true);
      toast({
        title: "Access Granted",
        description: "Welcome back, bitmonk",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid PIN. Please try again.",
        variant: "destructive",
      });
      setPin("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    setPin("");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="bg-gray-900 border border-green-500 rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Terminal className="text-green-400 w-8 h-8" />
              </div>
              <h1 className="text-2xl font-semibold text-green-400 mb-2 font-mono">
                CyberSec CheatSheets
              </h1>
              <p className="text-green-300 font-mono text-sm">
                Enter your PIN to access your security documentation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pin" className="flex items-center space-x-2 text-green-400 font-mono">
                  <Lock className="w-4 h-4" />
                  <span>PIN</span>
                </Label>
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your PIN"
                  className="mt-2 bg-black border-green-600 text-green-400 font-mono"
                  maxLength={6}
                  autoFocus
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-black font-mono"
                disabled={!pin}
              >
                Access CheatSheets
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {children}
      {/* Logout button - positioned in top right */}
      <Button
        onClick={handleLogout}
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50 text-green-400 hover:text-green-300 font-mono border border-green-600"
      >
        Logout
      </Button>
      
      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md bg-gray-900 border border-green-500">
          <DialogHeader>
            <DialogTitle className="text-center text-green-400 font-mono text-xl">
              Welcome Back, bitmonk
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
              <Terminal className="text-green-400 w-8 h-8" />
            </div>
            <p className="text-green-300 font-mono text-sm">
              Access granted. Your cybersecurity vault is now unlocked.
            </p>
            <Button 
              onClick={() => setShowWelcome(false)}
              className="bg-green-600 hover:bg-green-700 text-black font-mono"
            >
              Enter System
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}