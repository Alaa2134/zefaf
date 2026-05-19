// Curated Unsplash wedding photos — hotlinked CDN, no auth needed.
// These are used as default samples in template previews so the gallery
// looks like real wedding invitations, not blank text cards.

export const COUPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537907510278-10acdb198d0f?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80&auto=format&fit=crop",
];

export const GROOM_PHOTOS = [
  "https://images.unsplash.com/photo-1581824283135-0666cf353f35?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&q=80&auto=format&fit=crop",
];

export const BRIDE_PHOTOS = [
  "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546368810-825ee8ae3f63?w=600&q=80&auto=format&fit=crop",
];

export const WEDDING_DETAILS = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80&auto=format&fit=crop", // rings
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=80&auto=format&fit=crop", // bouquet
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80&auto=format&fit=crop", // table
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=crop", // couple sunset
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80&auto=format&fit=crop", // venue
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80&auto=format&fit=crop", // bride bouquet
];

export const FLORAL_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&q=80&auto=format&fit=crop", // pink flowers
  "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1600&q=80&auto=format&fit=crop", // floral
  "https://images.unsplash.com/photo-1454425064867-d6e9a64b1b81?w=1600&q=80&auto=format&fit=crop", // peonies
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=80&auto=format&fit=crop", // white roses
];

export function pickCouplePhoto(seed: string): string {
  const h = hash(seed) % COUPLE_PHOTOS.length;
  return COUPLE_PHOTOS[h];
}

export function pickGroomPhoto(seed: string): string {
  const h = hash(seed) % GROOM_PHOTOS.length;
  return GROOM_PHOTOS[h];
}

export function pickBridePhoto(seed: string): string {
  const h = hash(seed) % BRIDE_PHOTOS.length;
  return BRIDE_PHOTOS[h];
}

export function pickWeddingDetail(seed: string): string {
  const h = hash(seed) % WEDDING_DETAILS.length;
  return WEDDING_DETAILS[h];
}

export function pickFloral(seed: string): string {
  const h = hash(seed) % FLORAL_BACKGROUNDS.length;
  return FLORAL_BACKGROUNDS[h];
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  }
  return h;
}
