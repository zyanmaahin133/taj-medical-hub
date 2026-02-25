
import { useState, useEffect } from "react";
import { Search, X, Pill, Stethoscope, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// ... (doctors and medicines arrays are correct)
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const doctors = [
  { name: "Dr. Indranil Khatua", specialty: "ENT Specialist", schedule: "Wednesday, 6:30 PM", type: "doctor" },
  // ... more doctors
];

const medicines = [
  { name: "Antibiotics", category: "Infection Treatment", type: "medicine" },
  // ... more medicines
];

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const allItems = [...doctors, ...medicines];

  const filteredItems = query.length > 0
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        ("specialty" in item && item.specialty.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSelect = (item: any) => {
    // ... navigation logic
    onClose();
  };

  useEffect(() => {
    // ... keydown logic
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        {/* ✅ THE FIX: Added a visually hidden DialogHeader */}
        <DialogHeader className="sr-only">
          <VisuallyHidden><DialogTitle>Search</DialogTitle></VisuallyHidden>
          <VisuallyHidden><DialogDescription>Search for medicines, doctors, or services.</DialogDescription></VisuallyHidden>
        </DialogHeader>

        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search medicines, doctors, services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 text-lg py-6"
            autoFocus
          />
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {/* ... (rest of the search results logic is correct) ... */}
        </div>

        <div className="border-t px-4 py-3 bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted border">ESC</kbd> to close</span>
          <span>Search powered by Taj Medical Store</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
