import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import OpportunityCard from "@/components/OpportunityCard";
import CreateOpportunityDialog from "@/components/CreateOpportunityDialog";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Opportunities = () => {
  const { opportunities, loading } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Dynamically extract unique opportunity types
  const allTypes = useMemo(() => {
    const typeSet = new Set<string>();
    opportunities.forEach(opp => {
      if (opp.type) typeSet.add(opp.type);
    });
    return Array.from(typeSet).sort();
  }, [opportunities]);

  // Apply search and type filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const title = opp.title || "";
      const desc = opp.description || "";
      
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === "all" || opp.type === typeFilter;
                           
      return matchesSearch && matchesType;
    });
  }, [opportunities, searchQuery, typeFilter]);

  return (
    <div className="container py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Opportunities</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hackathons, open source, internships, and more.</p>
        </div>
        <CreateOpportunityDialog />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="flex h-10 w-full sm:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 capitalize"
        >
          <option value="all">All Types</option>
          {allTypes.map(type => (
            <option key={type} value={type} className="capitalize">
              {type.replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No opportunities found matching your criteria.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filteredOpportunities.map((opp, i) => (
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
