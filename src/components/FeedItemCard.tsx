import type { FeedItem as FeedItemType } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Megaphone, Users } from "lucide-react";

const typeIcons = {
  project: FolderKanban,
  opportunity: Megaphone,
  "team-update": Users,
};

const FeedItemCard = ({ item }: { item: FeedItemType }) => {
  const Icon = typeIcons[item.type];

  return (
    <div className="flex gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm animate-fade-in">
      <img src={item.authorAvatar} alt={item.author} className="h-8 w-8 shrink-0 rounded-full bg-secondary" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{item.author}</span>
          <span className="text-xs text-muted-foreground">{item.timestamp}</span>
          <Icon className="h-3 w-3 text-muted-foreground" />
        </div>
        <h4 className="mt-0.5 text-sm font-medium">{item.title}</h4>
        <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-2 flex gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedItemCard;
