"""
Extract questions from math practice test 1 (60 items) PDF.
The raw text is clean enough for regex parsing. Answer key on page 12.
"""
import fitz
import json
import re
import os

PDF_PATH = "math practice test 1 question 60 items.pdf"
RAW_TEXT_PATH = "math_test_raw.txt"
OUTPUT_PATH = os.path.join("..", "src", "data", "mathematics.json")

def extract_answer_key(doc):
    """Extract answer key from page 12."""
    text = doc[11].get_text('text', sort=True)
    answers = {}
    # Pattern: number  letter (e.g., "1  C", "21  B")
    matches = re.findall(r'\b(\d{1,2})\s+([A-D])\b', text)
    for num_str, letter in matches:
        num = int(num_str)
        if 1 <= num <= 60:
            answers[num] = letter
    return answers

def parse_questions(raw_text):
    """Parse questions from the raw text file."""
    questions = []
    
    # Remove headers/footers
    lines = raw_text.split('\n')
    clean_lines = []
    for line in lines:
        if 'UPCAT REVIEWER' in line or 'PRACTICE TEST 1' in line or 'with Answer Key' in line:
            continue
        if 'reviewermath@yahoo' in line:
            continue
        if re.match(r'^\s*--- PAGE \d+ ---\s*$', line):
            continue
        if re.match(r'^\s*\d+\s*$', line) and len(line.strip()) <= 2:
            continue
        clean_lines.append(line)
    
    text = '\n'.join(clean_lines)
    
    # Stop before the answer key section
    answer_key_pos = text.find('ANSWER KEY IN MATHEMATICS')
    if answer_key_pos > 0:
        text = text[:answer_key_pos]
    
    # Also stop before the SCIENCE section
    science_pos = text.find('SCIENCE')
    if science_pos > 0:
        text = text[:science_pos]
    
    # Split by question numbers: "1.", "2.", etc.
    # Use pattern that matches number followed by period at start of line or after whitespace
    parts = re.split(r'(?:^|\n)\s*(\d{1,2})\.\s+', text)
    
    # parts[0] = header, then [num, text, num, text, ...]
    for i in range(1, len(parts) - 1, 2):
        q_num = int(parts[i])
        q_raw = parts[i + 1].strip()
        
        if q_num < 1 or q_num > 60:
            continue
        
        # Try to extract choices
        # Split on (A), (B), (C), (D) pattern
        choice_splits = re.split(r'\n?\s*\(([A-D])\)\s*', q_raw)
        
        question_text = ""
        choices = []
        
        if len(choice_splits) >= 9:  # question + 4 choices (key+text pairs)
            question_text = choice_splits[0].strip()
            for j in range(1, min(len(choice_splits), 9), 2):
                key = choice_splits[j]
                choice_text = choice_splits[j + 1].strip() if j + 1 < len(choice_splits) else ""
                # Clean up multi-line choice text
                choice_text = re.sub(r'\s+', ' ', choice_text).strip()
                # Remove trailing page footer remnants
                choice_text = re.sub(r'\s*If you want more.*$', '', choice_text)
                choices.append({"key": key, "text": choice_text[:200]})
        else:
            question_text = q_raw[:300]
            # Fallback: try simpler pattern
            for letter in ['A', 'B', 'C', 'D']:
                m = re.search(rf'\({letter}\)\s+(.+?)(?=\([B-D]\)|$)', q_raw, re.DOTALL)
                if m:
                    ct = re.sub(r'\s+', ' ', m.group(1).strip())[:200]
                    choices.append({"key": letter, "text": ct})
        
        # Clean question text
        question_text = re.sub(r'\s+', ' ', question_text).strip()
        
        # Determine difficulty based on position
        if q_num <= 20:
            difficulty = 1
        elif q_num <= 40:
            difficulty = 2
        else:
            difficulty = 3
        
        # Assign topic based on content keywords
        topic = "algebra"
        text_lower = question_text.lower()
        if any(kw in text_lower for kw in ["triangle", "angle", "midpoint", "congruent", "parallel", "perpendicular", "circle", "square", "inscribe", "octagon", "diagonal", "bisect", "similar"]):
            topic = "geometry"
        elif any(kw in text_lower for kw in ["root", "equation", "solve for", "parabola", "hyperbola", "quadratic", "factor"]):
            topic = "algebra"
        elif any(kw in text_lower for kw in ["sum", "series", "geometric", "sequence", "term", "expansion"]):
            topic = "sequences"
        elif any(kw in text_lower for kw in ["distance", "line", "equation of the line", "slope", "passes through"]):
            topic = "coordinate_geometry"
        elif any(kw in text_lower for kw in ["simplify", "fraction", "expression", "equivalent"]):
            topic = "simplification"
        elif any(kw in text_lower for kw in ["percent", "ratio", "proportion"]):
            topic = "arithmetic"
        elif any(kw in text_lower for kw in ["radian", "clock"]):
            topic = "trigonometry"
        
        question = {
            "id": f"math-practice1-{q_num:03d}",
            "subject": "mathematics",
            "topic": topic,
            "difficulty": difficulty,
            "question": question_text[:400],
            "choices": choices if len(choices) == 4 else [
                {"key": "A", "text": "Option A"},
                {"key": "B", "text": "Option B"},
                {"key": "C", "text": "Option C"},
                {"key": "D", "text": "Option D"}
            ],
            "answer": "A",  # placeholder
            "explanation": ""
        }
        
        questions.append(question)
    
    return questions

def main():
    doc = fitz.open(PDF_PATH)
    
    # Extract answer key
    answer_key = extract_answer_key(doc)
    print(f"Answer keys found: {len(answer_key)}")
    
    # Read raw text
    with open(RAW_TEXT_PATH, 'r', encoding='utf-8') as f:
        raw_text = f.read()
    
    # Parse questions
    questions = parse_questions(raw_text)
    print(f"Questions parsed: {len(questions)}")
    
    # Apply answer keys
    for q in questions:
        q_num = int(q["id"].split("-")[-1])
        if q_num in answer_key:
            q["answer"] = answer_key[q_num]
    
    answered = sum(1 for q in questions if q["answer"] != "A" or int(q["id"].split("-")[-1]) in answer_key)
    print(f"With answer keys: {answered}")
    
    # Load existing mathematics.json
    existing = []
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH, 'r', encoding='utf-8') as f:
            existing = json.load(f)
        print(f"Existing questions: {len(existing)}")
    
    # Remove any previous practice1 questions
    seed = [q for q in existing if 'practice1' not in q['id']]
    
    # Combine
    combined = seed + questions
    
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(combined, f, indent=4, ensure_ascii=False)
    
    print(f"Total questions saved: {len(combined)} ({len(seed)} existing + {len(questions)} new)")
    
    # Show topic distribution
    topics = {}
    for q in questions:
        topics[q["topic"]] = topics.get(q["topic"], 0) + 1
    print(f"Topics: {topics}")
    
    doc.close()

if __name__ == "__main__":
    main()
