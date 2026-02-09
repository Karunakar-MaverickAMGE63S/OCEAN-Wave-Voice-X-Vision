
export enum View {
  MEDICAL_WELCOME = 'MEDICAL_WELCOME',
  MEDICAL_SIGNIN = 'MEDICAL_SIGNIN',
  DASHBOARD = 'DASHBOARD',
  WELCOME = 'WELCOME',
  SIGNIN = 'SIGNIN',
  AAC_BOARD = 'AAC_BOARD'
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR'
}

export enum Category {
  ROOT = 'ROOT',
  DO = 'DO',
  EAT = 'EAT',
  GO = 'GO',
  TELL = 'TELL',
  MIGHT = 'MIGHT',
  THINGS = 'THINGS',
  TOOL = 'TOOL',
  MATERIAL = 'MATERIAL',
  IS_BE = 'IS_BE',
  LOOK = 'LOOK',
  WEAR = 'WEAR',
  BODY = 'BODY',
  TOUCH = 'TOUCH',
  PEOPLE = 'PEOPLE',
  WHAT = 'WHAT',
  WHEN = 'WHEN'
}

export interface PhraseItem {
  id: string;
  label: string;
  emoji: string;
  category: Category;
  isFolder?: boolean;
  targetCategory?: Category;
}

export enum RefineTone {
  CASUAL = 'casual',
  PROFESSIONAL = 'professional',
  EMPATHETIC = 'empathetic'
}
