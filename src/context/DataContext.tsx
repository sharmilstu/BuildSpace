import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  developers as initialDevs,
  projects as initialProjects,
  opportunities as initialOpps,
  feedItems as initialFeed,
  type Developer,
  type Project,
  type Opportunity,
  type FeedItem,
} from "@/data/mockData";

interface DataStore {
  developers: Developer[];
  projects: Project[];
  opportunities: Opportunity[];
  feedItems: FeedItem[];
  addDeveloper: (dev: Omit<Developer, "id">) => void;
  updateDeveloper: (id: string, dev: Partial<Developer>) => void;
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  joinProject: (projectId: string, userName: string) => void;
  addOpportunity: (opp: Omit<Opportunity, "id" | "createdAt">) => void;
}

const DataContext = createContext<DataStore | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [developers, setDevelopers] = useState<Developer[]>(() => loadFromStorage("bs_devs", initialDevs));
  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage("bs_projects", initialProjects));
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => loadFromStorage("bs_opps", initialOpps));
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => loadFromStorage("bs_feed", initialFeed));

  useEffect(() => { localStorage.setItem("bs_devs", JSON.stringify(developers)); }, [developers]);
  useEffect(() => { localStorage.setItem("bs_projects", JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem("bs_opps", JSON.stringify(opportunities)); }, [opportunities]);
  useEffect(() => { localStorage.setItem("bs_feed", JSON.stringify(feedItems)); }, [feedItems]);

  const addFeedItem = useCallback((type: FeedItem["type"], title: string, description: string, author: string, tags: string[]) => {
    const item: FeedItem = {
      id: crypto.randomUUID(),
      type,
      title,
      description,
      author,
      authorAvatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(author)}`,
      timestamp: "Just now",
      tags,
    };
    setFeedItems((prev) => [item, ...prev]);
  }, []);

  const addDeveloper = useCallback((dev: Omit<Developer, "id">) => {
    const newDev: Developer = { ...dev, id: crypto.randomUUID() };
    setDevelopers((prev) => [newDev, ...prev]);
    addFeedItem("team-update", `${newDev.name} joined BuildSpace`, `Welcome ${newDev.name}! They're skilled in ${newDev.skills.slice(0, 3).join(", ")}.`, newDev.name, newDev.skills.slice(0, 2));
  }, [addFeedItem]);

  const updateDeveloper = useCallback((id: string, updates: Partial<Developer>) => {
    setDevelopers((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  const addProject = useCallback((project: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = { ...project, id: crypto.randomUUID(), createdAt: new Date().toISOString().split("T")[0] };
    setProjects((prev) => [newProject, ...prev]);
    addFeedItem("project", `New project: ${newProject.title}`, newProject.description, newProject.owner, newProject.techStack.slice(0, 2));
  }, [addFeedItem]);

  const joinProject = useCallback((projectId: string, userName: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && p.members < p.maxMembers) {
          addFeedItem("team-update", `${userName} joined ${p.title}`, `${p.title} now has ${p.members + 1}/${p.maxMembers} members.`, userName, p.techStack.slice(0, 2));
          return { ...p, members: p.members + 1 };
        }
        return p;
      })
    );
  }, [addFeedItem]);

  const addOpportunity = useCallback((opp: Omit<Opportunity, "id" | "createdAt">) => {
    const newOpp: Opportunity = { ...opp, id: crypto.randomUUID(), createdAt: new Date().toISOString().split("T")[0] };
    setOpportunities((prev) => [newOpp, ...prev]);
    addFeedItem("opportunity", newOpp.title, newOpp.description, newOpp.postedBy, newOpp.tags.slice(0, 2));
  }, [addFeedItem]);

  return (
    <DataContext.Provider value={{ developers, projects, opportunities, feedItems, addDeveloper, updateDeveloper, addProject, joinProject, addOpportunity }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
