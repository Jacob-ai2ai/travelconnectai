import { RequestHandler } from "express";
import { readFileSync } from "fs";
import { join } from "path";

export const handleDownloadSRS: RequestHandler = async (req, res) => {
  try {
    const format = req.query.format as string;
    
    if (!format || !['pdf', 'docx', 'md', 'txt'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format specified' });
    }

    // Read the markdown file
    const filePath = join(process.cwd(), 'SRS_Traveltheworld_AI.md');
    const markdownContent = readFileSync(filePath, 'utf-8');

    // Set appropriate headers based on format
    const filename = `Traveltheworld-AI-SRS.${format}`;
    
    switch (format) {
      case 'md':
        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(markdownContent);
        break;
        
      case 'txt':
        // Convert markdown to plain text (remove markdown formatting)
        const plainText = markdownContent
          .replace(/#{1,6}\s*/g, '') // Remove headers
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1') // Remove italic
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
          .replace(/```[\s\S]*?```/g, '') // Remove code blocks
          .replace(/`(.*?)`/g, '$1') // Remove inline code
          .replace(/---+/g, '') // Remove horizontal rules
          .replace(/^\s*[-*+]\s+/gm, '• ') // Convert list items
          .replace(/^\s*\d+\.\s+/gm, '• ') // Convert numbered lists
          .replace(/\n{3,}/g, '\n\n'); // Clean up extra newlines
          
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(plainText);
        break;
        
      case 'pdf':
        // For PDF, we'll return the markdown with instructions to use a converter
        // In a real implementation, you'd use a library like puppeteer or similar
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Create a simple HTML version for PDF conversion
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Traveltheworld.ai SRS</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            color: #333;
        }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #2563eb; margin-top: 30px; }
        h3 { color: #4338ca; }
        h4 { color: #059669; }
        code { background: #f3f4f6; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f3f4f6; padding: 15px; border-radius: 5px; overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f3f4f6; font-weight: bold; }
        .requirement { background: #eff6ff; padding: 10px; margin: 5px 0; border-left: 4px solid #2563eb; }
        .section { page-break-before: auto; }
    </style>
</head>
<body>
${markdownContent
  .replace(/#{6}\s*(.*)/g, '<h6>$1</h6>')
  .replace(/#{5}\s*(.*)/g, '<h5>$1</h5>')
  .replace(/#{4}\s*(.*)/g, '<h4>$1</h4>')
  .replace(/#{3}\s*(.*)/g, '<h3>$1</h3>')
  .replace(/#{2}\s*(.*)/g, '<h2>$1</h2>')
  .replace(/#{1}\s*(.*)/g, '<h1>$1</h1>')
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.*?)\*/g, '<em>$1</em>')
  .replace(/`(.*?)`/g, '<code>$1</code>')
  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
  .replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>')
  .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
  .replace(/\n\n/g, '</p><p>')
  .replace(/^([^<])/gm, '<p>$1')
  .replace(/([^>])$/gm, '$1</p>')
  .replace(/<p><\/p>/g, '')
  .replace(/---+/g, '<hr>')
  .replace(/\*\*([^*]+)\*\*:/g, '<div class="requirement"><strong>$1:</strong>')
  .replace(/(\n|^)(FR-\d+|NFR-\d+):/g, '$1<div class="requirement"><strong>$2:</strong>')
  .replace(/<\/strong>([^<]+)(<\/div>)?/g, '</strong>$1</div>')
}
</body>
</html>`;
        
        // In a real app, convert HTML to PDF here
        // For now, we'll send the HTML content
        res.send(htmlContent);
        break;
        
      case 'docx':
        // For DOCX, we'll create a simple HTML version
        // In a real implementation, you'd use a library like docx or similar
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Simple Word-compatible HTML
        const wordHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Traveltheworld.ai SRS</title>
<style>
body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.15; }
h1 { font-size: 18pt; color: #2563eb; }
h2 { font-size: 16pt; color: #2563eb; }
h3 { font-size: 14pt; color: #4338ca; }
h4 { font-size: 12pt; color: #059669; }
.requirement { background-color: #eff6ff; padding: 6pt; margin: 3pt 0; border-left: 3pt solid #2563eb; }
</style>
</head>
<body>
${markdownContent
  .replace(/#{6}\s*(.*)/g, '<h6>$1</h6>')
  .replace(/#{5}\s*(.*)/g, '<h5>$1</h5>')
  .replace(/#{4}\s*(.*)/g, '<h4>$1</h4>')
  .replace(/#{3}\s*(.*)/g, '<h3>$1</h3>')
  .replace(/#{2}\s*(.*)/g, '<h2>$1</h2>')
  .replace(/#{1}\s*(.*)/g, '<h1>$1</h1>')
  .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
  .replace(/\*(.*?)\*/g, '<i>$1</i>')
  .replace(/`(.*?)`/g, '<code>$1</code>')
  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
  .replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>')
  .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
  .replace(/\n\n/g, '</p><p>')
  .replace(/^([^<])/gm, '<p>$1')
  .replace(/([^>])$/gm, '$1</p>')
  .replace(/<p><\/p>/g, '')
  .replace(/---+/g, '<hr>')
  .replace(/(FR-\d+|NFR-\d+):/g, '<div class="requirement"><b>$1:</b>')
  .replace(/<\/b>([^<]+)(<\/div>)?/g, '</b>$1</div>')
}
</body>
</html>`;
        
        res.send(wordHtml);
        break;
        
      default:
        res.status(400).json({ error: 'Unsupported format' });
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to process download' });
  }
};

export const handleDocumentPreview: RequestHandler = async (req, res) => {
  try {
    const filePath = join(process.cwd(), 'SRS_Traveltheworld_AI.md');
    const markdownContent = readFileSync(filePath, 'utf-8');
    
    res.json({
      content: markdownContent,
      metadata: {
        title: "Software Requirements Specification - Traveltheworld.ai",
        version: "1.0",
        lastModified: new Date().toISOString(),
        sections: 11,
        wordCount: markdownContent.split(/\s+/).length,
        characterCount: markdownContent.length
      }
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to load document preview' });
  }
};
