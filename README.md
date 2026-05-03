# DevsClub Web — Nuxt Migration

This repository contains the migration of the DevsClub website from Next.js to Nuxt 3.

Built using:
- Vue 3
- Nuxt 3
- TypeScript
- pnpm
- Husky
- Commitlint
- Prettier

---

# Tech Stack

| Technology | Purpose |
|---|---|
| Nuxt 3 | Full-stack Vue framework |
| Vue 3 | Frontend framework |
| TypeScript | Type safety |
| pnpm | Package manager |
| Husky | Git hooks |
| Commitlint | Commit message enforcement |
| Prettier | Code formatting |
| lint-staged | Staged file formatting |

---

# Project Setup

## Clone Repository

```bash
git clone <repo-url>
cd vue-migration
```

---

# Install Dependencies

Using pnpm:

```bash
pnpm install
```

During installation, pnpm may ask to approve build scripts.

Run:

```bash
pnpm approve-builds
```

Approve:
- `esbuild`
- `@parcel/watcher`

---

# Development Server

Start the local development server:

```bash
pnpm dev
```

Application runs on:

```text
http://localhost:3000
```

---

# Production Build

Build the application for production:

```bash
pnpm build
```

Preview production build locally:

```bash
pnpm preview
```

---

# Code Quality & Git Hooks

This project uses:
- Husky
- Commitlint
- Prettier
- lint-staged

to maintain clean commits and consistent formatting.

---

# Commit Message Convention

All commits must follow the Conventional Commits format:

```text
type: message
```

Examples:

```bash
git commit -m "feat: add authentication flow"
git commit -m "fix: resolve navbar overflow"
git commit -m "chore: configure husky"
```

Allowed commit types:

- feat
- fix
- chore
- docs
- style
- refactor
- perf
- test
- build
- ci
- revert

---

# Branch Naming Convention

Branch names must follow:

```text
type/branch-name
```

Examples:

```text
feature/auth-system
fix/mobile-navbar
chore/husky-setup
refactor/api-cleanup
```

Allowed branch prefixes:

- feature
- fix
- chore
- docs
- refactor
- style
- test

---

# Protected Branch Rules

Direct pushes to `main` are blocked locally using Husky hooks.

Please create feature branches and open Pull Requests instead.

Example workflow:

```bash
git checkout -b feature/login-page
git commit -m "feat: add login page"
git push origin feature/login-page
```

---

# Formatting

Format the project manually:

```bash
pnpm format
```

Prettier automatically formats staged files during commits.

---

# Linting

Run lint checks:

```bash
pnpm lint
```

---

# Recommended VS Code Extensions

- Vue - Official
- Prettier
- ESLint
- Tailwind CSS IntelliSense

---

# Deployment

Nuxt supports deployment on:
- VPS
- Docker
- Vercel
- Netlify
- Cloudflare
- Node servers

Build output is generated inside:

```text
.output/
```

---

# Learn More

- Nuxt Documentation: https://nuxt.com/docs
- Vue Documentation: https://vuejs.org
- pnpm Documentation: https://pnpm.io
- Husky Documentation: https://typicode.github.io/husky
- Commitlint Documentation: https://commitlint.js.org