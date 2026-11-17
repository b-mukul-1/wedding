#!/usr/bin/env python3
"""
Convert project images to WebP format for fast loading and reduced bandwidth.
Preserves alpha transparency, achieves ~80% file size reduction with near-lossless visual fidelity.
Also updates references in src/ components and styles.
"""

import os
import sys
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_ART = BASE_DIR / "public" / "art"
SRC_DIR = BASE_DIR / "src"

QUALITY = 88  # High perceptual quality, crisp edges for Disney/Pixar art
METHOD = 6    # Maximum compression effort

def format_size(bytes_val):
    if bytes_val < 1024:
        return f"{bytes_val} B"
    elif bytes_val < 1024 * 1024:
        return f"{bytes_val / 1024:.1f} KB"
    else:
        return f"{bytes_val / (1024 * 1024):.2f} MB"

def convert_images():
    print("=" * 60)
    print("🖼️  Converting images to WebP...")
    print("=" * 60)

    if not PUBLIC_ART.exists():
        print(f"Error: {PUBLIC_ART} does not exist.")
        sys.exit(1)

    image_files = sorted([
        f for f in PUBLIC_ART.iterdir()
        if f.suffix.lower() in ('.png', '.jpg', '.jpeg')
    ])

    if not image_files:
        print("No PNG/JPG images found in public/art.")
        return {}

    converted_map = {}
    total_before = 0
    total_after = 0

    for img_path in image_files:
        webp_name = img_path.stem + ".webp"
        webp_path = PUBLIC_ART / webp_name

        size_before = img_path.stat().st_size
        total_before += size_before

        try:
            with Image.open(img_path) as im:
                # Save as WebP
                # If RGBA, save with alpha preserved
                save_kwargs = {
                    "format": "WEBP",
                    "quality": QUALITY,
                    "method": METHOD,
                }
                if im.mode == "RGBA":
                    # RGBA lossy preserves transparency
                    im.save(webp_path, **save_kwargs)
                elif im.mode in ("RGB", "L"):
                    im.save(webp_path, **save_kwargs)
                else:
                    # Convert palette or other modes to RGBA if transparency exists, else RGB
                    converted_mode = "RGBA" if "transparency" in im.info else "RGB"
                    im.convert(converted_mode).save(webp_path, **save_kwargs)

            size_after = webp_path.stat().st_size
            total_after += size_after
            savings_pct = ((size_before - size_after) / size_before) * 100

            converted_map[img_path.name] = webp_name

            print(f"✓ {img_path.name:25} -> {webp_name:25} "
                  f"{format_size(size_before):>9} -> {format_size(size_after):>9} "
                  f"({savings_pct:+.1f}%)")

        except Exception as e:
            print(f"✗ Failed {img_path.name}: {e}")

    saved_bytes = total_before - total_after
    saved_pct = (saved_bytes / total_before * 100) if total_before else 0
    print("-" * 60)
    print(f"Total Original:  {format_size(total_before)}")
    print(f"Total WebP:      {format_size(total_after)}")
    print(f"Total Saved:     {format_size(saved_bytes)} ({saved_pct:.1f}% reduction)")
    print("=" * 60)

    return converted_map

def update_code_references(converted_map):
    print("\n📝 Updating code references to .webp in src/...")
    
    extensions = ('.jsx', '.js', '.css', '.html')
    files_to_check = []
    
    for root, _, files in os.walk(SRC_DIR):
        for f in files:
            if f.endswith(extensions):
                files_to_check.append(Path(root) / f)

    index_html = BASE_DIR / "index.html"
    if index_html.exists():
        files_to_check.append(index_html)

    updated_files_count = 0
    replacements_count = 0

    for file_path in files_to_check:
        try:
            content = file_path.read_text(encoding='utf-8')
            new_content = content
            file_replacements = 0

            for orig_name, webp_name in converted_map.items():
                old_ref = f"/art/{orig_name}"
                new_ref = f"/art/{webp_name}"
                if old_ref in new_content:
                    count = new_content.count(old_ref)
                    new_content = new_content.replace(old_ref, new_ref)
                    file_replacements += count
                    print(f"  • {file_path.relative_to(BASE_DIR)}: {old_ref} -> {new_ref} ({count}x)")

            if file_replacements > 0:
                file_path.write_text(new_content, encoding='utf-8')
                updated_files_count += 1
                replacements_count += file_replacements

        except Exception as e:
            print(f"Error updating {file_path}: {e}")

    print(f"\n✨ Updated {replacements_count} reference(s) across {updated_files_count} file(s).")

if __name__ == "__main__":
    converted = convert_images()
    if converted:
        update_code_references(converted)
    print("\n🎉 WebP optimization complete!")
