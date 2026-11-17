// Single source of truth for brand facts. Edit here, not in components.

export const SITE = {
  name: 'The Trader Foundry',
  domain: 'https://thetraderfoundry.com',
  tagline: 'Where traders are forged.',
  heroSub:
    'A professional trader development firm in Pune. We train, test and back people who are serious about trading as a career.',
  // Exact wording required by the brief (section 6) — use everywhere.
  address: 'The Trader Foundry, 2nd Floor, Shinde Complex, NDA Pashan Road, Bavdhan, Pune, Maharashtra 411021',
  addressQuery: 'The Trader Foundry, 2nd Floor, Shinde Complex, NDA Pashan Road, Bavdhan, Pune, Maharashtra 411021',
  hours: 'Monday–Friday, 9:00 AM – 6:00 PM. Visits are by appointment.',
  // OPEN ITEM: brief asks for a dedicated business number (currently the number given in the brief).
  phoneDisplay: '+91 97659 79001',
  phoneTel: '+919765979001',
  whatsappUrl: 'https://wa.me/919765979001',
  email: 'hello@thetraderfoundry.com',
  socials: {
    // Profile URL without the `?rpxt=` share-tracking token from the link the client sent.
    instagram: 'https://www.instagram.com/the_trader.foundry/',
    facebook: 'https://www.facebook.com/share/1JPeeP8sDJ/',
    // WhatsApp community/group invite (the floating button still opens a direct chat).
    whatsappGroup: 'https://chat.whatsapp.com/KJCk3SilyHOC7WTh2kkNqb',
    // YouTube: no URL supplied yet — add here when available.
    youtube: null as string | null,
  },
  disclaimerShort:
    'The Trader Foundry provides trading education and mentorship only. We are not a SEBI-registered investment adviser or research analyst, and nothing on this website is investment advice or a recommendation to buy or sell any security. Trading in securities and derivatives involves substantial risk of loss. Past performance does not guarantee future results. Allocation of firm capital is at the firm’s sole discretion, based on performance and risk evaluation, and is not guaranteed.',
} as const

export const TDP = {
  tagline: 'Deep mentorship. 6 months. Zero fees. A real shot at firm capital.',
  copy:
    'TDP is our full-time, 6-month deep mentorship program for people who want to trade professionally. It is completely free. Each cohort takes only 10–12 trainees, selected through screening and interviews. Each trainee is mentored one-on-one and in small groups by practising traders on our desk, follow professional risk rules, and are reviewed on every trade. Trainees who show consistent, disciplined performance get the opportunity to trade firm capital from our office. You never put your own money at risk.',
  details: [
    { label: 'Duration', value: '6 months, full-time' },
    { label: 'Fees', value: 'Zero' },
    { label: 'Seats', value: '10–12 per cohort' },
    { label: 'Format', value: 'In person, at our Pune office' },
    { label: 'Selection', value: 'Application, screening, interview' },
    { label: 'Outcome', value: 'Top performers get the opportunity to trade firm capital from our office' },
  ],
  steps: [
    { title: 'Apply', text: 'Fill in the online application.' },
    { title: 'Screening', text: 'A short assessment of aptitude and mindset.' },
    { title: 'Interview', text: 'Meet our mentors in person or on a call.' },
    { title: 'Train for 6 months', text: 'Structured curriculum, live desk exposure and daily reviews.' },
    { title: 'Evaluation', text: 'Performance measured on consistency and risk discipline, not one lucky trade.' },
    { title: 'Firm capital', text: 'Top performers get the opportunity to trade firm capital from our office.' },
  ],
}

