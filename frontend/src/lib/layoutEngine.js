export const applyAutoLayout = (canvas, type = 'z-pattern') => {
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const objects = canvas.getObjects();

    // Separate objects by type/role (heuristic)
    const images = objects.filter(o => o.type === 'image');
    const texts = objects.filter(o => o.type === 'i-text' || o.type === 'text');
    const shapes = objects.filter(o => o.type === 'rect' || o.type === 'circle');

    // Margins (10%)
    const marginX = width * 0.1;
    const marginY = height * 0.1;
    const safeWidth = width - (marginX * 2);
    const safeHeight = height - (marginY * 2);

    // Heuristic: Largest image is packshot/background
    let mainImage = null;
    if (images.length > 0) {
        mainImage = images.reduce((prev, current) => (prev.width * prev.scaleX) > (current.width * current.scaleX) ? prev : current);
    }

    // Heuristic: Largest text is Headline, second is Subhead/CTA
    texts.sort((a, b) => (b.fontSize * b.scaleY) - (a.fontSize * a.scaleY));
    const headline = texts[0];
    const subhead = texts[1];
    const cta = texts[2]; // Or look for button-like shapes

    if (type === 'z-pattern') {
        // Z-Pattern Layout
        // Top-Left: Logo (if any, assume smallest image or specific name)
        // Top-Right: Secondary info
        // Center/Right: Main Image
        // Bottom-Left: Headline & CTA

        if (mainImage) {
            // Position Main Image on the right side
            const imgScale = Math.min(safeWidth * 0.5 / mainImage.width, safeHeight * 0.8 / mainImage.height);
            mainImage.scale(imgScale);
            mainImage.set({
                left: width - (mainImage.width * imgScale) - marginX,
                top: (height - (mainImage.height * imgScale)) / 2,
                originX: 'left',
                originY: 'top'
            });
        }

        let currentTop = marginY + (height * 0.2); // Start a bit down

        if (headline) {
            headline.set({
                left: marginX,
                top: currentTop,
                originX: 'left',
                originY: 'top',
                textAlign: 'left'
            });
            // Scale text if too wide
            if (headline.width * headline.scaleX > safeWidth * 0.5) {
                headline.scaleToWidth(safeWidth * 0.5);
            }
            currentTop += (headline.height * headline.scaleY) + 20;
        }

        if (subhead) {
            subhead.set({
                left: marginX,
                top: currentTop,
                originX: 'left',
                originY: 'top',
                textAlign: 'left'
            });
            if (subhead.width * subhead.scaleX > safeWidth * 0.5) {
                subhead.scaleToWidth(safeWidth * 0.5);
            }
            currentTop += (subhead.height * subhead.scaleY) + 40;
        }

        if (cta) {
            cta.set({
                left: marginX,
                top: currentTop,
                originX: 'left',
                originY: 'top',
                backgroundColor: '#000000', // Example styling
                fill: '#ffffff',
                padding: 10
            });
        }
    } else if (type === 'rule-of-thirds') {
        // Rule of Thirds
        // Place main image at intersection points
        // Place text at opposite intersection points

        const thirdX = width / 3;
        const thirdY = height / 3;

        if (mainImage) {
            // Center main image on right vertical line
            const imgScale = Math.min(thirdX * 1.5 / mainImage.width, height * 0.8 / mainImage.height);
            mainImage.scale(imgScale);
            mainImage.set({
                left: (thirdX * 2) - ((mainImage.width * imgScale) / 2),
                top: thirdY,
                originX: 'left',
                originY: 'center'
            });
        }

        if (headline) {
            // Center headline on left vertical line
            headline.set({
                left: thirdX,
                top: thirdY,
                originX: 'center',
                originY: 'bottom',
                textAlign: 'center'
            });
        }
    }

    canvas.requestRenderAll();
};
