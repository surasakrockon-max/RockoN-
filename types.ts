import type React from 'react';

export interface ArtStyle {
  id: string;
  name:string;
  icon: React.ElementType;
  promptSuffix: string;
}

export interface HistoryItem {
  id: string;
  imageDataUrl: string;
  prompt: string;
  styleId: string;
  timestamp: number;
}
