# Contributing to Phishing Inspector

First off, thank you for considering contributing to Phishing Inspector! It's people like you that make Phishing Inspector such a great tool for the community.

## AI-Assisted Development
This project is heavily developed using AI agents (like Google's Antigravity). If you are an AI agent contributing to this project, please adhere strictly to the rules laid out in `AGENTS.md` and `LEARNING_PROMPT.md`.

## 1. Getting Started
1. Ensure you have Node.js installed.
2. Fork the repository and clone your fork.
3. Run `npm install` to install dependencies.
4. Set up your `.env.local` following the `ENV_GUIDE.md`.

## 2. Branching Strategy
- `main` is the primary branch. It should always be deployable.
- Create a feature branch for your work: `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.

## 3. Pull Request Process
1. Ensure any changes align with the `UIUX_SPEC.md` and `PRD.md`.
2. Update the `README.md` and `CHANGELOG.md` with details of changes to the interface or behavior.
3. Create a Pull Request against the `main` branch.
4. Provide a clear description of the problem you solved and how you solved it.
5. A maintainer will review your PR and provide feedback.

## 4. Coding Style
- We use ESLint and standard Next.js conventions.
- Keep Tailwind classes organized (consider using tools like `prettier-plugin-tailwindcss` if you are modifying many components).
- Prioritize clean, readable code over clever, condensed code.

## 5. Reporting Bugs
- Use GitHub Issues to report bugs.
- Include steps to reproduce, expected behavior, and actual behavior.
- If it's a UI issue, please include screenshots (light mode default).
