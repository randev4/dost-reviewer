# Archived Scripts & Processing Files

This folder contains all the obsolete scripts, temporary logs, and generated outputs that were used to create the original DOST reviewer dataset. These files are no longer needed for the daily operation of the live study application or the admin dashboard. 

They have been archived here for reference purposes, in case you need to see exactly how the PDF parsing, AI prompt engineering, and image mapping were implemented.

## File Categories

### 1. Python Extraction Scripts
*(Originally used to scrape raw text and image placeholders from source PDFs)*
- `extract_blocks.py`, `extract_questions.py`, `extract_images.py`, `extract_math_practice.py`
- `temp_mech_script.py`, `temp_script.py`, `analyze.py`

### 2. Node.js Data Processing & Enrichment
*(Used to pipe raw text through the Gemini AI for LaTeX formatting and explanation generation)*
- `update_math1.cjs` to `update_math5.cjs`, `update_mat2020.cjs`
- `test_prompt.cjs`, `list_models.cjs` (Prototyping API calls).
- `auto_qa.cjs` (Automated review testing).

### 3. Image Mapping & Alignment
*(Used to algorithmically link isolated diagrams to their corresponding JSON questions via Vision AI)*
- `label_images.cjs`, `label_mechanical_images.cjs` 
- `map_mechanical.cjs`, `apply_perfect_mapping.cjs`, `apply_mech_perfect_mapping.cjs`
- `fix_science_images.cjs`, `fix_science_images.js`, `verify_science_images.cjs`

### 4. Temporary Logs & Test Outputs
*(Intermediate files generated during the pipeline)*
- **From Text Processing:** `extracted.txt`, `temp_mech_blocks.txt`, `math_test_raw.txt`, `analysis_output.txt`
- **From Image Parsing/Verification:** `image_manifest.json`, `image_descriptions.txt`, `mechanical_image_descriptions.txt`, `verify_output.txt`, `verify_output_utf8.txt`, `log.txt`, and various small `temp_*.txt` tracking files.
- **QA Outliers:** `bad_latex.json`, `debug_subset.json`, `mat-issues.json`
- **Raw Image Exports:** Assorted `math_pdf_page*.png` files generated during extraction before being compressed and moved.

**Note:** For a comprehensive overview of how these pieces fit together into the overall workflow, please read the `project_creation_workflow.md` document in the root directory.
