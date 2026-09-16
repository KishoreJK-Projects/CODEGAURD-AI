import { GitHubFile } from "./types";

function getHeaders(accessToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "CodeGuard-AI-Scanner",
  };

  if (accessToken && !accessToken.startsWith("public_user_")) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return headers;
}

export async function getRepository(
  id: string,
  accessToken: string
) {
  const response = await fetch(
    `https://api.github.com/repositories/${id}`,
    {
      headers: getHeaders(accessToken),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Repository not found or GitHub access denied.");
  }

  return response.json();
}

export async function getRepositoryTree(
  fullName: string,
  branch: string,
  accessToken: string
): Promise<GitHubFile[]> {
  const response = await fetch(
    `https://api.github.com/repos/${fullName}/git/trees/${branch}?recursive=1`,
    {
      headers: getHeaders(accessToken),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to fetch repository tree.");
  }

  const data = await response.json();

  return (data.tree || []).map((file: any) => ({
    path: file.path,
    type: file.type,
    size: file.size || 0,
    url: file.url,
  }));
}

export async function getRepositoryContents(
  id: string,
  accessToken: string
) {
  const repository = await getRepository(id, accessToken);

  const files = await getRepositoryTree(
    repository.full_name,
    repository.default_branch,
    accessToken
  );

  return {
    repository,
    files,
  };
}