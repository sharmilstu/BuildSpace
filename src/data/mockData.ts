export interface Developer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  skills: string[];
  interests: string[];
  projects: string[];
  github?: string;
  linkedin?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  owner: string;
  ownerAvatar: string;
  members: number;
  maxMembers: number;
  status: "open" | "in-progress" | "completed";
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: "hackathon" | "open-source" | "internship" | "collaboration";
  description: string;
  deadline?: string;
  tags: string[];
  postedBy: string;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  type: "project" | "opportunity" | "team-update";
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  tags: string[];
}

export const developers: Developer[] = [
  {
    id: "1", name: "Aisha Patel", username: "aisha_dev", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Aisha",
    bio: "Full-stack developer passionate about open source and building tools for developers.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"], interests: ["Web3", "DevTools", "AI"],
    projects: ["BuildSpace", "CodeReview Bot"], github: "aishapatel", linkedin: "aishapatel"
  },
  {
    id: "2", name: "Marcus Chen", username: "mchen", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Marcus",
    bio: "ML engineer exploring the intersection of AI and web technologies.",
    skills: ["Python", "TensorFlow", "React", "FastAPI"], interests: ["Machine Learning", "NLP", "Open Source"],
    projects: ["SentimentAPI", "DataViz"], github: "marcuschen"
  },
  {
    id: "3", name: "Priya Sharma", username: "priya.codes", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Priya",
    bio: "Frontend specialist obsessed with performance and accessibility.",
    skills: ["Vue.js", "CSS", "Figma", "TypeScript"], interests: ["Design Systems", "A11y", "Performance"],
    projects: ["DesignKit"], github: "priyasharma", linkedin: "priyasharma"
  },
  {
    id: "4", name: "Jordan Rivera", username: "jrivera", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Jordan",
    bio: "Backend developer with a knack for distributed systems and cloud architecture.",
    skills: ["Go", "Kubernetes", "AWS", "gRPC"], interests: ["Cloud Native", "Microservices", "DevOps"],
    projects: ["CloudDeploy", "ServiceMesh"], github: "jordanrivera"
  },
  {
    id: "5", name: "Sofia Nguyen", username: "sofia_n", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Sofia",
    bio: "Mobile developer creating beautiful cross-platform experiences.",
    skills: ["React Native", "Flutter", "Swift", "Kotlin"], interests: ["Mobile UX", "AR/VR", "IoT"],
    projects: ["HealthTracker"], linkedin: "sofianguyen"
  },
  {
    id: "6", name: "Ethan Brooks", username: "ethan.b", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Ethan",
    bio: "Cybersecurity student interested in secure software development.",
    skills: ["Python", "Rust", "Linux", "Docker"], interests: ["Security", "Cryptography", "Ethical Hacking"],
    projects: ["SecureVault"], github: "ethanbrooks"
  },
];

export const projects: Project[] = [
  {
    id: "1", title: "BuildSpace", description: "A developer collaboration platform to unify profiles, projects, and opportunities.",
    techStack: ["React", "TypeScript", "Tailwind", "Supabase"], owner: "Aisha Patel", ownerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Aisha",
    members: 3, maxMembers: 5, status: "in-progress", createdAt: "2026-04-01"
  },
  {
    id: "2", title: "SentimentAPI", description: "REST API for real-time sentiment analysis using transformer models.",
    techStack: ["Python", "FastAPI", "HuggingFace", "Docker"], owner: "Marcus Chen", ownerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Marcus",
    members: 2, maxMembers: 4, status: "open", createdAt: "2026-03-28"
  },
  {
    id: "3", title: "DesignKit", description: "Open-source component library with built-in accessibility and theming.",
    techStack: ["Vue.js", "Storybook", "CSS", "TypeScript"], owner: "Priya Sharma", ownerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Priya",
    members: 1, maxMembers: 3, status: "open", createdAt: "2026-04-03"
  },
  {
    id: "4", title: "CloudDeploy", description: "One-click deployment tool for containerized applications on any cloud provider.",
    techStack: ["Go", "Kubernetes", "Terraform", "React"], owner: "Jordan Rivera", ownerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Jordan",
    members: 4, maxMembers: 6, status: "in-progress", createdAt: "2026-03-15"
  },
  {
    id: "5", title: "HealthTracker", description: "Cross-platform health & wellness app with wearable integrations.",
    techStack: ["React Native", "Firebase", "Node.js"], owner: "Sofia Nguyen", ownerAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Sofia",
    members: 2, maxMembers: 4, status: "open", createdAt: "2026-04-05"
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "1", title: "HackMIT 2026", type: "hackathon",
    description: "Annual hackathon at MIT. Build something amazing in 36 hours. Teams of 2-4.",
    deadline: "2026-05-15", tags: ["MIT", "36hrs", "Prizes"], postedBy: "Aisha Patel", createdAt: "2026-04-02"
  },
  {
    id: "2", title: "Contribute to React Router", type: "open-source",
    description: "Good first issues available for React Router v7. Great for learning open source workflows.",
    tags: ["React", "TypeScript", "Beginner-friendly"], postedBy: "Marcus Chen", createdAt: "2026-04-04"
  },
  {
    id: "3", title: "Summer Internship – Vercel", type: "internship",
    description: "Frontend infrastructure internship. Work on Next.js and Turbopack.",
    deadline: "2026-04-30", tags: ["Frontend", "Next.js", "Paid"], postedBy: "Priya Sharma", createdAt: "2026-04-01"
  },
  {
    id: "4", title: "AI Study Group", type: "collaboration",
    description: "Weekly study group covering the fast.ai curriculum. All levels welcome.",
    tags: ["AI", "Machine Learning", "Study Group"], postedBy: "Jordan Rivera", createdAt: "2026-04-06"
  },
];

export const feedItems: FeedItem[] = [
  {
    id: "1", type: "project", title: "New project: HealthTracker", description: "Sofia just created a new project looking for React Native and Firebase contributors.",
    author: "Sofia Nguyen", authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Sofia", timestamp: "2h ago", tags: ["React Native", "Firebase"]
  },
  {
    id: "2", type: "opportunity", title: "HackMIT 2026 registration open", description: "Registration is now live for HackMIT. Looking for teammates? Post in the projects section!",
    author: "Aisha Patel", authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Aisha", timestamp: "5h ago", tags: ["Hackathon"]
  },
  {
    id: "3", type: "team-update", title: "BuildSpace hit 3 contributors!", description: "The BuildSpace project now has 3 active contributors. Two more spots are open.",
    author: "Aisha Patel", authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Aisha", timestamp: "1d ago", tags: ["Team"]
  },
  {
    id: "4", type: "project", title: "SentimentAPI needs frontend help", description: "Marcus is looking for a React developer to build a dashboard for the SentimentAPI project.",
    author: "Marcus Chen", authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Marcus", timestamp: "1d ago", tags: ["React", "API"]
  },
  {
    id: "5", type: "opportunity", title: "Vercel internship deadline approaching", description: "Only 3 weeks left to apply for the Vercel frontend infrastructure internship.",
    author: "Priya Sharma", authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Priya", timestamp: "2d ago", tags: ["Internship"]
  },
];
