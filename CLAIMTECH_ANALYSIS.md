# Claimtech Multitenant - Onboarding Flow & Dashboard Analysis

This document provides a comprehensive analysis of the claimtech-multitenant application's onboarding flow and dashboard design to serve as a reference for building similar features in debtfly.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Onboarding Flow](#onboarding-flow)
4. [Dashboard Design](#dashboard-design)
5. [Key Patterns & Best Practices](#key-patterns--best-practices)
6. [Component Structure](#component-structure)

---

## Project Overview

**Tech Stack:**
- **Framework:** Vite + React 19
- **UI Library:** Chakra UI
- **Routing:** React Router v7
- **State Management:** React Query (@tanstack/react-query)
- **HTTP Client:** Axios
- **Styling:** Emotion (via Chakra)
- **Icons:** Lucide React, Heroicons
- **TypeScript:** Yes

**Directory Structure:**
```
src/
├── api/
│   ├── index.ts (axios configuration)
│   └── services/
│       ├── onboarding/ (onboarding API calls)
│       └── dashboard/ (dashboard API calls)
├── components/
│   ├── Onboarding/
│   ├── Dashboard/
│   └── Login/
├── pages/ (page-level components)
├── layouts/ (layout wrappers)
├── hooks/ (custom hooks)
├── utils/ (utility functions)
├── contexts/ (React contexts)
└── types/ (TypeScript types)
```

---

## Architecture

### 1. Routing Structure

**Router Configuration** (`src/router.tsx`):
```
/ (Root)
├── / → LenderSelection (onboarding start)
├── /pcp → Landing Page
├── /auth/
│   ├── login
│   ├── userdetails
│   ├── addresssearch
│   ├── contactdetails
│   ├── signature
│   ├── searching (processing)
│   ├── otpverify
│   ├── missingagreements
│   └── emailsuccessful
├── /dashboard/ (protected by AuthGuard)
│   ├── / (main dashboard)
│   ├── profile
│   ├── documentupload
│   ├── refer
│   └── howitworks
└── /magic-login (magic link handler)
```

### 2. Layouts

**Three Main Layouts:**

1. **RootLayout** - Base layout for all pages
2. **AuthLayout** - Minimal wrapper for auth/onboarding pages
3. **DashboardLayout** - Wrapper for dashboard pages (with AuthGuard)

### 3. Authentication Guard

```typescript
// Protects dashboard routes
// Redirects to /auth/login if no access_token
// Redirects to /dashboard if on login page with valid token
<AuthGuard requireAuth={true}>
  <DashboardLayout />
</AuthGuard>
```

---

## Onboarding Flow

### Step-by-Step Flow

#### **Step 1: Lender Selection** (`/`)

**Purpose:** User selects lenders they've had finance with (2007-2021)

**Key Features:**
- Fetches lenders from API (`getLenders()`)
- Displays main lenders (priority=10) and additional lenders (priority=0)
- Expandable "View more lenders" section
- Can skip this step
- Saves selection to localStorage
- Network error handling with maintenance image
- Validates UUID format of lender IDs
- Auto-saves on selection change

**UI Components:**
- Header (logo, navigation)
- ProgressBar (1/4)
- Lender cards with checkboxes
- Skip button (top-right)
- Next button
- Trustpilot rating
- Footer

**State Management:**
```typescript
const [selectedLenders, setSelectedLenders] = useState<string[]>([]);
const [lenders, setLenders] = useState<LenderGroup[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**Local Storage:**
```typescript
saveLenderSelection({ selectedLenders });
```

---

#### **Step 2: User Details** (`/auth/userdetails`)

**Purpose:** Collect user's name and date of birth

**Key Features:**
- First name, last name, DOB (DD/MM/YYYY)
- Real-time validation
- Auto-focus between date fields
- Enter key to submit
- Backspace navigation in date fields
- Age validation (must be 18+)
- Auto-save with debounce (2 seconds)
- OnboardingStartGuard (prevents direct access)

**Validation Rules:**
```typescript
- First name: required
- Last name: required
- DOB: required, valid date, 18+ years old
```

**UI Components:**
- ProgressBar (2/4)
- Form inputs with error states
- Next button
- Trustpilot rating

**State Management:**
```typescript
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [dob, setDob] = useState({ day: '', month: '', year: '' });
const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; dob?: string }>({});
```

**Custom Hook:**
```typescript
useAutoSave(data, saveFunction, debounceMs);
```

---

#### **Step 3: Address Search** (`/auth/addresssearch`)

**Purpose:** Find user's current address via postcode lookup

**Key Features:**
- UK postcode validation
- API integration (CheckIO for address lookup)
- Dropdown address selection
- Preview selected address
- Enter key on postcode triggers find
- Loading state during search

**Flow:**
1. User enters postcode
2. Clicks "Find" or presses Enter
3. API returns addresses
4. User selects from dropdown
5. Confirmation box shows selected address
6. Next step

**UI Components:**
- ProgressBar (3/4)
- Postcode input + Find button
- Address dropdown (collapsible)
- Selected address preview box
- Next button

**State Management:**
```typescript
const [postcode, setPostcode] = useState('');
const [addresses, setAddresses] = useState<FormattedAddress[]>([]);
const [selectedId, setSelectedId] = useState<number | null>(null);
const [openDropdown, setOpenDropdown] = useState(false);
```

---

#### **Step 4: Contact Details** (`/auth/contactdetails`)

**Purpose:** Collect email and phone number

**Key Features:**
- Email validation
- Phone number validation (UK format)
- Real-time validation
- Auto-save functionality

---

#### **Step 5: Signature** (`/auth/signature`)

**Purpose:** Collect user's signature for agreement

**Key Features:**
- Canvas-based signature capture
- Clear/redo functionality
- Signature validation (must draw)
- Mobile-responsive

---

#### **Step 6: Searching** (`/auth/searching`)

**Purpose:** Processing step while backend searches for agreements

**Key Features:**
- Loading animation
- Progress indicators
- Status updates
- Auto-redirect on completion

---

#### **Step 7: OTP Verification** (`/auth/otpverify`)

**Purpose:** Verify email via OTP code

**Key Features:**
- 6-digit code input
- Auto-focus between fields
- Resend code functionality
- Timer countdown

---

#### **Step 8: Missing Agreements** (`/auth/missingagreements`)

**Purpose:** Allow user to add agreements not found automatically

**Key Features:**
- Manual agreement entry
- Optional step
- Can skip

---

### Onboarding Common Components

**Located in:** `src/components/Onboarding/Common/`

1. **Header** - Logo and brand
2. **Footer** - Links and legal
3. **ProgressBar** - Step indicator (1/4, 2/4, etc.)
4. **NextButton** - Primary CTA button
5. **Trustpilot** - Trust badge
6. **CustomButton** - Reusable button component
7. **Loader** - Loading spinner
8. **ErrorMessage** - Error display
9. **SuccessMessage** - Success display
10. **WarningMessage** - Warning display
11. **SecureBar** - Security indicators
12. **Claimupto** - Claim amount display

---

## Dashboard Design

### Main Dashboard (`/dashboard`)

**Layout:**
```
┌─────────────────────────────────────┐
│           Header                    │
│  (Logo, Navigation, User Menu)      │
├─────────────────────────────────────┤
│  Your dashboard                     │
├─────────────────────────────────────┤
│  How It Works Banner                │
├─────────────────────────────────────┤
│  Action Required Banner             │
│  (if ID not uploaded)               │
├─────────────────────────────────────┤
│  Everything We Need                 │
│  (completion status)                │
├─────────────────────────────────────┤
│  Open Claims                        │
│  ├─ Claim Card 1                    │
│  │  ├─ Lender Name                  │
│  │  ├─ Status Badge                 │
│  │  ├─ Progress Bar                 │
│  │  ├─ Agreements List              │
│  │  └─ Action Buttons               │
│  ├─ Claim Card 2                    │
│  └─ ...                             │
└─────────────────────────────────────┘
```

### Key Dashboard Components

#### 1. **Header** (`components/Dashboard/Main/Header.tsx`)
- Logo
- Navigation links
- User profile dropdown
- Mobile responsive hamburger menu

#### 2. **ActionRequiredBanner**
- Alerts user to upload ID document
- Prominent red badge
- CTA button

#### 3. **EverythingWeNeed**
- Shows onboarding completion status
- Checkmarks for completed steps
- Missing items highlighted

#### 4. **OpenClaims**
- Container for all claim cards
- Fetches claims via React Query
- Loading skeletons
- Empty state

#### 5. **ClaimCard** (Most Complex Component)

**Props:**
```typescript
interface ClaimCardProps {
  lender: string;
  stage: string;
  progress: number;
  onUploadId(): void;
  onProvideDetails(): void;
  id: string;
  hasAdditionalRequirements?: boolean;
  agreements?: any[];
  agreementsLoading?: boolean;
  isRealTimeUpdating?: boolean;
}
```

**Features:**
- Collapsible agreements list
- Real-time update indicator (pulsing green dot)
- Status badges for each agreement
- Action required badge (top-right)
- Progress visualization
- Multiple modals (Agreement Details, Additional Info, Evidence)

**States:**
1. **No Agreements** - Big attention box with CTA
2. **Has Agreements (non-credit)** - Small "+ Add another" button
3. **Has Credit Agreements** - No add button
4. **Additional Requirements** - Action required section

**Agreement Card:**
```
┌─────────────────────────────────┐
│  #AGREEMENT123   │  [Status]    │
│  Reg: ABC123     │              │
└─────────────────────────────────┘
```

#### 6. **ClaimProgress**
- Visual progress indicator
- Shows stages of claim process
- Animated transitions

#### 7. **Modals**

Located in: `components/Dashboard/Main/Modals/`

1. **AgreementModal** - Add/edit agreement details
2. **IdDocumentModal** - Upload ID document
3. **SignatureModal** - Re-sign documents
4. **PreviousAddressModal** - Add previous addresses
5. **PreviousNameModal** - Add previous names
6. **RequirementInfoModal** - View additional requirements
7. **EvidenceUploadModal** - Upload supporting evidence
8. **EvidenceViewModal** - View uploaded evidence
9. **EvidenceDeleteModal** - Delete evidence

#### 8. **EvidenceList** (`components/Dashboard/Main/EvidenceList.tsx`)

**Features:**
- Displays evidence documents per claim
- Upload, view, delete actions
- File type icons
- Date uploaded
- Integration with React Query for caching

---

## Key Patterns & Best Practices

### 1. **State Management Patterns**

#### Local Storage Pattern
```typescript
// Save to localStorage
saveUserDetails({ firstName, lastName, dob });

// Load from localStorage
const savedDetails = getUserDetails();

// Clear on completion
clearOnboardingData();
```

#### React Query Pattern
```typescript
const { data: claims, isLoading } = useQuery({
  queryKey: ['claims'],
  queryFn: getClaims,
  refetchInterval: 30000, // Real-time updates every 30s
});
```

### 2. **Form Validation Pattern**

```typescript
const [errors, setErrors] = useState<ErrorObject>({});

const validate = () => {
  const newErrors: ErrorObject = {};
  
  if (!field) {
    newErrors.field = 'Field is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (!validate()) return;
  // Proceed
};
```

### 3. **Auto-save Pattern**

```typescript
// Custom hook
useAutoSave(data, saveFunction, debounceMs);

// Implementation
useEffect(() => {
  const timer = setTimeout(() => {
    saveFunction(data);
  }, debounceMs);
  
  return () => clearTimeout(timer);
}, [data]);
```

### 4. **Navigation Guards**

```typescript
// Prevent direct access to later steps
const useOnboardingStartGuard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const hasCompletedStep1 = getLenderSelection();
    if (!hasCompletedStep1) {
      navigate('/');
    }
  }, []);
};
```

### 5. **Error Handling Pattern**

```typescript
try {
  const response = await apiCall();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  
  // Network error
  if (isNetworkError(error)) {
    setError('Network connection issue');
    setShowMaintenancePage(true);
  }
  
  // API error
  else if (error.response?.data?.error) {
    setError(error.response.data.error);
  }
  
  // Generic error
  else {
    setError('Something went wrong');
  }
}
```

### 6. **Loading States**

```typescript
// Skeleton loading
{isLoading ? (
  <ClaimCardSkeleton />
) : (
  <ClaimCard {...props} />
)}

