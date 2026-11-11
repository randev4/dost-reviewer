/**
 * generate_and_apply_explanations.cjs
 *
 * 1. Generates pedagogical explanations for DOST-SEI 1001 Science and Mathematics items using OpenRouter (google/gemini-2.5-flash).
 * 2. Writes the generated explanations to Markdown documents in `explanations/`.
 * 3. Parses the markdown data and updates `src/data/science.json` and `src/data/mathematics.json`.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error('❌ Error: OPENROUTER_API_KEY is missing from .env');
  process.exit(1);
}

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash';
const BATCH_SIZE = 8;
const CONCURRENCY = 3;

// CLI flags
const args = process.argv.slice(2);
const subjectFilter = args.find(a => a.startsWith('--subject='))?.split('=')[1] || 'all';
const markdownOnly = args.includes('--markdown-only');
const applyOnly = args.includes('--apply-only');
const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];
const limit = limitArg ? parseInt(limitArg, 10) : Infinity;

const EXPLANATIONS_DIR = path.resolve(__dirname, '../explanations');
if (!fs.existsSync(EXPLANATIONS_DIR)) {
  fs.mkdirSync(EXPLANATIONS_DIR, { recursive: true });
}

const SYSTEM_PROMPT = `You are an expert STEM educator and scholarship exam coach preparing senior high school students in the Philippines for the DOST-SEI Undergraduate Scholarship Examination.

Your task is to write high-quality, pedagogical explanations for multiple-choice questions.

For each item:
1. Provide a clear, step-by-step pedagogical explanation (1-3 sentences) showing why the designated answer key is correct.
2. For Mathematics: Show algebraic steps, calculations, formulas, or geometric reasoning clearly. Use LaTeX syntax ($...$) for all math expressions, variables, operations, and numbers in equations (e.g., $x^2 + 5x + 6 = 0$).
3. For Science: Explain the underlying scientific concept, mechanism, formula, or law (e.g., cellular respiration, Newton's laws, stoichiometry, Mendelian genetics, plate tectonics, orbital mechanics). Use LaTeX syntax ($...$) for chemical formulas (e.g., $\\text{CO}_2$), physics equations (e.g., $F = ma$), and units.
4. Do NOT use filler phrases like "The correct answer is C because...". Directly explain the concept and derivation.
5. Be strictly accurate to the provided answer key.

Format your output EXACTLY as follows for each item:

### ITEM: dost1001-XXXX
EXPLANATION: [Your 1-3 sentence pedagogical explanation with LaTeX here]

Do not include any other markdown headers or preamble.`;

// Helper: load existing explanations from markdown to support resuming
function loadExistingMarkdown(mdPath) {
  const map = new Map();
  if (!fs.existsSync(mdPath)) return map;
  const content = fs.readFileSync(mdPath, 'utf8');
  const sections = content.split(/^##\s+/m);
  for (const sec of sections) {
    if (!sec.trim()) continue;
    const lines = sec.trim().split('\n');
    const id = lines[0].trim();
    if (!id.startsWith('dost1001-')) continue;
    
    // Find explanation line
    const expMatch = sec.match(/\*\*Explanation:\*\*\s*([\s\S]*?)(?=\n\n\*\*|\n\n---|\n\n##|$)/);
    if (expMatch) {
      const exp = expMatch[1].trim();
      if (exp && !exp.startsWith('Correct answer is') && !exp.startsWith('*(No explanation')) {
        map.set(id, exp);
      }
    }
  }
  return map;
}

// Helper: write all explanations for a subject to markdown
function saveToMarkdown(subjectName, items, explanationsMap, mdPath) {
  let md = `# DOST-SEI 1001 — ${subjectName.toUpperCase()} Explanations\n\n`;
  md += `*Generated for DOST-SEI Scholarship Reviewer*\n`;
  md += `*Total Items: ${items.length} | Explained: ${explanationsMap.size}*\n\n`;
  md += `---\n\n`;

  for (const item of items) {
    const exp = explanationsMap.get(item.id) || item.explanation || '*(No explanation generated yet)*';
    md += `## ${item.id}\n\n`;
    md += `- **Topic:** ${item.topic} | **Difficulty Level:** ${item.difficulty}\n`;
    md += `- **Question:** ${item.question}\n`;
    if (item.image) {
      md += `- **Image:** \`${item.image}\`\n`;
    }
    md += `- **Choices:**\n`;
    for (const c of item.choices) {
      md += `  - **${c.key}:** ${c.text}\n`;
    }
    const correctChoice = item.choices.find(c => c.key === item.answer);
    md += `- **Answer Key:** **${item.answer}** (${correctChoice ? correctChoice.text : ''})\n`;
    md += `\n**Explanation:**\n${exp}\n\n`;
    md += `---\n\n`;
  }

  fs.writeFileSync(mdPath, md, 'utf8');
}

// Call OpenRouter API for a batch using structured text format
async function fetchBatchExplanations(batch, retries = 3) {
  const itemsPrompt = batch.map(q => 
    `ID: ${q.id}\nTopic: ${q.topic}\nQuestion: ${q.question}\nChoices: ${q.choices.map(c => `${c.key}) ${c.text}`).join(' | ')}\nAnswer: ${q.answer}`
  ).join('\n\n');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/dost-reviewer',
          'X-Title': 'DOST Reviewer Explanation Generator'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: itemsPrompt }
          ],
          temperature: 0.1
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error('Empty response from model');

      const resultMap = new Map();
      const itemBlocks = rawContent.split(/###\s*ITEM:\s*/i).filter(Boolean);
      for (const block of itemBlocks) {
        const lines = block.trim().split('\n');
        const id = lines[0].trim();
        const expMatch = block.match(/EXPLANATION:\s*([\s\S]*?)(?=(?:###\s*ITEM:|$))/i);
        if (id && expMatch) {
          resultMap.set(id, expMatch[1].trim());
        }
      }

      // Check if any items in batch are missing
      for (const q of batch) {
        if (!resultMap.has(q.id)) {
          // Fallback regex search in raw content
          const fallbackRegex = new RegExp(`${q.id}[\\s\\S]*?EXPLANATION:\\s*([\\s\\S]*?)(?=(?:###|ID:|dost1001-|$))`, 'i');
          const fbMatch = rawContent.match(fallbackRegex);
          if (fbMatch) {
            resultMap.set(q.id, fbMatch[1].trim());
          }
        }
      }

      return resultMap;
    } catch (err) {
      console.warn(`  ⚠️ Attempt ${attempt} failed for batch starting with ${batch[0].id}: ${err.message}`);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1500 * attempt));
      } else {
        console.error(`  ❌ Failed all ${retries} attempts for batch starting with ${batch[0].id}`);
        return new Map();
      }
    }
  }
  return new Map();
}

