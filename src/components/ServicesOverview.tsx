import { Pill, Stethoscope, TestTube, Truck, Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Pill,
    title: "All Company Medicines",
    description: "Complete range of medicines from all major pharmaceutical companies at competitive wholesale and retail prices.",
  },
  {
    icon: Stethoscope,
    title: "Doctor Consultations",
    description: "Regular visits from 15+ specialist doctors including ENT, Cardiology, Gynecology, Dermatology, and more.",
  },
  {
    icon: TestTube,
    title: "Blood Tests & Diagnostics",
    description: "Complete blood tests and diagnostic services at affordable rates with quick and accurate reports.",
  },
  {
    icon: Truck,
    title: "Wholesale Supply",
    description: "Bulk medicine supply for pharmacies, clinics, and hospitals with special wholesale pricing.",
  },
  {
    icon: Clock,
    title: "Extended Hours",
    description: "Open from 8 AM to 10 PM daily to serve your healthcare needs at your convenience.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Medicines",
    description: "100% authentic medicines directly sourced from authorized distributors with proper storage.",
  },
];

const ServicesOverview = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Complete Healthcare <span className="text-gradient">Solutions</span>
          </h2>
          <p className="text-muted-foreground">
            From medicines to diagnostics, we provide comprehensive healthcare services under one roof.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-card transition-all duration-300 border-transparent hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
