
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, FileText, User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarNavs = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "My Orders", path: "/orders", icon: ShoppingCart },
  { name: "My Prescriptions", path: "/prescriptions", icon: FileText },
  { name: "My Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

const UserDashboardLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 w-64 flex-col border-r bg-card">
        <div className="p-4 border-b h-20 flex items-center gap-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{user?.user_metadata?.full_name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarNavs.map(nav => (
            <Link key={nav.path} to={nav.path} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${location.pathname === nav.path ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'}`}>
              <nav.icon className="h-4 w-4" />
              {nav.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t">
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={signOut}>
                <LogOut className="h-4 w-4"/>
                Logout
            </Button>
        </div>
      </aside>
      <main className="md:ml-64 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
