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

    // Create a detailed prompt for image generation
    const imagePrompt = `Create a professional, high-quality hero image for a blog post about "${topic}". The image should be:
- Modern and visually appealing
- Suitable for use as a blog header image
- Professional and clean design
- Relevant to the topic of ${topic}
- High resolution and well-composed
- Suitable for web use
- Engaging and eye-catching
Style: Professional, modern, clean, suitable for business/educational content`;

    const response = await fetch("https://oi-server.onrender.com/chat/completions", {
      method: "POST",
      headers: {
        "customerId": "cus_SGPn4uhjPI0F4w",
        "Content-Type": "application/json",
        "Authorization": "Bearer xxx",
      },
      body: JSON.stringify({
        model: "replicate/black-forest-labs/flux-1.1-pro",
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Image API Response Error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid image API response format:", data);
      return NextResponse.json(
        { error: "Invalid response from image generation service" },
        { status: 500 }
      );
    }

    const imageUrl = data.choices[0].message.content;

    // Validate that we received a proper URL
    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
      console.error("Invalid image URL received:", imageUrl);
      return NextResponse.json(
        { error: "Failed to generate valid image URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl: imageUrl.trim(),
      topic,
    });

  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}