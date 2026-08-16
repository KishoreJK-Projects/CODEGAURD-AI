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
    const response = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch GitHub repositories." },
        { status: response.status }
      );
    }

    const repositories = await response.json();

    const formattedRepositories = repositories.map(
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
        private: repository.private,
      })
    );

    return NextResponse.json({
      repositories: formattedRepositories,
    });
  } catch (error) {
    console.error("GitHub repository fetch failed:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}