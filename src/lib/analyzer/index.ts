import { AnalysisResult, Finding } from "./types";
import { getRepositoryContents } from "./github";
import { scanSecrets } from "./secrets";
import { analyzeDependencies } from "./dependencies";
import { analyzeSecurity } from "./security";
import {
  calculateSecurityScore,
  calculateCodeGuardScore,
} from "./scoring";
import { calculateCodeQuality } from "./quality";

export async function analyzeRepository(
  id: string,
  accessToken: string
): Promise<AnalysisResult> {

  const { repository, files } =
    await getRepositoryContents(id, accessToken);

  const findings: Finding[] = [];

  findings.push(...analyzeDependencies(files));

  findings.push(...analyzeSecurity(files));

  const owner = repository.owner.login;
  const repo = repository.name;
  const branch = repository.default_branch;

  const sourceFiles = files.filter(file =>
    file.type === "blob" &&
    /\.(js|jsx|ts|tsx|java|py|c|cpp|cs)$/i.test(file.path)
  );

  for (const file of sourceFiles.slice(0, 30)) {

    const secretFindings =
      await scanSecrets(
        owner,
        repo,
        branch,
        file.path,
        accessToken
      );

    findings.push(...secretFindings);

  }

  const securityScore =
    calculateSecurityScore(findings);

  const codeQuality =
    calculateCodeQuality(files);

  const codeGuardScore =
    calculateCodeGuardScore(
      securityScore,
      codeQuality
    );

  return {

    repository: {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
    },

    summary: {

      totalFiles: files.length,

      sourceFiles: sourceFiles.length,

      dependencyFiles:
        files.filter(file =>
          /(package\.json|pom\.xml|requirements\.txt)/i.test(file.path)
        ).length,

      sensitiveFiles:
        findings.filter(f => f.severity === "High").length,

      largeFiles:
        files.filter(
          file =>
            file.type === "blob" &&
            file.size > 5 * 1024 * 1024
        ).length,

    },

    scores: {
      codeGuardScore,
      securityScore,
      codeQuality,
    },

    findings,

  };

}