import { useState, useEffect } from "react";
import { Search, X, Pill, Stethoscope, Clock } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const doctors = [
  { name: "Dr. Indranil Khatua", specialty: "ENT Specialist", schedule: "Wednesday, 6:30 PM", type: "doctor" },
  { name: "Dr. Sheikh A. Jaman", specialty: "Neuro-Psychiatric", schedule: "Tuesday & Friday, 6:00 PM", type: "doctor" },
  { name: "Dr. Ismat Ara Khan", specialty: "Dermatologist", schedule: "Thursday, 12:30 PM", type: "doctor" },
  { name: "Dr. Ashish Kumar Jha", specialty: "Neurologist", schedule: "Sunday, 6:00 PM", type: "doctor" },
  { name: "Dr. D.P. Mandal", specialty: "Cardiologist", schedule: "Tuesday, 12:00 PM", type: "doctor" },
  { name: "Dr. Arpita Chakraborty", specialty: "Gynecologist", schedule: "Saturday, 12:00 PM", type: "doctor" },
  { name: "Dr. Aritra Batbyal", specialty: "Pediatrician", schedule: "Saturday, 6:00 PM", type: "doctor" },
  { name: "Dr. Tanima Saha", specialty: "Gynecology & Infertility", schedule: "Thursday & Sunday, 1:00 PM", type: "doctor" },
];

const medicines = [
  { name: "Antibiotics", category: "Infection Treatment", type: "medicine" },
  { name: "Painkillers", category: "Pain Relief", type: "medicine" },
  { name: "Cardiac Medicines", category: "Heart Care", type: "medicine" },
  { name: "Diabetes Medicines", category: "Blood Sugar Control", type: "medicine" },
  { name: "Vitamins & Supplements", category: "Nutrition", type: "medicine" },
  { name: "Dermatology Products", category: "Skin Care", type: "medicine" },
  { name: "Pediatric Medicines", category: "Child Care", type: "medicine" },
  { name: "Gynecology Medicines", category: "Women's Health", type: "medicine" },
  { name: "Neurology Medicines", category: "Nerve Health", type: "medicine" },
  { name: "Respiratory Medicines", category: "Breathing Issues", type: "medicine" },
  { name: "Gastro Medicines", category: "Digestive Health", type: "medicine" },
  { name: "Ayurvedic Products", category: "Natural Remedies", type: "medicine" },
];

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const allItems = [...doctors, ...medicines];

  const filteredItems = query.length > 0
    ? allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          ("specialty" in item && item.specialty.toLowerCase().includes(query.toLowerCase())) ||
          ("category" in item && item.category.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSelect = (item: typeof allItems[0]) => {
    if (item.type === "doctor") {
      navigate("/doctors");
    } else {
      navigate("/services");
    }
    onClose();
    setQuery("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
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
          {query.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start typing to search for medicines or doctors</p>
              <p className="text-sm mt-2">Try "cardio", "skin", "pediatric"...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-2">
                Can't find what you're looking for?{" "}
                <a
                  href={`https://wa.me/917427915869?text=Hello, I'm looking for: ${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Ask on WhatsApp
                </a>
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted text-left transition-colors"
                >
                  <div className={`p-2 rounded-lg ${item.type === "doctor" ? "bg-primary/10" : "bg-secondary/10"}`}>
                    {item.type === "doctor" ? (
                      <Stethoscope className="h-5 w-5 text-primary" />
                    ) : (
                      <Pill className="h-5 w-5 text-secondary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {"specialty" in item ? item.specialty : item.category}
                    </p>
                  </div>
                  {"schedule" in item && (
                    <div className="flex items-center gap-1 text-xs text-secondary">
                      <Clock className="h-3 w-3" />
                      {item.schedule}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
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
