import { Link } from "react-router-dom";
import { ArrowRight, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const featuredDoctors = [
  {
    name: "Dr. Indranil Khatua",
    specialty: "ENT Specialist",
    qualification: "M.B.B.S(Cal), M.S (ENT)",
    hospital: "SSKM and NRS Hospital",
    schedule: "Wednesday, 6:30 PM",
  },
  {
    name: "Dr. D.P. Mandal",
    specialty: "Cardiologist",
    qualification: "M.B.B.S(Cal), DNB(I) Dip-Card Medicine",
    hospital: "NRS Hospital & Boston University",
    schedule: "Tuesday, 12:00 PM",
  },
  {
    name: "Dr. Arpita Chakraborty",
    specialty: "Gynecologist",
    qualification: "M.B.B.S, M.S (Obstetrics & Gynaecology)",
    hospital: "Santiniketan Medical College",
    schedule: "Saturday, 12:00 PM",
  },
  {
    name: "Dr. Ashish Kumar Jha",
    specialty: "Neurologist",
    qualification: "M.B.B.S, M.D Neuro Critical Care",
    hospital: "Neuro Science Hospital",
    schedule: "Sunday, 6:00 PM",
  },
];

const FeaturedDoctors = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-gradient">Specialist Doctors</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Regular consultations with renowned specialists from top medical institutions. 
              No need to travel far for expert healthcare.
            </p>
          </div>
          <Link to="/doctors">
            <Button variant="outline" className="gap-2">
              View All Doctors
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDoctors.map((doctor, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-card transition-all duration-300">
              <CardContent className="p-0">
                <div className="h-32 gradient-medical relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-primary-foreground">
                      {doctor.name.split(" ")[1]?.[0] || doctor.name[0]}
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-primary text-sm font-medium">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-secondary" />
                    <span className="text-secondary font-medium">{doctor.schedule}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
