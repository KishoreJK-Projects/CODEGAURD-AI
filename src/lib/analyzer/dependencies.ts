import { Finding, GitHubFile } from "./types";

const MANIFESTS = [
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "requirements.txt",
  "Pipfile",
  "poetry.lock",
  "pom.xml",
  "build.gradle",
  "Cargo.toml",
  "go.mod",
  "composer.json",
];

export function analyzeDependencies(
  files: GitHubFile[]
): Finding[] {

  const findings: Finding[] = [];

  const manifests = files.filter(file =>
    MANIFESTS.some(name => file.path.endsWith(name))
  );

  if (manifests.length === 0) {
    findings.push({
      severity: "Medium",
      title: "Dependency Manifest Missing",
      description:
        "No supported dependency manifest was found.",
    });

    return findings;
  }

  const lockFiles = manifests.filter(file =>
    file.path.endsWith("package-lock.json") ||
    file.path.endsWith("pnpm-lock.yaml") ||
    file.path.endsWith("yarn.lock") ||
    file.path.endsWith("poetry.lock")
  );

  if (lockFiles.length === 0) {
    findings.push({
      severity: "Low",
      title: "No Lock File",
      description:
        "Dependency lock file is missing. Builds may not be reproducible.",
    });
  }

  return findings;
}