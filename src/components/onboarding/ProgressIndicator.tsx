import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function ProgressIndicator({ steps, currentStep, completedSteps }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = step.id > currentStep;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                    {
                      "bg-gradient-primary text-white shadow-medium": isCurrent,
                      "bg-gradient-success text-white shadow-soft": isCompleted,
                      "bg-secondary text-muted-foreground": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                
                {/* Step Info */}
                <div className="mt-3 text-center max-w-24">
                  <div
                    className={cn(
                      "text-sm font-medium transition-colors",
                      {
                        "text-primary": isCurrent,
                        "text-success": isCompleted,
                        "text-muted-foreground": isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-300 min-w-16",
                    {
                      "bg-gradient-to-r from-success to-success": isCompleted,
                      "bg-gradient-to-r from-primary to-primary-glow": isCurrent,
                      "bg-border": isUpcoming,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}