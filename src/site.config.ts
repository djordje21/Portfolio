// Osnovni podaci o tebi — menjaš ovde, važi za sve jezike.
export const site = {
  // Dok je false, sajt je sakriven od Google-a i ostalih pretraživača.
  // Prebaci na true tek kad odlučiš da sajt ide javno.
  indexable: false,
  // Preporuka (Massimo Bartolucci) — uključi tek kad dobiješ njegovu pisanu dozvolu za objavu.
  showTestimonial: true,
  name: 'Đorđe Milenković',
  email: 'dzordzcook@gmail.com',
  linkedin: 'https://www.linkedin.com/in/djordje-milenkovic-5900a941a/',
  // CV po jeziku. Kad napraviš SR/RU verziju, ubaci PDF u public/cv/ i promeni putanju.
  cv: {
    en: '/cv/Djordje-Milenkovic-CV-EN.pdf',
    sr: '/cv/Djordje-Milenkovic-CV-EN.pdf',
    ru: '/cv/Djordje-Milenkovic-CV-EN.pdf',
  },
};
