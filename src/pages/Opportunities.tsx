import { useData } from "@/context/DataContext";
import OpportunityCard from "@/components/OpportunityCard";
import CreateOpportunityDialog from "@/components/CreateOpportunityDialog";
import { Loader2 } from "lucide-react";

const Opportunities = () => {
  const { opportunities, loading } = useData();

  return (
    <div className="container py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Opportunities</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hackathons, open source, internships, and more.</p>
        </div>
        <CreateOpportunityDialog />
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : opportunities.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No opportunities yet. Post the first one!</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {opportunities.map((opp, i) => (
            <div key={opp.id} style={{ animationDelay: `${i * 60}ms` }}>
              <OpportunityCard opportunity={opp} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunities;
