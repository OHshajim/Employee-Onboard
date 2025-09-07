import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { relationships } from '@/data/mockData';

export function EmergencyContactStep() {
  const form = useFormContext();
  
  // Calculate precise age from date of birth
  const dateOfBirth = form.watch('dateOfBirth');
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1;
    }
    return age;
  };
  
  const age = dateOfBirth ? calculateAge(dateOfBirth) : 0;
  const isMinor = age < 21;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Emergency Contact</h2>
        <p className="text-muted-foreground">Provide emergency contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter contact name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-50 bg-popover">
                  {relationships.map((relationship) => (
                    <SelectItem key={relationship} value={relationship}>
                      {relationship}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactPhoneNumber"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Contact Phone Number *</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Guardian Contact for Minors */}
      {isMinor && (
        <div className="bg-warning/5 border border-warning/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <h3 className="text-lg font-medium text-warning-foreground">
              Guardian Contact Required
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Since you are under 21, please provide guardian contact information.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="guardianName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guardian name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guardianPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guardian phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}