
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle, Search, ShoppingCart, User, ChevronDown, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchModal from "@/components/SearchModal";
import NotificationDropdown from "@/components/NotificationDropdown";
import MegaMenu from "@/components/MegaMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher"; // Import the new component
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { isAdmin, isWholesale } = useUserRole();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Doctors", path: "/doctors" },
    { name: "Lab Tests", path: "/lab-tests" },
    { name: "Scans", path: "/scan-booking" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (isWholesale) return "/wholesale";
    return "/profile";
  };

  const getDashboardLabel = () => {
    if (isAdmin) return "Admin Panel";
    if (isWholesale) return "Business Dashboard";
    return "My Account";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* ... Logo and Desktop Navigation ... */}

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher /> {/* Add the new component here */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-muted-foreground hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {user && <NotificationDropdown />}
              
              {user ? (
                <Link to={getDashboardLink()}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {getDashboardLabel()}
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
              
              <a
                href="https://wa.me/917427915869?text=Hello, I want to inquire about medicine availability"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="gap-2 bg-secondary hover:bg-secondary/90">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>

            {/* ... Mobile Actions ... */}
          </div>

          {/* ... Mega Menu and Mobile Navigation ... */}
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
