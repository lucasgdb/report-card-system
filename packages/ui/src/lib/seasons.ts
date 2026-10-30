/** Commemorative dates that give the interface a seasonal touch. */
export type SeasonId =
  | 'ano-novo'
  | 'carnaval'
  | 'pascoa'
  | 'festa-junina'
  | 'dia-do-estudante'
  | 'independencia'
  | 'halloween'
  | 'natal';

export type Season = {
  id: SeasonId;
  /** Shown in the decorations toggle, e.g. "Decorações de Natal". */
  name: string;
  start: Date;
  /** Inclusive. */
  end: Date;
};

export const SEASON_IDS: SeasonId[] = [
  'ano-novo',
  'carnaval',
  'pascoa',
  'festa-junina',
  'dia-do-estudante',
  'independencia',
  'halloween',
  'natal',
];

const SEASON_NAMES: Record<SeasonId, string> = {
  'ano-novo': 'Ano Novo',
  carnaval: 'Carnaval',
  pascoa: 'Páscoa',
  'festa-junina': 'Festa Junina',
  'dia-do-estudante': 'Dia do Estudante',
  independencia: 'Independência',
  halloween: 'Halloween',
  natal: 'Natal',
};

const day = (year: number, month: number, date: number) => new Date(year, month - 1, date);

const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/** Easter Sunday (Gregorian calendar, "Anonymous" algorithm). */
export function easterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const date = ((h + l - 7 * m + 114) % 31) + 1;
  return day(year, month, date);
}

/**
 * The seasons of a year. Big holidays (Festa Junina, Halloween, Natal) take the whole month; the others
 * get about a week around the date.
 */
export function seasonsOf(year: number): Season[] {
  const easter = easterSunday(year);
  const carnivalTuesday = addDays(easter, -47);

  const ranges: Record<SeasonId, [Date, Date]> = {
    'ano-novo': [day(year, 1, 1), day(year, 1, 7)],
    // Saturday before Carnival until Ash Wednesday.
    carnaval: [addDays(carnivalTuesday, -3), addDays(carnivalTuesday, 1)],
    // Palm Sunday until Easter Sunday.
    pascoa: [addDays(easter, -7), easter],
    'festa-junina': [day(year, 6, 1), day(year, 6, 30)],
    // The week of August 11th.
    'dia-do-estudante': [day(year, 8, 8), day(year, 8, 14)],
    independencia: [day(year, 9, 1), day(year, 9, 7)],
    halloween: [day(year, 10, 1), day(year, 10, 31)],
    natal: [day(year, 12, 1), day(year, 12, 31)],
  };

  return SEASON_IDS.map((id) => ({ id, name: SEASON_NAMES[id], start: ranges[id][0], end: ranges[id][1] }));
}

/** The season happening on `date` (local time), if any. */
export function getSeason(date: Date = new Date()): Season | null {
  const today = day(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return seasonsOf(date.getFullYear()).find((season) => today >= season.start && today <= season.end) ?? null;
}

export function getSeasonById(id: SeasonId, year = new Date().getFullYear()): Season {
  const season = seasonsOf(year).find((candidate) => candidate.id === id);
  if (!season) {
    throw new Error(`Unknown season: ${id}`);
  }
  return season;
}

export const isSeasonId = (value: unknown): value is SeasonId => SEASON_IDS.includes(value as SeasonId);
