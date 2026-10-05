export type ElementType =
  | 'text'
  | 'photo'
  | 'polaroid'
  | 'sticker'
  | 'tape'
  | 'scrap'
  | 'doodle'
  | 'rating'
  | 'location'
  | 'stamp'
  | 'letter-paper';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity?: number;
  locked?: boolean;
  createdBy: 'user1' | 'user2';
  createdAt: number;
  updatedAt?: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  effect?: 'normal' | 'curved' | 'warped' | 'folded' | 'highlighter';
  curvature?: number; // -100 to 100 for curved text
  bgColor?: string;
  letterSpacing?: number;
}

export interface PhotoElement extends BaseElement {
  type: 'photo';
  src: string;
  caption?: string;
  frame?: 'none' | 'border' | 'shadow' | 'torn' | 'film';
  borderRadius?: number;
  filter?: 'normal' | 'vintage' | 'warm' | 'bw' | 'faded';
  hasTape?: boolean;
  tapeColor?: string;
}

export interface PolaroidElement extends BaseElement {
  type: 'polaroid';
  src: string;
  caption: string;
  dateStr?: string;
  pinType?: 'none' | 'tape-top' | 'tape-corner' | 'pin' | 'clip';
  filter?: 'normal' | 'vintage' | 'warm' | 'bw' | 'faded';
}

export interface StickerElement extends BaseElement {
  type: 'sticker';
  stickerId: string;
  category: 'love' | 'food' | 'travel' | 'celebration' | 'cute' | 'handwritten' | 'decorative' | 'custom';
  svgOrEmoji?: string;
  customSrc?: string;
  borderThickness?: number;
  borderColor?: string;
  hasShadow?: boolean;
}

export interface TapeElement extends BaseElement {
  type: 'tape';
  tapePattern: 'washi-dots' | 'washi-stripes' | 'washi-floral' | 'kraft' | 'clear' | 'blush';
  tapeColor: string;
}

export interface ScrapElement extends BaseElement {
  type: 'scrap';
  paperType: 'kraft' | 'lined' | 'grid' | 'parchment' | 'pastel';
  title?: string;
  bodyText?: string;
}

export interface DoodleElement extends BaseElement {
  type: 'doodle';
  points: { x: number; y: number }[][];
  strokeColor: string;
  strokeWidth: number;
  tool: 'pen' | 'pencil' | 'marker';
}

export interface RatingElement extends BaseElement {
  type: 'rating';
  label: string;
  score: number; // 1-10
  category: 'food' | 'vibe' | 'fun' | 'romance' | 'overall';
}

export interface LocationElement extends BaseElement {
  type: 'location';
  placeName: string;
  date?: string;
}

export interface LetterPaperElement extends BaseElement {
  type: 'letter-paper';
  toName: string;
  content: string;
  fromName: string;
  isSealed: boolean;
  unlockDate?: string;
  sealColor?: string;
}

export type PageElement =
  | TextElement
  | PhotoElement
  | PolaroidElement
  | StickerElement
  | TapeElement
  | ScrapElement
  | DoodleElement
  | RatingElement
  | LocationElement
  | LetterPaperElement;

export type PageLayoutType =
  | 'blank'
  | 'date-journal'
  | 'letter'
  | 'trip'
  | 'anniversary'
  | 'photo-collage';

export type PaperTexture =
  | 'creamy-canvas'
  | 'grain-paper'
  | 'vintage-parchment'
  | 'soft-blush'
  | 'dot-grid'
  | 'ruled-journal';

export interface ScrapbookPage {
  id: string;
  title: string;
  pageNumber: number;
  layoutType: PageLayoutType;
  paperTexture: PaperTexture;
  paperColor?: string;
  elements: PageElement[];
  createdAt: number;
  updatedAt: number;
  bookmark?: boolean;
  chapter?: string;
  dateStr?: string;
  lockedUntil?: string; // For sealed anniversary / future letters
}

export interface CoupleProfile {
  partner1: string;
  partner2: string;
  bookTitle: string;
  bookSubtitle: string;
  anniversaryDate: string;
  /** The day he asked her out — 'YYYY-MM-DD' */
  firstDateProposed?: string;
  coverColor: string;
  coverTexture: 'leather' | 'linen' | 'velvet' | 'papercraft';
  coverEmbossColor: string;
  coverSticker?: string;
  coverPhoto?: string;
  themeStyle: 'romantic' | 'vintage' | 'cottagecore' | 'modern-editorial';
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  category: 'moment' | 'date' | 'milestone' | 'trip' | 'anniversary' | 'letter';
  description: string;
  pageId?: string;
  photoUrl?: string;
  author: 'partner1' | 'partner2' | 'both';
}

export interface ScrapbookState {
  profile: CoupleProfile;
  activeUser: 'user1' | 'user2';
  pages: ScrapbookPage[];
  currentPageIndex: number; // For two-page spread or single-page
  selectedElementId: string | null;
  history: ScrapbookPage[][];
  historyIndex: number;
  timeline: TimelineEvent[];
}
