# Builds labelled contact sheets so the real content of each photograph can be
# checked against the label it is currently assigned to.
#   py -3 scripts/contact-sheet.py [cell_width]

import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join("public", "images")
OUT = ".verify"
CELL = int(sys.argv[1]) if len(sys.argv) > 1 else 300
LABEL_H = 22
COLS = 4

try:
    FONT = ImageFont.truetype("arial.ttf", 13)
except OSError:
    FONT = ImageFont.load_default()


def files_in(folder):
    base = os.path.join(ROOT, folder)
    if not os.path.isdir(base):
        return []
    return sorted(
        os.path.join(base, f) for f in os.listdir(base) if f.lower().endswith((".jpg", ".jpeg", ".png"))
    )


def sheet(folder, cell=CELL):
    files = files_in(folder)
    if not files:
        print(f"  (no images in {folder})")
        return
    rows = (len(files) + COLS - 1) // COLS
    canvas = Image.new("RGB", (COLS * cell, rows * (cell + LABEL_H)), (18, 18, 18))
    draw = ImageDraw.Draw(canvas)
    for index, path in enumerate(files):
        col, row = index % COLS, index // COLS
        x, y = col * cell, row * (cell + LABEL_H)
        try:
            with Image.open(path) as im:
                im = im.convert("RGB")
                im.thumbnail((cell - 4, cell - 4))
                canvas.paste(im, (x + 2, y + 2))
        except OSError:
            continue
        name = os.path.basename(path)
        draw.rectangle([x, y + cell, x + cell, y + cell + LABEL_H], fill=(10, 10, 10))
        draw.text((x + 4, y + cell + 4), name, font=FONT, fill=(255, 200, 120))
    out = os.path.join(OUT, "sheet-" + folder.replace("/", "_").replace(os.sep, "_") + ".png")
    canvas.save(out)
    print(f"  {folder:38s} {len(files):3d} imgs -> {out}")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    targets = [
        "infra_pics",
        os.path.join("Gallery", "SchoolFacilities"),
        os.path.join("Gallery", "SportsPics"),
        os.path.join("Gallery", "KidsWorld"),
        os.path.join("Gallery", "ArtsandCraft"),
        os.path.join("Gallery", "SchoolActivities"),
        os.path.join("Gallery", "CelebrationTime"),
        os.path.join("Gallery", "FairandExhibition"),
        os.path.join("Gallery", "Sayonara"),
        os.path.join("Gallery", "StaffandStudents"),
        os.path.join("Gallery", "Annualday-Seniors"),
        os.path.join("Gallery", "Annualday-Juniors"),
        os.path.join("Gallery", "Annual_Day_Nov-2017(UMANG)"),
        os.path.join("Achievements", "TaekwondoAchievers"),
        os.path.join("Achievements", "FootballTrophy"),
        os.path.join("Achievements", "cyberolympiad"),
        os.path.join("Achievements", "TimetoFeelHonoured"),
    ]
    print("contact sheets:")
    for t in targets:
        sheet(t)
    loose = [f for f in sorted(os.listdir(ROOT)) if f.startswith(("photo-", "achievement-", "school", "model1"))]
    print("\nloose root files:", len(loose))
