import type { Project } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";

const statusStyles = {
  open: "bg-success/10 text-success border-success/20",
  "in-progress": "bg-warning/10 text-warning border-warning/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const statusLabels = {
  open: "Open",
  "in-progress": "In Progress",
  completed: "Completed",
};

const ProjectCard = ({ project }: { project: Project }) => {
  const { joinProject } = useData();
  const canJoin = project.status === "open" && project.members < project.maxMembers;

  const handleJoin = () => {
    const name = prompt("Enter your name to join:");
    if (!name?.trim()) return;
    if (name.trim().length > 100) { toast.error("Name is too long."); return; }
    joinProject(project.id, name.trim());
    toast.success(`You joined ${project.title}!`);
  };

  return (
    <div className="group rounded-lg border bg-card p-5 transition-shadow hover:shadow-md animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-semibold">{project.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        </div>
        <Badge variant="outline" className={`shrink-0 text-xs font-normal ${statusStyles[project.status]}`}>
          {statusLabels[project.status]}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span key={tech} className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={project.ownerAvatar} alt={project.owner} className="h-5 w-5 rounded-full bg-secondary" />
          <span className="text-xs text-muted-foreground">{project.owner}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {project.members}/{project.maxMembers}
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
