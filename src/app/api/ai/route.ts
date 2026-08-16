import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "AI insights service is currently unconfigured. Set GEMINI_API_KEY on the server to enable.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { findingTitle, findingDescription, findingSeverity, repoName, file } = body;

    if (!findingTitle || typeof findingTitle !== "string") {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    // Sanitize input to prevent prompt injection or credential leaking
    const safeRepo = typeof repoName === "string" ? repoName.slice(0, 100).replace(/[^\w.-]/g, "") : "repository";
    const safeTitle = findingTitle.slice(0, 200).replace(/[^\w\s.-]/gi, "");
    const safeDesc = typeof findingDescription === "string" ? findingDescription.slice(0, 500).replace(/[^\w\s.,:;()/-]/gi, "") : "";
    const safeFile = typeof file === "string" ? file.slice(0, 200).replace(/[^\w./-]/gi, "") : "Unknown";
    const safeSeverity = ["High", "Medium", "Low"].includes(findingSeverity) ? findingSeverity : "Medium";

    const prompt = `You are CodeGuard AI, an elite developer security copilot.
Provide a concise, highly actionable security analysis and remediation guidance for this real finding:

Repository: ${safeRepo}
File: ${safeFile}
Severity: ${safeSeverity}
Finding: ${safeTitle}
Details: ${safeDesc}

Structure your response with:
1. **Impact**: Why this matters in 1-2 punchy sentences.
2. **Remediation**: Step-by-step fix recommendation with safe code/configuration patterns.
3. **Prevention**: 1 proactive rule or best practice for CI/CD.

Keep the response technical, precise, and under 200 words. Do not speculate beyond the provided details.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({
      insight: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Keep internal error details on server logs only - never leak to client
    console.error("Gemini AI generation error:", error);
    return NextResponse.json(
      { error: "Unable to generate AI security insight at this time." },
      { status: 500 }
    );
  }
}
