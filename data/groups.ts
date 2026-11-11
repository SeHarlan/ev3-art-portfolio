// Group-by folders for the desktop and Start menu (SCOTT-995). Tags per the ticket's table.
import { ICONS, WINDOWS } from "./windows";

const GROUP_BYS =["year", "media", "experience"] as const
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

/** For tests: whether a window has tags. */
export const hasTags = (key: string) => key in TAGS

/** The art windows' names, in WINDOWS order. */
export const ART_KEYS: string[] = Object.values(WINDOWS).filter(hasTags)

/** The WINDOWS enum key for each window name, e.g. "T3RRA" → "TERRA". */
const ID_BY_NAME: Record<string, string> = Object.fromEntries(Object.entries(WINDOWS).map(([id, name]) => [name, id]))

/** WorkSelector entries for window names. Ids are WINDOWS enum keys, since names carry spaces and quotes. */
export const selectorWorks = (keys: string[]) =>
  keys.map(key => ({ id: ID_BY_NAME[key] ?? key, title: key, thumb: ICONS[key] }))

/** The window name for a selectorWorks id. */
export const windowFromId = (id: string): string => WINDOWS[id as keyof typeof WINDOWS] ?? id

/** A window's icon; group folders aren't in ICONS. */
export const iconFor = (key: string): string => ICONS[key] ?? FOLDER_ICON

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

// The tags are static, so each grouping is built once.
const GROUPS = Object.fromEntries(GROUP_BYS.map(groupBy => [
  groupBy,
  groupNames(groupBy).map(name => ({
    name,
    keys: ART_KEYS.filter(key => tagsOf(key, groupBy).includes(name)),
  })),
])) as Record<GroupBy, Group[]>

export const groupsFor = (groupBy: GroupBy): Group[] => GROUPS[groupBy]

/** The windows outside every folder, first on the desktop and in Start. */
export const TOP_LEVEL: string[] = [WINDOWS.SETTINGS, WINDOWS.FIND, WINDOWS.HOME]

/** The desktop's icons: My Computer, Find and Welcome, then the grouping's folders. */
export const desktopKeys = (groupBy: GroupBy): string[] =>
  [...TOP_LEVEL, ...groupsFor(groupBy).map(group => group.name)]

/** Case-insensitive substring match on the work's name or any of its tags, whatever the grouping. */
export const matchesSearch = (key: string, query: string) => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (!hasTags(key)) return false
  return [key, ...GROUP_BYS.flatMap(groupBy => tagsOf(key, groupBy))].some(text => text.toLowerCase().includes(q))
}
