# Vercel Project Linkage

Story Atlas is linked to Vercel through `.vercel/project.json`.

## Linked Project
- Project name: `story-atlas`
- Project ID: `prj_4d3S2Ll3939zDZbF7lVWIAEJKNmE`
- Linked `orgId`: `team_S4VpOXzLYuqMsfPFdfLW5gz5`
- Vercel scope slug for API/plugin calls: `sathyaprasad`
- Dashboard scope shown in deployment URLs: `sathyas-projects-9550cf42`

## Important
- Keep `.vercel/project.json` using the internal `team_...` `orgId`; this is the format Vercel project linking expects.
- When using Vercel plugin/API tools that ask for `teamId`, use the scope slug `sathyaprasad`.
- Do not replace `.vercel/project.json` `orgId` with `sathyaprasad`; that slug is for API/tool calls, not the project-link artifact.
