import { GitHubFile } from "./types";

export function calculateCodeQuality(
  files: GitHubFile[]
): number {

  let score = 100;

  const sourceFiles = files.filter(file =>
    /\.(js|jsx|ts|tsx|java|py|c|cpp|cs)$/i.test(file.path)
  );

  const testFiles = files.filter(file =>
    /(test|spec)\.(js|jsx|ts|tsx|java|py)$/i.test(file.path)
  );

  const readme = files.some(file =>
    file.path.toLowerCase() === "readme.md"
  );

  const gitignore = files.some(file =>
    file.path === ".gitignore"
  );

  if (!readme) score -= 10;

  if (!gitignore) score -= 10;

  if (sourceFiles.length > 0) {

    const ratio = testFiles.length / sourceFiles.length;

    if (ratio < 0.10) score -= 20;
    else if (ratio < 0.25) score -= 10;

  }

  return Math.max(0, Math.min(100, score));

}