# ExpertiseSection Component

## Overview

The ExpertiseSection component provides a comprehensive interface for users to access various property-related services including Legal consultation, Home Inspection, Home Loan applications, and Land leasing services.

## Features

### Services Offered

1. **Legal Consultation** - Expert legal advice for property matters
2. **Taxation (CA/CS)** - Professional tax and compliance guidance
3. **Home Inspection** - Comprehensive property inspection services
4. **Home Loan** - Easy home loan application process
5. **Land Leasing** - Lease your property for development

### Form Fields

Each service form includes:

- Full Name (required)
- Phone Number (required)
- Email Address (required)
- Preferred Time Slot (required)
  - 10 AM - 12 PM
  - 12 PM - 2 PM
  - 2 PM - 4 PM
  - 4 PM - 6 PM
- Consultation Type (required)
  - New Property
  - Old Property
  - Other

### Service-Specific Fields

- **Legal**: Additional Notes (optional)
- **Home Loan**: Loan Requirements (optional)
- **Land Leasing**: Land Details (optional)

## Usage

### Basic Implementation

```jsx
import ExpertiseSection from "@/components/ExpertiseSection";

export default function HomePage() {
  return (
    <div>
      {/* Other components */}
      <ExpertiseSection />
      {/* Other components */}
    </div>
  );
}
```

## API Integration

### Backend Endpoint

- **POST** `/api/inquiries/expertise`
- Handles form submissions for all expertise services
- Stores inquiries in the database with type "EXPERTISE"

### Form Submission Flow

1. User fills out the form
2. Frontend validates required fields
3. Data is sent to backend via `publicAPI.submitExpertiseInquiry()`
4. Backend creates an inquiry record in the database
5. Success/error message is shown to user

## Styling

- Uses Tailwind CSS for styling
- Responsive design with grid layout
- Modal dialogs for form display
- Loading states during form submission
- Green color scheme matching the design

## Dependencies

- React (useState for state management)
- Lucide React (for icons)
- Tailwind CSS (for styling)
- Axios (for API calls via publicAPI)

## Admin Panel Integration

Expertise inquiries appear in the admin panel under the Inquiries section with:

- Type: "EXPERTISE"
- Service-specific subject lines
- All form data included in the message field
- Standard inquiry management features (status updates, responses, etc.)
