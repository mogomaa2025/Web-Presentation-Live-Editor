import type React from 'react';

export interface TextStyle {
  color?: string;
  fontSize?: string;
}

export interface SlideData {
  title: string;
  subtitle?: string;
  points: string[];
  image: string;
  videoUrl?: string;
  chart?: React.ComponentType;
  layout?: 'text-left' | 'text-right' | 'text-only';
  presenter?: number;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  pointsStyle?: TextStyle;
}
