import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateProjectDialog = () => {
  const { addProject } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [maxMembers, setMaxMembers] = useState("4");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => { setTitle(""); setDescription(""); setTechStack(""); setMaxMembers("4"); setLink(""); };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && !user) { navigate("/auth"); return; }
    setOpen(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim(), d = description.trim();
    if (!t || !d) { toast.error("Please fill in all required fields."); return; }
    if (t.length > 100 || d.length > 500) { toast.error("One or more fields exceed the maximum length."); return; }
    const techs = techStack.split(",").map(s => s.trim()).filter(Boolean).slice(0, 10);
    if (techs.length === 0) { toast.error("Please add at least one technology."); return; }
    setSubmitting(true);
    try {
      await addProject({ 
        title: t, 
        description: d, 
        tech_stack: techs, 
        max_members: parseInt(maxMembers),
        link: link.trim() || undefined
      });
      toast.success("Project created!");
      reset();
      setOpen(false);
    } catch { toast.error("Failed to create project."); }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Start a new project and find collaborators.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="proj-title">Title *</Label>
            <Input id="proj-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Project" maxLength={100} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="proj-desc">Description *</Label>
            <Textarea id="proj-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are you building?" maxLength={500} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="proj-tech">Tech Stack * <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
            <Input id="proj-tech" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Node.js, PostgreSQL" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="proj-link">External Link <span className="text-xs text-muted-foreground">(optional)</span></Label>
            <Input id="proj-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://github.com/..." type="url" />
          </div>
          <div className="space-y-1.5">
            <Label>Team Size</Label>
            <Select value={maxMembers} onValueChange={setMaxMembers}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 8, 10].map(n => (
                  <SelectItem key={n} value={String(n)}>{n} members</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
