import React, { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Project = Tables<"projects">;
type Opportunity = Tables<"opportunities">;
type FeedItem = Tables<"feed_items"> & { author?: Pick<Profile, "name" | "avatar_url"> | null };

interface DataStore {
  developers: Profile[];
  projects: Project[];
  opportunities: Opportunity[];
  feedItems: FeedItem[];
  loading: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  addProject: (project: { title: string; description: string; tech_stack: string[]; max_members: number; link?: string }) => Promise<void>;
  joinProject: (projectId: string) => Promise<void>;
  addOpportunity: (opp: { title: string; type: string; description: string; tags: string[]; deadline?: string; link?: string }) => Promise<void>;
}

const DataContext = createContext<DataStore | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: developers = [], isLoading: loadingDevs } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const { data: opportunities = [], isLoading: loadingOpps } = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("opportunities").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Opportunity[];
    },
  });

  const { data: feedItems = [], isLoading: loadingFeed } = useQuery({
    queryKey: ["feed_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_items")
        .select("*, author:profiles!feed_items_author_id_fkey(name, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as FeedItem[];
    },
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["profiles"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    queryClient.invalidateQueries({ queryKey: ["feed_items"] });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["profiles"] });
  };

  const addProject = async (project: { title: string; description: string; tech_stack: string[]; max_members: number; link?: string }) => {
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase.from("projects").insert({
      ...project,
      owner_id: user.id,
      members: 1,
      status: "open",
    });
    if (error) throw error;
    invalidateAll();
  };

  const joinProject = async (projectId: string) => {
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase.from("project_members").insert({
      project_id: projectId,
      user_id: user.id,
    });
    if (error) throw error;
    invalidateAll();
  };

  const addOpportunity = async (opp: { title: string; type: string; description: string; tags: string[]; deadline?: string; link?: string }) => {
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase.from("opportunities").insert({
      ...opp,
      posted_by: user.id,
      deadline: opp.deadline || null,
    });
    if (error) throw error;
    invalidateAll();
  };

  const loading = loadingDevs || loadingProjects || loadingOpps || loadingFeed;

  return (
    <DataContext.Provider value={{ developers, projects, opportunities, feedItems, loading, updateProfile, addProject, joinProject, addOpportunity }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
