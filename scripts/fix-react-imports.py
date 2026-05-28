#!/usr/bin/env python3
"""
Script to auto-add missing React imports to .tsx files.
Usage: python scripts/fix-react-imports.py
"""
import os
import re
import sys

# Target directories
TARGET_DIRS = [".", "src", "app", "components", "lib"]
PATCHED_FILES = set()

# Regex to detect JSX/TSX usage without React import
JSX_REGEX = re.compile(r"<([A-Z][a-zA-Z]*)")
REACT_IMPORT_REGEX = re.compile(r"import\s+React(\s*,\s*\{.*\})?\s+from\s+['\"]react['\"]")


def has_jsx(content):
    return bool(JSX_REGEX.search(content))


def has_react_import(content):
    return bool(REACT_IMPORT_REGEX.search(content))


def add_react_import(content):
    # Insert after existing imports or at the top
    lines = content.split("\n")
    insert_pos = 0
    
    # Find the last import line
    for i, line in enumerate(lines):
        if line.strip().startswith("import ") or line.strip() == "":
            insert_pos = i + 1
        else:
            break
    
    # Insert the React import
    lines.insert(insert_pos, "import React from 'react';")
    return "\n".join(lines)


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if has_jsx(content) and not has_react_import(content):
        updated_content = add_react_import(content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        PATCHED_FILES.add(filepath)
        print(f"✓ Added React import to {filepath}")
        return True
    return False


def main():
    patched_count = 0
    for target_dir in TARGET_DIRS:
        if not os.path.isdir(target_dir):
            continue
        
        for root, _, files in os.walk(target_dir):
            for file in files:
                if file.endswith('.tsx'):
                    filepath = os.path.join(root, file)
                    if process_file(filepath):
                        patched_count += 1
    
    print(f"\nDone. Patched {patched_count} files.")
    if PATCHED_FILES:
        print("\nFiles patched:")
        for f in PATCHED_FILES:
            print(f"- {f}")


if __name__ == "__main__":
    main()