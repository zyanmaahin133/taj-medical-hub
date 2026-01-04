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
  },
  {
    name: "Dr. Sheikh A. Jaman",
    specialty: "Neuro-Psychiatric Specialist",
    qualification: "M.B.B.S, M.D Diabetes, Stroke, Hypertension, Thyroid",
    hospital: "Reg-67964 (WBMC)",
    schedule: "Every Tuesday & Friday, 6:00 PM",
    category: "Neurology",
  },
  {
    name: "Dr. Ismat Ara Khan",
    specialty: "Dermatologist (Skin & Hair)",
    qualification: "M.B.B.S(Hons), Gold Medalist, M.D(Dermatology), D.N.B",
    hospital: "Reg-75552",
    schedule: "Every Thursday, 12:30 PM",
    category: "Dermatology",
  },
  {
    name: "Dr. Ashish Kumar Jha",
    specialty: "Medicine & Neurology Specialist",
    qualification: "M.B.B.S, M.D Neuro Critical Care",
    hospital: "Neuro Science Hospital, 70985(WBMC)",
    schedule: "Every Sunday, 6:00 PM",
    category: "Neurology",
  },
  {
    name: "Dr. A.K. Gazi",
    specialty: "General Medicine",
    qualification: "M.B.B.S",
    hospital: "Attached Calcutta National Medical College, Senior Experienced Doctor",
    schedule: "Every Sunday, 6:00 PM",
    category: "General Medicine",
  },
  {
    name: "Dr. Shubhamitra Majumdar",
    specialty: "Medicine Specialist",
    qualification: "M.B.B.S, Hons(Cal), M.D(Cal)",
    hospital: "Ex House Physician NRS Medical College",
    schedule: "Every Tuesday, 12:00 PM",
    category: "General Medicine",
  },
  {
    name: "Dr. D.P. Mandal",
    specialty: "Heart Disease Specialist (Cardiologist)",
    qualification: "M.B.B.S(Cal), DNB(I) Dip-Card Medicine & Cardiology, PGEP Cardiac Emergencies (Boston University School of Medicine)",
    hospital: "Attached with NRS Hospital, Reg-55936(WBMC)",
    schedule: "Every Tuesday, 12:00 PM",
    category: "Cardiology",
  },
  {
    name: "Dr. Belal Ali",
    specialty: "General Medicine Specialist",
    qualification: "M.B.B.S(Kol), M.D Medicine (SSKM Hospital), CCEBDM (Diabetes)",
    hospital: "Attached R.G.Kar Medical College and Hospital, Reg-75085",
    schedule: "Every Thursday, 10:00 AM",
    category: "General Medicine",
  },
  {
    name: "Dr. Nuruddin Sanpui",
    specialty: "General Medicine",
    qualification: "M.B.B.S, WBMC 91953",
    hospital: "General Practitioner",
    schedule: "Every Saturday, 4:00 PM",
    category: "General Medicine",
  },
  {
    name: "Dr. Arpita Chakraborty",
    specialty: "Gynecologist & Obstetrician",
    qualification: "M.B.B.S, M.S (Obstetrics and Gynaecology)",
    hospital: "Attached Santiniketan Medical College",
    schedule: "Every Saturday, 12:00 PM",
    category: "Gynecology",
  },
  {
    name: "Dr. Marufa Bilkis",
    specialty: "Gynecology Specialist",
    qualification: "M.B.B.S & M.S(G&O), CCEBDM, CCGDM, CCMTD",
    hospital: "Reg No-67963(WBMC)",
    schedule: "Every Saturday, 4:00 PM",
    category: "Gynecology",
  },
  {
    name: "Dr. Koustav Saha",
    specialty: "Heart Disease Specialist",
    qualification: "M.B.B.S, M.D DM Clinical Pharmacology",
    hospital: "Attached to School of Tropical Medicine, Kolkata, Reg No-64376(WBMC)",
    schedule: "Every Sunday, 1:00 PM",
    category: "Cardiology",
  },
  {
    name: "Dr. Aritra Batbyal",
    specialty: "Pediatrician (Newborn & Child Specialist)",
    qualification: "M.B.B.S(Hons), D.C.R(Cal), PGPN(BOSTON, USA)",
    hospital: "Attached R.G.Kar Medical College and Hospital, Reg No-71057(WBMC)",
    schedule: "Every Saturday, 6:00 PM",
    category: "Pediatrics",
  },
  {
    name: "Dr. Tanima Saha",
    specialty: "Gynecology & Infertility Specialist",
    qualification: "M.B.B.S, MD(Pharmacology), Consultant Obstetrician & Gynaecology",
    hospital: "Trained in Infertility Treatment, Reg Non-66846",
    schedule: "Every Thursday & Sunday, 1:00 PM",
    category: "Gynecology",
  },
];

const categories = ["All", "General Medicine", "Cardiology", "Gynecology", "Neurology", "ENT", "Dermatology", "Pediatrics"];

const Doctors = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Our <span className="text-gradient">Visiting Doctors</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Renowned specialists from top medical institutions visit Taj Medical Store regularly. 
                Get expert consultations without traveling to Kolkata.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a href="tel:+917427915869">
                  <Button className="gap-2">
                    <Phone className="h-4 w-4" />
                    Book Appointment
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Note */}
        <section className="py-6 bg-secondary/10 border-y border-secondary/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 text-center">
              <Calendar className="h-5 w-5 text-secondary" />
              <p className="text-sm">
                <strong>For doctor appointment and schedule updates:</strong> Call +91 74279 15869 or +91 98360 16644
              </p>
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor, index) => (
                <Card key={index} className="group overflow-hidden hover:shadow-card transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="h-24 gradient-medical relative">
                      <div className="absolute -bottom-8 left-6">
                        <div className="w-16 h-16 rounded-full bg-card shadow-soft flex items-center justify-center text-2xl font-bold text-primary border-4 border-card">
                          {doctor.name.split(" ")[1]?.[0] || doctor.name[0]}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 text-xs font-medium bg-primary-foreground/20 backdrop-blur-sm rounded-full text-primary-foreground">
                          {doctor.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 pt-12 space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-primary text-sm font-medium">{doctor.specialty}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Award className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>{doctor.qualification}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>{doctor.hospital}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border flex items-center gap-2">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-secondary">{doctor.schedule}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Chennai Doctors Notice */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Special: Chennai Specialist Doctors</h3>
                <p className="text-muted-foreground mb-4">
                  Doctors from Sri Ramachandra Medical College, Chennai visit regularly for specialized treatments.
                </p>
                <p className="font-medium text-primary">
                  For Chennai doctors' schedule: Call +91 74279 15869 or +91 98360 16644
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
