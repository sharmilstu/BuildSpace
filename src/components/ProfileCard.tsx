import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Github, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Profile = Tables<"profiles">;

const ProfileCard = ({ developer, isDetailView = false }: { developer: Profile; isDetailView?: boolean }) => {
  const navigate = useNavigate();

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the card when you click the share button
    const url = `${window.location.origin}/profile/${developer.username}`;
    navigator.clipboard.writeText(url);
    toast("Link copied!", { description: "Profile link copied to clipboard." });
  };

  const handleCardClick = () => {
    if (!isDetailView) {
      navigate(`/profile/${developer.username}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group rounded-lg border bg-card p-5 transition-all animate-fade-in ${
        !isDetailView ? "hover:shadow-md cursor-pointer hover:border-primary/50" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <img
          src={developer.avatar_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(developer.name)}`}
          alt={developer.name}
          className="h-12 w-12 rounded-full bg-secondary"
        />
        <div className="min-w-0 flex-1">
          <h3 className={`font-heading text-sm font-semibold ${!isDetailView ? "group-hover:text-primary transition-colors" : ""}`}>
            {developer.name}
          </h3>
          <p className="text-xs text-muted-foreground">@{developer.username}</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleShare}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Share Profile"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          {developer.github && (
            <a href={`https://github.com/${developer.github}`} target="_blank" rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
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
