#!/usr/bin/env bash
set -euo pipefail

SRC=~/Projects/curriculo/out
DEST="$(dirname "$0")/../public/curriculo"

mkdir -p "$DEST"

cp "$SRC/jean-souza-curriculo-senior-frontend-pt.pdf"  "$DEST/jean-souza-curriculo-pt.pdf"
cp "$SRC/jean-souza-curriculo-senior-frontend-pt.docx" "$DEST/jean-souza-curriculo-pt.docx"
cp "$SRC/jean-souza-resume-senior-frontend-en.pdf"     "$DEST/jean-souza-resume-en.pdf"
cp "$SRC/jean-souza-resume-senior-frontend-en.docx"    "$DEST/jean-souza-resume-en.docx"

echo "Synced 4 files to public/curriculo/"
