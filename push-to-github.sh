#!/usr/bin/env bash
# Pushes this folder to A-Pag-org/PMO-DASHBOARD-PHASE-3 (branch main).
# Run from inside the extracted "react" folder:  bash push-to-github.sh
set -euo pipefail

REPO="https://github.com/A-Pag-org/PMO-DASHBOARD-PHASE-3.git"
BRANCH="main"
MSG="${1:-React port of Delhi NCR clean air dashboards}"

[ -f package.json ] || { echo "Run this from inside the extracted react/ folder."; exit 1; }

cat > .gitignore <<'EOF'
node_modules/
dist/
.DS_Store
EOF

if [ ! -d .git ]; then
  git init -q
  git remote add origin "$REPO"
else
  git remote set-url origin "$REPO" 2>/dev/null || git remote add origin "$REPO"
fi

git checkout -q -B "$BRANCH"
git add -A
git commit -q -m "$MSG" || echo "Nothing new to commit."

# If the remote already has history, rebase onto it first.
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  git fetch -q origin "$BRANCH"
  git rebase -q "origin/$BRANCH" || {
    echo "Rebase hit conflicts — resolve them, then: git rebase --continue && git push origin $BRANCH"; exit 1; }
fi

git push -u origin "$BRANCH"
echo "Pushed to $REPO ($BRANCH)."
