export interface ReaderPreferences {
    fontFamily?: string;
    fontSize?: string; // can be in px, em, rem, etc.
    backgroundColor?: string;
    textColor?: string;
    lineSpacing?: string; // can be in px, em, rem, etc.
    marginSize?: string; // can be in px, em, rem, etc.
    justification?: 'left' | 'right' | 'center' | 'justify';
    nightMode?: boolean;
    highlightColor?: string;
    fontSizeAdjustment?: number; // a scaling factor, like 1.2 to increase by 20%
    readingMode?: 'scroll' | 'page';
    textColumn?: 'single' | 'double' | 'triple';
    fontWeight?: 'light' | 'regular' | 'bold';
    letterSpacing?: string; // can be in px, em, rem, etc.
    animations?: boolean;
}

export const DEFAULT_PREFERENCES_LIGHT: ReaderPreferences = {
    fontFamily: 'Georgia, serif', // A common sans-serif font
    fontSize: '1rem', // Standard size
    backgroundColor: '#FFFFFF', // White
    textColor: '#000000', // Black
    lineSpacing: '1.5rem', // A bit more spacing for readability
    marginSize: '1rem', // Standard margin
    justification: 'left', // Left-justified text is common
    nightMode: false, // It's the light theme, so night mode is off
    highlightColor: '#FFFF00', // Yellow, typical highlighter color
    fontSizeAdjustment: 1, // No adjustment by default
    readingMode: 'scroll', // Scroll is more common for web
    textColumn: 'single', // Single column is default for most screens
    fontWeight: 'regular', // Regular font weight
    letterSpacing: 'normal', // Default spacing
    animations: true, // Assuming you want animations by default
};

export const DEFAULT_PREFERENCES_DARK: ReaderPreferences = {
    fontFamily: 'Georgia, serif', // Consistent with the light theme
    fontSize: '1rem', // Standard size
    backgroundColor: '#1a1a1a', // A common dark gray, easier on the eyes than pure black
    textColor: '#EAEAEA', // A light gray, contrasts well with the dark background
    lineSpacing: '1.5rem', // Consistent with light theme
    marginSize: '1rem', 
    justification: 'left',
    nightMode: true, // It's the dark theme
    highlightColor: '#FFA500', // Orange might show up better against dark backgrounds
    fontSizeAdjustment: 1,
    readingMode: 'scroll',
    textColumn: 'single',
    fontWeight: 'regular',
    letterSpacing: 'normal',
    animations: true,
};