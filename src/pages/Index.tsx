import { useData } from "@/context/DataContext";
import FeedItemCard from "@/components/FeedItemCard";
import ProjectCard from "@/components/ProjectCard";
import OpportunityCard from "@/components/OpportunityCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { feedItems, projects, opportunities, loading } = useData();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-8">
      <section className="mb-8 sm:mb-10">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-4xl">
          Build together.
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
          Discover developers, join projects, and find opportunities — all in one place.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-heading text-lg font-semibold">Activity Feed</h2>
          <div className="space-y-3">
            {feedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet. Create a project or post an opportunity to get started!</p>
            ) : (
              feedItems.map((item, i) => (
                <div key={item.id} style={{ animationDelay: `${i * 60}ms` }}>
                  <FeedItemCard item={item} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-sm font-semibold">Open Projects</h2>
              <Link to="/projects" className="flex items-center gap-1 text-xs text-primary hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {projects.filter(p => p.status === "open").slice(0, 2).map((project, i) => (
                <div key={project.id} style={{ animationDelay: `${(i + 3) * 60}ms` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
              {projects.filter(p => p.status === "open").length === 0 && (
                <p className="text-sm text-muted-foreground">No open projects yet.</p>
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-sm font-semibold">Latest Opportunities</h2>
              <Link to="/opportunities" className="flex items-center gap-1 text-xs text-primary hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {opportunities.slice(0, 2).map((opp, i) => (
                <div key={opp.id} style={{ animationDelay: `${(i + 5) * 60}ms` }}>
                  <OpportunityCard opportunity={opp} />
                </div>
              ))}
              {opportunities.length === 0 && (
                <p className="text-sm text-muted-foreground">No opportunities yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
