# Employee Onboarding System

A comprehensive multi-step employee onboarding form built with React, TypeScript, and modern web technologies.

## 🚀 Features

### Multi-Step Form Flow
- **Step 1**: Personal Information (name, email, phone, DOB, profile picture)
- **Step 2**: Job Details (department, position, salary, manager selection)
- **Step 3**: Skills & Preferences (skills selection, working hours, remote preference)
- **Step 4**: Emergency Contact (contact info, guardian for minors)
- **Step 5**: Review & Submit (comprehensive data review)

### Smart Business Logic
- **Dynamic Validation**: Salary validation changes based on job type (annual vs hourly)
- **Department Filtering**: Manager selection filtered by chosen department
- **Age-Based Requirements**: Guardian contact required for employees under 21
- **Remote Work Approval**: Manager approval checkbox appears when remote preference > 50%
- **Weekend Restrictions**: HR and Finance employees cannot start on weekends
- **Skills by Department**: Available skills filtered by selected department

### User Experience Features
- **Progress Tracking**: Visual step indicator with completion status
- **Auto-Save**: Form state automatically preserved during navigation
- **Step Validation**: Cannot proceed without completing current step
- **Backward Navigation**: Can return to previous steps to make changes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **React Hook Form** - Efficient form management
- **Zod** - Runtime type validation
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Elegant icons
- **date-fns** - Date manipulation utilities

## 🎨 Design System

The application features a professional, corporate design system with:

- **Color Palette**: Professional blues with success greens
- **Typography**: Clean, readable font hierarchy
- **Gradients**: Subtle gradients for visual appeal
- **Shadows**: Elegant drop shadows with depth
- **Animations**: Smooth transitions between states
- **Responsive**: Mobile-first responsive design

## 📦 Installation & Setup

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:8080`

## 🏗️ Architecture & Implementation

### Form Schema Design
The form uses Zod schemas for each step, ensuring type safety and validation:
- Modular validation per step
- Cross-step validation for complex business rules
- Dynamic schema validation based on user input

### State Management
- React Hook Form for efficient form state management
- Controlled components for complex interactions
- Auto-save functionality to prevent data loss

### Component Architecture
```
src/
├── components/onboarding/
│   ├── OnboardingForm.tsx          # Main form orchestrator
│   ├── ProgressIndicator.tsx       # Step progress visualization
│   └── steps/
│       ├── PersonalInfoStep.tsx    # Step 1: Personal information
│       ├── JobDetailsStep.tsx      # Step 2: Job details
│       ├── SkillsPreferencesStep.tsx # Step 3: Skills & preferences
│       ├── EmergencyContactStep.tsx # Step 4: Emergency contact
│       └── ReviewStep.tsx          # Step 5: Review & submit
├── data/
│   └── mockData.ts                 # Mock managers and skills data
└── lib/
    └── formSchema.ts              # Zod validation schemas
```

### Business Logic Implementation

#### Dynamic Salary Validation
```typescript
// Salary ranges change based on job type
Full-time: $30,000 - $200,000 annually
Contract: $50 - $150 per hour
Part-time: $30,000 - $200,000 annually
```

#### Manager Filtering
```typescript
// Managers filtered by department selection
const filteredManagers = department 
  ? mockManagers.filter(m => m.department === department)
  : [];
```

#### Age-Based Guardian Requirements
```typescript
// Guardian contact required for employees under 21
const age = dateOfBirth ? new Date().getFullYear() - dateOfBirth.getFullYear() : 0;
const requiresGuardian = age < 21;
```

#### Weekend Start Date Validation
```typescript
// HR and Finance cannot start on weekends (Friday/Saturday)
if (['HR', 'Finance'].includes(department)) {
  const dayOfWeek = startDate.getDay();
  return dayOfWeek !== 5 && dayOfWeek !== 6;
}
```

## 📊 Mock Data Structure

### Managers (15 total across 5 departments)
```typescript
const mockManagers = [
  { id: 'ENG001', name: 'Alice Johnson', department: 'Engineering' },
  { id: 'MKT001', name: 'Sarah Kim', department: 'Marketing' },
  // ... more managers
];
```

### Skills by Department
```typescript
const skillsByDepartment = {
  Engineering: ['JavaScript', 'TypeScript', 'React', 'Node.js', ...],
  Marketing: ['SEO', 'Content Writing', 'Google Ads', ...],
  Sales: ['CRM Software', 'Lead Generation', ...],
  HR: ['Recruitment', 'Onboarding', ...],
  Finance: ['Budgeting', 'Financial Analysis', ...],
};
```

## 🔄 Form Validation Flow

1. **Step-by-Step Validation**: Each step must be completed before proceeding
2. **Real-Time Feedback**: Immediate validation feedback on field changes
3. **Cross-Step Dependencies**: Later steps can validate against earlier step data
4. **Final Validation**: Complete form validation before submission

## 🎯 Key Features Implemented

### ✅ Required Features
- [x] 5-step multi-step form
- [x] React Hook Form integration
- [x] Zod validation schemas
- [x] shadcn/ui components
- [x] TypeScript implementation
- [x] Smart business logic
- [x] Dynamic field visibility
- [x] Cross-step validation
- [x] Progress indication
- [x] Mobile responsive design

### ✅ Business Logic
- [x] Dynamic salary validation (annual vs hourly)
- [x] Manager filtering by department
- [x] Age-based guardian requirements
- [x] Remote work approval logic
- [x] Weekend start date restrictions
- [x] Skills filtering by department

### ✅ User Experience
- [x] Auto-save form state
- [x] Step navigation (forward/backward)
- [x] Progress visualization
- [x] Validation feedback
- [x] Responsive design
- [x] Accessibility features

## 🚀 Future Enhancements

The application is designed for easy extension with features like:
- Backend API integration
- File upload to cloud storage
- Email notifications
- Analytics tracking
- Multi-language support
- Advanced validation rules

## 📝 Development Notes

### Assumptions Made
1. Phone numbers follow US format (+1-123-456-7890)
2. Date of birth validation assumes current year calculation
3. File uploads are client-side only (no backend storage)
4. Form submission simulates API call with 2-second delay
5. Mock data represents realistic employee hierarchy

### Code Quality Practices
- TypeScript strict mode enabled
- Consistent component patterns
- Reusable utility functions
- Accessible form components
- Responsive design patterns
- Clean separation of concerns

---

Built with ❤️ using modern React development practices and enterprise-grade UI components.