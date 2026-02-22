
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building, Package, FileText, User, Settings, LogOut, PanelLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const wholesaleNavLinks = [
  { name: "Dashboard", path: "/wholesale/dashboard", icon: Building },
  { name: "Products", path: "/wholesale/products", icon: Package },
  { name: "Quote Requests", path: "/wholesale/quotes", icon: FileText },
  { name: "My Profile", path: "/wholesale/profile", icon: User },
];

const WholesaleLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const NavLinks = ({ isMobile = false }) => (
    <nav className={`flex flex-col p-2 space-y-1 ${isMobile ? 'text-lg' : 'text-sm'}`}>
      {wholesaleNavLinks.map(nav => (
        <Link key={nav.path} to={nav.path} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted ${location.pathname === nav.path ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'}`}>
          <nav.icon className="h-4 w-4" />
          {nav.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen w-full bg-muted/40">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 w-64 flex-col border-r bg-card">
        <div className="p-4 border-b h-20 flex items-center gap-4">
          <Avatar className="h-12 w-12"><AvatarImage src={user?.user_metadata?.avatar_url} /><AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
          <div>
            <p className="font-semibold text-sm">{user?.user_metadata?.business_name || "Wholesale"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <NavLinks />
        <div className="p-4 mt-auto border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={signOut}><LogOut className="h-4 w-4" />Logout</Button>
        </div>
      </aside>

      <div className="flex flex-col md:ml-64">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden"><PanelLeft className="h-5 w-5" /><span className="sr-only">Toggle Menu</span></Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <NavLinks isMobile />
            </SheetContent>
          </Sheet>
          <h2 className="font-bold text-lg">{wholesaleNavLinks.find(l => l.path === location.pathname)?.name || "Menu"}</h2>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WholesaleLayout;
