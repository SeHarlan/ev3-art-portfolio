// Group-by folders for the desktop and Start menu (SCOTT-995). Tags per the ticket's table.
import { WINDOWS } from "../context/WindowsProvider";

export const GROUP_BYS = ["year", "media", "experience"] as const
export type GroupBy = typeof GROUP_BYS[number]
export const DEFAULT_GROUP_BY: GroupBy = "year"

export const isGroupBy = (value: string | null): value is GroupBy => GROUP_BYS.includes(value as GroupBy)

export const FOLDER_ICON = "/svg/folder-icon.svg"

const MEDIA = ["code", "video", "image", "audio"] as const
const EXPERIENCES = ["Interactive", "Generative", "Fixed"] as const

interface Tags {
  year: string;
  media: typeof MEDIA[number][];
  experience: typeof EXPERIENCES[number];
}

const TAGS: Record<string, Tags> = {
  [WINDOWS.GP]: { year: "2024", media: ["code"], experience: "Generative" },
  [WINDOWS.DUET]: { year: "2023", media: ["code", "audio"], experience: "Interactive" },
  [WINDOWS.NOISE]: { year: "2023", media: ["code"], experience: "Generative" },
  [WINDOWS.ITB]: { year: "2024", media: ["code"], experience: "Interactive" },
  [WINDOWS.R3MIX]: { year: "2024", media: ["code"], experience: "Generative" },
  [WINDOWS.MAURER]: { year: "2023", media: ["code"], experience: "Interactive" },
  [WINDOWS.SOMEDAYS]: { year: "2024", media: ["video"], experience: "Fixed" },
  [WINDOWS.TECHTONIC]: { year: "2026", media: ["code"], experience: "Generative" },
  [WINDOWS.OBH]: { year: "2026", media: ["code"], experience: "Generative" },
  [WINDOWS.SK3TCH]: { year: "2026", media: ["code"], experience: "Interactive" },
  [WINDOWS.CEASEFIRE]: { year: "2025", media: ["video"], experience: "Fixed" },
  [WINDOWS.REMEMBER]: { year: "2025", media: ["code"], experience: "Interactive" },
  [WINDOWS.SEASONS]: { year: "2025", media: ["image"], experience: "Fixed" },
  [WINDOWS.ISAAC]: { year: "2025", media: ["video"], experience: "Fixed" },
  [WINDOWS.PROGRESS]: { year: "2023", media: ["code"], experience: "Interactive" },
  [WINDOWS.SINGLEPATH]: { year: "2023", media: ["image"], experience: "Fixed" },
  [WINDOWS.TERRA]: { year: "2023", media: ["image", "video"], experience: "Fixed" },
  [WINDOWS.FLOWER]: { year: "2022", media: ["video", "audio"], experience: "Fixed" },
  [WINDOWS.TUNEOUT]: { year: "2022", media: ["video", "audio"], experience: "Fixed" },
}

const NOT_ART: (keyof typeof WINDOWS)[] = ["HOME", "SETTINGS", "FIND"]

/** The art windows' names, in WINDOWS order. */
export const ART_KEYS: string[] = (Object.keys(WINDOWS) as (keyof typeof WINDOWS)[])
  .filter(key => !NOT_ART.includes(key))
  .map(key => WINDOWS[key])

/** The WINDOWS enum key for a window name, e.g. "T3RRA" → "TERRA". */
export const windowId = (name: string) =>
  (Object.keys(WINDOWS) as (keyof typeof WINDOWS)[]).find(key => WINDOWS[key] === name)

export interface Group {
  name: string;
  /** Window names, in WINDOWS order. */
  keys: string[];
}

const tagsOf = (key: string, groupBy: GroupBy): string[] => {
  const tags = TAGS[key]
  if (groupBy === "year") return [tags.year]
  if (groupBy === "media") return tags.media
  return [tags.experience]
}

const groupNames = (groupBy: GroupBy): readonly string[] => {
  if (groupBy === "media") return MEDIA
  if (groupBy === "experience") return EXPERIENCES
  // Newest year first.
  return Array.from(new Set(ART_KEYS.map(key => TAGS[key].year))).sort().reverse()
}

export const groupsFor = (groupBy: GroupBy): Group[] =>
  groupNames(groupBy).map(name => ({
    name,
    keys: ART_KEYS.filter(key => tagsOf(key, groupBy).includes(name)),
  }))

/** Case-insensitive substring match on the work's name or any of its tags, whatever the grouping. */
export const matchesSearch = (key: string, query: string) => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const tags = TAGS[key]
  if (!tags) return false
  return [key, tags.year, ...tags.media, tags.experience].some(text => text.toLowerCase().includes(q))
}

/** For tests: whether a window has tags. */
export const hasTags = (key: string) => key in TAGS
