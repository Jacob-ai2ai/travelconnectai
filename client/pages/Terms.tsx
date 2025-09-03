import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-travel-blue hover:text-travel-blue/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-travel-blue to-travel-purple rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
                Travel Connect
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service & Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Terms of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-travel-blue" />
                Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <div>
                <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
                <p className="text-muted-foreground">
                  By accessing and using Travel Connect, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Service Description</h3>
                <p className="text-muted-foreground">
                  Travel Connect is an AI-powered travel booking platform that connects travelers with accommodations, 
                  flights, experiences, and other travel services. We facilitate bookings and provide personalized travel recommendations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. User Accounts</h3>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the confidentiality of your account information and password. 
                  You agree to accept responsibility for all activities that occur under your account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Booking and Payments</h3>
                <p className="text-muted-foreground">
                  All bookings are subject to availability and confirmation. Prices may change without notice. 
                  Payment processing is handled securely through our trusted payment partners.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5. Cancellation Policy</h3>
                <p className="text-muted-foreground">
                  Cancellation policies vary by service provider and booking type. Please review the specific 
                  cancellation terms before completing your booking.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">6. Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  Travel Connect acts as an intermediary between users and service providers. We are not liable for 
                  any issues arising from third-party services booked through our platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-travel-green" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <div>
                <h3 className="font-semibold mb-2">Information We Collect</h3>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create an account, make a booking, 
                  or contact us for support. This includes your name, email address, phone number, and travel preferences.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How We Use Your Information</h3>
                <p className="text-muted-foreground">
                  We use the information we collect to provide, maintain, and improve our services, process transactions, 
                  send you technical notices and support messages, and provide personalized travel recommendations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Information Sharing</h3>
                <p className="text-muted-foreground">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except as 
                  described in this policy. We may share information with service providers who assist us in operating our platform.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Data Security</h3>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cookies and Tracking</h3>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, 
                  and provide personalized content and advertisements.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Your Rights</h3>
                <p className="text-muted-foreground">
                  You have the right to access, update, or delete your personal information. You may also opt out of 
                  certain communications from us. Contact us to exercise these rights.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-travel-purple" />
                Data Protection & GDPR Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <div>
                <h3 className="font-semibold mb-2">GDPR Compliance</h3>
                <p className="text-muted-foreground">
                  For users in the European Union, we comply with the General Data Protection Regulation (GDPR). 
                  You have additional rights including the right to data portability and the right to be forgotten.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Data Retention</h3>
                <p className="text-muted-foreground">
                  We retain your personal information for as long as necessary to provide our services and fulfill 
                  the purposes outlined in this privacy policy, unless a longer retention period is required by law.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">International Transfers</h3>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your information during such transfers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service or Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> legal@travelconnect.ai</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> Travel Connect Legal Department<br />
                123 Innovation Drive<br />
                San Francisco, CA 94105</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link to="/">
            <Button className="bg-travel-blue hover:bg-travel-blue/90">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
