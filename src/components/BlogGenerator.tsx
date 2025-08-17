"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "./LoadingSpinner";
import { BlogData } from "@/app/page";

interface BlogGeneratorProps {
  onBlogGenerated: (blog: BlogData) => void;
  onGenerationStart: () => void;
  onGenerationError: () => void;
  isGenerating: boolean;
}

export default function BlogGenerator({
  onBlogGenerated,
  onGenerationStart,
  onGenerationError,
  isGenerating,
}: BlogGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [currentStep, setCurrentStep] = useState<string>("");

  const generateBlog = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic for your blog post");
      return;
    }

    onGenerationStart();
    setCurrentStep("Generating blog content...");

    try {
      // Generate blog content first
      const blogResponse = await fetch("/api/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!blogResponse.ok) {
        throw new Error("Failed to generate blog content");
      }

      const blogData = await blogResponse.json();
      
      setCurrentStep("Generating hero image...");

      // Generate image
      const imageResponse = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      let imageUrl;
      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        imageUrl = imageData.imageUrl;
      } else {
        console.warn("Image generation failed, continuing without image");
        imageUrl = `https://placehold.co/1200x600?text=Blog+Hero+Image+for+${encodeURIComponent(topic.trim().replace(/\s+/g, '+'))}`;
      }

      setCurrentStep("");

      // Combine blog and image data
      const completeBlog: BlogData = {
        title: blogData.title,
        content: blogData.content,
        imageUrl,
        topic: blogData.topic,
      };

      onBlogGenerated(completeBlog);
      setTopic(""); // Clear the input

    } catch (error) {
      console.error("Generation error:", error);
      onGenerationError();
      setCurrentStep("");
      alert("Failed to generate blog post. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isGenerating) {
      generateBlog();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-slate-800">
          What would you like to write about?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isGenerating ? (
          <LoadingSpinner message={currentStep || "Generating your blog post..."} />
        ) : (
          <>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your blog topic (e.g., 'sustainable living', 'digital marketing trends', 'healthy recipes')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-3 px-4"
                disabled={isGenerating}
              />
              
              <Button
                onClick={generateBlog}
                disabled={isGenerating || !topic.trim()}
                className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                Generate Blog Post
              </Button>
            </div>

            <div className="text-sm text-slate-500 space-y-2">
              <p className="font-semibold">✨ What you'll get:</p>
              <ul className="space-y-1 ml-4">
                <li>• SEO-optimized blog post (800-1200 words)</li>
                <li>• Professional hero image</li>
                <li>• Proper HTML formatting</li>
                <li>• Ready to publish content</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}