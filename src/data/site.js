import projects from "./projects";

export const RESUME_URL =
  "https://drive.google.com/file/d/1rwB04lMOs_L3CRjn29yunLOj_LMY152E/view?usp=sharing";
export const EMAIL = "lauxingying@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/lauxingying";
export const GITHUB = "https://github.com/xingyinggg";

/* On the lid's name card each job fits one row, so the long titles are
   shortened there (only there: the Experience card keeps them in full). */
export const LID_ROLE = {
  "Product Management Intern": "PM Intern",
  "Business Product Management Intern": "Business PM Intern",
  "Full-Stack Web Developer Intern": "Full-Stack Dev Intern",
};

export const ROLES = ["Product Manager", "AI Engineer", "Software Engineer"];

/* Grouped by the job tracks she applies for, in the words job posts use, and
   kept short: the strongest few per group. Every skill is backed by her
   experience or a project on this site; the full list is on the resume. */
export const skills = {
  "Product Management": [
    "Product Strategy",
    "Roadmapping",
    "Requirements Gathering",
    "A/B Testing",
    "KPI & Product Metrics",
    "Agile/Scrum",
    "Jira",
    "Figma",
  ],
  "AI & Machine Learning": [
    "LLM Integration",
    "OCR & Document Extraction",
    "Computer Vision (OpenCV)",
    "Machine Learning (scikit-learn)",
    "AI Coding Tools (Claude Code, Codex)",
  ],
  "Software Development": [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "React",
    "Next.js",
    "React Native",
    "Node.js/Express",
    "PostgreSQL",
    "AWS",
    "Docker",
  ],
  "Data & Analytics": [
    "Tableau",
    "SQL",
    "Pandas",
    "Exploratory Data Analysis",
    "Data Visualisation",
  ],
};

export const experience = [
  {
    period: "Sep 2026 — Dec 2026",
    role: "Product Management Intern",
    org: "Shopee",
    text: "Work on Search & Recommendation initiatives across A/B testing, data-driven rollout decisions and cross-functional feature, including cross-business use cases for Monee and ShopeeFood",
  },
  {
    period: "May 2026 — Aug 2026",
    role: "Business Product Management Intern",
    org: "Shopee",
    text: "Supported end-to-end product lifecycle across cross-functional teams including requirement gathering, KPI tracking, feature rollout support and iterative product improvement",
  },
  {
    period: "May 2025 — Oct 2025",
    role: "Full-Stack Web Developer Intern",
    org: "MindFlex Education",
    text: "Led the development and rollout of a premium tutor mobile app using React Native & Expo. Managed repository routing, UAT setup, and coordinated App Store release process",
  },
  {
    period: "2024 — 2025",
    role: "Vice President",
    org: "SMU Ellipsis",
    text: "Oversee 45 student council members and organize tech events, networking nights, and welfare drives for the School of Computing and Information Systems",
  },
];

/* Which cai fan dish each project is served as. `kind` picks the 3D model in
   BoxScene. The three featured projects fill the box, in stop order; the rest
   are side dishes on small plates along the front of the table. `zoom`
   enlarges screenshots whose content is a narrow phone screen in a wide frame. */
const FEATURED = {
  "AI Contract Review Platform": { kind: "sweetsour" },
  MaritimeRiskCare: { kind: "cabbage" },
  TaskAllinOne: { kind: "tomatoegg" },
};
const SIDES = {
  Infoguard: { kind: "curry", zoom: 1.5 },
  MakanSimi: { kind: "friedchicken" },
  CloudPantry: { kind: "frenchbean" },
  HeartSync: { kind: "eggplant" },
  ClearPass: { kind: "steamedegg" },
  "AfterClass Hackathon UI": { kind: "eggtofu" },
};
const ZOOM = { Artify: 1.5, "Cathay Cineplex Digital Transformation": 1.5 };
/* The kind of work each project shows (colour-coded, see DESIGN.md). Awards
   show only in the project's own card (`achievement` in projects.js). */
const DISCIPLINE = {
  "AI Contract Review Platform": "ai",
  ClearPass: "ai",
  MaritimeRiskCare: "ai",
  "AfterClass Hackathon UI": "design",
  Artify: "design",
  "Cathay Cineplex Digital Transformation": "design",
};
const tag = (p) => ({ ...p, discipline: DISCIPLINE[p.title] || "eng" });
const serve = (table, extra) =>
  Object.keys(table).map((title) =>
    tag({
      ...projects.find((p) => p.title === title),
      ...table[title],
      ...extra,
    }),
  );

/* The three dishes in the box. */
export const featured = serve(FEATURED, { featured: true });
/* The side plates, left to right along the front of the table. */
export const sides = serve(SIDES);
/* Projects without a dish; listed only inside the Projects panel. */
export const moreWork = projects
  .filter((p) => !FEATURED[p.title] && !SIDES[p.title])
  .map((p) => tag({ ...p, zoom: ZOOM[p.title] }));

/* Skills are served as the two sauces. The Skills panel lists the groups in
   this order: the same order as ROLES, then data. */
export const sauces = [
  {
    name: "Sambal",
    groups: ["Product Management", "AI & Machine Learning"],
  },
  {
    name: "Curry",
    groups: ["Software Development", "Data & Analytics"],
  },
];

/* Stall voice clips. Put recordings in public/audio/ and set the paths here,
   e.g. "/audio/xiao-mei.mp3". While a slot is null a short chime plays instead. */
export const VOICE = { xiaomei: null, zhege: null, nage: null };
