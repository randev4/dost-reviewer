/**
 * KaTeX rendering utility
 * Bundles KaTeX and its CSS locally for reliable, offline, and cross-browser math rendering
 */
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Render text with inline LaTeX ($...$) and display LaTeX ($$...$$)
 * Synchronous version
 */
export function renderLatexSync(text) {
    if (!text) return '';

    // Step 1: Extract math tokens ($$...$$ and $...$) so math contents are preserved
    const mathTokens = [];
    let placeholderText = text.replace(/(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g, (match) => {
        const token = `___MATH_${mathTokens.length}___`;
        mathTokens.push(match);
        return token;
    });

    // Step 2: Convert LaTeX line breaks (\\) and step separators (//) outside math to newlines
    placeholderText = placeholderText.replace(/\\\\+/g, '\n');
    placeholderText = placeholderText.replace(/\\newline\b/gi, '\n');
    placeholderText = placeholderText.replace(/(?<!https?:)\/\/\s*/g, '\n');

    // Step 3: Replace literal '\n' and actual newlines with <br> on text outside math
    placeholderText = placeholderText.replace(/(?:\r\n|\r|\n|\\n)/g, '<br>');

    // Step 4: Render KaTeX math into placeholders (preserves SVG paths and newlines inside math intact)
    const result = placeholderText.replace(/___MATH_(\d+)___/g, (_, idStr) => {
        const idx = parseInt(idStr, 10);
        const rawMath = mathTokens[idx];
        const isDisplay = rawMath.startsWith('$$');
        const expr = isDisplay ? rawMath.slice(2, -2).trim() : rawMath.slice(1, -1).trim();
        try {
            return katex.renderToString(expr, { displayMode: isDisplay, throwOnError: false });
        } catch {
            return escapeHtml(rawMath);
        }
    });

    return result;
}

/**
 * Render explanation with neat vertical structure, separation lines, and vertical equations.
 * Converts '\\' and '//' outside math into neat step-by-step lines.
 * Promotes standalone equations into vertically stacked display math blocks.
 */
export function renderExplanationSync(text) {
    if (!text) return '';

    // Step 1: Extract math tokens ($$...$$ and $...$)
    const mathTokens = [];
    let placeholderText = text.replace(/(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g, (match) => {
        const token = `___MATH_${mathTokens.length}___`;
        mathTokens.push(match);
        return token;
    });

    // Step 2: Normalize separation lines and line breaks outside math
    placeholderText = placeholderText.replace(/\\\\+/g, '\n');
    placeholderText = placeholderText.replace(/\\newline\b/gi, '\n');
    placeholderText = placeholderText.replace(/(?<!https?:)\/\/\s*/g, '\n');
    placeholderText = placeholderText.replace(/(?:\r\n|\r|\\n)/g, '\n');

    let rawLines = placeholderText.split('\n').map(l => l.trim()).filter(Boolean);

    // If there's only 1 line, check if it contains bullet points or "Step X:"
    if (rawLines.length === 1) {
        const single = rawLines[0];
        if (single.includes('•') || single.includes(' - ')) {
            rawLines = single.split(/(?:•|\s+-\s+)/).map(l => l.trim()).filter(Boolean);
        } else if (/\bStep\s+\d+:?/i.test(single)) {
            rawLines = single.split(/(?=\bStep\s+\d+:?)/i).map(l => l.trim()).filter(Boolean);
        }
    }

    const htmlSteps = rawLines.map(line => {
        // Case 1: Line is purely an equation (e.g. ___MATH_0___ or ___MATH_0___.)
        const singleMathMatch = line.match(/^(___MATH_\d+___)[.:]?$/);
        if (singleMathMatch) {
            const token = singleMathMatch[1];
            const idx = parseInt(token.replace('___MATH_', '').replace('___', ''), 10);
            let rawMath = mathTokens[idx];
            // Promote inline math to display math for vertical presentation
            if (rawMath.startsWith('$') && !rawMath.startsWith('$$')) {
                rawMath = '$$' + rawMath.slice(1, -1).trim() + '$$';
            }
            const expr = rawMath.slice(2, -2).trim();
            try {
                return `<div class="equation-display">${katex.renderToString(expr, { displayMode: true, throwOnError: false })}</div>`;
            } catch {
                return `<div class="equation-display">${escapeHtml(expr)}</div>`;
            }
        }

        // Case 2: Line is a label followed directly by an equation, e.g. "Formula: ___MATH_0___"
        const labelMathMatch = line.match(/^((?:Step\s+\d+:?|Formula:?|Given:?|Solution:?|Therefore:?|Recall:?|Substitute(?: the values)?:?|Note:?))\s*(___MATH_\d+___)[.:]?$/i);
        if (labelMathMatch) {
            const label = labelMathMatch[1];
            const token = labelMathMatch[2];
            const idx = parseInt(token.replace('___MATH_', '').replace('___', ''), 10);
            let rawMath = mathTokens[idx];
            if (rawMath.startsWith('$') && !rawMath.startsWith('$$')) {
                rawMath = '$$' + rawMath.slice(1, -1).trim() + '$$';
            }
            const expr = rawMath.slice(2, -2).trim();
            try {
                const renderedMath = katex.renderToString(expr, { displayMode: true, throwOnError: false });
                return `<div class="explanation-step"><strong class="explanation-step-label">${label}</strong><div class="equation-display">${renderedMath}</div></div>`;
            } catch {
                return `<div class="explanation-step"><strong class="explanation-step-label">${label}</strong><div class="equation-display">${escapeHtml(expr)}</div></div>`;
            }
        }

        // Case 3: Line contains mixed text and math
        let renderedLine = line.replace(/___MATH_(\d+)___/g, (_, idStr) => {
            const idx = parseInt(idStr, 10);
            const rawMath = mathTokens[idx];
            const isDisplay = rawMath.startsWith('$$');
            const expr = isDisplay ? rawMath.slice(2, -2).trim() : rawMath.slice(1, -1).trim();
            try {
                return katex.renderToString(expr, { displayMode: isDisplay, throwOnError: false });
            } catch {
                return escapeHtml(rawMath);
            }
        });

        // Highlight step markers and option letters (A), B), 1., Step 1:, etc.)
        renderedLine = renderedLine.replace(
            /^((?:[A-D]\)|[1-9]\.|\bStep\s+\d+:?|Formula:?|Given:?|Solution:?|Therefore:?|Recall:?|Substitute(?: the values)?:?|Note:?|To rationalize[^:]*:?))\s*/i, 
            '<strong class="explanation-step-label">$1</strong> '
        );

        return `<div class="explanation-step">${renderedLine}</div>`;
    });

    return `<div class="explanation-container">${htmlSteps.join('')}</div>`;
}

/**
 * Render text with inline LaTeX ($...$) and display LaTeX ($$...$$)
 * Returns HTML string (async for backward compatibility with callers)
 */
export async function renderLatex(text) {
    return renderLatexSync(text);
}

/**
 * Render explanation with structured steps and vertical equations (async)
 */
export async function renderExplanation(text) {
    return renderExplanationSync(text);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/** Pre-load KaTeX warm-up (already bundled locally) */
export function preloadKaTeX() {
    try {
        katex.renderToString('1', { throwOnError: false });
    } catch {
        // ignore
    }
}

