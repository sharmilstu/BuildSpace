import { useParams, Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import ProfileCard from "@/components/ProfileCard";
import { Loader2, ArrowLeft } from "lucide-react";

const ProfileDetail = () => {
  const { username } = useParams();
  const { developers, loading } = useData();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Find the specific developer by the URL parameter
  const developer = developers.find((dev) => dev.username === username);

  if (!developer) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Profile not found</h2>
        <p className="text-muted-foreground mb-8">The developer you are looking for doesn't exist.</p>
        <Link 
          to="/profiles"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Back to Profiles
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-10 max-w-2xl mx-auto animate-fade-in">
      <Link 
        to="/profiles" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all developers
      </Link>
      
      {/* We pass isDetailView to remove hover effects from the standalone card */}
      <ProfileCard developer={developer} isDetailView={true} />
    </div>
  );
};

export default ProfileDetail;
