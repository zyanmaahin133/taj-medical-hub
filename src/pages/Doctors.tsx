
import { Clock, Award, Building, Phone, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const doctors = [
  {
    name: "Dr. Indranil Khatua",
    specialty: "ENT Specialist (Ear, Nose, Throat)",
    qualification: "M.B.B.S(Cal), M.S (ENT)",
    hospital: "Attached with SSKM and NRS Hospital, ENT Micro Surgeon",
    schedule: "Every Wednesday, 6:30 PM",
    category: "ENT",
    image: "", // Add image URL here
  },
  // ... (add image property to all other doctors)
  {
    name: "Dr. Tanima Saha",
    specialty: "Gynecology & Infertility Specialist",
    qualification: "M.B.B.S, MD(Pharmacology), Consultant Obstetrician & Gynaecology",
    hospital: "Trained in Infertility Treatment, Reg Non-66846",
    schedule: "Every Thursday & Sunday, 1:00 PM",
    category: "Gynecology",
    image: "", // Add image URL here
  },
];

const Doctors = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* ... Hero and Note sections ... */}

        {/* Doctors Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {doctors.map((doctor, index) => (
                <Card key={index} className="group overflow-hidden hover:shadow-card transition-all duration-300 flex flex-col">
                  <CardContent className="p-0 flex flex-col flex-grow">
                    <div className="h-24 gradient-medical relative">
                      <div className="absolute -bottom-8 left-4">
                        <div className="w-16 h-16 rounded-full bg-card shadow-soft flex items-center justify-center border-4 border-card overflow-hidden">
                          {doctor.image ? (
                            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl font-bold text-primary">{doctor.name.split(" ")[1]?.[0] || doctor.name[0]}</span>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 text-xs font-medium bg-primary-foreground/20 backdrop-blur-sm rounded-full text-primary-foreground">
                          {doctor.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 pt-10 space-y-3 flex-grow flex flex-col">
                      <div>
                        <h3 className="font-semibold text-base">{doctor.name}</h3>
                        <p className="text-primary text-xs font-medium">{doctor.specialty}</p>
                      </div>
                      <div className="space-y-2 text-xs text-muted-foreground flex-grow">
                        <div className="flex items-start gap-2">
                          <Award className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                          <span>{doctor.qualification}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Building className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                          <span>{doctor.hospital}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border flex items-center gap-2 text-secondary">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-medium">{doctor.schedule}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ... Chennai Doctors Notice ... */}
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