// Every answer below restates a fact from the content brief — keep it that way.
export const FAQ = [
  {
    q: 'Is TDP really free?',
    a: 'Yes. The Trader Development Program has zero fees. It is selection-based: you apply, take a short screening assessment and attend an interview.',
  },
  {
    q: 'Do I have to put my own money at risk?',
    a: 'No. Trainees put none of their own money at risk at any stage of the program.',
  },
  {
    q: 'How long is the program and where does it happen?',
    a: 'TDP runs for 6 months, full-time, in person at our office in Bavdhan, Pune.',
  },
  {
    q: 'How many trainees are selected?',
    a: 'Each cohort takes only 10–12 trainees, so every trainee is mentored one-on-one and in small groups and reviewed on every trade.',
  },
  {
    q: 'Is firm capital guaranteed at the end?',
    a: 'No. Top performers get the opportunity to trade firm capital from our office. Allocation is at the firm’s sole discretion, based on consistency and risk discipline, not one lucky trade.',
  },
  {
    q: 'What if I only want to learn a specific skill?',
    a: 'We also run focused paid courses: a 45–60 day Trading Strategies Program and a two-day weekend AI & Algo Trading Automation Workshop. Use Know More on the Courses page to enquire.',
  },
]

export const PRINCIPLES = [
  'Mentored by working traders',
  'Zero-fee deep mentorship',
  'Selection, not sales',
  'A path to firm capital',
  'Risk first, always',
  'Trade from a real office',
]

export const SETS_APART = [
  {
    title: 'Mentored by working traders',
    text: 'Our mentors trade live markets every day. You learn what they do, not what a textbook says.',
  },
  {
    title: 'Zero-fee deep mentorship',
    text: 'Our 6-month Trader Development Program is a deep, full-time mentorship at no cost to you.',
  },
  {
    title: 'Selection, not sales',
    text: 'Only 10–12 seats per TDP cohort, filled through screening and interviews. We choose people, not payments.',
  },
  {
    title: 'A path to firm capital',
    text: 'Top performers get the opportunity to trade firm capital from our office.',
  },
  {
    title: 'Risk first, always',
    text: 'Every trainee works under defined risk rules, position limits and reviews. Capital protection comes before everything.',
  },
  {
    title: 'Trade from a real office',
    text: 'Learn and trade from our Pune trading floor, alongside a working desk and a team that trades every day.',
  },
]

// Paid courses. The brief lists a third course with no details yet, so only
// two are shown at launch. Add the third here once its name, duration and copy arrive.
export const COURSES = [
  {
    id: 'trading-strategies',
    name: 'Trading Strategies Program',
    duration: '45–60 days',
    copy:
      'A complete, structured course on trading strategies, from market structure and setups to risk management and execution. You get mentorship from practising traders throughout. Built for people who want a serious foundation, at their own pace beyond the course.',
  },
  {
    id: 'ai-algo-workshop',
    name: 'AI & Algo Trading Automation Workshop',
    duration: '2 days (weekend batch)',
    copy:
      'A two-day weekend workshop on automating your trading with AI and algorithms. Learn to turn a strategy into rules, connect them to execution, and manage risk automatically. Designed for working professionals, especially from IT, who want a systematic, low-screen-time approach to trading.',
  },
]

export const TEAM = [
  { name: 'Shrinivas Jachak', role: 'Program Lead', bio: '7+ years trading Indian and US markets.' },
  { name: 'Shubham', role: 'Program Lead', bio: null },
  { name: 'Shivam Patil', role: 'Senior Mentor – Options', bio: null },
]
// OPEN ITEM: written consent from each person before name/photo go public.
// Bios for Shubham and Shivam Patil are still to come (brief shows placeholders).

export const GALLERY = [
  { src: '/images/gallery/trading-29711.jpg', alt: 'The Trader Foundry trading floor with rows of monitors showing market charts', w: 1600, h: 1200 },
  { src: '/images/gallery/trading-29712.jpg', alt: 'Wide view of the Pune trading floor with desks, monitors and ceiling fans', w: 1200, h: 1600 },
  { src: '/images/gallery/trading-29713.jpg', alt: 'Trading desks with chart screens in a bright, open office', w: 1200, h: 1600 },
  { src: '/images/gallery/trading-29714.jpg', alt: 'Trading workstations with multi-screen chart setups', w: 1200, h: 1600 },
  { src: '/images/gallery/trading-29715.jpg', alt: 'Corner view of the trading floor with multi-monitor desks', w: 1200, h: 1600 },
]
