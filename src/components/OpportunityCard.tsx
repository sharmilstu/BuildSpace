import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, GitBranch, Briefcase, Users, ExternalLink } from "lucide-react";

type Opportunity = Tables<"opportunities">;

const typeConfig: Record<string, { icon: typeof Trophy; label: string; className: string }> = {
  hackathon: { icon: Trophy, label: "Hackathon", className: "bg-primary/10 text-primary" },
  "open-source": { icon: GitBranch, label: "Open Source", className: "bg-success/10 text-success" },
  internship: { icon: Briefcase, label: "Internship", className: "bg-warning/10 text-warning" },
  collaboration: { icon: Users, label: "Collaboration", className: "bg-accent/10 text-accent" },
};

const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
  const config = typeConfig[opportunity.type] ?? typeConfig.hackathon;
  const Icon = config.icon;

  return (
    <div className="group rounded-lg border bg-card p-5 transition-shadow hover:shadow-md animate-fade-in">
      <div className="flex items-start gap-3">
        <div className={`rounded-md p-2 ${config.className}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm font-semibold">{opportunity.title}</h3>
              {opportunity.link && (
                <a href={opportunity.link} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <Badge variant="outline" className={`shrink-0 text-xs font-normal ${config.className}`}>
              {config.label}
            </Badge>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{opportunity.description}</p>
        </div>
      </div>

      {opportunity.tags && opportunity.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {opportunity.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{new Date(opportunity.created_at).toLocaleDateString()}</span>
        {opportunity.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {opportunity.deadline}
          </span>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
