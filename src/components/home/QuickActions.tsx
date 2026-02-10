
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Pill, TestTube, Stethoscope, Scan, FileText, 
  Building2
} from "lucide-react";

const quickActions = [
  { name: "Order Medicines", description: "Medicines & products", icon: Pill, color: "bg-blue-500", link: "/shop" },
  { name: "Lab Tests", description: "Book tests at home", icon: TestTube, color: "bg-green-500", link: "/lab-tests" },
  { name: "Consult Doctor", description: "Online consultations", icon: Stethoscope, color: "bg-purple-500", link: "/consult" },
  { name: "Book Scan", description: "X-Ray, MRI, CT Scan", icon: Scan, color: "bg-orange-500", link: "/scan-booking" },
  { name: "Upload Rx", description: "Order via prescription", icon: FileText, color: "bg-teal-500", link: "/upload-prescription" },
  { name: "Visit Store", description: "Find our location", icon: Building2, color: "bg-amber-500", link: "/contact" },
];

const QuickActions = () => {
  return (
    <section>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {quickActions.map((action) => (
          <Link key={action.name} to={action.link} className="text-center group">
            <Card className="group-hover:shadow-lg transition-all duration-300 cursor-pointer border-transparent group-hover:border-primary/20 h-full bg-card">
              <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center h-full">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-tight">{action.name}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
