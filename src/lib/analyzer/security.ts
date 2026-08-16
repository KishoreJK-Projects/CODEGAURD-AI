import { Finding, GitHubFile } from "./types";

const SENSITIVE_PATTERNS = [
  /\.env$/i,
  /\.pem$/i,
  /\.key$/i,
  /\.p12$/i,
  /\.pfx$/i,
  /\.crt$/i,
  /\.cer$/i,
  /\.jks$/i,
  /id_rsa$/i,
  /id_dsa$/i,
  /secret/i,
  /password/i,
  /credential/i,
  /private/i,
  /backup/i,
  /\.bak$/i,
  /\.sql$/i,
  /\.db$/i,
  /\.sqlite$/i,
];

export function analyzeSecurity(
  files: GitHubFile[]
): Finding[] {

  const findings: Finding[] = [];

  for (const file of files) {

    if (
      SENSITIVE_PATTERNS.some(pattern =>
        pattern.test(file.path)
      )
    ) {

      findings.push({
        severity: "High",
        title: "Sensitive File Found",
        description: `${file.path} may contain confidential information.`,
        file: file.path,
      });

    }

    if (
      file.type === "blob" &&
      file.size > 5 * 1024 * 1024
    ) {

      findings.push({
        severity: "Low",
        title: "Large File",
        description: `${file.path} is larger than 5 MB.`,
        file: file.path,
      });

    }

  }

  return findings;

}