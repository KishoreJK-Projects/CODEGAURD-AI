# Phase 2 — added on top of your latest upload

New:
- src/components/ui/RepositoryGraph.tsx — node graph of real category counts
  (source/deps/sensitive/large files) + real flagged files from findings[].
  No fake file tree (the analysis API doesn't return one).
- src/components/ui/ActivityFeed.tsx — recap list derived purely from this
  run's real summary/scores/findings. No persisted/fake history (no DB yet).
- Both wired into src/app/dashboard/[id]/page.tsx, right above the findings section.

Verified: tsc --noEmit clean except src/app/layout.tsx's `geist` import —
that's just missing from this sandbox's node_modules, not a real error.

Still open from the original brief: magnetic-cursor CTA behavior, mobile/
reduced-motion pass, holographic accent details. Say the word and I'll do those next.
- Added keyboard accessibility (role=button, tabIndex, Enter/Space, aria-expanded)
  to the main findings-list expand toggle in dashboard/[id]/page.tsx.
