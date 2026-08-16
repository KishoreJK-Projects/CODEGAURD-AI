import { Finding } from "./types";

const SECRET_PATTERNS = [
  {
    name: "GitHub Token",
    regex: /gh[pousr]_[A-Za-z0-9]{36,}/g,
    severity: "High" as const,
  },
  {
    name: "OpenAI API Key",
    regex: /sk-[A-Za-z0-9]{32,}/g,
    severity: "High" as const,
  },
  {
    name: "Google API Key",
    regex: /AIza[0-9A-Za-z-_]{35}/g,
    severity: "High" as const,
  },
  {
    name: "AWS Access Key",
    regex: /AKIA[0-9A-Z]{16}/g,
    severity: "High" as const,
  },
  {
    name: "JWT Secret",
    regex: /(jwt.?secret|secret.?key)\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: "Medium" as const,
  },
  {
    name: "Password",
    regex: /(password|passwd)\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: "High" as const,
  },
];

export async function scanSecrets(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  accessToken: string
): Promise<Finding[]> {

  const findings: Finding[] = [];

  try {

    const response = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const text = await response.text();

    for (const pattern of SECRET_PATTERNS) {

      if (pattern.regex.test(text)) {

        findings.push({
          severity: pattern.severity,
          title: pattern.name,
          description: `${pattern.name} detected in source code.`,
          file: path,
        });

      }

    }

  } catch {}

  return findings;

}