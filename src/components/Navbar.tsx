import { Link, useLocation, useNavigate } from "react-router-dom";
import { Code2, Users, FolderKanban, Megaphone, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Feed", icon: LayoutDashboard },
  { to: "/profiles", label: "Developers", icon: Users },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/opportunities", label: "Opportunities", icon: Megaphone },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight">
          <Code2 className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">BuildSpace</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <img
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(user.email ?? "")}`}
                alt="avatar"
                className="h-7 w-7 rounded-full bg-secondary"
              />
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/auth")}>
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center justify-around border-t py-1 md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 rounded-md px-3 py-1 text-xs transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
