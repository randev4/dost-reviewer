# DOST Reviewer Codebase: Process & Tooling Workflow

This document records the end-to-end process, tools, and scripts used to construct the entire `dost-reviewer` codebase. The primary goal of this document is to serve as a roadmap so that the same methodology can be replicated, scaled, or improved upon for future projects.

## Overview of the Workflow

The creation and refinement of the DOST reviewer database followed a four-stage pipeline:
1. **Raw Extraction:** Extracting raw text and images from source PDF files.
2. **AI-Assisted Structuring & Enrichment:** Utilizing Generative AI (Google Gemini) to transform raw, noisy text into clean, structured JSON, complete with LaTeX math formatting and contextually generated explanations.
3. **Image Alignment & Verification:** Labeling extracted diagrams/images using Vision AI models and algorithmically mapping them to the corresponding questions.
4. **Manual Review & Auto-Deployment:** Establishing a local graphical administrative interface to manually review QA data, fix residual errors, and synchronize changes directly to the remote repository.

---

## Stage 1: Raw Extraction

The first challenge was getting the data out of the non-machine-readable PDFs and into a raw text format.

### Tools & Scripts Used:
- **`extract_blocks.py` & `extract_questions.py`**
  - **Purpose:** These Python scripts utilize the `PyMuPDF` (`fitz`) library to programmatically scrape text block by block from the reference PDFs located in the `references/` folder.
  - **Process:** The scripts iterate through specified page ranges, discriminating between text logic branches (`type == 0`) and images/diagrams (`type == 1`). Text was written to files, while images were tracked by placeholder names (e.g., `[IMAGE_51_0]`).
  - **Temporary Scripts (`temp_script.py`, `temp_mech_script.py`)**: Used for ad-hoc, quick-and-dirty extraction of specific sections (like mechanical or science blocks) as the need arose during development.

### Outputs:
- Extracted chunks of text (e.g., `extract.txt`, `temp_mech_blocks.txt`, `math_test_raw.txt`).
- Extracted raw images exported to the file system (e.g. `math_pdf_page1.png`).

---

## Stage 2: AI-Assisted Structuring & Enrichment

Once the raw text was available, it was often riddled with OCR errors, lost math symbol formatting, and lacked explanations. We used AI scripts extensively to clean and structure it into standard JSON.

### Tools & Scripts Used:
- **`update_math1.cjs` to `update_math5.cjs`, and `update_mat2020.cjs`**
  - **Purpose:** To fix garbled text, rebuild mathematical expressions using consistent LaTeX formatting, and augment questions with correct answers and explanations.
  - **Process:** We processed the database in batches. The AI (or manual structured updates guided by AI) reconstructed the questions and provided perfect LaTeX representations in fields like `questionLatex` and `explanationLatex`. The scripts mapped these updates directly back to `src/data/mathematics.json`.
- **`auto_qa.cjs`**
  - **Purpose:** Automated Question-Answering checks. A script likely intended to run questions back through the language model to verify if the parsed data made logical sense or if the marked 'correct answer' naturally aligned with AI-derived physics/math principles.
- **`test_prompt.cjs` & `list_models.cjs`**
  - **Purpose:** Used to prototype the Gemini API structure, find exactly the right prompt parameters (like `temperature: 0.1` for deterministic answers), and verify which API models successfully authenticated.

### Outputs:
- Refined, clean databases in `src/data/` (e.g. `science.json`, `mathematics.json`).
- Outlier tracking files identifying bad data needing manual review (e.g., `bad_latex.json`, `mat-issues.json`).

---

## Stage 3: Image Alignment & Verification

PDF diagrams were isolated from the text they belonged to. We built a subsystem to automatically interpret images and attach them to the correct JSON question.

### Tools & Scripts Used:
- **`label_images.cjs` & `label_mechanical_images.cjs`**
  - **Purpose:** Leveraged the `gemini-2.5-flash` model with vision capabilities to look at every exported image (`public/images/questions/*.png`) and generate a single descriptive sentence (e.g., "A displacement vs time graph").
  - **Outputs:** Wrote mapping logs to `image_descriptions.txt` and `mechanical_image_descriptions.txt`.
- **`map_mechanical.cjs`, `apply_perfect_mapping.cjs`, `apply_mech_perfect_mapping.cjs`**
  - **Purpose:** Using the AI-generated descriptions and the text of the questions, these scripts performed fuzzy-matching to logically map the standalone images to the specific JSON Question ID. The `apply_perfect_mapping.cjs` specifically hardcoded 100% verified mappings into the live `src/data/science.json` file.
- **`fix_science_images.cjs` & `verify_science_images.cjs`**
  - **Purpose:** Auditing tools to ensure image paths didn't 404 and that placeholders matched actual physical files remaining in the `images/questions` directory. Outputted results to `verify_output.txt`.

---

## Stage 4: Manual Review & Auto-Deployment

Because AI extraction and OCR are never 100% flawless, a visual admin interface was built into the app itself.

### Tools & Scripts Used:
- **`admin.html` & `admin.css`**
  - **Purpose:** A frontend graphical tool allowing a human operator to review the JSON data question-by-question, visually verifying LaTeX rendering and evaluating AI-generated explanations.
- **`sync_server.cjs`**
  - **Purpose:** A local WebSocket/HTTP server running alongside the frontend. 
  - **Features:** 
    - **Live Editing:** Allowed the `admin.html` page to make changes, immediately writing them to `src/data/*.json`. 
    - **Image Upload:** Intercepted pasted screenshot images from the admin dashboard and saved them directly to the `public/images/questions` folder.
    - **Git Integration:** Contains an auto-deployment routine that uses Node's `child_process.execSync` to run `git add`, `git commit`, and `git push` directly from the web interface, effortlessly shipping reviewed changes to Netlify.
- **`ai_server.cjs`**
  - **Purpose:** An active local backend server complementing the admin portal. When the operator clicked "Generate Explanation" in the GUI for a question missing one, this server handled the direct request to Gemini and fed the result back to the browser.

---

## Summary for Future Replicability

If you're starting a new question-bank processing project, you can replicate this success by following these exact sequential steps:

1. **Dump Text & Images:** Write a Python script to isolate text blocks from PDFs, saving images out individually.
2. **AI Text Parsing:** Setup Node.js scripts to pipe raw text blocks through an LLM, asking it to output strictly typed JSON (Question, Choices, Correct Answer, Explanation).
3. **AI Vision Tagging:** Pipe the isolated images through a Vision LLM to get plain-text descriptions of the diagrams.
4. **Relational Mapping:** Write a script or give the AI the question text and image descriptions, asking it to match them together.
5. **Human-in-the-Loop Admin:** Don't rely purely on scripts. Build a quick frontend connected to a local Node filesystem server so you can click, edit, paste images, and visualize mathematical formatting. 
6. **One-Click Deploy:** Expose a git script to your admin panel so that every manual review session can instantly be pushed to production.
