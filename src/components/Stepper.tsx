import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2",
                    isComplete &&
                      "bg-[hsl(var(--step-complete))] border-[hsl(var(--step-complete))] text-white",
                    isActive &&
                      "bg-primary border-primary text-primary-foreground shadow-lg scale-110",
                    isUpcoming &&
                      "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Step Title */}
                <span
                  className={cn(
                    "mt-2 text-sm font-medium text-center whitespace-nowrap transition-colors duration-300",
                    isActive && "text-primary font-semibold",
                    isComplete && "text-foreground",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 mb-8 relative">
                  <div className="absolute inset-0 bg-border" />
                  <div
                    className={cn(
                      "absolute inset-0 bg-[hsl(var(--step-complete))] transition-all duration-300",
                      isComplete ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
