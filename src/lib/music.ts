// Curated background music library.
// All tracks are royalty-free or public-domain. Replace these URLs with
// uploads to Supabase Storage after running the schema migration:
//   1. Open Supabase Storage → zefaf-uploads bucket
//   2. Create folder "music/"
//   3. Upload mp3 files and set their URLs below

export interface MusicTrack {
  id: string;
  nameAr: string;
  url: string;
  category: "oud" | "piano" | "zaffa" | "quran" | "instrumental";
  attribution?: string;
}

const SAMPLE_TRACK = "/music/silence.mp3"; // placeholder — replace with real files

export const MUSIC_LIBRARY: MusicTrack[] = [
  { id: "oud", nameAr: "عود هادئ", category: "oud", url: SAMPLE_TRACK },
  { id: "oud-2", nameAr: "عود تراثي", category: "oud", url: SAMPLE_TRACK },
  { id: "piano", nameAr: "بيانو رومانسي", category: "piano", url: SAMPLE_TRACK },
  { id: "piano-2", nameAr: "بيانو هادئ", category: "piano", url: SAMPLE_TRACK },
  { id: "zaffa", nameAr: "زفّة شعبية", category: "zaffa", url: SAMPLE_TRACK },
  { id: "zaffa-2", nameAr: "زفّة صعيدي", category: "zaffa", url: SAMPLE_TRACK },
  { id: "quran", nameAr: "قراءة قرآن", category: "quran", url: SAMPLE_TRACK },
  { id: "instrumental", nameAr: "موسيقى آلية فاخرة", category: "instrumental", url: SAMPLE_TRACK },
];

export function getMusicTrack(id: string): MusicTrack | undefined {
  return MUSIC_LIBRARY.find((t) => t.id === id);
}
