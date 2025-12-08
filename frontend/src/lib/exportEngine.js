export const exportCanvas = (canvas, format = 'png', quality = 1.0) => {
    return new Promise((resolve) => {
        if (!canvas) return resolve(null);

        // Initial export
        let dataURL = canvas.toDataURL({
            format: format,
            quality: quality,
            multiplier: 2 // Retina export by default, will downscale if needed
        });

        // Check size
        let sizeInBytes = (dataURL.length * 3) / 4;
        const maxSize = 500 * 1024; // 500KB

        if (sizeInBytes <= maxSize) {
            downloadImage(dataURL, `creative.${format}`);
            resolve(dataURL);
            return;
        }

        // Compression Loop
        const compress = (currentQuality, currentMultiplier) => {
            dataURL = canvas.toDataURL({
                format: 'jpeg', // Force JPEG for compression if PNG is too big
                quality: currentQuality,
                multiplier: currentMultiplier
            });

            sizeInBytes = (dataURL.length * 3) / 4;

            if (sizeInBytes <= maxSize || currentQuality < 0.1) {
                downloadImage(dataURL, `creative.jpeg`); // Note: changed extension
                resolve(dataURL);
            } else {
                // Reduce quality or multiplier
                if (currentQuality > 0.5) {
                    compress(currentQuality - 0.1, currentMultiplier);
                } else {
                    compress(currentQuality, currentMultiplier * 0.8);
                }
            }
        };

        // Start compression if too big
        compress(0.8, 1.5);
    });
};

const downloadImage = (dataURL, filename) => {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
