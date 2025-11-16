import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";

export default function VendorDocuments() {
  const documents = [
    {
      id: "srs",
      title: "Software Requirements Specification (SRS)",
      description:
        "Complete technical documentation of all platform features, requirements, and specifications.",
      fileSize: "484 KB",
      pages: 20,
      icon: FileText,
      file: "/docs/SRS_TravelConnect.md",
    },
    {
      id: "product",
      title: "Product Description Document",
      description:
        "Comprehensive guide covering all features, capabilities, and benefits for both travelers and vendors.",
      fileSize: "816 KB",
      pages: 30,
      icon: FileText,
      file: "/docs/Product_Descriptions.md",
    },
  ];

  const handleDownload = (filename: string) => {
    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = filename;
    link.download = filename.split("/").pop() || "document.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/vendor-dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div>
            <h1 className="text-4xl font-bold mb-2">Documentation & Guides</h1>
            <p className="text-muted-foreground text-lg">
              Download comprehensive documentation about the TravelConnect
              platform
            </p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Available Documents
                </h3>
                <p className="text-sm text-blue-800">
                  Access detailed documentation about the platform architecture,
                  features, and product capabilities. All documents are
                  available as Markdown files for easy sharing and
                  collaboration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {documents.map((doc) => {
            const IconComponent = doc.icon;
            return (
              <Card
                key={doc.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {doc.description}
                  </p>

                  {/* Document Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-muted-foreground">File Size</p>
                      <p className="font-semibold">{doc.fileSize}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-muted-foreground">Approx. Pages</p>
                      <p className="font-semibold">{doc.pages}</p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    className="w-full bg-travel-blue hover:bg-travel-blue/90"
                    onClick={() => handleDownload(doc.file)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download as Markdown
                  </Button>

                  {/* Preview Link */}
                  <div className="text-xs text-muted-foreground text-center">
                    Files are in Markdown format (.md)
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guidelines Card */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use These Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">SRS Document</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Use this comprehensive technical specification document to
                understand:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• System architecture and design</li>
                <li>• All functional and non-functional requirements</li>
                <li>• Technical specifications and constraints</li>
                <li>• Data models and integration points</li>
                <li>• Testing and deployment procedures</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">
                Product Description Document
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Use this product guide to learn about:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Complete feature overview</li>
                <li>• Traveler capabilities and workflows</li>
                <li>• Vendor tools and management features</li>
                <li>• AI-powered features and benefits</li>
                <li>• Service-specific documentation</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Format Notes</h4>
              <p className="text-sm text-muted-foreground">
                Documents are provided in Markdown format (.md) for maximum
                compatibility and easy conversion to other formats like PDF or
                HTML. You can use any Markdown editor or online converter to
                view or convert these files.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tools Card */}
        <Card className="mt-6 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base">
              Recommended Tools for Viewing/Converting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                • <strong>Online Viewers:</strong> GitHub, GitLab (paste raw
                content)
              </li>
              <li>
                • <strong>Markdown Editors:</strong> VS Code, Sublime Text, Atom
              </li>
              <li>
                • <strong>PDF Converters:</strong> Pandoc, Markdown to PDF,
                Print to PDF
              </li>
              <li>
                • <strong>Note Apps:</strong> Notion, Obsidian (support Markdown
                import)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
