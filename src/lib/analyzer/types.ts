export type GitHubFile = {
  path: string;
  type: string;
  size: number;
  url?: string;
};

export type Finding = {
  severity: "High" | "Medium" | "Low";
  title: string;
  description: string;
  file?: string;
};

export type RepositorySummary = {
  totalFiles: number;
  sourceFiles: number;
  dependencyFiles: number;
  sensitiveFiles: number;
  largeFiles: number;
};

export type Scores = {
  codeGuardScore: number;
  securityScore: number;
  codeQuality: number;
};

export type AnalysisResult = {
  repository: {
    id: number;
    name: string;
    fullName: string;
  };

  summary: RepositorySummary;

  scores: Scores;

  findings: Finding[];
};