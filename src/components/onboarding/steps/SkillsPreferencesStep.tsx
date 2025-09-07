import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { skillsByDepartment, type Department } from '@/data/mockData';

export function SkillsPreferencesStep() {
  const form = useFormContext();
  const watchedDepartment = form.watch('department') as Department;
  const watchedSkills = form.watch('primarySkills') || [];
  const watchedRemotePreference = form.watch('remoteWorkPreference') || 0;
  const [skillExperience, setSkillExperience] = useState<Record<string, number>>({});

  const availableSkills = watchedDepartment ? skillsByDepartment[watchedDepartment] : [];

  // Update skill experience when skills change
  useEffect(() => {
    const newSkillExperience: Record<string, number> = {};
    watchedSkills.forEach((skill: string) => {
      newSkillExperience[skill] = skillExperience[skill] || 0;
    });
    setSkillExperience(newSkillExperience);
    form.setValue('skillExperience', newSkillExperience);
  }, [watchedSkills]);

  const handleSkillToggle = (skill: string, checked: boolean) => {
    const currentSkills = form.getValues('primarySkills') || [];
    if (checked) {
      form.setValue('primarySkills', [...currentSkills, skill]);
    } else {
      form.setValue('primarySkills', currentSkills.filter((s: string) => s !== skill));
      const newExp = { ...skillExperience };
      delete newExp[skill];
      setSkillExperience(newExp);
      form.setValue('skillExperience', newExp);
    }
  };

  const handleExperienceChange = (skill: string, value: number) => {
    const newExp = { ...skillExperience, [skill]: value };
    setSkillExperience(newExp);
    form.setValue('skillExperience', newExp);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Skills & Preferences</h2>
        <p className="text-muted-foreground">Tell us about your skills and work preferences</p>
      </div>

      <FormField
        control={form.control}
        name="primarySkills"
        render={() => (
          <FormItem>
            <FormLabel>Primary Skills * (Select at least 3)</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSkills.map((skill) => {
                const isChecked = watchedSkills.includes(skill);
                return (
                  <div key={skill} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleSkillToggle(skill, checked as boolean)}
                      />
                      <label htmlFor={skill} className="text-sm font-medium cursor-pointer">
                        {skill}
                      </label>
                    </div>
                    
                    {isChecked && (
                      <div className="ml-6 space-y-1">
                        <label className="text-xs text-muted-foreground">
                          Years of experience: {skillExperience[skill] || 0}
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          value={skillExperience[skill] || 0}
                          onChange={(e) => handleExperienceChange(skill, Number(e.target.value))}
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="preferredWorkingHours.start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Start Time *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredWorkingHours.end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred End Time *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="remoteWorkPreference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Remote Work Preference: {watchedRemotePreference}%</FormLabel>
            <FormControl>
              <div className="px-4">
                <Slider
                  min={0}
                  max={100}
                  step={10}
                  value={[field.value || 0]}
                  onValueChange={(values) => field.onChange(values[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0% (Office)</span>
                  <span>50%</span>
                  <span>100% (Remote)</span>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchedRemotePreference > 50 && (
        <FormField
          control={form.control}
          name="managerApproved"
          render={({ field }) => (
            <FormItem className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="managerApproved"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel htmlFor="managerApproved" className="text-sm cursor-pointer">
                  Manager has approved remote work over 50%
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="extraNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any additional information you'd like to share..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <div className="text-xs text-muted-foreground">
              {(field.value || '').length}/500 characters
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}