// Spinner loading
{loading && <Spinner color={config.accentColor} />}
```

### 7. **Responsive Design**

```typescript
// Chakra UI responsive props
fontSize={{ base: "xl", md: "2xl" }}
px={{ base: 4, sm: 6, lg: 8 }}
spacing={{ base: 4, md: 6 }}
```

### 8. **Tenant Context Pattern**

```typescript
const { config } = useTenant();

// Access theme colors
<Button bg={config.accentColor} />
<Box borderColor={config.accentLightColor} />
```

### 9. **Modal Management**

```typescript
const [isModalOpen, setIsModalOpen] = useState(false);

// Chakra UI disclosure hook
const { isOpen, onOpen, onClose } = useDisclosure();
```

### 10. **Real-time Updates**

```typescript
// React Query with refetch interval
useQuery({
  queryKey: ['claims'],
  queryFn: getClaims,
  refetchInterval: 30000, // 30 seconds
  refetchOnWindowFocus: true,
});
```

---

## Component Structure

### Common Component Anatomy

```typescript
import React, { useState, useEffect } from 'react';
import { Box, Container, VStack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';
import { useTenant } from '../../../contexts/TenantContext';

const ComponentName: React.FC = () => {
  // Hooks
  const navigate = useNavigate();
  const { config } = useTenant();
  
  // State
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effects
  useEffect(() => {
    // Load saved data
    const saved = getSavedData();
    if (saved) setData(saved);
  }, []);
  
  // Handlers
  const handleNext = () => {
    if (!validate()) return;
    saveData(data);
    navigate('/next-step');
  };
  
  // Render
  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="3xl" pt={2} pb={6} px={6}>
        <VStack spacing={6}>
          {/* Content */}
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
};

export default ComponentName;
```

### Styling Patterns

#### Chakra UI Props
```typescript
// Box styling
<Box
  border="2px solid"
  borderColor="#E2E8F0"
  borderRadius="2xl"
  p={6}
  bg="white"
  _hover={{ bg: '#F7FAFC' }}
  transition="all 0.2s"
/>

// Button styling
<Button
  bg={config.primaryColor}
  color="black"
  borderRadius="full"
  h="56px"
  fontWeight="bold"
  _hover={{ bg: `${config.primaryColor}CC` }}
  _active={{ transform: "scale(0.98)" }}
/>
```

#### Color Scheme
```typescript
// Primary colors from tenant config
config.accentColor        // Main brand color (purple)
config.accentLightColor   // Light version (pale purple)
config.primaryColor       // CTA color (yellow/gold)
config.primaryLightColor  // Light version
config.completedColor     // Success green
config.inactiveColor      // Gray

// Chakra colors
gray.50, gray.100, ..., gray.900
red.400, red.500
green.400, green.700
blue.100, blue.700
```

---

## API Integration

### Service Structure

```typescript
// api/services/onboarding/login.ts
import api from '../../index';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: string;
}

