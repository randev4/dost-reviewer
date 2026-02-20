/**
 * Image Lightbox — Tap-to-zoom for question & choice images.
 * Call bindImageZoom() after rendering DOM with images.
 */

export function openLightbox(src, alt = 'Image') {
    // Remove existing lightbox if any
    closeLightbox();

    const overlay = document.createElement('div');
    overlay.className = 'image-lightbox';
    overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Close">×</button>
        <img src="${src}" alt="${alt}" />
    `;

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
            closeLightbox();
        }
    });

    // Close on Escape key
    const handleKey = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleKey);
        }
    };
    document.addEventListener('keydown', handleKey);

    document.body.appendChild(overlay);
}

export function closeLightbox() {
    const existing = document.querySelector('.image-lightbox');
    if (existing) existing.remove();
}

/**
 * Bind click-to-zoom on all question and choice images in the current DOM.
 * Call this after rendering quiz or results content.
 */
export function bindImageZoom() {
    document.querySelectorAll('.question-image, .choice-image').forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(img.src, img.alt);
        });
    });
}
