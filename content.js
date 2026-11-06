/*
  All of the text on the site lives in this file.
  Edit a value, save, refresh the page. You never need to touch the layout code.

  - Leave a link empty ("") and its button disappears.
  - To add a project, copy one block inside `projects`, change the words,
    and pick an `art` value: "search", "chat", "browser" or "cards".
*/
window.SITE = {
  name: { first: "Marie", last: "Dippon" },
  initials: "MD",
  location: "Bay Area, California",
  tagline: "iOS developer and founder. I build apps with SwiftUI, Firebase, and AI.",
  subline: "Computer science senior at Saint Mary's College of California, class of 2027.",

  email: "marierose.dippon@gmail.com",
  links: {
    github: "https://github.com/marierosedippon",
    linkedin: "https://www.linkedin.com/in/marie-dippon-b00651264/",
    resume: "resume.pdf"
  },

  // Optional. Put a photo in this folder (for example photo.jpg) and set this to "photo.jpg".
  // While it is empty, the About section shows text only.
  photo: "",

  stats: [
    { value: 1, label: "app live on the App Store" },
    { value: 4, label: "projects built" },
    { value: 2, label: "languages spoken" }
  ],

  ticker: [
    "Swift", "SwiftUI", "Firebase", "Supabase", "React",
    "TypeScript", "Three.js", "Gemini API", "Stripe", "SQL"
  ],

  about: {
    heading: "Hi there!",
    lead: "I build iOS apps and the backends behind them.",
    paragraphs: [
      "I'm a senior computer science student at Saint Mary's College of California, with a minor in communications. Most of my work is in SwiftUI, Firebase, and AI APIs.",
      "I'm the iOS developer behind ClipScout, an AI video search app on the App Store. I lead development on Mutuals, a networking app I co-founded, and I'm building Forge, a browser-based 3D workspace for hardware teams.",
      "I speak English and German. When I need a break from apps, I build small games, like Secret Impostor."
    ]
  },

  // Each skill is [name, two-letter badge]
  skills: [
    { group: "Mobile", items: [["Swift", "Sw"], ["SwiftUI", "UI"], ["App Store Connect", "AS"], ["TestFlight", "TF"]] },
    { group: "Backend", items: [["Firebase", "Fb"], ["Firestore", "Fs"], ["Supabase", "Sb"], ["Stripe", "St"], ["In-app purchases", "IA"]] },
    { group: "Web", items: [["React", "Re"], ["TypeScript", "TS"], ["Vite", "Vi"], ["Three.js", "3D"]] },
    { group: "AI and data", items: [["Gemini API", "Ge"], ["SQL", "SQ"], ["R", "R"]] }
  ],

  projects: [
    {
      id: "clipscout",
      art: "search",
      title: "ClipScout",
      kind: "iOS app, live on the App Store",
      summary: "An AI video search app powered by Gemini. I'm the sole iOS developer: I built the app in SwiftUI and took it through App Store review.",
      role: "Sole iOS developer",
      tags: ["Swift", "SwiftUI", "Firebase", "Gemini API"],
      points: [
        "Built the SwiftUI app and connected search to Gemini 2.5 Flash.",
        "Debugged search performance: API quota limits, the batch architecture, and a priority inversion in a GCD semaphore.",
        "Cleared several App Store review rejections: EULA, account deletion, in-app purchase metadata, and privacy strings.",
        "Shipped multiple builds through App Store Connect.",
        "Built the affiliate portal on Firebase."
      ],
      link: { label: "View on the App Store", href: "https://apps.apple.com/app/id6763501537" }
    },
    {
      id: "mutuals",
      art: "chat",
      title: "Mutuals",
      kind: "iOS networking app",
      summary: "A networking app with real-time messaging and a Firebase backend. I'm the co-founder and lead developer.",
      role: "Co-founder and lead developer",
      tags: ["Swift", "SwiftUI", "Firebase", "Firestore"],
      points: [
        "Designed the Firestore schema and its security rules.",
        "Built real-time messaging, onboarding, a paywall, and account deletion.",
        "Redesigned the whole interface in a dark theme.",
        "Added Firebase Storage for media.",
        "Removed the video calling dependency and fixed bundle ID mismatches on the way to TestFlight."
      ],
      link: null
    },
    {
      id: "forge",
      art: "browser",
      title: "Forge",
      kind: "Web app for hardware teams",
      summary: "A browser-based 3D workspace where hardware teams keep product models, versions, and feedback in one place, and share progress with clients.",
      role: "Founder and sole developer",
      tags: ["React", "TypeScript", "Vite", "Three.js", "Supabase", "Stripe"],
      points: [
        "Wrote the full Supabase schema with row-level security policies.",
        "Built a client portal that shows only what the team chooses to share.",
        "Designed the product to replace scattered email and chat threads for teams making physical products.",
        "Set up the stack: React, TypeScript, Vite, Three.js, Supabase, and Stripe."
      ],
      link: null
    },
    {
      id: "impostor",
      art: "cards",
      title: "Secret Impostor",
      kind: "Multiplayer web game",
      summary: "A bluffing game for 3 to 8 players. Share a room code and play. No accounts.",
      role: "Designer and developer",
      tags: ["Multiplayer", "Web game", "Room codes"],
      points: [
        "Runs in the browser with no login.",
        "Players join with a room code.",
        "Supports 3 to 8 players in one game."
      ],
      link: { label: "Play it", href: "https://secret-impostor.marierose03.chatgpt.site" }
    }
  ],

  education: {
    school: "Saint Mary's College of California",
    degree: "BS in Computer Science",
    detail: "Minor in Communications. Expected May 2027."
  },
  languages: [
    { name: "English", level: "Fluent" },
    { name: "German", level: "Fluent" }
  ],

  now: {
    updated: "November 2026",
    items: [
      "Shipping updates to ClipScout.",
      "Building Forge.",
      "Finishing my CS degree (May 2027).",
      "Sketching a color analysis and closet app."
    ]
  },

  contact: {
    heading: "Let's build something good.",
    note: "Email is the best way to reach me."
  }
};
