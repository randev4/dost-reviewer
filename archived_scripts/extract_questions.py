"""
Extract questions from dost reviewer 2020.pdf and generate JSON data files.
Uses PyMuPDF to get raw text, then applies regex-based parsing.
Also reads the answer key pages to get correct answers + explanations.
"""
import fitz
import json
import re
import os

PDF_PATH = "dost reviewer 2020.pdf"
OUTPUT_DIR = os.path.join("..", "src", "data")
MANIFEST_PATH = "image_manifest.json"

# Load image manifest
with open(MANIFEST_PATH, "r") as f:
    IMAGE_MANIFEST = json.load(f)

# Subject page ranges (1-indexed)
SUBJECTS = {
    "science": {"q_pages": (28, 41), "a_pages": (67, 72), "file": "science.json", "topic_default": "general"},
    "mathematics": {"q_pages": (42, 50), "a_pages": (73, 76), "file": "mathematics.json", "topic_default": "general"},
    "english": {"q_pages": (17, 27), "a_pages": (63, 66), "file": "english.json", "topic_default": "language"},
    "verbal-reasoning": {"q_pages": (9, 10), "a_pages": (59, 59), "file": "verbal-reasoning.json", "topic_default": "reasoning"},
    "nonverbal-reasoning": {"q_pages": (11, 16), "a_pages": (60, 62), "file": "nonverbal-reasoning.json", "topic_default": "patterns"},
    "mechanical-technical": {"q_pages": (51, 58), "a_pages": (77, 82), "file": "mechanical-technical.json", "topic_default": "mechanics"},
}

def extract_page_text(doc, page_num):
    """Get text from a page (1-indexed)."""
    return doc[page_num - 1].get_text()

def extract_answer_keys(doc, start_page, end_page):
    """Parse answer key pages to get item->answer mapping.
    Uses simple regex since the table layout fragments text heavily."""
    answers = {}
    
    for p in range(start_page, end_page + 1):
        text = doc[p - 1].get_text()
        # Find all "number  letter" patterns (e.g. "1  A", "15  D")
        matches = re.findall(r'\b(\d{1,2})\s+([A-D])\b', text)
        for num_str, letter in matches:
            num = int(num_str)
            if 1 <= num <= 70:  # reasonable question number range
                answers[num] = {"answer": letter, "explanation": ""}
    
    # Now try to extract explanations from the analysis_output.txt 
    # which has better structured text for the answer keys
    analysis_path = "analysis_output.txt"
    if os.path.exists(analysis_path):
        with open(analysis_path, "r", encoding="utf-8") as f:
            analysis_text = f.read()
        
        # Find answer key sections between the pages
        for p in range(start_page, end_page + 1):
            page_marker = f"--- Page {p} "
            next_marker = f"--- Page {p+1} "
            start_idx = analysis_text.find(page_marker)
            end_idx = analysis_text.find(next_marker)
            if start_idx == -1:
                continue
            if end_idx == -1:
                end_idx = len(analysis_text)
            page_text = analysis_text[start_idx:end_idx]
            
            # Find patterns like: number | letter | explanation text
            exp_matches = re.findall(
                r'(\d{1,2})\s+\|\s+([A-D])\s+\|\s+(.+?)(?=\d{1,2}\s+\|\s+[A-D]|\n---|\Z)',
                page_text, re.DOTALL
            )
            for num_str, letter, explanation in exp_matches:
                num = int(num_str)
                if 1 <= num <= 70:
                    clean_exp = re.sub(r'\s*\|.*', '', explanation).strip()
                    clean_exp = re.sub(r'\s+', ' ', clean_exp)[:400]
                    if num in answers:
                        answers[num]["explanation"] = clean_exp
                    else:
                        answers[num] = {"answer": letter, "explanation": clean_exp}
    
    return answers

def get_images_for_page(page_num):
    """Get image filenames for a given page from the manifest."""
    page_str = str(page_num)
    if page_str in IMAGE_MANIFEST:
        return [img["filename"] for img in IMAGE_MANIFEST[page_str]["images"]]
    return []

def extract_questions_from_pages(doc, start_page, end_page, subject_key):
    """Extract questions from question pages."""
    questions = []
    full_text = ""
    page_breaks = {}  # track which character position corresponds to which page
    
    for p in range(start_page, end_page + 1):
        page_breaks[len(full_text)] = p
        full_text += extract_page_text(doc, p) + "\n"
    
    # Split into question blocks using question number pattern
    # Pattern: number. or number.  at start of line or after whitespace
    parts = re.split(r'(?:^|\n)\s*(\d+)\.\s+', full_text)
    
    # parts[0] is header text, then alternating: [num, text, num, text, ...]
    for i in range(1, len(parts) - 1, 2):
        q_num = int(parts[i])
        q_text = parts[i + 1].strip()
        
        # Clean up footer text
        q_text = re.sub(r'Developing One.*?Test-Taking\s*\d*', '', q_text)
        q_text = re.sub(r'SIYENSYA-bilidad\s*2?', '', q_text)
        
        # Try to extract choices (A. B. C. D.)
        choices = []
        choice_pattern = r'[A-D]\.\s+'
        choice_splits = re.split(r'\n?\s*([A-D])\.\s+', q_text)
        
        if len(choice_splits) >= 9:  # at least 4 choices (key+text pairs) + question
            question_text = choice_splits[0].strip()
            for j in range(1, len(choice_splits) - 1, 2):
                key = choice_splits[j]
                text = choice_splits[j + 1].strip()
                # Clean trailing whitespace and page numbers
                text = re.sub(r'\s*\d+\s*$', '', text).strip()
                choices.append({"key": key, "text": text[:200]})  # cap length
        else:
            question_text = q_text[:500]
            # Try simpler choice extraction
            for letter in ['A', 'B', 'C', 'D']:
                m = re.search(rf'{letter}\.\s+(.+?)(?=[B-D]\.|$)', q_text, re.DOTALL)
                if m:
                    choices.append({"key": letter, "text": m.group(1).strip()[:200]})
        
        # Find which page this question is on for image mapping
        q_page = start_page
        text_pos = full_text.find(f"{q_num}.")
        for pos, page in sorted(page_breaks.items()):
            if text_pos >= pos:
                q_page = page
        
        images = get_images_for_page(q_page)
        
        question = {
            "id": f"{subject_key[:3]}-2020-{q_num:03d}",
            "subject": subject_key.replace("-", "_") if "-" in subject_key else subject_key,
            "topic": SUBJECTS[subject_key]["topic_default"],
            "difficulty": 2,
            "question": question_text[:500],
            "choices": choices if len(choices) == 4 else [
                {"key": "A", "text": "Option A"},
                {"key": "B", "text": "Option B"},
                {"key": "C", "text": "Option C"},
                {"key": "D", "text": "Option D"}
            ],
            "answer": "A",  # placeholder, will be filled from answer key
            "explanation": "",
        }
        
        if images:
            question["image"] = images[0]
        
        questions.append(question)
    
    return questions

