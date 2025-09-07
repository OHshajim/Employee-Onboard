import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ProgressIndicator } from './ProgressIndicator';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { JobDetailsStep } from './steps/JobDetailsStep';
import { SkillsPreferencesStep } from './steps/SkillsPreferencesStep';
import { EmergencyContactStep } from './steps/EmergencyContactStep';
import { ReviewStep } from './steps/ReviewStep';
import {
  personalInfoSchema,
  jobDetailsSchema,
  skillsPreferencesSchema,
  emergencyContactSchema,
  reviewSchema,
  completeFormSchema,
  type CompleteForm,
} from '@/lib/formSchema';

const steps = [
  { id: 1, title: 'Personal', description: 'Basic info', schema: personalInfoSchema },
  { id: 2, title: 'Job Details', description: 'Role & salary', schema: jobDetailsSchema },
  { id: 3, title: 'Skills', description: 'Abilities', schema: skillsPreferencesSchema },
  { id: 4, title: 'Emergency', description: 'Contact info', schema: emergencyContactSchema },
  { id: 5, title: 'Review', description: 'Confirm all', schema: reviewSchema },
];

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();

  const form = useForm<CompleteForm>({
    resolver: zodResolver(completeFormSchema),
    mode: 'onChange',
    defaultValues: {
      primarySkills: [],
      skillExperience: {},
      remoteWorkPreference: 0,
      preferredWorkingHours: { start: '09:00', end: '17:00' },
    },
  });

  const formValues = form.watch();
  useEffect(() => {
    console.log('Form auto-saved:', formValues);
  }, [formValues]);

  const validateCurrentStep = async () => {
    const currentStepData = steps.find(step => step.id === currentStep);
    if (!currentStepData) return false;

    try {
      const formData = form.getValues();
      
      if (currentStep === 4) {
        const dateOfBirth = formData.dateOfBirth;
        const age = dateOfBirth ? new Date().getFullYear() - dateOfBirth.getFullYear() : 0;
        
        if (age < 17) {
          if (!formData.guardianName || !formData.guardianPhoneNumber) {
            form.setError('guardianName', { message: 'Guardian name is required for employees under 21' });
            form.setError('guardianPhoneNumber', { message: 'Guardian phone number is required for employees under 21' });
            return false;
          }
        }
      }

      if (currentStep === 3) {
        if (formData.remoteWorkPreference > 50 && !formData.managerApproved) {
          form.setError('managerApproved', { message: 'Manager approval required for remote work over 50%' });
          return false;
        }
      }

      await currentStepData.schema.parseAsync(formData);
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(prev => prev + 1);
      
      toast({
        title: "Step completed!",
        description: `${steps[currentStep - 1].title} information saved.`,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId - 1)) {
      setCurrentStep(stepId);
    }
  };

  const onSubmit = async (data: CompleteForm) => {
    try {
      console.log('Submitting onboarding data:', data);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Welcome aboard! 🎉",
        description: "Your onboarding information has been successfully submitted.",
      });
      
      form.reset();
      setCurrentStep(1);
      setCompletedSteps([]);
      
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <JobDetailsStep />;
      case 3:
        return <SkillsPreferencesStep />;
      case 4:
        return <EmergencyContactStep />;
      case 5:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container max-w-5xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Employee Onboarding
          </h1>
          <p className="text-muted-foreground">
            Complete your profile to join our team
          </p>
        </div>

        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-xl shadow-medium border p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {renderCurrentStep()}

                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 bg-gradient-primary"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!form.watch('confirmInformation')}
                      className="flex items-center gap-2 bg-gradient-success"
                    >
                      Submit Application
                      <Send className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}