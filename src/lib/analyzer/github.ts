import { GitHubFile } from "./types";

export async function getRepository(
  id: string,
  accessToken: string
) {
  const response = await fetch(
    `https://api.github.com/repositories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
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
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
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