import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Megaphone, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type FeedItem = Tables<"feed_items"> & { author?: { name: string; avatar_url: string | null } | null };

const typeIcons: Record<string, typeof FolderKanban> = {
  project: FolderKanban,
  opportunity: Megaphone,
  "team-update": Users,
};

const FeedItemCard = ({ item }: { item: FeedItem }) => {
  const Icon = typeIcons[item.type] ?? FolderKanban;
  const authorName = item.author?.name ?? "Unknown";
  const authorAvatar = item.author?.avatar_url ?? `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(authorName)}`;
  const timeAgo = formatDistanceToNow(new Date(item.created_at), { addSuffix: true });

  return (
    <div className="flex gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm animate-fade-in">
      <img src={authorAvatar} alt={authorName} className="h-8 w-8 shrink-0 rounded-full bg-secondary" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{authorName}</span>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          <Icon className="h-3 w-3 text-muted-foreground" />
        </div>
        <h4 className="mt-0.5 text-sm font-medium">{item.title}</h4>
        {item.description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedItemCard;
