#!/usr/bin/env python3
"""Extract real images + copy from the Maarif Cape Town High School site."""
import re, json, html

raw = open('/home/z/my-project/scripts/site-home.html', encoding='utf-8', errors='ignore').read()

# --- images ---
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', raw)
imgs += re.findall(r'srcset=["\']([^"\']+)["\']', raw)
urls = []
for u in imgs:
    for part in u.split(','):
        u2 = part.strip().split(' ')[0]
        if u2 and u2 not in urls:
            urls.append(u2)
# background images in inline styles
urls += re.findall(r'url\((https?://[^)]+)\)', raw)

def clean(u):
    u = html.unescape(u)
    if u.startswith('//'): u = 'https:' + u
    return u.split('?')[0] if 'wp-content' in u else u

imgs_clean = []
seen = set()
for u in urls:
    c = clean(u)
    if 'wp-content' in c and c not in seen:
        seen.add(c)
        imgs_clean.append(c)

print("=== IMAGES (%d) ===" % len(imgs_clean))
for u in imgs_clean:
    print(u)

# --- text content ---
body = re.sub(r'<script.*?</script>', ' ', raw, flags=re.S)
body = re.sub(r'<style.*?</style>', ' ', body, flags=re.S)
# headings
print("\n=== HEADINGS ===")
for tag, txt in re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>', body, flags=re.S):
    t = html.unescape(re.sub(r'<[^>]+>', ' ', txt))
    t = re.sub(r'\s+', ' ', t).strip()
    if t and len(t) > 2:
        print(f"[{tag}] {t}")

print("\n=== PARAGRAPHS ===")
seen_p = set()
for txt in re.findall(r'<p[^>]*>(.*?)</p>', body, flags=re.S):
    t = html.unescape(re.sub(r'<[^>]+>', ' ', txt))
    t = re.sub(r'\s+', ' ', t).strip()
    if t and len(t) > 40 and t not in seen_p:
        seen_p.add(t)
        print("-", t[:400])
