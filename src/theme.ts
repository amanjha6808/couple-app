export type ThemeStyle = 'romantic' | 'vintage' | 'cottagecore' | 'modern-editorial';
export type CoverTexture = 'leather' | 'linen' | 'velvet' | 'papercraft';

export interface ThemeDefinition {
  id: ThemeStyle;
  label: string;
  description: string;
  /** Background behind the closed book & journal workspace */
  bg: string;
  /** Paper tint applied over page textures */
  pageTint: string;
  /** Header / footer chrome color for the journal view */
  chrome: string;
  /** Default cover color when picking the theme (user can still override) */
  coverColor: string;
  /** Handwriting-style accent color for headings on pages */
  accent: string;
  emoji: string;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'romantic',
    label: 'Romantic Burgundy',
    description: 'Deep velvet reds, warm gold and candlelight glow.',
    bg: 'radial-gradient(ellipse at 50% 30%, #3a2e28 0%, #1e1814 100%)',
    pageTint: 'rgba(255, 240, 230, 0.0)',
    chrome: '#231b16',
    coverColor: '#5c2c35',
    accent: '#8b3a4a',
    emoji: '🌹',
  },
  {
    id: 'vintage',
    label: 'Vintage Sepia',
    description: 'Aged paper, sepia tones and old-world stationery.',
    bg: 'radial-gradient(ellipse at 50% 30%, #3d332a 0%, #211a13 100%)',
    pageTint: 'rgba(214, 178, 126, 0.16)',
    chrome: '#241d15',
    coverColor: '#382218',
    accent: '#7a5a2e',
    emoji: '🕰️',
  },
  {
    id: 'cottagecore',
    label: 'Cottagecore Sage',
    description: 'Soft greens, wildflowers and sunlit linen.',
    bg: 'radial-gradient(ellipse at 50% 30%, #31382c 0%, #1a1f16 100%)',
    pageTint: 'rgba(228, 240, 216, 0.18)',
    chrome: '#1f2419',
    coverColor: '#2d3b36',
    accent: '#4c6b4f',
    emoji: '🌿',
  },
  {
    id: 'modern-editorial',
    label: 'Modern Editorial',
    description: 'Clean midnight navy, crisp contrast, minimal chic.',
    bg: 'radial-gradient(ellipse at 50% 30%, #26303c 0%, #12161c 100%)',
    pageTint: 'rgba(226, 235, 244, 0.14)',
    chrome: '#141a22',
    coverColor: '#233246',
    accent: '#31465e',
    emoji: '🖤',
  },
];

export const themeById = (id: ThemeStyle): ThemeDefinition =>
  THEMES.find((t) => t.id === id) ?? THEMES[0];

export const COVER_TEXTURES: { id: CoverTexture; label: string; background: string }[] = [
  {
    id: 'leather',
    label: 'Leather',
    background:
      'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.25) 0%, transparent 55%), repeating-linear-gradient(48deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 2px, transparent 2px, transparent 5px)',
  },
  {
    id: 'linen',
    label: 'Linen',
    background:
      'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 4px)',
  },
  {
    id: 'velvet',
    label: 'Velvet',
    background:
      'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.3) 0%, transparent 60%)',
  },
  {
    id: 'papercraft',
    label: 'Papercraft',
    background:
      'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 3px, transparent 3px, transparent 8px), radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)',
  },
];

export const coverTextureById = (id: CoverTexture) =>
  COVER_TEXTURES.find((t) => t.id === id) ?? COVER_TEXTURES[1];

/** Formats '2026-02-28' as '28 Feb 2026' without timezone surprises. */
export const formatKeyDate = (isoDate: string): string => {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
};
