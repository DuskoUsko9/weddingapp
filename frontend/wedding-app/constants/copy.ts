// All Slovak UI strings — never hardcode Slovak text in JSX

export const Copy = {
  // Auth
  auth: {
    brand: 'Madu',
    welcomeTitle: 'Vitajte na našej svadbe',
    welcomeSubtitle: 'Pripravili sme pre vás digitálneho sprievodcu týmto výnimočným dňom.',
    nameLabel: 'Vaše meno',
    namePlaceholder: 'Napíšte svoje meno...',
    loginButton: 'Vstúpiť',
    loginHint: 'Stačí zadať vaše meno, nepotrebujete heslo.',
    notFound: 'Nenašli sme ťa v zozname hostí. Skontroluj celé meno alebo kontaktuj organizátora.',
    disambiguationTitle: 'Vyber sa, kto si',
    disambiguationSubtitle: 'Našli sme viac hostí s týmto menom.',
    specialRolesLabel: 'Špeciálne role',
    specialRolesHint: 'Hostia s prístupom ako djmiles, starejsi, alebo maduadmin získajú rozšírené funkcie.',
  },

  // Dashboard
  dashboard: {
    title: 'Vitaj!',
    countdown: 'Do svadby zostáva',
    days: 'DNÍ',
    hours: 'HODÍN',
    minutes: 'MINÚT',
    seconds: 'SEKÚND',
    weddingDate: '5. septembra 2026, 15:30',
    weddingVenue: 'Penzión Zemiansky Dvor, Šúrovce',
    addToCalendar: 'Pridaj svadbu do kalendára',
    addToCalendarSubtitle: 'Google Kalendár otvoríš jedným klikom.',
    lockedUntil: 'Dostupné od',
    lockedAfter: 'Uzamknuté po',
    lockedSoon: 'Čoskoro dostupné',
    available: 'Dostupné',
    locked: 'Uzamknuté',
    weddingDay: 'V deň svadby',
    afterWedding: 'Po svadbe',
  },

  // Feature cards
  features: {
    schedule: 'Program svadby',
    scheduleDesc: 'Prehľad dôležitých okamihov nášho dňa.',
    menu: 'Menu',
    menuDesc: 'Kulinársky zážitok, ktorý sme pre vás pripravili.',
    parking: 'Parkovanie',
    parkingDesc: 'Informácie o možnostiach parkovania v areáli.',
    accommodation: 'Ubytovanie',
    accommodationDesc: 'Rezervácia a detaily o ubytovaní.',
    questionnaire: 'Dotazník',
    questionnaireDesc: 'Prosíme o potvrdenie vašich preferencií.',
    playlist: 'Hudba',
    playlistDesc: 'Pridajte skladbu, na ktorú radi zatancujete.',
    seating: 'Zasadací plán',
    seatingDesc: 'Váš stôl v svadobnej sále.',
    photos: 'Fotky',
    photosDesc: 'Zdieľajte fotky z nášho výnimočného dňa.',
    bingo: 'Svadobné bingo',
    bingoDesc: 'Zachyťte špeciálne momenty svadby.',
    gallery: 'Galéria',
    galleryDesc: 'Spoločné spomienky zachytené objektívom.',
    loveStory: 'Náš príbeh',
    loveStoryDesc: 'Ako sa to všetko začalo.',
    cocktails: 'Koktejly',
    cocktailsDesc: 'Navrhnite koktejl večera.',
    thankYou: 'Poďakovanie',
    thankYouDesc: 'Osobná správa od nás pre vás.',
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
    logout: 'Odhlásiť sa',
    navigate: 'Navigovať',
    lockedUntilWeddingDay: 'Dostupné v deň svadby',
    lockedUntilAfterWedding: 'Dostupné po svadbe',
    tryAgain: 'Skúsiť znova',
  },

  // Questionnaire
  questionnaire: {
    title: 'Dotazník',
    subtitle: 'Pomôž nám pripraviť sa na tvoj príchod',
    deadline: 'Dotazník bude uzavretý 1. augusta 2026.',
    alcoholTitle: 'Aký máš vzťah k alkoholu?',
    alcoholDrinks: 'Pijem alkohol',
    alcoholWineOnly: 'Pijem iba víno / šampanské',
    alcoholBeerOnly: 'Pijem iba pivo',
    alcoholNonDrinker: 'Nepijem alkohol',
    allergyQuestion: 'Máš nejakú alergiu alebo intoleranciu na potraviny?',
    allergyYes: 'Áno',
    allergyNo: 'Nie',
    allergyNotesLabel: 'Opíš prosím svoju alergiu alebo intoleranciu',
    allergyNotesPlaceholder: 'Napr. laktóza, lepok, orechy...',
    submit: 'Odoslať dotazník',
    update: 'Upraviť odpovede',
    submitted: 'Ďakujeme, odpovede sú uložené.',
    lockedSubmitted: 'Dotazník je uzavretý. Tu sú tvoje odpovede.',
    lockedMissing: 'Dotazník bol uzavretý. Kontaktuj organizátora.',
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

  // DJ queue
  dj: {
    title: 'DJ Fronta',
    live: 'Živé',
    reconnecting: 'Odpojený — pokúšam sa znova...',
    empty: 'Žiadne požiadavky zatiaľ',
    all: 'Všetky',
    pending: 'Čakajúce',
    played: 'Zahrali sme',
    skipped: 'Preskočené',
    playedAction: 'Zahrali sme',
    skippedAction: 'Preskočiť',
    fromGuest: 'od',
    requests: 'prianí',
    oneRequest: 'prianie',
  },

  // Schedule
  schedule: {
    title: 'Program svadby',
    subtitle: '5. septembra 2026 · Penzión Zemiansky Dvor',
  },

  // Menu
  menu: {
    title: 'Svadobné Menu',
    subtitle: 'Starostlivo vybrané chute pre náš spoločný večer v kruhu najbližších.',
    category: 'Hostina',
    drinks: 'Nápojový lístok',
    drinksNote: 'K dispozícii počas celého večera v bare',
  },

  // Love story
  loveStory: {
    title: 'Náš príbeh',
    subtitle: 'Od prvého stretnutia až po spoločný život.',
  },

  // Photo upload
  photoUpload: {
    title: 'Nahrávanie fotiek',
    subtitle: 'Zdieľajte vaše fotky z tohto výnimočného dňa.',
    locked: 'Dostupné v deň svadby 5.9.2026.',
    lockedTitle: 'Fotky sa sprístupnia v deň svadby',
    lockedSubtitle: 'Od 5. septembra 2026 tu môžete nahrávať fotky zo svadby.',
  },

  // Seating
  seating: {
    title: 'Zasadací plán',
    lockedTitle: 'Zasadací plán bude zverejnený v deň svadby',
    lockedSubtitle: 'Od 5. septembra 2026 tu nájdete váš stôl v svadobnej sále.',
  },

  // Gallery
  gallery: {
    title: 'Galéria',
    lockedTitle: 'Galéria sa sprístupní po svadbe',
    lockedSubtitle: 'Spoločné spomienky nájdete tu od 6. septembra 2026, od 8:00.',
  },

  // Bingo
  bingo: {
    title: 'Svadobné bingo',
    lockedTitle: 'Bingo sa spustí v deň svadby',
    lockedSubtitle: 'Zachytávajte špeciálne momenty svadby od 5. septembra 2026.',
  },

  // Thank you
  thankYou: {
    title: 'Poďakovanie',
    lockedTitle: 'Správa pre vás príde po svadbe',
    lockedSubtitle: 'Osobné poďakovanie od nás nájdete tu od 6. septembra 2026.',
  },

  // Parking
  parking: {
    title: 'Parkovanie',
    navigateBtn: 'Otvoriť v Mapách',
    address: 'Penzión Zemiansky Dvor, Surovce',
  },

  // Accommodation
  accommodation: {
    title: 'Ubytovanie',
    venue: 'Penzión Zemiansky Dvor',
    checkIn: 'Príchod: 5. septembra 2026',
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
    active: 'Aktívny',
    inactive: 'Neaktívny',
    scheduled: 'Naplánovaný',
    automaticAt: 'Automaticky',
  },
} as const;