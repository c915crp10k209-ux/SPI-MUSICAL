
export interface Song {
  id: string;
  title: string;
  style: string;
  stageDesign: string;
  lyrics: string[];
  visualCues: string[];
  act: string;
}

export interface Act {
  title: string;
  songs: Song[];
}

export interface Musical {
  title: string;
  subtitle: string;
  acts: Act[];
}

export enum MusicalID {
  FUNDAMENTALS = 'FUNDAMENTALS',
  ELECTRIC_BOOGALOO = 'ELECTRIC_BOOGALOO'
}

export interface SavedVision {
  songId: string;
  songTitle: string;
  description: string;
  imageUrl: string | null;
  timestamp: number;
}

export interface DailyInsight {
  text: string;
  timestamp: number;
}

export interface UserProgress {
  vault: SavedVision[];
  lastInsight: DailyInsight | null;
}
