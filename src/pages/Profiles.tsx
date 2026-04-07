import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import ProfileCard from "@/components/ProfileCard";
import CreateProfileDialog from "@/components/CreateProfileDialog";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Profiles = () => {
  const { developers, loading } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");

  // Dynamically extract unique skills from all developers
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    developers.forEach(dev => {
      // Assuming dev.skills is an array of strings based on mockData
      if (Array.isArray(dev.skills)) {
        dev.skills.forEach(skill => skills.add(skill));
      }
    });
    return Array.from(skills).sort();
  }, [developers]);

  // Apply search and skill filters
  const filteredDevelopers = useMemo(() => {
    return developers.filter(dev => {
      const name = dev.name || dev.username || "";
      const bio = dev.bio || "";
      
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSkill = skillFilter === "all" || 
                           (Array.isArray(dev.skills) && dev.skills.includes(skillFilter));
                           
      return matchesSearch && matchesSkill;
    });
  }, [developers, searchQuery, skillFilter]);

  return (
    <div className="container py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Developers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Browse the community and find collaborators.</p>
        </div>
        <CreateProfileDialog />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="flex h-10 w-full sm:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="all">All Skills</option>
          {allSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDevelopers.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No developers found matching your criteria.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDevelopers.map((dev, i) => (
            <div key={dev.id} style={{ animationDelay: `${i * 60}ms` }}>
              <ProfileCard developer={dev} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profiles;
