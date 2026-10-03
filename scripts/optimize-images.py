#!/usr/bin/env python3
"""Optimize downloaded site images: resize + compress for web delivery."""
import os
from PIL import Image, ImageOps

SRC = '/home/z/my-project/public/images/site'
total_before = total_after = 0

for name in sorted(os.listdir(SRC)):
    path = os.path.join(SRC, name)
    before = os.path.getsize(path)
    total_before += before
    try:
        img = Image.open(path)
        img = ImageOps.exif_transpose(img)
        max_w = 1600 if 'hero' in name or 'gallery' in name else 700
        if img.width > max_w:
            h = int(img.height * max_w / img.width)
            img = img.resize((max_w, h), Image.LANCZOS)
        out = path
        if name.endswith('.png'):
            # keep PNG for transparency (team-ebrahim), else convert to jpg
            if img.mode not in ('RGBA', 'LA', 'P'):
                out = path.replace('.png', '.jpg')
                img.convert('RGB').save(out, 'JPEG', quality=80, optimize=True, progressive=True)
            else:
                img.save(out, 'PNG', optimize=True)
        else:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            img.save(out, 'JPEG', quality=78, optimize=True, progressive=True)
        after = os.path.getsize(out)
        total_after += after
        if out != path:
            os.remove(path)
        print(f"{name:22} {before//1024:>6}KB -> {after//1024:>6}KB")
    except Exception as e:
        print(f"{name:22} ERROR {e}")

print(f"\nTOTAL {total_before//1024//1024}MB -> {total_after//1024//1024}MB")
