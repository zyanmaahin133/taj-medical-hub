import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Polerhat",
    rating: 5,
    text: "Excellent service! They always have the medicines I need. The staff is very helpful and the prices are reasonable.",
  },
  {
    name: "Priya Dey",
    location: "Anantpur",
    rating: 5,
    text: "The doctor consultation facility is very convenient. I don't have to travel to Kolkata for specialist visits anymore.",
  },
  {
    name: "Mohammad Ali",
    location: "South 24 Parganas",
    rating: 5,
    text: "Best medical store in the area. They provide genuine medicines and their WhatsApp inquiry system is very helpful.",
  },
  {
    name: "Sunita Ghosh",
    location: "Baruipur",
    rating: 5,
    text: "The blood test service is affordable and reports are accurate. Very satisfied with the overall service quality.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-muted-foreground">
            Trusted by thousands of customers in South 24 Parganas for quality healthcare services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
