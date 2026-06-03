#!/bin/bash
set -euo pipefail

SRC="${HOME}/Projects/curriculo/out"
DST="$(cd "$(dirname "$0")/.." && pwd)/public/curriculo"

mkdir -p "$DST"

declare -A FILES=(
  ["jean-souza-curriculo-senior-frontend-pt.pdf"]="jean-souza-curriculo-pt.pdf"
  ["jean-souza-curriculo-senior-frontend-pt.docx"]="jean-souza-curriculo-pt.docx"
  ["jean-souza-resume-senior-frontend-en.pdf"]="jean-souza-resume-en.pdf"
  ["jean-souza-resume-senior-frontend-en.docx"]="jean-souza-resume-en.docx"
)

missing=0
for src_name in "${!FILES[@]}"; do
  src_path="$SRC/$src_name"
  dst_name="${FILES[$src_name]}"
  if [[ ! -f "$src_path" ]]; then
    echo "✗ missing: $src_path" >&2
    missing=$((missing + 1))
    continue
  fi
  cp "$src_path" "$DST/$dst_name"
  echo "✓ $dst_name"
done

if [[ $missing -gt 0 ]]; then
  echo "" >&2
  echo "Run first in ~/Projects/curriculo:" >&2
  echo "  ./scripts/generate_resume.py vaga_senior_frontend.txt 'Senior Frontend' senior --lang=pt" >&2
  echo "  ./scripts/generate_resume.py vaga_senior_frontend.txt 'Senior Frontend' senior --lang=en" >&2
  echo "Then re-export with pandoc (see Task 1 Step 3)." >&2
  exit 1
fi
