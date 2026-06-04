#!/usr/bin/env python3
"""
Remove duplicate imports of 'Text' in .tsx files.
"""
import os
import re
import sys
from pathlib import Path

IMPORT_RE = r"import\s+\{([^}]+)\}\s+from\s+['\"']react-native['\"];"


def dedupe_imports(content: str) -> str:
    def _dedupe(match):
        items = [item.strip().split(" as ")[0] for item in match.group(1).split(",")]
        deduped = []
        seen = set()
        for item in items:
            if item not in seen:
                deduped.append(item)
                seen.add(item)
        return f"import {{ {', '.join(deduped)} }} from 'react-native'"

    return re.sub(IMPORT_RE, _dedupe, content)


def main():
    tsx_files = [str(p) for p in Path(".").rglob("*.tsx")]
    for fname in tsx_files:
        with open(fname, "r") as f:
            content = f.read()
        content = dedupe_imports(content)
        with open(fname, "w") as f:
            f.write(content)


if __name__ == "__main__":
    main()