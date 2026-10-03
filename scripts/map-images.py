#!/usr/bin/env python3
"""Map CDN images to their JSON context: extract structured blocks around image refs."""
import re, json

raw = open('/home/z/my-project/scripts/site-home.html', encoding='utf-8', errors='ignore').read()

# find JSON-ish context around each CDN url occurrence
for m in re.finditer(r'https://cdn\.internationalmaarifschools\.co\.za/media/images/[\w\-]+\.\w+', raw):
    s = max(0, m.start() - 260)
    ctx = raw[s:m.end() + 60].replace('\\n', ' ')
    print('>>>', ctx[-320:].replace('\n', ' '))
    print()

# try to find staff/team JSON: search for typical keys
for key in ['"team"', '"staff"', '"name"', '"title"', '"role"', '"alt"']:
    pass

# Extract ALL "name-like" fields near images from embedded JSON (RSC flight data)
print('=== NAME/ROLE FIELDS ===')
for m in re.finditer(r'\{[^{}]{0,400}?"(?:name|fullName|title)"\s*:\s*"([^"]{3,80})"[^{}]{0,400}?\}', raw):
    print(m.group(1))
