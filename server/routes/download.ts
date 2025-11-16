import { RequestHandler } from "express";
import { readFileSync } from "fs";
import { join } from "path";
import PDFDocument from "pdfkit";

type DocumentType = "srs" | "product";

const getDocumentPath = (type: DocumentType): string => {
  if (type === "product") {
    return join(process.cwd(), "docs/Product_Descriptions.md");
  }
  return join(process.cwd(), "SRS_TravelConnect.md");
};

const getDocumentMetadata = (type: DocumentType) => {
  if (type === "product") {
    return {
      title: "Product Descriptions - TravelConnect",
      filename: "TravelConnect-Product-Descriptions",
    };
  }
  return {
    title: "Software Requirements Specification - TravelConnect",
    filename: "TravelConnect-SRS",
  };
};

const generatePDF = (
  content: string,
  metadata: { title: string; filename: string }
): Buffer => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      bufferPages: true,
      margin: 50,
    });

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Parse markdown and add to PDF
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeContent = "";

    doc.fontSize(24).font("Helvetica-Bold").text(metadata.title, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica").text(`Generated: ${new Date().toLocaleDateString()}`, {
      align: "center",
    });
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    for (const line of lines) {
      // Handle code blocks
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          if (codeContent) {
            doc.fontSize(9).font("Courier").text(codeContent, {
              align: "left",
              width: 445,
            });
            codeContent = "";
          }
          doc.moveDown(0.3);
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        continue;
      }

      // Handle headings
      if (line.startsWith("# ")) {
        doc.moveDown(0.3);
        doc.fontSize(18).font("Helvetica-Bold").text(line.substring(2), { align: "left" });
        doc.moveDown(0.2);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.3);
        continue;
      }

      if (line.startsWith("## ")) {
        doc.moveDown(0.3);
        doc.fontSize(14).font("Helvetica-Bold").text(line.substring(3), { align: "left" });
        doc.moveDown(0.2);
        continue;
      }

      if (line.startsWith("### ")) {
        doc.moveDown(0.2);
        doc.fontSize(12).font("Helvetica-Bold").text(line.substring(4), { align: "left" });
        doc.moveDown(0.1);
        continue;
      }

      if (line.startsWith("#### ")) {
        doc.moveDown(0.1);
        doc.fontSize(11).font("Helvetica-Bold").text(line.substring(5), { align: "left" });
        doc.moveDown(0.05);
        continue;
      }

      // Handle horizontal rules
      if (line.match(/^-{3,}$|^_{3,}$|\*{3,}/)) {
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.3);
        continue;
      }

      // Handle bullet points
      if (line.match(/^[-*+]\s/)) {
        const text = line.substring(2);
        doc.fontSize(10).font("Helvetica").text(`• ${text}`, { align: "left", width: 425 });
        doc.moveDown(0.1);
        continue;
      }

      // Handle numbered lists
      if (line.match(/^\d+\.\s/)) {
        const match = line.match(/^(\d+\.\s)(.*)$/);
        if (match) {
          doc.fontSize(10).font("Helvetica").text(`${match[1]}${match[2]}`, {
            align: "left",
            width: 425,
          });
          doc.moveDown(0.1);
        }
        continue;
      }

      // Handle bold and italic text in regular content
      if (line.trim()) {
        const processedLine = line
          .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold markers
          .replace(/\*([^*]+)\*/g, "$1") // Remove italic markers
          .replace(/`([^`]+)`/g, "$1"); // Remove inline code markers

        if (processedLine.trim()) {
          doc.fontSize(10).font("Helvetica").text(processedLine, {
            align: "left",
            width: 445,
          });
          doc.moveDown(0.05);
        }
      } else {
        doc.moveDown(0.15);
      }
    }

    doc.end();
  });
};

export const handleDownloadSRS: RequestHandler = async (req, res) => {
  try {
    const format = req.query.format as string;
    const documentType = (req.query.document as DocumentType) || "srs";

    if (!format || !["pdf", "docx", "md", "txt"].includes(format)) {
      return res.status(400).json({ error: "Invalid format specified" });
    }

    if (!["srs", "product"].includes(documentType)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    const filePath = getDocumentPath(documentType);
    const metadata = getDocumentMetadata(documentType);
    const markdownContent = readFileSync(filePath, "utf-8");

    const filename = `${metadata.filename}.${format}`;

    switch (format) {
      case "md":
        res.setHeader("Content-Type", "text/markdown");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(markdownContent);
        break;

      case "txt":
        const plainText = markdownContent
          .replace(/#{1,6}\s*/g, "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/\[(.*?)\]\(.*?\)/g, "$1")
          .replace(/```[\s\S]*?```/g, "")
          .replace(/`(.*?)`/g, "$1")
          .replace(/---+/g, "")
          .replace(/^\s*[-*+]\s+/gm, "• ")
          .replace(/^\s*\d+\.\s+/gm, "• ")
          .replace(/\n{3,}/g, "\n\n");

        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(plainText);
        break;

      case "pdf":
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        try {
          const pdfBuffer = await generatePDF(markdownContent, metadata);
          res.send(pdfBuffer);
        } catch (pdfError) {
          console.error("PDF generation error:", pdfError);
          res.status(500).json({ error: "Failed to generate PDF" });
        }
        break;

      case "docx":
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        const wordHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${metadata.title}</title>
<style>
body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.15; color: #000; }
h1 { font-size: 18pt; color: #2563eb; margin-top: 12pt; margin-bottom: 6pt; font-weight: bold; }
h2 { font-size: 14pt; color: #2563eb; margin-top: 12pt; margin-bottom: 6pt; font-weight: bold; }
h3 { font-size: 12pt; color: #4338ca; margin-top: 10pt; margin-bottom: 4pt; font-weight: bold; }
h4 { font-size: 11pt; color: #059669; margin-top: 8pt; margin-bottom: 4pt; font-weight: bold; }
p { margin: 0 0 6pt 0; }
ul, ol { margin: 6pt 0 6pt 36pt; }
li { margin-bottom: 3pt; }
code { font-family: 'Courier New'; font-size: 10pt; background-color: #f3f4f6; }
strong { font-weight: bold; }
em { font-style: italic; }
</style>
</head>
<body>
<p style="text-align: center; font-size: 18pt; font-weight: bold; color: #2563eb; margin-bottom: 12pt;">${metadata.title}</p>
${markdownContent
  .replace(/#{4}\s*(.*)/g, "<h4>$1</h4>")
  .replace(/#{3}\s*(.*)/g, "<h3>$1</h3>")
  .replace(/#{2}\s*(.*)/g, "<h2>$1</h2>")
  .replace(/#{1}\s*(.*)/g, "<h1>$1</h1>")
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.*?)\*/g, "<em>$1</em>")
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/^\s*[-*+]\s+(.*)/gm, "<li>$1</li>")
  .replace(/(<li>.*?<\/li>)/gs, "<ul>$&</ul>")
  .replace(/<\/ul>\s*<ul>/g, "")
  .replace(/^\s*\d+\.\s+(.*)/gm, "<li>$1</li>")
  .replace(/\n\n+/g, "</p><p>")
  .replace(/^(?!<[hou])/gm, "<p>")
  .replace(/(?<![>p])\n/gm, "<br/>")
  .replace(/<p><\/p>/g, "")}
</body>
</html>`;

        res.send(wordHtml);
        break;

      default:
        res.status(400).json({ error: "Unsupported format" });
    }
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to process download" });
  }
};

export const handleDocumentPreview: RequestHandler = async (req, res) => {
  try {
    const documentType = (req.query.document as DocumentType) || "srs";

    if (!["srs", "product"].includes(documentType)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    const filePath = getDocumentPath(documentType);
    const metadata = getDocumentMetadata(documentType);
    const markdownContent = readFileSync(filePath, "utf-8");

    res.json({
      content: markdownContent,
      metadata: {
        title: metadata.title,
        version: "1.0",
        lastModified: new Date().toISOString(),
        wordCount: markdownContent.split(/\s+/).length,
        characterCount: markdownContent.length,
      },
    });
  } catch (error) {
    console.error("Preview error:", error);
    res.status(500).json({ error: "Failed to load document preview" });
  }
};
