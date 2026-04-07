import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Project = Tables<"projects">;

const statusStyles: Record<string, string> = {
  open: "bg-success/10 text-success border-success/20",
  "in-progress": "bg-warning/10 text-warning border-warning/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  completed: "Completed",
};

const ProjectCard = ({ project }: { project: Project }) => {
  const { joinProject } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canJoin = project.status === "open" && project.members < project.max_members;

  const handleJoin = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (user.id === project.owner_id) {
      toast.info("You already own this project.");
      return;
    }
    try {
      await joinProject(project.id);
      toast.success(`You joined ${project.title}!`);
    } catch (err: any) {
      if (err?.message?.includes("duplicate")) {
        toast.info("You've already joined this project.");
      } else {
        toast.error("Failed to join project.");
      }
    }
  };

  return (
    <div className="group rounded-lg border bg-card p-5 transition-shadow hover:shadow-md animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-semibold">{project.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        </div>
        <Badge variant="outline" className={`shrink-0 text-xs font-normal ${statusStyles[project.status] ?? ""}`}>
          {statusLabels[project.status] ?? project.status}
        </Badge>
      </div>

      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <span key={tech} className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(project.created_at).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {project.members}/{project.max_members}
          </span>
          {canJoin && (
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={handleJoin}>
              <UserPlus className="h-3 w-3" /> Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
