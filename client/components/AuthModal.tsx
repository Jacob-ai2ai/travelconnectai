import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, Eye, EyeOff, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signInData, setSignInData] = useState({
    userId: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [signInError, setSignInError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      number: /\d/.test(password),
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
    };
    return requirements;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError("");
    setIsSigningIn(true);

    // Simulate API call to check if user exists
    setTimeout(() => {
      // TODO: Replace with actual API call to check user existence
      // For demo purposes, we'll simulate that only certain emails are "registered"
      const registeredUsers = [
        "demo@travelconnect.ai",
        "test@example.com",
        "user@gmail.com",
        "+1234567890"
      ];

      const userExists = registeredUsers.some(user =>
        user.toLowerCase() === signInData.userId.toLowerCase()
      );

      if (!userExists) {
        setSignInError("account-not-found");
      } else {
        // Simulate password check (in real app, this would be handled by backend)
        if (signInData.password === "password123") {
          console.log("Sign in successful:", signInData);
          onClose();
          // TODO: Handle successful login (set auth state, redirect, etc.)
        } else {
          setSignInError("invalid-password");
        }
      }
      setIsSigningIn(false);
    }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!signUpData.agreeToTerms) {
      alert("Please agree to the terms and privacy policy!");
      return;
    }
    console.log("Sign up attempt:", signUpData);
    // TODO: Implement actual sign-up API call
    // Simulate successful signup
    onClose();

    // Check if user selected property owner role in a previous flow
    // For now, we'll direct all new signups to regular onboarding
    // Property owners can be directed to /property-onboarding specifically
    navigate("/onboarding");
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    // TODO: Implement social login
  };

  const passwordRequirements = validatePassword(signUpData.password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {activeTab === "signin" ? "Welcome Back" : "Create your Travel Connect account"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value as "signin" | "signup");
          setSignInError("");
        }} className="flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin" className="space-y-4 flex-1 overflow-y-auto">
            {/* Demo Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-blue-800 text-xs">
                <strong>Demo:</strong> Try "demo@travelconnect.ai" with password "password123"
                or use any unregistered email to see the button change to registration prompt.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">Email or Phone Number</Label>
                <div className="relative">
                  <Input
                    id="userId"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={signInData.userId}
                    onChange={(e) => {
                      setSignInData({ ...signInData, userId: e.target.value });
                      setSignInError("");
                    }}
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {signInData.userId.includes('@') ? (
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) => {
                      setSignInData({ ...signInData, password: e.target.value });
                      setSignInError("");
                    }}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-travel-blue hover:underline"
                    onClick={onClose}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Password Error Message */}
              {signInError === "invalid-password" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-800 text-sm">
                    Incorrect password. Please try again or reset your password.
                  </p>
                </div>
              )}

              {/* Dynamic Button Area */}
              {signInError === "account-not-found" ? (
                <div className="space-y-3">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-orange-800 font-medium mb-2">
                      Account not found
                    </div>
                    <p className="text-orange-700 text-sm">
                      This email/phone isn't registered. Please sign up first to access Travel Connect.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setActiveTab("signup");
                      setSignInError("");
                    }}
                    className="w-full bg-travel-green hover:bg-travel-green/90 text-white"
                  >
                    Create Account Now
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSignInError("")}
                    className="w-full"
                  >
                    Try Different Email
                  </Button>
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-travel-blue hover:bg-travel-blue/90"
                  disabled={isSigningIn}
                >
                  {isSigningIn ? "Signing In..." : "Sign In"}
                </Button>
              )}
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="space-y-4 flex-1 overflow-y-auto">
            {/* Social Login Options */}
            <div className="space-y-3">
              <div className="text-center text-sm text-muted-foreground mb-3">
                Quick Signup (Social Login)
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("google")}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("facebook")}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("linkedin")}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Signup Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={signUpData.username}
                    onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address ��️ *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={signUpData.phone}
                  onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password 🔒</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {signUpData.password && (
                  <div className="text-xs space-y-1">
                    <div className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-1">{passwordRequirements.length ? '✓' : '×'}</span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-1">{passwordRequirements.special ? '✓' : '×'}</span>
                      At least 1 special character
                    </div>
                    <div className={`flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-1">{passwordRequirements.number ? '✓' : '×'}</span>
                      At least 1 number
                    </div>
                    <div className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-1">{passwordRequirements.uppercase ? '✓' : '×'}</span>
                      At least 1 capital letter
                    </div>
                    <div className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-1">{passwordRequirements.lowercase ? '✓' : '×'}</span>
                      At least 1 lowercase letter
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword && (
                  <p className="text-xs text-red-600">Passwords don't match</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={signUpData.agreeToTerms}
                  onCheckedChange={(checked) => 
                    setSignUpData({ ...signUpData, agreeToTerms: checked as boolean })
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  ✅ I agree to{" "}
                  <Link to="/terms" className="text-travel-blue hover:underline">
                    Terms & Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-travel-blue hover:bg-travel-blue/90"
                disabled={!isPasswordValid || signUpData.password !== signUpData.confirmPassword || !signUpData.agreeToTerms}
              >
                Create Account
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className="text-travel-blue hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
