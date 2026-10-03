#!/usr/bin/env python3
"""Reconstruct Next.js flight payload from __next_f.push chunks and extract page data."""
import re, json, html as h

raw = open('/home/z/my-project/scripts/site-home.html', encoding='utf-8', errors='ignore').read()

chunks = re.findall(r'self\.__next_f\.push\(\[1,\s*"((?:[^"\\]|\\.)*)"\]\)', raw)
flight = ''.join(c.encode().decode('unicode_escape') for c in chunks)
open('/home/z/my-project/scripts/flight.txt', 'w').write(flight)
print("flight length:", len(flight))

# Find the school payload object: starts with school data containing "capetown-high-school"
i = flight.find('capetown-high-school')
print("slug at:", i)

# Extract all image entries with title
print("\n=== IMAGE ENTRIES (title -> url) ===")
for m in re.finditer(r'\\"title\\":\\"([^"]{1,80})\\",\\"altText\\":\\"([^"]*)\\",\\"file\\":\{\\"id\\":\\"[^"]*\\",\\"url\\":\\"(https://cdn[^"\\]+)\\"', flight):
    print(f"{m.group(1)!r:45} alt={m.group(2)!r:25} {m.group(3)}")

# names near images: search pattern "name":"..."
print("\n=== 'name' FIELDS ===")
for m in re.finditer(r'\\?"name\\?"\s*:\s*\\?"([^"\\]{3,60})\\?"', flight):
    print(m.group(1))
