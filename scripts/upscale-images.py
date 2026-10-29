# Upscales the school's small assets so they survive being shown large.
#
# The school's own server ships several images far smaller than any modern
# layout needs: photo-*.jpg and achievement-*.jpg are 250x130, logo.jpg is
# 82x82, model1.jpg is 328x199. Rendered into a card or a lightbox they turn
# to mush. This resamples them with Lanczos and a mild unsharp mask.
#
# Originals are preserved under public/images/_originals/ so the pass is
# reversible and the manifest can still cite the true source file.
#
#   py -3 scripts/upscale-images.py

import os
import shutil
import sys

from PIL import Image, ImageFilter, ImageOps

ROOT = os.path.join("public", "images")
BACKUP = os.path.join(ROOT, "_originals")

# Only touch things that are genuinely too small; leave the 700px+ scans alone.
MIN_LONG_EDGE = 700
SCALE = {
    # narrow-key -> how much headroom the layout needs
    "default": 2.0,
    "logo.jpg": 4.0,        # 82px, shown at 44-64 CSS px on retina
    "model1.jpg": 2.5,      # 328px, used as a page-header image
}
JPEG_QUALITY = 92


def target_scale(path):
    name = os.path.basename(path)
    return SCALE.get(name, SCALE["default"])


def backup_path(path):
    rel = os.path.relpath(path, ROOT)
    return os.path.join(BACKUP, rel)


def process(path):
    with Image.open(path) as im:
        fmt = im.format
        if fmt not in ("JPEG", "PNG"):
            return None
        width, height = im.size
        if max(width, height) >= MIN_LONG_EDGE:
            return None

        scale = target_scale(path)
        new_size = (int(width * scale), int(height * scale))

        image = ImageOps.exif_transpose(im)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")

        upscaled = image.resize(new_size, Image.LANCZOS)
        # Lanczos softens edges; this recovers the crispness without ringing.
        upscaled = upscaled.filter(
            ImageFilter.UnsharpMask(radius=1.6, percent=110, threshold=2)
        )

        dest = backup_path(path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        if not os.path.exists(dest):
            shutil.copy2(path, dest)

        if fmt == "PNG":
            upscaled.save(path, format="PNG", optimize=True)
        else:
            upscaled.save(path, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)

        return (os.path.relpath(path, ROOT).replace("\\", "/"),
                f"{width}x{height}", f"{new_size[0]}x{new_size[1]}",
                os.path.getsize(dest) // 1024, os.path.getsize(path) // 1024)


def main():
    if not os.path.isdir(ROOT):
        sys.exit("Run this from the project root.")

    changed = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        if "_originals" in dirpath:
            continue
        for filename in sorted(filenames):
            if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
                continue
            result = process(os.path.join(dirpath, filename))
            if result:
                changed.append(result)

    print(f"{'file':<52} {'from':>10} {'to':>10} {'KB':>6} -> {'KB':>6}")
    for name, before, after, kb_old, kb_new in changed:
        print(f"{name:<52} {before:>10} {after:>10} {kb_old:>6} -> {kb_new:>6}")
    print(f"\nUpscaled {len(changed)} images. Originals kept in public/images/_originals/.")


if __name__ == "__main__":
    main()
