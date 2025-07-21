import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { generateHTML, generateJSON } from '../utils/generateHTML';
import { 
  Code2, 
  Copy, 
  Download, 
  Eye, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const CodeOutput = ({ fields }) => {
  const [includeTailwind, setIncludeTailwind] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('html');

  const htmlCode = useMemo(() => {
    return generateHTML(fields, { includeTailwind });
  }, [fields, includeTailwind]);

  const jsonCode = useMemo(() => {
    return generateJSON(fields);
  }, [fields]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openPreview = () => {
    // Create a complete HTML document for preview
    const previewHtml = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form Preview</title>
  ${includeTailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
</head>
<body${includeTailwind ? ' class="bg-gray-100 dark:bg-gray-900 min-h-screen py-8"' : ' style="background: #f3f4f6; min-height: 100vh; padding: 2rem 0; margin: 0; font-family: system-ui, -apple-system, sans-serif;"'}>
  ${htmlCode}
</body>
</html>`;
    
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (fields.length === 0) {
    return (
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-muted-foreground mb-2">
            No Code to Display
          </h3>
          <p className="text-sm text-muted-foreground">
            Add some fields to your form to generate HTML and JSON code
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentContent = activeTab === 'html' ? htmlCode : jsonCode;
  const filename = activeTab === 'html' ? 'form.html' : 'form.json';

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code2 className="h-5 w-5" />
          Code Export
        </CardTitle>
        
        {/* Export Options */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="tailwind-toggle"
              checked={includeTailwind}
              onCheckedChange={setIncludeTailwind}
              disabled={activeTab !== 'html'}
            />
            <Label htmlFor="tailwind-toggle" className="text-sm">
              Tailwind Styling
            </Label>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={openPreview}
              disabled={activeTab !== 'html'}
              className="h-8 px-2"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(currentContent, filename)}
              className="h-8 px-2"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(currentContent)}
              className="h-8 px-2"
            >
              {copied ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <TabsContent value="html" className="mt-0">
              <div className="relative">
                <pre className="bg-muted/50 rounded-md p-4 text-xs font-mono overflow-auto max-h-96 border">
                  <code className="text-foreground">{htmlCode}</code>
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="mt-0">
              <div className="relative">
                <pre className="bg-muted/50 rounded-md p-4 text-xs font-mono overflow-auto max-h-96 border">
                  <code className="text-foreground">{jsonCode}</code>
                </pre>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
          <span>
            {fields.length} field{fields.length !== 1 ? 's' : ''} • 
            {currentContent.split('\n').length} lines
          </span>
          {copied && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              Copied to clipboard
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 