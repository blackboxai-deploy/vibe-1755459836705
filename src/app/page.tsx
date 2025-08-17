"use client";

import { useState } from "react";
import BlogGenerator from "@/components/BlogGenerator";
import BlogPost from "@/components/BlogPost";

export interface BlogData {
  title: string;
  content: string;
  imageUrl?: string;
  topic: string;
}

export default function Home() {
  const [generatedBlog, setGeneratedBlog] = useState<BlogData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBlogGenerated = (blog: BlogData) => {
    setGeneratedBlog(blog);
    setIsGenerating(false);
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
    setGeneratedBlog(null);
  };

  const handleGenerationError = () => {
    setIsGenerating(false);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          AI Blog Generator
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Enter any topic and our AI will create a professional blog post with a custom hero image.
          Perfect for content creators, marketers, and bloggers.
        </p>
      </div>

      <div className="space-y-8">
        <BlogGenerator
          onBlogGenerated={handleBlogGenerated}
          onGenerationStart={handleGenerationStart}
          onGenerationError={handleGenerationError}
          isGenerating={isGenerating}
        />

        {generatedBlog && (
          <BlogPost blog={generatedBlog} />
        )}
      </div>
    </main>
  );
}