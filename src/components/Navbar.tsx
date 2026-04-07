import { Link, useLocation } from "react-router-dom";
import { Code2, Users, FolderKanban, Megaphone, LayoutDashboard } from "lucide-react";

const navItems = [
  { to: "/", label: "Feed", icon: LayoutDashboard },
  { to: "/profiles", label: "Developers", icon: Users },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/opportunities", label: "Opportunities", icon: Megaphone },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight">
          <Code2 className="h-5 w-5 text-primary" />
          <span>BuildSpace</span>
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

        {/* Mobile nav */}
        <nav className="flex items-center gap-1 md:hidden">
          {navItems.map(({ to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`rounded-md p-2 transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
