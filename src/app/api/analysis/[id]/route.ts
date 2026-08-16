import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { analyzeRepository } from "@/lib/analyzer";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json(
      {
        error: "You are not authenticated with GitHub.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { id } = await params;

    const analysis = await analyzeRepository(
      id,
      session.accessToken
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Repository analysis failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Repository analysis failed.",
      },
      {
        status: 500,
      }
    );
  }
}