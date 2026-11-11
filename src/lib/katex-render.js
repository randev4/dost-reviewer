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
    if (!text.includes('$')) return escapeHtml(text).replace(/(?:\r\n|\r|\n|\\n)/g, '<br>');

    // Replace display math first ($$...$$)
    let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => {
        try {
            return katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false });
        } catch {
            return escapeHtml(expr);
        }
    });

    // Replace inline math ($...$)
    result = result.replace(/\$([^\$]+?)\$/g, (_, expr) => {
        try {
            return katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
        } catch {
            return escapeHtml(expr);
        }
    });

    // Replace literal '\n' and actual newlines with <br>
    result = result.replace(/(?:\r\n|\r|\n|\\n)/g, '<br>');

    return result;
}

/**
 * Render text with inline LaTeX ($...$) and display LaTeX ($$...$$)
 * Returns HTML string (async for backward compatibility with callers)
 */
export async function renderLatex(text) {
    return renderLatexSync(text);
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

