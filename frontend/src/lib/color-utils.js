import ColorThief from 'colorthief';

export const extractColors = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl + '?t=' + new Date().getTime();

        img.onload = () => {
            const colorThief = new ColorThief();
            try {
                // Get palette of 5 colors
                const palette = colorThief.getPalette(img, 5);
                resolve(palette);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = (error) => {
            reject(error);
        };
    });
};

export const generateGradientFromColors = (colors) => {
    if (!colors || colors.length === 0) {
        return 'radial-gradient(circle at 10% 20%, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 90%)';
    }

    // Convert RGB arrays to CSS strings
    const colorStrings = colors.map(rgb => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);

    // Create a complex, rich gradient
    // We'll use the first color as a primary accent, and mix others for depth
    const [c1, c2, c3] = colorStrings;

    return `
    radial-gradient(at 0% 0%, ${c1} 0px, transparent 50%),
    radial-gradient(at 100% 0%, ${c2} 0px, transparent 50%),
    radial-gradient(at 100% 100%, ${c3} 0px, transparent 50%),
    radial-gradient(at 0% 100%, ${c1} 0px, transparent 50%),
    linear-gradient(to bottom right, #111827, #000000)
  `;
};
