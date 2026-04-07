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

const CreateOpportunityDialog = () => {
  const { addOpportunity } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("hackathon");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => { setTitle(""); setType("hackathon"); setDescription(""); setTags(""); setDeadline(""); };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && !user) { navigate("/auth"); return; }
    setOpen(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim(), d = description.trim();
    if (!t || !d) { toast.error("Please fill in all required fields."); return; }
    if (t.length > 100 || d.length > 500) { toast.error("One or more fields exceed the maximum length."); return; }
    const tagList = tags.split(",").map(s => s.trim()).filter(Boolean).slice(0, 10);
    setSubmitting(true);
    try {
      await addOpportunity({ title: t, type, description: d, tags: tagList, deadline: deadline || undefined });
      toast.success("Opportunity posted!");
      reset();
      setOpen(false);
    } catch { toast.error("Failed to post opportunity."); }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Post Opportunity
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Post Opportunity</DialogTitle>
          <DialogDescription>Share hackathons, openings, or collaboration requests.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="opp-title">Title *</Label>
            <Input id="opp-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="HackMIT 2026" maxLength={100} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="open-source">Open Source</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="collaboration">Collaboration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="opp-desc">Description *</Label>
            <Textarea id="opp-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the opportunity..." maxLength={500} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="opp-deadline">Deadline</Label>
            <Input id="opp-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="opp-tags">Tags <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
            <Input id="opp-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React, Beginner-friendly" />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? "Posting..." : "Post Opportunity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOpportunityDialog;
