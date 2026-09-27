/**
 * All editable site content lives here.
 * Change text, numbers, links and prices in this file — no other code needs to change.
 *
 * Anything marked "PLACEHOLDER" must be replaced with real information before launch.
 * The site hides a section automatically when its list is empty, so you can
 * delete placeholder entries if you don't have real ones yet.
 */

export type Stat = { value: string; label: string };
export type Client = { name: string; logo?: string; url?: string };
export type Service = { title: string; description: string; includes: string[] };
export type Plan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};
export type Testimonial = { quote: string; name: string; role: string };
export type Faq = { q: string; a: string };

export const site = {
  name: "Nav Fusion Media",
  shortName: "NFM",
  url: "https://navfusionmedia.com",
  tagline: "Podcasts, YouTube and study books, made in India.",
  description:
    "Nav Fusion Media records, edits and publishes podcasts and YouTube videos, designs thumbnails, and writes JNVST prep books. We make Navodayans Talk and Navu Medha.",
  locale: "en_IN",

  contact: {
    // PLACEHOLDER — the public email shown on the site.
    email: "hello@navfusionmedia.com",
    // PLACEHOLDER — country code + number, digits only (e.g. 919876543210).
    whatsapp: "910000000000",
    whatsappMessage: "Hi Nav Fusion Media, I'd like to talk about a project.",
    // PLACEHOLDER — leave empty ("") to hide.
    phone: "",
    city: "Delhi, India",
    hours: "Mon–Sat, 10am–7pm IST",
  },

  // Leave a URL empty ("") to hide that icon.
  socials: {
    youtube: "https://www.youtube.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "",
    x: "",
    facebook: "",
  },

  hero: {
    eyebrow: "Media studio · India",
    title: "We make podcasts, YouTube videos and study books.",
    subtitle:
      "You bring the idea or the guest. We plan it, record it, edit it, design it and publish it. Our own shows are Navodayans Talk and the Navu Medha book series.",
    primaryCta: { label: "Book a free call", href: "#contact" },
    secondaryCta: { label: "See our work", href: "/work" },
  },

  // PLACEHOLDER — replace with your real numbers.
  stats: [
    { value: "0", label: "Episodes published" },
    { value: "0", label: "Thumbnails designed" },
    { value: "0", label: "Hours of video edited" },
    { value: "0", label: "Books in print" },
  ] satisfies Stat[] as Stat[],

  // PLACEHOLDER — add real clients. Put logo files in /public/clients/ and set logo: "/clients/name.png".
  clients: [
    { name: "Navodayans Talk" },
    { name: "Navu Medha" },
  ] satisfies Client[] as Client[],

  services: [
    {
      title: "Podcast production",
      description: "Audio and video podcasts, from booking the guest to the final upload.",
      includes: ["Guest research and questions", "Recording setup", "Edit and sound clean-up", "Show notes and chapters"],
    },
    {
      title: "YouTube channel management",
      description: "We run the channel so you can focus on making videos.",
      includes: ["Titles, descriptions and tags", "Upload schedule", "Monthly report"],
    },
    {
      title: "Thumbnails",
      description: "Thumbnails in Hindi or English, built to get clicked.",
      includes: ["2 options per video", "Guest photo cut-out", "Matching style across the channel"],
    },
    {
      title: "Video editing",
      description: "Long videos cut clean, with captions and simple graphics.",
      includes: ["Cuts and pacing", "Hindi or English captions", "Intro, outro and lower thirds"],
    },
    {
      title: "Reels and Shorts",
      description: "Short clips cut from your long videos for Instagram and YouTube Shorts.",
      includes: ["Clip selection", "Vertical crop", "Burned-in captions"],
    },
    {
      title: "Books and study material",
      description: "Writing, layout and design for exam-prep and school books.",
      includes: ["Chapter writing", "Practice questions with answers", "Print-ready layout"],
    },
  ] satisfies Service[] as Service[],

  // PLACEHOLDER — example prices. Set your own.
  pricing: {
    note: "Prices in INR, before GST. Custom quotes for larger work.",
    plans: [
      {
        name: "Starter",
        price: "₹4,999",
        period: "per video",
        description: "One long video, edited and ready to upload.",
        features: ["Edit up to 30 min", "1 thumbnail", "Title and description", "2 rounds of changes"],
      },
      {
        name: "Channel",
        price: "₹19,999",
        period: "per month",
        description: "Four videos a month, plus clips.",
        features: ["4 long videos", "4 thumbnails", "8 Reels or Shorts", "Upload and scheduling", "Monthly report"],
        highlighted: true,
      },
      {
        name: "Podcast",
        price: "Custom",
        description: "Full podcast production, from guest to upload.",
        features: ["Guest research", "Recording support", "Video and audio edit", "Clips and thumbnails"],
      },
    ] satisfies Plan[] as Plan[],
  },

  // PLACEHOLDER — replace with real quotes, with the client's permission.
  testimonials: [
    {
      quote: "Replace this with a real quote from a client.",
      name: "Client name",
      role: "Role, Company",
    },
  ] satisfies Testimonial[] as Testimonial[],

  faqs: [
    { q: "How long does one video take?", a: "Usually 3–5 working days after we get the raw footage." },
    { q: "Do you work in Hindi?", a: "Yes. We edit, caption and design in Hindi and English." },
    { q: "Do I need my own recording gear?", a: "No. We can suggest a simple setup, or you can send phone recordings." },
    { q: "How do payments work?", a: "50% before we start, 50% on delivery. Monthly plans are paid at the start of each month." },
  ] satisfies Faq[] as Faq[],

  nav: [
    { label: "Services", href: "/#services" },
    { label: "Work", href: "/work" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],

  leadForm: {
    interests: [
      "Podcast production",
      "YouTube channel management",
      "Thumbnails",
      "Video editing",
      "Reels and Shorts",
      "Books and study material",
      "Guest on Navodayans Talk",
      "Something else",
    ],
    budgets: ["Under ₹10,000", "₹10,000–₹25,000", "₹25,000–₹50,000", "Over ₹50,000", "Not sure yet"],
    successMessage: "Thanks. We'll reply within one working day.",
  },
};

export type Site = typeof site;

export function whatsappLink(message = site.contact.whatsappMessage) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
