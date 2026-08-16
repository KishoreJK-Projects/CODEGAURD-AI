import { Finding } from "./types";

export function calculateSecurityScore(
  findings: Finding[]
): number {

  let score = 100;

  for (const finding of findings) {

    if (finding.severity === "High")
      score -= 20;

    else if (finding.severity === "Medium")
      score -= 10;

    else
      score -= 3;

  }

  return Math.max(0, score);

}

export function calculateCodeGuardScore(
  securityScore: number,
  qualityScore: number
) {

  return Math.round(
    securityScore * 0.6 +
    qualityScore * 0.4
  );

}