# 🤝 Contributing to Researcher Campus

Thank you for your interest in contributing to **Researcher Campus**! We welcome contributions from researchers, software engineers, and students worldwide.

---

## 🛠️ Local Development Setup

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/Researcher-Campus.git
   cd Researcher-Campus
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   cp .env.example .env # Configure your environment variables
   npm run dev
   ```

3. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---

## 📐 Coding Conventions & Guidelines

- **TypeScript**: Strict type checking is enforced. Always run `npx tsc --noEmit` before submitting changes.
- **Styling**: Use Vanilla Tailwind CSS utility classes aligned with our light minimal academic theme (`#FAFAFA` background, `#1E3A8A` navy accents, max `4px` border radius). Avoid glowing dark neon styles.
- **Git Commits**: Use semantic commit messages:
  - `feat:` for new features
  - `fix:` for bug resolutions
  - `docs:` for documentation updates
  - `refactor:` for code restructuring without behavioral change

---

## 🧪 Submitting a Pull Request

1. Create a feature branch: `git checkout -b feat/your-feature-name`.
2. Ensure both server and client build without errors:
   - In `server/`: `npx tsc --noEmit`
   - In `client/`: `npm run build`
3. Commit your changes with a descriptive message.
4. Push to your fork and open a Pull Request against the `main` branch.
