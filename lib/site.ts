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
  // Office pin from the Google Doc: 18°30'45.1"N 73°46'55.5"E.
  geo: { lat: 18.512528, lng: 73.782083 },
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
  tagline: 'Deep mentorship. 6 months. Worth ₹2 lakh, free for the first 10 students. A real shot at firm capital.',
  // Price block (Google Doc + brochure image): worth ₹2,00,000, free for the first 10 students.
  // OPEN ITEM: confirm whether "first 10" is per cohort or overall, and what later seats cost.
  worth: '₹2,00,000',
  freeFor: 'Free for the first 10 students',
  why: 'Free for the first 10 students because we invest in our traders: top performers go on to trade firm capital from our office, with no personal capital at risk. Selection by screening and interview.',
  stats: [
    { value: '6', label: 'months, full-time' },
    { value: '1-on-1', label: 'deep mentorship' },
    { value: '10–12', label: 'seats per cohort' },
    { value: 'Firm', label: 'capital for top performers' },
  ],
  copy:
    'TDP is our full-time, 6-month deep mentorship program for people who want to trade professionally. It is worth ₹2,00,000 and free for the first 10 students. Each cohort takes only 10–12 trainees, selected through screening and interviews. Each trainee is mentored one-on-one and in small groups by practising traders on our desk, follows professional risk rules, and is reviewed on every trade. Trainees who show consistent, disciplined performance get the opportunity to trade firm capital from our office. You never put your own money at risk.',
  details: [
    { label: 'Duration', value: '6 months, full-time' },
    { label: 'Fees', value: 'Worth ₹2,00,000 · free for the first 10 students' },
    { label: 'Seats', value: '10–12 per cohort' },
    { label: 'Format', value: 'In person, at our Pune office' },
    { label: 'Selection', value: 'Application, screening, interview' },
    { label: 'Outcome', value: 'Top performers get the opportunity to trade firm capital from our office' },
  ],
  // "The TDP journey" (brochure image).
  steps: [
    { title: 'Screening & Interview', text: 'Apply online, take a short assessment of aptitude and mindset, and meet our mentors.' },
    { title: 'Foundations & Process', text: 'A structured curriculum and a written trading process, under professional risk rules.' },
    { title: 'Mentored Live Trading', text: 'Trade on our desk, mentored one-on-one and in small groups, reviewed on every trade.' },
    { title: 'Performance Evaluation', text: 'Measured on consistency and risk discipline, not one lucky trade.' },
    { title: 'Trade Firm Capital', text: 'Top performers get the opportunity to trade firm capital from our office.' },
  ],
  everyTraineeGets: [
    { strong: 'Mentors who trade', rest: 'full-time on our desk' },
    { strong: 'Journaling & reviews', rest: 'for a repeatable process' },
    { strong: 'Risk discipline', rest: 'under live RMS rules' },
  ],
  alsoOffered: [
    { strong: 'AI & Algo Automation', rest: '2-day weekend batch' },
    { strong: 'NISM Prep', rest: 'Series VII & VIII' },
    { strong: 'Led by', rest: 'Founder Shrinivas Jachak' },
  ],
}

// Every answer below restates a fact from the content brief — keep it that way.
export const FAQ = [
  {
    q: 'Is TDP really free?',
    a: 'TDP is worth ₹2,00,000 and is free for the first 10 students. It is selection-based: you apply, take a short screening assessment and attend an interview.',
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
    a: 'We also run focused paid courses: a 45–60 day Trading Strategies Program and a 2-month Advanced Option Selling Mentorship with our prop-floor traders. Use Know More on the Courses page to enquire.',
  },
]

