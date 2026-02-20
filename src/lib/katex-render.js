/**
 * KaTeX rendering utility
 * Renders LaTeX expressions within text content
 */

let katexLoaded = false;
let katexPromise = null;

/** Load KaTeX CSS dynamically */
function loadKaTeXCSS() {
    if (document.querySelector('link[href*="katex"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);
}

/** Load KaTeX JS dynamically */
function loadKaTeX() {
    if (katexPromise) return katexPromise;
    loadKaTeXCSS();
    katexPromise = new Promise((resolve) => {
        if (window.katex) { katexLoaded = true; resolve(); return; }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
        script.onload = () => { katexLoaded = true; resolve(); };
        script.onerror = () => { resolve(); }; // graceful degrade
        document.head.appendChild(script);
    });
    return katexPromise;
}

/**
 * Render text with inline LaTeX ($...$) and display LaTeX ($$...$$)
 * Returns HTML string.
 */
export async function renderLatex(text) {
    if (!text) return '';
    if (!text.includes('$')) return escapeHtml(text);

    await loadKaTeX();
    if (!window.katex) return escapeHtml(text);

    // Replace display math first ($$...$$)
    let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => {
        try {
            return window.katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false });
        } catch {
            return escapeHtml(expr);
        }
    });

    // Replace inline math ($...$)
    result = result.replace(/\$([^\$]+?)\$/g, (_, expr) => {
        try {
            return window.katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
        } catch {
            return escapeHtml(expr);
        }
    });

    return result;
}

/** Synchronous version — returns plain text if KaTeX not loaded */
export function renderLatexSync(text) {
    if (!text) return '';
    if (!text.includes('$')) return escapeHtml(text);
    if (!window.katex) return escapeHtml(text);

    let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => {
        try {
            return window.katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false });
        } catch { return escapeHtml(expr); }
    });

    result = result.replace(/\$([^\$]+?)\$/g, (_, expr) => {
        try {
            return window.katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
        } catch { return escapeHtml(expr); }
    });

    return result;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/** Pre-load KaTeX on app start */
export function preloadKaTeX() {
    loadKaTeX();
}
