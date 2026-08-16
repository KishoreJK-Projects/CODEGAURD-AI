import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "You are not authenticated with GitHub." },
      { status: 401 }
    );
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured.");

      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(
      "Say hello to CodeGuard AI in one short sentence."
    );

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      message: "Gemini connection successful",
      response: text,
    });

  } catch (error) {
    console.error("Gemini connection test failed:", error);

    return NextResponse.json(
      { success: false, error: "Gemini connection failed." },
      { status: 500 }
    );
  }
}
