// Boje šest oblasti znanja — koriste ih kartice, tanjir i Gantt dijagram.
export const domainColours = {
  craft: '#b85c40', // terakota
  ops: '#7f9c7b', // žalfija
  safety: '#5f80aa', // škriljac
  people: '#7d2f42', // bordo
  preopening: '#c4a27a', // kamel
  suppliers: '#2f7479', // petrolej
} as const;

export type Domain = keyof typeof domainColours;
