import fitz
import os

output = []

pdfs_to_analyze = [
    "dost reviewer 2020.pdf",
    "dost review manual syensiyabilidad 2013.pdf",
    "math practice test 1 question 60 items.pdf"
]

for pdf_name in pdfs_to_analyze:
    if not os.path.exists(pdf_name):
        continue
    output.append(f"\n{'='*80}")
    output.append(f"FILE: {pdf_name}")
    output.append(f"{'='*80}")
    doc = fitz.open(pdf_name)
    output.append(f"Total pages: {len(doc)}")
    
    total_images = 0
    for i in range(len(doc)):
        page = doc[i]
        images = page.get_images(full=True)
        total_images += len(images)
    output.append(f"Total images across all pages: {total_images}")
    
    # Show ALL pages
    for i in range(len(doc)):
        page = doc[i]
        images = page.get_images(full=True)
        
        output.append(f"\n--- Page {i+1} (images: {len(images)}) ---")
        
        blocks = page.get_text("blocks")
        blocks.sort(key=lambda b: (b[1], b[0]))
        
        for block in blocks:
            if block[6] == 0:
                text = block[4].strip().replace('\n', ' | ')
                if text and len(text) > 3:
                    output.append(f"  [{block[1]:.0f}] {text[:300]}")
    
    doc.close()

with open("analysis_output.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output))

print(f"Done. Output written to analysis_output.txt ({len(output)} lines)")