export const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post('/api/v1/auth/login/', loginData);
    
    const { access, refresh, user_id } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_id', user_id);
    
    return response.data;
  } catch (error) {
    console.error('Failed to login:', error);
    throw error;
  }
};
```

### React Query Integration

```typescript
// hooks/queries/useClaims.ts
import { useQuery } from '@tanstack/react-query';
import { getClaims } from '../../api/services/dashboard/getClaims';

export const useClaims = () => {
  return useQuery({
    queryKey: ['claims'],
    queryFn: getClaims,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

// Usage in component
const { data: claims, isLoading, error } = useClaims();
```

---

## Summary & Recommendations for Debtfly

### Key Takeaways

1. **Multi-step Onboarding Flow**
   - Clear progression (1/4, 2/4, etc.)
   - Auto-save at each step
   - Navigation guards
   - Skip options where appropriate

2. **Dashboard Design**
   - Card-based layout
   - Real-time updates via polling
   - Clear action items
   - Modal-based interactions

3. **State Management**
   - localStorage for onboarding
   - React Query for server state
   - Local state for UI

4. **UX Patterns**
   - Loading skeletons
   - Error handling with retry
   - Responsive design
   - Auto-focus and keyboard navigation

5. **Code Organization**
   - Service layer for API
   - Custom hooks for logic
   - Reusable components
   - Type-safe with TypeScript

### Implementation Priorities for Debtfly

**Phase 1: Foundation**
- [ ] Set up routing structure
- [ ] Implement authentication flow
- [ ] Create layout components
- [ ] Set up React Query

**Phase 2: Onboarding**
- [ ] Build onboarding steps
- [ ] Implement form validation
- [ ] Add auto-save functionality
- [ ] Create progress indicators

**Phase 3: Dashboard**
- [ ] Build dashboard layout
- [ ] Create claim cards
- [ ] Implement modals
- [ ] Add real-time updates

**Phase 4: Polish**
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Optimize for mobile
- [ ] Add animations

---

## File References

### Key Files to Study

1. **Routing:** `src/router.tsx`
2. **Axios Setup:** `src/api/index.ts`
3. **Onboarding Steps:**
   - `src/components/Onboarding/LenderSelection/index.tsx`
   - `src/components/Onboarding/UserDetails/index.tsx`
   - `src/components/Onboarding/AddressSearch/index.tsx`
4. **Dashboard:**
   - `src/pages/Dashboard.tsx`
   - `src/components/Dashboard/Main/ClaimCard.tsx`
   - `src/components/Dashboard/Main/OpenClaims.tsx`
5. **Auth:**
   - `src/components/AuthGuard.tsx`
   - `src/api/services/onboarding/login.ts`
6. **Hooks:**
   - `src/hooks/useAutoSave.ts`
   - `src/hooks/useOnboardingStartGuard.ts`

---

*This document serves as a comprehensive reference for understanding the claimtech-multitenant architecture and can be used as a blueprint for building similar features in debtfly.*



