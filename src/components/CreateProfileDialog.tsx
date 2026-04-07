import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateProfileDialog = () => {
  const { updateProfile } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [github, setGithub] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && !user) { navigate("/auth"); return; }
    setOpen(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedBio = bio.trim();
    if (!trimmedBio) { toast.error("Please add a bio."); return; }
    const skillList = skills.split(",").map(s => s.trim()).filter(Boolean).slice(0, 10);
    if (skillList.length === 0) { toast.error("Please add at least one skill."); return; }
    const interestList = interests.split(",").map(s => s.trim()).filter(Boolean).slice(0, 10);
    setSubmitting(true);
    try {
      await updateProfile({
        bio: trimmedBio,
        skills: skillList,
        interests: interestList,
        github: github.trim() || null,
      });
      toast.success("Profile updated!");
      setOpen(false);
    } catch { toast.error("Failed to update profile."); }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Pencil className="h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your skills, bio, and interests.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." maxLength={500} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skills">Skills * <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
            <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Node.js" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="interests">Interests <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
            <Input id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="AI, Open Source, DevTools" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="github">GitHub username</Label>
            <Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="janedoe" maxLength={50} />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? "Saving..." : "Save Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileDialog;
