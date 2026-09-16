import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
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
    let url = "https://api.github.com/user/repos?sort=updated&per_page=100";
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "CodeGuard-AI-App",
    };

    if (session.accessToken.startsWith("public_user_")) {
      const username = session.accessToken.replace("public_user_", "") || "kaisejan";
      url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
    } else {
      headers["Authorization"] = `Bearer ${session.accessToken}`;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Unable to fetch GitHub repositories." },
        { status: response.status }
      );
    }

    const repositories = await response.json();

    const formattedRepositories = Array.isArray(repositories)
      ? repositories.map(
          (repository: {
            id: number;
            name: string;
            full_name: string;
            description: string | null;
            html_url: string;
            language: string | null;
            updated_at: string;
            private: boolean;
          }) => ({
            id: repository.id,
            name: repository.name,
            fullName: repository.full_name,
            description: repository.description,
            url: repository.html_url,
            language: repository.language,
            updatedAt: repository.updated_at,
            private: repository.private || false,
          })
        )
      : [];

    return NextResponse.json({
      repositories: formattedRepositories,
    });
  } catch (error) {
    console.error("GitHub repository fetch failed:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while fetching repositories." },
      { status: 500 }
    );
  }
}