async function processSubject(subjectKey, subjectName) {
  const jsonPath = path.resolve(__dirname, `../src/data/${subjectKey}.json`);
  const mdPath = path.resolve(EXPLANATIONS_DIR, `dost1001-${subjectKey}.md`);

  console.log(`\n==================================================`);
  console.log(`📚 Processing ${subjectName} (${subjectKey})`);
  console.log(`==================================================`);

  const allItems = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const dostItems = allItems.filter(q => q.id.startsWith('dost1001-'));
  console.log(`Total DOST-1001 items in ${subjectKey}: ${dostItems.length}`);

  // Load any existing explanations from markdown to support resume
  const explanationsMap = loadExistingMarkdown(mdPath);
  console.log(`Existing explanations in markdown: ${explanationsMap.size}`);

  if (!applyOnly) {
    // Filter items that need explanations
    const pendingItems = dostItems.filter(q => {
      if (explanationsMap.has(q.id)) return false;
      const curExp = q.explanation || '';
      return !curExp || curExp.startsWith('Correct answer is ') || curExp.trim() === '';
    });

    console.log(`Pending items to generate: ${pendingItems.length}`);

    // Apply limit if specified
    const itemsToProcess = pendingItems.slice(0, Math.min(pendingItems.length, limit));
    if (itemsToProcess.length > 0) {
      console.log(`Generating explanations for ${itemsToProcess.length} items (Batch size: ${BATCH_SIZE}, Concurrency: ${CONCURRENCY})...`);

      // Chunk into batches
      const batches = [];
      for (let i = 0; i < itemsToProcess.length; i += BATCH_SIZE) {
        batches.push(itemsToProcess.slice(i, i + BATCH_SIZE));
      }

      let completedBatches = 0;
      let newlyGeneratedCount = 0;

      // Process with concurrency pool
      async function runWorker(workerId, batchQueue) {
        while (batchQueue.length > 0) {
          const batch = batchQueue.shift();
          const batchStartId = batch[0].id;
          const batchEndId = batch[batch.length - 1].id;

          const results = await fetchBatchExplanations(batch);
          for (const [id, exp] of results.entries()) {
            explanationsMap.set(id, exp);
            newlyGeneratedCount++;
          }

          completedBatches++;
          const percent = ((completedBatches / batches.length) * 100).toFixed(1);
          console.log(`  [${percent}%] Batch ${completedBatches}/${batches.length} (${batchStartId}..${batchEndId}) -> ${results.size} exps generated`);

          // Incremental markdown save every 5 batches
          if (completedBatches % 5 === 0) {
            saveToMarkdown(subjectName, dostItems, explanationsMap, mdPath);
          }

          await new Promise(r => setTimeout(r, 200));
        }
      }

      const queue = [...batches];
      const workers = Array.from({ length: CONCURRENCY }, (_, i) => runWorker(i + 1, queue));
      await Promise.all(workers);

      // Save final markdown
      saveToMarkdown(subjectName, dostItems, explanationsMap, mdPath);
      console.log(`✅ Saved markdown to ${path.relative(process.cwd(), mdPath)}`);
      console.log(`✨ Total newly generated in this run: ${newlyGeneratedCount}`);
    }
  }

  // Update JSON if requested
  if (!markdownOnly) {
    console.log(`\n🔄 Applying explanations from markdown to ${subjectKey}.json...`);

    // Create backup first
    const backupDir = path.resolve(__dirname, `../src/data/backups/backup-before-explanations-${new Date().toISOString().replace(/[:.]/g, '-')}`);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    fs.copyFileSync(jsonPath, path.join(backupDir, `${subjectKey}.json`));
    console.log(`  📁 Backup created at ${path.relative(process.cwd(), backupDir)}`);

    let appliedCount = 0;
    const updatedItems = allItems.map(q => {
      if (q.id.startsWith('dost1001-') && explanationsMap.has(q.id)) {
        const exp = explanationsMap.get(q.id);
        const updated = { ...q, explanation: exp };
        if (exp.includes('$')) {
          updated.explanationLatex = exp;
        }
        appliedCount++;
        return updated;
      }
      return q;
    });

    fs.writeFileSync(jsonPath, JSON.stringify(updatedItems, null, 2), 'utf8');
    console.log(`  ✅ Successfully updated ${appliedCount} items in ${subjectKey}.json!`);
  }
}

async function main() {
  const subjectsToRun = [];
  if (subjectFilter === 'all' || subjectFilter === 'science') {
    subjectsToRun.push({ key: 'science', name: 'Science' });
  }
  if (subjectFilter === 'all' || subjectFilter === 'mathematics' || subjectFilter === 'math') {
    subjectsToRun.push({ key: 'mathematics', name: 'Mathematics' });
  }

  const startTime = Date.now();
  console.log(`🚀 DOST-SEI 1001 Explanation Generator & Markdown Pipeline Started`);
  console.log(`Subjects: ${subjectsToRun.map(s => s.name).join(', ')}`);
  console.log(`Mode: ${markdownOnly ? 'Markdown Only' : applyOnly ? 'Apply Only' : 'Generate & Apply'}`);
  if (limitArg) console.log(`Limit: ${limit} items per subject`);

  for (const s of subjectsToRun) {
    await processSubject(s.key, s.name);
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 All tasks completed in ${durationSec}s!`);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
