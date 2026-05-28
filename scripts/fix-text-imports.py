#!/usr/bin/env python3

import os
import re

def add_text_import(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if <Text> is used but not imported
    if re.search(r'<Text\b', content) and "import { Text" not in content:
        # Insert after the last import or at the top
        new_content = re.sub(
            r'(import[^;]+;\n)',
            lambda m: m.group(0) + "import { Text } from 'react-native';\n",
            content,
            count=1
        )
        if new_content == content:  # No import found, insert at top
            new_content = "import { Text } from 'react-native';\n" + content
        
        with open(filepath, 'w') as f:
            f.write(new_content)

for root, _, files in os.walk("app"):
    for file in files:
        if file.endswith(".tsx"):
            filepath = os.path.join(root, file)
            add_text_import(filepath)

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith(".tsx"):
            filepath = os.path.join(root, file)
            add_text_import(filepath)