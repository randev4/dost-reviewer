import fitz

doc = fitz.open('references/dost reviewer 2020.pdf')

out = ""
for p in range(51, 59):
    page = doc[p-1]
    blocks = page.get_text("dict")["blocks"]
    out += f"\n--- PAGE {p} ---\n"
    img_idx = 0
    for b in blocks:
        if b["type"] == 0: # text
            for l in b["lines"]:
                for s in l["spans"]:
                    text = s["text"].strip()
                    if text:
                        out += text + "\n"
        elif b["type"] == 1: # image
            out += f"[IMAGE_{p}_{img_idx}]\n"
            img_idx += 1

with open('temp_mech_blocks.txt', 'w', encoding='utf-8') as f:
    f.write(out)
