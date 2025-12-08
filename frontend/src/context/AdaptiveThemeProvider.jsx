import React, { createContext, useContext, useEffect, useState } from 'react';
import { extractColors } from '@/lib/color-utils';
import { useCreativeStore } from '@/store/useCreativeStore';

const ThemeContext = createContext();

export const AdaptiveThemeProvider = ({ children }) => {
    const { creative } = useCreativeStore();
    const [themeColor, setThemeColor] = useState({ r: 99, g: 102, b: 241 }); // Default Indigo

    useEffect(() => {
        const updateTheme = async () => {
            // Find the first image asset to base the theme on
            const mainImage = creative.assets.find(a => a.type === 'image' || a.role === 'packshot');

            if (mainImage) {
                try {
                    const colors = await extractColors(mainImage.url);
                    // Use the dominant color (first one)
                    const [r, g, b] = colors[0];
                    setThemeColor({ r, g, b });

                    // Update CSS Variables
                    document.documentElement.style.setProperty('--theme-accent', `${r} ${g} ${b}`);
                    document.documentElement.style.setProperty('--theme-glow', `rgba(${r}, ${g}, ${b}, 0.3)`);
                } catch (e) {
                    console.warn("Theme extraction failed", e);
                }
            }
        };

        updateTheme();
    }, [creative.assets]);

    return (
        <ThemeContext.Provider value={{ themeColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
