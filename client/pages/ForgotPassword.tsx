import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Shield, Eye, EyeOff, CheckCircle } from "lucide-react";

type Step = "request" | "verify" | "reset" | "success";

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState<Step>("request");
  const [contactMethod, setContactMethod] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to check if email/phone is registered
    setTimeout(() => {
      // TODO: Replace with actual API call
      const isRegistered = true; // Simulate registration check
      
      if (isRegistered) {
        setCurrentStep("verify");
        console.log(`OTP sent to ${contactMethod}`);
        // TODO: Send actual OTP
      } else {
        alert("This email/phone number is not registered. Please sign up first.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      // TODO: Replace with actual OTP verification
      const isValidOTP = otp === "123456"; // Simulate OTP verification
      
      if (isValidOTP) {
        setCurrentStep("reset");
      } else {
        alert("Invalid OTP. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const passwordRequirements = validatePassword(newPassword);
    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
    
    if (!isPasswordValid) {
      alert("Password doesn't meet requirements!");
      return;
    }

    setIsLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      // TODO: Replace with actual password reset API call
      console.log("Password reset successfully");
      setCurrentStep("success");
      setIsLoading(false);
    }, 1000);
  };

  const resendOTP = () => {
    console.log(`Resending OTP to ${contactMethod}`);
    // TODO: Implement OTP resend
  };

  const passwordRequirements = validatePassword(newPassword);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-travel-blue hover:text-travel-blue/80 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-travel-blue to-travel-purple rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
              Travel Connect
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {currentStep === "request" && "Reset Your Password"}
              {currentStep === "verify" && "Verify Your Identity"}
              {currentStep === "reset" && "Create New Password"}
              {currentStep === "success" && "Password Reset Complete"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Request OTP */}
            {currentStep === "request" && (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Enter your registered email or phone number to receive a verification code.
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact">Email or Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="contact"
                      type="text"
                      placeholder="Enter your email or phone number"
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="pl-10"
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {contactMethod.includes('@') ? (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-travel-blue hover:bg-travel-blue/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>

                <div className="text-center">
                  <Link to="/" className="text-sm text-travel-blue hover:underline">
                    Remember your password? Sign in
                  </Link>
                </div>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {currentStep === "verify" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  We've sent a verification code to{" "}
                  <span className="font-medium">{contactMethod}</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-travel-blue hover:bg-travel-blue/90"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendOTP}
                    className="text-sm text-travel-blue hover:underline"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("request")}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Change email/phone number
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {currentStep === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Create a new password for your account.
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  {newPassword && (
                    <div className="text-xs space-y-1 mt-2">
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
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-600">Passwords don't match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-travel-blue hover:bg-travel-blue/90"
                  disabled={isLoading || !isPasswordValid || newPassword !== confirmPassword}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}

            {/* Step 4: Success */}
            {currentStep === "success" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Password Reset Successfully!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your password has been updated. You can now sign in with your new password.
                  </p>
                </div>
                <Link to="/">
                  <Button className="w-full bg-travel-blue hover:bg-travel-blue/90">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
