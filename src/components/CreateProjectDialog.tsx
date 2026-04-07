import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/DataContext";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const CreateProjectDialog = () => {
  const { addProject } = useData();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [maxMembers, setMaxMembers] = useState("4");

  const reset = () => { setTitle(""); setDescription(""); setTechStack(""); setOwnerName(""); setMaxMembers("4"); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim(), d = description.trim(), o = ownerName.trim();
    if (!t || !d || !o) { toast.error("Please fill in all required fields."); return; }
    if (t.length > 100 || d.length > 500 || o.length > 100) { toast.error("One or more fields exceed the maximum length."); return; }
    const techs = techStack.split(",").map(s => s.trim()).filter(Boolean).slice(0, 10);
    if (techs.length === 0) { toast.error("Please add at least one technology."); return; }
    addProject({
      title: t,
      description: d,
      techStack: techs,
      owner: o,
      ownerAvatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(o)}`,
      members: 1,
      maxMembers: parseInt(maxMembers),
      status: "open",
    });
    toast.success("Project created!");
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="proj-owner">Your Name *</Label>
              <Input id="proj-owner" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Jane Doe" maxLength={100} />
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
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
