import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Projects = () => {
  const { projects, loading } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [techFilter, setTechFilter] = useState("all");

  // Dynamically extract unique tech stacks from all projects
  const allTech = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      if (Array.isArray(project.tech_stack)) {
        project.tech_stack.forEach(tech => techSet.add(tech));
      }
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Apply search and tech filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const title = project.title || "";
      const desc = project.description || "";
      
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTech = techFilter === "all" || 
                          (Array.isArray(project.tech_stack) && project.tech_stack.includes(techFilter));
                           
      return matchesSearch && matchesTech;
    });
  }, [projects, searchQuery, techFilter]);

  return (
    <div className="container py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Find projects to join or create your own.</p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="flex h-10 w-full sm:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="all">All Tech Stacks</option>
          {allTech.map(tech => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No projects found matching your criteria.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, i) => (
            <div key={project.id} style={{ animationDelay: `${i * 60}ms` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
