import { opportunities } from "@/data/mockData";
import OpportunityCard from "@/components/OpportunityCard";

const Opportunities = () => {
  return (
    <div className="container py-8">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Opportunities</h1>
      <p className="mt-1 text-sm text-muted-foreground">Hackathons, open source, internships, and more.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {opportunities.map((opp, i) => (
          <div key={opp.id} style={{ animationDelay: `${i * 60}ms` }}>
            <OpportunityCard opportunity={opp} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;
