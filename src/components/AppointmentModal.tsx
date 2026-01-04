import { useState } from "react";
import { CalendarIcon, Clock, User, Phone, Stethoscope, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const doctors = [
  { id: "1", name: "Dr. Indranil Khatua", specialty: "ENT Specialist", day: "Wednesday" },
  { id: "2", name: "Dr. Sheikh A. Jaman", specialty: "Neuro-Psychiatric", day: "Tuesday/Friday" },
  { id: "3", name: "Dr. Ismat Ara Khan", specialty: "Dermatologist", day: "Thursday" },
  { id: "4", name: "Dr. Ashish Kumar Jha", specialty: "Neurologist", day: "Sunday" },
  { id: "5", name: "Dr. D.P. Mandal", specialty: "Cardiologist", day: "Tuesday" },
  { id: "6", name: "Dr. Arpita Chakraborty", specialty: "Gynecologist", day: "Saturday" },
  { id: "7", name: "Dr. Aritra Batbyal", specialty: "Pediatrician", day: "Saturday" },
  { id: "8", name: "Dr. Tanima Saha", specialty: "Gynecology & Infertility", day: "Thursday/Sunday" },
  { id: "9", name: "Dr. Belal Ali", specialty: "General Medicine", day: "Thursday" },
  { id: "10", name: "Dr. Koustav Saha", specialty: "Heart Specialist", day: "Sunday" },
];

const AppointmentModal = ({ isOpen, onClose }: AppointmentModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    doctor: "",
    date: undefined as Date | undefined,
    timeSlot: "",
    reason: "",
  });

  const selectedDoctor = doctors.find((d) => d.id === formData.doctor);

  const handleSubmit = () => {
    setIsSubmitting(true);

    const doctorInfo = selectedDoctor ? `${selectedDoctor.name} (${selectedDoctor.specialty})` : "";
    const dateInfo = formData.date ? format(formData.date, "PPP") : "";

    const whatsappMessage = `*New Appointment Request*\n\nName: ${formData.name}\nPhone: ${formData.phone}\nDoctor: ${doctorInfo}\nPreferred Date: ${dateInfo}\nTime Slot: ${formData.timeSlot}\nReason: ${formData.reason || "Not specified"}`;

    window.open(`https://wa.me/917427915869?text=${encodeURIComponent(whatsappMessage)}`, "_blank");

    toast({
      title: "Appointment Request Sent!",
      description: "We'll confirm your appointment via WhatsApp shortly.",
    });

    setIsSubmitting(false);
    setStep(3);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      doctor: "",
      date: undefined,
      timeSlot: "",
      reason: "",
    });
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule a consultation with our specialist doctors
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Doctor *</Label>
              <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex flex-col">
                        <span>{doctor.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {doctor.specialty} • {doctor.day}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.phone || !formData.doctor}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 pt-4">
            {selectedDoctor && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="font-medium">{selectedDoctor.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor.specialty} • Available: {selectedDoctor.day}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Preferred Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({ ...formData, date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Preferred Time Slot *</Label>
              <Select value={formData.timeSlot} onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (10 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                  <SelectItem value="evening">Evening (4 PM - 8 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Briefly describe your health concern..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.date || !formData.timeSlot || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Sending..." : "Book Appointment"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Request Sent!</h3>
              <p className="text-muted-foreground mt-2">
                Your appointment request has been sent via WhatsApp. Our team will confirm your appointment shortly.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-sm">
              <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
              <p><strong>Date:</strong> {formData.date && format(formData.date, "PPP")}</p>
              <p><strong>Time:</strong> {formData.timeSlot}</p>
            </div>
            <Button onClick={resetForm} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
