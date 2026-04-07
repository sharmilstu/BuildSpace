import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";

type Profile = Tables<"profiles">;

const ProfileCard = ({ developer }: { developer: Profile }) => {
  return (
    <div className="group rounded-lg border bg-card p-5 transition-shadow hover:shadow-md animate-fade-in">
      <div className="flex items-start gap-4">
        <img
          src={developer.avatar_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(developer.name)}`}
          alt={developer.name}
          className="h-12 w-12 rounded-full bg-secondary"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-semibold">{developer.name}</h3>
          <p className="text-xs text-muted-foreground">@{developer.username}</p>
        </div>
        <div className="flex gap-1.5">
          {developer.github && (
            <a href={`https://github.com/${developer.github}`} target="_blank" rel="noreferrer"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {developer.bio && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{developer.bio}</p>
      )}

      {developer.skills && developer.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {developer.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs font-normal">
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {developer.interests && developer.interests.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {developer.interests.map((interest) => (
            <Badge key={interest} variant="outline" className="text-xs font-normal text-muted-foreground">
              {interest}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
