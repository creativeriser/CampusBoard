

## Step 1: Create the folder structure

Inside your `campusboard` project folder, create these nested folders:

```
campusboard/
└── .github/
    └── workflows/
        └── ci.yml
```

You can do this with a terminal command (run from inside your `campusboard` folder):

```bash
mkdir -p .github/workflows
```

The `.github` folder is special — GitHub automatically looks inside `.github/workflows/` for any `.yml` files to run as Actions. Note it starts with a dot (hidden folder on most systems).

## Step 2: Create `ci.yml` with this exact content

Create a new file at `.github/workflows/ci.yml` and paste this in:

```yaml
name: CI

# When this workflow runs:
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Install & Build
    runs-on: ubuntu-latest

    steps:
      # 1. Check out the repo code onto the runner
      - name: Checkout code
        uses: actions/checkout@v4

      # 2. Set up Node.js (match this to your local Node version)
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # 3. Install dependencies exactly as package-lock.json specifies
      - name: Install dependencies
        run: npm ci

      # 4. (Optional) Lint the code - uncomment if you add ESLint later
      # - name: Run ESLint
      #   run: npm run lint

      # 5. Build the app - this is the main check.
      #    If any file has a broken import, syntax error, or missing
      #    dependency, this step fails and the whole workflow goes red.
      - name: Build project
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

A couple of things to be careful about since it's YAML:
- **Indentation matters** — YAML uses spaces (not tabs) to show structure, so keep the indentation exactly as shown
- Save the file with the `.yml` extension, not `.yaml.txt` or anything else your editor might auto-append


## Step 3: Initialize git in your project (if you haven't already)

Open a terminal in your `campusboard` folder:

```bash
cd campusboard
```

Create a `.gitignore` file so you never accidentally commit secrets or bulky folders:

```bash
cat > .gitignore << 'EOF'
node_modules
dist
.env
.DS_Store
EOF
```

This is important to explain to students — `.env` must never be pushed to GitHub since it holds your real Supabase keys.

## Step 4: Create the GitHub repo and push your code


```bash
git add .
git commit -m "Initial commit - CampusBoard project with CI workflow"
git push -u origin main
```

Refresh the GitHub page — your files (including `.github/workflows/ci.yml`) should now be there.

## Step 3: Add your Supabase keys as encrypted secrets

1. On your repo's GitHub page, click **Settings** (top tab)
2. In the left sidebar: **Secrets and variables → Actions**
3. Click the green **New repository secret** button
4. Add the first one:
   - **Name:** `VITE_SUPABASE_URL`
   - **Secret:** paste your project URL (e.g. `https://jbjvlsewyncvfsygvyfx.supabase.co`)
   - Click **Add secret**
5. Click **New repository secret** again, add the second:
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Secret:** paste your anon/publishable key
   - Click **Add secret**

You should now see both listed (values hidden) under Repository secrets.

## Step 4: Trigger the workflow

Since your push in Step 2 already went to `main`, the workflow should have already started running. Check it:

1. Click the **Actions** tab on your repo
2. You should see a workflow run listed, named after your commit message
3. Click into it → click the **build** job → watch each step expand and run live (checkout → setup Node → install → build)
4. A green checkmark ✅ means everything passed

If you pushed *before* adding the secrets, just push any small change now (or click **Re-run all jobs** in the Actions tab) so it runs again with the secrets available.

## Step 5: Demo a failure (great for class)

To show students what a broken build looks like:

```bash
# deliberately break something
echo "this is not valid javascript {{{" >> src/App.jsx

git add .
git commit -m "test: intentionally break the build"
git push
```

Go back to the **Actions** tab — this run should show a red ✗. Click into it, click the failing **build** step, and show the class the exact error message pinpointing the problem. Then fix it:

```bash
git revert HEAD
git push
```

Watch it go green again.

## Step 6 (optional, good "what's next" topic): Require CI before merging

1. **Settings → Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Check **Require status checks to pass before merging**
5. Search for and select your CI job (it'll show up as **build** once it's run at least once)
6. Save

> Now, if a user opens a pull request with broken code, GitHub will physically block the "Merge" button until CI turns green — a good real-world illustration of how teams actually enforce code quality.

---
