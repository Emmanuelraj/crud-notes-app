# CI/CD Process for `crud-notes-app`

## Workflow Overview
We have implemented a **CI/CD pipeline using GitHub Actions** to automate testing and deployment to Render. The workflow ensures that any changes pushed to `main` are built, verified, and automatically deployed.

---

## Branch Strategy
- **Main branch (`main`)**: Only merged changes trigger **CI + CD**, which will deploy the app to Render.  
- **Feature branches (`feature/**`)**: Used for development and testing.  
  - CI runs automatically on push and PRs targeting `main`.  
  - Deployment to Render only happens when merged into `main`.  

---

## GitHub Actions Workflow (`.github/workflows/ci-cd.yml`)
- **Triggers**:  
  - `push` to `main` → Runs CI + CD  
  - `pull_request` targeting `main` → Runs CI  
- **Jobs**:
  1. **Build**  
     - Runs on `ubuntu-latest`  
     - Node.js version matrix: 18 and 22  
     - Installs dependencies (`npm install`)  
     - Generates Prisma client (`npx prisma generate`)  
     - Runs placeholder tests (optional)  
  2. **Deploy to Render**  
     - Uses the `RENDER_API_KEY` stored in GitHub Secrets  
     - Calls Render API to trigger a deployment for the configured service  

---

## GitHub Settings
1. **Secrets**  
   - `RENDER_API_KEY`: Render API token stored in GitHub Secrets. This is used by the workflow to deploy automatically.  
2. **Branch Protection (optional)**  
   - Can enforce PR reviews and require CI checks to pass before merging to `main`.  

---

## CI/CD Flow Summary
1. Developer pushes changes to a feature branch.  
2. GitHub Actions runs **CI steps**: install dependencies, generate Prisma client, run tests.  
3. Developer opens a PR targeting `main`.  
4. CI runs again on PR to validate code.  
5. After merge into `main`, **CD step** triggers:  
   - The app is automatically deployed to Render using the Render API.  
6. Status indicators in GitHub Actions show success/failure:  
   - 🟢 Green = success  
   - 🔴 Red = failure  

---

## Notes
- Feature branches are used for testing CI without deploying.  
- Only merges to `main` trigger deployment (CD).  
- Workflow can be monitored under the **Actions tab** in GitHub.  
- Optional: Add a **badge** to `README.md` to show CI/CD status.
