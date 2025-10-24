// src/types/Deck.ts
import type { Subject } from './Subject';

export interface Deck {
  id: string;
  name: string;
  description: string;
  subjects: Subject[];
}
