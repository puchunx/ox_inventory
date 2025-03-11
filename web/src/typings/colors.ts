export type ColorLabel = 'mainColor' | 'textColor' | 'backgroundColor' | 'secondaryColor' | 'secondaryColorDark';

export type Colors = Record<ColorLabel, string> & { opacity: number };
