import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { categoryGroups } from "@/data/categories";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg z-50"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Category Groups List */}
          <div className="col-span-3 border-r border-border pr-4">
            <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wide">
              Browse Categories
            </h3>
            <div className="space-y-1">
              {categoryGroups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <button
                    key={group.name}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeGroup === group.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                    onMouseEnter={() => setActiveGroup(group.name)}
                  >
                    <span className="flex items-center gap-2">
                      <GroupIcon className="h-4 w-4" />
                      <span className="font-medium">{group.name}</span>
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories */}
          <div className="col-span-9">
            {activeGroup ? (
              <div>
                <h3 className="font-bold text-lg mb-4 text-primary">
                  {activeGroup}
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {categoryGroups
                    .find((g) => g.name === activeGroup)
                    ?.categories.map((category) => {
                      const CategoryIcon = category.icon;
                      return (
                        <Link
                          key={category.slug}
                          to={`/shop?category=${category.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <span className="text-primary group-hover:scale-110 transition-transform">
                            <CategoryIcon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium text-foreground group-hover:text-primary">
                            {category.name}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {categoryGroups.slice(0, 8).map((group) => (
                  <div key={group.name} className="space-y-2">
                    <h4 className="font-semibold text-sm text-primary">{group.name}</h4>
                    <div className="space-y-1">
                      {group.categories.slice(0, 5).map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/shop?category=${cat.slug}`}
                          onClick={onClose}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      {group.categories.length > 5 && (
                        <button
                          onClick={() => setActiveGroup(group.name)}
                          className="text-sm text-primary font-medium hover:underline"
                        >
                          +{group.categories.length - 5} more
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex gap-6">
            <Link to="/shop?offer=true" onClick={onClose} className="text-sm font-medium text-secondary hover:underline">
              🔥 Today's Deals
            </Link>
            <Link to="/lab-tests" onClick={onClose} className="text-sm font-medium text-primary hover:underline">
              🧪 Lab Tests
            </Link>
            <Link to="/doctors" onClick={onClose} className="text-sm font-medium text-primary hover:underline">
              👨‍⚕️ Doctor Consultation
            </Link>
            <Link to="/scan-booking" onClick={onClose} className="text-sm font-medium text-primary hover:underline">
              📷 Book Scans
            </Link>
          </div>
          <Link 
            to="/wholesale/register" 
            onClick={onClose}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
          >
            Register as Wholesale Partner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
