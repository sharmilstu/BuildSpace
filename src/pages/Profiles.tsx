import { useData } from "@/context/DataContext";
import ProfileCard from "@/components/ProfileCard";
import CreateProfileDialog from "@/components/CreateProfileDialog";
import { Loader2 } from "lucide-react";

const Profiles = () => {
  const { developers, loading } = useData();

  return (
    <div className="container py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Developers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Browse the community and find collaborators.</p>
        </div>
        <CreateProfileDialog />
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : developers.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No developers yet. Sign up to be the first!</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {developers.map((dev, i) => (
            <div key={dev.id} style={{ animationDelay: `${i * 60}ms` }}>
              <ProfileCard developer={dev} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profiles;
