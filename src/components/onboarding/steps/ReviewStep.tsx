import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar, Check, Mail, Phone, User, Building, Clock, MapPin, Star } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockManagers } from '@/data/mockData';

export function ReviewStep() {
  const form = useFormContext();
  const formData = form.getValues();

  const selectedManager = mockManagers.find(m => m.id === formData.managerId);
  const dateOfBirth = formData.dateOfBirth;
  const age = dateOfBirth ? new Date().getFullYear() - dateOfBirth.getFullYear() : 0;

  const InfoCard = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon }) => (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );

  const InfoRow = ({ label, value }: { label: string; value: string | number | React.ReactNode }) => (
    <div className="flex justify-between items-start">
      <span className="text-muted-foreground text-sm font-medium">{label}:</span>
      <span className="text-foreground text-sm font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Review & Submit</h2>
        <p className="text-muted-foreground">Please review all information before submitting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <InfoCard title="Personal Information" icon={User}>
          <InfoRow label="Full Name" value={formData.fullName || 'Not provided'} />
          <InfoRow label="Email" value={formData.email || 'Not provided'} />
          <InfoRow label="Phone" value={formData.phoneNumber || 'Not provided'} />
          <InfoRow 
            label="Date of Birth" 
            value={dateOfBirth ? `${format(dateOfBirth, 'PPP')} (Age: ${age})` : 'Not provided'} 
          />
          <InfoRow 
            label="Profile Picture" 
            value={formData.profilePicture ? 'Uploaded' : 'Not uploaded'} 
          />
        </InfoCard>

        {/* Job Details */}
        <InfoCard title="Job Details" icon={Building}>
          <InfoRow label="Department" value={formData.department || 'Not selected'} />
          <InfoRow label="Position" value={formData.positionTitle || 'Not provided'} />
          <InfoRow 
            label="Start Date" 
            value={formData.startDate ? format(formData.startDate, 'PPP') : 'Not selected'} 
          />
          <InfoRow label="Job Type" value={formData.jobType || 'Not selected'} />
          <InfoRow 
            label="Salary" 
            value={formData.salaryExpectation ? 
              `$${formData.salaryExpectation.toLocaleString()}${formData.jobType === 'Contract' ? '/hour' : '/year'}` : 
              'Not provided'
            } 
          />
          <InfoRow label="Manager" value={selectedManager?.name || 'Not selected'} />
        </InfoCard>

        {/* Skills & Preferences */}
        <InfoCard title="Skills & Preferences" icon={Star}>
          <div className="space-y-3">
            <div>
              <span className="text-muted-foreground text-sm font-medium">Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(formData.primarySkills || []).map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill} ({formData.skillExperience?.[skill] || 0}y)
                  </Badge>
                ))}
              </div>
            </div>
            <InfoRow 
              label="Working Hours" 
              value={formData.preferredWorkingHours ? 
                `${formData.preferredWorkingHours.start} - ${formData.preferredWorkingHours.end}` : 
                'Not set'
              } 
            />
            <InfoRow 
              label="Remote Work" 
              value={`${formData.remoteWorkPreference || 0}%`} 
            />
            {formData.managerApproved && (
              <div className="bg-success/10 p-2 rounded flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-success text-sm">Manager approved for remote work</span>
              </div>
            )}
            {formData.extraNotes && (
              <div>
                <span className="text-muted-foreground text-sm font-medium">Notes:</span>
                <p className="text-sm mt-1 text-foreground">{formData.extraNotes}</p>
              </div>
            )}
          </div>
        </InfoCard>

        {/* Emergency Contact */}
        <InfoCard title="Emergency Contact" icon={Phone}>
          <InfoRow label="Contact Name" value={formData.contactName || 'Not provided'} />
          <InfoRow label="Relationship" value={formData.relationship || 'Not selected'} />
          <InfoRow label="Phone" value={formData.contactPhoneNumber || 'Not provided'} />
          
          {age < 21 && (
            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium text-warning mb-2">Guardian Contact</h4>
              <InfoRow label="Guardian Name" value={formData.guardianName || 'Not provided'} />
              <InfoRow label="Guardian Phone" value={formData.guardianPhoneNumber || 'Not provided'} />
            </div>
          )}
        </InfoCard>
      </div>

      {/* Confirmation */}
      <FormField
        control={form.control}
        name="confirmInformation"
        render={({ field }) => (
          <FormItem className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="confirm"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-1"
              />
              <div>
                <FormLabel htmlFor="confirm" className="text-base font-medium cursor-pointer">
                  I confirm that all the information provided is accurate and complete
                </FormLabel>
                <p className="text-sm text-muted-foreground mt-1">
                  By checking this box, you acknowledge that the information above is correct and you're ready to submit your onboarding application.
                </p>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}