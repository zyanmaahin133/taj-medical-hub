import { CheckCircle, Circle, Package, Truck, Home, Clock } from "lucide-react";

interface OrderTrackingProps {
  status: string;
  createdAt: string;
  expectedDelivery?: string;
}

const OrderTracking = ({ status, createdAt, expectedDelivery }: OrderTrackingProps) => {
  const steps = [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "processing", label: "Processing", icon: Clock },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Home },
  ];

  const getStepStatus = (stepKey: string) => {
    const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepKey);
    
    if (status === "cancelled") return "cancelled";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  if (status === "cancelled") {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <Package className="h-5 w-5" />
          <span className="font-medium">Order Cancelled</span>
        </div>
        <p className="text-sm text-red-500 mt-1">This order has been cancelled.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-muted" />
        
        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.key);
            const Icon = step.icon;
            
            return (
              <div key={step.key} className="relative flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    stepStatus === "completed"
                      ? "bg-green-500 border-green-500 text-white"
                      : stepStatus === "current"
                      ? "bg-primary border-primary text-white animate-pulse"
                      : "bg-background border-muted text-muted-foreground"
                  }`}
                >
                  {stepStatus === "completed" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-1">
                  <p
                    className={`font-medium ${
                      stepStatus === "completed" || stepStatus === "current"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.key === "pending" && (
                    <p className="text-sm text-muted-foreground">
                      {new Date(createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                  {step.key === "delivered" && stepStatus !== "completed" && expectedDelivery && (
                    <p className="text-sm text-muted-foreground">
                      Expected by {new Date(expectedDelivery).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                  {step.key === "delivered" && stepStatus === "completed" && (
                    <p className="text-sm text-green-600">
                      Delivered successfully!
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