def merge_answers(questions, answer_keys):
    """Merge answer key data into questions."""
    for q in questions:
        q_num = int(q["id"].split("-")[-1])
        if q_num in answer_keys:
            q["answer"] = answer_keys[q_num]["answer"]
            explanation = answer_keys[q_num]["explanation"]
            if explanation:
                q["explanation"] = explanation[:500]
    return questions

def assign_difficulty(questions):
    """Assign difficulty 1-3 based on position (early=easy, late=hard)."""
    total = len(questions)
    for i, q in enumerate(questions):
        ratio = i / max(total - 1, 1)
        if ratio < 0.33:
            q["difficulty"] = 1
        elif ratio < 0.66:
            q["difficulty"] = 2
        else:
            q["difficulty"] = 3
    return questions

def assign_science_topics(questions):
    """Assign topics to science questions based on content keywords."""
    bio_keywords = ["cell", "DNA", "blood", "microscope", "plant", "animal", "biome", "species", "gene", "chromosome", "photosynthesis", "oogenesis", "spermatogenesis", "fossil", "phylogeny"]
    chem_keywords = ["compound", "element", "periodic", "ionic", "covalent", "acid", "pH", "formula", "mole", "electron", "atom", "chemical", "mixture", "solution", "nuclide"]
    physics_keywords = ["force", "velocity", "acceleration", "energy", "wave", "displacement", "projectile", "speed", "work", "watt", "graph"]
    earth_keywords = ["earthquake", "typhoon", "rock", "Earth", "ocean", "mantle", "crust", "sediment", "volcano", "weather", "season", "comet", "asteroid", "eclipse", "delta"]
    
    for q in questions:
        text = q["question"].lower()
        if any(kw.lower() in text for kw in bio_keywords):
            q["topic"] = "biology"
        elif any(kw.lower() in text for kw in chem_keywords):
            q["topic"] = "chemistry"
        elif any(kw.lower() in text for kw in physics_keywords):
            q["topic"] = "physics"
        elif any(kw.lower() in text for kw in earth_keywords):
            q["topic"] = "earth_science"
    return questions

def main():
    doc = fitz.open(PDF_PATH)
    
    for subject_key, config in SUBJECTS.items():
        print(f"\n{'='*60}")
        print(f"Processing: {subject_key}")
        print(f"{'='*60}")
        
        # Extract answer keys first
        answer_keys = extract_answer_keys(doc, config["a_pages"][0], config["a_pages"][1])
        print(f"  Answer keys found: {len(answer_keys)}")
        
        # Extract questions
        questions = extract_questions_from_pages(
            doc, config["q_pages"][0], config["q_pages"][1], subject_key
        )
        print(f"  Questions extracted: {len(questions)}")
        
        # Merge answers
        questions = merge_answers(questions, answer_keys)
        
        # Assign difficulty
        questions = assign_difficulty(questions)
        
        # Assign science topics
        if subject_key == "science":
            questions = assign_science_topics(questions)
        
        # Load existing file, keep ONLY original seed questions (non-2020)
        existing_path = os.path.join(OUTPUT_DIR, config["file"])
        seed_questions = []
        if os.path.exists(existing_path):
            with open(existing_path, "r", encoding="utf-8") as f:
                all_existing = json.load(f)
            seed_questions = [q for q in all_existing if "-2020-" not in q["id"]]
            print(f"  Seed questions kept: {len(seed_questions)}")
        
        # Combine: seed + freshly extracted PDF questions (with correct answers)
        combined = seed_questions + questions
        
        # Save
        output_path = os.path.join(OUTPUT_DIR, config["file"])
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(combined, f, indent=4, ensure_ascii=False)
        
        print(f"  Total questions saved: {len(combined)} ({len(seed_questions)} seed + {len(questions)} PDF)")
        
        # Show answer coverage
        answered = sum(1 for q in questions if q["answer"] != "A" or q["explanation"])
        print(f"  With answers from key: {answered}/{len(questions)}")
    
    doc.close()
    print(f"\n{'='*60}")
    print("Done! All subject JSON files updated.")

if __name__ == "__main__":
    main()
