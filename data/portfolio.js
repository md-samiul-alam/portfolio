export const site = {
  name: "Md Samiul Alam",
  shortName: "Samiul",
  title: "Md Samiul Alam | Full-Stack Developer",
  description:
    "Software Development Engineer II at Autodesk. Full-stack developer specializing in Next.js, React, Node.js, Angular, and AWS cloud solutions.",
  email: "samiulalam555@gmail.com",
  phone: "+18073559935",
  phoneDisplay: "+1 (807) 355 9935",
  portfolioUrl: "https://md-samiul-alam.github.io/portfolio/",
};

export const navLinks = [
  { href: "#intro", label: "Intro" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#works", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#demos", label: "Demos" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export const demosSection = {
  title: "Libraries in Action",
  subtitle: "Interactive samples built with tools from my production work.",
  status: "under_development",
  planned: ["Highcharts.js", "Konva.js", "Yjs"],
};

export const hero = {
  pretitle: "Hello World",
  lines: [
    "I am Samiul,",
    "a full-stack developer",
    "at Autodesk",
  ],
};

export const about = {
  title: "About",
  bio: `Software Development Engineer II at Autodesk, building innovative design-and-make software with modern full-stack technologies. Previously delivered SPAs, REST APIs, and ML-integrated GIS applications using Angular, React, Next.js, Node.js, Python Django, and Laravel. Skilled in agile delivery, AWS cloud deployment, and database optimization across MS SQL Server, PostgreSQL, and MongoDB. Passionate about clean architecture, mentoring developers, and shipping reliable products at scale.`,
  cvPath: "/resources/Resume_of_Md_Samiul_Alam__SE.pdf",
  photoPath: "/images/profile-photo.jpg",
};

export const skillCategories = [
  {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Java", "PHP", "C++"],
  },
  {
    label: "Front-end",
    items: [
      "Next.js",
      "Angular",
      "React",
      "Konva.js",
      "Babylon.js",
      "Highcharts.js",
      "Tailwind CSS",
      "Material UI",
      "Bootstrap",
      "HTML5",
      "CSS3",
    ],
  },
  {
    label: "Back-end",
    items: [
      "Node.js (Express)",
      "Yjs",
      "Hocuspocus",
      "WebSocket",
      "Python Django",
      "FastAPI",
      "Laravel",
    ],
  },
  {
    label: "Database",
    items: ["MS SQL Server", "PostgreSQL", "MongoDB"],
  },
  {
    label: "DevOps & Cloud",
    items: [
      "Docker",
      "CI/CD",
      "GitLab",
      "CircleCI",
      "AWS EC2",
      "AWS ECS",
      "AWS RDS",
      "AWS S3",
    ],
  },
  {
    label: "AI & Integrations",
    items: ["OpenAI", "Gemini", "Okta", "SSO"],
  },
  {
    label: "Tools & Practices",
    items: ["Git", "Jira", "Swagger", "Mocha", "Jest", "Jasmine"],
  },
];

export const experience = [
  {
    id: "autodesk-sde2",
    company: "Autodesk",
    companyUrl: "https://www.autodesk.com/",
    role: "Software Development Engineer II",
    location: "Thunder Bay, Ontario, Canada",
    timeframe: "June 2025 - Present",
    bullets: [
      "Develop and maintain full-stack web applications using Next.js, React, TypeScript, and Node.js for Autodesk's design-and-make platform.",
      "Build scalable REST APIs and cloud-backed services on AWS, following best practices for performance, security, and reliability.",
      "Collaborate with cross-functional engineering teams in agile sprints to deliver customer-focused features and continuous product improvements.",
      "Participate in code reviews, unit testing, and CI/CD workflows to uphold code quality and reduce post-release defects.",
      "Contribute to enhancing existing applications by understanding customer needs and translating them into maintainable technical solutions.",
    ],
    projects: [
      {
        name: "StoryArc",
        url: "https://www.autodesk.com/",
        description:
          "Collaborative storytelling platform with real-time multi-user editing, 3D scene planning, and AI-assisted creative workflows.",
      },
    ],
    highlights: ["Next.js", "Node.js", "AWS", "TypeScript"],
  },
  {
    id: "lakehead-ra",
    company: "Lakehead Applied Geomatics Research Laboratory",
    role: "Research Assistant",
    timeframe: "January 2022 - April 2024",
    bullets: [
      "Developed a full-stack web application using Angular and Python Django, integrating a custom machine-learning model for real-time data analysis and predictions as a GIS software solution.",
      "Built RESTful APIs for the backend server running a machine learning model.",
      "Designed an interactive and responsive user interface with Tailwind CSS, allowing users to visualize and interact with ML model outputs.",
      "Deployed the app to AWS EC2, ensuring availability for end-users.",
    ],
  },
  {
    id: "lakehead-gta",
    company:
      "Department of Geography and the Environment, Lakehead University",
    role: "Graduate Teaching Assistant",
    timeframe: "September 2022 - April 2024",
    bullets: [
      "Delivered tutorials, seminars, and lectures on GIS and environmental topics.",
      "Mentored students in developing complex GIS projects and assignments.",
      "Assessed lab work and assignments and provided structured feedback.",
    ],
  },
  {
    id: "enosis-senior",
    company: "Enosis Solutions",
    role: "Senior Software Engineer",
    timeframe: "January 2021 - September 2022",
    projects: [
      {
        name: "Inspect Check",
        url: "https://inspectcheck.com/",
        description:
          "Property inspection software and mobile app for paperless inspections on iPad, iPhone, and Android in the United States.",
        demoUrl: "https://cutt.ly/Jrv6PLfh",
      },
    ],
    bullets: [
      "Achieved 100% of sprint goals by leading sprint planning, facilitating retrospectives, and driving continuous improvement in agile processes.",
      "Presented project progress reports, proposed solutions to challenges, and fostered transparent communication with clients.",
      "Enhanced code quality and consistency by implementing linting tools, streamlining code reviews, and reducing bugs related to coding standards.",
      "Identified and prioritized tasks in the SDLC while streamlining project tracking and team collaboration using Jira.",
      "Reduced post-release bugs and resolution time through regular code reviews, merge conflict resolution, and advanced debugging.",
      "Increased productivity of junior developers through hands-on mentoring, knowledge sharing, and skill development initiatives.",
      "Optimized complex database queries and stored procedures with indexing, query restructuring, and normalization, improving API response times.",
    ],
  },
  {
    id: "enosis-se",
    company: "Enosis Solutions",
    role: "Software Engineer",
    timeframe: "October 2018 - December 2020",
    bullets: [
      "Developed and maintained high-performance SPAs using Angular, optimizing component architecture, state management, and testing practices.",
      "Improved user satisfaction by resolving cross-browser issues and enhancing UI/UX with Angular Material and Bootstrap.",
      "Designed database schemas and optimized complex queries in MS SQL Server, reducing query execution time.",
      "Streamlined feature development with reusable components, custom modules, directives, pipes, and services.",
      "Deployed secure, scalable web applications on AWS EC2 with DNS, SSL, and Docker containerization.",
      "Integrated Okta Authentication API with OAuth 2.0 and OpenID Connect for SSO and token-based auth.",
      "Reduced production bugs by 25% through unit and end-to-end tests with Mocha and Jasmine.",
      "Developed secure payment integrations with Stripe and API documentation with Swagger.",
      "Improved system performance with MongoDB in a microservices architecture for scalability and rapid data growth.",
      "Established CI/CD pipelines with GitLab, significantly improving deployment time.",
    ],
  },
  {
    id: "aust-trainer",
    company: "Ahsanullah University of Science and Technology",
    role: "Competitive Programming Trainer",
    timeframe: "2017 - 2022",
    bullets: [
      "Conducted training sessions on advanced data structures, algorithms, and problem-solving for junior students.",
      "Organized weekly practice sessions simulating contest environments.",
      "Curated programming problems from easy to challenging difficulty.",
      "Coached participants for inter-university programming contests.",
    ],
  },
];

export const featuredProjects = [
  {
    id: "storyarc",
    name: "StoryArc",
    company: "Autodesk",
    url: "https://www.autodesk.com/",
    description:
      "Collaborative storytelling platform enabling teams to plan scripts and scenes with real-time editing, 3D scene capabilities, and AI-assisted creative workflows.",
    tools: [
      "Next.js",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Yjs",
      "Hocuspocus",
      "Docker",
      "AWS ECS",
      "AWS RDS",
      "OpenAI",
      "Gemini",
    ],
    domains: [
      "Real-time collaboration systems",
      "3D scene editing pipelines",
      "AI-assisted creative tooling",
      "Cloud-native application deployment",
    ],
    contributions: [
      "Developed a collaborative storytelling platform in a monorepo, integrating a Next.js frontend with a Hocuspocus/Yjs backend for real-time synchronization.",
      "Architected PostgreSQL persistence strategies with node-pg-migrate automated schema migrations to ensure seamless deployments and data integrity.",
      "Integrated OpenAI and Gemini APIs for automated scene generation and vision analysis.",
      "Built and maintained Docker Compose local environments mirroring production ECS workflows for consistent testing and deployment.",
      "Implemented real-time multi-user document synchronization with conflict resolution and persistent state for script and scene-planning data.",
      "Developed secure internal service communication using shared secrets and JWT-based authentication for server-to-server operations and document lifecycle management.",
      "Authored technical documentation and Architecture Decision Records (ADRs) to standardize naming conventions and database management across the team.",
    ],
  },
  {
    id: "open-kitchen",
    name: "Open Kitchen",
    company: "Enosis Solutions",
    url: "https://powerhousedynamics.com/about-us/",
    description:
      "Web-based platform by Powerhouse Dynamics and Enosis Solutions to enhance energy efficiency, food safety, and operational efficiency in food service through real-time monitoring and analysis.",
    demoUrl: "https://cutt.ly/le6yuChL",
    tools: [
      "Angular",
      "Material UI",
      "Highcharts.js",
      "Node.js (Express)",
      "MS SQL Server",
      "Okta",
    ],
    contributions: [
      "Implemented interactive data visualizations with Highcharts.js.",
      "Built scalable Angular components for the front-end.",
      "Developed RESTful APIs with secure Okta authentication using Node.js and Express.",
      "Optimized complex SQL queries to resolve REST API bottlenecks.",
    ],
  },
  {
    id: "v-alert",
    name: "V-Alert",
    company: "Enosis Solutions",
    url: "https://www.valcom.com/solutions/engineered-solutions/software-suite/valert/",
    description:
      "Mobile app for rapid emergency notifications, enabling organizations to send critical information via unlimited messaging channels, with geofencing and system integration.",
    demoUrl: "https://cutt.ly/Pe6yuMtA",
    tools: [
      "Node.js (Express)",
      "MongoDB",
      "CircleCI",
      "Docker",
      "WebSocket",
    ],
    contributions: [
      "Developed backend API with Node.js, Express, and MongoDB including CRUD operations.",
      "Integrated CI/CD pipelines for automated deployments.",
      "Containerized microservices with Docker for consistency and scalability.",
      "Implemented WebSocket functionality for real-time, low-latency messaging.",
    ],
  },
];

export const education = [
  {
    id: "lakehead-mes",
    school: "Lakehead University",
    degree: "Master of Environmental Studies (Thesis)",
    location: "Thunder Bay, ON, Canada",
    timeframe: "January 2022 - May 2024",
    description:
      "Thesis: Developed a low-cost remote sensing system for monitoring soybean leaf chlorophyll, automated high-resolution spectral capture, validated GNDVI–LCC correlation with field data, and built software to apply the proposed model.",
  },
  {
    id: "aust-bsc",
    school: "Ahsanullah University of Science and Technology",
    degree: "B.Sc. in Computer Science and Engineering",
    location: "Dhaka, Bangladesh",
    timeframe: "September 2014 - December 2018",
    description:
      "Thesis: Rice yield estimation using MODIS NDVI and ground truth (2011–2016); regression models per division with R² up to 0.942.",
  },
];

export const achievements = [
  "Champion — Intra AUST Programming Contest, Spring 2017",
  "Champion — Intra AUST Programming Contest, Spring 2016",
  "2nd Place — Intra AUST Programming Contest, Spring 2015",
];

export const certifications = [
  {
    name: "Cert Prep: Scrum Master",
    url: "https://cutt.ly/Oe6yyYVl",
  },
  {
    name: "Angular: Creating and Hosting a Full-Stack Site",
    url: "https://cutt.ly/Ke6yrptt",
  },
  {
    name: "Building Modern Projects with React",
    url: "https://cutt.ly/be6ytFMq",
  },
];

export const contact = {
  title: "Get In Touch",
  headline:
    "I'd love to hear from you. Whether you have a question or want to chat about system design, cloud architecture, or new technologies — reach out anytime.",
  ctaTitle: "Let's work together",
  ctaDescription:
    "Have a project in mind or just want to say hello? Drop me a line — I typically respond within 1–2 business days.",
  ctaButton: "Email me",
};

export const socialLinks = [
  {
    name: "LinkedIn",
    slug: "linkedin",
    href: "https://www.linkedin.com/in/md-samiul-alam/",
  },
  {
    name: "Leetcode",
    slug: "leetcode",
    href: "https://leetcode.com/u/samiul-alam/",
  },
  {
    name: "Facebook",
    slug: "facebook",
    href: "https://www.facebook.com/pinanzo/",
  },
  {
    name: "Instagram",
    slug: "instagram",
    href: "https://www.instagram.com/pinanzo/",
  },
];
