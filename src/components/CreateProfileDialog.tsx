import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/DataContext";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const CreateProfileDialog = () => {
  const { addDeveloper } = useData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [github, setGithub] = useState("");

  const reset = () => { setName(""); setUsername(""); setBio(""); setSkills(""); setInterests(""); setGithub(""); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedBio = bio.trim();
    if (!trimmedName || !trimmedUsername || !trimmedBio) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (trimmedName.length > 100 || trimmedUsername.length > 50 || trimmedBio.length > 500) {
      toast.error("One or more fields exceed the maximum length.");
      return;
    }
    const skillList = skills.split(",").map(s => s.trim()).filter(Boolean).slice(0, 10);
    const interestList = interests.split(",").map(s => s.trim()).filter(Boolean).slice(0, 10);
    if (skillList.length === 0) {
      toast.error("Please add at least one skill.");
      return;
    }
    addDeveloper({
      name: trimmedName,
      username: trimmedUsername,
      avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(trimmedName)}`,
      bio: trimmedBio,
      skills: skillList,
      interests: interestList,
      projects: [],
      github: github.trim() || undefined,
    });
    toast.success("Profile created!");
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Create Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Profile</DialogTitle>
          <DialogDescription>Join the BuildSpace community.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">Username *</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jane_dev" maxLength={50} />
            </div>
          </div>
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
            <Button type="submit" className="w-full sm:w-auto">Create Profile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileDialog;
