import { developers } from "@/data/mockData";
import ProfileCard from "@/components/ProfileCard";

const Profiles = () => {
  return (
    <div className="container py-8">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Developers</h1>
      <p className="mt-1 text-sm text-muted-foreground">Browse the community and find collaborators.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {developers.map((dev, i) => (
          <div key={dev.id} style={{ animationDelay: `${i * 60}ms` }}>
            <ProfileCard developer={dev} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profiles;
