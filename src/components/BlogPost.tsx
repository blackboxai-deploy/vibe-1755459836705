"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogData } from "@/app/page";

interface BlogPostProps {
  blog: BlogData;
}

export default function BlogPost({ blog }: BlogPostProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${blog.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
        h1 { color: #2d3748; margin-bottom: 0.5rem; }
        h2 { color: #4a5568; margin-top: 2rem; margin-bottom: 1rem; }
        h3 { color: #718096; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        p { margin-bottom: 1rem; }
        ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
        li { margin-bottom: 0.5rem; }
    </style>
</head>
<body>
    ${blog.imageUrl ? `<img src="${blog.imageUrl}" alt="${blog.title}" />` : ''}
    ${blog.content}
</body>
</html>`;

    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy to clipboard");
    }
  };

  const downloadAsHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${blog.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
        h1 { color: #2d3748; margin-bottom: 0.5rem; }
        h2 { color: #4a5568; margin-top: 2rem; margin-bottom: 1rem; }
        h3 { color: #718096; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        p { margin-bottom: 1rem; }
        ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
        li { margin-bottom: 0.5rem; }
    </style>
</head>
<body>
    ${blog.imageUrl ? `<img src="${blog.imageUrl}" alt="${blog.title}" />` : ''}
    ${blog.content}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${blog.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge variant="secondary" className="text-sm">
              Topic: {blog.topic}
            </Badge>
            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                {copied ? "Copied!" : "Copy HTML"}
              </Button>
              <Button
                onClick={downloadAsHtml}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <article className="prose prose-slate max-w-none">
            {blog.imageUrl && (
              <div className="mb-8">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Generate Another Blog Post
        </Button>
      </div>
    </div>
  );
}