// All Slovak UI strings — never hardcode Slovak text in JSX

export const Copy = {
  // Auth
  auth: {
    title: 'MadU Svadba',
    subtitle: 'Vitaj na svadbe Maťky & Dušana',
    namePlaceholder: 'Tvoje celé meno',
    loginButton: 'Vstúpiť',
    loginHint: 'Zadaj meno presne tak, ako si ho poslal/a',
    notFound: 'Nenašli sme ťa v zozname hostí. Skontroluj celé meno alebo kontaktuj organizátora.',
    disambiguationTitle: 'Vyber sa, kto si',
    disambiguationSubtitle: 'Našli sme viac hostí s týmto menom.',
  },

  // Dashboard
  dashboard: {
    title: 'Vitaj!',
    countdown: 'Do svadby zostáva',
    days: 'dní',
    hours: 'hodín',
    minutes: 'minút',
    seconds: 'sekúnd',
    weddingDate: '5. septembra 2026, 15:30',
    weddingVenue: 'Penzión Zemiansky Dvor, Surovce',
  },

  // Feature cards
  features: {
    schedule: 'Program svadby',
    menu: 'Menu',
    parking: 'Parkovanie',
    accommodation: 'Ubytovanie',
    questionnaire: 'Dotazník',
    playlist: 'Hudba',
    seating: 'Zasadací plán',
    photos: 'Fotky',
    bingo: 'Svadobné bingo',
    gallery: 'Galéria',
    loveStory: 'Náš príbeh',
    cocktails: 'Koktejly',
    thankYou: 'Poďakovanie',
  },

  // Common
  common: {
    loading: 'Načítavam...',
    error: 'Nastala chyba. Skús to znova.',
    notFound: 'Nenašlo sa.',
    save: 'Uložiť',
    cancel: 'Zrušiť',
    delete: 'Vymazať',
    edit: 'Upraviť',
    add: 'Pridať',
    close: 'Zavrieť',
    back: 'Späť',
    confirm: 'Potvrdiť',
    featureNotAvailable: 'Táto funkcia ešte nie je dostupná.',
  },

  // Questionnaire
  questionnaire: {
    title: 'Dotazník',
    subtitle: 'Pomôž nám pripraviť svadobný deň pre teba',
    attendance: 'Prídem na svadbu',
    attendanceYes: 'Áno, prídem',
    attendanceNo: 'Bohužiaľ nemôžem',
    mealChoice: 'Výber jedla',
    allergies: 'Alergie alebo diétne obmedzenia',
    allergiesPlaceholder: 'Napr. bezlepková diéta, alergia na orechy...',
    note: 'Správa pre novomanželov',
    notePlaceholder: 'Niečo na srdci? :)',
    deadline: 'Dotazník je možné vyplniť do 1. augusta 2026.',
    saved: 'Dotazník bol uložený.',
  },

  // Song requests
  playlist: {
    title: 'Hudobné priania',
    addSong: 'Pridaj skladbu',
    songName: 'Názov skladby',
    songNamePlaceholder: 'Napr. Somebody That I Used to Know',
    artist: 'Interpret',
    artistPlaceholder: 'Napr. Gotye',
    dedication: 'Venovanie',
    dedicationPlaceholder: 'Napr. Táto pieseň mi pripomína kamaráta...',
    send: 'Poslať prianie',
    sent: 'Prianie bolo odoslané!',
    myRequests: 'Moje priania',
    statuses: {
      Pending: 'Čaká',
      Played: 'Zahrané',
      Skipped: 'Preskočené',
    },
  },

  // Schedule
  schedule: {
    title: 'Program svadby',
  },

  // Menu
  menu: {
    title: 'Menu',
  },

  // Love story
  loveStory: {
    title: 'Náš príbeh',
  },

  // Admin
  admin: {
    title: 'Admin panel',
    guests: 'Hostia',
    featureFlags: 'Funkcie',
    stats: 'Štatistiky',
    confirmed: 'Potvrdení',
    attending: 'Prídu',
    notAttending: 'Neprídu',
    pending: 'Čaká',
  },
} as const;
