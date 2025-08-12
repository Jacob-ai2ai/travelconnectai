import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  FileText,
  FileDown,
  Eye,
  Calendar,
  FileCheck,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DocumentDownload() {
  const [downloadFormat, setDownloadFormat] = useState("pdf");

  const handleDownload = async (format: string) => {
    try {
      const response = await fetch(`/api/download-srs?format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Traveltheworld-AI-SRS.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Download failed. Please try again.");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    }
  };

  const documentInfo = {
    title: "Software Requirements Specification (SRS)",
    subtitle: "Traveltheworld.ai Platform",
    version: "1.0",
    date: "December 2024",
    pages: "45+",
    sections: 11,
    requirements: "200+",
    fileSize: "2.5 MB",
  };

  const keyFeatures = [
    {
      icon: Zap,
      title: "Comprehensive Coverage",
      description: "150+ functional requirements covering all platform features",
    },
    {
      icon: Shield,
      title: "Technical Specifications",
      description: "Complete system architecture and security requirements",
    },
    {
      icon: Users,
      title: "Stakeholder Ready",
      description: "Professional format for developers, investors, and management",
    },
    {
      icon: FileCheck,
      title: "Compliance Standards",
      description: "GDPR, PCI DSS, and industry standard compliance guidelines",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-travel-blue to-travel-purple rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
              SRS Document
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Document Overview */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              📄 Technical Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {documentInfo.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Complete technical specifications and requirements for the{" "}
              <span className="bg-gradient-to-r from-travel-blue to-travel-purple bg-clip-text text-transparent">
                Traveltheworld.ai
              </span>{" "}
              platform
            </p>
          </div>

          {/* Document Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-travel-blue mb-1">
                  {documentInfo.pages}
                </div>
                <div className="text-sm text-muted-foreground">Pages</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-travel-green mb-1">
                  {documentInfo.sections}
                </div>
                <div className="text-sm text-muted-foreground">Sections</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-travel-purple mb-1">
                  {documentInfo.requirements}
                </div>
                <div className="text-sm text-muted-foreground">Requirements</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-travel-orange mb-1">
                  {documentInfo.version}
                </div>
                <div className="text-sm text-muted-foreground">Version</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Download Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Document Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Document Type:</span>
                  <span className="font-medium">
                    Software Requirements Specification
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium">{documentInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {documentInfo.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="font-medium">{documentInfo.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="font-medium">English</span>
                </div>
              </CardContent>
            </Card>

            {/* Download Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Download Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    onClick={() => handleDownload("pdf")}
                    className="w-full justify-start bg-red-600 hover:bg-red-700"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download PDF (Recommended)
                  </Button>
                  <Button
                    onClick={() => handleDownload("docx")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Word Document (.docx)
                  </Button>
                  <Button
                    onClick={() => handleDownload("md")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Markdown (.md)
                  </Button>
                  <Button
                    onClick={() => handleDownload("txt")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Text File (.txt)
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="ghost" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Document Online
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              What's Included in This Document
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {keyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-travel-blue/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-travel-blue" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Document Sections */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Document Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-blue rounded-full"></div>
                    <span className="text-sm">1. Introduction & Overview</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-blue rounded-full"></div>
                    <span className="text-sm">2. System Overview</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-blue rounded-full"></div>
                    <span className="text-sm">3. Functional Requirements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-blue rounded-full"></div>
                    <span className="text-sm">4. Non-Functional Requirements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-blue rounded-full"></div>
                    <span className="text-sm">5. System Architecture</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-blue rounded-full"></div>
                    <span className="text-sm">6. User Interface Requirements</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-purple rounded-full"></div>
                    <span className="text-sm">7. Data Requirements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-purple rounded-full"></div>
                    <span className="text-sm">8. Integration Requirements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-purple rounded-full"></div>
                    <span className="text-sm">9. Security Requirements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-purple rounded-full"></div>
                    <span className="text-sm">10. Performance Requirements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-travel-purple rounded-full"></div>
                    <span className="text-sm">11. Appendices</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-travel-green/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-travel-green" />
                  </div>
                  <h4 className="font-semibold mb-1">For Developers</h4>
                  <p className="text-sm text-muted-foreground">
                    Implementation guidelines and technical specifications
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-travel-orange/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-travel-orange" />
                  </div>
                  <h4 className="font-semibold mb-1">For Stakeholders</h4>
                  <p className="text-sm text-muted-foreground">
                    Business requirements and project scope overview
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-travel-purple/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FileCheck className="h-6 w-6 text-travel-purple" />
                  </div>
                  <h4 className="font-semibold mb-1">For QA Teams</h4>
                  <p className="text-sm text-muted-foreground">
                    Testing requirements and acceptance criteria
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
