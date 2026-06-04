#!/usr/bin/env python3
"""
Auto-fix React Native violations in .tsx files:
1. Raw text outside <Text>
2. Inline styles
3. Color literals
"""
import os
import re
import sys
from pathlib import Path

REACT_NATIVE_IMPORT = r"import\s+\{([^}]*)\}\s+from\s+['\"]react-native['\"];"
TEXT_RE = r"<(Text)[^>]*>"
RAW_TEXT_RE = r"(>[^<]+<)"
INLINE_STYLE_RE = r"style=\"([^\"]*)\""
COLOR_LITERAL_RE = r"color:\s*['\"]([^'\"]*)['\"]"

COLORS = {
    "white": "colors.ivory",
    "#fff": "colors.ivory",
    "#000": "colors.obsidian",
    "#3b82f6": "colors.phosphor",
    "#ef4444": "colors.ruby",
    "#4b5563": "colors.zinc",
    "#000000": "colors.obsidian",
    "#ffffff": "colors.ivory",
    "#1DA1F2": "colors.twitter",
    "#0077B5": "colors.linkedin",
    "#25D366": "colors.whatsapp",
}

def add_text_import(content):
    """Add { Text } import to react-native if missing."""
    if "{ Text }" not in content and "{Text}" not in content:
        content = re.sub(
            REACT_NATIVE_IMPORT,
            lambda m: f"import {{ {m.group(1)}, Text }} from 'react-native';",
            content,
        )
    return content

def wrap_raw_text(content):
    """Wrap raw text in <Text> tags."""
    matches = re.findall(RAW_TEXT_RE, content, re.MULTILINE)
    for match in set(matches):
        raw_text = match[1:-1].strip()
        if raw_text:
            wrapper = f"<Text>{raw_text}</Text>"
            content = content.replace(match, f">{wrapper}<")
    return content

def fix_inline_styles(content):
    """Replace inline styles with StyleSheet.create."""
    inline_styles = re.findall(INLINE_STYLE_RE, content)
    for style in inline_styles:
        has_color = "color:" in style
        if has_color:
            content = content.replace(f'style="{style}"', "style={styles.text}")
    return content

def replace_color_literals(content):
    """Replace color literals with theme vars."""
    def replace_color(match):
        literal = match.group(1)
        return COLORS.get(literal, f"colors.{literal.strip('#').lower()}")
    
    content = re.sub(COLOR_LITERAL_RE, replace_color, content)
    return content

def main():
    tsx_files = [str(p) for p in Path(".").rglob("*.tsx")]
    for fname in tsx_files:
        with open(fname, "r") as f:
            content = f.read()
        
        if "react-native" not in content:
            continue
            
        content = add_text_import(content)
        content = wrap_raw_text(content)
        content = fix_inline_styles(content)
        content = replace_color_literals(content)
        
        with open(fname, "w") as f:
            f.write(content)

if __name__ == "__main__":
    main()