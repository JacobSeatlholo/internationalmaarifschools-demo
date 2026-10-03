#!/usr/bin/env python3
"""Dump ordered strings from RSC flight payload to reconstruct page structure."""
import re, html as h

raw = open('/home/z/my-project/scripts/site-home.html', encoding='utf-8', errors='ignore').read()

# strings in flight payload (escaped quotes)
strs = re.findall(r'\\?"((?:[^"\\]|\\.){3,600}?)\\?"', raw)
out, prev = [], None
for s in strs:
    try:
        s2 = s.encode().decode('unicode_escape')
    except Exception:
        s2 = s
    s2 = h.unescape(s2).strip()
    if not s2 or s2 == prev:
        continue
    prev = s2
    if re.match(r'^\$?@?[a-zA-Z0-9_$-]{1,3}$', s2) or s2.startswith('/_next') or s2.startswith('cmo2'):
        continue
    out.append(s2)

open('/home/z/my-project/scripts/site-strings.txt', 'w').write('\n'.join(out))
print('\n'.join(out[:400]))
