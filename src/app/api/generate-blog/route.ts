import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a professional blog writer and SEO expert. Write a comprehensive, engaging blog post about the given topic. Follow these guidelines:

1. Create an SEO-optimized title that's compelling and includes key terms
2. Structure the content with proper headings (H1, H2, H3)
3. Write 800-1200 words of high-quality, informative content
4. Include an engaging introduction that hooks the reader
5. Create 3-4 main sections with descriptive subheadings
6. End with a compelling conclusion that summarizes key points
7. Use a professional, conversational tone
8. Include relevant keywords naturally throughout
9. Make the content actionable and valuable to readers
10. Format as clean HTML with proper tags

Return ONLY the HTML content without any markdown formatting or code blocks. Use proper HTML tags like <h1>, <h2>, <h3>, <p>, <ul>, <li>, etc.`;

    const response = await fetch("https://oi-server.onrender.com/chat/completions", {
      method: "POST",
      headers: {
        "customerId": "cus_SGPn4uhjPI0F4w",
        "Content-Type": "application/json",
        "Authorization": "Bearer xxx",
      },
      body: JSON.stringify({
        model: "openrouter/anthropic/claude-sonnet-4",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Write a professional blog post about: ${topic}`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("API Response Error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to generate blog content" },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid API response format:", data);
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 500 }
      );
    }

    const content = data.choices[0].message.content;

    // Extract title from the HTML content
    const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : `Blog Post: ${topic}`;

    return NextResponse.json({
      title,
      content,
      topic,
    });

  } catch (error) {
    console.error("Blog generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}