export const PRINCIPLES = [
  'Mentored by working traders',
  'Free deep mentorship',
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
    title: 'Free deep mentorship',
    text: 'Our 6-month Trader Development Program is a deep, full-time mentorship worth ₹2 lakh, free for the first 10 students.',
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

// Paid courses shown on /courses.
export const COURSES: { id: string; name: string; duration: string; copy: string; schedule?: { label: string; value: string }[] }[] = [
  {
    id: 'trading-strategies',
    name: 'Trading Strategies Program',
    duration: '45–60 days',
    copy:
      'A complete, structured course on trading strategies, from market structure and setups to risk management and execution. You get mentorship from practising traders throughout. Built for people who want a serious foundation, at their own pace beyond the course.',
  },
  {
    // Replaces the AI & Algo workshop card (Google Doc). Fee deliberately not shown:
    // the FIT brief says "Enquire for fee (not shown on site)".
    id: 'advanced-option-selling',
    name: 'Advanced Option Selling Mentorship',
    duration: '2 months',
    copy:
      'Learn option selling directly from 3–4 full-time professional traders on our prop floor, who trade the markets every day and together handle ₹20 Cr+ in trading limits. In month 1 they teach theory and strategies on weekends, from real experience, with a practical, hands-on approach. In month 2 you join them on the prop floor on weekdays to see how they actually perform in live markets.',
    schedule: [
      { label: 'Month 1', value: 'Theory & strategies · weekends' },
      { label: 'Month 2', value: 'Live practice on our prop floor · weekdays' },
    ],
  },
]

// Smaller programs listed under the courses (brochure: "Also offered").
export const ALSO_OFFERED = [
  { name: 'AI & Algo Automation workshop', detail: '2-day weekend batch' },
  { name: 'NISM Prep', detail: 'Series VII & VIII' },
]

// Leadership team — names and roles as confirmed by the client (28 Nov 2026).
export const TEAM: { name: string; role: string; bio: string | null }[] = [
  { name: 'Shrinivas Jachak', role: 'Founder', bio: '7+ years trading Indian and US markets.' },
  { name: 'Shubham Patil', role: 'Co-Founder', bio: null },
  { name: 'Shivam Kakade', role: 'Head of Operations', bio: null },
]

// "Our Mentors" — DUMMY profiles requested as placeholders (Google Doc). Replace the names,
// photos and experience with real, consented details before launch. While `sample` is true
// the card shows a "Sample profile" badge so a placeholder can never pass as a real person.
export const MENTORS: { name: string; role: string; image: string; experience: string[]; sample: boolean }[] = [
  {
    name: 'Mentor Name One',
    role: 'Options Trader · Prop Floor',
    image: '/placeholder-user.jpg',
    experience: ['10+ years trading NIFTY and BANK NIFTY options', 'Specialises in option selling and risk management'],
    sample: true,
  },
  {
    name: 'Mentor Name Two',
    role: 'Derivatives Trader · Prop Floor',
    image: '/placeholder-user.jpg',
    experience: ['8+ years in F&O on NSE', 'Mentors trainees on intraday execution and journaling'],
    sample: true,
  },
  {
    name: 'Mentor Name Three',
    role: 'Systematic Trader',
    image: '/placeholder-user.jpg',
    experience: ['6+ years building rule-based strategies', 'Leads the AI & Algo Automation workshop'],
    sample: true,
  },
]

export const GALLERY = [
  { src: '/images/gallery/trading-29711.jpg', alt: 'The Trader Foundry trading floor with rows of monitors showing market charts', w: 1600, h: 1200 },
  { src: '/images/gallery/trading-29712.jpg', alt: 'Wide view of the Pune trading floor with desks, monitors and ceiling fans', w: 1200, h: 1600 },
  { src: '/images/gallery/trading-29713.jpg', alt: 'Trading desks with chart screens in a bright, open office', w: 1200, h: 1600 },
  { src: '/images/gallery/trading-29714.jpg', alt: 'Trading workstations with multi-screen chart setups', w: 1200, h: 1600 },
  { src: '/images/gallery/trading-29715.jpg', alt: 'Corner view of the trading floor with multi-monitor desks', w: 1200, h: 1600 },
]
