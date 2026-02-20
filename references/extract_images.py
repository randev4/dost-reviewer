"""
Extract embedded images from dost reviewer 2020.pdf
Save to public/images/questions/ with descriptive naming.
Also produces a manifest mapping page numbers to image filenames.
"""

import fitz  # PyMuPDF
import os
import json

PDF_PATH = "dost reviewer 2020.pdf"
OUTPUT_DIR = os.path.join("..", "public", "images", "questions")
MANIFEST_PATH = "image_manifest.json"

# Page ranges for each subject section in the 2020 PDF
SUBJECT_PAGES = {
    "verbal": (9, 10),          # Pages 9-10 (0-indexed: 8-9)
    "nonverbal": (11, 16),      # Pages 11-16 (0-indexed: 10-15) 
    "english": (17, 27),        # Pages 17-27
    "science": (28, 41),        # Pages 28-41
    "math": (42, 50),           # Pages 42-50
    "mechanical": (51, 58),     # Pages 51-58
    "answer-verbal": (59, 59),
    "answer-nonverbal": (60, 62),
    "answer-english": (63, 66),
    "answer-science": (67, 72),
    "answer-math": (73, 76),
    "answer-mechanical": (77, 82),
}

def get_subject_for_page(page_num):
    """Return subject name for a 1-indexed page number."""
    for subject, (start, end) in SUBJECT_PAGES.items():
        if start <= page_num <= end:
            return subject
    return "misc"

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    doc = fitz.open(PDF_PATH)
    manifest = {}
    total_extracted = 0
    skipped = 0

    for page_idx in range(len(doc)):
        page_num = page_idx + 1
        page = doc[page_idx]
        images = page.get_images(full=True)

        if not images:
            continue

        subject = get_subject_for_page(page_num)
        page_images = []

        for img_idx, img_info in enumerate(images):
            xref = img_info[0]
            
            try:
                base_image = doc.extract_image(xref)
                if not base_image:
                    continue
                    
                image_bytes = base_image["image"]
                ext = base_image["ext"]
                width = base_image.get("width", 0)
                height = base_image.get("height", 0)

                # Skip tiny images (decorative elements, icons)
                if width < 40 or height < 40:
                    skipped += 1
                    continue

                # Skip very small file sizes (likely artifacts)
                if len(image_bytes) < 500:
                    skipped += 1
                    continue

                filename = f"{subject}-p{page_num}-{img_idx + 1}.{ext}"
                filepath = os.path.join(OUTPUT_DIR, filename)

                with open(filepath, "wb") as f:
                    f.write(image_bytes)

                page_images.append({
                    "filename": filename,
                    "width": width,
                    "height": height,
                    "size": len(image_bytes),
                    "index": img_idx
                })
                total_extracted += 1

            except Exception as e:
                print(f"  Error extracting image {img_idx} on page {page_num}: {e}")

        if page_images:
            manifest[str(page_num)] = {
                "subject": subject,
                "images": page_images
            }

    doc.close()

    # Save manifest
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nDone!")
    print(f"  Total extracted: {total_extracted}")
    print(f"  Skipped (too small): {skipped}")
    print(f"  Pages with images: {len(manifest)}")
    print(f"  Manifest saved to: {MANIFEST_PATH}")

    # Summary per subject
    print(f"\n  Per subject:")
    subject_counts = {}
    for page_data in manifest.values():
        subj = page_data["subject"]
        subject_counts[subj] = subject_counts.get(subj, 0) + len(page_data["images"])
    for subj, count in sorted(subject_counts.items()):
        print(f"    {subj}: {count} images")

if __name__ == "__main__":
    main()
